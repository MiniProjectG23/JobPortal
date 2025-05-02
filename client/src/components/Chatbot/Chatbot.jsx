import React, { useState, useEffect } from "react";
import "./Chatbot.css";
import { AiOutlineRobot, AiOutlineClose, AiOutlineUser } from "react-icons/ai";

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [botTyping, setBotTyping] = useState(""); // State to handle bot typing effect

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{ text: "Hello, how can I help you?", sender: "bot" }]);
    }
  }, [isOpen]);
  

  const handleSend = async () => {
    if (input.trim()) {
      const userMessage = { text: input, sender: "user" };
      setMessages((prevMessages) => [...prevMessages, userMessage]);
      setInput("");
  
      // Show typing indicator (e.g., animated dots)
      setBotTyping("...");
  
      try {
        const response = await fetch("http://localhost:8000/chatbot/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_input: input }),
        });
  
        const data = await response.json();
        const botResponseText = data.reply || "Sorry, I couldn't understand that.";
  
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: botResponseText, sender: "bot" },
        ]);
      } catch (error) {
        console.error("Error in backend request:", error);
        const errorMessage = {
          text: "There was an error processing your request. Please try again later.",
          sender: "bot",
        };
        setMessages((prevMessages) => [...prevMessages, errorMessage]);
      } finally {
        setBotTyping(""); // Hide typing indicator
      }
    }
  };
  

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <>
      {!isOpen && (
        <button className="chatbot-toggle-button" onClick={() => setIsOpen(true)}>
          <AiOutlineRobot size={30} />
        </button>
      )}
      <div className={`chatbot-container ${isOpen ? "chatbot-open" : "chatbot-closed"}`}>
        {isOpen && (
          <>
            <div className="chatbot-header">
              <AiOutlineRobot size={20} />
              AskMeAnything Bot
              <span className="chatbot-online-dot"></span>
              <AiOutlineClose className="chatbot-close-button" onClick={handleClose} />
            </div>
            <div className="chatbot-messages">
              {messages.map((msg, index) => (
                <div key={index} className={`chatbot-message-container chatbot-${msg.sender}`}>
                  {msg.sender === "bot" && <AiOutlineRobot className="chatbot-icon" />}
                  <div className={`chatbot-message chatbot-${msg.sender}`}>
                    <div className="chatbot-text">{msg.text}</div>
                  </div>
                  {msg.sender === "user" && <AiOutlineUser className="chatbot-icon" />}
                </div>
              ))}
              {botTyping && (
                <div className="chatbot-message-container chatbot-bot">
                  <AiOutlineRobot className="chatbot-icon" />
                  <div className="chatbot-message chatbot-bot">
                    <div className="chatbot-text">{botTyping}</div>
                  </div>
                </div>
              )}
            </div>
            <div className="chatbot-input-container">
              <input
                type="text"
                className="chatbot-input"
                value={input}
                placeholder="Enter your message here"
                onChange={(e) => setInput(e.target.value)}
              />
              <button className="chatbot-send" onClick={handleSend}>
                Send
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Chatbot;
