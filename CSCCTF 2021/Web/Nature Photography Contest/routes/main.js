const express = require('express');

const {body} = require('express-validator/check');

const mainController = require('../controllers/main');

const router = express.Router();

const isAuth = require('../middleware/is-auth');

router.get('/', mainController.getIndex);

router.get('/profile', isAuth, mainController.getProfile);

router.get('/logout', isAuth, mainController.logout);

router.get('/upload', isAuth, mainController.getUpload);

module.exports = router;