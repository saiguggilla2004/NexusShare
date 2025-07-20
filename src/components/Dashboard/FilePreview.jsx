"use client";

import { useState, useEffect } from "react";
import "./FilePreview.css"; // Import the CSS file

const FilePreview = ({ file, onClose }) => {
  const [previewContent, setPreviewContent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPreview();
  }, [file]);

  const loadPreview = async () => {
    setLoading(true);

    if (file.mimetype.startsWith("image/")) {
      setPreviewContent({
        type: "image",
        src: `http://localhost:5000/uploads/${file.filename}`,
      });
    } else if (file.mimetype === "text/plain") {
      try {
        const response = await fetch(
          `http://localhost:5000/uploads/${file.filename}`
        );
        const text = await response.text();
        setPreviewContent({ type: "text", content: text });
      } catch (error) {
        console.error("Error loading text preview:", error);
        setPreviewContent({
          type: "error",
          message: "Could not load text preview",
        });
      }
    } else if (file.mimetype === "application/pdf") {
      setPreviewContent({
        type: "pdf",
        src: `http://localhost:5000/uploads/${file.filename}`,
      });
    } else {
      setPreviewContent({
        type: "info",
        message: "Preview not available for this file type",
      });
    }

    setLoading(false);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return (
      Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
    );
  };

  const renderPlaceholder = (type, iconPath, title, message, link) => (
    <div className="preview-placeholder">
      <svg
        className={`placeholder-icon icon-${type}`}
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
      <div className="placeholder-text">
        <p className="placeholder-title">{title}</p>
        <p className="placeholder-message">{message}</p>
        {link && (
          <a
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="placeholder-button"
          >
            {link.text}
          </a>
        )}
      </div>
    </div>
  );

  return (
    <div className="preview-overlay">
      <div className="preview-modal">
        {/* Header */}
        <div className="preview-header">
          <div className="preview-title-info">
            <h3 className="preview-title truncate">{file.originalName}</h3>
            <p className="preview-meta">
              {formatFileSize(file.size)} • {file.mimetype}
            </p>
          </div>
          <button onClick={onClose} className="preview-close-btn">
            <svg
              className="close-icon"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="preview-content">
          {loading ? (
            <div className="preview-loader-container">
              <div className="preview-loader"></div>
            </div>
          ) : (
            <div className="preview-content-area">
              {previewContent?.type === "image" && (
                <div className="preview-image-container">
                  <img
                    src={previewContent.src || "/placeholder.svg"}
                    alt={file.originalName}
                    className="preview-image"
                  />
                </div>
              )}

              {previewContent?.type === "text" && (
                <div className="preview-text-container">
                  <pre className="preview-text-content">
                    {previewContent.content}
                  </pre>
                </div>
              )}

              {previewContent?.type === "pdf" &&
                renderPlaceholder(
                  "pdf",
                  "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
                  "PDF Document",
                  "PDF preview is not available in this demo.",
                  { href: previewContent.src, text: "Open in New Tab" }
                )}

              {previewContent?.type === "info" &&
                renderPlaceholder(
                  "info",
                  "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
                  "File Information",
                  previewContent.message
                )}

              {previewContent?.type === "error" &&
                renderPlaceholder(
                  "error",
                  "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z",
                  "Preview Error",
                  previewContent.message
                )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FilePreview;
