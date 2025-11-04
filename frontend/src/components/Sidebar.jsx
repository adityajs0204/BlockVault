import { LayoutDashboard, FilePlus, Files, LogOut, FileCheck } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "./ui/button";
import { cn } from "../lib/utils";
import { motion } from "framer-motion";

const sidebarItems = {
  issuer: [
    { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard/issuer" },
    { icon: FilePlus, label: "Issue Document", path: "/dashboard/issuer/issue" },
    { icon: Files, label: "Issued Documents", path: "/dashboard/issuer/documents" },
  ],
  user: [
    { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard/user" },
    { icon: Files, label: "My Documents", path: "/dashboard/user/documents" },
  ],
  verifier: [
    { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard/verifier" },
    { icon: FileCheck, label: "Verify Document", path: "/dashboard/verifier/verify" },
  ],
};

export default function Sidebar({ user, onLogout }) {
  const location = useLocation();
  const items = sidebarItems[user?.role] || [];

  return (
    <aside className="w-64 border-r bg-card min-h-[calc(100vh-4rem)] fixed left-0 top-16 overflow-y-auto">
      <nav className="p-4 space-y-1">
        {items.map((item, index) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <motion.div
              key={item.path}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link to={item.path}>
                <Button
                  variant={isActive ? "default" : "ghost"}
                  className={cn(
                    "w-full justify-start gap-3",
                    isActive && "bg-primary text-primary-foreground"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  {item.label}
                </Button>
              </Link>
            </motion.div>
          );
        })}
        <div className="pt-4 border-t mt-4">
          <Button variant="ghost" className="w-full justify-start gap-3 text-destructive" onClick={onLogout}>
            <LogOut className="h-5 w-5" />
            Logout
          </Button>
        </div>
      </nav>
    </aside>
  );
}

