const User = require('../model/UserModel');
const AppError = require('../utility/AppError');
const catchAsync = require('../utility/catchAsync');

// signup
exports.signUp = catchAsync(async (request, response) => {
    const document = await User.create(request.body);

    response.status(200).json({
        message: 'User Created Successfully',
        document,
    });
});

// login
exports.login = catchAsync(async (request, response, next) => {
    const { email, password } = request.body;

    // checking if email and password exist
    if (!email || !password) return next(new AppError('Enter Email And Password'));

    // checking if document exist
    const document = await User.findOne({ email });
    if (!document || !(await document.checkPassword(password, document.password)))
        return next(new AppError('Email or password incorrect'));

    // sending token as response
    response.status(200).json({
        message: 'Logged in Successfully',
    });
});
