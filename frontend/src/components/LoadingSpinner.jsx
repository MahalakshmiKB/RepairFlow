import React from 'react';
import { Loader2 } from 'lucide-react';

export function LoadingSpinner({ text = 'Loading…' }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '48px 20px',
        gap: '14px',
        color: 'var(--text-muted)',
      }}
    >
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: '50%',
          background: 'var(--primary-light)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Loader2
          size={22}
          color="var(--primary)"
          style={{ animation: 'spin 0.9s linear infinite' }}
        />
      </div>
      <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>{text}</span>
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default LoadingSpinner;
