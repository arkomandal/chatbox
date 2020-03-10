var express = require('express');
var router = express.Router();
const map = require('../controllers/map.controller.js');

router.post('/add_user_to_group', map.addUserToGroup);
router.delete('/remove_user_from_group/:groupId/:userId', map.removeUserFromGroup);
router.get('/users_by_group/:groupId', map.usersByGroup);

module.exports = router;