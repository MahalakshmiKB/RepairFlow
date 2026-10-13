import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Edit2, 
  Trash2, 
  ExternalLink, 
  Copy, 
  Clock, 
  DollarSign, 
  User, 
  Smartphone, 
  FileText
} from 'lucide-react';
import api from '../services/api';
import StatusBadge from '../components/StatusBadge';
import LoadingSpinner from '../components/LoadingSpinner';
import Alert from '../components/Alert';
import Modal from '../components/Modal';
import { formatINR } from '../utils/currency';

export function RepairDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [repair, setRepair] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [copied, setCopied] = useState(false);

  // Status update state
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [statusNote, setStatusNote] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState(false);

  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const fetchDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getRepairById(id);
      setRepair(data);
      setNewStatus(data.status);
    } catch (err) {
      setError(err.message || 'Failed to fetch repair ticket details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [id]);

  const copyTrackingId = () => {
    if (!repair) return;
    navigator.clipboard.writeText(repair.trackingId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    try {
      setUpdatingStatus(true);
      setError(null);
      const updated = await api.updateStatus(id, {
        status: newStatus,
        note: statusNote
      });
      setRepair(updated);
      setStatusModalOpen(false);
      setStatusNote('');
      setSuccessMsg(`Status updated successfully to ${newStatus}.`);
    } catch (err) {
      setError(err.message || 'Failed to update status.');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleDelete = async () => {
    try {
      setDeleting(true);
      await api.deleteRepair(id);
      navigate('/repairs');
    } catch (err) {
      setError(err.message || 'Failed to delete repair.');
      setDeleteModalOpen(false);
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading repair ticket details..." />;
  }

  if (error && !repair) {
    return (
      <div style={{ maxWidth: '600px', margin: '40px auto' }}>
        <Alert type="error" message={error} onRetry={fetchDetails} />
        <Link to="/repairs" className="btn btn-secondary btn-sm" style={{ marginTop: '12px' }}>
          <ArrowLeft size={14} /> Back to Repairs List
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* Top Header */}
      <div className="page-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '6px' }}>
            <Link to="/repairs" className="btn btn-secondary btn-sm" style={{ padding: '4px 8px' }}>
              <ArrowLeft size={14} />
            </Link>
            <h2 className="page-title" style={{ margin: 0 }}>
              {repair.trackingId}
            </h2>
            <button 
              onClick={copyTrackingId}
              className="btn btn-secondary btn-sm"
              style={{ padding: '3px 8px', fontSize: '0.78rem' }}
            >
              <Copy size={13} />
              <span>{copied ? 'Copied' : 'Copy ID'}</span>
            </button>
            <StatusBadge status={repair.status} />
          </div>
          <p className="page-subtitle">
            Registered on {repair.dateReceived} • Created {new Date(repair.createdAt).toLocaleString()}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={() => setStatusModalOpen(true)} className="btn btn-primary btn-sm">
            Update Status
          </button>
          <Link to={`/repairs/${repair.id}/edit`} className="btn btn-secondary btn-sm">
            <Edit2 size={14} />
            <span>Edit</span>
          </Link>
          <Link 
            to={`/tracking?id=${repair.trackingId}`} 
            className="btn btn-secondary btn-sm" 
            target="_blank" 
            rel="noopener noreferrer"
          >
            <ExternalLink size={14} />
            <span>Customer View</span>
          </Link>
          <button 
            onClick={() => setDeleteModalOpen(true)} 
            className="btn btn-secondary btn-sm"
            style={{ color: '#ef4444' }}
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      <Alert type="error" message={error} />
      <Alert type="success" message={successMsg} />

      {/* Grid: Details on Left, Status History on Right */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        {/* Left Column: Customer, Device, Costs, Diagnosis */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Customer Card */}
          <div className="card" style={{ margin: 0 }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <User size={16} /> Customer Information
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', rowGap: '10px', fontSize: '0.88rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Name:</span>
              <span style={{ fontWeight: 600 }}>{repair.customerName}</span>

              <span style={{ color: 'var(--text-muted)' }}>Email:</span>
              <span>{repair.customerEmail || '—'}</span>

              <span style={{ color: 'var(--text-muted)' }}>Phone:</span>
              <span>{repair.customerPhone || '—'}</span>
            </div>
          </div>

          {/* Device Card */}
          <div className="card" style={{ margin: 0 }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Smartphone size={16} /> Device Information
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', rowGap: '10px', fontSize: '0.88rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Device Type:</span>
              <span>{repair.deviceType}</span>

              <span style={{ color: 'var(--text-muted)' }}>Brand:</span>
              <span>{repair.deviceBrand || '—'}</span>

              <span style={{ color: 'var(--text-muted)' }}>Model:</span>
              <span style={{ fontWeight: 600 }}>{repair.deviceModel}</span>

              <span style={{ color: 'var(--text-muted)' }}>Reported Issue:</span>
              <span style={{ lineHeight: 1.4 }}>{repair.reportedIssue}</span>
            </div>
          </div>

          {/* Costs & Financials */}
          <div className="card" style={{ margin: 0 }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <DollarSign size={16} /> Costs & Billing
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr', rowGap: '10px', fontSize: '0.88rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Estimated Cost:</span>
              <span>{repair.estimatedCost !== null && repair.estimatedCost !== undefined ? formatINR(repair.estimatedCost) : 'Not estimated'}</span>

              <span style={{ color: 'var(--text-muted)' }}>Final Cost:</span>
              <span style={{ fontWeight: 700, color: repair.finalCost ? 'var(--status-completed-text)' : 'inherit' }}>
                {repair.finalCost !== null && repair.finalCost !== undefined ? formatINR(repair.finalCost) : 'Pending completion'}
              </span>
            </div>
          </div>

          {/* Technical Diagnosis & Internal Notes */}
          <div className="card" style={{ margin: 0 }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FileText size={16} /> Technical Notes
            </h3>
            <div style={{ marginBottom: '14px' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Technician Diagnosis:
              </div>
              <div style={{ fontSize: '0.88rem', background: '#f8fafc', padding: '10px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                {repair.diagnosis || 'No diagnostic notes recorded yet.'}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Internal Staff Notes (Private):
              </div>
              <div style={{ fontSize: '0.88rem', background: '#fffbeb', color: '#92400e', padding: '10px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid #fde68a' }}>
                {repair.internalNotes || 'No internal notes recorded.'}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Status History Timeline */}
        <div>
          <div className="card" style={{ margin: 0 }}>
            <div className="card-header">
              <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Clock size={16} /> Status History
              </h3>
              <button onClick={() => setStatusModalOpen(true)} className="btn btn-secondary btn-sm">
                Change Status
              </button>
            </div>

            {(!repair.statusHistory || repair.statusHistory.length === 0) ? (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>No status history available.</p>
            ) : (
              <div className="timeline">
                {repair.statusHistory.map((item, idx) => (
                  <div key={item.id || idx} className="timeline-item">
                    <div className="timeline-dot"></div>
                    <div className="timeline-content">
                      <div className="timeline-time">
                        {new Date(item.changedAt).toLocaleString()}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                        {item.previousStatus && (
                          <>
                            <StatusBadge status={item.previousStatus} />
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>→</span>
                          </>
                        )}
                        <StatusBadge status={item.newStatus} />
                      </div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-main)', marginTop: '4px' }}>
                        {item.note}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Update Status Modal */}
      <Modal
        isOpen={statusModalOpen}
        title="Update Repair Status"
        onClose={() => setStatusModalOpen(false)}
      >
        <form onSubmit={handleUpdateStatus}>
          <div className="form-group" style={{ marginBottom: '16px' }}>
            <label className="form-label">New Status <span className="required">*</span></label>
            <select 
              className="form-select"
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              required
            >
              <option value="RECEIVED">RECEIVED (Device Checked In)</option>
              <option value="DIAGNOSING">DIAGNOSING (Under Investigation)</option>
              <option value="IN_REPAIR">IN_REPAIR (Actively Being Repaired)</option>
              <option value="COMPLETED">COMPLETED (Repair Done / Ready for Pickup)</option>
              <option value="UNREPAIRABLE">UNREPAIRABLE (Cannot be Fixed)</option>
            </select>
          </div>

          <div className="form-group" style={{ marginBottom: '16px' }}>
            <label className="form-label">Transition Note</label>
            <textarea 
              className="form-textarea"
              placeholder="e.g. Parts replaced, tested and functional."
              value={statusNote}
              onChange={(e) => setStatusNote(e.target.value)}
              rows={3}
            />
          </div>

          <div className="modal-footer">
            <button 
              type="button" 
              onClick={() => setStatusModalOpen(false)} 
              className="btn btn-secondary"
              disabled={updatingStatus}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={updatingStatus}
            >
              {updatingStatus ? 'Updating...' : 'Save Status Update'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        title="Delete Repair Ticket"
        onClose={() => setDeleteModalOpen(false)}
      >
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '18px' }}>
          Are you sure you want to delete repair ticket <strong>{repair.trackingId}</strong>? All status history associated with this ticket will be permanently removed.
        </p>
        <div className="modal-footer">
          <button 
            type="button" 
            onClick={() => setDeleteModalOpen(false)} 
            className="btn btn-secondary"
            disabled={deleting}
          >
            Cancel
          </button>
          <button 
            type="button" 
            onClick={handleDelete} 
            className="btn btn-danger"
            disabled={deleting}
          >
            {deleting ? 'Deleting...' : 'Confirm Delete'}
          </button>
        </div>
      </Modal>
    </div>
  );
}

export default RepairDetails;
