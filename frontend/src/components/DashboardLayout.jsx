import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

export default function DashboardLayout({ user, onLogout, children }) {
  return (
    <div className="min-h-screen bg-background">
      <Navbar user={user} onLogout={onLogout} />
      <div className="flex">
        <Sidebar user={user} onLogout={onLogout} />
        <main className="flex-1 ml-64 min-h-[calc(100vh-4rem)]">
          {children}
        </main>
      </div>
    </div>
  );
}

