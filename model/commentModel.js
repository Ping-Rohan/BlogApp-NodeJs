const mongoose = require('mongoose');

// comment schema
const commentSchema = mongoose.Schema({
    comment: {
        type: String,
        trim: true,
        required: 'Post Must Have Comment',
    },
    post: {
        type: mongoose.Schema.ObjectId,
        ref: 'post',
        required: true,
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'user',
        requied: true,
    },
});

// populate
commentSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'user',
        select: 'fullName',
    });
    next();
});

// comment model
const Comment = mongoose.model('comment', commentSchema);

// exporting
module.exports = Comment;
