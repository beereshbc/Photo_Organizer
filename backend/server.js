import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import imageRoutes from "./routes/imageRoutes.js";
import dotenv from "dotenv";
import { errorHandler } from "./middleware/errorMiddleware.js";

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors());

// connect mongo
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.use("/api/images", imageRoutes);

app.get("/", (req, res) => {
  res.send("API is Working good (Photo-Organizer)");
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
