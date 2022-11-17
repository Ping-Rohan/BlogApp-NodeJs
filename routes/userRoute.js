const express = require('express');
const Router = express.Router();
const userController = require('../controller/userController');
const authentication = require('../controller/authentication');
const Upload = require('../utility/photoUpload');

// routes for  login , signup and verify email
Router.route('/signup').post(userController.signUp);
Router.route('/login').post(userController.login);
Router.route('/verify-email/:token').post(userController.verifyEmail);

// routes for getuserById , update user data
Router.route('/:id').get(authentication.verifyJWT, userController.getUserById);
Router.route('/update').put(authentication.verifyJWT, userController.updateFields);
Router.route('/change-password').put(authentication.verifyJWT, userController.changePassword);

// routes for follow and unfollow user
Router.route('/follow').post(authentication.verifyJWT, userController.followUser);
Router.route('/unfollow').post(authentication.verifyJWT, userController.unfollowUser);

// route for uploading profile pic
Router.route('/profile-picture').post(
    authentication.verifyJWT,
    Upload.uploadImage,
    userController.uploadProfilePic
);

// exporting router
module.exports = Router;
