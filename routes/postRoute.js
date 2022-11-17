const express = require('express');
const Router = express.Router();
const postController = require('../controller/postController');
const authentication = require('../controller/authentication');
const commentRouter = require('../routes/commentRoute');
const Upload = require('../utility/photoUpload');

// top level middleware
Router.use(authentication.verifyJWT);
Router.use('/:id/comment', commentRouter);

Router.route('/').get(postController.getAllPost).post(postController.createPost);

Router.route('/:id')
    .get(postController.getPostById)
    .delete(postController.deletePost)
    .put(postController.updateFields);

Router.route('/:id/like').put(postController.likePost);
Router.route('/:id/image').post(Upload.uploadImage, postController.uploadPostImage);

// exporting router
module.exports = Router;
