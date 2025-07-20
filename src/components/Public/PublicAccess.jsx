"use client";

import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./PublicAccess.css"; // Import the CSS file

const PublicAccess = () => {
  const { token } = useParams();
  const [file, setFile] = useState(null);
  const [password, setPassword] = useState("");
  const [needsPassword, setNeedsPassword] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    checkFileAccess();
  }, [token]);

  const checkFileAccess = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/files/public/${token}`,
        { responseType: "blob" } // Expect blob for direct download
      );
      handleDownload(response);
    } catch (err) {
      if (err.response?.status === 401) {
        setNeedsPassword(true);
      } else if (err.response?.status === 404) {
        setError("File not found or the link is invalid.");
      } else if (err.response?.status === 410) {
        setError("This link has expired.");
      } else {
        setError("An error occurred while accessing the file.");
      }
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.get(
        `http://localhost:5000/api/files/public/${token}?password=${password}`,
        { responseType: "blob" }
      );
      handleDownload(response);
    } catch (err) {
      if (err.response?.status === 401) {
        setError("The password you entered is incorrect.");
      } else {
        setError("An error occurred while accessing the file.");
      }
      setLoading(false);
    }
  };

  const handleDownload = (response) => {
    const contentDisposition = response.headers["content-disposition"];
    let filename = "download";
    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename="(.+)"/);
      if (filenameMatch && filenameMatch[1]) {
        filename = filenameMatch[1];
      }
    }

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);

    setFile({ name: filename });
    setLoading(false);
    setNeedsPassword(false);
  };

  const handleDirectDownload = async () => {
    setDownloading(true);
    try {
      const response = await axios.get(
        `http://localhost:5000/api/files/public/${token}${
          password ? `?password=${password}` : ""
        }`,
        { responseType: "blob" }
      );
      handleDownload(response);
    } catch (err) {
      setError("Download failed. Please try again.");
    } finally {
      setDownloading(false);
    }
  };

  // Helper for rendering status pages
  const renderStatusPage = (status, iconPath, title, message) => (
    <div className="page-container">
      <div className="status-card">
        <svg
          className={`status-icon icon-${status}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d={iconPath}
          />
        </svg>
        <h3 className="status-title">{title}</h3>
        <p className="status-message">{message}</p>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="page-container">
        <div className="status-card">
          <div className="loader"></div>
          <p className="status-message">Loading file...</p>
        </div>
      </div>
    );
  }

  if (error && !needsPassword) {
    return renderStatusPage(
      "error",
      "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z",
      "Access Error",
      error
    );
  }

  if (needsPassword) {
    return (
      <div className="page-container">
        <div className="form-container">
          <div className="form-header">
            <h2 className="form-title">Password Required</h2>
            <p className="form-subtitle">
              This file is password protected. Please enter the password to
              download.
            </p>
          </div>
          <form className="form-body" onSubmit={handlePasswordSubmit}>
            {error && <div className="form-error-alert">{error}</div>}
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="form-input"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div>
              <button type="submit" disabled={loading} className="form-button">
                {loading ? "Accessing..." : "Access File"}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  if (file) {
    return (
      <div className="page-container">
        <div className="status-card">
          <svg
            className="status-icon icon-success"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 className="status-title">Download Started</h3>
          <p className="status-message">
            Your file "{file.name}" should start downloading shortly.
          </p>
          <button
            onClick={handleDirectDownload}
            disabled={downloading}
            className="form-button download-again-button"
          >
            {downloading ? "Downloading..." : "Download Again"}
          </button>
        </div>
      </div>
    );
  }

  return null;
};

export default PublicAccess;
