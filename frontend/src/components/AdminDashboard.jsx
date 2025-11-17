import React, { useState, useEffect } from 'react';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    pendingApprovals: 0,
    totalContent: 0,
    connectedDevices: 12,
    meshNodes: 4,
    nodesOnline: 3,
    bandwidthUsage: 67,
    cacheHitRate: 85,
    supportTickets: 3
  });
  const [pendingContent, setPendingContent] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchStats();
    fetchPendingContent();
    fetchUsers();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch('http://localhost:3001/api/v1/admin/stats');
      const data = await res.json();
      setStats(prev => ({...prev, ...data}));
    } catch (err) {
      console.error('Failed to fetch stats');
    }
  };

  const fetchPendingContent = async () => {
    setPendingContent([
      { id: 1, type: 'Notice', title: 'Water Maintenance', submitter: 'John Doe', date: '2 hours ago' },
      { id: 2, type: 'Job', title: 'Plumber Needed', submitter: 'Jane Smith', date: '5 hours ago' },
      { id: 3, type: 'Skill', title: 'Computer Basics', submitter: 'Tech Center', date: '1 day ago' }
    ]);
  };

  const fetchUsers = async () => {
    setUsers([
      { id: 1, name: 'Admin User', email: 'admin@ciap.local', role: 'admin', status: 'active' },
      { id: 2, name: 'Moderator', email: 'mod@ciap.local', role: 'moderator', status: 'active' },
      { id: 3, name: 'Test User', email: 'test@ciap.local', role: 'user', status: 'active' }
    ]);
  };

  const meshNodes = [
    { id: 1, name: 'Node A - Community Hall', status: 'online', devices: 8, signal: 95 },
    { id: 2, name: 'Node B - Library', status: 'online', devices: 4, signal: 88 },
    { id: 3, name: 'Node C - School', status: 'online', devices: 15, signal: 92 },
    { id: 4, name: 'Node D - Clinic', status: 'offline', devices: 0, signal: 0 }
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f5f7fa' }}>
      {/* Sidebar */}
      <div style={{ width: 240, background: '#1e293b', color: 'white', padding: '20px 0' }}>
        <div style={{ padding: '0 20px', marginBottom: 30 }}>
          <h2 style={{ margin: 0, fontSize: 18 }}>Admin Portal</h2>
          <p style={{ margin: '4px 0 0', fontSize: 12, opacity: 0.7 }}>Network Management</p>
        </div>

        <nav>
          <NavItem icon="📊" label="Overview" active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} />
          <NavItem icon="📡" label="Mesh Network" active={activeTab === 'network'} onClick={() => setActiveTab('network')} />
          <NavItem icon="👥" label="User Management" active={activeTab === 'users'} onClick={() => setActiveTab('users')} />
          <NavItem icon="📝" label="Content Moderation" active={activeTab === 'moderation'} onClick={() => setActiveTab('moderation')} />
          <NavItem icon="💬" label="Support Tickets" active={activeTab === 'support'} onClick={() => setActiveTab('support')} />
          <NavItem icon="📈" label="Analytics" active={activeTab === 'analytics'} onClick={() => setActiveTab('analytics')} />
          <NavItem icon="⚙️" label="Settings" active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} />
        </nav>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: 30 }}>
        <div style={{ maxWidth: 1400, margin: '0 auto' }}>
          
          {activeTab === 'overview' && (
            <>
              <h1 style={{ margin: '0 0 30px', fontSize: 28 }}>Dashboard Overview</h1>
              
              {/* Stats Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20, marginBottom: 30 }}>
                <StatCard title="Connected Devices" value={stats.connectedDevices} icon="📱" color="#3b82f6" trend="+3 today" />
                <StatCard title="Mesh Nodes Online" value={`${stats.nodesOnline}/4`} icon="📡" color="#10b981" trend="1 offline" />
                <StatCard title="Cache Hit Rate" value={`${stats.cacheHitRate}%`} icon="⚡" color="#f59e0b" trend="+5% this week" />
                <StatCard title="Support Tickets" value={stats.supportTickets} icon="💬" color="#ef4444" trend="2 urgent" />
              </div>

              {/* Charts Row */}
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20, marginBottom: 30 }}>
                <Card title="Network Activity (24h)">
                  <div style={{ height: 200, display: 'flex', alignItems: 'flex-end', gap: 8, padding: '20px 0' }}>
                    {[45, 67, 55, 78, 89, 92, 78, 85, 95, 88, 75, 82].map((val, i) => (
                      <div key={i} style={{ flex: 1, background: '#3b82f6', height: `${val}%`, borderRadius: 4 }} />
                    ))}
                  </div>
                </Card>

                <Card title="Bandwidth Usage">
                  <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: 200 }}>
                    <div style={{ position: 'relative', width: 120, height: 120 }}>
                      <svg viewBox="0 0 36 36" style={{ transform: 'rotate(-90deg)' }}>
                        <circle cx="18" cy="18" r="16" fill="none" stroke="#e5e7eb" strokeWidth="3" />
                        <circle cx="18" cy="18" r="16" fill="none" stroke="#3b82f6" strokeWidth="3" strokeDasharray={`${stats.bandwidthUsage} ${100 - stats.bandwidthUsage}`} />
                      </svg>
                      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, fontWeight: 700 }}>
                        {stats.bandwidthUsage}%
                      </div>
                    </div>
                    <p style={{ marginTop: 16, color: '#64748b', fontSize: 14 }}>67 MB/s of 100 MB/s</p>
                  </div>
                </Card>
              </div>

              {/* Tables Row */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                <Card title="Recent Activity">
                  <ActivityList />
                </Card>

                <Card title="Pending Approvals">
                  {pendingContent.map(item => (
                    <div key={item.id} style={{ padding: '12px 0', borderBottom: '1px solid #e5e7eb' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                        <span style={{ fontWeight: 600 }}>{item.title}</span>
                        <span style={{ fontSize: 12, color: '#64748b' }}>{item.date}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: 12, color: '#64748b' }}>{item.type} by {item.submitter}</span>
                        <div style={{ display: 'flex', gap: 8 }}>
                          <button style={{ padding: '4px 12px', background: '#10b981', color: 'white', border: 'none', borderRadius: 4, fontSize: 12, cursor: 'pointer' }}>Approve</button>
                          <button style={{ padding: '4px 12px', background: '#ef4444', color: 'white', border: 'none', borderRadius: 4, fontSize: 12, cursor: 'pointer' }}>Reject</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </Card>
              </div>
            </>
          )}

          {activeTab === 'network' && (
            <>
              <h1 style={{ margin: '0 0 30px', fontSize: 28 }}>Mesh Network Status</h1>
              
              <div style={{ display: 'grid', gap: 20 }}>
                {meshNodes.map(node => (
                  <Card key={node.id}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <h3 style={{ margin: '0 0 8px', fontSize: 18 }}>{node.name}</h3>
                        <div style={{ display: 'flex', gap: 20, fontSize: 14, color: '#64748b' }}>
                          <span>📱 {node.devices} devices</span>
                          <span>📶 Signal: {node.signal}%</span>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <span style={{ 
                          padding: '6px 16px', 
                          background: node.status === 'online' ? '#d1fae5' : '#fee2e2', 
                          color: node.status === 'online' ? '#065f46' : '#991b1b',
                          borderRadius: 999,
                          fontSize: 12,
                          fontWeight: 600
                        }}>
                          {node.status.toUpperCase()}
                        </span>
                        {node.status === 'offline' && (
                          <button style={{ padding: '8px 16px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer' }}>
                            Restart
                          </button>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </>
          )}

          {activeTab === 'users' && (
            <>
              <h1 style={{ margin: '0 0 30px', fontSize: 28 }}>User Management</h1>
              <Card>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid #e5e7eb', textAlign: 'left' }}>
                      <th style={{ padding: 12 }}>Name</th>
                      <th style={{ padding: 12 }}>Email</th>
                      <th style={{ padding: 12 }}>Role</th>
                      <th style={{ padding: 12 }}>Status</th>
                      <th style={{ padding: 12 }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(user => (
                      <tr key={user.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                        <td style={{ padding: 12 }}>{user.name}</td>
                        <td style={{ padding: 12, color: '#64748b' }}>{user.email}</td>
                        <td style={{ padding: 12 }}>
                          <span style={{ padding: '4px 12px', background: '#dbeafe', color: '#1e40af', borderRadius: 999, fontSize: 12, fontWeight: 600 }}>
                            {user.role}
                          </span>
                        </td>
                        <td style={{ padding: 12 }}>
                          <span style={{ padding: '4px 12px', background: '#d1fae5', color: '#065f46', borderRadius: 999, fontSize: 12, fontWeight: 600 }}>
                            {user.status}
                          </span>
                        </td>
                        <td style={{ padding: 12 }}>
                          <button style={{ padding: '6px 12px', background: '#f3f4f6', border: '1px solid #e5e7eb', borderRadius: 6, fontSize: 12, cursor: 'pointer' }}>
                            Edit
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Card>
            </>
          )}

          {activeTab === 'moderation' && (
            <>
              <h1 style={{ margin: '0 0 30px', fontSize: 28 }}>Content Moderation</h1>
              <Card>
                <p style={{ color: '#64748b', textAlign: 'center', padding: 40 }}>
                  {pendingContent.length} items pending review
                </p>
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function NavItem({ icon, label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: '100%',
        padding: '12px 20px',
        background: active ? 'rgba(255,255,255,0.1)' : 'transparent',
        border: 'none',
        borderLeft: active ? '4px solid #3b82f6' : '4px solid transparent',
        color: 'white',
        textAlign: 'left',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        fontSize: 14,
        transition: 'all 0.2s'
      }}
    >
      <span style={{ fontSize: 18 }}>{icon}</span>
      <span>{label}</span>
    </button>
  );
}

function StatCard({ title, value, icon, color, trend }) {
  return (
    <div style={{ background: 'white', padding: 24, borderRadius: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
        <span style={{ fontSize: 14, color: '#64748b' }}>{title}</span>
        <span style={{ fontSize: 24 }}>{icon}</span>
      </div>
      <div style={{ fontSize: 32, fontWeight: 700, marginBottom: 4, color }}>{value}</div>
      <div style={{ fontSize: 12, color: '#64748b' }}>{trend}</div>
    </div>
  );
}

function Card({ title, children }) {
  return (
    <div style={{ background: 'white', padding: 24, borderRadius: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
      {title && <h3 style={{ margin: '0 0 20px', fontSize: 16, fontWeight: 600 }}>{title}</h3>}
      {children}
    </div>
  );
}

function ActivityList() {
  const activities = [
    { time: '2 min ago', action: 'User joined network', user: 'Device #12' },
    { time: '15 min ago', action: 'Content approved', user: 'Admin' },
    { time: '1 hour ago', action: 'Node C reconnected', user: 'System' },
    { time: '3 hours ago', action: 'New submission', user: 'John Doe' }
  ];

  return (
    <div>
      {activities.map((activity, i) => (
        <div key={i} style={{ padding: '12px 0', borderBottom: i < activities.length - 1 ? '1px solid #e5e7eb' : 'none' }}>
          <div style={{ fontWeight: 500, marginBottom: 4 }}>{activity.action}</div>
          <div style={{ fontSize: 12, color: '#64748b' }}>{activity.user} • {activity.time}</div>
        </div>
      ))}
    </div>
  );
}