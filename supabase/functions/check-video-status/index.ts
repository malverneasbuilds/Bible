import { createClient } from 'jsr:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
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

    if (error) {
      throw error;
    }

    if (!video) {
      return new Response(
        JSON.stringify({
          success: true,
          status: 'not_found',
          message: 'No video found for this chapter',
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (video.status === 'generating' && video.veo_task_id) {
      const googleApiKey = Deno.env.get('GOOGLE_API_KEY');
      if (googleApiKey) {
        try {
          const { GoogleGenAI } = await import('npm:@google/generative-ai@0.21.0');
          const ai = new GoogleGenAI({ apiKey: googleApiKey });

          // Check operation status
          const operation = await ai.operations.getVideosOperation({
            operation: { name: video.veo_task_id },
          });

          if (operation.done) {
            if (operation.response?.generatedVideos?.[0]?.video) {
              // Video is ready, get the file URL
              const videoFile = operation.response.generatedVideos[0].video;

              // Note: In production, you would download this file and upload to your own storage
              // For now, we'll store the file reference
              const { error: updateError } = await supabase
                .from('chapter_videos')
                .update({
                  status: 'completed',
                  video_url: videoFile.uri || null,
                  duration_seconds: 10,
                })
                .eq('id', video.id);

              if (!updateError) {
                video.status = 'completed';
                video.video_url = videoFile.uri;
                video.duration_seconds = 10;
              }
            } else if (operation.error) {
              await supabase
                .from('chapter_videos')
                .update({
                  status: 'failed',
                  error_message: operation.error.message || 'Video generation failed',
                })
                .eq('id', video.id);

              video.status = 'failed';
              video.error_message = operation.error.message || 'Video generation failed';
            }
          }
        } catch (veoError) {
          console.error('Error checking Veo status:', veoError);
        }
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        video: video,
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
