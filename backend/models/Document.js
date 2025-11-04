import mongoose from "mongoose";

const documentSchema = new mongoose.Schema({
  docId: { type: String, unique: true },
  title: String,
  docType: String,
  hash: String,
  blockchainTx: String,
  issuer: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  receiverEmail: String,
  verified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Document", documentSchema);
