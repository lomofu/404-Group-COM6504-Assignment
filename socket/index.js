module.exports = socket => {
    console.log(socket)

    socket.on('join room', (room, username) => {
        console.log(`${username} has join in ${room}`);
        socket.join(room);
        socket.to(room).emit('joined', room, username);
    })
}
