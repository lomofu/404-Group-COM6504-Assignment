exports.init = function(io) {
    io.sockets.on('connection', function (socket) {
        try {
            // Create or join a room.
            socket.on('create or join', function (room, userId) {
                console.log(`${userId} has join in ${room}`);
                socket.join(room);
                chat.to(room).emit('joined', room, userId);

            socket.on('chat', function (room, userId, chatText) {
                io.sockets.to(room).emit('chat', room, userId, chatText);
            });

            socket.on('disconnect', function(){
                console.log('someone disconnected');
            });

            });
        } catch (e) {
        }
    });
}
