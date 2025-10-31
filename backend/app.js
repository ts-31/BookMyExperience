// backend/app.js
import express from "express";
import cors from "cors";
import Experience from "./models/Experience.js";
import PromoCode from "./models/PromoCode.js";
import Booking from "./models/Booking.js";

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.get("/ping", (req, res) => res.send("pong 🏓"));

app.get("/api/experiences", async (req, res) => {
  try {
    console.log("Exp");
    const experiences = await Experience.find();
    res.json(experiences);
  } catch {
    res.status(500).json({ message: "Failed to fetch experiences" });
  }
});

app.get("/api/experiences/:id", async (req, res) => {
  try {
    const experience = await Experience.findById(req.params.id);
    if (!experience) return res.status(404).json({ message: "Not found" });
    res.json(experience);
  } catch {
    res.status(500).json({ message: "Error fetching experience" });
  }
});

app.post("/api/bookings", async (req, res) => {
  try {
    const { experienceId, userName, userEmail, date, time, quantity } = req.body;
    if (!experienceId || !date || !time || !quantity)
      return res.status(400).json({ message: "Missing required fields" });

    const experience = await Experience.findById(experienceId);
    if (!experience)
      return res.status(404).json({ message: "Experience not found" });

    const availableSlots = experience.slots.get(date);
    if (!availableSlots)
      return res.status(400).json({ message: "Invalid date selected" });

    const slot = availableSlots.find((s) => s.time === time);
    if (!slot || slot.available < quantity)
      return res.status(400).json({ message: "Not enough availability" });

    slot.available -= quantity;
    experience.slots.set(date, availableSlots);
    await experience.save();

    const totalAmount = experience.price * quantity + 59;
    const refId = "HUF" + Math.random().toString(36).substring(2, 7).toUpperCase();

    const booking = new Booking({
      experience: experienceId,
      userName,
      userEmail,
      date,
      time,
      quantity,
      totalAmount,
      refId,
    });
    await booking.save();

    res.status(201).json({ message: "Booking confirmed", refId, totalAmount });
  } catch (err) {
    console.error("Booking error:", err);
    res.status(500).json({ message: "Failed to create booking" });
  }
});

app.get("/api/promocode/:code", async (req, res) => {
  try {
    const promo = await PromoCode.findOne({ code: req.params.code.toUpperCase() });
    if (!promo)
      return res.status(404).json({ valid: false, message: "Invalid promo code" });
    res.status(200).json({
      valid: true,
      discountType: promo.discountType,
      discountValue: promo.discountValue,
      message:
        promo.discountType === "percentage"
          ? `${promo.discountValue}% off applied`
          : `₹${promo.discountValue} off applied`,
    });
  } catch (err) {
    console.error("Promo code check error:", err);
    res.status(500).json({ valid: false, message: "Error validating promo code" });
  }
});

export default app;
