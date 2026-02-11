import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  sendMessage,
  getMyChatSessions,
  getChatMessages,
} from "../controllers/chatController.js";

const router = express.Router();

router.post("/send", protect, sendMessage);
router.get("/sessions", protect, getMyChatSessions);
router.get("/messages/:sessionId", protect, getChatMessages);

export default router;
