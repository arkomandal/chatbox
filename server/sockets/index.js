module.exports = (io) => {
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
        socket.on('send group message', function (group, sender, message) {
            socket.in(group).emit('group message', message, sender);
            socket.emit('sender group message', message);
        });
        socket.on('leave group', function (group) {
            socket.leave(group);
        });
    });
}
