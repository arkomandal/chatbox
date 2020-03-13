const express = require('express');
const router = express.Router();
const user = require('../controllers/user.controller.js');

router.post('/add', user.create);
router.get('/list/:page/:filter/*', user.findAll);
router.get('/list/full', user.getFullList);
router.get('/:userId', user.findOne);
router.put('/:userId', user.update);
router.delete('/:userId', user.delete);

module.exports = router;