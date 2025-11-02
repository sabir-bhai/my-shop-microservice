// routes/chatRoutes.ts
import express from "express";
import {
  getInboxUsers,
  getMessagesWithAdmin,
  getMyMessages,
  sendMessage,
} from "../controller/chat.controller";

const router = express.Router();

router.post("/send", sendMessage);
router.get("/:userId/messages", getMessagesWithAdmin);
router.get("/me", getMyMessages);
router.get("/inbox-users", getInboxUsers);

export default router;
