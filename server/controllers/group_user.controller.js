const db = require('../models/index');

exports.map = async (req, res) => {
    const group_user = new db.group_user(req.body);
    await group_user.save();
    res.send(group_user);
};