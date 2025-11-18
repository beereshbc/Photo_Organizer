import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

// Cloudinary Storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => ({
    folder: "photo_organizer",
    resource_type: "auto",
    public_id: `${Date.now()}-${Math.round(Math.random() * 1e9)}`,
  }),
});

const upload = multer({ storage });

export default upload;
