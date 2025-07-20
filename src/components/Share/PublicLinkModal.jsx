"use client";

import { useState } from "react";
import axios from "axios";
import "./PublicLinkModal.css"; // Import the CSS file

const PublicLinkModal = ({ file, onClose }) => {
  const [password, setPassword] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [publicUrl, setPublicUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const handleGenerateLink = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setCopied(false);

    try {
      const response = await axios.post(
        `http://localhost:5000/api/files/${file._id}/public-link`,
        {
          password: password || null,
          expiresAt: expiresAt || null,
        }
      );
      setPublicUrl(response.data.publicUrl);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to generate public link");
    } finally {
      setLoading(false);
    }
  };

  const handleCopyLink = () => {
    // Using the 'copy' command for broader browser support in iframes
    const input = document.createElement("textarea");
    input.value = publicUrl;
    document.body.appendChild(input);
    input.select();
    try {
      document.execCommand("copy");
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy link:", err);
      setError("Could not copy link to clipboard.");
    }
    document.body.removeChild(input);
  };

  return (
    <div className="modal-overlay" onMouseDown={onClose}>
      <div className="modal-card" onMouseDown={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">Create Public Link</h3>
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
            File: <span className="file-name">{file.originalName}</span>
          </p>

          {error && <div className="alert alert-error">{error}</div>}

          {!publicUrl ? (
            <form onSubmit={handleGenerateLink} className="modal-form">
              <div className="form-group">
                <label htmlFor="password" className="form-label">
                  Password Protection (Optional)
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-input"
                  placeholder="Leave empty for no password"
                />
              </div>

              <div className="form-group">
                <label htmlFor="expiresAt" className="form-label">
                  Expiration Date (Optional)
                </label>
                <input
                  type="datetime-local"
                  id="expiresAt"
                  value={expiresAt}
                  onChange={(e) => setExpiresAt(e.target.value)}
                  min={new Date().toISOString().slice(0, 16)}
                  className="form-input"
                />
                <p className="form-hint">Leave empty for no expiration.</p>
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
                  {loading ? "Generating..." : "Generate Link"}
                </button>
              </div>
            </form>
          ) : (
            <div className="link-display-section">
              <div className="form-group">
                <label className="form-label">Your Public Link:</label>
                <div className="copy-link-wrapper">
                  <input
                    type="text"
                    value={publicUrl}
                    readOnly
                    className="form-input copy-link-input"
                  />
                  <button
                    onClick={handleCopyLink}
                    className="btn btn-primary copy-link-btn"
                  >
                    {copied ? "Copied!" : "Copy"}
                  </button>
                </div>
              </div>

              <div className="alert alert-notice">
                <strong>Security Notice:</strong> Anyone with this link can
                access your file.
                {password && " Password protection is enabled."}
                {expiresAt &&
                  ` The link will expire on ${new Date(
                    expiresAt
                  ).toLocaleString()}.`}
              </div>

              <button onClick={onClose} className="btn btn-close-final">
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PublicLinkModal;
