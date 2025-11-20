import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/mongoDB.js";
import connectCloudinary from "./config/cloudinary.js";
import imageRouter from "./routes/imageRouter.js";

const app = express();

// ✅ CORS Setup (Vercel-friendly)
const allowedOrigins = [
  "http://localhost:5173",
  "https://photo-organizer-falcon.vercel.app",
];

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
  }
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, token",
    "token"
  );
  res.header("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") {
    return res.sendStatus(200); // Preflight response
  }

  next();
});

// ✅ Also use CORS package for safety
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization", "token"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);

// ✅ Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Connect DB and Cloudinary
await connectDB();
await connectCloudinary();

// ✅ Routes
app.use("/api/images", imageRouter);

app.get("/", (req, res) => {
  res.json({ message: "Photo Organizer API is working" });
});

export default app;
