import mongoose from "mongoose";
import dotenv from "dotenv";
import Experience from "./models/Experience.js";
import PromoCode from "./models/PromoCode.js";
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

    const data = JSON.parse(
      fs.readFileSync("./data/experiences.json", "utf-8")
    );

    await Experience.deleteMany({});
    await PromoCode.deleteMany({});
    console.log("🧹 Cleared old data");

    await Experience.insertMany(data);
    console.log(`🌱 Seeded ${data.length} experiences successfully`);

    const promoCodes = [
      { code: "SAVE10", discountType: "percentage", discountValue: 10 },
      { code: "FLAT100", discountType: "flat", discountValue: 100 },
    ];
    await PromoCode.insertMany(promoCodes);
    console.log("🎁 Seeded promo codes: SAVE10, FLAT100");

    mongoose.connection.close();
    console.log("🔌 MongoDB connection closed");
  } catch (err) {
    console.error("❌ Error seeding database:", err);
    process.exit(1);
  }
}

seedDatabase();
