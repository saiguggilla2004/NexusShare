"use client";

import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import FileUpload from "./FileUpload";
import FileList from "./FileList";
import SearchBar from "./SearchBar";
import ViewToggle from "./ViewToggle";
import ShareModal from "../Share/ShareModal";
import PublicLinkModal from "../Share/PublicLinkModal";
import FilePreview from "./FilePreview";
import "./Dashboard.css";

const Dashboard = ({ socket }) => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("list");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [selectedFile, setSelectedFile] = useState(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showPublicLinkModal, setShowPublicLinkModal] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [currentFolder, setCurrentFolder] = useState(null);

  const fetchFiles = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:5000/api/files", {
        params: {
          search: searchTerm,
          sortBy,
          sortOrder,
          folderId: currentFolder,
        },
      });
      setFiles(response.data);
    } catch (error) {
      console.error("Error fetching files:", error);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, sortBy, sortOrder, currentFolder]);

  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

  const handleFileUpload = (newFile) => {
    setFiles((prev) => [newFile, ...prev]);
  };

  const handleFileDelete = async (fileId) => {
    try {
      await axios.delete(`http://localhost:5000/api/files/${fileId}`);
      setFiles((prev) => prev.filter((file) => file._id !== fileId));
    } catch (error) {
      console.error("Error deleting file:", error);
    }
  };

  const handleShare = (file) => {
    setSelectedFile(file);
    setShowShareModal(true);
  };

  const handlePublicLink = (file) => {
    setSelectedFile(file);
    setShowPublicLinkModal(true);
  };

  const handlePreview = (file) => {
    setSelectedFile(file);
    setShowPreview(true);
    socket.emit("viewing-file", {
      fileId: file._id,
      userId: "current-user-id",
      userName: "Current User Name",
    });
  };

  const handleDownload = async (file) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/files/download/${file._id}`,
        { responseType: "blob" }
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
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1 className="dashboard-title">My Files</h1>

        <div className="dashboard-controls">
          <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
          <ViewToggle viewMode={viewMode} onViewModeChange={setViewMode} />
        </div>

        <FileUpload onFileUpload={handleFileUpload} />
      </div>

      {loading ? (
        <div className="loading-spinner-container">
          <div className="loading-spinner"></div>
        </div>
      ) : (
        <FileList
          files={files}
          viewMode={viewMode}
          onDelete={handleFileDelete}
          onShare={handleShare}
          onPublicLink={handlePublicLink}
          onPreview={handlePreview}
          onDownload={handleDownload}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSort={(field) => {
            if (sortBy === field) {
              setSortOrder(sortOrder === "asc" ? "desc" : "asc");
            } else {
              setSortBy(field);
              setSortOrder("asc");
            }
          }}
        />
      )}

      {showShareModal && (
        <ShareModal
          file={selectedFile}
          onClose={() => setShowShareModal(false)}
          socket={socket}
        />
      )}

      {showPublicLinkModal && (
        <PublicLinkModal
          file={selectedFile}
          onClose={() => setShowPublicLinkModal(false)}
        />
      )}

      {showPreview && (
        <FilePreview
          file={selectedFile}
          onClose={() => setShowPreview(false)}
        />
      )}
    </div>
  );
};

export default Dashboard;
