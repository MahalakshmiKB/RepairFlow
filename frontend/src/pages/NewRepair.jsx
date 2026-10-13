import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, ArrowLeft, CheckCircle2, Copy } from 'lucide-react';
import api from '../services/api';
import Alert from '../components/Alert';

export function NewRepair() {
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    deviceType: 'Smartphone',
    deviceBrand: '',
    deviceModel: '',
    reportedIssue: '',
    diagnosis: '',
    dateReceived: new Date().toISOString().split('T')[0],
    estimatedCost: ''
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [createdRepair, setCreatedRepair] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const errors = {};
    if (!formData.customerName.trim()) {
      errors.customerName = 'Customer name is required';
    }
    if (formData.customerEmail && !/\S+@\S+\.\S+/.test(formData.customerEmail)) {
      errors.customerEmail = 'Please enter a valid email address';
    }
    if (!formData.deviceType.trim()) {
      errors.deviceType = 'Device type is required';
    }
    if (!formData.deviceModel.trim()) {
      errors.deviceModel = 'Device model is required';
    }
    if (!formData.reportedIssue.trim()) {
      errors.reportedIssue = 'Reported issue is required';
    }
    if (!formData.dateReceived) {
      errors.dateReceived = 'Date received is required';
    }
    if (formData.estimatedCost && parseFloat(formData.estimatedCost) < 0) {
      errors.estimatedCost = 'Estimated cost cannot be negative';
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setSubmitting(true);
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
        dateReceived: formData.dateReceived,
        estimatedCost: formData.estimatedCost ? parseFloat(formData.estimatedCost) : null
      };

      const result = await api.createRepair(payload);
      setCreatedRepair(result);
    } catch (err) {
      if (err.fieldErrors) {
        setFieldErrors(err.fieldErrors);
      }
      setError(err.message || 'Failed to create repair ticket.');
    } finally {
      setSubmitting(false);
    }
  };

  const copyTrackingId = () => {
    if (!createdRepair) return;
    navigator.clipboard.writeText(createdRepair.trackingId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (createdRepair) {
    return (
      <div style={{ maxWidth: '600px', margin: '40px auto' }}>
        <div className="card" style={{ textAlign: 'center', padding: '36px 28px' }}>
          <div style={{ 
            width: '56px', 
            height: '56px', 
            borderRadius: '50%', 
            background: '#ecfdf5', 
            color: '#059669', 
            display: 'inline-flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            marginBottom: '16px'
          }}>
            <CheckCircle2 size={32} />
          </div>

          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '6px' }}>
            Repair Ticket Registered!
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '24px' }}>
            The device has been successfully checked in. Provide the tracking ID below to the customer.
          </p>

          <div style={{ 
            background: '#f8fafc', 
            border: '1px dashed #cbd5e1', 
            borderRadius: 'var(--radius-md)', 
            padding: '16px',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px'
          }}>
            <span style={{ fontSize: '1.35rem', fontWeight: 800, fontFamily: 'monospace', letterSpacing: '0.05em' }}>
              {createdRepair.trackingId}
            </span>
            <button 
              onClick={copyTrackingId}
              className="btn btn-secondary btn-sm"
              title="Copy Tracking ID"
            >
              <Copy size={14} />
              <span>{copied ? 'Copied!' : 'Copy'}</span>
            </button>
          </div>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <Link to={`/repairs/${createdRepair.id}`} className="btn btn-primary">
              View Ticket Details
            </Link>
            <button 
              onClick={() => {
                setCreatedRepair(null);
                setFormData({
                  customerName: '',
                  customerEmail: '',
                  customerPhone: '',
                  deviceType: 'Smartphone',
                  deviceBrand: '',
                  deviceModel: '',
                  reportedIssue: '',
                  diagnosis: '',
                  dateReceived: new Date().toISOString().split('T')[0],
                  estimatedCost: ''
                });
              }}
              className="btn btn-secondary"
            >
              Register Another Device
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div className="page-header">
        <div>
          <h2 className="page-title">Register New Repair</h2>
          <p className="page-subtitle">Check in a customer device and generate an official tracking ID.</p>
        </div>
        <Link to="/repairs" className="btn btn-secondary btn-sm">
          <ArrowLeft size={14} />
          <span>Back to All Repairs</span>
        </Link>
      </div>

      <Alert type="error" message={error} />

      <form onSubmit={handleSubmit} className="card">
        {/* Customer Information Section */}
        <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
          1. Customer Details
        </h3>
        <div className="form-grid" style={{ marginBottom: '24px' }}>
          <div className="form-group">
            <label className="form-label">
              Full Name <span className="required">*</span>
            </label>
            <input 
              type="text" 
              name="customerName"
              className="form-input"
              placeholder="e.g. David Miller"
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
              placeholder="e.g. david@example.com"
              value={formData.customerEmail}
              onChange={handleChange}
            />
            {fieldErrors.customerEmail && <div className="form-error">{fieldErrors.customerEmail}</div>}
          </div>

          <div className="form-group form-full">
            <label className="form-label">Phone Number</label>
            <input 
              type="tel" 
              name="customerPhone"
              className="form-input"
              placeholder="e.g. +1 555-0199"
              value={formData.customerPhone}
              onChange={handleChange}
            />
            {fieldErrors.customerPhone && <div className="form-error">{fieldErrors.customerPhone}</div>}
          </div>
        </div>

        {/* Device Information Section */}
        <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
          2. Device Details
        </h3>
        <div className="form-grid" style={{ marginBottom: '24px' }}>
          <div className="form-group">
            <label className="form-label">
              Device Type <span className="required">*</span>
            </label>
            <select 
              name="deviceType"
              className="form-select"
              value={formData.deviceType}
              onChange={handleChange}
              required
            >
              <option value="Smartphone">Smartphone</option>
              <option value="Laptop">Laptop</option>
              <option value="Tablet">Tablet</option>
              <option value="Desktop Computer">Desktop Computer</option>
              <option value="Game Console">Game Console</option>
              <option value="Audio Equipment">Audio Equipment</option>
              <option value="Other">Other</option>
            </select>
            {fieldErrors.deviceType && <div className="form-error">{fieldErrors.deviceType}</div>}
          </div>

          <div className="form-group">
            <label className="form-label">Device Brand</label>
            <input 
              type="text" 
              name="deviceBrand"
              className="form-input"
              placeholder="e.g. Apple, Samsung, Dell"
              value={formData.deviceBrand}
              onChange={handleChange}
            />
            {fieldErrors.deviceBrand && <div className="form-error">{fieldErrors.deviceBrand}</div>}
          </div>

          <div className="form-group form-full">
            <label className="form-label">
              Model Name / Number <span className="required">*</span>
            </label>
            <input 
              type="text" 
              name="deviceModel"
              className="form-input"
              placeholder="e.g. MacBook Pro 14 (M2), iPhone 14 Pro"
              value={formData.deviceModel}
              onChange={handleChange}
              required
            />
            {fieldErrors.deviceModel && <div className="form-error">{fieldErrors.deviceModel}</div>}
          </div>

          <div className="form-group form-full">
            <label className="form-label">
              Reported Issue <span className="required">*</span>
            </label>
            <textarea 
              name="reportedIssue"
              className="form-textarea"
              placeholder="Describe the issue reported by the customer (e.g. Broken screen, won't boot, water damage)"
              value={formData.reportedIssue}
              onChange={handleChange}
              rows={3}
              required
            />
            {fieldErrors.reportedIssue && <div className="form-error">{fieldErrors.reportedIssue}</div>}
          </div>
        </div>

        {/* Repair Details Section */}
        <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
          3. Repair & Intake Information
        </h3>
        <div className="form-grid" style={{ marginBottom: '28px' }}>
          <div className="form-group">
            <label className="form-label">
              Date Received <span className="required">*</span>
            </label>
            <input 
              type="date" 
              name="dateReceived"
              className="form-input"
              value={formData.dateReceived}
              onChange={handleChange}
              required
            />
            {fieldErrors.dateReceived && <div className="form-error">{fieldErrors.dateReceived}</div>}
          </div>

          <div className="form-group">
            <label className="form-label">Estimated Repair Cost (₹)</label>
            <input 
              type="number" 
              step="0.01"
              min="0"
              name="estimatedCost"
              className="form-input"
              placeholder="0.00"
              value={formData.estimatedCost}
              onChange={handleChange}
            />
            {fieldErrors.estimatedCost && <div className="form-error">{fieldErrors.estimatedCost}</div>}
          </div>

          <div className="form-group form-full">
            <label className="form-label">Initial Diagnosis Notes (Optional)</label>
            <textarea 
              name="diagnosis"
              className="form-textarea"
              placeholder="Initial inspection notes by technician"
              value={formData.diagnosis}
              onChange={handleChange}
              rows={2}
            />
            {fieldErrors.diagnosis && <div className="form-error">{fieldErrors.diagnosis}</div>}
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
          <Link to="/repairs" className="btn btn-secondary">
            Cancel
          </Link>
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            <PlusCircle size={16} />
            <span>{submitting ? 'Registering Repair...' : 'Create Repair Ticket'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}

export default NewRepair;
