import mongoose from "mongoose";

const SlideshowSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  images: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Image", // assuming you have an Image model
      required: true,
    },
  ],
  imageCount: {
    type: Number,
    required: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // assuming you have a User model
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Slideshow", SlideshowSchema);
