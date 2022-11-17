const multer = require('multer');
const AppError = require('./AppError');
const sharp = require('sharp');
const cloudinary = require('../utility/cloudinary');

// class for various image upload methods
class Upload {
    constructor(model, file, id) {
        this.file = file;
        this.id = id;
        this.model = model;
    }

    async #resizeImage(saveFilePath) {
        await sharp(this.file.buffer).resize(400, 500).jpeg({ quality: 90 }).toFile(saveFilePath);
    }

    async #updatePhotoField(updateField) {
        await this.model.findByIdAndUpdate(this.id, updateField);
        return;
    }

    async #setCloudinary(localPath) {
        const imageData = await cloudinary.uploader.upload(localPath, {
            use_filename: true,
            unique_filename: false,
        });

        return imageData;
    }

    async uploadSinglePhoto(localPath) {
        await this.#resizeImage(localPath);
        const imageData = await this.#setCloudinary(localPath);

        if (this.model.collection.collectionName === 'users') {
            this.#updatePhotoField({ profileImage: imageData.url });
        } else if (this.model.collection.collectionName === 'posts') {
            this.#updatePhotoField({ image: imageData.url });
        }
    }
}

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

exports.uploadImage = upload.single('cover');
exports.Upload = Upload;
