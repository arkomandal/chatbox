const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MessageSchema = new Schema({
    message: String,
    sender: Schema.Types.ObjectId,
    receiver_type: String, //personal: 1; group: 2
    receiver: Schema.Types.ObjectId
}, {
    timestamps: true
});

module.exports = mongoose.model('Message', MessageSchema);