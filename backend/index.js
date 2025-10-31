// api/index.js
import app from "../backend/app.js";
import { connectDB } from "../backend/db.js";

let dbReady = false;
app.use(async (req, res, next) => {
  if (!dbReady) {
    try {
      await connectDB();
      dbReady = true;
    } catch (err) {
      console.error("DB connection failed:", err);
      return res.status(500).send("Database connection error");
    }
  }
  next();
});

export default app;
