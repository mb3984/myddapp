// models/Diary.js (Diary Schema)
// Diary schema that stores encrypted content and reference to user

import mongoose from "mongoose";

const diarySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  content: { type: String, required: true },
  date: { type: Date, default: Date.now },
});

export default mongoose.model("Diary", diarySchema);
