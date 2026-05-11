import jwt from "jsonwebtoken";

export const generateToken = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.cookie("token", token, {
    httpOnly: true,
    secure:true,
    sameSite: process.env.NODE_ENV === "production" ? "none" : "Lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return token;
};
