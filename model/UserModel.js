const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');

// defining schema
const UserSchema = mongoose.Schema(
    {
        fullName: {
            type: String,
            required: [true, 'Enter Your Full Name '],
        },
        email: {
            type: String,
            required: [true, 'Enter Your Email'],
            validate: [validator.isEmail, 'Enter Valid Email'],
            unique: true,
        },
        password: {
            type: String,
            required: [true, 'Enter Your Password'],
            validate: [
                validator.isStrongPassword,
                'Please Enter Strong Password Including Uppercase , Lowercase , Number , Symbols and Length Of 8 Character',
            ],
        },
        confirmPassword: {
            type: String,
            required: true,
            validate: {
                validator: function (value) {
                    return this.password === value;
                },
                message: 'Password Doesnot Match',
            },
        },
        profileImage: {
            type: String,
            required: [true, 'Upload Your Profile Picture'],
            default:
                'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__340.png',
        },
        role: {
            type: String,
            enum: ['Admin', 'Blogger', 'User'],
            default: 'User',
        },
        isFollowing: {
            type: Boolean,
            default: false,
        },
        isUnfollowing: {
            type: Boolean,
            default: false,
        },
        isVerified: {
            type: Boolean,
            default: false,
        },
        isBlocked: {
            type: Boolean,
            default: false,
        },
        isAdmin: {
            type: Boolean,
            default: false,
        },
        followers: [
            {
                type: mongoose.Schema.ObjectId,
                ref: 'user',
            },
        ],
        following: [
            {
                type: mongoose.Schema.ObjectId,
                ref: 'user',
            },
        ],
        viewedBy: [
            {
                type: mongoose.Schema.ObjectId,
                ref: 'user',
            },
        ],
        accountVerificationToken: String,
        accountVerificationExpires: Date,
        passwordChangedAt: Date,
        passwordResetExpires: Date,
    },
    {
        toJSON: { virtuals: true },
        toOBJECT: { virtuals: true },
        timestamps: true,
    }
);

// hashing password
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) next();

    this.password = await bcrypt.hash(this.password, 10);
    this.confirmPassword = undefined;
    next();
});

// password checking
UserSchema.methods.checkPassword = async (password, documentPassword) => {
    return await bcrypt.compare(password, documentPassword);
};

// creating model
const User = mongoose.model('user', UserSchema);

// exporting model
module.exports = User;
