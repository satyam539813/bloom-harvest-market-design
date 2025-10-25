const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('=== IMAGE ANALYSIS FUNCTION START ===');
    
    const OPENROUTER_API_KEY_RAW = Deno.env.get('OPENROUTER_API_KEY');
    const OPENROUTER_API_KEY = OPENROUTER_API_KEY_RAW ? OPENROUTER_API_KEY_RAW.trim() : '';
    console.log('OPENROUTER_API_KEY exists:', !!OPENROUTER_API_KEY);
    console.log('OPENROUTER_API_KEY length:', OPENROUTER_API_KEY ? OPENROUTER_API_KEY.length : 0);
    
    if (!OPENROUTER_API_KEY) {
      console.error('OPENROUTER_API_KEY is not set in environment variables');
      return new Response(
        JSON.stringify({ 
          analysis: 'This is a demo analysis. The image appears to show agricultural content. To get real AI analysis, please configure your OpenRouter API key in Supabase.'
        }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
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
        model: 'google/gemini-2.5-flash',
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
                  detail: 'high'
                }
              }
            ]
          }
        ],
        max_tokens: 500,
        temperature: 0.3
      }),
    });

    console.log('OpenRouter API response status:', response.status);

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenRouter API error:', errorData);
      
      // Return a fallback response instead of throwing an error
      return new Response(
        JSON.stringify({ 
          analysis: `Demo Analysis Results:

1) Crop Type: Unable to determine without API access
2) Health Status: Requires AI vision analysis
3) Growth Stage: Analysis pending
4) Visible Issues: None detected in demo mode
5) Recommendations: Configure OpenRouter API key for detailed analysis

Note: This is a demo response. To get real AI-powered image analysis, please configure your OpenRouter API key in the Supabase dashboard under Edge Functions secrets.`
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
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
    
    // Return a user-friendly fallback response
    return new Response(
      JSON.stringify({ 
        analysis: `Demo Analysis Results:

1) Crop Type: Image analysis requires API configuration
2) Health Status: Unable to assess without AI vision
3) Growth Stage: Analysis not available in demo mode
4) Visible Issues: Demo mode - no real analysis performed
5) Recommendations: Set up OpenRouter API key for full functionality

This is a demonstration response. For real AI-powered image analysis, please configure your OpenRouter API key in Supabase Edge Functions.`
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});