export default async function handler(req, res) {
  const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

  const { conversation } = await req.json();

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${OPENAI_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You're a movie expert helping users find what movie to watch based on mood, taste, or comparison. Recommend 3–5 titles with release years, and ask clarifying questions if needed. Never repeat a movie the user already referenced."
        },
        ...conversation
      ],
      temperature: 0.9
    })
  });

  const data = await response.json();
  return res.status(200).json({ reply: data.choices[0].message.content });
}
