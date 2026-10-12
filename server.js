const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const PORT = process.env.PORT || 3000;
const rooms = new Map(); // roomId -> Set(socketId)

app.use(express.static(path.join(__dirname, "public")));

io.on("connection", (socket) => {
  socket.on("join-room", ({ roomId } = {}, reply = () => {}) => {
    roomId = String(roomId || "").trim().replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 40);
    if (!roomId) return reply({ ok: false, error: "Digite um código de sala válido." });

    let members = rooms.get(roomId);
    if (!members) {
      members = new Set();
      rooms.set(roomId, members);
    }
    if (members.size >= 2) return reply({ ok: false, error: "Esta sala já tem 2 pessoas." });

    socket.data.roomId = roomId;
    socket.join(roomId);
    members.add(socket.id);
    reply({ ok: true, roomId, isInitiator: members.size === 2 });
    socket.to(roomId).emit("peer-joined");
  });

  socket.on("signal", ({ roomId, data } = {}) => {
    if (!roomId || socket.data.roomId !== roomId || !rooms.has(roomId)) return;
    socket.to(roomId).emit("signal", data);
  });

  socket.on("leave-room", () => leaveRoom(socket));
  socket.on("disconnect", () => leaveRoom(socket));
});

function leaveRoom(socket) {
  const roomId = socket.data.roomId;
  if (!roomId) return;
  const members = rooms.get(roomId);
  if (members) {
    members.delete(socket.id);
    socket.to(roomId).emit("peer-left");
    if (members.size === 0) rooms.delete(roomId);
  }
  socket.leave(roomId);
  delete socket.data.roomId;
}

server.listen(PORT, () => console.log(`Tela Duo disponível em http://localhost:${PORT}`));
