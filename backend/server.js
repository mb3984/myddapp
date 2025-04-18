import express from "express";
import mongoose from "mongoose";
import path from "path";

import { fileURLToPath } from "url";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import diaryRoutes from "./routes/diaryRoutes.js";

const app = express();
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(cors({ origin: "http://localhost:5173" }));

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/diary", diaryRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() =>
    app.listen(4000, () => console.log("Server running on port 4000"))
  )
  .catch((err) => console.log(err));

// Serve React frontend
if (process.env.NODE_ENV === "production") {
  const staticPath = path.resolve(__dirname, "../frontend/dist");
  app.use(express.static(staticPath));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(staticPath, "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.send("Deveelopment Mode: Server is running.");
  });
}
