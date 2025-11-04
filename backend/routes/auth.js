import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

// Seed demo users
router.post("/seed", async (req, res) => {
  const demo = [
    { name: "SRM University", email: "issuer@gov.in", password: "123456", role: "issuer" },
    { name: "Student", email: "user@india.com", password: "123456", role: "user" },
    { name: "Employer", email: "verifier@aicte.in", password: "123456", role: "verifier" },
  ];
  for (const u of demo) {
    const exists = await User.findOne({ email: u.email });
    if (!exists) await User.create(u);
  }
  res.json({ ok: true });
});

// Register new user
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password || !role) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ error: "Email already in use" });
    }

    const user = await User.create({ name, email, password, role });

    const token = jwt.sign(
      { id: user._id, role: user.role, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(201).json({ ok: true, token, user });
  } catch (err) {
    // Handle duplicate key or other DB errors gracefully
    if (err?.code === 11000) {
      return res.status(409).json({ error: "Email already in use" });
    }
    console.error("/register error:", err);
    res.status(500).json({ error: "Registration failed" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ error: "No user" });
  const ok = await user.comparePassword(password);
  if (!ok) return res.status(400).json({ error: "Wrong password" });

  const token = jwt.sign(
    { id: user._id, role: user.role, name: user.name },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );
  res.json({ ok: true, token, user });
});

export default router;
