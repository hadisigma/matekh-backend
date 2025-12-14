export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message } = req.body;

    const response = await fetch('https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer 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',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        inputs: `<s>[INST] ${message} [/INST]`,
        parameters: {
          max_new_tokens: 200,
          temperature: 0.7,
          top_p: 0.95,
          return_full_text: false
        },
        options: {
          use_cache: false,
          wait_for_model: true
        }
      })
    });

    const data = await response.json();
    
    let reply = '';
    if (Array.isArray(data) && data[0]?.generated_text) {
      reply = data[0].generated_text;
    } else if (data.generated_text) {
      reply = data.generated_text;
    } else if (data.error) {
      reply = '🤖 Hallo! Ich bin MatEKH, dein KI-Assistent!';
    } else {
      reply = '🤖 Hi! Ich bin MatEKH. Wie kann ich dir helfen?';
    }

    res.status(200).json({ reply });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ 
      reply: '🤖 Hallo! Ich bin MatEKH, dein KI-Chatbot!' 
    });
  }
}
