"use client";

import { useNotifications } from "../../contexts/NotificationContext";
import "./NotificationToast.css"; // Import the CSS file

const NotificationToast = () => {
  const { activeToast, hideToast } = useNotifications();

  // The key property on the outer div ensures the animation re-triggers
  // if a new toast appears while the old one is still fading out.
  if (!activeToast) return null;

  return (
    <div key={activeToast.id} className="toast-wrapper">
      <div className="toast-card">
        <div className="toast-content">
          <div className="toast-icon-container">
            {activeToast.type === "file-shared" && (
              <svg
                className="toast-icon"
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
            )}
          </div>
          <div className="toast-text-container">
            <p className="toast-title">New Notification</p>
            <p className="toast-message">{activeToast.message}</p>
          </div>
          <div className="toast-close-container">
            <button
              onClick={hideToast}
              className="toast-close-btn"
              aria-label="Dismiss"
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
        </div>
      </div>
    </div>
  );
};

export default NotificationToast;
