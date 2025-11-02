const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { location } = await req.json();
    
    if (!location) {
      return new Response(
        JSON.stringify({ error: 'Location text is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Geocoding location: ${location}`);

    const OPENROUTER_API_KEY = Deno.env.get('OPENROUTER_API_KEY');
    
    if (!OPENROUTER_API_KEY) {
      console.error('OPENROUTER_API_KEY not configured');
      return new Response(
        JSON.stringify({ error: 'AI service not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const prompt = `You are a geocoding assistant. Convert the following location description to coordinates (latitude and longitude).

Location: "${location}"

Provide the result in this exact JSON format with no other text:
{
  "locationName": "Clean, properly formatted location name",
  "lat": latitude as number,
  "lng": longitude as number,
  "confidence": "high/medium/low"
}

Examples:
- Input: "mumbai" → {"locationName": "Mumbai, India", "lat": 19.0760, "lng": 72.8777, "confidence": "high"}
- Input: "near eiffel tower" → {"locationName": "Eiffel Tower, Paris, France", "lat": 48.8584, "lng": 2.2945, "confidence": "high"}
- Input: "times square nyc" → {"locationName": "Times Square, New York, USA", "lat": 40.7580, "lng": -73.9855, "confidence": "high"}

Be as accurate as possible with the coordinates.`;

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://farm-shops.lovable.app',
        'X-Title': 'Farm Shops Finder'
      },
      body: JSON.stringify({
        model: 'mistralai/mixtral-8x7b-instruct',
        messages: [
          { 
            role: 'system', 
            content: 'You are a precise geocoding assistant. Always return valid JSON with accurate coordinates.' 
          },
          { role: 'user', content: prompt }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI API error:', response.status, errorText);
      
      // Fallback for common cities
      const fallbackLocations: Record<string, any> = {
        'london': { locationName: 'London, UK', lat: 51.5074, lng: -0.1278 },
        'mumbai': { locationName: 'Mumbai, India', lat: 19.0760, lng: 72.8777 },
        'delhi': { locationName: 'Delhi, India', lat: 28.6139, lng: 77.2090 },
        'new york': { locationName: 'New York, USA', lat: 40.7128, lng: -74.0060 },
        'paris': { locationName: 'Paris, France', lat: 48.8566, lng: 2.3522 },
      };

      const normalizedLocation = location.toLowerCase().trim();
      for (const [key, coords] of Object.entries(fallbackLocations)) {
        if (normalizedLocation.includes(key)) {
          return new Response(
            JSON.stringify({ coordinates: coords, locationName: coords.locationName }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
      }

      return new Response(
        JSON.stringify({ error: 'Could not geocode location' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    const aiResponse = data.choices?.[0]?.message?.content || '{}';
    
    console.log('AI Geocoding Response:', aiResponse);

    let coordinates;
    try {
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        coordinates = JSON.parse(jsonMatch[0]);
      } else {
        coordinates = JSON.parse(aiResponse);
      }

      if (!coordinates.lat || !coordinates.lng) {
        throw new Error('Invalid coordinates format');
      }
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      return new Response(
        JSON.stringify({ error: 'Could not parse location data' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ 
        coordinates: {
          lat: coordinates.lat,
          lng: coordinates.lng
        },
        locationName: coordinates.locationName,
        confidence: coordinates.confidence
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in geocode-location:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
