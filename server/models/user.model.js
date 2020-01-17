const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    user_name: String,
    phone: String,
    password: String
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);