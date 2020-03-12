const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SessionSchema = new Schema({
    user_id: String,
    socket_id: String
}, { timestamps: true });

module.exports = mongoose.model('Session', SessionSchema);