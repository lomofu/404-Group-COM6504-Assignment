/** @format */
const roomService = require("../service/roomService");

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
        roomService.updateRoomMemberNum(roomId, getMembersByRoomId(roomId).length);
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

      socket.on("send_KLGraph", (roomId, name, row) => {
        socket.join(roomId);
        socket.broadcast.to(roomId).emit("received_KLGraph", name, row);
      });

      socket.on(
        "draw",
        (
          roomId,
          name,
          width,
          height,
          prevX,
          prevY,
          currX,
          currY,
          color,
          thickness,
        ) => {
          socket.join(roomId);
          socket.broadcast
            .to(roomId)
            .emit(
              "received_draw",
              roomId,
              name,
              width,
              height,
              prevX,
              prevY,
              currX,
              currY,
              color,
              thickness,
            );
        },
      );

      socket.on('clear', (roomId, name, width, height) => {
        socket.join(roomId);
        socket.broadcast.to(roomId).emit('received_clear', roomId, name, width, height);
      });



      socket.on("disconnect", () => {
        const { roomId, name } = cache.get(socket.id);
        console.log(`👋 User: ${name} has left room ${roomId}!`);
        cache.delete(socket.id);
        socket.broadcast.to(roomId).emit("left", name);
        roomService.updateRoomMemberNum(roomId, getMembersByRoomId(roomId).length);
      });
    } catch (e) {
      console.error(e);
    }
  });
};

const useCacheStore = () => cache;

const getMembersByRoomId = (id) =>
  [...cache.values()].filter((e) => e.roomId === id);

module.exports.cache = {
  useCacheStore,
  getMembersByRoomId,
};
