import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { documentAPI } from "../api";
import toast from "react-hot-toast";
import LoadingSpinner from "../components/LoadingSpinner";
import FileCard from "../components/FileCard";
import QRModal from "../components/QRModal";
import { Copy, QrCode } from "lucide-react";
import { Button } from "../components/ui/button";
import { motion } from "framer-motion";

export default function IssuedDocuments({ user }) {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [qrOpen, setQrOpen] = useState(false);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    setLoading(true);
    try {
      // Since backend may not have this endpoint, we'll handle gracefully
      const res = await documentAPI.getMyDocuments(user.role, user.email, user.id || user._id);
      if (Array.isArray(res.data)) {
        setDocuments(res.data);
      } else if (res.data?.documents) {
        setDocuments(res.data.documents);
      } else {
        // Fallback: try to get all documents (for demo purposes)
        setDocuments([]);
        toast.error("Endpoint not available. Please ensure backend has /documents/issued endpoint.");
      }
    } catch (error) {
      console.error("Error fetching documents:", error);
      setDocuments([]);
      // Don't show error if endpoint doesn't exist
      if (error.response?.status !== 404) {
        toast.error("Failed to load documents");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = (doc) => {
    documentAPI.downloadPDF(doc.docId);
    toast.success("Downloading PDF...");
  };

  const handleShowQR = (doc) => {
    setSelectedDoc(doc);
    setQrOpen(true);
  };

  const handleCopyLink = (doc) => {
    const link = `${window.location.origin}/verify?docId=${doc.docId}`;
    navigator.clipboard.writeText(link);
    toast.success("Verification link copied!");
  };

  if (loading) {
    return (
      <div className="p-6">
        <LoadingSpinner size="lg" className="mt-20" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold">Issued Documents</h1>
        <p className="text-muted-foreground">All documents you've issued</p>
      </motion.div>

      {documents.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">No documents issued yet.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {documents.map((doc) => (
            <FileCard
              key={doc._id || doc.docId}
              document={doc}
              role="issuer"
              onDownload={() => handleDownload(doc)}
              onShowQR={() => handleShowQR(doc)}
            />
          ))}
        </div>
      )}

      {selectedDoc && (
        <QRModal
          open={qrOpen}
          onOpenChange={setQrOpen}
          docId={selectedDoc.docId}
        />
      )}
    </div>
  );
}

