// ✅ Load .env FIRST (from backend/.env)
import "./loadEnv.js"; // This file calls dotenv.config() explicitly — no need to repeat below

import express from "express";
import cors from "cors";
import fs from "fs";
import connectDB from "./utils/connectDB.js";
import authRoutes from "./routes/auth.js";
import documentRoutes from "./routes/documents.js";
import dashboardRoutes from "./routes/dashboard.js";
import pdfRoutes from "./routes/pdf.js";

// ✅ Confirm env variables loaded (optional debug)
console.log("📦 ENV TEST: PRIVATE_KEY =", process.env.PRIVATE_KEY ? "Loaded ✅" : "❌ Missing");

// Connect to MongoDB Atlas
await connectDB();

// Create Express app
const app = express();

// CORS configuration
app.use(
  cors({
    origin: process.env.FRONTEND_ORIGIN || "http://localhost:5173",
    credentials: true,
  })
);

// Parse JSON requests
app.use(express.json());

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/documents", documentRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/pdf", pdfRoutes);

// Health check
app.get("/", (_, res) => res.send("🚀 Digital Locker API is working!"));

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));

// Optional: Show deployed contract address in console
try {
  const contractInfo = JSON.parse(
    fs.readFileSync(new URL("./contract/contractInfo.json", import.meta.url))
  );
  console.log("📜 Smart Contract Address:", contractInfo.address);
} catch {
  console.log("⚠️ No contractInfo.json found — deploy contract first!");
}
