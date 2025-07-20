"use client";

import { useState } from "react";
import axios from "axios";
import "./ShareModal.css"; // Import the CSS file

const ShareModal = ({ file, onClose, socket }) => {
  const [email, setEmail] = useState("");
  const [permissions, setPermissions] = useState("download");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleShare = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      await axios.post(`http://localhost:5000/api/share/file/${file._id}`, {
        email,
        permissions,
      });

      setMessage("File shared successfully!");
      setEmail("");

      // Emit real-time notification
      if (socket) {
        socket.emit("file-shared", {
          recipientEmail: email,
          fileName: file.originalName,
          fileId: file._id,
          senderName: "Current User", // Replace with actual user name from auth context
        });
      }

      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to share file");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onMouseDown={onClose}>
      <div className="modal-card" onMouseDown={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">Share File</h3>
          <button
            onClick={onClose}
            className="modal-close-btn"
            aria-label="Close"
          >
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

        <div className="modal-body">
          <p className="file-info">
            Sharing: <span className="file-name">{file.originalName}</span>
          </p>

          {message && <div className="alert alert-success">{message}</div>}
          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={handleShare} className="modal-form">
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Share with email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input"
                placeholder="user@example.com"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="permissions" className="form-label">
                Permissions
              </label>
              <select
                id="permissions"
                value={permissions}
                onChange={(e) => setPermissions(e.target.value)}
                className="form-input"
              >
                <option value="view">View only</option>
                <option value="download">View and download</option>
              </select>
            </div>

            <div className="form-actions">
              <button
                type="button"
                onClick={onClose}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary"
              >
                {loading ? "Sharing..." : "Share"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
