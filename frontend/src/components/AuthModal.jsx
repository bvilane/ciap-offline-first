import React, { useState } from 'react';
import './AuthModal.css';

export default function AuthModal({ initialTab = 'login', onClose, onNavigate }) {
  const [activeTab, setActiveTab] = useState(initialTab);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Navigate to actual login/register pages
    onNavigate?.(activeTab === 'login' ? 'login' : 'register');
    onClose();
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

        <form className="auth-form" onSubmit={handleSubmit}>
          {activeTab === 'signup' && (
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                placeholder="Enter your name"
                required
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              required
            />
          </div>

          {activeTab === 'signup' && (
            <div className="form-group">
              <label htmlFor="confirm-password">Confirm Password</label>
              <input
                type="password"
                id="confirm-password"
                placeholder="Re-enter your password"
                required
              />
            </div>
          )}

          <button type="submit" className="auth-submit">
            {activeTab === 'login' ? 'Log In' : 'Sign Up'}
          </button>

          {activeTab === 'login' && (
            <button type="button" className="auth-forgot">
              Forgot password?
            </button>
          )}
        </form>
      </div>
    </>
  );
}