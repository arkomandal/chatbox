var express = require('express');
var router = express.Router();
const message = require('../controllers/message.controller.js');

router.post('/add', message.create);
router.get('/list/:sender/:receiver_type/:receiver/:page/:filter/*', message.findAll);
router.get('/:messageId', message.findOne);
router.put('/:messageId', message.update);
router.delete('/:messageId', message.delete);

module.exports = router;