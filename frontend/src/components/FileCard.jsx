import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { FileText, Download, QrCode, Eye, CheckCircle2, XCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function FileCard({ document, onView, onDownload, onShowQR, role = "user" }) {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">{document.title || "Untitled Document"}</CardTitle>
            </div>
            <Badge variant={document.verified ? "success" : "warning"}>
              {document.verified ? (
                <>
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  Verified
                </>
              ) : (
                <>
                  <XCircle className="h-3 w-3 mr-1" />
                  Unverified
                </>
              )}
            </Badge>
          </div>
          <CardDescription>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="outline">{document.docType || "Document"}</Badge>
              {document.issuer?.name && (
                <span className="text-sm text-muted-foreground">by {document.issuer.name}</span>
              )}
            </div>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            {document.receiverEmail && role === "issuer" && (
              <p className="text-muted-foreground">
                <span className="font-medium">Receiver:</span> {document.receiverEmail}
              </p>
            )}
            <p className="text-muted-foreground">
              <span className="font-medium">Issued:</span> {formatDate(document.createdAt)}
            </p>
            {document.blockchainTx && (
              <p className="text-muted-foreground font-mono text-xs break-all">
                <span className="font-medium">Tx Hash:</span> {document.blockchainTx.slice(0, 20)}...
              </p>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex gap-2">
          {onView && (
            <Button variant="outline" size="sm" onClick={() => onView(document)}>
              <Eye className="h-4 w-4 mr-2" />
              View
            </Button>
          )}
          {onDownload && (
            <Button variant="outline" size="sm" onClick={() => onDownload(document)}>
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          )}
          {onShowQR && (
            <Button variant="outline" size="sm" onClick={() => onShowQR(document)}>
              <QrCode className="h-4 w-4 mr-2" />
              QR Code
            </Button>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  );
}

