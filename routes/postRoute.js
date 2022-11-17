const express = require('express');
const Router = express.Router();
const postController = require('../controller/postController');
const authentication = require('../controller/authentication');
const Upload = require('../utility/photoUpload');

Router.use(authentication.verifyJWT);

Router.route('/').post(postController.createPost);
Router.route('/image/:id').post(Upload.uploadImage, postController.uploadPostImage);

// exporting router
module.exports = Router;
