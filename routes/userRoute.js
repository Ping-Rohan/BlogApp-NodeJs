const express = require('express');
const Router = express.Router();
const userController = require('../controller/userController');

// user routes
Router.route('/signup').post(userController.signUp);
Router.route('/login').post(userController.login);

// exporting router
module.exports = Router;
