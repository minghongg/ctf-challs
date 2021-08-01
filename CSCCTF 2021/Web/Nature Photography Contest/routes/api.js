const express = require('express');

const {body} = require('express-validator/check');

const User = require('../models/user');

const apiController = require('../controllers/api');

const router = express.Router();

const isAuth = require('../middleware/verify-jwt');

//register
router.post('/register',
    [
        body('firstName')
        .trim()
        .not().isEmpty()
        .withMessage("First name can not be empty")
        .isLength({max : 15})
        .withMessage("Maximum first name length is 15 characters"),

        body('lastName')
        .trim()
        .not().isEmpty()
        .withMessage("Last name can not be empty")
        .isLength({max : 15})
        .withMessage("Maximum last name length is 15 characters"),

        body('email')
        .isEmail()
        .withMessage('Please enter a valid email')
        .custom((value, {req}) => {
            return User.findOne({email : value}).then(user => {
                if(user){
                    return Promise.reject("Email address already exists");
                }
            });
        })
        .normalizeEmail(),

        body('password')
        .trim()
        .isLength({max:16})
        .withMessage("Maximum password length is 16 characters")
    ], apiController.postRegister);

router.post('/login',apiController.postLogin);

router.get('/profile', apiController.getProfile);

router.post('/profile', 
    [
        body('firstName')
        .trim()
        .not().isEmpty()
        .withMessage("First name can not be empty")
        .isLength({max : 15})
        .withMessage("Maximum first name length is 15 characters"),

        body('lastName')
        .trim()
        .not().isEmpty()
        .withMessage("Last name can not be empty")
        .isLength({max : 15})
        .withMessage("Maximum last name length is 15 characters"),

        body('email')
        .isEmail()
        .withMessage('Please enter a valid email')
        .normalizeEmail(),

    ], isAuth, apiController.updateProfile);

router.post('/upload',
    [
        body('firstName')
        .trim()
        .not().isEmpty()
        .withMessage("First name can not be empty")
        .isLength({max : 15})
        .withMessage("Maximum first name length is 15 characters"),

        body('lastName')
        .trim()
        .not().isEmpty()
        .withMessage("Last name can not be empty")
        .isLength({max : 15})
        .withMessage("Maximum last name length is 15 characters"),

        body('email')
        .isEmail()
        .withMessage('Please enter a valid email')
        .normalizeEmail(),

        body('link')
        .isURL()
        .withMessage('Please enter a valid link')

    ], isAuth, apiController.upload);
module.exports = router;