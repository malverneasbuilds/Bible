import { createClient } from 'jsr:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const googleApiKey = Deno.env.get('GOOGLE_API_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const url = new URL(req.url);
    const bookNumber = parseInt(url.searchParams.get('bookNumber') || '0');
    const chapter = parseInt(url.searchParams.get('chapter') || '0');

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

    const { GoogleGenAI } = await import('npm:@google/generative-ai@0.21.0');
    const ai = new GoogleGenAI({ apiKey: googleApiKey });

    // If video doesn't exist, start generation
    if (!video) {
      const prompt = `A cinematic scene illustrating ${bookNumber} chapter ${chapter} from the Bible. 
      Keep the visuals historically accurate and reverent.`;

      console.log("Starting Veo video generation...");
      let operation = await ai.models.generateVideos({
        model: "veo-3.0-generate-001",
        prompt,
      });

      // Save initial record with status “generating”
      const { data: newVideo, error: insertError } = await supabase
        .from('chapter_videos')
        .insert({
          book_number: bookNumber,
          chapter,
          status: 'generating',
          veo_task_id: operation.name, // important!
        })
        .select()
        .maybeSingle();

      if (insertError) throw insertError;

      return new Response(
        JSON.stringify({
          success: true,
          status: 'started',
          message: 'Video generation started',
          veo_task_id: operation.name,
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // If already generating, poll for completion
    if (video.status === 'generating' && video.veo_task_id) {
      console.log('Checking Veo operation status...');
      let operation = await ai.operations.getVideosOperation({
        operation: { name: video.veo_task_id },
      });

      if (!operation.done) {
        return new Response(
          JSON.stringify({
            success: true,
            status: 'in_progress',
            message: 'Video still generating',
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // When done, check result
      if (operation.response?.generatedVideos?.[0]?.video) {
        const videoFile = operation.response.generatedVideos[0].video;

        const { error: updateError } = await supabase
          .from('chapter_videos')
          .update({
            status: 'completed',
            video_url: videoFile.uri,
            duration_seconds: 10,
          })
          .eq('id', video.id);

        if (updateError) throw updateError;

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

    // If video exists and completed
    return new Response(
      JSON.stringify({
        success: true,
        video,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
