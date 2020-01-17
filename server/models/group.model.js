const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const GroupSchema = new Schema({
    group_name: String
}, {
    timestamps: true
});

module.exports = mongoose.model('Group', GroupSchema);