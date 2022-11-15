const jwt = require('jsonwebtoken');
const User = require('../model/UserModel');
const catchAsync = require('../utility/catchAsync');
const AppError = require('../utility/AppError');

exports.verifyJWT = catchAsync(async (request, response, next) => {
    let token;

    // checking if token exist
    if (request.headers.authorization && request.headers.authorization.startsWith('Bearer')) {
        token = request.headers.authorization.split(' ')[1];
    }

    if (!token) return next(new AppError('Please Login To Continue'));

    // decoding token
    const decodedToken = jwt.verify(token, process.env.JWT_SCERET);

    // checking if user still exist
    const document = await User.findById(decodedToken.id);
    if (!document) return next(new AppError('User No Longer Exist'));

    // checking if user recently changed password
    if (document.hasUserChangedPassword(decodedToken.iat))
        return next(new AppError('Login With New Password'));

    // storing logged in user data for next middleware
    request.user = document;

    // executing next middleware
    next();
});
