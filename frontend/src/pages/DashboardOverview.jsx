import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Inbox,
  Search,
  Wrench,
  CheckCircle2,
  XCircle,
  Layers,
  ArrowRight,
  PlusCircle,
  TrendingUp,
} from 'lucide-react';
import api from '../services/api';
import StatusBadge from '../components/StatusBadge';
import LoadingSpinner from '../components/LoadingSpinner';
import Alert from '../components/Alert';

export function DashboardOverview() {
  const [stats, setStats] = useState(null);
  const [recentRepairs, setRecentRepairs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [statsData, repairsData] = await Promise.all([
        api.getDashboardStats(),
        api.getRepairs({ page: 0, size: 5, sortBy: 'createdAt', direction: 'desc' }),
      ]);

      setStats(statsData);
      setRecentRepairs(repairsData.content || []);
    } catch (err) {
      setError(err.message || 'Failed to load dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return <LoadingSpinner text="Fetching shop statistics and repair records..." />;
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h2 className="page-title">Dashboard</h2>
          <p className="page-subtitle">An overview of your repair operations</p>
        </div>
        <Link to="/repairs/new" className="btn btn-primary">
          <PlusCircle size={16} />
          <span>New Repair Ticket</span>
        </Link>
      </div>

      <Alert type="error" message={error} onRetry={fetchData} />

      {/* Stats Grid — matches reference: Total, Received, In Progress, Completed */}
      {stats && (
        <div className="stats-grid">
          <div className="stat-card stat-total">
            <div className="stat-label">
              <Layers size={13} /> Total Repairs
            </div>
            <div className="stat-value">{stats.totalTickets}</div>
            {stats.totalTickets > 0 && (
              <div className="stat-delta">
                <TrendingUp size={10} /> Active shop
              </div>
            )}
          </div>

          <div className="stat-card stat-received">
            <div className="stat-label">
              <Inbox size={13} /> Received
            </div>
            <div className="stat-value" style={{ color: '#d97706' }}>{stats.received}</div>
          </div>

          <div className="stat-card stat-in-progress">
            <div className="stat-label">
              <Wrench size={13} /> In Progress
            </div>
            <div className="stat-value" style={{ color: 'var(--primary)' }}>
              {(stats.diagnosing || 0) + (stats.inRepair || 0)}
            </div>
          </div>

          <div className="stat-card stat-completed">
            <div className="stat-label">
              <CheckCircle2 size={13} /> Completed
            </div>
            <div className="stat-value" style={{ color: 'var(--accent-green)' }}>
              {stats.completed}
            </div>
          </div>
        </div>
      )}

      {/* Recent Repairs Table */}
      <div className="card">
        <div className="card-header">
          <div>
            <h3 className="card-title">Recent Repairs</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 2 }}>
              Latest repair tickets
            </p>
          </div>
          <Link to="/repairs" className="btn btn-secondary btn-sm">
            <span>View All</span>
            <ArrowRight size={13} />
          </Link>
        </div>

        {recentRepairs.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
            <p style={{ marginBottom: '16px' }}>No repair tickets registered yet.</p>
            <Link to="/repairs/new" className="btn btn-primary btn-sm">
              <PlusCircle size={14} />
              <span>Create First Ticket</span>
            </Link>
          </div>
        ) : (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Tracking ID</th>
                  <th>Customer</th>
                  <th>Device</th>
                  <th>Issue</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {recentRepairs.map((repair) => (
                  <tr key={repair.id}>
                    <td>
                      <Link to={`/repairs/${repair.id}`} className="tracking-badge">
                        {repair.trackingId}
                      </Link>
                    </td>
                    <td style={{ fontWeight: 600 }}>{repair.customerName}</td>
                    <td style={{ color: 'var(--text-muted)' }}>
                      {repair.deviceBrand} {repair.deviceModel}
                    </td>
                    <td
                      style={{
                        maxWidth: '200px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        color: 'var(--text-muted)',
                      }}
                    >
                      {repair.reportedIssue}
                    </td>
                    <td>
                      <StatusBadge status={repair.status} />
                    </td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '0.82rem', whiteSpace: 'nowrap' }}>
                      {repair.dateReceived}
                    </td>
                    <td>
                      <Link to={`/repairs/${repair.id}`} className="btn btn-ghost btn-sm">
                        ···
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default DashboardOverview;
