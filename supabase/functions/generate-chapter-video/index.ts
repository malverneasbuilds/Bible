import { createClient } from 'jsr:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

interface Verse {
  verse: number;
  text: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { bookNumber, chapter } = await req.json();

    if (!bookNumber || !chapter) {
      throw new Error('bookNumber and chapter are required');
    }

    const existingVideo = await supabase
      .from('chapter_videos')
      .select('*')
      .eq('book_number', bookNumber)
      .eq('chapter', chapter)
      .maybeSingle();

    if (existingVideo.data) {
      if (existingVideo.data.status === 'completed') {
        return new Response(
          JSON.stringify({
            success: true,
            cached: true,
            video: existingVideo.data,
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      } else if (existingVideo.data.status === 'generating') {
        return new Response(
          JSON.stringify({
            success: true,
            status: 'generating',
            message: 'Video is currently being generated. Please check back in a few minutes.',
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    const bookData = await supabase
      .from('bible_books')
      .select('name, abbrev')
      .eq('book_number', bookNumber)
      .single();

    if (!bookData.data) {
      throw new Error('Book not found');
    }

    const versesData = await supabase
      .from('bible_verses')
      .select('verse, text')
      .eq('book_number', bookNumber)
      .eq('chapter', chapter)
      .order('verse');

    if (!versesData.data || versesData.data.length === 0) {
      throw new Error('No verses found for this chapter');
    }

    const verses: Verse[] = versesData.data;
    const chapterText = verses.map(v => v.text).join(' ');

    const scriptPrompt = `Create a detailed, scene-by-scene video script for ${bookData.data.name} Chapter ${chapter}.

Chapter text:
${chapterText}

IMPORTANT REQUIREMENTS:
1. Be 100% accurate to the biblical text - every detail must match exactly
2. Break the narrative into 3-5 clear, visual scenes
3. Each scene should be 5-10 seconds and highly cinematic
4. Use specific visual details from the text (e.g., "stone hits Goliath's forehead" not "stone hits Goliath")
5. Include camera angles, lighting, and mood for each scene
6. Keep it reverent and historically appropriate
7. Format as a single paragraph prompt optimized for video generation AI

Generate a cinematic video prompt (max 500 characters) that captures the essence of this chapter with biblical accuracy.`;

    const openaiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openaiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const scriptResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openaiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a biblical scholar and cinematographer who creates accurate, reverent video scripts from scripture.',
          },
          {
            role: 'user',
            content: scriptPrompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!scriptResponse.ok) {
      throw new Error('Failed to generate script');
    }

    const scriptData = await scriptResponse.json();
    const script = scriptData.choices[0].message.content;

    // Try to initialize Google GenAI for video generation
    const googleApiKey = Deno.env.get('GOOGLE_API_KEY');

    let videoRecord;

    if (googleApiKey) {
      try {
        // Dynamically import the Google GenAI package
        const { GoogleGenAI } = await import('npm:@google/generative-ai@0.21.0');
        const ai = new GoogleGenAI({ apiKey: googleApiKey });

        // Start video generation
        const operation = await ai.models.generateVideos({
          model: 'veo-3.0-generate-001',
          prompt: script,
        });

        videoRecord = {
          book_number: bookNumber,
          chapter: chapter,
          script: script,
          status: 'generating' as const,
          veo_task_id: operation.name,
          video_url: null,
          duration_seconds: 10,
          error_message: null,
        };
      } catch (veoError) {
        console.error('Veo generation error:', veoError);
        videoRecord = {
          book_number: bookNumber,
          chapter: chapter,
          script: script,
          status: 'failed' as const,
          veo_task_id: null,
          video_url: null,
          duration_seconds: 10,
          error_message: `Video generation unavailable: ${veoError.message || 'Unable to access Google Veo API'}`,
        };
      }
    } else {
      videoRecord = {
        book_number: bookNumber,
        chapter: chapter,
        script: script,
        status: 'failed' as const,
        veo_task_id: null,
        video_url: null,
        duration_seconds: 10,
        error_message: 'Google API key not configured. Video generation requires a valid GOOGLE_API_KEY environment variable.',
      };
    }

    const { data: savedVideo, error: saveError } = await supabase
      .from('chapter_videos')
      .upsert(videoRecord, {
        onConflict: 'book_number,chapter',
      })
      .select()
      .single();

    if (saveError) {
      throw saveError;
    }

    return new Response(
      JSON.stringify({
        success: true,
        video: savedVideo,
        message: savedVideo.status === 'completed'
          ? 'Video generated successfully!'
          : savedVideo.status === 'failed'
          ? 'Video generation is currently unavailable. AI script generated successfully.'
          : 'Video generation started. This may take 2-3 minutes.',
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
