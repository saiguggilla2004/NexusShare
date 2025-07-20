"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import "./ShareWithMe.css"; // <-- Import the CSS file

// Generic Icon Component (unchanged, styling is passed via props)
const GenericFileIcon = ({ className }) => (
  <svg
    className={`file-icon ${className}`} // Base class + specific class
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
    />
  </svg>
);

const SharedWithMe = () => {
  const [sharedFiles, setSharedFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ... (fetchSharedFiles, useEffect, handleDownload, and formatFileSize functions are the same as before)
  const fetchSharedFiles = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(
        "http://localhost:5000/api/share/shared-with-me",
        { withCredentials: true }
      );
      const rawFiles = Array.isArray(response.data) ? response.data : [];
      const validFiles = rawFiles.filter(
        (file) =>
          file && file._id && file.originalName && file.owner && file.owner.name
      );
      setSharedFiles(validFiles);
    } catch (error) {
      console.error("Error fetching shared files:", error);
      setError("Failed to load shared files. Please try again.");
      setSharedFiles([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSharedFiles();
  }, []);

  const handleDownload = async (file) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/files/download/${file._id}`,
        {
          responseType: "blob",
          withCredentials: true,
        }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", file.originalName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading file:", error);
      setError("Failed to download file. Please try again.");
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes || bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  };

  const getFileIcon = (mimetype) => {
    if (mimetype?.startsWith("image/")) {
      return (
        <svg
          className="file-icon image-icon"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      );
    }
    if (mimetype === "application/pdf") {
      return <GenericFileIcon className="pdf-icon" />;
    }
    if (mimetype?.startsWith("video/")) {
      return <GenericFileIcon className="video-icon" />;
    }
    return <GenericFileIcon className="default-icon" />;
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  const StateMessage = ({ icon, title, message, children }) => (
    <div className="state-message-container">
      <div className="state-icon">{icon}</div>
      <h3 className="state-title">{title}</h3>
      <p className="state-message">{message}</p>
      {children}
    </div>
  );

  if (error) {
    return (
      <div className="page-container">
        <StateMessage
          icon={
            <svg
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126z"
              />
            </svg>
          }
          title="Error Loading Files"
          message={error}
        >
          <button onClick={fetchSharedFiles} className="button primary-button">
            Try Again
          </button>
        </StateMessage>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Shared with Me</h1>
        <p className="page-subtitle">Files that others have shared with you.</p>
      </div>

      {sharedFiles.length === 0 ? (
        <StateMessage
          icon={
            <svg
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          }
          title="No shared files"
          message="When someone shares a file with you, it will appear here."
        />
      ) : (
        <div className="file-list-container">
          <ul className="file-list">
            {sharedFiles.map((file) => (
              <li key={file._id} className="file-list-item">
                <div className="item-content">
                  <div className="item-icon-wrapper">
                    {getFileIcon(file.mimetype)}
                  </div>
                  <div className="item-details">
                    <p className="item-name">{file.originalName}</p>
                    <p className="item-metadata">
                      <span>Shared by {file.owner.name}</span>
                      <span className="separator">&bull;</span>
                      <span>{formatFileSize(file.size)}</span>
                      <span className="separator">&bull;</span>
                      <span>
                        {new Date(file.createdAt).toLocaleDateString()}
                      </span>
                    </p>
                  </div>
                </div>
                <div className="item-actions">
                  <button
                    onClick={() => handleDownload(file)}
                    className="button download-button"
                  >
                    <svg
                      className="button-icon"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
                      />
                    </svg>
                    Download
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SharedWithMe;
