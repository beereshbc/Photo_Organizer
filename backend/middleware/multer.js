import multer from "multer";
import path from "path";
import fs from "fs";
import os from "os";

// Use /tmp for serverless (Vercel, AWS Lambda)
const uploadPath = path.join(os.tmpdir(), "uploads");

// Ensure folder exists
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() + "-" + file.originalname.replace(/\s+/g, "_");
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

export default upload;
