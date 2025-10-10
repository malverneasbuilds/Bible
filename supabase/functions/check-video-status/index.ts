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
      const veoApiKey = Deno.env.get('VEO_API_KEY');
      if (veoApiKey) {
        try {
          const veoStatusResponse = await fetch(
            `https://api.veo.video/v1/tasks/${video.veo_task_id}`,
            {
              headers: {
                'Authorization': `Bearer ${veoApiKey}`,
              },
            }
          );

          if (veoStatusResponse.ok) {
            const veoStatus = await veoStatusResponse.json();
            
            if (veoStatus.status === 'completed' && veoStatus.video_url) {
              const { error: updateError } = await supabase
                .from('chapter_videos')
                .update({
                  status: 'completed',
                  video_url: veoStatus.video_url,
                  duration_seconds: veoStatus.duration || video.duration_seconds,
                })
                .eq('id', video.id);

              if (!updateError) {
                video.status = 'completed';
                video.video_url = veoStatus.video_url;
                video.duration_seconds = veoStatus.duration || video.duration_seconds;
              }
            } else if (veoStatus.status === 'failed') {
              await supabase
                .from('chapter_videos')
                .update({
                  status: 'failed',
                  error_message: veoStatus.error || 'Video generation failed',
                })
                .eq('id', video.id);

              video.status = 'failed';
              video.error_message = veoStatus.error || 'Video generation failed';
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
