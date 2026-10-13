import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Wrench, LogOut, Search, ArrowLeft, RefreshCw,
  Smartphone, Clock, CheckCircle2, AlertCircle,
  ChevronDown, ChevronUp, Calendar, DollarSign,
} from 'lucide-react';
import api from '../services/api';
import StatusBadge from '../components/StatusBadge';
import LoadingSpinner from '../components/LoadingSpinner';
import { formatINR } from '../utils/currency';

/* ── Status helpers ─────────────────────────────────────────────── */
const ACTIVE_STATUSES = new Set(['RECEIVED', 'DIAGNOSING', 'IN_REPAIR']);
const DONE_STATUSES   = new Set(['COMPLETED', 'UNREPAIRABLE']);

const WORKFLOW = ['RECEIVED', 'DIAGNOSING', 'IN_REPAIR', 'COMPLETED'];

function progressPercent(status) {
  if (status === 'UNREPAIRABLE') return 100;
  const idx = WORKFLOW.indexOf(status);
  if (idx < 0) return 0;
  return [15, 42, 72, 100][idx];
}

/* ── Status Timeline ────────────────────────────────────────────── */
function StatusTimeline({ history }) {
  if (!history || history.length === 0) {
    return <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: '8px 0' }}>No history yet.</p>;
  }
  return (
    <div style={{ marginTop: 8 }}>
      {history.map((h, i) => (
        <div key={h.id ?? i} style={{ display: 'flex', gap: 10, marginBottom: 10, alignItems: 'flex-start' }}>
          <div style={{
            width: 10, height: 10, borderRadius: '50%', marginTop: 4, flexShrink: 0,
            background: i === history.length - 1 ? 'var(--primary)' : 'var(--accent-green)',
          }} />
          <div>
            <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-main)' }}>
              {h.newStatus?.replace('_', ' ')}
            </div>
            {h.note && <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 1 }}>{h.note}</div>}
            <div style={{ fontSize: '0.72rem', color: 'var(--text-light)', marginTop: 2 }}>
              {h.changedAt ? new Date(h.changedAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }) : ''}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── Single Repair Card ─────────────────────────────────────────── */
