import express from "express";
import multer from "multer";
import fs from "fs";
import crypto from "crypto";
import { v4 as uuidv4 } from "uuid";
import { ethers } from "ethers";
import { verifyToken } from "../utils/verifyToken.js";
import Document from "../models/Document.js";
import nodemailer from "nodemailer";

// ✅ Load contract info (ESM compatible)
const contractInfo = JSON.parse(
  fs.readFileSync(new URL("../contract/contractInfo.json", import.meta.url))
);

const router = express.Router();
const upload = multer({ dest: "uploads/" });

// ✅ Blockchain setup
const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
console.log("🔐 PRIVATE_KEY FROM ENV:", process.env.PRIVATE_KEY);
console.log("LENGTH:", process.env.PRIVATE_KEY?.length || "❌ MISSING");

const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
const contract = new ethers.Contract(contractInfo.address, contractInfo.abi, wallet);

// ✅ Utility: generate SHA-256 hash from file buffer
const hashFile = (buf) => crypto.createHash("sha256").update(buf).digest("hex");

// ====================================================================
// 📄 1️⃣ ISSUE DOCUMENT — Issuer uploads document
// ====================================================================
router.post("/issue", verifyToken(["issuer"]), upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const buf = fs.readFileSync(req.file.path);
    const fileHash = hashFile(buf);
    const docId = uuidv4();

    console.log(`🧾 Registering docId=${docId}`);
    console.log(`🔐 File Hash: ${fileHash}`);

    // ✅ Register document on blockchain
    const tx = await contract.registerDocument(docId, fileHash);
    await tx.wait();
    console.log("✅ Blockchain transaction confirmed:", tx.hash);

    // ✅ Save metadata in MongoDB
    const doc = await Document.create({
      docId,
      title: req.body.title,
      docType: req.body.docType,
      hash: fileHash,
      blockchainTx: tx.hash,
      issuer: req.user.id,
      receiverEmail: req.body.receiverEmail,
    });

    // ✅ Optional: send email with verify link
    if (process.env.EMAIL_USER && req.body.receiverEmail) {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
      });

      const verifyUrl = `${process.env.FRONTEND_ORIGIN}/verify?docId=${docId}`;

      await transporter.sendMail({
        from: `Digital Locker <${process.env.EMAIL_USER}>`,
        to: req.body.receiverEmail,
        subject: "✅ Your Document Has Been Issued",
        html: `
          <h2>Digital Locker Blockchain</h2>
          <p>A new document has been issued to you.</p>
          <p><b>Document ID:</b> ${docId}</p>
          <p><b>Verify here:</b> <a href="${verifyUrl}" target="_blank">${verifyUrl}</a></p>
        `,
      });

      console.log(`📧 Email sent to ${req.body.receiverEmail}`);
    }

    fs.unlinkSync(req.file.path); // clean temp file
    res.json({ ok: true, doc });

  } catch (err) {
    console.error("❌ Error issuing document:", err);
    res.status(500).json({ error: err.message });
  }
});

// ====================================================================
// 🔍 2️⃣ VERIFY DOCUMENT — Anyone can verify via QR or /verify page
// ====================================================================
router.post("/verify", upload.single("file"), async (req, res) => {
  try {
    if (!req.file || !req.body.docId) {
      return res.status(400).json({ error: "File and docId required" });
    }

    const { docId } = req.body;
    const buf = fs.readFileSync(req.file.path);
    const fileHash = hashFile(buf);

    console.log(`\n🔍 Verifying docId=${docId}`);
    console.log("📄 Uploaded File Hash:", fileHash);

    // ✅ Get stored hash from blockchain for debugging
    const storedDoc = await contract.getDocument(docId);
    const blockchainHash = storedDoc[0];
    console.log("📦 Blockchain Stored Hash:", blockchainHash);

    if (blockchainHash !== fileHash) {
      console.log("❌ Hash mismatch — file content differs!");
    } else {
      console.log("✅ Hashes match perfectly!");
    }

    // ✅ Smart contract double-check (Solidity verifyDocument)
    const isValid = await contract.verifyDocument(docId, fileHash);
    console.log("🧠 Smart Contract Verification Result:", isValid);

    // ✅ Update verification status in DB
    const doc = await Document.findOne({ docId });
    if (doc) {
      doc.verified = isValid;
      await doc.save();
    }

    fs.unlinkSync(req.file.path); // cleanup
    res.json({ ok: true, isValid, doc });

  } catch (err) {
    console.error("❌ Error verifying document:", err);
    res.status(500).json({ error: err.message });
  }
});

// ====================================================================
// 📚 3️⃣ LIST DOCUMENTS — Needed by frontend Issued/Received pages
// ====================================================================
// Issuer's issued documents
router.get("/issued", verifyToken(["issuer"]), async (req, res) => {
  try {
    let issuerId = req.query.issuerId;

    // Treat missing/invalid values as unset and fallback to token id
    if (!issuerId || issuerId === "undefined" || issuerId === "null") {
      issuerId = req.user.id;
    }

    // Validate ObjectId to avoid CastError
    const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(String(issuerId));
    if (!isValidObjectId) {
      return res.status(400).json({ error: "Invalid issuerId" });
    }

    const documents = await Document.find({ issuer: issuerId }).sort({ createdAt: -1 });
    res.json({ documents });
  } catch (err) {
    console.error("❌ Error fetching issued documents:", err);
    res.status(500).json({ error: err.message });
  }
});

// Documents received by email (user inbox)
router.get("/received", verifyToken(["user", "issuer", "verifier"]), async (req, res) => {
  try {
    const email = req.query.email;
    if (!email) return res.status(400).json({ error: "email query param is required" });
    const documents = await Document.find({ receiverEmail: email }).sort({ createdAt: -1 });
    res.json({ documents });
  } catch (err) {
    console.error("❌ Error fetching received documents:", err);
    res.status(500).json({ error: err.message });
  }
});

// Get single document by docId
router.get("/:docId", async (req, res) => {
  try {
    const doc = await Document.findOne({ docId: req.params.docId });
    if (!doc) return res.status(404).json({ error: "Not found" });
    res.json(doc);
  } catch (err) {
    console.error("❌ Error fetching document:", err);
    res.status(500).json({ error: err.message });
  }
});

// Issuer-specific stats for dashboard
router.get("/stats/issuer", verifyToken(["issuer"]), async (req, res) => {
  try {
    let issuerId = req.query.issuerId;
    if (!issuerId || issuerId === "undefined" || issuerId === "null") {
      issuerId = req.user.id;
    }
    const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(String(issuerId));
    if (!isValidObjectId) {
      return res.status(400).json({ error: "Invalid issuerId" });
    }

    const totalIssued = await Document.countDocuments({ issuer: issuerId });
    const verified = await Document.countDocuments({ issuer: issuerId, verified: true });
    const pending = Math.max(totalIssued - verified, 0);

    res.json({ totalIssued, verified, pending });
  } catch (err) {
    console.error("❌ Error fetching issuer stats:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
