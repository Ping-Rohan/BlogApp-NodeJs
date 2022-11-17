const Post = require('../model/postModel');
const catchAsync = require('../utility/catchAsync');
const AppError = require('../utility/AppError');
const Upload = require('../utility/photoUpload');
const { findByIdAndUpdate } = require('../model/postModel');

// create post
exports.createPost = catchAsync(async (request, response, next) => {
    if (!request.body.author) request.body.author = request.user.id;
    const post = await Post.create(request.body);

    response.status(200).json({
        message: 'Post Created Successfully',
        post,
    });
});

exports.getAllPost = catchAsync(async (request, response, next) => {
    const posts = await Post.find();

    response.status(200).json({
        message: 'Fetched Successfully',
        posts,
    });
});

// delete post
exports.deletePost = catchAsync(async (request, response, next) => {
    await Post.findByIdAndDelete(request.params.id);

    response.status(200).json({
        message: 'deleted successfully',
    });
});

// update post fields
exports.updateFields = catchAsync(async (request, response, next) => {
    await Post.findByIdAndUpdate(request.params.id);

    response.status(200).json({
        message: 'updated successfully',
    });
});

// upload post image or thumbnail
exports.uploadPostImage = catchAsync(async (request, response, next) => {
    request.file.filename = `post-${request.user.id}-${Date.now()}`;
    const path = `public/post/${request.file.filename}.jpeg`;
    await new Upload.Upload(Post, request.file, request.params.id).uploadSinglePhoto(path);

    response.status(200).json({
        message: 'Post Photo Uploaded Successfully',
    });
});

// get post by id
exports.getPostById = catchAsync(async (request, response, next) => {
    // increase views on each request
    await Post.findByIdAndUpdate(request.params.id, {
        $inc: { views: 1 },
    });

    const post = await Post.findById(request.params.id);

    response.status(200).json({
        post,
    });
});

// implementing post likes
exports.likePost = catchAsync(async (request, response, next) => {
    // checking if user already Liked
    let alreadyLiked = false,
        finalResult;
    const post = await Post.findById(request.params.id);

    if (post.likes.includes(request.user.id)) alreadyLiked = true;

    // toggle like array if already liked
    if (alreadyLiked) {
        finalResult = await Post.findByIdAndUpdate(
            request.params.id,
            {
                $pull: { likes: request.user.id },
            },
            { new: true }
        );
    } else {
        finalResult = await Post.findByIdAndUpdate(
            request.params.id,
            {
                $push: { likes: request.user.id },
            },
            { new: true }
        );
    }

    response.status(200).json({
        likes: finalResult.likes.length,
    });
});
