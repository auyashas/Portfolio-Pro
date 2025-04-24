import React, { useState } from 'react';
import '../styles/Popup.css';
import { X } from 'lucide-react';

const Popup = ({ message, onClose }) => {
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 300); // Match the fade-out duration with the CSS animation time
  };

  return (
    <div className={`popup-overlay ${isClosing ? 'fade-out' : ''}`}>
      <div className={`popup-box ${isClosing ? 'fade-out' : ''}`}>
        <button className="popup-close" onClick={handleClose}>
          <X size={18} />
        </button>
        <p className="popup-message">{message}</p>
      </div>
    </div>
  );
};

export default Popup;
