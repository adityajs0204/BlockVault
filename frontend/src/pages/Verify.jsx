import { useEffect, useState } from "react";
import { API } from "../api";

export default function Verify() {
  const params = new URLSearchParams(location.search);
  const [docId, setDocId] = useState(params.get("docId") || "");
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);

  async function verify(e) {
    e.preventDefault();
    const fd = new FormData();
    fd.append("docId", docId);
    fd.append("file", file);
    const r = await API.post("/documents/verify", fd);
    console.log("🔍 VERIFY RESPONSE:", r.data); // <--- ADD THIS LINE
    setResult(r.data);
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">🔍 Verify Document</h2>
      <form className="card" onSubmit={verify}>
        <input className="input" placeholder="Document ID" value={docId} onChange={(e) => setDocId(e.target.value)} />
        <input type="file" className="input" onChange={(e) => setFile(e.target.files[0])} />
        <button className="btn">Verify</button>
      </form>

      {result && (
        <div className="card mt-4 text-center">
          <h3 className={`text-xl font-bold ${result.isValid ? "text-green-700" : "text-red-700"}`}>
            {result.isValid ? "✅ Authentic Document" : "❌ Tampered Document"}
          </h3>
          <p className="text-sm text-gray-500">Doc Hash: {result.doc.hash}</p>
          <a href={`http://localhost:4000/api/pdf/${result.doc.docId}`} target="_blank" className="text-blue-600 underline mt-2 block">
            Download Verification PDF
          </a>
        </div>
      )}
    </div>
  );
}
