import React from "react";
import { Plus, MessageSquare } from "lucide-react";

const ChatSidebar = ({ sessions, activeSession, onSelect, onNewChat }) => {
  return (
    <div className="h-full flex flex-col">

      {/* Header */}
      <div className="px-4 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800">
          💬 Chats
        </h2>
        <button
          onClick={onNewChat}
          className="mt-3 w-full flex items-center justify-center gap-2 bg-green-700 hover:bg-green-800 text-white py-2 rounded-lg text-sm"
        >
          <Plus size={16} /> New Chat
        </button>
      </div>

      {/* Sessions */}
      <div className="flex-1 overflow-y-auto px-2 py-3 space-y-2">
        {sessions.length === 0 && (
          <p className="text-sm text-gray-500 text-center mt-6">
            No conversations yet
          </p>
        )}

        {sessions.map((session) => (
          <button
            key={session._id}
            onClick={() => onSelect(session)}
            className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition ${
              activeSession?._id === session._id
                ? "bg-green-100 text-green-700"
                : "hover:bg-gray-100 text-gray-700"
            }`}
          >
            <MessageSquare size={16} />
            <span className="truncate">
              {session.title || "New Conversation"}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ChatSidebar;
