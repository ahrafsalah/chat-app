import express from 'express';
import dotenv from 'dotenv';
import connectDb from './lib/db.js';
import authRouter from './routes/auth.route.js';
import connectCloudinary from './lib/cloudinary.js';
import jsend from 'jsend';
import cookieParser from 'cookie-parser';
import messageRouter from './routes/message.route.js';
import cors from 'cors';
import { app, server } from './lib/socket.js';



dotenv.config();
connectCloudinary();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin:"http://localhost:3000",
  credentials:true
}))

app.use('/api/auth', authRouter);
app.use('/api/messages', messageRouter);

app.use((err, req, res, next) => {
  res.status(500).json(
    jsend.error({
      status: "error",
      code: 500,     
      message: err.message,
      data: false,
    })
  );
});

server.listen(process.env.PORT , ()=>{
    console.log("Server is running on port " + process.env.PORT);  
    connectDb()  
})