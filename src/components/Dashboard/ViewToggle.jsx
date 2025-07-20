"use client";
import "./ViewToggle.css"; // Import the CSS file

const ViewToggle = ({ viewMode, onViewModeChange }) => {
  return (
    <div className="view-toggle-container">
      <button
        onClick={() => onViewModeChange("list")}
        className={`toggle-button toggle-button-left ${
          viewMode === "list" ? "is-active" : ""
        }`}
        aria-pressed={viewMode === "list"}
        title="List view"
      >
        <svg
          className="toggle-icon"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 10h16M4 14h16M4 18h16"
          />
        </svg>
      </button>
      <button
        onClick={() => onViewModeChange("grid")}
        className={`toggle-button toggle-button-right ${
          viewMode === "grid" ? "is-active" : ""
        }`}
        aria-pressed={viewMode === "grid"}
        title="Grid view"
      >
        <svg
          className="toggle-icon"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
          />
        </svg>
      </button>
    </div>
  );
};

export default ViewToggle;
