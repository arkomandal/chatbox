const authService = require('./auth.service');
const db = require('../models/index');
const bcrypt = require('bcrypt');

exports.create = async (req, res) => {
    authService.authenticate(req.body).then(async user => {
        if (!user) res.status(400).json({ message: 'Username or password is incorrect' })
        else {
            const session = new db.session({ user_id: user._id, socket_id: req.body.socket_id });
            await session.save();
            res.json(user);
        }
    }).catch(err => next(err));
}

exports.status = async (req, res) => {
    const { phone, password } = req.body;
    const user = await db.user.findOne({ phone: phone });
    const match = await bcrypt.compare(password, user.password);

    if (!match) res.send({ active: false, userId: user._id, socket_id: '' });
    else {
        const session = await db.session.findOne({ user_id: user._id });
        if (session) res.send({ active: true, userId: user._id, socket_id: session.socket_id });
        else res.send({ active: false, userId: user._id, socket_id: '' });
    }
}

exports.delete = async (req, res) => {
    const session = await db.session.findOneAndRemove({ user_id: req.body.userId });
    res.send(session);
}