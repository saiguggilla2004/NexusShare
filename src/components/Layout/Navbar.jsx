"use client";

import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useNotifications } from "../../contexts/NotificationContext";
import "./Navbar.css";

const Navbar = () => {
  const { user, logout } = useAuth();
  const { notifications } = useNotifications();
  const location = useLocation();

  const unreadCount = notifications.filter((n) => !n.read).length;

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-left">
          <Link to="/dashboard" className="navbar-brand">
            NexusShare
          </Link>
          <div className="navbar-links">
            <Link
              to="/dashboard"
              className={`navbar-link ${
                isActive("/dashboard") ? "active" : ""
              }`}
            >
              My Files
            </Link>
            <Link
              to="/shared"
              className={`navbar-link ${isActive("/shared") ? "active" : ""}`}
            >
              Shared with Me
            </Link>
          </div>
        </div>

        <div className="navbar-right">
          {/* Notifications */}
          <div className="notification-button">
            <button className="icon-button">
              <svg
                className="icon"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 17h5l-5 5v-5zM4 19h10a2 2 0 002-2V7a2 2 0 00-2-2H4a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              {unreadCount > 0 && (
                <span className="notification-count">{unreadCount}</span>
              )}
            </button>
          </div>

          {/* User menu */}
          <div className="user-menu">
            <span className="user-greeting">Welcome, {user?.name}</span>
            <button onClick={logout} className="logout-button">
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
