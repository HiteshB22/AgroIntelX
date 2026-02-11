import React, { useState } from "react";
import { Send } from "lucide-react";

const ChatInput = ({ onSend, activeSession }) => {
  const [text, setText] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    onSend({
      text,
      newChat: !activeSession,
    });

    setText("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 bg-white border-t flex gap-3"
    >
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Ask about your soil, crops, fertilizers..."
        className="flex-1 border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-600"
      />

      <button
        type="submit"
        className="bg-green-700 text-white px-4 py-2 rounded-md hover:bg-green-800"
      >
        <Send size={18} />
      </button>
    </form>
  );
};

export default ChatInput;
