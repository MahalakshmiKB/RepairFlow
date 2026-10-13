import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  PlusCircle, 
  ChevronLeft, 
  ChevronRight, 
  X,
  Edit2,
  Trash2
} from 'lucide-react';
import api from '../services/api';
import StatusBadge from '../components/StatusBadge';
import LoadingSpinner from '../components/LoadingSpinner';
import Alert from '../components/Alert';
import Modal from '../components/Modal';
import { formatINR } from '../utils/currency';

const STATUS_OPTIONS = [
  { value: '', label: 'All Statuses' },
  { value: 'RECEIVED', label: 'Received' },
  { value: 'DIAGNOSING', label: 'Diagnosing' },
  { value: 'IN_REPAIR', label: 'In Repair' },
  { value: 'COMPLETED', label: 'Completed' },
  { value: 'UNREPAIRABLE', label: 'Unrepairable' }
];

export function AllRepairs() {
  const [repairs, setRepairs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [repairToDelete, setRepairToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Quick Status update modal state
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [repairToUpdate, setRepairToUpdate] = useState(null);
  const [newStatus, setNewStatus] = useState('RECEIVED');
  const [statusNote, setStatusNote] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const fetchRepairs = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getRepairs({
        search: searchTerm,
        status: statusFilter,
        page,
        size: 10,
        sortBy: 'createdAt',
        direction: 'desc'
      });
      setRepairs(data.content || []);
      setTotalPages(data.totalPages || 0);
      setTotalElements(data.totalElements || 0);
    } catch (err) {
      setError(err.message || 'Failed to fetch repairs.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRepairs();
  }, [searchTerm, statusFilter, page]);

  const handleClearFilters = () => {
    setSearchTerm('');
    setStatusFilter('');
    setPage(0);
  };

  const confirmDelete = async () => {
    if (!repairToDelete) return;
    try {
      setDeleting(true);
      await api.deleteRepair(repairToDelete.id);
      setDeleteModalOpen(false);
      setRepairToDelete(null);
      setSuccessMsg('Repair ticket successfully deleted.');
      fetchRepairs();
    } catch (err) {
      setError(err.message || 'Failed to delete repair ticket.');
    } finally {
      setDeleting(false);
    }
  };

  const handleOpenStatusModal = (repair) => {
    setRepairToUpdate(repair);
    setNewStatus(repair.status);
    setStatusNote('');
    setStatusModalOpen(true);
  };

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    if (!repairToUpdate) return;
    try {
      setUpdatingStatus(true);
      await api.updateStatus(repairToUpdate.id, {
        status: newStatus,
        note: statusNote
      });
      setStatusModalOpen(false);
      setRepairToUpdate(null);
      setSuccessMsg(`Status updated to ${newStatus} for ${repairToUpdate.trackingId}`);
      fetchRepairs();
    } catch (err) {
      setError(err.message || 'Failed to update status.');
    } finally {
      setUpdatingStatus(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h2 className="page-title">All Repairs</h2>
          <p className="page-subtitle">Search, filter, and manage all repair tickets.</p>
        </div>
        <Link to="/repairs/new" className="btn btn-primary">
          <PlusCircle size={16} />
          <span>New Repair</span>
        </Link>
      </div>

      <Alert type="error" message={error} onRetry={fetchRepairs} />
      <Alert type="success" message={successMsg} />

      {/* Toolbar / Search / Filter */}
      <div className="toolbar">
        <div className="search-box">
          <Search size={16} style={{ color: 'var(--text-muted)' }} />
          <input 
            type="text" 
            placeholder="Search tracking ID, customer, device..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(0);
            }}
          />
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm('')} 
              style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--text-muted)' }}
            >
              <X size={14} />
            </button>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <select 
            className="form-select"
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(0);
            }}
            style={{ minWidth: '160px' }}
          >
            {STATUS_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>

          {(searchTerm || statusFilter) && (
            <button onClick={handleClearFilters} className="btn btn-secondary btn-sm">
              <X size={14} />
              <span>Clear</span>
            </button>
          )}
        </div>
      </div>

      {/* Repairs Table */}
      <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
        {loading ? (
          <LoadingSpinner text="Loading repair records..." />
        ) : repairs.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '50px 20px', color: 'var(--text-muted)' }}>
            <p style={{ fontSize: '0.95rem', marginBottom: '12px' }}>No repair tickets matched your search criteria.</p>
            {(searchTerm || statusFilter) && (
              <button onClick={handleClearFilters} className="btn btn-secondary btn-sm">
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <div className="table-container" style={{ border: 'none' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Tracking ID</th>
                  <th>Customer</th>
                  <th>Device</th>
                  <th>Reported Issue</th>
                  <th>Status</th>
                  <th>Cost (Est / Final)</th>
                  <th>Date</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {repairs.map((repair) => (
                  <tr key={repair.id}>
                    <td>
                      <Link to={`/repairs/${repair.id}`} className="tracking-badge">
                        {repair.trackingId}
                      </Link>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{repair.customerName}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{repair.customerPhone || repair.customerEmail || '—'}</div>
                    </td>
                    <td>
                      <div>{repair.deviceType}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        {repair.deviceBrand} {repair.deviceModel}
                      </div>
                    </td>
                    <td style={{ maxWidth: '220px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {repair.reportedIssue}
                    </td>
                    <td>
                      <button 
                        onClick={() => handleOpenStatusModal(repair)}
                        style={{ border: 'none', background: 'transparent', cursor: 'pointer', padding: 0 }}
                        title="Click to change status"
                      >
                        <StatusBadge status={repair.status} />
                      </button>
                    </td>
                    <td style={{ fontSize: '0.85rem' }}>
                      <div>{formatINR(repair.estimatedCost)}</div>
                      {repair.finalCost && (
                        <div style={{ fontSize: '0.78rem', color: 'var(--status-completed-text)', fontWeight: 600 }}>
                          {formatINR(repair.finalCost)}
                        </div>
                      )}
                    </td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                      {repair.dateReceived}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '6px' }}>
                        <Link to={`/repairs/${repair.id}`} className="btn btn-secondary btn-sm" title="View Details">
                          Details
                        </Link>
                        <Link to={`/repairs/${repair.id}/edit`} className="btn btn-secondary btn-sm" title="Edit Ticket">
                          <Edit2 size={13} />
                        </Link>
                        <button 
                          onClick={() => {
                            setRepairToDelete(repair);
                            setDeleteModalOpen(true);
                          }}
                          className="btn btn-secondary btn-sm"
                          style={{ color: '#ef4444' }}
                          title="Delete Ticket"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Footer */}
        {totalPages > 1 && (
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between', 
            padding: '12px 20px', 
            borderTop: '1px solid var(--border-color)',
            background: '#fafafa',
            fontSize: '0.85rem'
          }}>
            <div style={{ color: 'var(--text-muted)' }}>
              Showing {repairs.length} of {totalElements} repairs
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button 
                onClick={() => setPage(p => Math.max(0, p - 1))}
                disabled={page === 0}
                className="btn btn-secondary btn-sm"
              >
                <ChevronLeft size={14} />
                <span>Previous</span>
              </button>
              <span style={{ fontWeight: 500, padding: '0 4px' }}>
                Page {page + 1} of {totalPages}
              </span>
              <button 
                onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                disabled={page >= totalPages - 1}
                className="btn btn-secondary btn-sm"
              >
                <span>Next</span>
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <Modal 
        isOpen={deleteModalOpen} 
        title="Confirm Deletion"
        onClose={() => setDeleteModalOpen(false)}
      >
        <p style={{ color: 'var(--text-muted)', marginBottom: '16px', fontSize: '0.9rem' }}>
          Are you sure you want to permanently delete repair ticket <strong>{repairToDelete?.trackingId}</strong> for <strong>{repairToDelete?.customerName}</strong>? This action cannot be undone.
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
            onClick={confirmDelete} 
            className="btn btn-danger"
            disabled={deleting}
          >
            {deleting ? 'Deleting...' : 'Delete Repair Ticket'}
          </button>
        </div>
      </Modal>

      {/* Quick Status Update Modal */}
      <Modal
        isOpen={statusModalOpen}
        title={`Update Status: ${repairToUpdate?.trackingId}`}
        onClose={() => setStatusModalOpen(false)}
      >
        <form onSubmit={handleUpdateStatus}>
          <div className="form-group" style={{ marginBottom: '16px' }}>
            <label className="form-label">New Repair Status <span className="required">*</span></label>
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
            <label className="form-label">Transition Note (Optional)</label>
            <textarea 
              className="form-textarea"
              placeholder="e.g. Parts replaced, tested successfully."
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
    </div>
  );
}

export default AllRepairs;
