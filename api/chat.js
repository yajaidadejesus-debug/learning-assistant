module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const SYSTEM_PROMPT = "You are a helpful learning assistant. Answer questions clearly and concisely.";

  const { messages } = req.body;

  try {
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

    if (!response.ok || !data.choices || data.choices.length === 0) {
      return res.status(500).json({ error: 'OpenAI request failed' });
    }

    const reply = data.choices[0].message.content;
    res.status(200).json({ reply });

  } catch (err) {
    return res.status(500).json({ error: 'Something went wrong' });
  }
}
