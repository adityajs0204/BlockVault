import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { documentAPI } from "../api";
import toast from "react-hot-toast";
import LoadingSpinner from "../components/LoadingSpinner";
import FileCard from "../components/FileCard";
import { Download, Eye } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../components/ui/dialog";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { motion } from "framer-motion";
import { Button } from "../components/ui/button";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export default function DashboardUser({ user }) {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(null);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const res = await documentAPI.getMyDocuments(user.role, user.email, user.id);
      if (Array.isArray(res.data)) {
        setDocuments(res.data);
      } else if (res.data?.documents) {
        setDocuments(res.data.documents);
      } else {
        setDocuments([]);
      }
    } catch (error) {
      console.error("Error fetching documents:", error);
      setDocuments([]);
      if (error.response?.status !== 404) {
        toast.error("Failed to load documents");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleView = async (doc) => {
    setSelectedDoc(doc);
    const baseUrl = "http://localhost:4000";
    const url = `${baseUrl}/api/pdf/${doc.docId}`;
    setPdfUrl(url);
    setPreviewOpen(true);
  };

  const handleDownload = (doc) => {
    documentAPI.downloadPDF(doc.docId);
    toast.success("Downloading PDF...");
  };

  const handleVerify = async (doc) => {
    toast.info("Navigate to Verifier dashboard to verify this document");
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
        <h1 className="text-3xl font-bold">My Documents</h1>
        <p className="text-muted-foreground">All documents issued to you</p>
      </motion.div>

      {documents.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">No documents issued to you yet.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {documents.map((doc) => (
            <FileCard
              key={doc._id || doc.docId}
              document={doc}
              role="user"
              onView={() => handleView(doc)}
              onDownload={() => handleDownload(doc)}
            />
          ))}
        </div>
      )}

      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedDoc?.title || "Document Preview"}</DialogTitle>
          </DialogHeader>
          {pdfUrl && (
            <div className="flex justify-center">
              <Document file={pdfUrl} onLoadError={(error) => toast.error("Failed to load PDF")}>
                <Page pageNumber={1} renderTextLayer={false} renderAnnotationLayer={false} />
              </Document>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

