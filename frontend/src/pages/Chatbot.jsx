import React, { useEffect, useState } from "react";
import api from "../services/api";
import ChatSidebar from "../components/ChatSidebar";
import ChatWindow from "../components/ChatWindow";

const Chatbot = () => {
  const [sessions, setSessions] = useState([]);
  const [activeSession, setActiveSession] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(false);

  // ---------------- Fetch Sessions ----------------
  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const res = await api.get("/chat/sessions");
        setSessions(res.data);
      } catch (err) {
        console.error("Failed to load sessions", err);
      }
    };
    fetchSessions();
  }, []);

  // ---------------- Load Messages ----------------
  const loadMessages = async (session) => {
    try {
      setLoadingMessages(true);
      setActiveSession(session);
      const res = await api.get(`/chat/messages/${session._id}`);
      setMessages(res.data);
    } catch (err) {
      console.error("Failed to load messages", err);
    } finally {
      setLoadingMessages(false);
    }
  };

  // ---------------- Send Message ----------------
  const sendMessage = async ({ text, reportId, newChat }) => {
    try {
      const payload = {
        message: text,
        newChat,
        reportId: reportId || activeSession?.linkedReport || null,
        sessionId: newChat ? null : activeSession?._id,
      };

      const res = await api.post("/chat/send", payload);

      if (newChat) {
        setSessions((prev) => [res.data, ...prev]);
        setActiveSession({ _id: res.data.sessionId });
      }

      if (res.data.userMessage) {
        setMessages((prev) => [
          ...prev,
          { sender: "user", message: res.data.userMessage },
        ]);
      }

      if (res.data.assistantMessage) {
        setMessages((prev) => [
          ...prev,
          { sender: "assistant", message: res.data.assistantMessage.message },
        ]);
      }
    } catch (err) {
      console.error("Send message failed", err);
    }
  };

  return (
    <div className="h-screen w-full flex bg-[#f8fafc] overflow-hidden">

      {/* Sidebar */}
      <aside className="w-72 shrink-0 border-r border-gray-200 bg-white">
        <ChatSidebar
          sessions={sessions}
          activeSession={activeSession}
          onSelect={loadMessages}
          onNewChat={() => {
            setActiveSession(null);
            setMessages([]);
          }}
        />
      </aside>

      {/* Chat Window */}
      <main className="flex-1 flex flex-col bg-gradient-to-br from-white to-green-50">
        <ChatWindow
          messages={messages}
          loading={loadingMessages}
          onSend={sendMessage}
          activeSession={activeSession}
        />
      </main>
    </div>
  );
};

export default Chatbot;
