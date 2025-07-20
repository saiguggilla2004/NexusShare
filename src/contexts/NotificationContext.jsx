"use client";

import { createContext, useContext, useState, useEffect } from "react";

const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotifications must be used within a NotificationProvider"
    );
  }
  return context;
};

export const NotificationProvider = ({ children, socket }) => {
  const [notifications, setNotifications] = useState([]);
  const [activeToast, setActiveToast] = useState(null);

  useEffect(() => {
    socket.on("notification", (notification) => {
      setNotifications((prev) => [notification, ...prev]);
      setActiveToast(notification);

      // Auto-hide toast after 5 seconds
      setTimeout(() => {
        setActiveToast(null);
      }, 5000);
    });

    return () => {
      socket.off("notification");
    };
  }, [socket]);

  const markAsRead = (index) => {
    setNotifications((prev) =>
      prev.map((notif, i) => (i === index ? { ...notif, read: true } : notif))
    );
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const hideToast = () => {
    setActiveToast(null);
  };

  const value = {
    notifications,
    activeToast,
    markAsRead,
    clearNotifications,
    hideToast,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
