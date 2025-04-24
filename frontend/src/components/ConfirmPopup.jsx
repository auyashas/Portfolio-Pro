import React, { useState } from 'react';
import '../styles/Popup.css';
import { X } from 'lucide-react';

const ConfirmPopup = ({ message, onConfirm, onCancel }) => {
  const [isClosing, setIsClosing] = useState(false);

  const handleConfirm = () => {
    setIsClosing(true);
    setTimeout(() => {
      onConfirm(); // Confirm action (e.g., delete item)
    }, 300); // Match the fade-out duration with the CSS animation time
  };

  const handleCancel = () => {
    setIsClosing(true);
    setTimeout(() => {
      onCancel(); // Close popup on cancel
    }, 300); // Match the fade-out duration with the CSS animation time
  };

  return (
    <div className={`popup-overlay ${isClosing ? 'fade-out' : ''}`}>
      <div className={`popup-box ${isClosing ? 'fade-out' : ''}`}>
        <button className="popup-close" onClick={handleCancel}>
          <X size={18} />
        </button>
        <p className="popup-message">{message}</p>
        <div className="popup-actions">
          <button className="popup-btn confirm" onClick={handleConfirm}>OK</button>
          <button className="popup-btn cancel" onClick={handleCancel}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmPopup;
