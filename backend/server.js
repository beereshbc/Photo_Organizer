import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/mongoDB.js";
import connectCloudinary from "./config/cloudinary.js";
import imageRouter from "./routes/imageRouter.js";

const app = express();

// ✅ Perfect CORS - no wildcard routes used
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://photo-organizer-falcon.vercel.app",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// ✅ Manual Preflight handler (SAFE)
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

app.use("/api/images", imageRouter);

app.get("/", (req, res) => {
  res.send("Photo Organizer API is working");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});

export default app;
