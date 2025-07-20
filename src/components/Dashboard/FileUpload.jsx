"use client";

import { useState, useRef } from "react";
import axios from "axios";
import "./FileUpload.css"; // Import the CSS file

const FileUpload = ({ onFileUpload }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const fileInputRef = useRef();

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    handleFiles(files);
  };

  const handleFiles = async (files) => {
    setUploading(true);
    for (const file of files) {
      await uploadFile(file);
    }
    setUploading(false);
    setUploadProgress({});
  };

  const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/files/upload",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          onUploadProgress: (progressEvent) => {
            const progress = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress((prev) => ({
              ...prev,
              [file.name]: progress,
            }));
          },
        }
      );
      onFileUpload(response.data);
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  return (
    <div className="file-upload-container">
      <div
        className={`drop-zone ${isDragging ? "is-dragging" : ""}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <div className="drop-zone-content">
          <svg
            className="drop-zone-icon"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>

          <div>
            <p className="drop-zone-text-main">
              Drop files here or click to upload
            </p>
            <p className="drop-zone-text-sub">
              Support for multiple files up to 100MB each
            </p>
          </div>

          <button type="button" className="upload-button" disabled={uploading}>
            {uploading ? "Uploading..." : "Select Files"}
          </button>

          <input
            ref={fileInputRef}
            type="file"
            multiple
            className="hidden-input"
            onChange={handleFileSelect}
            disabled={uploading}
          />
        </div>
      </div>

      {/* Upload Progress */}
      {Object.keys(uploadProgress).length > 0 && (
        <div className="upload-progress-container">
          {Object.entries(uploadProgress).map(([fileName, progress]) => (
            <div key={fileName} className="progress-item">
              <div className="progress-item-header">
                <span className="progress-file-name" title={fileName}>
                  {fileName}
                </span>
                <span className="progress-percentage">{progress}%</span>
              </div>
              <div className="progress-bar-bg">
                <div
                  className="progress-bar-fg"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileUpload;
