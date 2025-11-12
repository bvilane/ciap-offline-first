const express = require('express');
const router = express.Router();
const { authenticateToken, requireAdmin, requireModerator } = require('../middleware/auth');
const User = require('../models/User');
const database = require('../database/connection');

// All admin routes require authentication
router.use(authenticateToken);

/**
 * GET /api/v1/admin/stats
 * Get dashboard statistics (moderators and admins)
 */
router.get('/stats', requireModerator, async (req, res) => {
  try {
    const stats = await Promise.all([
      // User counts by role
      User.countByRole(),
      
      // Pending content counts
      getPendingCounts('notices'),
      getPendingCounts('jobs'),
      getPendingCounts('skills'),
      
      // Total content counts
      getTotalCounts('notices'),
      getTotalCounts('jobs'),
      getTotalCounts('skills'),
      getTotalCounts('directory')
    ]);

    res.json({
      users: stats[0],
      pending: {
        notices: stats[1],
        jobs: stats[2],
        skills: stats[3]
      },
      total: {
        notices: stats[4],
        jobs: stats[5],
        skills: stats[6],
        directory: stats[7]
      },
      generated_at: new Date().toISOString()
    });
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({ error: 'Failed to get statistics' });
  }
});

/**
 * GET /api/v1/admin/users
 * List all users (admin only)
 */
router.get('/users', requireAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 20, role } = req.query;
    
    const users = await User.getAll({ 
      page: parseInt(page), 
      limit: parseInt(limit),
      role 
    });

    res.json({
      users,
      page: parseInt(page),
      limit: parseInt(limit)
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Failed to get users' });
  }
});

/**
 * PUT /api/v1/admin/users/:id/role
 * Update user role (admin only)
 */
router.put('/users/:id/role', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!role || !['user', 'moderator', 'admin'].includes(role)) {
      return res.status(400).json({ 
        error: 'Invalid role. Must be: user, moderator, or admin' 
      });
    }

    // Prevent self-demotion from admin
    if (parseInt(id) === req.user.id && role !== 'admin') {
      return res.status(403).json({ 
        error: 'Cannot change your own admin role' 
      });
    }

    const result = await User.updateRole(id, role);
    
    res.json({
      message: 'User role updated successfully',
      user: result
    });
  } catch (error) {
    console.error('Update role error:', error);
    
    if (error.message === 'User not found') {
      return res.status(404).json({ error: error.message });
    }
    
    res.status(500).json({ error: 'Failed to update user role' });
  }
});

/**
 * PUT /api/v1/admin/users/:id/status
 * Update user status (admin only)
 */
router.put('/users/:id/status', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status || !['active', 'inactive'].includes(status)) {
      return res.status(400).json({ 
        error: 'Invalid status. Must be: active or inactive' 
      });
    }

    // Prevent self-deactivation
    if (parseInt(id) === req.user.id) {
      return res.status(403).json({ 
        error: 'Cannot deactivate your own account' 
      });
    }

    const result = await User.updateStatus(id, status);
    
    res.json({
      message: 'User status updated successfully',
      user: result
    });
  } catch (error) {
    console.error('Update status error:', error);
    
    if (error.message === 'User not found') {
      return res.status(404).json({ error: error.message });
    }
    
    res.status(500).json({ error: 'Failed to update user status' });
  }
});

/**
 * GET /api/v1/admin/pending/:type
 * Get pending content for moderation
 * type: notices, jobs, or skills
 */
router.get('/pending/:type', requireModerator, async (req, res) => {
  try {
    const { type } = req.params;
    const validTypes = ['notices', 'jobs', 'skills'];
    
    if (!validTypes.includes(type)) {
      return res.status(400).json({ 
        error: 'Invalid type. Must be: notices, jobs, or skills' 
      });
    }

    const items = await getPendingContent(type);
    
    res.json({
      type,
      items,
      count: items.length
    });
  } catch (error) {
    console.error('Get pending content error:', error);
    res.status(500).json({ error: 'Failed to get pending content' });
  }
});

/**
 * POST /api/v1/admin/approve/:type/:id
 * Approve content
 */
router.post('/approve/:type/:id', requireModerator, async (req, res) => {
  try {
    const { type, id } = req.params;
    const validTypes = ['notices', 'jobs', 'skills'];
    
    if (!validTypes.includes(type)) {
      return res.status(400).json({ 
        error: 'Invalid type. Must be: notices, jobs, or skills' 
      });
    }

    await updateContentStatus(type, id, 'approved', req.user.id);
    
    res.json({
      message: `${type.slice(0, -1)} approved successfully`,
      type,
      id: parseInt(id),
      status: 'approved'
    });
  } catch (error) {
    console.error('Approve content error:', error);
    res.status(500).json({ error: 'Failed to approve content' });
  }
});

/**
 * POST /api/v1/admin/reject/:type/:id
 * Reject content
 */
router.post('/reject/:type/:id', requireModerator, async (req, res) => {
  try {
    const { type, id } = req.params;
    const { reason } = req.body;
    const validTypes = ['notices', 'jobs', 'skills'];
    
    if (!validTypes.includes(type)) {
      return res.status(400).json({ 
        error: 'Invalid type. Must be: notices, jobs, or skills' 
      });
    }

    await updateContentStatus(type, id, 'rejected', req.user.id, reason);
    
    res.json({
      message: `${type.slice(0, -1)} rejected successfully`,
      type,
      id: parseInt(id),
      status: 'rejected'
    });
  } catch (error) {
    console.error('Reject content error:', error);
    res.status(500).json({ error: 'Failed to reject content' });
  }
});

// Helper functions

async function getPendingCounts(table) {
  await database.connect();
  const result = await database.queryOne(
    `SELECT COUNT(*) as count FROM ${table} WHERE status = 'pending'`
  );
  return result ? result.count : 0;
}

async function getTotalCounts(table) {
  await database.connect();
  const result = await database.queryOne(`SELECT COUNT(*) as count FROM ${table}`);
  return result ? result.count : 0;
}

async function getPendingContent(table) {
  await database.connect();
  const sql = `
    SELECT * FROM ${table} 
    WHERE status = 'pending' 
    ORDER BY created_at DESC
  `;
  return database.query(sql);
}

async function updateContentStatus(table, id, status, moderatorId, reason = null) {
  await database.connect();
  let sql = `
    UPDATE ${table} 
    SET status = ?, 
        moderated_by = ?,
        moderated_at = CURRENT_TIMESTAMP
  `;
  const params = [status, moderatorId];
  
  if (reason) {
    sql += ', rejection_reason = ?';
    params.push(reason);
  }
  
  sql += ' WHERE id = ?';
  params.push(id);
  
  const result = await database.execute(sql, params);
  if (result.changes === 0) {
    throw new Error('Content not found');
  }
}

module.exports = router;