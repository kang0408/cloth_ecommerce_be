const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

// creating new storage
const accountStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "clothes_management" // folder name in cloudinary
  }
});

module.exports = accountStorage;
