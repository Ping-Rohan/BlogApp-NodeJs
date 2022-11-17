const mongoose = require('mongoose');

// post schema
const postSchema = mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Post Must Have Title'],
            trim: true,
        },
        category: {
            type: String,
            default: 'All',
        },
        description: {
            type: String,
            requied: [true, 'Post Must Have Description'],
        },
        isLiked: {
            type: Boolean,
            default: false,
        },
        views: {
            type: Number,
            default: 0,
        },
        likes: [
            {
                type: mongoose.Schema.ObjectId,
                ref: 'user',
            },
        ],
        author: {
            type: mongoose.Schema.ObjectId,
            ref: 'user',
            required: true,
        },
        image: {
            type: String,
        },
    },
    {
        toJSON: { virtuals: true },
        toOBJECT: { virtuals: true },
        timestamps: true,
    }
);

// virtual populate
postSchema.virtual('comments', {
    ref: 'comment',
    foreignField: 'post',
    localField: '_id',
});

const Post = mongoose.model('post', postSchema);

// exporting post
module.exports = Post;
