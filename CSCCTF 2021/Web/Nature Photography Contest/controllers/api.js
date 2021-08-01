const User = require('../models/user');
const {validationResult} = require('express-validator/check');
const jwt = require('jsonwebtoken');
const xss = require('xss');
const puppeteer = require('puppeteer');
const sanitize = require('mongo-sanitize');
const {Builder, By, Key, until} = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const screen = {
    width: 640,
    height: 480
};

//register
exports.postRegister = (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        const error = new Error(errors.array()[0].msg);
        error.statusCode = 422;
        throw error;
    }
    const email = sanitize(xss(req.body.email.toString()));
    const password= sanitize(xss(req.body.password.toString()));
    const firstName = sanitize(xss(req.body.firstName.toString()));
    const lastName = sanitize(xss(req.body.lastName.toString()));
    
    const user = new User({
        email : email,
        password : password,
        firstName : firstName,
        lastName : lastName,
        aboutMe : "",
        isUploaded : false
    });

    user.save()
        .then(result => {
            res.status(201).json({
                message : "User Created!"
            })
        })
        .catch(err => {
            if(!err.statusCode){
                err.statusCode = 500;
            }
            next(err);
        })
}

//login
exports.postLogin = (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        const error = new Error(errors.array()[0].msg);
        error.statusCode = 422;
        throw error;
    }
    const email = sanitize(req.body.email.toString());
    const password= sanitize(req.body.password.toString());
    
    User.findOne({email : email, password:password})
    .then(user => {
        if(!user){
            const error = new Error('Invalid email or password');
            error.statusCode = 401;
            throw error;
        }
        const token = jwt.sign({
            email : user.email, 
            userId : user._id.toString()
        }, 'IYq@9A2SAjuk$sg$YJiKzz@c0%B')
        req.session.isLoggedIn = true;
        req.session.token = token;
        req.session.isUploaded = user.isUploaded;
        // req.sesssionTest.token = token;
        res.status(200).json({
            token:token,
            userId : user._id.toString()
        });
    })
    .catch(err => {
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    })
}

//fetch profile
exports.getProfile = (req,res,next) => {
    let token = req.session.token;
    const decodedToken = jwt.verify(token,'IYq@9A2SAjuk$sg$YJiKzz@c0%B');
    const userId = decodedToken.userId;
    User.findById(userId)
        .then(user => {
            if(!user){
                const error = new Error('User does not exist');
                error.statusCode = 404;
                throw error;
            }
            res.status(200).json({
                email : user.email,
                firstName : user.firstName,
                lastName : user.lastName,
                aboutMe : user.aboutMe
            });
        })
        .catch(err => {
            if(!err.statusCode){
                err.statusCode = 500;
            }
            next(err);
    })
};

exports.updateProfile = (req,res,next) => {
    const token = req.get('Authorization').split(' ')[1];
    const decodedToken = jwt.verify(token,'IYq@9A2SAjuk$sg$YJiKzz@c0%B');

    const userId = decodedToken.userId;
    const userEmail = decodedToken.email;
    const firstName = sanitize(xss(req.body.firstName.toString()));
    const lastName = sanitize(xss(req.body.lastName.toString()));
    const email = sanitize(xss(req.body.email.toString()));
    const aboutMe = sanitize(xss(req.body.aboutMe.toString()));

    const errors = validationResult(req);

    if(!errors.isEmpty()){
        const error = new Error(errors.array()[0].msg);
        error.statusCode = 422;
        throw error;
    }

    User.findOne({email : email})
        .then(user => {
            if(user && (email !== userEmail)){
                const error = new Error('Email address already exists');
                error.statusCode = 422;
                throw error;
            }
            return User.findById(userId)
        })
        .then(user => {
            if(!user){
                const error = new Error('User does not exist');
                error.statusCode = 404;
                throw error;
            }
            user.email = email;
            user.firstName = firstName;
            user.lastName = lastName;
            user.aboutMe = aboutMe;
            return user.save();
        })
        .then(result => {
            res.status(200).json({
                message : "User has been updated successfully"
            })
        })
        .catch(err => {
            if(!err.statusCode){
                err.statusCode = 500;
            }
            next(err);
        });
};

exports.upload = (req, res, next) => {
    const firstName = xss(req.body.firstName);
    const lastName = xss(req.body.lastName);
    const email = xss(req.body.email);
    const link = xss(req.body.link);

    const token = req.session.token;
    const decodedToken = jwt.verify(token,'IYq@9A2SAjuk$sg$YJiKzz@c0%B');

    const errors = validationResult(req);

    if(!errors.isEmpty()){
        const error = new Error(errors.array()[0].msg);
        error.statusCode = 422;
        throw error;
    }

    if(!link.startsWith("https://imgur.com")){
        const error = new Error('You must upload your photograph to http://imgur.com/');
        error.statusCode = 400;
        throw error;
    }

    if(req.session.isUploaded){
        const error = new Error('You can only upload your photograph once');
        error.statusCode = 403;
        throw error;
    }

    if(decodedToken.userId !== "60a62e37e36391245dbfbb97"){
        User.findByIdAndUpdate({_id : decodedToken.userId}, {isUploaded : true})
            .then(result => {
                req.session.isUploaded = true;
                res.status(200).json({
                    message : "Thank you! Your submission has been sent"
                })
            })
            .catch(err => {
                if(!err.statusCode){
                    err.statusCode = 500;
                }
                next(err);
            })
    }

    const sleep = (ms) => {
        return(new Promise(function(resolve, reject) {        
            setTimeout(function() { resolve(); }, ms);        
        }));    
    }
    
    const getLink = async() => {
        try{
            const browser = await puppeteer.launch({
                args: [
                    '--no-sandbox',
                    '--disable-setuid-sandbox'
                ]
            });
            const page1 = await browser.newPage();
            await page1.goto('https://chevaliers.xyz/login');
            const email = await page1.$("#email");
            await email.type("admin@npc.id");
            const password = await page1.$("#password");
            await password.type("kQQCI$AnVUv#75h");
            await page1.$eval( 'button#submit', form => form.click() );
            await page1.evaluate(()=> {
                document.location.reload(true)
            });
            
            const page2 = await browser.newPage();
            await page2.goto(link);
            await sleep(3000);
            await browser.close();
        }
        catch(err){
            if(!err.statusCode){
                err.statusCode = 500;
            }
            next("An unexpected error occurred");
        }
    }
    getLink();
    
}