module.exports = (io) => {
    //socket configuration
    let onlineUsers = [];
    //socket is a tab with same port
    io.on('connection', function (socket) {
        // socket.on('user name', (user) => {
        //     const details = { profileName: user.profileName, sessionId: socket.id };
        //     onlineUsers.push(details);
        //     io.emit('connectedUsers', onlineUsers); //io.sockets.emit == io.emit
        // });

        // socket.on('disconnect', function () {
        //     onlineUsers = onlineUsers.filter((user) => user.sessionId !== socket.id);
        //     io.emit('connectedUsers', onlineUsers);
        //     // socket.leave(group);
        // });

        // //personal chat
        // socket.on('chatting', function (message, sender, receiver) {
        //     socket.to(receiver).emit('receiverPeer', message, socket.id, receiver);
        //     socket.emit('senderPeer', message, socket.id, receiver);
        // });

        //group chat
        socket.on('subscribe', function (group) {
            socket.join(group);
        });
        socket.on('unsubscribe', function (group) {
            socket.leave(group);
        });
        socket.on('send group message', function (group, senderId, senderName, message, createdAt) {
            io.in(group).emit('group message', { message, senderId, senderName }); //send to room including you (io)
        });
        socket.on('typing', function (group, senderName) {
            socket.in(group).emit('typing', { senderName }); //send to room excluding you (socket)
        });
    });
    console.log('sockets are ready');
    return io;
}
