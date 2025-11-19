import ImageModel from "../models/ImageModel.js";
import multer from "multer";

import validator from "validator";
import bcrypt from "bcrypt";
import UserModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import { v2 as cloudinary } from "cloudinary";
import { getAutoTags } from "../utils/runYolo.js";

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

    if (!imageFiles || imageFiles.length === 0) {
      return res.json({ success: false, message: "No images found" });
    }

    let uploadedImages = [];

    for (const file of imageFiles) {
      // 1️⃣ Run YOLO on the LOCAL FILE from multer
      const autoTags = await getAutoTags(file.path);
      console.log("Detected Tags:", autoTags);

      // 2️⃣ Upload to Cloudinary
      const upload = await cloudinary.uploader.upload(file.path, {
        folder: "user_images",
      });

      // 3️⃣ Save to DB
      const imageData = await ImageModel.create({
        name: file.originalname,
        url: upload.secure_url,
        userId,
        autoTags,
        birthData: {
          fileType: upload.format,
          size: upload.bytes,
        },
      });

      uploadedImages.push(imageData);
    }

    return res.json({
      success: true,
      message: "Images uploaded with auto-tags",
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
    const userId = req.userId; // coming from authUser middleware

    const images = await ImageModel.find({ userId }).sort({
      createdAt: -1,
    });

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

export { multer, registerUser, loginUser };
