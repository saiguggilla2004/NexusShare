"use client";

import { useState } from "react";
import "./FileList.css"; // Import the CSS file

const FileList = ({
  files,
  viewMode,
  onDelete,
  onShare,
  onPublicLink,
  onPreview,
  onDownload,
  sortBy,
  sortOrder,
  onSort,
}) => {
  const [selectedFiles, setSelectedFiles] = useState([]);

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return (
      Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
    );
  };

  const getFileIcon = (mimetype) => {
    let iconClass = "file-icon ";
    if (mimetype.startsWith("image/")) {
      iconClass += "icon-image";
    } else if (mimetype === "application/pdf") {
      iconClass += "icon-pdf";
    } else {
      iconClass += "icon-default";
    }
    const path = mimetype.startsWith("image/")
      ? "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
      : "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z";

    return (
      <svg
        className={iconClass}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d={path}
        />
      </svg>
    );
  };

  const SortButton = ({ field, children }) => (
    <button onClick={() => onSort(field)} className="sort-button">
      <span>{children}</span>
      {sortBy === field && (
        <svg
          className={`sort-icon ${sortOrder === "asc" ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      )}
    </button>
  );

  if (files.length === 0) {
    return (
      <div className="no-files-container">
        <svg
          className="no-files-icon"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2z"
          />
        </svg>
        <h3 className="no-files-heading">No files</h3>
        <p className="no-files-text">
          Get started by uploading your first file.
        </p>
      </div>
    );
  }

  if (viewMode === "grid") {
    return (
      <div className="file-grid-container">
        {files.map((file) => (
          <div key={file._id} className="file-grid-item">
            <div className="file-grid-item-content">
              <div className="file-grid-item-header">
                {getFileIcon(file.mimetype)}
                <div className="file-grid-actions space-x-1">
                  <button
                    onClick={() => onPreview(file)}
                    className="file-grid-action-button"
                    title="Preview"
                  >
                    <svg
                      className="icon-sm"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={() => onShare(file)}
                    className="file-grid-action-button"
                    title="Share"
                  >
                    <svg
                      className="icon-sm"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={() => onPublicLink(file)}
                    className="file-grid-action-button"
                    title="Public Link"
                  >
                    <svg
                      className="icon-sm"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              <h3 className="file-grid-name truncate" title={file.originalName}>
                {file.originalName}
              </h3>

              <div className="file-grid-meta space-y-1">
                <p>{formatFileSize(file.size)}</p>
                <p>{new Date(file.createdAt).toLocaleDateString()}</p>
                {file.sharedWith.length > 0 && (
                  <p className="shared-text-success">
                    Shared with {file.sharedWith.length} user(s)
                  </p>
                )}
              </div>

              <div className="file-grid-buttons space-x-2">
                <button
                  onClick={() => onDownload(file)}
                  className="button button-download"
                >
                  Download
                </button>
                <button
                  onClick={() => onDelete(file._id)}
                  className="button button-delete"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="file-list-container">
      <div className="file-list-header">
        <div className="file-list-header-grid">
          <div className="col-span-5">
            <SortButton field="originalName">Name</SortButton>
          </div>
          <div className="col-span-2">
            <SortButton field="size">Size</SortButton>
          </div>
          <div className="col-span-2">
            <SortButton field="createdAt">Date</SortButton>
          </div>
          <div className="col-span-1">Shared</div>
          <div className="col-span-2">Actions</div>
        </div>
      </div>

      <ul className="file-list">
        {files.map((file) => (
          <li key={file._id} className="file-list-item">
            <div className="file-list-item-content">
              <div className="file-list-item-grid">
                <div className="col-span-5 file-info-cell">
                  <div className="file-icon-container">
                    {getFileIcon(file.mimetype)}
                  </div>
                  <div className="file-text-container">
                    <p className="file-name truncate" title={file.originalName}>
                      {file.originalName}
                    </p>
                    <p className="file-mimetype">{file.mimetype}</p>
                  </div>
                </div>

                <div className="col-span-2">
                  <p className="file-meta-text">{formatFileSize(file.size)}</p>
                </div>

                <div className="col-span-2">
                  <p className="file-meta-text">
                    {new Date(file.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <div className="col-span-1">
                  {file.sharedWith.length > 0 ? (
                    <span className="shared-badge">
                      {file.sharedWith.length}
                    </span>
                  ) : (
                    <span className="shared-placeholder">-</span>
                  )}
                </div>

                <div className="col-span-2 actions-cell space-x-2">
                  <button
                    onClick={() => onPreview(file)}
                    className="action-button"
                    title="Preview"
                  >
                    <svg
                      className="icon-sm"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={() => onDownload(file)}
                    className="action-button"
                    title="Download"
                  >
                    <svg
                      className="icon-sm"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={() => onShare(file)}
                    className="action-button"
                    title="Share"
                  >
                    <svg
                      className="icon-sm"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={() => onPublicLink(file)}
                    className="action-button"
                    title="Public Link"
                  >
                    <svg
                      className="icon-sm"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={() => onDelete(file._id)}
                    className="action-button action-button-delete"
                    title="Delete"
                  >
                    <svg
                      className="icon-sm"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FileList;
