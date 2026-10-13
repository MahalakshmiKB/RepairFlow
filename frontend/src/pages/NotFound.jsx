import React from 'react';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

export function NotFound() {
  return (
    <div style={{ textAlign: 'center', padding: '80px 20px', maxWidth: '500px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '8px' }}>404</h1>
      <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '8px' }}>Page Not Found</h2>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '24px' }}>
        The page you are looking for does not exist or has been moved.
      </p>
      <Link to="/" className="btn btn-primary">
        <Home size={16} />
        <span>Return to Dashboard</span>
      </Link>
    </div>
  );
}

export default NotFound;
