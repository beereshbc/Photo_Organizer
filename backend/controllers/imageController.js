import ImageModel from "../models/ImageModel.js";
import multer from "multer";

import validator from "validator";
import bcrypt from "bcrypt";
import UserModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import { v2 as cloudinary } from "cloudinary";
import { getAutoTags } from "../utils/runYolo.js";
import SlideshowModel from "../models/SlideshowModel.js";

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password)
      return res.json({ success: false, message: "Missing Details" });

    if (!validator.isEmail(email))
      return res.json({ success: false, message: "Enter Valid Email" });

    if (password.length < 8)
      return res.json({ success: false, message: "Enter A Strong Password" });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new UserModel({
      name,
      email,
      password: hashedPassword,
    });

    const user = await newUser.save();

    // JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    res.json({ success: true, token });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email });
    if (!user)
      return res.json({
        success: false,
        message: "User does not exist. Kindly register",
      });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.json({ success: false, message: "Invalid Credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.json({ success: true, token });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

export const uploadImages = async (req, res) => {
  try {
    const userId = req.userId;
    const imageFiles = req.files;
    console.log("userId in upload : ", userId);

    if (!imageFiles || imageFiles.length === 0) {
      return res.json({ success: false, message: "No images found" });
    }

    let uploadedImages = [];

    for (const file of imageFiles) {
      // Run YOLO auto-tag detection
      const autoTags = await getAutoTags(file.path);
      console.log("Final Auto Tags:", autoTags);

      // Upload to Cloudinary
      const upload = await cloudinary.uploader.upload(file.path, {
        folder: "user_images",
      });

      console.log("cloudinary uploaded");

      // Save to MongoDB
      const imageData = await ImageModel.create({
        name: file.originalname,
        url: upload.secure_url,
        userId,
        autoTags, // store detected tags
        birthData: {
          fileType: upload.format,
          size: upload.bytes,
        },
      });

      uploadedImages.push(imageData);
    }

    return res.json({
      success: true,
      message: "Images uploaded successfully with auto-tags",
      images: uploadedImages,
    });
  } catch (error) {
    console.error(error);
    return res.json({ success: false, message: error.message });
  }
};

// Add Manual Tag
export const addTag = async (req, res) => {
  try {
    const { id } = req.params;
    const { tag } = req.body;

    if (!tag) return res.json({ success: false, message: "Tag required" });

    const image = await ImageModel.findById(id);
    if (!image) return res.json({ success: false, message: "Image not found" });

    image.tags.push(tag.toLowerCase());
    await image.save();

    return res.json({ success: true, message: "Tag added", image });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// Remove Tag
export const removeTag = async (req, res) => {
  try {
    const { id } = req.params;
    const { tag } = req.body;

    const image = await ImageModel.findById(id);
    if (!image) return res.json({ success: false, message: "Image not found" });

    image.tags = image.tags.filter((t) => t !== tag);
    await image.save();

    return res.json({ success: true, message: "Tag removed", image });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export const getAllImages = async (req, res) => {
  try {
    const userId = req.userId;
    console.log(userId);

    const images = await ImageModel.find({ userId }).sort({
      createdAt: -1,
    });
    console.log(images);

    return res.json({ success: true, images });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// Delete image
export const deleteImage = async (req, res) => {
  try {
    const { id } = req.params;

    const image = await ImageModel.findById(id);
    if (!image) return res.json({ success: false, message: "Image not found" });

    // Optional Cloudinary delete
    // await cloudinary.v2.uploader.destroy(image.public_id);

    await ImageModel.findByIdAndDelete(id);

    return res.json({ success: true, message: "Image deleted" });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export const createSlideshow = async (req, res) => {
  const { name, images } = req.body;
  const userId = req.userId; // assuming auth middleware sets req.user

  if (!name || images.length === 0) {
    return res.status(400).json({ success: false, message: "Invalid data" });
  }

  try {
    const newSlideshow = new SlideshowModel({
      name,
      images,
      imageCount: images.length,
      createdBy: userId,
    });

    await newSlideshow.save();

    return res
      .status(201)
      .json({ success: true, message: "Slideshow saved successfully" });
  } catch (error) {
    console.error("Error creating slideshow:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getUserSlideshows = async (req, res) => {
  const userId = req.userId; // assuming your auth middleware sets req.userId

  try {
    // Find slideshows created by the user
    const slideshows = await SlideshowModel.find({ createdBy: userId })
      .populate({
        path: "images", // populate the 'images' field
        model: "Image", // using the Image model
        select: "name url -_id", // select only name and url, exclude _id
      })
      .sort({ createdAt: -1 }); // optional: latest first

    return res.status(200).json({ success: true, slideshows });
  } catch (error) {
    console.error("Error fetching slideshows:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// Delete a slideshow
export const deleteSlideshow = async (req, res) => {
  const slideshowId = req.params.id;
  const userId = req.userId;

  try {
    const slideshow = await SlideshowModel.findOne({
      _id: slideshowId,
      createdBy: userId,
    });
    if (!slideshow)
      return res
        .status(404)
        .json({ success: false, message: "Slideshow not found" });

    await slideshow.deleteOne();
    return res
      .status(200)
      .json({ success: true, message: "Slideshow deleted" });
  } catch (error) {
    console.error("Error deleting slideshow:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getEmbedCode = async (req, res) => {
  const slideshowId = req.params.id;

  try {
    const slideshow = await SlideshowModel.findById(slideshowId).populate(
      "images"
    );

    if (!slideshow) {
      return res
        .status(404)
        .json({ success: false, message: "Slideshow not found" });
    }

    // Production-ready embed script (points to hosted frontend)
    const embedScript = `<div id="slideshow-${slideshow._id}" data-slideshow-id="${slideshow._id}"></div>
<script src="https://photo-organizer-falcon.vercel.app/embed-slideshow.js"></script>`;

    return res.status(200).json({ success: true, embedScript });
  } catch (error) {
    console.error("Error generating embed code:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export { multer, registerUser, loginUser };
