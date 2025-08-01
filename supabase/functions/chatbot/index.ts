import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    console.log('OPENAI_API_KEY exists:', !!OPENAI_API_KEY);
    
    if (!OPENAI_API_KEY) {
      console.error('OPENAI_API_KEY is not set in environment variables');
      throw new Error('OPENAI_API_KEY is not configured');
    }

    const { prompt } = await req.json();
    if (!prompt) {
      console.error('No prompt provided');
      throw new Error('Prompt is required');
    }

    console.log(`Processing chatbot request with prompt: "${prompt}"`);

    // Call OpenAI API directly
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4.1-2025-04-14',
        messages: [
          {
            role: 'system',
            content: 'You are FarmBot, a friendly agricultural assistant for FarmFresh marketplace. Help users with farming questions, product information, and cooking tips. Keep responses concise and helpful.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 300,
        temperature: 0.7
      }),
    });

    console.log('OpenAI API response status:', response.status);

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenAI API error:', errorData);
      throw new Error(`OpenAI API error: ${response.status} ${response.statusText} - ${JSON.stringify(errorData)}`);
    }

    const chatResult = await response.json();
    const reply = chatResult.choices?.[0]?.message?.content || 'Sorry, I could not generate a response.';
    
    console.log('Chatbot response successful');
    console.log('Response length:', reply.length);

    return new Response(
      JSON.stringify({ 
        reply: reply
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in chatbot function:', error.message);
    console.error('Error stack:', error.stack);
    return new Response(
      JSON.stringify({ error: error.message || 'Failed to process chat request' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});