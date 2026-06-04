import express from "express";
import cors from "cors";
import "dotenv/config";

import connectDB from "./configs/db.js";
import userRouter from "./routes/userRoutes.js";
import resumeRouter from "./routes/resumeRoutes.js";
import aiRouter from "./routes/aiRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

// connect DB
connectDB();

app.get("/", (req, res) => {
  res.send("Server is live...");
});

// routes
app.use("/api/users", userRouter);
app.use("/api/resumes", resumeRouter);
app.use("/api/ai", aiRouter);

// error handler
app.use((err, req, res, next) => {
  console.error("🔥 SERVER ERROR:", err);
  res.status(500).json({ message: err.message || "Internal Server Error" });
});

// IMPORTANT for Vercel
export default app;


// ONLY for local testing
if (process.env.NODE_ENV !== "production") {
  app.listen(3000, () => {
    console.log("Server running locally on port 3000");
  });
}