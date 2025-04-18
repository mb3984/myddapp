import express from "express";
import Diary from "../models/Diary.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

// Create a new diary entry (POST)
router.post("/", verifyToken, async (req, res) => {
  const { content } = req.body;
  const diary = new Diary({ user: req.userId, content });
  await diary.save();
  res.json({ message: "Diary saved" });
});

// Fetch all diary entries (GET)
router.get("/", verifyToken, async (req, res) => {
  const { sort } = req.query;
  let sortObj = { date: -1 };

  if (sort === "year") sortObj = { date: -1 };
  if (sort === "month") sortObj = { date: -1 };
  if (sort === "day") sortObj = { date: -1 };

  const diaries = await Diary.find({ user: req.userId }).sort(sortObj);
  res.json(diaries);
});

// Update a diary entry by ID (PUT)
router.put("/:id", verifyToken, async (req, res) => {
  const { id } = req.params; // Extract the entry ID from the URL
  const { content } = req.body; // The new content to update

  try {
    // Find the diary entry by ID
    const diary = await Diary.findById(id);

    if (!diary) {
      return res.status(404).json({ message: "Diary entry not found" });
    }

    // Ensure the entry belongs to the logged-in user
    if (diary.user.toString() !== req.userId) {
      return res
        .status(403)
        .json({ message: "Forbidden: You can't update this entry" });
    }

    // Update the diary entry content
    diary.content = content;
    await diary.save();

    res.json({ message: "Diary entry updated successfully", diary });
  } catch (error) {
    res.status(500).json({ message: "Error updating diary entry", error });
  }
});
router.delete("/:id", verifyToken, async (req, res) => {
  const { id } = req.params;

  console.log("Attempting to delete diary entry with ID:", id);

  try {
    const diary = await Diary.findById(id);
    if (!diary) {
      console.log(`Diary entry with ID ${id} not found.`);
      return res.status(404).json({ message: "Diary entry not found" });
    }

    // Check if the user is authorized to delete this entry
    if (diary.user.toString() !== req.userId) {
      console.log(`User ${req.userId} is not authorized to delete this entry.`);
      return res
        .status(403)
        .json({ message: "Forbidden: You can't delete this entry" });
    }

    // Use deleteOne instead of remove to avoid the 'remove is not a function' error
    await Diary.deleteOne({ _id: id });
    console.log(`Diary entry with ID ${id} deleted successfully.`);
    res.json({ message: "Diary entry deleted successfully" });
  } catch (error) {
    console.error("Error deleting diary entry:", error);
    res
      .status(500)
      .json({ message: "Error deleting diary entry", error: error.message });
  }
});

export default router;
