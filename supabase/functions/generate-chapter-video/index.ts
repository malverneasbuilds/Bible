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
  console.log('📥 Request received:', req.method, req.url);

  if (req.method === 'OPTIONS') {
    console.log('✅ Handling OPTIONS preflight request');
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    console.log('🔧 Initializing Supabase client...');
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);
    console.log('✅ Supabase client initialized');

    console.log('📖 Parsing request body...');
    const { bookNumber, chapter } = await req.json();
    console.log(`📖 Request for book ${bookNumber}, chapter ${chapter}`);

    if (!bookNumber || !chapter) {
      throw new Error('bookNumber and chapter are required');
    }

    console.log('🔍 Checking for existing video...');
    const existingVideo = await supabase
      .from('chapter_videos')
      .select('*')
      .eq('book_number', bookNumber)
      .eq('chapter', chapter)
      .maybeSingle();

    if (existingVideo.data) {
      console.log('📼 Found existing video:', existingVideo.data.status);
      if (existingVideo.data.status === 'completed') {
        console.log('✅ Returning cached completed video');
        return new Response(
          JSON.stringify({
            success: true,
            cached: true,
            video: existingVideo.data,
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      } else if (existingVideo.data.status === 'generating') {
        console.log('⏳ Video is still generating');
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

    console.log('📚 Fetching book data...');
    const bookData = await supabase
      .from('bible_books')
      .select('name, abbrev')
      .eq('book_number', bookNumber)
      .single();
    console.log('📚 Book:', bookData.data?.name);

    if (!bookData.data) {
      throw new Error('Book not found');
    }

    console.log('📜 Fetching verses...');
    const versesData = await supabase
      .from('bible_verses')
      .select('verse, text')
      .eq('book_number', bookNumber)
      .eq('chapter', chapter)
      .order('verse');
    console.log(`📜 Found ${versesData.data?.length || 0} verses`);

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

    console.log('🤖 Checking OpenAI API key...');
    const openaiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openaiKey) {
      console.error('❌ OpenAI API key not configured');
      throw new Error('OpenAI API key not configured');
    }
    console.log('✅ OpenAI API key found');

    console.log('🎬 Generating script with OpenAI...');
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
      const errorText = await scriptResponse.text();
      console.error('❌ OpenAI API error:', scriptResponse.status, errorText);
      throw new Error('Failed to generate script');
    }

    const scriptData = await scriptResponse.json();
    const script = scriptData.choices[0].message.content;
    console.log('✅ Script generated:', script.substring(0, 100) + '...');

    // Try to initialize Google GenAI for video generation
    console.log('🎥 Checking Google API key...');
    const googleApiKey = Deno.env.get('GOOGLE_API_KEY');

    let videoRecord;

    if (googleApiKey) {
      console.log('✅ Google API key found, attempting video generation...');
      try {
        // Dynamically import the Google GenAI package
        console.log('📦 Importing Google GenAI package...');
        const { GoogleGenAI } = await import('npm:@google/genai');
        console.log('✅ Package imported, initializing AI...');
        const ai = new GoogleGenAI({ apiKey: googleApiKey });
        console.log('✅ AI initialized');

        // Start video generation
        console.log('🎬 Starting video generation with Veo...');
        const operation = await ai.models.generateVideos({
          model: 'veo-3.0-generate-001',
          prompt: script,
        });
        console.log('✅ Video generation started:', operation.name);

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
        console.error('❌ Veo generation error:', veoError.message);
        console.error('❌ Full error:', veoError);
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
      console.log('⚠️ Google API key not configured');
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

    console.log('💾 Saving video record to database...');
    const { data: savedVideo, error: saveError } = await supabase
      .from('chapter_videos')
      .upsert(videoRecord, {
        onConflict: 'book_number,chapter',
      })
      .select()
      .single();

    if (saveError) {
      console.error('❌ Database save error:', saveError);
      throw saveError;
    }
    console.log('✅ Video record saved:', savedVideo.id);

    console.log('✅ Returning success response');
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
    console.error('❌ FATAL ERROR:', error.message);
    console.error('❌ Stack trace:', error.stack);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
