import { useState } from "react";
import "./App.css";

function App() {
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    // Add user message to chat history
    setChatHistory([...chatHistory, { sender: "user", text: message }]);

    try {
      // Send message to backend
      const response = await fetch("http://localhost:8000/chat/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });

      const data = await response.json();
      // Add bot response to chat history
      setChatHistory([
        ...chatHistory,
        { sender: "user", text: message },
        { sender: "bot", text: data.response },
      ]);
    } catch (error) {
      console.error("Error:", error);
      setChatHistory([
        ...chatHistory,
        { sender: "user", text: message },
        { sender: "bot", text: "Error: Could not get response" },
      ]);
    }

    setMessage(""); // Clear input
  };

  return (
    <div className="App">
      <h1>Chatbot</h1>
      <div className="chat-container">
        {chatHistory.map((chat, index) => (
          <div key={index} className={`chat-message ${chat.sender}`}>
            <strong>{chat.sender === "user" ? "You" : "Bot"}: </strong>
            {chat.text}
          </div>
        ))}
      </div>
      <div className="chat-input">
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
