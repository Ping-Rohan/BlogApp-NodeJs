const Post = require('../model/postModel');
const catchAsync = require('../utility/catchAsync');
const AppError = require('../utility/AppError');
const Upload = require('../utility/photoUpload');

exports.createPost = catchAsync(async (request, response, next) => {
    if (!request.body.author) request.body.author = request.user.id;
    const post = await Post.create(request.body);

    response.status(200).json({
        message: 'Post Created Successfully',
        post,
    });
});

// upload post image or thumbnail
exports.uploadPostImage = catchAsync(async (request, response, next) => {
    request.file.filename = `post-${request.user.id}-${Date.now()}`;

    await new Upload.Upload(Post, request.file, request.params.id).uploadSinglePhoto();

    response.status(200).json({
        message: 'Post Photo Uploaded Successfully',
    });
});
