import React from 'react';

const STATUS_LABELS = {
  RECEIVED: 'Received',
  DIAGNOSING: 'Diagnosing',
  IN_REPAIR: 'In Repair',
  COMPLETED: 'Completed',
  UNREPAIRABLE: 'Unrepairable'
};

export function StatusBadge({ status }) {
  const label = STATUS_LABELS[status] || status || 'Unknown';
  return (
    <span className={`status-badge ${status}`}>
      <span className="status-dot"></span>
      {label}
    </span>
  );
}

export default StatusBadge;
