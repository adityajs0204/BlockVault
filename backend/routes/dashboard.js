import express from "express";
import Document from "../models/Document.js";

const router = express.Router();
router.get("/", async (req, res) => {
  const total = await Document.countDocuments();
  const verified = await Document.countDocuments({ verified: true });
  const tampered = total - verified;
  const byType = await Document.aggregate([{ $group: { _id: "$docType", count: { $sum: 1 } } }]);
  res.json({ total, verified, tampered, byType });
});
export default router;
