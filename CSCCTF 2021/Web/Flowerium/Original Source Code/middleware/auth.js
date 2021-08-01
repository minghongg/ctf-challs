const jwt = require('jsonwebtoken');

module.exports = (req, res, next ) => {
    const authHeader = req.get('Authorization');
    if(!authHeader){
        req.isAuth = false;
        return next();
    }
    const token = req.get('Authorization').split(' ')[1];
    let decodedToken;
    try {
        decodedToken = jwt.verify(token,'wIovdcKerNT4jejhrkY');
    } catch (error) {
        req.isAuth = false;
        return next();
    }
    if(!decodedToken){
        req.isAuth = false;
        return next();
    }
    req.userId = decodedToken.userId;
    req.isVip = decodedToken.isVip;
    req.isAuth = true;
    next();
}