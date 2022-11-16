const User = require('../model/UserModel');
const AppError = require('../utility/AppError');
const catchAsync = require('../utility/catchAsync');
const signJWT = require('../utility/signJWT');
const sendEmail = require('../utility/nodeMailer');
const crypto = require('crypto');

// signup
exports.signUp = catchAsync(async (request, response) => {
    const document = await User.create(request.body);

    // generating verification token and link
    const verificationToken = document.createEmailVerificationToken();
    const verificationLink = `localhost:3000/api/v1/verify-email/${verificationToken}`;

    document.save({ validateBeforeSave: false });

    // sending email verification mail
    sendEmail(document.email, verificationLink);

    response.status(200).json({
        token: signJWT(document._id),
        message: 'User Created Successfully',
        verificationMessage:
            'An email verification link is sent to your email , you need to verify your email inorder to use some features',
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

    // signing token
    const token = signJWT(document._id);

    // sending token as response
    response.status(200).json({
        message: 'Logged in Successfully',
        token,
    });
});

// find user by id
exports.getUserById = catchAsync(async (request, response, next) => {
    const userId = request.params.id;
    const document = await User.findById(userId).select('-password');

    response.status(200).json({
        document,
    });
});

// update feilds
exports.updateFields = catchAsync(async (request, response, next) => {
    // deleting password field from request obj
    if (request.body.password) delete request.body['password'];

    const document = await User.findByIdAndUpdate(request.user.id, request.body, {
        new: true,
        runValidators: true,
    });

    response.status(200).json({
        message: 'Updated Successfully',
        document,
    });
});

// change password
exports.changePassword = catchAsync(async (request, response, next) => {
    const { currentPassword, password, confirmPassword } = request.body;
    if (!currentPassword) return next(new AppError('Enter Current Password'));

    // finding document
    const document = await User.findById(request.user._id);
    if (!document) return next(new AppError('Wrong UserId'));

    //checking if password is correct
    if (!(await document.checkPassword(currentPassword, document.password)))
        return next(new AppError('Wrong Password'));

    // updating password
    document.password = password;
    document.confirmPassword = confirmPassword;

    // saving document
    await document.save();

    response.status(200).json({
        message: 'Password Changed Successfully',
    });
});

// follow user
exports.followUser = catchAsync(async (request, response, next) => {
    const { userToBeFollowed } = request.body;

    // checking if that user was already followed
    const document = await User.findById(request.user._id);
    if (document.following.includes(userToBeFollowed))
        return next(new AppError('User Is Already Followed By You'));

    // updating following array
    document.following.push(userToBeFollowed);
    document.save({ validateBeforeSave: false });

    // updating followers array
    await User.findByIdAndUpdate(userToBeFollowed, {
        $push: { followers: request.user._id },
    });

    response.status(200).json({
        message: 'followed successfully',
    });
});

// unfollow user
exports.unfollowUser = catchAsync(async (request, response, next) => {
    const { unfollowId } = request.body;
    if (!unfollowId) return next(new AppError('Enter User You Want To Unfollow'));

    // updating target user document
    await User.findByIdAndUpdate(unfollowId, {
        $pull: { followers: request.user.id },
    });

    // updating self user document
    await User.findByIdAndUpdate(request.user.id, {
        $pull: { following: unfollowId },
    });

    response.status(200).json({
        message: 'unfollowed Successfully',
    });
});

// email verification
exports.verifyEmail = catchAsync(async (request, response, next) => {
    const verificationToken = request.params.token;

    // hasing token
    const hashedToken = crypto.createHash('sha256').update(verificationToken).digest('hex');

    // searching document with hashed token
    const document = await User.findOne({
        accountVerificationToken: hashedToken,
        accountVerificationExpires: { $gt: Date.now() },
    });

    if (!document) return next(new AppError('Invalid Link Or Link Already Expired'));

    document.isVerified = true;
    document.accountVerificationExpires = undefined;
    document.createEmailVerificationToken = undefined;

    await document.save({ validateBeforeSave: false });

    response.status(200).json({
        message: 'Account Verified Successfully',
        document,
    });
});
