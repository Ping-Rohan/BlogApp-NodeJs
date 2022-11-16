const express = require('express');
const Router = express.Router();
const editPhoto = require('../utility/photoUpload');
const imageController = require('../controller/imageController');
const authentication = require('../controller/authentication');

Router.use(authentication.verifyJWT);

Router.route('/').post(
    editPhoto.uploadImage,
    editPhoto.resizeImage,
    imageController.uploadProfilePic
);

module.exports = Router;
