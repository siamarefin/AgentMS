import { useEffect, useRef, useState } from "react";
import "./App.css";

function App() {
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const chatBoxRef = useRef(null);

  // Scroll chat to bottom whenever chatHistory changes
  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [chatHistory]);

  const handleSendMessage = async () => {
    if (!message.trim() || loading) return;

    const userMessage = message.trim();
    const updatedHistory = [
      ...chatHistory,
      { sender: "user", text: userMessage },
    ];
    setChatHistory(updatedHistory);
    setMessage("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:11434/v1/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "qwen3:1.7b",
          prompt: userMessage,
          stream: false,
        }),
      });

      if (!response.ok) throw new Error("Network response not ok");

      const data = await response.json();
      const rawText = data?.choices?.[0]?.text || "⚠️ No response";

      // 🧼 Clean out <think> tags and internal reasoning
      const cleanText =
        rawText
          .replace(/<[^>]*>/g, "") // remove XML-style tags like <think>
          .split(/\n\n+/) // split at double newlines
          .filter(
            (para) => /^[A-Z]/.test(para.trim()) && para.trim().length > 10 // filters plausible answers
          )
          .at(-1) // grab the last plausible segment
          ?.trim() || "⚠️ Could not extract response";

      setChatHistory([...updatedHistory, { sender: "bot", text: cleanText }]);
    } catch (error) {
      console.error(error);
      setChatHistory([
        ...updatedHistory,
        { sender: "bot", text: "⚠️ Error: Could not get response." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <h1 className="title">🤖 AgentMS</h1>
      <div className="chat-box" ref={chatBoxRef}>
        {chatHistory.map((chat, idx) => (
          <div key={idx} className={`message ${chat.sender}`}>
            <span className="sender">
              {chat.sender === "user" ? "🧑 You" : "🤖 Bot"}:
            </span>
            <span className="text">{chat.text}</span>
          </div>
        ))}
        {loading && (
          <div className="message bot">
            <span className="sender">🤖 Bot:</span>
            <span className="text">Thinking...</span>
          </div>
        )}
      </div>
      <div className="input-area">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
          disabled={loading}
        />
        <button
          onClick={handleSendMessage}
          disabled={loading || !message.trim()}
        >
          {loading ? "Sending..." : "Send"}
        </button>
      </div>
    </div>
  );
}

export default App;
