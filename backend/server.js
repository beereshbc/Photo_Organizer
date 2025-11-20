import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/mongoDB.js";
import connectCloudinary from "./config/cloudinary.js";
import imageRouter from "./routes/imageRouter.js";

const app = express();

// --- Configuration ---

const allowedOrigins = [
  "http://localhost:5173",
  "https://photo-organizer-nine.vercel.app",
  "https://photo-organizer-falcon.vercel.app",
];

const corsOptions = {
  origin: allowedOrigins,
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization", "token"],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
};

// --- Middleware Setup ---

// ❌ REMOVE OR COMMENT OUT THIS LINE
// This causes the PathError because "*" is not valid syntax in your router version.
// app.options("*", cors(corsOptions));

// ✅ KEEP THIS LINE
// This handles all CORS requests, including the "OPTIONS" preflight checks automatically.
app.use(cors(corsOptions));

// ✅ Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Connect DB and Cloudinary
await connectDB();
await connectCloudinary();

// --- Routes ---

// ✅ API Route
app.use("/api/images", imageRouter);

// ✅ Health Check / Root Endpoint
app.get("/", (req, res) => {
  res.json({ message: "Photo Organizer API is working" });
});

export default app;
