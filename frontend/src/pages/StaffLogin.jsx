import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, Eye, EyeOff, ArrowLeft, ShieldCheck, ArrowRight, Wrench } from 'lucide-react';

export function StaffLogin() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('staff@repairflow.local');
  const [password, setPassword] = useState('••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate('/dashboard');
    }, 400);
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        {/* Back link */}
        <Link to="/" className="auth-back-link">
          <ArrowLeft size={14} />
          <span>Back to Home</span>
        </Link>

        {/* Logo */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
          <Link to="/" className="sidebar-logo" style={{ textDecoration: 'none' }}>
            <div className="sidebar-logo-icon"><Wrench size={14} /></div>
            <span style={{ fontSize: '1rem', fontWeight: 800 }}>RepairFlow</span>
          </Link>
        </div>

        <div className="auth-header">
          <div className="auth-icon" style={{ background: 'rgba(91,92,247,0.1)' }}>
            <Lock size={22} color="var(--primary)" />
          </div>
          <h2 className="auth-title">Staff Portal</h2>
          <p className="auth-subtitle">
            Authorized technician &amp; shop staff access for repair ticket management.
          </p>
        </div>

        <div className="alert alert-info" style={{ fontSize: '0.82rem', marginBottom: '20px' }}>
          <div>
            <strong>Demo Mode:</strong> Authentication is in demo mode for this college project build.
            Click Sign In to access the live management dashboard.
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ marginBottom: '14px' }}>
            <label className="form-label">Staff Username or Email</label>
            <input
              type="text"
              className="form-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="admin@repairflow.local"
              required
            />
          </div>

          <div className="form-group" style={{ marginBottom: '22px' }}>
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                className="form-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter staff password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--text-muted)',
                  padding: 0,
                }}
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginBottom: '14px', justifyContent: 'center' }}
            disabled={loading}
          >
            <span>{loading ? 'Entering Dashboard…' : 'Sign In to Dashboard'}</span>
            <ArrowRight size={15} />
          </button>
        </form>

        <div
          style={{
            marginTop: '16px',
            paddingTop: '16px',
            borderTop: '1px solid var(--border-color)',
            textAlign: 'center',
          }}
        >
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: 8 }}>
            Need customer device tracking instead?
          </p>
          <Link
            to="/track"
            className="btn btn-secondary btn-sm"
            style={{ width: '100%', justifyContent: 'center' }}
          >
            Go to Customer Tracking
          </Link>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            marginTop: '18px',
            fontSize: '0.75rem',
            color: 'var(--text-light)',
          }}
        >
          <ShieldCheck size={13} color="var(--primary)" />
          <span>Internal shop staff tools &amp; database administration</span>
        </div>
      </div>
    </div>
  );
}

export default StaffLogin;
