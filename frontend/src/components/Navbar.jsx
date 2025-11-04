import { LogOut, User } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function Navbar({ user, onLogout }) {
  const navigate = useNavigate();

  // Always enforce dark theme when navbar mounts (i.e., after login)
  useEffect(() => {
    document.documentElement.classList.add("dark");
    localStorage.setItem("darkMode", "true");
  }, []);

  const handleLogout = () => {
    onLogout();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const roleColors = {
    issuer: "bg-blue-500",
    user: "bg-green-500",
    verifier: "bg-purple-500",
  };

  if (!user) return null;

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            🔒 Digital Locker Blockchain
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">{user.name}</span>
            <Badge variant="outline" className={roleColors[user.role]}>
              {user.role?.toUpperCase()}
            </Badge>
          </div>
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>
    </nav>
  );
}

