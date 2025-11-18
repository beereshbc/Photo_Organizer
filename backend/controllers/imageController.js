import ImageModel from "../models/ImageModel.js";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary"; // Cloudinary config
import validator from "validator";
import bcrypt from "bcrypt";
import UserModel from "../models/userModel.js";
import jwt from "jsonwebtoken";

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

const uploadImages = async (req, res) => {
  try {
    const userId = req.body;
    const files = req.files;
    if (!files || files.length === 0) {
      return res.status(400).json({ message: "No images uploaded" });
    }

    const savedImages = [];

    // Upload and save each file individually
    for (const file of files) {
      // Upload to Cloudinary
      const result = await cloudinary.uploader.upload(file.path, {
        folder: "photo-gallery",
        resource_type: "image",
      });

      // Prepare image document
      const imageData = {
        name: file.originalname,
        url: result.secure_url,
        birthData: {
          uploadedAt: new Date(),
          fileType: file.mimetype,
          size: file.size,
        },
        userId: userId,
      };

      // Save single image to DB
      const savedImage = await ImageModel.create(imageData);
      savedImages.push(savedImage);
    }

    res.status(201).json(savedImages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Image upload failed", error });
  }
};

// Add tag to image
const addTag = async (req, res) => {
  const { id } = req.params;
  const { tag } = req.body;

  if (!tag) return res.status(400).json({ message: "Tag is required" });

  try {
    const image = await ImageModel.findById(id);
    if (!image) return res.status(404).json({ message: "Image not found" });

    if (!image.tags.includes(tag.toLowerCase())) {
      image.tags.push(tag.toLowerCase());
      await image.save();
    }

    res.json(image);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to add tag", error });
  }
};

// Remove tag from image
const removeTag = async (req, res) => {
  const { id } = req.params;
  const { tag } = req.body;

  if (!tag) return res.status(400).json({ message: "Tag is required" });

  try {
    const image = await ImageModel.findById(id);
    if (!image) return res.status(404).json({ message: "Image not found" });

    image.tags = image.tags.filter((t) => t !== tag.toLowerCase());
    await image.save();

    res.json(image);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to remove tag", error });
  }
};

// Get all images
const getAllImages = async (req, res) => {
  try {
    const images = await ImageModel.find().sort({ "birthData.uploadedAt": -1 });
    res.json(images);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch images", error });
  }
};

export {
  uploadImages,
  addTag,
  removeTag,
  getAllImages,
  multer,
  registerUser,
  loginUser,
};
