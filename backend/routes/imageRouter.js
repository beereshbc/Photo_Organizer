import express from "express";
import upload from "../middleware/multer.js"; // Multer middleware
import {
  uploadImages,
  addTag,
  removeTag,
  getAllImages,
  loginUser,
  registerUser,
} from "../controllers/imageController.js";
import authUser from "../middleware/authUser.js";

const imageRouter = express.Router();

imageRouter.post("/upload", authUser, upload.array("images"), uploadImages);
imageRouter.post("/:id/tags", addTag);
imageRouter.post("/login", loginUser);
imageRouter.post("/register", registerUser);
imageRouter.delete("/:id/tags", removeTag);
imageRouter.get("/", getAllImages);

export default imageRouter;
