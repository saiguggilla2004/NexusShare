"use client";

import { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import io from "socket.io-client";
import Login from "../components/Auth/Login";
import Register from "../components/Auth/Register";
import Dashboard from "../components/Dashboard/Dashboard";
import SharedWithMe from "../components/Share/ShareWithMe";
import PublicAccess from "../components/Public/PublicAccess";
import { AuthProvider, useAuth } from "../contexts/AuthContext";
import { NotificationProvider } from "../contexts/NotificationContext";
import Navbar from "../components/Layout/Navbar";
import NotificationToast from "../components/Notifications/NotificationToast";
import "./App.css";
import ErrorBoundary from "../components/ErrorBoundary";
import LandingPage from "../components/Layout/LandingPage"; // <-- 1. Import the new component

const socket = io("http://localhost:5000", {
  transports: ["websocket", "polling"],
  timeout: 20000,
  forceNew: true,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

// ... (socket connection listeners remain the same)
socket.on("connect", () => {
  console.log("Socket connected successfully");
});

socket.on("connect_error", (error) => {
  console.error("Socket connection error:", error);
});

socket.on("disconnect", (reason) => {
  console.log("Socket disconnected:", reason);
  if (reason === "io server disconnect") {
    socket.connect();
  }
});

socket.on("reconnect", (attemptNumber) => {
  console.log("Socket reconnected after", attemptNumber, "attempts");
});

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <NotificationProvider socket={socket}>
          <Router>
            <AppContent socket={socket} />
          </Router>
        </NotificationProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

function AppContent({ socket }) {
  const { user, loading } = useAuth();

  useEffect(() => {
    if (user) {
      socket.emit("join-room", user.id);
    }
  }, [user, socket]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Use a conditional layout wrapper
  const Layout = ({ children }) => (
    <div className="min-h-screen bg-gray-50">
      {user && <Navbar />}
      <NotificationToast />
      {children}
    </div>
  );

  return (
    <Layout>
      <Routes>
        {/* 2. Update the main route to show LandingPage if not logged in */}
        <Route
          path="/"
          element={user ? <Navigate to="/dashboard" /> : <LandingPage />}
        />
        <Route
          path="/login"
          element={!user ? <Login /> : <Navigate to="/dashboard" />}
        />
        <Route
          path="/register"
          element={!user ? <Register /> : <Navigate to="/dashboard" />}
        />
        <Route
          path="/dashboard"
          element={
            user ? <Dashboard socket={socket} /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/shared"
          element={user ? <SharedWithMe /> : <Navigate to="/login" />}
        />
        <Route path="/public/:token" element={<PublicAccess />} />

        {/* 3. This catch-all can be removed or redirected to the new landing page */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Layout>
  );
}

export default App;
