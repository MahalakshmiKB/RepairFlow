import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Search,
  Wrench,
  CheckCircle2,
  Clock,
  AlertCircle,
  ShieldCheck,
  Smartphone,
  ArrowLeft,
} from 'lucide-react';
import api from '../services/api';
import StatusBadge from '../components/StatusBadge';
import LoadingSpinner from '../components/LoadingSpinner';
import { formatINR } from '../utils/currency';

const WORKFLOW_STEPS = [
  { key: 'RECEIVED', label: 'Received', sub: "We've got your device" },
  { key: 'DIAGNOSING', label: 'Diagnosing', sub: 'Identifying the issue' },
  { key: 'IN_REPAIR', label: 'In Repair', sub: 'Our experts are working' },
  { key: 'COMPLETED', label: 'Ready for Pickup', sub: 'Your device is ready' },
];

export function CustomerTracking() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialId = searchParams.get('id') || '';

  const [trackingInput, setTrackingInput] = useState(initialId);
  const [trackingData, setTrackingData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (idToSearch) => {
    const query = (idToSearch || trackingInput).trim();
    if (!query) return;

    try {
      setLoading(true);
      setError(null);
      setSearchParams({ id: query });

      const data = await api.getTracking(query);
      setTrackingData(data);
    } catch (err) {
      setTrackingData(null);
      setError(
        err.message ||
          `No repair ticket found for tracking ID "${query}". Please verify the code on your receipt.`
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialId) {
      handleSearch(initialId);
    }
  }, [initialId]);

  const getStepStatus = (stepKey) => {
    if (!trackingData) return '';
    const current = trackingData.status;
    if (current === 'UNREPAIRABLE') return 'unrepairable';
    const order = ['RECEIVED', 'DIAGNOSING', 'IN_REPAIR', 'COMPLETED'];
    const currentIndex = order.indexOf(current);
    const stepIndex = order.indexOf(stepKey);
    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'active';
    return '';
  };

  const getProgressPercentage = () => {
    if (!trackingData) return 0;
    const current = trackingData.status;
    if (current === 'UNREPAIRABLE') return 100;
    if (current === 'RECEIVED') return 15;
    if (current === 'DIAGNOSING') return 42;
    if (current === 'IN_REPAIR') return 72;
    if (current === 'COMPLETED') return 100;
    return 0;
  };

  return (
    <div className="tracking-public-page">
      {/* Top Navigation */}
      <header className="tracking-nav">
        <Link to="/" className="sidebar-logo" style={{ textDecoration: 'none' }}>
          <div className="sidebar-logo-icon">
            <Wrench size={14} />
          </div>
          <span style={{ fontWeight: 800, fontSize: '1.05rem' }}>RepairFlow</span>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Link to="/" className="btn btn-ghost btn-sm">
            <ArrowLeft size={14} />
            <span>Home</span>
          </Link>
          <Link to="/staff/login" className="btn btn-secondary btn-sm">
            Staff Sign In
          </Link>
        </div>
      </header>

      <div className="tracking-container">
        {/* Search Card */}
        <div className="tracking-search-card">
          {/* Icon */}
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: '50%',
                background: 'var(--primary-light)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 12px',
                color: 'var(--primary)',
              }}
            >
              <Search size={22} />
            </div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '6px', letterSpacing: '-0.025em' }}>
              Track Your Repair
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: 1.5 }}>
              Enter your tracking ID to get real-time updates on your device repair.
            </p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch();
            }}
            style={{ display: 'flex', gap: '10px' }}
          >
            <div style={{ flex: 1 }}>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. RF-2026-0015"
                value={trackingInput}
                onChange={(e) => setTrackingInput(e.target.value.toUpperCase())}
                style={{
                  fontFamily: 'monospace',
                  fontWeight: 700,
                  fontSize: '1rem',
                  letterSpacing: '0.05em',
                  borderRadius: 'var(--radius-full)',
                }}
                required
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              style={{ padding: '0 24px' }}
            >
              <Search size={16} />
              <span>{loading ? 'Checking…' : 'Track Repair'}</span>
            </button>
          </form>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              marginTop: '14px',
              fontSize: '0.75rem',
              color: 'var(--text-light)',
            }}
          >
            <ShieldCheck size={13} color="var(--accent-green)" />
            <span>Secure public portal — your contact details are never shown.</span>
          </div>
        </div>

        {/* Loading */}
        {loading && <LoadingSpinner text="Looking up your repair in the database…" />}

        {/* Error */}
        {error && !loading && (
          <div className="alert alert-error">
            <AlertCircle size={18} />
            <div>{error}</div>
          </div>
        )}

        {/* Results Card */}
        {trackingData && !loading && (
          <div className="tracking-result-card">
            {/* Header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                borderBottom: '1px solid var(--border-color)',
                paddingBottom: 18,
                marginBottom: 22,
              }}
            >
              <div
                style={{
                  width: 48,
                  height: 56,
                  background: '#1e1e2e',
                  borderRadius: 10,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Smartphone size={24} color="rgba(255,255,255,0.8)" />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
                  <div
                    style={{
                      fontSize: '1.2rem',
                      fontWeight: 800,
                      fontFamily: 'monospace',
                      letterSpacing: '0.02em',
                    }}
                  >
                    {trackingData.trackingId}
                  </div>
                  <StatusBadge status={trackingData.status} />
                </div>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: 3 }}>
                  Device: <strong style={{ color: 'var(--text-main)' }}>{trackingData.deviceBrand} {trackingData.deviceModel}</strong>
                </div>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                  Reported Issue: {trackingData.reportedIssue}
                </div>
                {trackingData.estimatedCost && (
                  <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--primary)', marginTop: 3 }}>
                    Estimated Cost: {formatINR(trackingData.estimatedCost)}
                  </div>
                )}
              </div>
            </div>

            {/* Visual Stepper */}
            {trackingData.status === 'UNREPAIRABLE' ? (
              <div className="alert alert-error" style={{ margin: '0 0 22px' }}>
                <AlertCircle size={18} />
                <div>
                  <strong>Device marked as Unrepairable.</strong> Our technical team determined that repair is
                  not feasible. Please contact the shop to arrange pickup.
                </div>
              </div>
            ) : (
              <div className="progress-stepper">
                <div className="progress-track">
                  <div
                    className="progress-track-fill"
                    style={{ width: `${getProgressPercentage()}%` }}
                  />
                </div>
                {WORKFLOW_STEPS.map((step, idx) => {
                  const state = getStepStatus(step.key);
                  return (
                    <div key={step.key} className={`progress-step ${state}`}>
                      <div className="step-circle">
                        {state === 'completed' ? <CheckCircle2 size={18} /> : idx + 1}
                      </div>
                      <span className="step-label">{step.label}</span>
                      <span
                        style={{
                          fontSize: '0.62rem',
                          color: 'var(--text-light)',
                          textAlign: 'center',
                          maxWidth: 72,
                        }}
                      >
                        {step.sub}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Device Summary */}
            <div
              style={{
                background: 'var(--bg-subtle)',
                borderRadius: 'var(--radius-lg)',
                padding: '16px',
                border: '1px solid var(--border-color)',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                gap: 14,
                marginBottom: 22,
              }}
            >
              <div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 3 }}>Device</div>
                <div style={{ fontWeight: 700 }}>{trackingData.deviceBrand} {trackingData.deviceModel}</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{trackingData.deviceType}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 3 }}>Date Received</div>
                <div style={{ fontWeight: 600 }}>{trackingData.dateReceived}</div>
              </div>
              {trackingData.estimatedCost && (
                <div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 3 }}>Estimated Cost</div>
                  <div style={{ fontWeight: 700, color: 'var(--primary)', fontSize: '1.05rem' }}>
                    {formatINR(trackingData.estimatedCost)}
                  </div>
                </div>
              )}
            </div>

            {/* Status History Timeline */}
            <div>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Clock size={16} color="var(--primary)" />
                Progress Timeline
              </h3>
              {!trackingData.statusHistory || trackingData.statusHistory.length === 0 ? (
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                  No status updates have been logged yet.
                </p>
              ) : (
                <div className="timeline">
                  {trackingData.statusHistory.map((item, idx) => (
                    <div key={idx} className="timeline-item">
                      <div className="timeline-dot" />
                      <div className="timeline-content">
                        <div className="timeline-time">
                          {new Date(item.changedAt).toLocaleString('en-IN', {
                            day: '2-digit', month: 'short', year: 'numeric',
                            hour: '2-digit', minute: '2-digit',
                          })}
                        </div>
                        <div style={{ marginBottom: item.note ? '6px' : 0 }}>
                          <StatusBadge status={item.status} />
                        </div>
                        {item.note && (
                          <div style={{ fontSize: '0.875rem', color: 'var(--text-main)', marginTop: 4 }}>
                            {item.note}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CustomerTracking;
