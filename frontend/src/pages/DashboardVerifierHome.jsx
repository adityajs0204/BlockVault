import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { motion } from "framer-motion";
import { FileCheck, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";

export default function DashboardVerifierHome({ user }) {
  return (
    <div className="p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold">Verifier Dashboard</h1>
        <p className="text-muted-foreground">Verify document authenticity using blockchain</p>
      </motion.div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <Shield className="h-8 w-8 text-primary" />
              <CardTitle>Document Verification</CardTitle>
            </div>
            <CardDescription>
              Verify the authenticity of documents by comparing their hash with blockchain records
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/dashboard/verifier/verify">
              <Button className="w-full">
                <FileCheck className="h-4 w-4 mr-2" />
                Start Verification
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>How It Works</CardTitle>
            <CardDescription>Understanding the verification process</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>1. Upload the document file you want to verify</p>
            <p>2. Enter the document ID</p>
            <p>3. System compares document hash with blockchain</p>
            <p>4. Get instant verification result</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

