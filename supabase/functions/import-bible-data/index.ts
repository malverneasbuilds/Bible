import { createClient } from 'jsr:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

interface BibleBook {
  abbrev: string;
  chapters: string[][];
  name: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const url = new URL(req.url);
    const action = url.searchParams.get('action') || 'status';

    if (action === 'import') {
      const kjvUrl = 'https://raw.githubusercontent.com/thiagobodruk/bible/master/json/en_kjv.json';
      
      const response = await fetch(kjvUrl);
      if (!response.ok) {
        throw new Error('Failed to fetch Bible data');
      }

      const bibleData: BibleBook[] = await response.json();
      
      const { data: books } = await supabase
        .from('bible_books')
        .select('id, book_number, abbrev')
        .order('book_number');

      if (!books || books.length === 0) {
        throw new Error('Bible books not found in database');
      }

      let totalVersesImported = 0;
      const batchSize = 1000;
      let verseBatch: any[] = [];

      for (let bookIndex = 0; bookIndex < bibleData.length && bookIndex < books.length; bookIndex++) {
        const bookData = bibleData[bookIndex];
        const bookRecord = books[bookIndex];

        for (let chapterIndex = 0; chapterIndex < bookData.chapters.length; chapterIndex++) {
          const chapter = bookData.chapters[chapterIndex];
          const chapterNumber = chapterIndex + 1;

          for (let verseIndex = 0; verseIndex < chapter.length; verseIndex++) {
            const verseText = chapter[verseIndex];
            const verseNumber = verseIndex + 1;

            verseBatch.push({
              book_id: bookRecord.id,
              book_number: bookRecord.book_number,
              chapter: chapterNumber,
              verse: verseNumber,
              text: verseText,
            });

            if (verseBatch.length >= batchSize) {
              const { error } = await supabase
                .from('bible_verses')
                .upsert(verseBatch, { onConflict: 'book_number,chapter,verse' });

              if (error) {
                console.error('Error inserting batch:', error);
              } else {
                totalVersesImported += verseBatch.length;
              }
              verseBatch = [];
            }
          }
        }
      }

      if (verseBatch.length > 0) {
        const { error } = await supabase
          .from('bible_verses')
          .upsert(verseBatch, { onConflict: 'book_number,chapter,verse' });

        if (!error) {
          totalVersesImported += verseBatch.length;
        }
      }

      return new Response(
        JSON.stringify({
          success: true,
          message: `Successfully imported ${totalVersesImported} verses`,
          booksProcessed: bibleData.length,
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { count } = await supabase
      .from('bible_verses')
      .select('*', { count: 'exact', head: true });

    return new Response(
      JSON.stringify({
        success: true,
        versesInDatabase: count || 0,
        message: count === 0 ? 'Database is empty. Call with ?action=import to import Bible data.' : 'Database contains Bible data.',
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
