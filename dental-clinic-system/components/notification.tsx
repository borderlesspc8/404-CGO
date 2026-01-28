import React, { useEffect } from "react";

interface NotificationProps {
  message: string;
  onClose: () => void;
}

const Notification: React.FC<NotificationProps> = ({ message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div style={{ position: "fixed", bottom: 20, right: 20, background: "#007bff", color: "#fff", padding: 12, borderRadius: 8, boxShadow: "0 2px 8px #0002" }}>
      {message}
    </div>
  );
};

export default Notification;
