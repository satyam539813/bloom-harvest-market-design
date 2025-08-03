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
    console.log('=== CHATBOT FUNCTION START ===');
    
    // Try multiple possible environment variable names
    let API_KEY = Deno.env.get('OPENROUTER_API_KEY') || 
                  Deno.env.get('OPENAI_API_KEY') || 
                  Deno.env.get('GEMINI_API_KEY');
    
    console.log('API_KEY found:', !!API_KEY);
    console.log('Available env vars:', Object.keys(Deno.env.toObject()));
    
    if (!API_KEY) {
      console.error('No API key found in environment variables');
      return new Response(
        JSON.stringify({ 
          error: 'API key not configured. Please check your Supabase edge function secrets.',
          debug: 'Available env vars: ' + Object.keys(Deno.env.toObject()).join(', ')
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const { prompt } = await req.json();
    if (!prompt) {
      console.error('No prompt provided');
      return new Response(
        JSON.stringify({ error: 'Prompt is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log(`Processing chatbot request with prompt: "${prompt}"`);

    // Try OpenRouter first, fallback to OpenAI
    let response;
    let apiUrl = 'https://openrouter.ai/api/v1/chat/completions';
    let model = 'meta-llama/llama-3.1-8b-instruct:free';
    let headers: any = {
      'Authorization': `Bearer ${API_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://farmfresh.lovable.app',
      'X-Title': 'FarmFresh AI Assistant',
    };

    // If it's not an OpenRouter key, try OpenAI
    if (API_KEY.startsWith('sk-')) {
      apiUrl = 'https://api.openai.com/v1/chat/completions';
      model = 'gpt-4o-mini';
      headers = {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      };
    }

    console.log('Using API URL:', apiUrl);
    console.log('Using model:', model);

    response = await fetch(apiUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        model: model,
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

    console.log('API response status:', response.status);

    if (!response.ok) {
      const errorData = await response.json();
      console.error('API error:', errorData);
      return new Response(
        JSON.stringify({ 
          error: `API error: ${response.status} ${response.statusText}`,
          details: errorData
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
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
      JSON.stringify({ 
        error: error.message || 'Failed to process chat request',
        stack: error.stack
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});