//https://socket.io/docs/emit-cheatsheet/
const db = require('../models');
module.exports = (io) => {
    io.on('connection', function (socket) { //socket is a tab with same port

        //connection management
        socket.on('connectedUsers', async function () {
            const users = await db.session.aggregate([{ $match: {} }]);
            io.emit('connectedUsers', { users: users });
        });
        socket.on('disconnect', async function () {
            const users = await db.session.aggregate([{ $match: {} }]);
            io.emit('connectedUsers', { users: users });
        });

        //group chat management
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

        //personal chat management
        socket.on('messagePersonal', function (socket_id, senderId, senderName, message, createdAt) {
            io.to(socket_id).emit('messagePersonal', { message, senderId, senderName });
            socket.emit('messagePersonalToSameUser', { message, senderId, senderName })
        });
        socket.on('typingPersonal', function (socket_id, senderName) {
            io.to(socket_id).emit('typingPersonal', { senderName });
        });

        //session management (this is for same user in another tab/socket)
        socket.on('sessionOut', function (data) {
            io.to(data.socket_id).emit('sessionOut', { socket_id: data.socket_id });
        });

    });

    console.log('sockets are ready');

    return io;
}