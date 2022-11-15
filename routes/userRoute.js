const express = require('express');
const Router = express.Router();
const userController = require('../controller/userController');
const authentication = require('../controller/authentication');

// user routes
Router.route('/signup').post(userController.signUp);
Router.route('/login').post(userController.login);
Router.route('/:id').get(authentication.verifyJWT, userController.getUserById);
Router.route('/update').put(authentication.verifyJWT, userController.updateFields);
Router.route('/change-password').put(authentication.verifyJWT, userController.changePassword);

// exporting router
module.exports = Router;
