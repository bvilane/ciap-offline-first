import React, { useEffect, useState } from 'react';
import './AdminDashboard.css';
import axios from 'axios';
import { API_BASE } from '../config/appConfig.jsx';
import { useAuth } from '../context/AuthContext';

const CONTENT_TYPES = ['notices', 'jobs', 'skills'];

export default function AdminDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [pendingContent, setPendingContent] = useState({ notices: [], jobs: [], skills: [] });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Fetch dashboard stats
  const fetchStats = async () => {
    try {
      const { data } = await axios.get(`${API_BASE}/admin/stats`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setStats(data);
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    }
  };

  // Fetch all users
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${API_BASE}/admin/users`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setUsers(data);
    } catch (err) {
      console.error('Failed to fetch users:', err);
      setMessage('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  // Fetch pending content for all types
  const fetchPendingContent = async () => {
    setLoading(true);
    try {
      const results = await Promise.all(
        CONTENT_TYPES.map(type =>
          axios.get(`${API_BASE}/admin/pending/${type}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          }).then(res => ({ type, data: res.data }))
        )
      );
      
      const pending = {};
      results.forEach(({ type, data }) => {
        pending[type] = data;
      });
      setPendingContent(pending);
    } catch (err) {
      console.error('Failed to fetch pending content:', err);
      setMessage('Failed to load pending content');
    } finally {
      setLoading(false);
    }
  };

  // Change user role
  const changeUserRole = async (userId, newRole) => {
    try {
      await axios.put(`${API_BASE}/admin/users/${userId}/role`, 
        { role: newRole },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }}
      );
      setMessage(`User role updated to ${newRole}`);
      fetchUsers(); // Refresh
    } catch (err) {
      console.error('Failed to change role:', err);
      setMessage('Failed to update user role');
    }
  };

  // Toggle user status
  const toggleUserStatus = async (userId, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    try {
      await axios.put(`${API_BASE}/admin/users/${userId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }}
      );
      setMessage(`User ${newStatus === 'active' ? 'activated' : 'deactivated'}`);
      fetchUsers();
    } catch (err) {
      console.error('Failed to toggle status:', err);
      setMessage('Failed to update user status');
    }
  };

  // Approve content
  const approveContent = async (type, id) => {
    try {
      await axios.post(`${API_BASE}/admin/approve/${type}/${id}`, {},
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }}
      );
      setMessage(`${type} approved successfully`);
      fetchPendingContent();
      fetchStats(); // Update counts
    } catch (err) {
      console.error('Failed to approve:', err);
      setMessage('Approval failed');
    }
  };

  // Reject content
  const rejectContent = async (type, id) => {
    try {
      await axios.post(`${API_BASE}/admin/reject/${type}/${id}`, {},
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }}
      );
      setMessage(`${type} rejected`);
      fetchPendingContent();
      fetchStats();
    } catch (err) {
      console.error('Failed to reject:', err);
      setMessage('Rejection failed');
    }
  };

  useEffect(() => {
    if (activeTab === 'overview') fetchStats();
    if (activeTab === 'users') fetchUsers();
    if (activeTab === 'moderation') fetchPendingContent();
  }, [activeTab]);

  return (
    <section className="admin-dashboard">
      <div className="card section">
        <h2 className="section-title">Admin Dashboard</h2>
        <p className="subtle">
          Logged in as: <strong>{user?.email}</strong> ({user?.role})
        </p>

        {/* Tabs */}
        <div className="admin-tabs">
          <button
            className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button
            className={`tab ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            User Management
          </button>
          <button
            className={`tab ${activeTab === 'moderation' ? 'active' : ''}`}
            onClick={() => setActiveTab('moderation')}
          >
            Content Moderation
          </button>
        </div>
      </div>

      {/* Message Display */}
      {message && (
        <div className="card section message-box">
          {message}
          <button onClick={() => setMessage('')} className="btn-close">×</button>
        </div>
      )}

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="card section">
          <h3>System Statistics</h3>
          {stats ? (
            <div className="stats-grid">
              <div className="stat-card">
                <h4>Total Users</h4>
                <p className="stat-number">{stats.totalUsers}</p>
              </div>
              <div className="stat-card">
                <h4>Active Users</h4>
                <p className="stat-number">{stats.activeUsers}</p>
              </div>
              <div className="stat-card">
                <h4>Pending Approvals</h4>
                <p className="stat-number">{stats.pendingCount}</p>
              </div>
              <div className="stat-card">
                <h4>Total Content</h4>
                <p className="stat-number">{stats.totalContent}</p>
              </div>
            </div>
          ) : (
            <p>Loading stats...</p>
          )}
        </div>
      )}

      {/* User Management Tab */}
      {activeTab === 'users' && (
        <div className="card section">
          <h3>User Management</h3>
          {loading ? (
            <p>Loading users...</p>
          ) : users.length === 0 ? (
            <p>No users found.</p>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Email</th>
                  <th>Name</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id}>
                    <td>{u.email}</td>
                    <td>{u.name || '-'}</td>
                    <td>
                      <select
                        value={u.role}
                        onChange={(e) => changeUserRole(u.id, e.target.value)}
                        disabled={u.email === user?.email} // Can't change own role
                      >
                        <option value="user">User</option>
                        <option value="moderator">Moderator</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td>
                      <span className={`status-badge ${u.status}`}>
                        {u.status}
                      </span>
                    </td>
                    <td>
                      <button
                        className="btn btn-small"
                        onClick={() => toggleUserStatus(u.id, u.status)}
                        disabled={u.email === user?.email}
                      >
                        {u.status === 'active' ? 'Deactivate' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Content Moderation Tab */}
      {activeTab === 'moderation' && (
        <div className="moderation-section">
          {CONTENT_TYPES.map(type => (
            <div key={type} className="card section">
              <h3>Pending {type.charAt(0).toUpperCase() + type.slice(1)}</h3>
              {loading ? (
                <p>Loading...</p>
              ) : pendingContent[type].length === 0 ? (
                <p className="subtle">No pending {type}</p>
              ) : (
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Description</th>
                      <th>Community</th>
                      <th>Contact</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingContent[type].map(item => (
                      <tr key={item.id}>
                        <td><strong>{item.title || item.name}</strong></td>
                        <td className="desc-cell">
                          {(item.description || '').substring(0, 100)}...
                        </td>
                        <td>{item.community}</td>
                        <td>{item.contact || item.phone || '-'}</td>
                        <td className="action-buttons">
                          <button
                            className="btn btn-approve"
                            onClick={() => approveContent(type, item.id)}
                          >
                            ✓ Approve
                          </button>
                          <button
                            className="btn btn-reject"
                            onClick={() => rejectContent(type, item.id)}
                          >
                            ✗ Reject
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}