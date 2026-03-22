import React, { useEffect } from 'react';

const Toast = ({ message, type = 'error', onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  if (!message) return null;

  return (
    <div className={`toast toast-${type}`}>
      <div className="toast-content">
        <span className="toast-icon">{type === 'success' ? '✅' : '❌'}</span>
        <span className="toast-message">{message}</span>
      </div>
      <button className="toast-close" onClick={onClose}>&times;</button>
    </div>
  );
};

export default Toast;
