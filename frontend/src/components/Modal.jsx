import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export function Modal({ isOpen, title, children, onClose }) {
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content" 
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="modal-header">
          <h3 className="modal-title">{title}</h3>
          <button 
            type="button" 
            onClick={onClose} 
            className="btn btn-secondary btn-sm"
            style={{ padding: '4px', borderRadius: '50%' }}
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>
        <div>
          {children}
        </div>
      </div>
    </div>
  );
}

export default Modal;
