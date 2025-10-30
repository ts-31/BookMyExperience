import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    experience: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Experience",
      required: true,
    },
    userName: { type: String, required: true },
    userEmail: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    quantity: { type: Number, required: true },
    totalAmount: { type: Number, required: true },
    refId: { type: String, unique: true, required: true },
  },
  { timestamps: true }
);

const Booking = mongoose.model("Booking", bookingSchema);
export default Booking;
