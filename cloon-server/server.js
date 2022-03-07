"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
var nanoid_1 = require("nanoid");
var express = require("express");
var app = express();
var cors = require("cors");
var server = require("http").Server(app);
var io = require("socket.io")(server, {
    cors: { origin: "*", methods: ["GET", "POST"] }
});
app.use(cors());
io.on("connect", function (socket) {
    socket.on("new-room", function (userID) {
        var newRoomID = (0, nanoid_1.nanoid)();
        io.to(userID).emit("new-room", newRoomID);
    });
    socket.on("join-room", function (roomID, peerID) {
        var prevClients = io.sockets.adapter.rooms.get(roomID);
        if ((prevClients === null || prevClients === void 0 ? void 0 : prevClients.size) === 2) {
            socket.emit("full-room");
            return;
        }
        socket.emit("join-room", roomID);
        socket.join(roomID);
        var clients = io.sockets.adapter.rooms.get(roomID);
        socket.to(roomID).emit("user-connected", Array.from(clients), peerID);
        socket.on("disconnect", function () {
            if (!clients)
                return;
            socket.to(roomID).emit("user-disconnected");
        });
    });
    socket.on("join-random-room", function () {
        var rooms = Object.fromEntries(io.sockets.adapter.rooms);
        var avalaibleRooms = [];
        for (var key in rooms) {
            var ids = Array.from(rooms[key]);
            if (ids.length === 1 && ids[0] !== key) {
                avalaibleRooms.push(key);
            }
        }
        var roomID = "";
        if (avalaibleRooms.length > 0)
            roomID = avalaibleRooms[Math.floor(Math.random() * avalaibleRooms.length)];
        else
            roomID = (0, nanoid_1.nanoid)();
        socket.emit("join-random-room", roomID);
    });
    socket.on("disconnect-user", function (roomID) {
        var clients = io.sockets.adapter.rooms.get(roomID);
        if (!clients)
            return;
        socket.to(roomID).emit("user-disconnected");
        socket.leave(roomID);
    });
    // messages
    socket.on("new-message", function (message, roomID) {
        socket.to(roomID).emit("new-message", __assign({}, message));
    });
    // audio && video
    socket.on("unmute-mic", function (roomID) {
        socket.to(roomID).emit("unmute-mic");
    });
    socket.on("mute-mic", function (roomID) {
        socket.to(roomID).emit("mute-mic");
    });
    socket.on("unmute-cam", function (roomID) {
        socket.to(roomID).emit("unmute-cam");
    });
    socket.on("mute-cam", function (roomID) {
        socket.to(roomID).emit("mute-cam");
    });
    // activities
    socket.on("select-activity", function (activity, roomID) {
        socket.emit("select-activity", activity);
        socket.to(roomID).emit("select-activity", activity);
    });
    socket.on("draw-canvas", function (encodedCanvas, roomID) {
        socket.to(roomID).emit("draw-canvas", encodedCanvas);
    });
    socket.on("clear-canvas", function (roomID) {
        socket.to(roomID).emit("clear-canvas");
    });
    socket.on("spin-wheel", function (rotateValue, roomID) {
        socket.to(roomID).emit("spin-wheel", rotateValue);
    });
    socket.on("change-wheel-options", function (options, roomID) {
        socket.to(roomID).emit("change-wheel-options", options);
    });
});
server.listen(4000, function () {
    console.log("Listening on port 4000...");
});
