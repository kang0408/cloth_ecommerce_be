import multer from "multer";

// Lưu file vào bộ nhớ tạm, không upload lên Cloudinary
const storage = multer.memoryStorage();

const imageUploader = (
  allowedFileTypes: Array<string>,
  maxFileSize: number,
  maxNumberOfFiles: number,
  errorMsg: string
) => {
  return multer({
    storage, // Chỉ lưu vào bộ nhớ RAM, không upload
    limits: { fileSize: maxFileSize }, // Giới hạn dung lượng file
    fileFilter: (req, file, cb) => {
      // Kiểm tra số lượng file upload
      if (Array.isArray(req.files) && req.files.length > maxNumberOfFiles) {
        return cb(new Error(`Maximum ${maxNumberOfFiles} files are allowed to upload!`));
      }

      // Kiểm tra loại file hợp lệ
      if (allowedFileTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error(errorMsg));
      }
    }
  });
};

export default imageUploader;
