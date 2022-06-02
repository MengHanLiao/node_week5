var express = require('express');
var router = express.Router();
const userController = require('../controllers/users');
const handleErrorAsync = require('../services/handleErrorAsync')

router.get('/', userController.getAllUser);
router.post('/', userController.validateUser, handleErrorAsync(userController.registerUser));

module.exports = router;
