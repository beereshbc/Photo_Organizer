import asyncHandler from "express-async-handler";
import path from "path";
import fs from "fs/promises";
import Image from "../models/image.js";
import cloudinary from "../config/cloudinary.js";
import { spawn } from "child_process";

// Run YOLO Python script
const runYOLODetect = (filePath) => {
  return new Promise((resolve) => {
    const scriptPath = path.join(process.cwd(), "python", "detect.py");

    const py = spawn("python", [scriptPath, filePath]);

    let out = "";
    let err = "";

    py.stdout.on("data", (d) => (out += d.toString()));
    py.stderr.on("data", (d) => (err += d.toString()));

    py.on("close", (code) => {
      if (code !== 0) {
        console.error("YOLO detection error:", err);
        return resolve([]); // fail-safe
      }

      const cleaned = out.trim(); // "person,car,dog"

      if (!cleaned) return resolve([]);

      const tags = cleaned
        .split(",")
        .map((t) => t.trim().toLowerCase())
        .filter((t) => t.length > 0);

      resolve(tags);
    });
  });
};

// POST /api/images/upload
export const uploadImages = asyncHandler(async (req, res) => {
  if (!req.files || req.files.length === 0) {
    res.status(400);
    throw new Error("No files uploaded");
  }

  const results = [];

  for (const file of req.files) {
    try {
      // 1️⃣ YOLO tag detection
      const tags = await runYOLODetect(file.path);

      // 2️⃣ Upload to Cloudinary
      const uploaded = await cloudinary.uploader.upload(file.path, {
        folder: process.env.CLOUDINARY_FOLDER || "photo-organizer",
        use_filename: true,
        unique_filename: true,
      });

      // 3️⃣ Save to MongoDB
      const imgDoc = await Image.create({
        name: file.originalname,
        cloudUrl: uploaded.secure_url,
        publicId: uploaded.public_id,
        tags,
        uploadedAt: new Date(),
        width: uploaded.width,
        height: uploaded.height,
      });

      results.push(imgDoc);
    } catch (err) {
      console.error("Upload error for file:", file.path, err.message);
    } finally {
      try {
        await fs.unlink(file.path); // delete temp file
      } catch (_) {}
    }
  }

  res.json({ success: true, images: results });
});
