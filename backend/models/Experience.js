import mongoose from "mongoose";

const slotSchema = new mongoose.Schema({
  time: String,
  available: Number,
});

const experienceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  location: { type: String, required: true },
  description: { type: String, required: true },
  about: { type: String },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  availableDates: [String],
  slots: {
    type: Map,
    of: [slotSchema],
  },
});

const Experience = mongoose.model("Experience", experienceSchema);

export default Experience;
