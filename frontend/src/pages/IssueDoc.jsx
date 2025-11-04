import { useState } from "react";
import { API } from "../api";
import { QRCodeCanvas } from "qrcode.react"; // ✅ correct import for qrcode.react@4.2.0

export default function IssueDoc() {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [docType, setDocType] = useState("degree_certificate");
  const [receiverEmail, setReceiverEmail] = useState("");
  const [res, setRes] = useState(null);

  async function issue(e) {
    e.preventDefault();
    const fd = new FormData();
    fd.append("file", file);
    fd.append("title", title);
    fd.append("docType", docType);
    fd.append("receiverEmail", receiverEmail);

    try {
      const r = await API.post("/documents/issue", fd);
      setRes(r.data);
    } catch (err) {
      alert("Error issuing document: " + err.message);
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">📄 Issue Document</h2>

      <form className="card" onSubmit={issue}>
        <input
          className="input"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <select
          className="input"
          value={docType}
          onChange={(e) => setDocType(e.target.value)}
        >
          <option value="degree_certificate">Degree Certificate</option>
          <option value="property_document">Property Document</option>
          <option value="license">License</option>
        </select>

        <input
          className="input"
          placeholder="Receiver Email"
          value={receiverEmail}
          onChange={(e) => setReceiverEmail(e.target.value)}
        />

        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          className="input"
        />

        <button className="btn">Issue</button>
      </form>

      {res?.ok && (
        <div className="card mt-4 text-center">
          <h3 className="font-semibold text-green-700 mb-2">
            ✅ Document Issued
          </h3>
          <p>
            <b>ID:</b> {res.doc.docId}
          </p>
          <p>
            <b>Tx:</b> {res.doc.blockchainTx}
          </p>

          <div className="flex justify-center mt-4">
            {/* ✅ use the correct component name here */}
            <QRCodeCanvas
              value={`http://localhost:5173/verify?docId=${res.doc.docId}`}
              size={180}
              includeMargin={true}
            />
          </div>
        </div>
      )}
    </div>
  );
}
