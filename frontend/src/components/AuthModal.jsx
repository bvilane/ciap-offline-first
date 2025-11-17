import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './AuthModal.css';

export default function AuthModal({ initialTab = 'login', onClose }) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const { login, register, error: authError } = useAuth();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      if (activeTab === 'login') {
        const result = await login(formData.email, formData.password);
        if (result.success) {
          onClose();
        } else {
          setError(result.error || 'Login failed');
        }
      } else {
        if (formData.password !== formData.confirmPassword) {
          setError('Passwords do not match');
          setIsSubmitting(false);
          return;
        }
        
        const result = await register(formData.email, formData.password, formData.name);
        if (result.success) {
          onClose();
        } else {
          setError(result.error || 'Registration failed');
        }
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="auth-overlay" onClick={onClose}></div>
      <div className="auth-modal">
        <button className="auth-close" onClick={onClose} aria-label="Close">
          ×
        </button>

        <div className="auth-tabs">
          <button
            className={`auth-tab ${activeTab === 'login' ? 'active' : ''}`}
            onClick={() => setActiveTab('login')}
          >
            Log In
          </button>
          <button
            className={`auth-tab ${activeTab === 'signup' ? 'active' : ''}`}
            onClick={() => setActiveTab('signup')}
          >
            Sign Up
          </button>
        </div>

        {(error || authError) && (
          <div className="auth-error" style={{ 
            background: '#fee2e2', 
            color: '#991b1b', 
            padding: '12px', 
            borderRadius: '6px', 
            marginBottom: '16px',
            fontSize: '14px'
          }}>
            {error || authError}
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit}>
          {activeTab === 'signup' && (
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name"
                required
                disabled={isSubmitting}
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
              disabled={isSubmitting}
            />
          </div>

          {activeTab === 'signup' && (
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Re-enter your password"
                required
                disabled={isSubmitting}
              />
            </div>
          )}

          <button type="submit" className="auth-submit" disabled={isSubmitting}>
            {isSubmitting 
              ? (activeTab === 'login' ? 'Logging in...' : 'Signing up...') 
              : (activeTab === 'login' ? 'Log In' : 'Sign Up')}
          </button>

          {activeTab === 'login' && (
            <div style={{ textAlign: 'center', marginTop: 16, fontSize: 12, color: '#64748b' }}>
              <p><strong>Demo:</strong> admin@ciap.local / Admin123!</p>
            </div>
          )}
        </form>
      </div>
    </>
  );
}