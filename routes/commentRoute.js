const express = require('express');
const Router = express.Router({ mergeParams: true });
const commentController = require('../controller/commentController');
const authentication = require('../controller/authentication');

Router.use(authentication.verifyJWT);

Router.route('/').post(commentController.comment).get(commentController.getAllCommentOnPost);

Router.route('/:commentId').delete(commentController.deleteComment);

// exporting router
module.exports = Router;
