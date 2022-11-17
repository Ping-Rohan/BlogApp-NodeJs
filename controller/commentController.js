const Comment = require('../model/commentModel');
const AppError = require('../utility/AppError');
const catchAsync = require('../utility/catchAsync');

// comment on post
exports.comment = catchAsync(async (request, response, next) => {
    request.body.user = request.user.id;
    request.body.post = request.params.id;

    await Comment.create(request.body);

    response.status(200).json({
        message: 'Successfully Commented',
    });
});

// delete comment
exports.deleteComment = catchAsync(async (request, response, next) => {
    const comment = await Comment.findById(request.params.commentId);

    if (comment.user.toString() !== request.user.id)
        return next(new AppError('You Didnot Write This Comment'));

    await Comment.findByIdAndDelete(request.params.commentId);

    response.status(200).json({
        message: 'comment deleted',
    });
});

// get all comment on post
exports.getAllCommentOnPost = catchAsync(async (request, response, next) => {
    const comments = await Comment.find({ post: request.params.id }).populate({
        path: 'user',
        select: 'fullName',
    });

    response.status(200).json({
        comments,
    });
});
