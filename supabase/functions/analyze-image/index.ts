
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
    const OPENROUTER_API_KEY = Deno.env.get('OPENROUTER_API_KEY');
    console.log('OPENROUTER_API_KEY exists:', !!OPENROUTER_API_KEY);
    
    if (!OPENROUTER_API_KEY) {
      console.error('OPENROUTER_API_KEY is not set in environment variables');
      throw new Error('OPENROUTER_API_KEY is not configured');
    }

    const { image, prompt } = await req.json();
    if (!image) {
      console.error('No image data provided');
      throw new Error('Image data is required');
    }

    const analysisPrompt = prompt || "Analyze this agricultural image briefly: 1) Crop type, 2) Health status, 3) Growth stage, 4) Visible issues, 5) Recommendations. Be concise.";
    console.log(`Analyzing image with OpenRouter Vision using prompt: "${analysisPrompt}"`);

    // Call OpenRouter API with vision model
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://farmfresh.lovable.app',
        'X-Title': 'FarmFresh Image Analysis',
      },
      body: JSON.stringify({
        model: 'openai/gpt-4o-mini',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: analysisPrompt
              },
              {
                type: 'image_url',
                image_url: {
                  url: image,
                  detail: 'low'
                }
              }
            ]
          }
        ],
        max_tokens: 300,
        temperature: 0
      }),
    });

    console.log('OpenRouter API response status:', response.status);

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenRouter API error:', errorData);
      throw new Error(`OpenRouter API error: ${response.status} ${response.statusText} - ${JSON.stringify(errorData)}`);
    }

    const analysisResult = await response.json();
    const analysis = analysisResult.choices?.[0]?.message?.content || 'No analysis available';
    
    console.log('OpenRouter Vision analysis successful');
    console.log('Analysis length:', analysis.length);

    return new Response(
      JSON.stringify({ 
        analysis: analysis
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error analyzing image:', error.message);
    console.error('Error stack:', error.stack);
    return new Response(
      JSON.stringify({ error: error.message || 'Failed to analyze image' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
