import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Login from "./pages/Login";
import Register from "./pages/Register";
import DashboardLayout from "./components/DashboardLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardIssuerHome from "./pages/DashboardIssuerHome";
import DashboardIssuer from "./pages/DashboardIssuer";
import IssuedDocuments from "./pages/IssuedDocuments";
import DashboardUser from "./pages/DashboardUser";
import DashboardVerifierHome from "./pages/DashboardVerifierHome";
import VerifyDocument from "./pages/VerifyDocument";

export default function App() {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });

  useEffect(() => {
    // Sync user state with localStorage changes
    const handleStorageChange = () => {
      const stored = localStorage.getItem("user");
      setUser(stored ? JSON.parse(stored) : null);
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  function logout() {
    localStorage.clear();
    setUser(null);
  }

  function handleSetUser(userData) {
    setUser(userData);
  }

  return (
    <Router>
      <div className="min-h-screen">
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: "hsl(var(--background))",
              color: "hsl(var(--foreground))",
              border: "1px solid hsl(var(--border))",
            },
          }}
        />
        <Routes>
          {/* Public routes */}
          <Route
            path="/login"
            element={
              user ? (
                <Navigate to={`/dashboard/${user.role}`} replace />
              ) : (
                <Login setUser={handleSetUser} />
              )
            }
          />
          <Route
            path="/register"
            element={
              user ? (
                <Navigate to={`/dashboard/${user.role}`} replace />
              ) : (
                <Register />
              )
            }
          />
          <Route path="/verify" element={<VerifyDocument />} />

          {/* Protected Issuer Routes */}
          <Route
            path="/dashboard/issuer"
            element={
              <ProtectedRoute user={user} requiredRole="issuer">
                <DashboardLayout user={user} onLogout={logout}>
                  <DashboardIssuerHome user={user} />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/issuer/issue"
            element={
              <ProtectedRoute user={user} requiredRole="issuer">
                <DashboardLayout user={user} onLogout={logout}>
                  <DashboardIssuer user={user} />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/issuer/documents"
            element={
              <ProtectedRoute user={user} requiredRole="issuer">
                <DashboardLayout user={user} onLogout={logout}>
                  <IssuedDocuments user={user} />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          {/* Protected User Routes */}
          <Route
            path="/dashboard/user"
            element={
              <ProtectedRoute user={user} requiredRole="user">
                <DashboardLayout user={user} onLogout={logout}>
                  <DashboardUser user={user} />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/user/documents"
            element={
              <ProtectedRoute user={user} requiredRole="user">
                <DashboardLayout user={user} onLogout={logout}>
                  <DashboardUser user={user} />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          {/* Protected Verifier Routes */}
          <Route
            path="/dashboard/verifier"
            element={
              <ProtectedRoute user={user} requiredRole="verifier">
                <DashboardLayout user={user} onLogout={logout}>
                  <DashboardVerifierHome user={user} />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/verifier/verify"
            element={
              <ProtectedRoute user={user} requiredRole="verifier">
                <DashboardLayout user={user} onLogout={logout}>
                  <VerifyDocument />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          {/* Root redirect */}
          <Route
            path="/"
            element={
              user ? (
                <Navigate to={`/dashboard/${user.role}`} replace />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}
