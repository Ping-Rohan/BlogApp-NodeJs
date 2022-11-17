const express = require('express');
const Router = express.Router();
const postController = require('../controller/postController');
const authentication = require('../controller/authentication');
const Upload = require('../utility/photoUpload');

Router.use(authentication.verifyJWT);

Router.route('/').get(postController.getAllPost).post(postController.createPost);

Router.route('/:id')
    .get(postController.getPostById)
    .delete(postController.deletePost)
    .put(postController.updateFields);

Router.route('/:id/image').post(Upload.uploadImage, postController.uploadPostImage);

// exporting router
module.exports = Router;
