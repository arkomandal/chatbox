const PORT = 5000;
const bodyParser = require("body-parser");
const express = require("express");
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const cors = require('cors');
const jwt = require('./jwt/jwt');
const errorHandler = require('./jwt/error-handler');
const socket = require('./sockets');

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
    socket(io);
});