// uploadMiddleware.js
import multer from "multer";

const storage = multer.diskStorage({
  filename: function (req, file, callback) {
    callback(null, file.originalname);
  },
});

const upload = multer({
  storage,
  // Add file size limits to prevent large uploads and trigger a MulterError
  limits: {
    fileSize: 10 * 1024 * 1024, // Example: 10 MB limit per file
  },
});

export default upload;
