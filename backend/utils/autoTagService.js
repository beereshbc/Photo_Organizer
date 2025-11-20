import axios from "axios";
import { getAutoTags as runYOLO } from "./runYolo.js";
import { runOCR } from "../python/ocr_service.js";
import { runClip } from "../python/clip_service.js";

export const generateAllTags = async (localImagePath, cloudinaryUrl) => {
  try {
    // 1️⃣ YOLOv8 (local file path)
    const yoloTags = await runYOLO(localImagePath);

    // 2️⃣ OCR text detection (cloudinary url)
    const ocrTags = await runOCR(cloudinaryUrl);

    // 3️⃣ CLIP semantic tags (cloudinary url)
    const clipTags = await runClip(cloudinaryUrl);

    // 4️⃣ Combine everything
    const finalTags = [...yoloTags, ...ocrTags, ...clipTags]
      .map((t) => t.toLowerCase())
      .filter((t, i, arr) => arr.indexOf(t) === i); // remove duplicates

    return finalTags;
  } catch (error) {
    console.log("❌ Tagging Error:", error);
    return [];
  }
};
