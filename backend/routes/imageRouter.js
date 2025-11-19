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
  createSlideshow,
  getUserSlideshows,
  deleteSlideshow,
  getEmbedCode,
} from "../controllers/imageController.js";
import authUser from "../middleware/authUser.js";

const imageRouter = express.Router();

// Auth
imageRouter.post("/login", loginUser);
imageRouter.post("/register", registerUser);

// Image APIs
imageRouter.post("/upload", authUser, upload.array("images"), uploadImages);
imageRouter.get("/", authUser, getAllImages);
imageRouter.post("/:id/tags", addTag);
imageRouter.delete("/:id/tags", removeTag);
imageRouter.delete("/:id", deleteImage);

imageRouter.post("/slideshows", authUser, createSlideshow); // create a slideshow
imageRouter.get("/slideshows", authUser, getUserSlideshows); // get all user's slideshows
imageRouter.delete("/slideshows/:id", authUser, deleteSlideshow); // delete a slideshow
imageRouter.get("/slideshows/:id/embed", authUser, getEmbedCode);
export default imageRouter;
