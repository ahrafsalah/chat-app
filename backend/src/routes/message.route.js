import express from "express";
import authenticate from "../middleware/auth.middleware.js";
import {
  getMessages,
  getUsersForSidebar,
  sendMessage,
} from "../controllers/message.controller.js";
import upload from "../middleware/multer.js";
const messageRouter = express.Router();

messageRouter.get("/users", authenticate, getUsersForSidebar);
messageRouter.get("/:id", authenticate, getMessages);
messageRouter.post(
  "/send/:id",
  authenticate,
  upload.single("image"),
  sendMessage,
);
export default messageRouter;
