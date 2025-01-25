import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { Send, User, Bot } from "lucide-react";
import { v4 as uuidv4 } from 'uuid';
import { getDataByThreadId } from "../services/firebase";

const Chatbot = ({ onGenerateDashboard }) => {
  const [query, setQuery] = useState("");
  const [conversation, setConversation] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const [threadId, setThreadId] = useState(() => {
    // Generate new thread ID on initial page load only
    const storedThreadId = sessionStorage.getItem('threadId');
    if (!storedThreadId) {
      const newThreadId = uuidv4();
      sessionStorage.setItem('threadId', newThreadId);
      return newThreadId;
    }
    return storedThreadId;
  });


  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversation]);

  const handleSend = async () => {
    if (!query.trim()) return;

    const newMessage = { sender: "User", text: query };
    setConversation((prev) => [...prev, newMessage]);
    setIsLoading(true);

    try {
      const response = await axios.post("http://localhost:5000/api/query", {
        query,
        threadId,
      });

      if (response.status === 200) {
        const dashboardData = await getDataByThreadId(threadId);
        console.log(dashboardData);
        onGenerateDashboard(dashboardData, sessionStorage.getItem('threadId'));
        setConversation((prev) => [
          ...prev,
          { sender: "Bot", text: "Dashboard generated successfully!" },
        ]);
      } else {
        setConversation((prev) => [
          ...prev,
          {
            sender: "Bot",
            text: "Error generating dashboard. Please try again.",
          },
        ]);
      }
    } catch (error) {
      setConversation((prev) => [
        ...prev,
        {
          sender: "Bot",
          text: "Error generating dashboard. Please try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }

    setQuery("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {conversation.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 space-y-4">
            <Bot className="w-12 h-12" />
            <div>
              <p className="text-lg font-medium mb-2">Welcome to Dashboard Builder!</p>
              <p className="text-sm">Ask me to create any dashboard you need.</p>
            </div>
          </div>
        )}
        {conversation.map((msg, index) => (
          <div
            key={index}
            className={`flex gap-3 ${
              msg.sender === "User" ? "justify-end" : "justify-start"
            }`}
          >
            {msg.sender === "Bot" && (
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                <Bot className="w-5 h-5 text-blue-600" />
              </div>
            )}
            <div
              className={`max-w-[80%] p-4 rounded-2xl ${
                msg.sender === "User"
                  ? "bg-blue-600 text-white rounded-br-none"
                  : "bg-white shadow-sm border border-gray-200 rounded-bl-none"
              }`}
            >
              {msg.text}
            </div>
            {msg.sender === "User" && (
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                <User className="w-5 h-5 text-white" />
              </div>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
              <Bot className="w-5 h-5 text-blue-600" />
            </div>
            <div className="bg-white shadow-sm border border-gray-200 p-4 rounded-2xl rounded-bl-none">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-white border-t border-gray-200">
        <div className="flex gap-3 max-w-4xl mx-auto">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about your dashboard..."
            className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            onClick={handleSend}
            disabled={isLoading}
            className={`p-3 rounded-lg transition-colors ${
              isLoading
                ? "bg-gray-100 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;