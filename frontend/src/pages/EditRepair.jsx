import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import api from '../services/api';
import Alert from '../components/Alert';
import LoadingSpinner from '../components/LoadingSpinner';

export function EditRepair() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    deviceType: '',
    deviceBrand: '',
    deviceModel: '',
    reportedIssue: '',
    diagnosis: '',
    internalNotes: '',
    dateReceived: '',
    estimatedCost: '',
    finalCost: ''
  });

  const [trackingId, setTrackingId] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    const fetchRepair = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await api.getRepairById(id);
        setTrackingId(data.trackingId);
        setFormData({
          customerName: data.customerName || '',
          customerEmail: data.customerEmail || '',
          customerPhone: data.customerPhone || '',
          deviceType: data.deviceType || 'Smartphone',
          deviceBrand: data.deviceBrand || '',
          deviceModel: data.deviceModel || '',
          reportedIssue: data.reportedIssue || '',
          diagnosis: data.diagnosis || '',
          internalNotes: data.internalNotes || '',
          dateReceived: data.dateReceived || '',
          estimatedCost: data.estimatedCost !== null && data.estimatedCost !== undefined ? data.estimatedCost : '',
          finalCost: data.finalCost !== null && data.finalCost !== undefined ? data.finalCost : ''
        });
      } catch (err) {
        setError(err.message || 'Failed to load repair details.');
      } finally {
        setLoading(false);
      }
    };
    fetchRepair();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setError(null);

      const payload = {
        ...formData,
        customerName: formData.customerName.trim(),
        customerEmail: formData.customerEmail.trim() || null,
        customerPhone: formData.customerPhone.trim() || null,
        deviceType: formData.deviceType.trim(),
        deviceBrand: formData.deviceBrand.trim() || null,
        deviceModel: formData.deviceModel.trim(),
        reportedIssue: formData.reportedIssue.trim(),
        diagnosis: formData.diagnosis.trim() || null,
        internalNotes: formData.internalNotes.trim() || null,
        dateReceived: formData.dateReceived,
        estimatedCost: formData.estimatedCost !== '' ? parseFloat(formData.estimatedCost) : null,
        finalCost: formData.finalCost !== '' ? parseFloat(formData.finalCost) : null
      };

      await api.updateRepair(id, payload);
      navigate(`/repairs/${id}`);
    } catch (err) {
      if (err.fieldErrors) {
        setFieldErrors(err.fieldErrors);
      }
      setError(err.message || 'Failed to update repair ticket.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading ticket for editing..." />;
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div className="page-header">
        <div>
          <h2 className="page-title">Edit Repair: {trackingId}</h2>
          <p className="page-subtitle">Update device, customer, notes, or costs.</p>
        </div>
        <Link to={`/repairs/${id}`} className="btn btn-secondary btn-sm">
          <ArrowLeft size={14} />
          <span>Back to Details</span>
        </Link>
      </div>

      <Alert type="error" message={error} />

      <form onSubmit={handleSubmit} className="card">
        {/* Customer Details */}
        <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
          Customer Information
        </h3>
        <div className="form-grid" style={{ marginBottom: '24px' }}>
          <div className="form-group">
            <label className="form-label">Customer Name <span className="required">*</span></label>
            <input 
              type="text" 
              name="customerName"
              className="form-input"
              value={formData.customerName}
              onChange={handleChange}
              required
            />
            {fieldErrors.customerName && <div className="form-error">{fieldErrors.customerName}</div>}
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input 
              type="email" 
              name="customerEmail"
              className="form-input"
              value={formData.customerEmail}
              onChange={handleChange}
            />
          </div>

          <div className="form-group form-full">
            <label className="form-label">Phone Number</label>
            <input 
              type="tel" 
              name="customerPhone"
              className="form-input"
              value={formData.customerPhone}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Device Details */}
        <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
          Device Information
        </h3>
        <div className="form-grid" style={{ marginBottom: '24px' }}>
          <div className="form-group">
            <label className="form-label">Device Type <span className="required">*</span></label>
            <input 
              type="text" 
              name="deviceType"
              className="form-input"
              value={formData.deviceType}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Device Brand</label>
            <input 
              type="text" 
              name="deviceBrand"
              className="form-input"
              value={formData.deviceBrand}
              onChange={handleChange}
            />
          </div>

          <div className="form-group form-full">
            <label className="form-label">Device Model <span className="required">*</span></label>
            <input 
              type="text" 
              name="deviceModel"
              className="form-input"
              value={formData.deviceModel}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group form-full">
            <label className="form-label">Reported Issue <span className="required">*</span></label>
            <textarea 
              name="reportedIssue"
              className="form-textarea"
              value={formData.reportedIssue}
              onChange={handleChange}
              rows={3}
              required
            />
          </div>
        </div>

        {/* Technical & Cost Information */}
        <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
          Diagnosis, Notes & Costs
        </h3>
        <div className="form-grid" style={{ marginBottom: '28px' }}>
          <div className="form-group form-full">
            <label className="form-label">Technician Diagnosis</label>
            <textarea 
              name="diagnosis"
              className="form-textarea"
              placeholder="Detailed technical diagnosis"
              value={formData.diagnosis}
              onChange={handleChange}
              rows={2}
            />
          </div>

          <div className="form-group form-full">
            <label className="form-label">Internal Staff Notes (Staff Only)</label>
            <textarea 
              name="internalNotes"
              className="form-textarea"
              placeholder="Internal notes not visible to customers"
              value={formData.internalNotes}
              onChange={handleChange}
              rows={2}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Date Received <span className="required">*</span></label>
            <input 
              type="date" 
              name="dateReceived"
              className="form-input"
              value={formData.dateReceived}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Estimated Cost (₹)</label>
            <input 
              type="number" 
              step="0.01"
              min="0"
              name="estimatedCost"
              className="form-input"
              value={formData.estimatedCost}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Final Cost (₹)</label>
            <input 
              type="number" 
              step="0.01"
              min="0"
              name="finalCost"
              className="form-input"
              placeholder="Final amount charged"
              value={formData.finalCost}
              onChange={handleChange}
            />
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
          <Link to={`/repairs/${id}`} className="btn btn-secondary">
            Cancel
          </Link>
          <button type="submit" className="btn btn-primary" disabled={saving}>
            <Save size={16} />
            <span>{saving ? 'Saving Changes...' : 'Save Changes'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditRepair;
