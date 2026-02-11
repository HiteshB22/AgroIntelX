import ChatSession from "../models/ChatSession.js";
import ChatMessage from "../models/ChatMessage.js";
import SoilReport from "../models/SoilReport.js";
import { generateChatResponse } from "../services/geminiChatService.js";

// ======================================================
// Create or continue chat
// ======================================================
export const sendMessage = async (req, res) => {
  try {
    const userId = req.user._id;
    const { sessionId, message, reportId, newChat } = req.body;

    if (!message) {
      return res.status(400).json({ message: "Message is required" });
    }

    let session;

    if (sessionId && !newChat) {
      session = await ChatSession.findOne({ _id: sessionId, userId });
      if (!session) {
        return res.status(404).json({ message: "Chat session not found" });
      }
    } else {
      if (!newChat && reportId) {
        session = await ChatSession.findOne({ userId, linkedReport: reportId });
      }

      if (!session) {
        session = await ChatSession.create({
          userId,
          linkedReport: reportId || null,
          title: message.substring(0, 80),
        });
      }
    }

    const lastMessage = await ChatMessage.findOne({ sessionId: session._id })
      .sort({ createdAt: -1 });

    if (
      lastMessage &&
      lastMessage.sender === "user" &&
      lastMessage.message === message
    ) {
      return res.status(200).json({
        sessionId: session._id,
        userMessage: message,
        assistantMessage: null,
        info: "Duplicate message ignored",
      });
    }

    await ChatMessage.create({
      sessionId: session._id,
      sender: "user",
      message,
    });

    const chatHistory = await ChatMessage.find({ sessionId: session._id })
      .sort({ createdAt: 1 })
      .limit(10);

    const soilReports = reportId
      ? await SoilReport.find({ _id: reportId, userId })
      : await SoilReport.find({ userId }).sort({ createdAt: -1 }).limit(3);

    const aiReply = await generateChatResponse({
      userMessage: message,
      soilReports,
      chatHistory,
    });

    const assistantMessage = await ChatMessage.create({
      sessionId: session._id,
      sender: "assistant",
      message: aiReply,
    });

    return res.json({
      sessionId: session._id,
      title: session.title,
      userMessage: message,
      assistantMessage,
    });
  } catch (err) {
    console.error("Chat error:", err.message);
    res.status(500).json({ message: "Chatbot failed to respond" });
  }
};

// ======================================================
// Get all chat sessions for user
// ======================================================
export const getMyChatSessions = async (req, res) => {
  try {
    const sessions = await ChatSession.find({ userId: req.user._id })
      .sort({ createdAt: -1 });

    res.json(sessions);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch chat sessions" });
  }
};

// ======================================================
// Get messages for a session
// ======================================================
export const getChatMessages = async (req, res) => {
  try {
    const { sessionId } = req.params;

    const messages = await ChatMessage.find({ sessionId })
      .sort({ createdAt: 1 });

    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch messages" });
  }
};
