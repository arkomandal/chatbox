const express = require('express');
const router = express.Router();
const session = require('../controllers/session.controller.js');

router.post('/create', session.create);
router.post('/status', session.status); //if it was GET request, password would be seen
router.post('/delete', session.delete); //DELETE takes params, which isn't supported by jwt unless path

module.exports = router;