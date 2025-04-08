const chatArea = document.getElementById("chatArea");
const apiKey = "YOUR_OPENAI_API_KEY"; // Replace this for now (we'll hide it later)
const tmdbApiKey = "YOUR_TMDB_API_KEY"; // Replace with your actual TMDB API key

let conversation = [];

function addMessage(sender, text) {
  const div = document.createElement("div");
  div.classList.add("message");
  div.innerHTML = `<b>${sender}:</b> ${text}`;
  chatArea.appendChild(div);
  chatArea.scrollTop = chatArea.scrollHeight;
}

async function sendMessage() {
  const input = document.getElementById("userInput");
  const userMessage = input.value.trim();
  if (!userMessage) return;

  addMessage("You", userMessage);
  input.value = "";
  conversation.push({ role: "user", content: userMessage });

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You're a movie expert helping users find what movie to watch based on mood, taste, or comparison. Recommend 3–5 titles with release years, and ask clarifying questions if needed. Never repeat a movie the user already referenced." },
        ...conversation
      ],
      temperature: 0.9
    })
  });

  const data = await response.json();
  const reply = data.choices[0].message.content;
  addMessage("MovieBot", reply);
  conversation.push({ role: "assistant", content: reply });
}
