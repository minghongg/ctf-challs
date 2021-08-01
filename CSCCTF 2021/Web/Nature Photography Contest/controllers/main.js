const axios = require('axios');
const xss = require('xss');

exports.getIndex = (req,res,next) => {
    res.status(200).render('index');
}

exports.getProfile = (req,res,next) => {
    res.status(200).render('profile');
}

exports.getUpload = (req,res,next) => {
    res.status(200).render('upload');
}

exports.logout = (req,res,next) => {
    console.log(req.session);
    req.session.destroy(err => {
        res.redirect('/');
    });
}