import express from "express";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser"; // [1] Import cookie-parser
import connectDB from "./config/mongoDB.js";
import connectCloudinary from "./config/cloudinary.js";
import imageRouter from "./routes/imageRouter.js";

/* ================= APP SETUP ================= */
const app = express();
const PORT = process.env.PORT || 5000;

// [CRITICAL FIX] Trust the Render proxy so cookies work securely
app.set("trust proxy", 1);

/* ================= CORS CONFIGURATION ================= */
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  "https://photo-organizer-falcon.vercel.app",
  "https://photo-organizer-nine.vercel.app",
  "https://photo-organizer-s6ot.onrender.com",
];

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      console.log("Blocked by CORS:", origin);
      return callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true, // Essential for cookies/tokens
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "token"], // Added 'token' just in case you send it in headers manually
};

app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions)); // Regex fix for Node 22

/* ================= PARSERS ================= */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); // [2] Initialize cookie-parser middleware

/* ================= ROUTES ================= */
app.use("/api/images", imageRouter);

app.get("/", (req, res) => {
  res.send("Photo Organizer API is running");
});

/* ================= SERVER STARTUP ================= */
const startServer = async () => {
  try {
    await connectDB();
    console.log("Database connected successfully");

    connectCloudinary();
    console.log("Cloudinary configured");

    app.listen(PORT, () => {
      console.log(`Server running on PORT ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();

export default app;
