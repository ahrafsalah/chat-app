import User from "../models/users.model.js";
import bcrypt from "bcryptjs";
import { v2 as cloudinary } from "cloudinary";
import asyncHandler from "../middleware/asyncHandler.js";
import jsend from "jsend";
import { generateToken } from "../lib/utils.js";

const signup = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  if (password.length < 6) {
    return res
      .status(400)
      .json({ message: "Password must be at least 6 characters" });
  }
  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ message: "Please provide all required fields" });
  }

  const existedUser = await User.findOne({ email });

  if (existedUser) {
    return res.status(400).json({ message: "User already exists" });
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = new User({
    name,
    email,
    password: hashedPassword,
  });

  if (newUser) {
    generateToken(newUser._id, res);
    await newUser.save();
    res
      .status(201)
      .json(
        jsend.success({ message: "User created successfully", user: newUser }),
      );
  } else {
    res.status(400).json({ message: "Invalid user data" });
  }
});

const signIn = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Please provide all required fields" });
  }

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const isMatched = await bcrypt.compare(password, user.password);

  if (!isMatched) {
    return res.status(400).json({ message: "Invalid credentials" });
  }
  generateToken(user._id, res);
  res
    .status(200)
    .json(jsend.success({ message: "User signed in successfully" }));
});

const logout = asyncHandler(async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
    path: "/",
  });
  res.status(200).json({ message: "User logged out successfully" });
});

const updateProfile = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const imageFile = req.file;
  
  // 1. نجهز كائن (Object) يحتوي فقط على البيانات التي نريد تحديثها
  const updateData = {};

  // 2. إذا أرسل المستخدم اسماً جديداً، نضيفه للمجموعة
  if (name) {
    updateData.name = name;
  }

  // 3. إذا رفع المستخدم صورة جديدة، نرفعها لـ Cloudinary ثم نضيف الرابط للمجموعة
  if (imageFile) {
    const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
      resource_type: "image",
    });
    updateData.profilePic = imageUpload.secure_url;
  }

  // 4. نتحقق ما إذا كان هناك أي بيانات لتحديثها (سواء اسم أو صورة)
  if (Object.keys(updateData).length > 0) {
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updateData }, // نستخدم $set لتحديث الحقول الموجودة في updateData فقط
      { new: true }
    );

    res.status(200).json({
      message: "User profile updated successfully",
      user: updatedUser,
    });
  } else {
    // إذا لم يرسل لا اسم ولا صورة
    res.status(400).json({ message: "No data provided to update" });
  }
});

const checkAuth = asyncHandler(async (req, res) => {
  const user = req.user;

  if (!user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const foundUser = await User.findById(user._id).select("-password");

  if (!foundUser) {
    return res.status(401).json({ message: "User not found" });
  }

  res.status(200).json({
    message: "User is authenticated",
    user: foundUser,
  });
});
export { signup, signIn, logout, updateProfile, checkAuth };
