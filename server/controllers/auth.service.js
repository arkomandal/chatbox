const config = require('../jwt/jwt-config.js');
const jwt = require('jsonwebtoken');
const db = require('../models/index');
const bcrypt = require('bcrypt');

exports.authenticate = async ({ phone, password }) => {
    const user = await db.user.findOne({ phone: phone });
    if (user) {
        let match = await bcrypt.compare(password, user.password);
        if (match) {
            const token = jwt.sign({ sub: user.id }, config.secret, {
                expiresIn: '1h' // expires in 1 hour
            });
            const { password, ...userWithoutPassword } = user._doc;
            return {
                ...userWithoutPassword,
                token
            };
        }
    }
}