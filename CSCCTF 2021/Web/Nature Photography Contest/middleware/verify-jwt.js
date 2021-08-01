const jwt = require('jsonwebtoken');

module.exports = (req, res, next ) => {
    const authHeader = req.get('Authorization');
    if(!authHeader || !req.session.isLoggedIn){
        const error = new Error('Not authenticated.');
        error.statusCode = 401;
        throw error;
    }
    const token = req.get('Authorization').split(' ')[1];
    let decodedToken;
    try {
        decodedToken = jwt.verify(token,'IYq@9A2SAjuk$sg$YJiKzz@c0%B');
    } catch (error) {
        error.statusCode = 500;
        throw error;
    }

    if(!decodedToken){
        const error = new Error('Not authenticated.');
        error.statusCode = 401;
        throw error;
    }

    req.userId = decodedToken.userId;
    next();
}