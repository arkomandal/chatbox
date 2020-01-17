var express = require('express');
var router = express.Router();
const user = require('../controllers/user.controller.js');

router.post('/authenticate', user.authenticate);
router.post('/add', user.create);
router.get('/list/:page/:filter/*', user.findAll);
router.get('/:userId', user.findOne);
router.put('/:userId', user.update);
router.delete('/:userId', user.delete);

module.exports = router;