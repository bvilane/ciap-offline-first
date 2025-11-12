import React, { useState } from 'react';
import './SubmitForm.css';
import { API_BASE } from '../config/appConfig';

export default function SubmitForm({ type, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    contact: '',
    community: import.meta.env.VITE_COMMUNITY || 'Acornhoek'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE}/submit/${type}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Submission failed');
      }

      onSuccess?.();
      onClose?.();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const typeLabels = {
    notices: 'Community Notice',
    jobs: 'Job Opportunity',
    skills: 'Skill Offering'
  };

  return (
    <div className="submit-form-overlay" onClick={onClose}>
      <div className="submit-form-modal" onClick={(e) => e.stopPropagation()}>
        <div className="submit-form-header">
          <h2>Submit {typeLabels[type]}</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="submit-form">
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="title">Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              maxLength={200}
              placeholder={`Enter ${typeLabels[type].toLowerCase()} title`}
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description *</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={6}
              maxLength={2000}
              placeholder="Provide detailed information..."
            />
            <small className="char-count">
              {formData.description.length}/2000 characters
            </small>
          </div>

          <div className="form-group">
            <label htmlFor="contact">Contact Information *</label>
            <input
              type="text"
              id="contact"
              name="contact"
              value={formData.contact}
              onChange={handleChange}
              required
              maxLength={100}
              placeholder="Phone, email, or other contact details"
            />
          </div>

          <div className="form-group">
            <label htmlFor="community">Community</label>
            <input
              type="text"
              id="community"
              name="community"
              value={formData.community}
              onChange={handleChange}
              required
              maxLength={100}
            />
          </div>

          <div className="form-notice">
            <p><strong>Note:</strong> Your submission will be reviewed by community moderators before being published.</p>
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Submitting...' : 'Submit for Review'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}