import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * ProtectedRoute - Wrapper component for routes that require authentication
 * 
 * Usage:
 * <Route path="/admin" element={
 *   <ProtectedRoute requireRole="admin">
 *     <AdminDashboard />
 *   </ProtectedRoute>
 * } />
 */
export default function ProtectedRoute({ 
  children, 
  requireRole = null 
}) {
  const { user, loading, isAuthenticated } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Checking authentication...</p>
      </div>
    );
  }

  // Not authenticated - redirect to login
  if (!isAuthenticated) {
    return (
      <Navigate 
        to="/login" 
        state={{ from: location }} 
        replace 
      />
    );
  }

  // Check role requirement if specified
  if (requireRole) {
    const hasRequiredRole = checkRole(user.role, requireRole);
    
    if (!hasRequiredRole) {
      return (
        <div className="access-denied">
          <div className="access-denied-content">
            <h1>Access Denied</h1>
            <p>
              You don't have permission to access this page.
              Required role: {requireRole}
            </p>
            <p>Your role: {user.role}</p>
            <a href="/" className="btn btn-primary">
              Go to Home
            </a>
          </div>
        </div>
      );
    }
  }

  // All checks passed - render the protected content
  return children;
}

/**
 * Check if user role meets requirement
 * Hierarchy: admin > moderator > user
 */
function checkRole(userRole, requiredRole) {
  const roleHierarchy = {
    'admin': 3,
    'moderator': 2,
    'user': 1
  };

  const userLevel = roleHierarchy[userRole] || 0;
  const requiredLevel = roleHierarchy[requiredRole] || 0;

  return userLevel >= requiredLevel;
}

// Add basic CSS for loading and access denied states
const styles = `
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  color: #6c757d;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.access-denied {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  padding: 2rem;
}

.access-denied-content {
  text-align: center;
  max-width: 500px;
}

.access-denied h1 {
  color: #dc3545;
  margin-bottom: 1rem;
}

.access-denied p {
  color: #6c757d;
  margin-bottom: 1rem;
}

.access-denied .btn {
  margin-top: 1rem;
  padding: 0.75rem 1.5rem;
  background: #0b1f34;
  color: white;
  text-decoration: none;
  border-radius: 8px;
  display: inline-block;
  font-weight: 600;
}

.access-denied .btn:hover {
  background: #1a3a52;
}
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}