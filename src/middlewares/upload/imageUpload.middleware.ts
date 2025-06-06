import httpStatus from "http-status";
import { Request, Response, NextFunction } from "express";

import imageUploader from "../../utils/imageUploader.utils";

// middleware of avatar upload
const imageUpload = (req: Request, res: Response, next: NextFunction) => {
  const upload = imageUploader(
    // sending file mime types
    ["image/jpeg", "image/jpg", "image/png"],
    // maximum file size
    10 * 2024 * 2024,
    // maximum file number
    1,
    // error message
    "Only .jpeg .jpg or .png format allowed!"
  );

  // call the middleware function

  // upload.single() or upload.array() or upload.fields needs of input file field

  // upload.any() doesn't needs any input file field name
  upload.any()(req, res, (err) => {
    if (err) {
      // sending json error response
      res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        errors: {
          error: {
            msg: err.message
          }
        }
      });
    }
    next();
  });
};

export default imageUpload;
