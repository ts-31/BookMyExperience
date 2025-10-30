import mongoose from "mongoose";
import dotenv from "dotenv";
import Experience from "./models/Experience.js";
import fs from "fs";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

async function seedDatabase() {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ Connected to MongoDB");

    // Read JSON file
    const data = JSON.parse(fs.readFileSync("./data/experiences.json", "utf-8"));

    // Clear old data
    await Experience.deleteMany({});
    console.log("🧹 Cleared old data");

    // Insert new data
    await Experience.insertMany(data);
    console.log(`🌱 Seeded ${data.length} experiences successfully`);

    mongoose.connection.close();
    console.log("🔌 MongoDB connection closed");
  } catch (err) {
    console.error("❌ Error seeding database:", err);
    process.exit(1);
  }
}

seedDatabase();
