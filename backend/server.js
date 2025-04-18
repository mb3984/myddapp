import express from "express";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import diaryRoutes from "./routes/diaryRoutes.js";

const app = express();

// Load environment variables from .env file
dotenv.config(); // This will load your .env file in both dev and prod environments

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// CORS Configuration: Allow requests only from your frontend domain in production
const corsOptions = {
  origin:
    process.env.NODE_ENV === "production"
      ? "https://myddapp.onrender.com"
      : "*", // Change to your actual frontend URL in production
};

app.use(cors(corsOptions));

// Middleware for parsing JSON
app.use(express.json());

// Routes for authentication and diary
app.use("/api/auth", authRoutes);
app.use("/api/diary", diaryRoutes);

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() =>
    app.listen(4000, () => console.log("Server running on port 4000"))
  )
  .catch((err) => console.log("Error connecting to MongoDB:", err));

// Serve React frontend in production
if (process.env.NODE_ENV === "production") {
  const staticPath = path.resolve(__dirname, "../frontend/dist");
  app.use(express.static(staticPath)); // Serve static files from the build directory
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(staticPath, "index.html")); // Catch-all route for React frontend
  });
} else {
  app.get("/", (req, res) => {
    res.send("Development Mode: Server is running.");
  });
}
