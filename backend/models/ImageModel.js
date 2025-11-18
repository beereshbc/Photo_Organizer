import mongoose from "mongoose";

const ImageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  url: { type: String, required: true },
  tags: { type: [String], default: [] }, // manual tags
  autoTags: { type: [String], default: [] }, // auto-generated tags
  birthData: {
    uploadedAt: { type: Date, default: Date.now },
    fileType: { type: String },
    size: { type: Number }, // size in bytes
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true, // store only the admin's id
  },
});

const ImageModel =
  mongoose.models.Image || mongoose.model("Image", ImageSchema);

export default ImageModel;
