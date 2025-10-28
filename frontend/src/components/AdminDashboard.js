/**
 * Admin Dashboard Component
 */

import React, { useState } from 'react';
import axios from 'axios';
import './AdminDashboard.css';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:3001/api/v1';

function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [token, setToken] = useState(null);

  // Upload state
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadDesc, setUploadDesc] = useState('');
  const [uploadStatus, setUploadStatus] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post(`${API_BASE}/auth/login`, {
        username,
        password,
      });

      if (response.data.success) {
        setToken(response.data.data.token);
        setIsAuthenticated(true);
        localStorage.setItem('ciap_token', response.data.data.token);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    setUploadStatus('');

    if (!uploadFile) {
      setUploadStatus('Please select a file');
      return;
    }

    const formData = new FormData();
    formData.append('file', uploadFile);
    formData.append('title', uploadTitle);
    formData.append('description', uploadDesc);

    try {
      await axios.post(`${API_BASE}/content`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      setUploadStatus('✅ Content uploaded successfully!');
      setUploadFile(null);
      setUploadTitle('');
      setUploadDesc('');
    } catch (err) {
      setUploadStatus('❌ Upload failed: ' + (err.response?.data?.error || 'Unknown error'));
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="admin-login">
        <div className="login-card">
          <h2>🔐 Admin Login</h2>
          <p className="login-hint">Demo credentials: admin / admin123</p>
          
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label>Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && <div className="error-message">{error}</div>}

            <button type="submit" className="btn-primary">
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h2>⚙️ Admin Dashboard</h2>
        <button
          onClick={() => {
            setIsAuthenticated(false);
            setToken(null);
            localStorage.removeItem('ciap_token');
          }}
          className="btn-secondary"
        >
          Logout
        </button>
      </div>

      <div className="dashboard-content">
        <div className="admin-section">
          <h3>📤 Upload Content</h3>
          <form onSubmit={handleUpload} className="upload-form">
            <div className="form-group">
              <label>Title *</label>
              <input
                type="text"
                value={uploadTitle}
                onChange={(e) => setUploadTitle(e.target.value)}
                placeholder="Enter content title"
                required
              />
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                value={uploadDesc}
                onChange={(e) => setUploadDesc(e.target.value)}
                placeholder="Enter description (optional)"
                rows="3"
              />
            </div>

            <div className="form-group">
              <label>File *</label>
              <input
                type="file"
                onChange={(e) => setUploadFile(e.target.files[0])}
                accept=".pdf,.jpg,.jpeg,.png,.html"
                required
              />
              <small>Supported: PDF, JPEG, PNG, HTML (max 10MB)</small>
            </div>

            {uploadStatus && (
              <div className={uploadStatus.startsWith('✅') ? 'success-message' : 'error-message'}>
                {uploadStatus}
              </div>
            )}

            <button type="submit" className="btn-primary">
              Upload Content
            </button>
          </form>
        </div>

        <div className="admin-info">
          <h3>ℹ️ Admin Features</h3>
          <ul>
            <li>✅ Upload new educational content</li>
            <li>✅ Content automatically cached for offline access</li>
            <li>✅ Supports PDFs, images, and HTML articles</li>
            <li>✅ View metrics in Performance Dashboard</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;