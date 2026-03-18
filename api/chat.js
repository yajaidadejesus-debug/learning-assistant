export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const SYSTEM_PROMPT = "You are a helpful learning assistant. Answer questions clearly and concisely.";

  const { messages } = req.body;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...messages
      ]
    })
  });

  const data = await response.json();
  console.log('OpenAI status:', response.status);
  console.log('OpenAI response:', JSON.stringify(data));

  if (!response.ok || !data.choices) {
    return res.status(500).json({ error: data.error?.message || 'OpenAI request failed' });
  }

  const reply = data.choices[0].message.content;
  res.status(200).json({ reply });
}
