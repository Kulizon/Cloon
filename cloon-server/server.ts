import { Socket } from "socket.io";
import { nanoid } from "nanoid";
const express = require("express");
const app = express();
const cors = require("cors");
const server = require("http").Server(app);
const io = require("socket.io")(server, { cors: { origin: "http://localhost:3000", methods: ["GET", "POST"] } });

app.use(cors());

io.on("connect", (socket: Socket) => {
  socket.on("new-room", (userID: string) => {
    const newRoomID = nanoid();

    io.to(userID).emit("new-room", newRoomID);
  });

  socket.on("join-room", (roomID: string, peerID: string) => {
    const prevClients = io.sockets.adapter.rooms.get(roomID);

    if (prevClients?.size === 2) {
      socket.emit("full-room");
      return;
    }
    socket.emit("join-room", roomID);

    socket.join(roomID);
    const clients = io.sockets.adapter.rooms.get(roomID);

    socket.to(roomID).emit("user-connected", Array.from(clients), peerID);

    socket.on("disconnect", () => {
      if (!clients) return;

      socket.to(roomID).emit("user-disconnected");
    });
  });

  socket.on("join-random-room", () => {
    const rooms = Object.fromEntries(io.sockets.adapter.rooms);
    const avalaibleRooms = [];

    for (const key in rooms) {
      const ids = Array.from(rooms[key]);
      if (ids.length === 1 && ids[0] !== key) {
        avalaibleRooms.push(key);
      }
    }

    let roomID = "";
    if (avalaibleRooms.length > 0) roomID = avalaibleRooms[Math.floor(Math.random() * avalaibleRooms.length)];
    else roomID = nanoid();

    socket.emit("join-random-room", roomID);
  });

  socket.on("disconnect-user", (roomID: string) => {
    const clients = io.sockets.adapter.rooms.get(roomID);
    if (!clients) return;

    socket.to(roomID).emit("user-disconnected");
    socket.leave(roomID);
  });

  // messages

  socket.on("new-message", (message: { userID: string; message: string; id: string }, roomID: string) => {
    socket.to(roomID).emit("new-message", { ...message });
  });

  // audio && video

  socket.on("unmute-mic", (roomID: string) => {
    socket.to(roomID).emit("unmute-mic");
  });

  socket.on("mute-mic", (roomID: string) => {
    socket.to(roomID).emit("mute-mic");
  });

  socket.on("unmute-cam", (roomID: string) => {
    socket.to(roomID).emit("unmute-cam");
  });

  socket.on("mute-cam", (roomID: string) => {
    socket.to(roomID).emit("mute-cam");
  });

  // activities

  socket.on("select-activity", (activity: string, roomID: string) => {
    socket.emit("select-activity", activity);
    socket.to(roomID).emit("select-activity", activity);
  });

  socket.on("draw-canvas", (encodedCanvas: string, roomID: string) => {
    socket.to(roomID).emit("draw-canvas", encodedCanvas);
  });

  socket.on("clear-canvas", (roomID: string) => {
    socket.to(roomID).emit("clear-canvas");
  });

  socket.on("spin-wheel", (rotateValue: number, roomID: string) => {
    socket.to(roomID).emit("spin-wheel", rotateValue);
  });

  socket.on("change-wheel-options", (options: string[], roomID: string) => {
    socket.to(roomID).emit("change-wheel-options", options);
  });
});

server.listen(4000, () => {
  console.log("Listening on port 4000...");
});
