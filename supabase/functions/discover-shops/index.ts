const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { latitude, longitude } = await req.json();
    
    if (!latitude || !longitude) {
      return new Response(
        JSON.stringify({ error: 'Latitude and longitude are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Discovering shops near: ${latitude}, ${longitude}`);

    const OPENROUTER_API_KEY = Deno.env.get('OPENROUTER_API_KEY');
    
    if (!OPENROUTER_API_KEY) {
      console.error('OPENROUTER_API_KEY not configured');
      return new Response(
        JSON.stringify({ error: 'AI service not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const prompt = `Generate a realistic list of 8-10 farm shops and organic markets near coordinates ${latitude}, ${longitude}.
For each shop, provide detailed analysis including:
- id: unique identifier
- name: A realistic farm shop name
- address: A plausible street address in the area
- lat: Latitude (vary by 0.01-0.05 from ${latitude})
- lng: Longitude (vary by 0.01-0.05 from ${longitude})
- description: Brief description of what they sell (organic produce, dairy, meat, etc.)
- qualityScore: Product quality rating (0-100)
- priceCompetitiveness: How competitive the prices are (0-100, higher means better value)
- popularityScore: Shop popularity rating (0-100)
- environmentalScore: Environmental sustainability rating (0-100)
- varietyScore: Product variety rating (0-100)

Return ONLY a JSON array with this exact structure, no other text:
[{"id": "1", "name": "...", "address": "...", "lat": number, "lng": number, "description": "...", "qualityScore": number, "priceCompetitiveness": number, "popularityScore": number, "environmentalScore": number, "varietyScore": number}]`;

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://farm-shops.lovable.app',
        'X-Title': 'Farm Shops Finder'
      },
      body: JSON.stringify({
        model: 'google/gemini-2.0-flash-exp:free',
        messages: [
          { 
            role: 'system', 
            content: 'You are a helpful assistant that generates realistic farm shop data with detailed analysis scores in JSON format. Always return valid JSON arrays only.' 
          },
          { role: 'user', content: prompt }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI API error:', response.status, errorText);

      // Fallback: generate sample shops when AI provider fails
      const shops = [
        {
          id: "1",
          name: "Green Valley Farm Shop",
          address: "123 Farm Road",
          lat: latitude + 0.02,
          lng: longitude + 0.02,
          description: "Fresh organic vegetables and dairy products"
        },
        {
          id: "2",
          name: "Sunrise Organic Market",
          address: "456 Market Street",
          lat: latitude - 0.03,
          lng: longitude + 0.01,
          description: "Locally sourced organic produce and artisan goods"
        },
        {
          id: "3",
          name: "Riverbend Produce",
          address: "789 Orchard Lane",
          lat: latitude + 0.015,
          lng: longitude - 0.025,
          description: "Seasonal fruits, honey, and baked goods"
        },
        {
          id: "4",
          name: "Meadow Fresh Co-op",
          address: "22 Meadow Street",
          lat: latitude - 0.018,
          lng: longitude + 0.032,
          description: "Community co-op for organic grains and pulses"
        }
      ];

      return new Response(
        JSON.stringify({ shops }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    const aiResponse = data.choices?.[0]?.message?.content || '[]';
    
    console.log('AI Response:', aiResponse);

    // Parse the JSON from AI response
    let shops = [];
    try {
      // Try to extract JSON array from the response
      const jsonMatch = aiResponse.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        shops = JSON.parse(jsonMatch[0]);
      } else {
        shops = JSON.parse(aiResponse);
      }
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      console.error('AI response was:', aiResponse);
      
      // Fallback: generate sample shops with scores
      shops = [
        {
          id: "1",
          name: "Green Valley Farm Shop",
          address: "123 Farm Road",
          lat: latitude + 0.02,
          lng: longitude + 0.02,
          description: "Fresh organic vegetables and dairy products",
          qualityScore: 85,
          priceCompetitiveness: 75,
          popularityScore: 80,
          environmentalScore: 90,
          varietyScore: 70
        },
        {
          id: "2",
          name: "Sunrise Organic Market",
          address: "456 Market Street",
          lat: latitude - 0.03,
          lng: longitude + 0.01,
          description: "Locally sourced organic produce and artisan goods",
          qualityScore: 78,
          priceCompetitiveness: 82,
          popularityScore: 75,
          environmentalScore: 85,
          varietyScore: 80
        }
      ];
    }

    return new Response(
      JSON.stringify({ shops }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in discover-shops:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
