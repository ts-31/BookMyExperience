// backend/server.js
import dotenv from "dotenv";
dotenv.config();
import app from "./app.js";
import { connectDB } from "./db.js";

const PORT = process.env.PORT || 5000;
await connectDB();
app.listen(PORT, () => console.log(`🚀 Local server running on port ${PORT}`));
