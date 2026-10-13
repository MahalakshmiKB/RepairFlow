import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Eye, EyeOff, ArrowLeft, Search, ShieldCheck, AlertCircle, Wrench } from 'lucide-react';
import api from '../services/api';

export function CustomerLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) { setError('Please enter your email address.'); return; }
    if (!password)     { setError('Please enter your password.'); return; }

    setLoading(true);
    setError('');
    try {
      const data = await api.customerLogin({ email: email.trim(), password });
      localStorage.setItem('customerToken', data.token);
      localStorage.setItem('customerName', data.customerName);
      localStorage.setItem('customerEmail', data.customerEmail);
      localStorage.setItem('customerId', String(data.customerId));
      navigate('/customer/repairs');
    } catch (err) {
      setError(err.message || 'Sign in failed. Please check your email and password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <Link to="/" className="auth-back-link">
          <ArrowLeft size={14} />
          <span>Back to Home</span>
        </Link>

        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
          <Link to="/" className="sidebar-logo" style={{ textDecoration: 'none' }}>
            <div className="sidebar-logo-icon"><Wrench size={14} /></div>
            <span style={{ fontSize: '1rem', fontWeight: 800 }}>RepairFlow</span>
          </Link>
        </div>

        <div className="auth-header">
          <div className="auth-icon"><User size={22} /></div>
          <h2 className="auth-title">Customer Sign In</h2>
          <p className="auth-subtitle">Access your repair history and device service tickets.</p>
        </div>

        {error && (
          <div className="alert alert-error" style={{ fontSize: '0.82rem', marginBottom: '18px' }}>
            <AlertCircle size={16} />
            <div>{error}</div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ marginBottom: '14px' }}>
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="form-input"
              placeholder="yourname@example.com"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(''); }}
              required
            />
          </div>

          <div className="form-group" style={{ marginBottom: '20px' }}>
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                className="form-input"
                placeholder="Enter password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(''); }}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute', right: '12px', top: '50%',
                  transform: 'translateY(-50%)', background: 'none',
                  border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 0,
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
            style={{ width: '100%', marginBottom: '16px', justifyContent: 'center' }}
            disabled={loading}
          >
            <span>{loading ? 'Signing in…' : 'Sign In'}</span>
          </button>
        </form>

        <div style={{ marginTop: '18px', paddingTop: '16px', borderTop: '1px solid var(--border-color)', textAlign: 'center' }}>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '10px' }}>
            Have a repair receipt? Track without signing in.
          </p>
          <Link to="/track" className="btn btn-secondary btn-sm" style={{ width: '100%', justifyContent: 'center' }}>
            <Search size={14} />
            <span>Track Your Repair</span>
          </Link>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginTop: '18px', fontSize: '0.75rem', color: 'var(--text-light)' }}>
          <ShieldCheck size={13} color="var(--accent-green)" />
          <span>Customer data protected with strict privacy controls</span>
        </div>
      </div>
    </div>
  );
}

export default CustomerLogin;
