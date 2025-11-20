import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/mongoDB.js";
import connectCloudinary from "./config/cloudinary.js";
import imageRouter from "./routes/imageRouter.js";

const app = express();

// ✅ Correct CORS for Local + Vercel Frontend
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://photo-organizer-falcon.vercel.app",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "token", // IMPORTANT - your frontend sends this
    ],
    credentials: true,
  })
);

// ✅ Preflight handler (Express 5 SAFE)
app.use((req, res, next) => {
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

await connectDB();
await connectCloudinary();

// Routes
app.use("/api/images", imageRouter);

app.get("/", (req, res) => {
  res.json({ message: "✅ Photo Organizer API is working" });
});

// ✅ Vercel compatible export (NO app.listen)
export default app;
