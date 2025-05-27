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
      const response = await fetch("http://localhost:8000/chat/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage }),
      });

      if (!response.ok) throw new Error("Network response not ok");

      // Expecting a plain string "ok" from backend
      const data = await response.text();
      setChatHistory([...updatedHistory, { sender: "bot", text: data }]);
    } catch (error) {
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
