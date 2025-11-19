import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/mongoDB.js";
import connectCloudinary from "./config/cloudinary.js";
import imageRouter from "./routes/imageRouter.js";

const app = express();

// Enable CORS for your frontend domain
const allowedOrigins = [
  "https://photo-organizer-falcon.vercel.app", // production frontend
  "http://localhost:5173", // local dev frontend
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like Postman)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, // Allow cookies/authorization headers
  })
);

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect DB and Cloudinary
await connectDB();
await connectCloudinary();

// Routes
app.use("/api/images", imageRouter);

app.get("/", (req, res) => {
  res.send("Photo Organizer API is working");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});
