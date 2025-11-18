import express from "express";
import upload from "../middleware/multer.js";
import { uploadImages } from "../controllers/imageController.js";

const router = express.Router();

// upload.array('images') expects the files under field name 'images'
router.post("/upload", upload.array("images", 12), uploadImages);

export default router;
