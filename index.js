/* eslint-disable no-unused-vars */
import Express from "express";
import mongoose from "mongoose";
import * as dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { Server } from "socket.io";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = Express();
dotenv.config();

mongoose
  .set("strictQuery", true)
  .connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log(err);
  });

const server = app.listen(process.env.PORT, () => {
  console.log(`Server started on port ${process.env.PORT}`);
});

// Socket.io funcs

const io = new Server(server);

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("chat", (msg) => {
    io.emit("chat", { message: msg, id: socket.id });
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});
