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
  getUserProfile,
} from "../controllers/imageController.js";
import authUser from "../middleware/authUser.js";

const imageRouter = express.Router();

// Auth
imageRouter.post("/login", loginUser);
imageRouter.post("/register", registerUser);

// Image APIs
imageRouter.get("/get", authUser, getAllImages);
imageRouter.get("/profile", authUser, getUserProfile);
imageRouter.post("/upload", authUser, upload.array("images"), uploadImages);

imageRouter.post("/:id/tags", authUser, addTag);
imageRouter.delete("/:id/tags", authUser, removeTag);
imageRouter.delete("/:id", authUser, deleteImage);

// Slideshow APIs
imageRouter.post("/slideshows", authUser, createSlideshow); // create slideshow
imageRouter.get("/slideshows", authUser, getUserSlideshows); // get user's slideshows
imageRouter.delete("/slideshows/:id", authUser, deleteSlideshow); // delete slideshow

// EMBED: public endpoint, no auth required
imageRouter.get("/slideshows/:id/embed", getEmbedCode);

export default imageRouter;
