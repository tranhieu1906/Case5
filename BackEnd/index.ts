import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import Token from "./src/middlewares/jwt.middleware";
import { AppDataSource } from "./src/config/data-source";
import { Post } from "./src/router/postRouter";
import { router } from "./src/router/userRouter";
import { chatRouter } from "./src/router/chatRouter";
import { messageRouter } from "./src/router/messageRouter";
import http from "http";
import { Server } from "socket.io";
const PORT = process.env.PORT || 8080;

// thiết lập kết nối cơ sở dữ liệu
AppDataSource.initialize()
  .then(() => {
    console.log("Data Source has been initialized!");
  })
  .catch((err) => {
    console.error("Error during Data Source initialization:", err.message);
  });

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());

app.use("/api/v1", router);
app.use(Token.veryfyAccessToken);
app.use("/api/v1", Post);
app.use("/api/v1", chatRouter);
app.use("/api/v1", messageRouter);

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    status: err.status || 500,
    message: err.message,
  });
});

const server = app.listen(PORT, () => {
  console.log("App running with port: " + PORT);
});

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
  },
});

let onlineUsers = [];
const addNewUser = (username, socketId) => {
  !onlineUsers.some((user) => user.username === username) &&
    onlineUsers.push({ username, socketId });
};

const removeUser = (socketId) => {
  onlineUsers = onlineUsers.filter((user) => user.socketId !== socketId);
};

const getUser = (username) => {
  return onlineUsers.find((user) => user.username === username);
};

io.on("connection", (socket) => {
  socket.on("setup", (userData) => {
    socket.join(userData._id);
    console.log(userData.id);
  });

  socket.on("join_room", (data) => {
    socket.join(data);
    console.log(`User with ID: ${socket.id} joined room: ${data}`);
  });

  socket.on("sendText", ({ senderName, receiverName, text }) => {
    const receiver = getUser(receiverName);
    io.to(receiver.socketId).emit("getText", {
      senderName,
      text,
    });
  });

  socket.on("newUser", (username) => {
    addNewUser(username, socket.id);
  });

  socket.on("sendNotification", ({ senderName, receiverName, type }) => {
    const receiver = getUser(receiverName);
    console.log("🚀 ~ file: index.ts:96 ~ socket.on ~ receiver", receiver)
    io.to(receiver.socketId).emit("getNotification", {
      senderName,
      type,
    });
  });

  //   socket.on("send_message", (data) => {
  //     socket.to(data.room).emit("receive_message", data);
  //   });

  socket.on("disconnect", () => {
  });
});
