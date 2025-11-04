import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { documentAPI } from "../api";
import toast from "react-hot-toast";
import { Upload, FileText, CheckCircle2 } from "lucide-react";
import LoadingSpinner from "../components/LoadingSpinner";
import { motion } from "framer-motion";

export default function DashboardIssuer({ user }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    docType: "",
    receiverEmail: "",
    file: null,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.file) {
      toast.error("Please select a file");
      return;
    }

    setLoading(true);
    const data = new FormData();
    data.append("file", formData.file);
    data.append("title", formData.title);
    data.append("docType", formData.docType);
    data.append("receiverEmail", formData.receiverEmail);

    try {
      const res = await documentAPI.issue(data);
      if (res.data.ok) {
        toast.success(`Document issued successfully! Tx: ${res.data.doc.blockchainTx?.slice(0, 20)}...`);
        setFormData({ title: "", docType: "", receiverEmail: "", file: null });
        // Reset file input
        const fileInput = document.getElementById("file-input");
        if (fileInput) fileInput.value = "";
      }
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to issue document");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold">Issue Document</h1>
        <p className="text-muted-foreground">Upload and issue documents to users</p>
      </motion.div>

      <Card>
        <CardHeader>
          <CardTitle>Issue New Document</CardTitle>
          <CardDescription>
            Upload a document and register it on the blockchain
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Document Title</Label>
              <Input
                id="title"
                placeholder="e.g., Degree Certificate"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="docType">Document Type</Label>
              <Select
                value={formData.docType}
                onValueChange={(value) => setFormData({ ...formData, docType: value })}
              >
                <SelectTrigger id="docType">
                  <SelectValue placeholder="Select document type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="degree">Degree Certificate</SelectItem>
                  <SelectItem value="transcript">Transcript</SelectItem>
                  <SelectItem value="identity">Identity Card</SelectItem>
                  <SelectItem value="license">License</SelectItem>
                  <SelectItem value="certificate">Certificate</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="receiverEmail">Receiver Email</Label>
              <Input
                id="receiverEmail"
                type="email"
                placeholder="user@example.com"
                value={formData.receiverEmail}
                onChange={(e) => setFormData({ ...formData, receiverEmail: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="file-input">Document File</Label>
              <div className="flex items-center gap-4">
                <Input
                  id="file-input"
                  type="file"
                  onChange={(e) => setFormData({ ...formData, file: e.target.files[0] })}
                  required
                  className="cursor-pointer"
                />
                {formData.file && (
                  <span className="text-sm text-muted-foreground flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    {formData.file.name}
                  </span>
                )}
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <LoadingSpinner size="sm" />
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Issue Document
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

