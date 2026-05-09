import { io, getReceiverSocketId } from "../lib/socket.js";
import asyncHandler from "../middleware/asyncHandler.js";
import Message from "../models/message.model.js";
import User from "../models/users.model.js";
import { v2 as cloudinary } from "cloudinary";
import jsend from "jsend";


const getUsersForSidebar = asyncHandler(async (req, res) => {
  const loggedInUserId = req.user._id;

  const users = await User.find({ _id: { $ne: loggedInUserId } }).select(
    "-password",
  );
  res.status(200).json(jsend.success({ users }));
});

const getMessages = asyncHandler(async (req, res) => {
  const myId = req.user._id;

  const receiverId = req.params.id;

  const messages = await Message.find({
    $or: [
      {
        senderId: myId,
        receiverId: receiverId,
      },
      {
        senderId: receiverId,
        receiverId: myId,
      },
    ],
  }).sort({ createdAt: 1 });
  res.status(200).json(jsend.success({ messages }));
});

const sendMessage = asyncHandler(async (req, res) => {
  const senderId = req.user._id;
  const receiverId = req.params.id;
  const { text } = req.body;
  const image = req.file;
  let imageUrl = null;
  if (image) {
    const imageUpload = await cloudinary.uploader.upload(image.path, {
      resource_type: "image",
    });
    imageUrl = imageUpload.secure_url;
  }
  const newMessage = new Message({
    senderId,
    receiverId,
    text,
    image: imageUrl,
  });
  await newMessage.save();

  const receiverSocketId = getReceiverSocketId(receiverId);
  if (receiverSocketId) {
    io.to(receiverSocketId).emit("newMessage", newMessage);
  }
  res
    .status(200)
    .json(jsend.success({ message: "Message sent successfully", newMessage }));
});


export { getUsersForSidebar, getMessages, sendMessage };
