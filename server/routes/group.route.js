const express = require('express');
const router = express.Router();
const group = require('../controllers/group.controller.js');

router.post('/add', group.create);
router.get('/list/:page/:filter/*', group.findAll);
router.get('/:groupId', group.findOne);
router.put('/:groupId', group.update);
router.delete('/:groupId', group.delete);

module.exports = router;