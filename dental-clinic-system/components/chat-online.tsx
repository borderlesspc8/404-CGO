import React, { useState, useEffect } from "react";
import Notification from "./notification";

interface Message {
  id: number;
  sender: "Paciente" | "Equipe";
  text: string;
  timestamp: string;
}

const ChatOnline: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [notification, setNotification] = useState<string | null>(null);
  const [input, setInput] = useState("");

  useEffect(() => {
    // Carregar histórico do localStorage
    const saved = localStorage.getItem("chat-messages");
    if (saved) setMessages(JSON.parse(saved));
  }, []);

  useEffect(() => {
    // Salvar histórico no localStorage
    localStorage.setItem("chat-messages", JSON.stringify(messages));
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    const newMessage: Message = {
      id: messages.length + 1,
      sender: "Paciente",
      text: input,
      timestamp: new Date().toLocaleTimeString(),
    };
    setMessages([...messages, newMessage]);
    setInput("");
    setNotification("Mensagem enviada!");
  };

  return (
    <div style={{ border: "1px solid #ccc", borderRadius: 8, padding: 16, maxWidth: 400 }}>
      <h3>Chat Online</h3>
      <div style={{ height: 200, overflowY: "auto", marginBottom: 8, background: "#f9f9f9", padding: 8 }}>
        {messages.map((msg) => (
          <div key={msg.id} style={{ marginBottom: 4 }}>
            <strong>{msg.sender}:</strong> {msg.text} <span style={{ fontSize: 10, color: "#888" }}>{msg.timestamp}</span>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Digite sua mensagem..."
          style={{ flex: 1, padding: 4 }}
        />
        <button onClick={handleSend}>Enviar</button>
      </div>
      {notification && (
        <Notification message={notification} onClose={() => setNotification(null)} />
      )}
    </div>
  );
};

export default ChatOnline;
