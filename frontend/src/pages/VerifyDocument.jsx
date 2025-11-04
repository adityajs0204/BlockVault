import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { documentAPI } from "../api";
import toast from "react-hot-toast";
import { FileCheck, CheckCircle2, XCircle, Upload } from "lucide-react";
import LoadingSpinner from "../components/LoadingSpinner";
import { Badge } from "../components/ui/badge";
import { motion } from "framer-motion";
import { useSearchParams } from "react-router-dom";

export default function VerifyDocument() {
  const [searchParams] = useSearchParams();
  const docIdFromUrl = searchParams.get("docId");
  
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [formData, setFormData] = useState({
    docId: docIdFromUrl || "",
    file: null,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.file || !formData.docId) {
      toast.error("Please provide both document ID and file");
      return;
    }

    setLoading(true);
    setResult(null);
    
    const data = new FormData();
    data.append("file", formData.file);
    data.append("docId", formData.docId);

    try {
      const res = await documentAPI.verify(data);
      if (res.data.ok) {
        setResult({
          isValid: res.data.isValid,
          doc: res.data.doc,
        });
        if (res.data.isValid) {
          toast.success("✅ Document is authentic!");
        } else {
          toast.error("❌ Document has been tampered with!");
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.error || "Verification failed");
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold">Verify Document</h1>
        <p className="text-muted-foreground">Upload a document to verify its authenticity on the blockchain</p>
      </motion.div>

      <Card>
        <CardHeader>
          <CardTitle>Document Verification</CardTitle>
          <CardDescription>
            Upload the document file along with the document ID to verify
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="docId">Document ID</Label>
              <Input
                id="docId"
                placeholder="Enter document ID"
                value={formData.docId}
                onChange={(e) => setFormData({ ...formData, docId: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="verify-file">Document File</Label>
              <Input
                id="verify-file"
                type="file"
                onChange={(e) => setFormData({ ...formData, file: e.target.files[0] })}
                required
                className="cursor-pointer"
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <LoadingSpinner size="sm" />
              ) : (
                <>
                  <FileCheck className="h-4 w-4 mr-2" />
                  Verify Document
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {result && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Card className={result.isValid ? "border-green-500" : "border-red-500"}>
            <CardHeader>
              <div className="flex items-center gap-3">
                {result.isValid ? (
                  <>
                    <CheckCircle2 className="h-8 w-8 text-green-500" />
                    <div>
                      <CardTitle className="text-green-600">Authentic Document</CardTitle>
                      <CardDescription>
                        This document matches the blockchain record
                      </CardDescription>
                    </div>
                  </>
                ) : (
                  <>
                    <XCircle className="h-8 w-8 text-red-500" />
                    <div>
                      <CardTitle className="text-red-600">Tampered Document</CardTitle>
                      <CardDescription>
                        This document does not match the blockchain record
                      </CardDescription>
                    </div>
                  </>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {result.doc && (
                <>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Document Title</p>
                      <p className="font-medium">{result.doc.title}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Document Type</p>
                      <p className="font-medium">{result.doc.docType}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Blockchain Tx</p>
                      <p className="font-mono text-xs break-all">{result.doc.blockchainTx}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Stored Hash</p>
                      <p className="font-mono text-xs break-all">{result.doc.hash?.slice(0, 32)}...</p>
                    </div>
                  </div>
                  <div className="pt-4 border-t">
                    <Badge variant={result.isValid ? "success" : "destructive"} className="text-sm py-1 px-3">
                      {result.isValid ? "✅ Verified" : "❌ Tampered"}
                    </Badge>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}

