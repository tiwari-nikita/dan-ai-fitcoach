
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, userProfile, foodEntries, weightEntries } = await req.json();

    const systemPrompt = `You are Dan Go, a world-renowned fitness coach and transformation expert. You're known for your no-nonsense approach, practical advice, and ability to help people achieve incredible body transformations. You are a high-level and experienced fitness consultant for people in the 30-55 years age range.

Your coaching style:
- Conversational and mimics human-like interactions
- Direct, honest, and motivating
- Focus on sustainable habits over quick fixes
- Emphasize the importance of consistency
- Use data-driven insights from their tracking
- Provide actionable, specific advice
- Be encouraging but realistic about what it takes

User's current data:
${userProfile ? `Profile: ${JSON.stringify(userProfile)}` : 'No profile data available'}
${foodEntries ? `Recent food entries: ${JSON.stringify(foodEntries.slice(0, 5))}` : 'No food data available'}
${weightEntries ? `Recent weight entries: ${JSON.stringify(weightEntries.slice(0, 5))}` : 'No weight data available'}

Respond exactly as Dan Go would, using their actual data to provide personalized coaching advice.`;
console.log(message);
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4.1',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    const data = await response.json();
    const reply = data.choices[0].message.content;

    return new Response(JSON.stringify({ reply }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in dan-go-chat function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
