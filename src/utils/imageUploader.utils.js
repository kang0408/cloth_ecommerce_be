const multer = require("multer");
const accountStorage = require("../configs/cloudinaryAccountStorage");

const imageUploader = (allowedFileTypes, maxFileSize, maxNumberOfFiles, errorMsg) => {
  const upload = multer({
    storage: accountStorage, // Cloudinary storage
    limits: { fileSize: maxFileSize }, // Giới hạn kích thước file
    fileFilter: (req, file, cb) => {
      // Kiểm tra req.files có tồn tại hay chưa
      if (!req.files) req.files = [];

      // Kiểm tra số lượng file upload
      if (req.files.length > maxNumberOfFiles) {
        return cb(new Error(`Maximum ${maxNumberOfFiles} files are allowed to upload!`));
      }

      // Kiểm tra loại file hợp lệ
      if (allowedFileTypes.includes(file.mimetype)) {
        req.files.push(file); // Lưu file vào req.files
        cb(null, true);
      } else {
        cb(new Error(errorMsg));
      }
    }
  });

  return upload;
};

module.exports = imageUploader;
