import mongoose from "mongoose";

const imageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  cloudUrl: { type: String, required: true },
  publicId: { type: String, required: true },
  tags: { type: [String], default: [] },
  uploadedAt: { type: Date, default: Date.now },
  width: Number,
  height: Number,
});

const Image = mongoose.model("Image", imageSchema);
export default Image;
