import mongoose from "mongoose";

// User Schema
const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
  },
  {
    timestamps: true, // automatically adds createdAt & updatedAt
  }
);

// Prevent model overwrite in hot reload
const UserModel = mongoose.models.User || mongoose.model("User", UserSchema);

export default UserModel;
