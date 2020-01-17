const expressJwt = require('express-jwt');
const config = require('./jwt-config.js');

function jwt() {
    const { secret } = config;
    return expressJwt({ secret }).unless({
        path: [
            // public routes that don't require authentication
            '/user/authenticate',
            '/user/add'
        ]
    });
}

module.exports = jwt;