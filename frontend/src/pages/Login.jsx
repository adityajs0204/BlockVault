import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { authAPI } from "../api";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { Lock, LogIn } from "lucide-react";
import LoadingSpinner from "../components/LoadingSpinner";

export default function Login({ setUser }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("issuer@gov.in");
  const [password, setPassword] = useState("123456");

  const handleLogin = async (e) => {
    e?.preventDefault();
    setLoading(true);

    try {
      const res = await authAPI.login({ email, password });
      if (res.data.ok) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        setUser(res.data.user);
        toast.success("Login successful!");
        
        // Redirect based on role
        const role = res.data.user.role;
        if (role === "issuer") {
          navigate("/dashboard/issuer");
        } else if (role === "user") {
          navigate("/dashboard/user");
        } else if (role === "verifier") {
          navigate("/dashboard/verifier");
        } else {
          navigate("/");
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.error || "Login failed!");
    } finally {
      setLoading(false);
    }
  };

  const handleSeed = async () => {
    try {
      await authAPI.seed();
      toast.success("Demo users created!");
    } catch (error) {
      toast.error("Failed to seed users");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card>
          <CardHeader className="space-y-1 text-center">
            <div className="flex justify-center mb-2">
              <div className="p-3 rounded-full bg-primary/10">
                <Lock className="h-6 w-6 text-primary" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
            <CardDescription>
              Login to your Digital Locker account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  <>
                    <LogIn className="h-4 w-4 mr-2" />
                    Login
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={handleSeed}
              >
                Seed Demo Users
              </Button>
            </form>
            <div className="mt-4 p-3 bg-muted rounded-md">
              <p className="text-xs text-muted-foreground text-center">
                Demo credentials:
              </p>
              <p className="text-xs text-center mt-1">
                issuer@gov.in / user@india.com / verifier@aicte.in
              </p>
              <p className="text-xs text-center text-muted-foreground">Password: 123456</p>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <p className="text-sm text-muted-foreground text-center">
              Don't have an account?{" "}
              <Link to="/register" className="text-primary hover:underline">
                Register
              </Link>
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
