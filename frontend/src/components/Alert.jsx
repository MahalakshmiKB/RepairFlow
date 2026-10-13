import React from 'react';
import { AlertCircle, CheckCircle2, Info } from 'lucide-react';

export function Alert({ type = 'info', message, onRetry }) {
  if (!message) return null;

  const icons = {
    error: <AlertCircle size={18} />,
    success: <CheckCircle2 size={18} />,
    info: <Info size={18} />
  };

  return (
    <div className={`alert alert-${type}`}>
      {icons[type] || icons.info}
      <div style={{ flex: 1 }}>{message}</div>
      {onRetry && (
        <button 
          onClick={onRetry} 
          className="btn btn-secondary btn-sm"
          style={{ padding: '3px 8px', fontSize: '0.78rem' }}
        >
          Retry
        </button>
      )}
    </div>
  );
}

export default Alert;
