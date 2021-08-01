const swal = require('sweetalert');
exports.getLogin = (req,res,next) => {
    const authorizationError = req.query.authorizationError;
    console.log(authorizationError);
    res.status(200).render('auth/login',{
        authorizationError : authorizationError
    });
};

exports.getRegister = (req,res,next) => {
    res.status(200).render('auth/register');
};