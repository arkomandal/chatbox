const PORT = 5000;
const bodyParser = require("body-parser");
const express = require("express");
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const cors = require('cors');
const jwt = require('./jwt/jwt');
const errorHandler = require('./jwt/error-handler');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.use(jwt());
app.use(errorHandler);

app.use('/group', require('./routes/group.route'));
app.use('/user', require('./routes/user.route'));
app.use('/map', require('./routes/map.route'));
app.use('/message', require('./routes/message.route'));

http.listen(PORT, () => {
    console.log("Server is listening on port ", PORT);
});

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
    socket.on('send group message', function (group, sender, message, time) {
        socket.in(group).emit('group message', { message, sender, time });
        socket.emit('sender group message', { message, sender, time });
    });
    socket.on('leave group', function (group) {
        socket.leave(group);
    });
});