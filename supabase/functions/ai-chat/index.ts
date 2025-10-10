import { createClient } from 'jsr:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const { message, verse, chatId, messages: existingMessages } = await req.json();

    if (!message) {
      throw new Error('Message is required');
    }

    const openaiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openaiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const systemPrompt = `You are a knowledgeable and compassionate Bible study companion and pastoral assistant. Your role is to:

1. Help users understand Scripture with theological depth and historical context
2. Provide encouragement, wisdom, and practical application of biblical principles
3. Answer questions with warmth, patience, and reverence for God's Word
4. Draw connections between different passages and themes in Scripture
5. Speak in a gentle, pastoral tone that's both scholarly and accessible
6. When appropriate, ask thoughtful questions to deepen understanding
7. Always point people toward Christ and His teachings
8. Be honest when you don't know something, rather than speculating

Remember: You're not just providing information, but walking alongside believers in their spiritual journey. Be encouraging, insightful, and always grounded in Scripture.`;

    const conversationMessages: Message[] = [
      { role: 'system' as const, content: systemPrompt },
    ];

    if (verse) {
      conversationMessages.push({
        role: 'user',
        content: `I'm reading this verse: "${verse.text}" (${verse.book} ${verse.chapter}:${verse.verse})`,
      });
      conversationMessages.push({
        role: 'assistant',
        content: 'Thank you for sharing that verse with me. How can I help you understand it better or apply it to your life?',
      });
    }

    if (existingMessages && Array.isArray(existingMessages)) {
      conversationMessages.push(...existingMessages);
    }

    conversationMessages.push({
      role: 'user',
      content: message,
    });

    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openaiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: conversationMessages,
        temperature: 0.8,
        max_tokens: 800,
      }),
    });

    if (!openaiResponse.ok) {
      const errorText = await openaiResponse.text();
      throw new Error(`OpenAI API error: ${errorText}`);
    }

    const openaiData = await openaiResponse.json();
    const assistantMessage = openaiData.choices[0].message.content;

    const updatedMessages = [
      ...(existingMessages || []),
      { role: 'user', content: message },
      { role: 'assistant', content: assistantMessage },
    ];

    let savedChatId = chatId;

    if (chatId) {
      const { error: updateError } = await supabase
        .from('ai_chats')
        .update({
          messages: updatedMessages,
        })
        .eq('id', chatId);

      if (updateError) {
        console.error('Error updating chat:', updateError);
      }
    } else {
      const title = message.slice(0, 50) + (message.length > 50 ? '...' : '');
      
      const { data: newChat, error: insertError } = await supabase
        .from('ai_chats')
        .insert({
          title,
          verse_reference: verse ? `${verse.book} ${verse.chapter}:${verse.verse}` : null,
          verse_text: verse?.text || null,
          messages: updatedMessages,
        })
        .select()
        .single();

      if (insertError) {
        console.error('Error creating chat:', insertError);
      } else {
        savedChatId = newChat.id;
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: assistantMessage,
        chatId: savedChatId,
        messages: updatedMessages,
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
