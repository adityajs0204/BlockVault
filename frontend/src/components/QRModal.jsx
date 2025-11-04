import { QRCodeCanvas } from "qrcode.react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Copy, Check } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import toast from "react-hot-toast";

export default function QRModal({ open, onOpenChange, docId }) {
  const [copied, setCopied] = useState(false);
  const verifyUrl = `${window.location.origin}/verify?docId=${docId}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(verifyUrl);
    setCopied(true);
    toast.success("Verification link copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>QR Code for Verification</DialogTitle>
          <DialogDescription>
            Scan this QR code to verify the document authenticity
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center gap-4 py-4">
          <div className="bg-white p-4 rounded-lg">
            <QRCodeCanvas value={verifyUrl} size={256} />
          </div>
          <div className="w-full space-y-2">
            <p className="text-sm text-muted-foreground break-all">{verifyUrl}</p>
            <Button onClick={copyToClipboard} variant="outline" className="w-full">
              {copied ? (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Link
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

