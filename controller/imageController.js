const catchAsync = require('../utility/catchAsync');
const cloudinary = require('../utility/cloudinary');

// upload user profile picture
exports.uploadProfilePic = catchAsync(async (request, response, next) => {
    const localPath = `public/${request.file.filename}`;
    const imageData = await cloudinary.uploader.upload(localPath, {
        public_id: `user-${request.user.id}-profile`,
        use_filename: true,
        unique_filename: false,
    });

    response.status(200).json({
        message: 'Image Uploaded Successfully',
    });
});
