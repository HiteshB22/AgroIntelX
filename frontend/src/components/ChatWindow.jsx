import React, { useEffect, useRef, useState } from "react";
import { Send, Bot, User } from "lucide-react";

/* ---------------- Assistant Message Formatter ---------------- */
const formatAssistantMessage = (text) => {
  if (!text) return null;

  const lines = text.split("\n").filter(Boolean);

  return (
    <div className="space-y-2">
      {lines.map((line, i) => {
        const cleanLine = line.replace(/\*\*/g, "").trim();

        // Section Headings
        if (
          cleanLine.toLowerCase().includes("soil pH") ||
          cleanLine.toLowerCase().includes("nutrient") ||
          cleanLine.toLowerCase().includes("micronutrient") ||
          cleanLine.toLowerCase().includes("recommended crops") ||
          cleanLine.toLowerCase().includes("summary")
        ) {
          return (
            <h4
              key={i}
              className="text-green-700 font-semibold mt-3 border-b border-green-200 pb-1"
            >
              🌱 {cleanLine}
            </h4>
          );
        }

        // Warnings (Do not apply / Avoid)
        if (
          cleanLine.toLowerCase().includes("do not apply") ||
          cleanLine.toLowerCase().includes("avoid")
        ) {
          return (
            <div
              key={i}
              className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-md text-sm"
            >
              ⚠️ {cleanLine}
            </div>
          );
        }

        // Positive Recommendations
        if (
          cleanLine.toLowerCase().includes("recommended") ||
          cleanLine.toLowerCase().includes("apply") ||
          cleanLine.toLowerCase().includes("focus on")
        ) {
          return (
            <div
              key={i}
              className="bg-green-50 border border-green-200 text-green-800 px-3 py-2 rounded-md text-sm"
            >
              ✅ {cleanLine}
            </div>
          );
        }

        // Bullet points
        if (cleanLine.startsWith("*")) {
          return (
            <li key={i} className="ml-5 list-disc text-gray-700 text-sm">
              {cleanLine.replace("*", "")}
            </li>
          );
        }

        // Normal paragraph
        return (
          <p key={i} className="text-gray-700 text-sm leading-relaxed">
            {cleanLine}
          </p>
        );
      })}
    </div>
  );
};

/* ---------------- Main Component ---------------- */
const ChatWindow = ({ messages, loading, onSend, activeSession }) => {
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    onSend({
      text: input,
      newChat: !activeSession,
    });

    setInput("");
  };

  return (
    <div className="flex flex-col h-full">

      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 bg-white">
        <h2 className="text-lg font-semibold text-gray-800">
          🌱 AgroIntelX AI Assistant
        </h2>
        <p className="text-sm text-gray-500">
          Ask about soil health, crops, fertilizers, and reports
        </p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5">
        {messages.length === 0 && !loading && (
          <div className="text-center text-gray-500 mt-20">
            <p className="text-lg font-medium">Start a new conversation</p>
            <p className="text-sm mt-2">
              Ask about your soil report, crops, or fertilizer plan.
            </p>
          </div>
        )}

        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex items-start gap-3 ${
              msg.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {msg.sender === "assistant" && (
              <div className="p-2 rounded-full bg-green-100 text-green-700">
                <Bot size={18} />
              </div>
            )}

            <div
              className={`max-w-[72%] px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
                msg.sender === "user"
                  ? "bg-green-700 text-white rounded-br-sm"
                  : "bg-white text-gray-800 border border-gray-200 rounded-bl-sm"
              }`}
            >
              {msg.sender === "assistant"
                ? formatAssistantMessage(msg.message)
                : msg.message}
            </div>

            {msg.sender === "user" && (
              <div className="p-2 rounded-full bg-gray-200 text-gray-700">
                <User size={18} />
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2 text-gray-500">
            <Bot size={16} />
            <span className="text-sm italic">AgroIntelX is thinking...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form
        onSubmit={handleSubmit}
        className="border-t border-gray-200 bg-white p-4 flex items-center gap-3"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about soil, crops, fertilizers..."
          className="flex-1 px-4 py-3 rounded-xl border border-gray-300 bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500"
        />

        <button
          type="submit"
          className="bg-green-700 hover:bg-green-800 text-white p-3 rounded-xl transition shadow"
        >
          <Send size={18} />
        </button>
      </form>
    </div>
  );
};

export default ChatWindow;
