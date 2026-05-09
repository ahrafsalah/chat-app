import express from "express";
import {
  checkAuth,
  logout,
  signIn,
  signup,
  updateProfile,
} from "../controllers/users.controller.js";
import upload from "../middleware/multer.js";
import authenticate from "../middleware/auth.middleware.js";

const authRouter = express.Router();

authRouter.post("/signup", signup);
authRouter.post("/signin", signIn);
authRouter.post("/logout", logout);
authRouter.put(
  "/update-profile",
  authenticate,
  upload.single("profilePic"),
  updateProfile,
);
authRouter.get("/check-auth", authenticate, checkAuth);

export default authRouter;
