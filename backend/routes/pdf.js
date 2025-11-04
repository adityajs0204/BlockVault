import express from "express";
import PDFDocument from "pdfkit";
import Document from "../models/Document.js";

const router = express.Router();

router.get("/:docId", async (req, res) => {
  const doc = await Document.findOne({ docId: req.params.docId });
  if (!doc) return res.status(404).send("Not found");

  res.setHeader("Content-Type", "application/pdf");
  const pdf = new PDFDocument();
  pdf.pipe(res);
  pdf.fontSize(18).text("Digital Locker Blockchain Verification", { align: "center" });
  pdf.moveDown();
  pdf.text(`Document ID: ${doc.docId}`);
  pdf.text(`Title: ${doc.title}`);
  pdf.text(`Type: ${doc.docType}`);
  pdf.text(`Hash: ${doc.hash}`);
  pdf.text(`Blockchain Tx: ${doc.blockchainTx}`);
  pdf.text(`Verified: ${doc.verified ? "Yes" : "No"}`);
  pdf.text(`Issued On: ${doc.createdAt}`);
  pdf.end();
});
export default router;
