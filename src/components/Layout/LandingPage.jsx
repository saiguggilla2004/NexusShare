import React from "react";
import { Link } from "react-router-dom";
import "./LandingPage.css"; // We'll create this CSS file next

const LandingPage = () => {
  return (
    <div className="landing-page">
      <header className="landing-header">
        <div className="logo">NexusShare</div>
        <nav>
          <Link to="/login" className="nav-link">
            Login
          </Link>
          <Link to="/register" className="nav-link register-link">
            Get Started
          </Link>
        </nav>
      </header>
      <main className="hero-section">
        <h1 className="hero-title">Securely Store and Share Your Files</h1>
        <p className="hero-subtitle">
          The easiest way to upload, manage, and share your important documents
          with anyone, anywhere.
        </p>
        <div className="hero-cta">
          <Link to="/register" className="cta-button">
            Create an Account for Free
          </Link>
        </div>
      </main>
    </div>
  );
};

export default LandingPage;