function RepairCard({ repair }) {
  const [expanded, setExpanded] = useState(false);
  const [history, setHistory] = useState(null);
  const [histLoading, setHistLoading] = useState(false);
  const [histError, setHistError] = useState(null);

  const toggleExpand = async () => {
    if (!expanded && history === null) {
      setHistLoading(true);
      setHistError(null);
      try {
        const data = await api.getMyRepairHistory(repair.id);
        setHistory(data);
      } catch (e) {
        setHistError(e.message || 'Could not load history.');
      } finally {
        setHistLoading(false);
      }
    }
    setExpanded(v => !v);
  };

  const isActive = ACTIVE_STATUSES.has(repair.status);
  const pct = progressPercent(repair.status);
  const cost = repair.finalCost ?? repair.estimatedCost;

  return (
    <div className="repair-card" style={{
      background: 'var(--bg-card)',
      border: '1px solid var(--border-color)',
      borderRadius: 14,
      padding: '18px 20px',
      marginBottom: 14,
      transition: 'box-shadow 0.2s',
    }}>
      {/* Header row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10, background: 'rgba(91,92,247,0.12)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <Smartphone size={16} color="var(--primary)" />
          </div>
          <div>
            <div style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: '0.9rem', color: 'var(--primary)' }}>
              {repair.trackingId}
            </div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-main)', fontWeight: 600 }}>
              {[repair.deviceBrand, repair.deviceModel, repair.deviceType].filter(Boolean).join(' · ')}
            </div>
          </div>
        </div>
        <StatusBadge status={repair.status} />
      </div>

      {/* Reported issue */}
      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '10px 0 6px', lineHeight: 1.5 }}>
        {repair.reportedIssue}
      </p>

      {/* Meta row */}
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: isActive ? 12 : 6 }}>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
          <Calendar size={12} />
          {repair.dateReceived ? new Date(repair.dateReceived).toLocaleDateString('en-IN', { dateStyle: 'medium' }) : '—'}
        </span>
        {cost != null && (
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
            <DollarSign size={12} />
            {formatINR(cost)}{repair.finalCost == null ? ' (est.)' : ''}
          </span>
        )}
      </div>

      {/* Progress bar for active repairs */}
      {isActive && (
        <div style={{ marginBottom: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Repair progress</span>
            <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--primary)' }}>{pct}%</span>
          </div>
          <div style={{ height: 5, background: 'var(--border-color)', borderRadius: 99 }}>
            <div style={{ height: '100%', width: `${pct}%`, background: 'linear-gradient(90deg, var(--primary), var(--accent-violet))', borderRadius: 99, transition: 'width 0.6s' }} />
          </div>
        </div>
      )}

      {/* Expand toggle */}
      <button
        onClick={toggleExpand}
        style={{
          display: 'flex', alignItems: 'center', gap: 4, background: 'none', border: 'none',
          cursor: 'pointer', color: 'var(--primary)', fontSize: '0.78rem', fontWeight: 600, padding: 0, marginTop: 2,
        }}
      >
        {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        {expanded ? 'Hide history' : 'Show history'}
      </button>

      {/* Status history */}
      {expanded && (
        <div style={{ marginTop: 10, paddingTop: 10, borderTop: '1px solid var(--border-color)' }}>
          {histLoading && <LoadingSpinner size="small" />}
          {histError && (
            <div style={{ fontSize: '0.78rem', color: 'var(--status-unrepairable-color)' }}>
              <AlertCircle size={13} style={{ verticalAlign: 'middle', marginRight: 4 }} />
              {histError}
            </div>
          )}
          {!histLoading && !histError && history !== null && <StatusTimeline history={history} />}
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   CustomerRepairDashboard
   ══════════════════════════════════════════════════════════════════ */
export function CustomerRepairDashboard() {
  const navigate = useNavigate();
  const customerName  = localStorage.getItem('customerName')  || 'Customer';
  const customerEmail = localStorage.getItem('customerEmail') || '';

  const [repairs, setRepairs]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);

  const fetchRepairs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getMyRepairs();
      setRepairs(Array.isArray(data) ? data : []);
    } catch (err) {
      if (err.status === 401 || err.status === 403) {
        // Token expired or invalid — log out
        handleSignOut();
      } else {
        setError(err.message || 'Failed to load your repairs.');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('customerToken');
    if (!token) {
      navigate('/customer/login', { replace: true });
      return;
    }
    fetchRepairs();
  }, [fetchRepairs, navigate]);

  const handleSignOut = () => {
    localStorage.removeItem('customerToken');
    localStorage.removeItem('customerName');
    localStorage.removeItem('customerEmail');
    localStorage.removeItem('customerId');
    navigate('/customer/login', { replace: true });
  };

  const activeRepairs    = repairs.filter(r => ACTIVE_STATUSES.has(r.status));
  const previousRepairs  = repairs.filter(r => DONE_STATUSES.has(r.status));

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-main)', fontFamily: 'var(--font-body)' }}>
      {/* Nav */}
      <header style={{
        background: 'var(--bg-card)', borderBottom: '1px solid var(--border-color)',
        padding: '0 24px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        position: 'sticky', top: 0, zIndex: 100,
      }}>
        <Link to="/" className="sidebar-logo" style={{ textDecoration: 'none' }}>
          <div className="sidebar-logo-icon"><Wrench size={14} /></div>
          <span style={{ fontWeight: 800, fontSize: '1rem' }}>RepairFlow</span>
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: '0.83rem', color: 'var(--text-muted)' }}>{customerName}</span>
          <button
            onClick={handleSignOut}
            className="btn btn-ghost btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: 6 }}
          >
            <LogOut size={14} />
            <span>Sign Out</span>
          </button>
        </div>
      </header>

      {/* Body */}
      <main style={{ maxWidth: 760, margin: '0 auto', padding: '32px 20px' }}>
        {/* Page title */}
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-main)', margin: 0, letterSpacing: '-0.03em' }}>
            My Repairs
          </h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: 4 }}>
            All repair tickets linked to <strong>{customerEmail}</strong>
          </p>
        </div>

        {/* Actions row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 10 }}>
          <Link to="/track" className="btn btn-secondary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Search size={14} />
            <span>Track by Repair ID</span>
          </Link>
          <button
            onClick={fetchRepairs}
            disabled={loading}
            className="btn btn-ghost btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: 6 }}
          >
            <RefreshCw size={14} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} />
            <span>Refresh</span>
          </button>
        </div>

        {/* Loading */}
        {loading && (
          <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 60 }}>
            <LoadingSpinner />
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="alert alert-error" style={{ marginBottom: 20 }}>
            <AlertCircle size={16} />
            <div>{error}</div>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && repairs.length === 0 && (
          <div style={{
            textAlign: 'center', padding: '60px 20px',
            background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 16,
          }}>
            <Smartphone size={40} color="var(--text-muted)" style={{ marginBottom: 12 }} />
            <h3 style={{ fontWeight: 700, fontSize: '1.1rem', margin: '0 0 6px', color: 'var(--text-main)' }}>
              No repairs found
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 16 }}>
              Your account has no repair tickets linked yet. If you have a receipt, track your repair by ID.
            </p>
            <Link to="/track" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <Search size={14} />
              <span>Track by Repair ID</span>
            </Link>
          </div>
        )}

        {/* Active repairs */}
        {!loading && !error && activeRepairs.length > 0 && (
          <section style={{ marginBottom: 28 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <Clock size={15} color="var(--primary)" />
              <h2 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-main)', margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Active Repairs
              </h2>
              <span style={{ background: 'var(--primary)', color: '#fff', borderRadius: 99, fontSize: '0.7rem', fontWeight: 700, padding: '1px 7px' }}>
                {activeRepairs.length}
              </span>
            </div>
            {activeRepairs.map(r => <RepairCard key={r.id} repair={r} />)}
          </section>
        )}

        {/* Previous repairs */}
        {!loading && !error && previousRepairs.length > 0 && (
          <section>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <CheckCircle2 size={15} color="var(--accent-green)" />
              <h2 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-main)', margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Previous Repairs
              </h2>
              <span style={{ background: 'var(--accent-green)', color: '#fff', borderRadius: 99, fontSize: '0.7rem', fontWeight: 700, padding: '1px 7px' }}>
                {previousRepairs.length}
              </span>
            </div>
            {previousRepairs.map(r => <RepairCard key={r.id} repair={r} />)}
          </section>
        )}
      </main>
    </div>
  );
}

export default CustomerRepairDashboard;
