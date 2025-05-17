import { useState } from "react";
import "./App.css";

function App() {
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    const updatedHistory = [...chatHistory, { sender: "user", text: message }];
    setChatHistory(updatedHistory);
    setMessage(""); // Clear input immediately

    setTimeout(() => {
      const chatBox = document.querySelector(".chat-box");
      chatBox.scrollTop = chatBox.scrollHeight;
    }, 100);

    try {
      const response = await fetch("http://localhost:8000/chat/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });

      const data = await response.json();
      setChatHistory([
        ...updatedHistory,
        { sender: "bot", text: data.response },
      ]);
    } catch (error) {
      setChatHistory([
        ...updatedHistory,
        { sender: "bot", text: "⚠️ Error: Could not get response." },
      ]);
    }

    setTimeout(() => {
      const chatBox = document.querySelector(".chat-box");
      chatBox.scrollTop = chatBox.scrollHeight;
    }, 100);
  };

  return (
    <div className="app">
      <h1 className="title">🤖 AgentMS</h1>
      <div className="chat-box">
        {chatHistory.map((chat, idx) => (
          <div key={idx} className={`message ${chat.sender}`}>
            <span className="sender">
              {chat.sender === "user" ? "🧑 You" : "🤖 Bot"}:
            </span>
            <span className="text">{chat.text}</span>
          </div>
        ))}
      </div>
      <div className="input-area">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
}

export default App;
