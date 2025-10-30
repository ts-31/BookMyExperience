import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import Experience from "./models/Experience.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const MONGO_URI = process.env.MONGO_URI;

// Connect to DB
mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Routes
app.get("/api/experiences", async (req, res) => {
  try {
    console.log("Experiences");
    const experiences = await Experience.find();
    res.json(experiences);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch experiences" });
  }
});

app.get("/api/experiences/:id", async (req, res) => {
  try {
    const experience = await Experience.findById(req.params.id);
    if (!experience) return res.status(404).json({ message: "Not found" });
    res.json(experience);
  } catch (err) {
    res.status(500).json({ message: "Error fetching experience" });
  }
});

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
