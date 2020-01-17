const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const GroupUserSchema = new Schema({
    group_id: Schema.Types.ObjectId,
    user_id: Schema.Types.ObjectId
}, {
    timestamps: false
});

module.exports = mongoose.model('GroupUser', GroupUserSchema);