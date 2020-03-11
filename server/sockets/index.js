module.exports = (io) => {
    console.log('connecting to sockets...');
    //socket configuration
    let onlineUsers = [];
    io.on('connection', function (socket) {
        socket.on('user name', (user) => {
            const details = { profileName: user.profileName, sessionId: socket.id };
            onlineUsers.push(details);
            io.emit('connectedUsers', onlineUsers); //io.sockets.emit == io.emit
        });

        socket.on('disconnect', function () {
            onlineUsers = onlineUsers.filter((user) => user.sessionId !== socket.id);
            io.emit('connectedUsers', onlineUsers);
            // socket.leave(group);
        });

        //personal chat
        socket.on('chatting', function (message, sender, receiver) {
            socket.to(receiver).emit('receiverPeer', message, socket.id, receiver);
            socket.emit('senderPeer', message, socket.id, receiver);
        });

        //group chat
        socket.on('assign users', function (group) {
            socket.join(group);
        });
        socket.on('leave group', function (group) {
            socket.leave(group);
        });
        socket.on('send group message', function (group, senderId, senderName, message, createdAt) {
            socket.in(group).emit('group message', { message, senderId, senderName }); //for users of joined in current session
            socket.emit('sender group message', { message, senderId, senderName }); //for all users of the group
        });
    });

    return io;
}
