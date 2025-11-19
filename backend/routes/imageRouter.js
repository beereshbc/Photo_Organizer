import express from "express";
import upload from "../middleware/multer.js";
import {
  uploadImages,
  addTag,
  removeTag,
  getAllImages,
  deleteImage,
  loginUser,
  registerUser,
} from "../controllers/imageController.js";
import authUser from "../middleware/authUser.js";

const imageRouter = express.Router();

// Auth
imageRouter.post("/login", loginUser);
imageRouter.post("/register", registerUser);

// Image APIs
imageRouter.post("/upload", upload.array("images"), authUser, uploadImages);
imageRouter.get("/", authUser, getAllImages);
imageRouter.post("/:id/tags", addTag);
imageRouter.delete("/:id/tags", removeTag);
imageRouter.delete("/:id", deleteImage);

export default imageRouter;
