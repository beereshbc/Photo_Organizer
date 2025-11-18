import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      `${process.env.MONGODB_URI}/Photo_Organizer`
    );
    console.log(`Database connected: ${conn.connection.host}`);
  } catch (err) {
    console.error("Database connection error:", err.message);
    process.exit(1);
  }

  mongoose.connection.on("disconnected", () => {
    console.warn("Database disconnected!");
  });
};

export default connectDB;
