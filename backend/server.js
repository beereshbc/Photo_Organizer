import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/mongoDB.js";
import connectCloudinary from "./config/cloudinary.js";
import imageRouter from "./routes/imageRouter.js";

const app = express();

app.use(express.json()); // Parses JSON requests
app.use(express.urlencoded({ extended: true })); // Parses form data

app.use(cors());
await connectDB();
await connectCloudinary();
app.use("/api/images", imageRouter);

app.get("/", (req, res) => {
  res.send("Photo Organizer API is working");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});
