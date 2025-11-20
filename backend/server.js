import express from "express";
import cors from "cors";
// Assuming these are imported from your config files
import { connectDB } from "./config/db.js";
import { connectCloudinary } from "./config/cloudinary.js";
import imageRouter from "./routes/imageRoutes.js";

const app = express();

// --- 1. Centralized CORS Configuration ---
const corsOptions = {
  origin: [
    "https://photo-organizer-falcon.vercel.app",
    "http://localhost:5173", // Suggestion: Keep localhost for local dev testing
    "http://localhost:3000",
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "token"],
  credentials: true, // Essential for cookies/sessions
};

// Apply CORS middleware ONCE with options
app.use(cors(corsOptions));

// Handle Preflight requests explicitly using the SAME options
app.options("*", cors(corsOptions));

// --- 2. Body Parsers ---
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- 3. Database Connections ---
// Note: Top-level await works in Node 14+ modules.
// Ensure your package.json has "type": "module"
try {
  await connectDB();
  await connectCloudinary();
  console.log("Database and Cloudinary connected");
} catch (error) {
  console.error("Connection failed:", error);
}

// --- 4. Routes ---
app.use("/api/images", imageRouter);

app.get("/", (req, res) => {
  res.send("Photo Organizer API is working");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running locally on PORT ${PORT}`);
});

export default app;
