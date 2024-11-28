import React, { useState } from "react";
import axios from "axios";
import Navbar from "../shared/Navbar";
import { IoCopyOutline } from "react-icons/io5";
import { toast } from 'sonner'

const AiChatBox = () => {
  const [prompt, setPrompt] = useState(""); // User input
  const [messages, setMessages] = useState([]); // To store chat messages
  const [loading, setLoading] = useState(false); // Loading state

  const handleSend = async () => {
    if (!prompt) {
      alert("Please enter a prompt!");
      return;
    }

    setLoading(true);

    // Add user message to the chat
    setMessages((prevMessages) => [
      ...prevMessages,
      { sender: "user", text: prompt },
    ]);
    setPrompt(""); // Clear the input

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}`, // Accessing Vite env variable
        { prompt },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const aiMessage = res.data.generatedText;
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "ai", text: aiMessage },
      ]);
    } catch (error) {
      console.error("Error fetching AI response:", error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "ai", text: "Failed to generate response. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Text copied successfully");
  };

  return (
    <div>
      <Navbar />

      <div className="max-w-2xl mx-auto p-6">
        <h1 className="text-2xl font-bold text-center mb-6">AI Chat Box</h1>

        {/* Chat Area */}
        <div className="h-96 overflow-y-auto p-4 bg-white border border-gray-300 rounded-md mb-4 shadow-sm">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"} mb-4`}
            >
              <div className="max-w-xs p-4 rounded-lg bg-gray-200 relative">
                <p className="text-black">{msg.text}</p>
                {msg.sender === "ai" && (
                  <button
                    onClick={() => handleCopy(msg.text)}
                    className="absolute right-2 top-1.5 text-sm "
                  >
                    <IoCopyOutline />
                  </button>
                )}
              </div>
            </div>
          ))}

          {/* Show loading indicator while waiting for AI */}
          {loading && (
            <div className="flex justify-start mb-4">
              <div className="max-w-xs p-3 rounded-lg bg-gray-300 text-black">
                AI is typing...
              </div>
            </div>
          )}
        </div>

        {/* Input Box */}
        <div className="flex items-center space-x-2 mb-4">
          <textarea
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your prompt here..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          ></textarea>
          <button
            onClick={handleSend}
            disabled={loading}
            className={`w-20 py-2 px-4 rounded-md text-white font-semibold ${
              loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            {loading ? "Sending..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AiChatBox;
