/** @format */
const cache = new Map();

module.exports = (server) => {
  const io = require("socket.io")(server);
  console.log("🚀 socket.io launched successfully!");

  io.sockets.on("connection", (socket) => {
    try {
      socket.on("create or join", (roomId, name) => {
        console.log(`👤 User: ${name} connected to room ${roomId}!`);
        socket.join(roomId);
        cache.set(socket.id, {
          roomId,
          name,
        });
        io.sockets.to(roomId).emit("joined", name);
      });

      socket.on("leave", (roomId, name) => {
        console.log(`👤 User: ${name} left room ${roomId}!`);
        socket.join(roomId);
        io.sockets.to(roomId).emit("left", name);
      });

      socket.on("send_chat", (roomId, name, message) => {
        socket.join(roomId);
        socket.broadcast.to(roomId).emit("received_chat", name, message);
      });

      socket.on("send_emoji", (roomId, name, message) => {
        socket.join(roomId);
        socket.broadcast.to(roomId).emit("received_emoji", name, message);
      });

      socket.on('draw', (roomId, name, width, height, prevX, prevY, currX, currY, color, thickness) => {
        // io.sockets.to(roomId).emit('draw', room, userId, width, height, prevX, prevY, currX, currY, color, thickness);
      });

      socket.on("disconnect", () => {
        console.log(cache.get(socket.id));
        const { roomId, name } = cache.get(socket.id);
        console.log(`👋 User: ${name} has left room ${roomId}!`);
        socket.broadcast.to(roomId).emit("left", name);
      });
    } catch (e) {
      console.error(e);
    }
  });
};

module.exports.cache = cache;
