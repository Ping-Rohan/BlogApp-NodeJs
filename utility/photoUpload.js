const multer = require('multer');
const AppError = require('./AppError');
const sharp = require('sharp');

// creating buffer memory
const diskStorage = multer.memoryStorage();

// filtering non accepted files
const filterMulter = (request, file, cb) => {
    if (!file.mimetype.startsWith('image')) {
        cb(new AppError('File Type Must Be Image Only'), false);
    } else {
        cb(null, true);
    }
};

const upload = multer({
    storage: diskStorage,
    fileFilter: filterMulter,
});

// implementing resizing
async function resizeImage(request, response, next) {
    if (!request.file) next();
    request.file.filename = `user-${Date.now()}.jpeg`;
    await sharp(request.file.buffer)
        .resize(400, 500)
        .jpeg({ quality: 90 })
        .toFile(`public/${request.file.filename}`);
    next();
}

exports.uploadImage = upload.single('cover');
exports.resizeImage = resizeImage;
