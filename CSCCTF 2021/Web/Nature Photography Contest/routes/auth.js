const express = require('express');

const {body} = require('express-validator/check');

const authController = require('../controllers/auth');

const User = require('../models/user');

const router = express.Router();

router.get('/login', authController.getLogin);

router.get('/register', authController.getRegister);


module.exports = router;