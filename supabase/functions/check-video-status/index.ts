import { createClient } from 'jsr:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

const log = (stage: string, msg: string, data?: any) => {
  const time = new Date().toISOString();
  console.log(`[${time}] [${stage}] ${msg}`, data ? JSON.stringify(data, null, 2) : '');
};

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    log('INIT', 'Incoming request', { url: req.url });

    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    const googleApiKey = Deno.env.get('GOOGLE_API_KEY');

    if (!supabaseUrl || !supabaseKey) throw new Error('Missing Supabase credentials');
    if (!googleApiKey) throw new Error('Missing GOOGLE_API_KEY');

    const supabase = createClient(supabaseUrl, supabaseKey);
    const url = new URL(req.url);
    const bookNumber = parseInt(url.searchParams.get('bookNumber') || '0');
    const chapter = parseInt(url.searchParams.get('chapter') || '0');

    log('PARAMS', 'Received query params', { bookNumber, chapter });

    if (!bookNumber || !chapter) {
      throw new Error('bookNumber and chapter are required');
    }

    const { data: video, error } = await supabase
      .from('chapter_videos')
      .select('*')
      .eq('book_number', bookNumber)
      .eq('chapter', chapter)
      .maybeSingle();

    if (error) throw error;
    log('SUPABASE', 'Fetched existing video record', video);

    const { GoogleGenAI } = await import('npm:@google/generative-ai@0.21.0');
    const ai = new GoogleGenAI({ apiKey: googleApiKey });

    // CASE 1: No video exists → generate new
    if (!video) {
      log('GENERATION', 'No existing video found, starting new generation');

      const prompt = `
      A cinematic, historically accurate depiction of Bible Book ${bookNumber} Chapter ${chapter}.
      Focus on emotion, accuracy, and lighting — stay true to the Bible story.
      Example: if this is David and Goliath, the stone must hit Goliath's forehead.
      `;

      let operation;
      try {
        operation = await ai.models.generateVideos({
          model: 'veo-3.0-generate-001',
          prompt,
        });
        log('VEO', 'Started video generation', operation);
      } catch (genError) {
        log('ERROR', 'Error starting Veo generation', genError);
        throw new Error(`Veo generation failed to start: ${genError.message}`);
      }

      if (!operation?.name) throw new Error('Veo did not return a valid operation name.');

      const { data: newVideo, error: insertError } = await supabase
        .from('chapter_videos')
        .insert({
          book_number: bookNumber,
          chapter,
          status: 'generating',
          veo_task_id: operation.name,
        })
        .select()
        .maybeSingle();

      if (insertError) {
        log('SUPABASE', 'Insert error', insertError);
        throw insertError;
      }

      log('SUPABASE', 'Inserted new video record', newVideo);

      return new Response(
        JSON.stringify({
          success: true,
          status: 'started',
          veo_task_id: operation.name,
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // CASE 2: Poll existing operation
    if (video.status === 'generating' && video.veo_task_id) {
      log('VEO', 'Checking Veo operation status', { veo_task_id: video.veo_task_id });

      let operation;
      try {
        operation = await ai.operations.getVideosOperation({
          operation: { name: video.veo_task_id },
        });
        log('VEO', 'Fetched operation status', operation);
      } catch (checkError) {
        log('ERROR', 'Error fetching Veo operation', checkError);
        throw new Error(`Veo operation check failed: ${checkError.message}`);
      }

      if (!operation.done) {
        log('VEO', 'Video still generating');
        return new Response(
          JSON.stringify({
            success: true,
            status: 'in_progress',
            message: 'Video still generating, please check later.',
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      if (operation.response?.generatedVideos?.[0]?.video) {
        const videoFile = operation.response.generatedVideos[0].video;
        log('VEO', 'Video generation completed', { uri: videoFile.uri });

        const { error: updateError } = await supabase
          .from('chapter_videos')
          .update({
            status: 'completed',
            video_url: videoFile.uri,
            duration_seconds: 10,
          })
          .eq('id', video.id);

        if (updateError) {
          log('SUPABASE', 'Error updating completed video', updateError);
          throw updateError;
        }

        log('SUPABASE', 'Updated video to completed');

        return new Response(
          JSON.stringify({
            success: true,
            status: 'completed',
            video_url: videoFile.uri,
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      if (operation.error) {
        log('VEO', 'Video generation failed', operation.error);
        await supabase
          .from('chapter_videos')
          .update({
            status: 'failed',
            error_message: operation.error.message,
          })
          .eq('id', video.id);

        throw new Error(operation.error.message);
      }
    }

    // CASE 3: Completed
    if (video.status === 'completed') {
      log('SUCCESS', 'Video already completed', video.video_url);
      return new Response(
        JSON.stringify({
          success: true,
          status: 'completed',
          video,
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    log('END', 'Returning fallback response');
    return new Response(
      JSON.stringify({
        success: true,
        status: video.status || 'unknown',
        video,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    log('FATAL', 'Unhandled error', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
