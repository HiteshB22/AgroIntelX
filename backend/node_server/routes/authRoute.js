import express from "express";
import { signup, signin, logout, me } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", signin);
router.post("/logout", logout);
router.get("/me", protect, me);

export default router;

