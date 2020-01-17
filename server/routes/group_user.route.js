var express = require('express');
var router = express.Router();
const group_user = require('../controllers/group_user.controller.js');

router.post('/group_user', group_user.map);

module.exports = router;