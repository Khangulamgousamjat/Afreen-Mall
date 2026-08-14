import React, { useState, useEffect } from 'react';
import { Settings, UserPlus, ShieldAlert, Lock, CheckCircle2, Key, Unlock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { RoleName } from '@afreen-mall/shared-types';

export const SettingsScreen: React.FC = () => {
  const { user } = useAuth();
  const isSuperAdmin = user?.role === RoleName.SUPER_ADMIN;

  const [staffList, setStaffList] = useState<any[]>([
    { id: '1', staffId: 300000, username: 'Superkhan', fullName: 'Super Admin (Gous Khan)', role: RoleName.SUPER_ADMIN, isLocked: false },
    { id: '2', staffId: 300001, username: 'manager1', fullName: 'Rajesh Sharma', role: RoleName.STORE_MANAGER, isLocked: false },
    { id: '3', staffId: 300002, username: 'accountant1', fullName: 'Priya Patel', role: RoleName.ACCOUNTANT, isLocked: false },
    { id: '4', staffId: 300003, username: 'cashier1', fullName: 'Amit Verma', role: RoleName.CASHIER, isLocked: false },
    { id: '5', staffId: 300004, username: 'cashofficer1', fullName: 'Sanjay Gupta', role: RoleName.CASH_OFFICER, isLocked: false },
  ]);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [newFullName, setNewFullName] = useState('');
  const [newRole, setNewRole] = useState<RoleName>(RoleName.CASHIER);

  // One-Time Password Reveal Modal State
  const [oneTimePasswordReveal, setOneTimePasswordReveal] = useState<{
    staffId: number;
    username: string;
    tempPass: string;
  } | null>(null);

  useEffect(() => {
    if (isSuperAdmin) {
      api.get('/users').then((res) => {
        if (res.data?.users) setStaffList(res.data.users);
      }).catch(() => {});
    }
  }, [isSuperAdmin]);

  // HARD BLOCK FOR NON-SUPER ADMIN USERS (Server-side & Client-side)
  if (!isSuperAdmin) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '48px 24px', border: '1px solid var(--status-red)' }}>
        <ShieldAlert size={48} style={{ color: 'var(--status-red)', marginBottom: '16px' }} />
        <h2 style={{ fontSize: '22px', fontWeight: 'bold', textTransform: 'uppercase' }}>
          Access Denied — Super Admin Restricted Route
        </h2>
        <p style={{ color: 'var(--text-muted)', marginTop: '8px', maxWidth: '520px', margin: '8px auto 0' }}>
          Users & Roles Management is exclusively reserved for the root Super Admin account (Superkhan). Store Managers, Accountants, and all other operational roles cannot view or modify staff access.
        </p>
      </div>
    );
  }

  const handleCreateStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post('/users', {
        username: newUsername,
        fullName: newFullName,
        role: newRole,
      });

      const created = res.data.user;
      const tempPass = res.data.oneTimeTemporaryPassword || 'Pass@123';

      setStaffList((prev) => [...prev, created]);
      setShowCreateModal(false);
      setNewUsername('');
      setNewFullName('');

      // Show One-Time Password Reveal Modal
      setOneTimePasswordReveal({
        staffId: created.staffId,
        username: created.username,
        tempPass,
      });
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to create staff account');
    }
  };

  const handleRoleChange = async (userId: string, role: RoleName) => {
    try {
      await api.patch(`/users/${userId}/role`, { role });
      setStaffList((prev) => prev.map((u) => (u.id === userId ? { ...u, role } : u)));
    } catch (err: any) {
      alert('Failed to update role');
    }
  };

  const handleUnlockUser = async (userId: string) => {
    try {
      await api.post(`/users/${userId}/unlock`);
      setStaffList((prev) => prev.map((u) => (u.id === userId ? { ...u, isLocked: false } : u)));
      alert('Account unlocked successfully');
    } catch (err: any) {
      alert('Failed to unlock account');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', textTransform: 'uppercase' }}>
            System Settings & Staff Access Control (Super Admin Only)
          </h1>
          <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            Staff ID auto-sequence, staff account provisioning, and RBAC role assignments
          </div>
        </div>

        <button className="btn btn-primary" onClick={() => setShowCreateModal(true)}>
          <UserPlus size={16} />
          <span>Create Staff Login</span>
        </button>
      </div>

      {/* Staff Directory Table */}
      <div className="card">
        <h3 style={{ fontSize: '16px', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '16px' }}>
          Staff Account Directory (Auto 6-Digit Staff IDs starting 300000)
        </h3>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Staff ID</th>
                <th>Username</th>
                <th>Full Name</th>
                <th>Assigned Role</th>
                <th>Account Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {staffList.map((s) => (
                <tr key={s.id}>
                  <td className="tabular-nums" style={{ fontWeight: 'bold', fontFamily: 'monospace', color: 'var(--accent-lime)' }}>
                    {s.staffId}
                  </td>
                  <td style={{ fontWeight: 'bold' }}>{s.username}</td>
                  <td>{s.fullName}</td>
                  <td>
                    <select
                      className="input-field"
                      style={{ fontSize: '12px', padding: '4px 8px' }}
                      value={s.role}
                      onChange={(e) => handleRoleChange(s.id, e.target.value as RoleName)}
                      disabled={s.staffId === 300000} // Lock root Super Admin
                    >
                      {Object.values(RoleName).map((r) => (
                        <option key={r} value={r}>
                          {r}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <span
                      style={{
                        fontSize: '11px',
                        padding: '2px 6px',
                        border: '1px solid var(--border-color)',
                        color: s.isLocked ? 'var(--status-red)' : 'var(--status-green)',
                      }}
                    >
                      {s.isLocked ? 'LOCKED (5 Failed Attempts)' : 'ACTIVE'}
                    </span>
                  </td>
                  <td>
                    {s.isLocked && (
                      <button className="btn" style={{ padding: '2px 6px', fontSize: '11px' }} onClick={() => handleUnlockUser(s.id)}>
                        <Unlock size={12} />
                        <span>Unlock</span>
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Staff Account Modal */}
      {showCreateModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '480px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '16px' }}>
              Create New Staff Login Account
            </h3>

            <form onSubmit={handleCreateStaff} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                  Full Name
                </label>
                <input
                  type="text"
                  className="input-field"
                  value={newFullName}
                  onChange={(e) => setNewFullName(e.target.value)}
                  placeholder="e.g. Ramesh Kumar"
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                  Username
                </label>
                <input
                  type="text"
                  className="input-field"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  placeholder="e.g. ramesh.k"
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                  Assign Operational Role
                </label>
                <select className="input-field" value={newRole} onChange={(e) => setNewRole(e.target.value as RoleName)}>
                  {Object.values(RoleName).map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>

              <div style={{ fontSize: '11px', color: 'var(--text-muted)', backgroundColor: 'var(--bg-color)', padding: '10px', border: '1px solid var(--border-color)' }}>
                Staff ID will be auto-generated sequentially starting from 300000. Default password <strong>Pass@123</strong> will be forced to change on first login.
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                  Create Account
                </button>
                <button type="button" className="btn" onClick={() => setShowCreateModal(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ONE-TIME PASSWORD REVEAL MODAL */}
      {oneTimePasswordReveal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '480px', border: '2px solid var(--accent-lime)' }}>
            <div style={{ textAlign: 'center', marginBottom: '16px' }}>
              <Key size={40} style={{ color: 'var(--accent-lime)', marginBottom: '8px' }} />
              <h3 style={{ fontSize: '20px', fontWeight: 'bold' }}>One-Time Password Reveal</h3>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
                Copy this password now. It is shown ONCE only and will never be displayed or returned in plaintext again.
              </p>
            </div>

            <div style={{ backgroundColor: 'var(--bg-color)', border: '1px solid var(--border-color)', padding: '16px', borderRadius: '0px', display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
              <div>Staff ID: <strong className="tabular-nums" style={{ color: 'var(--accent-lime)' }}>{oneTimePasswordReveal.staffId}</strong></div>
              <div>Username: <strong>{oneTimePasswordReveal.username}</strong></div>
              <div>Temporary Password: <strong style={{ color: 'var(--status-green)', fontSize: '18px', fontFamily: 'monospace' }}>{oneTimePasswordReveal.tempPass}</strong></div>
            </div>

            <button className="btn btn-primary" onClick={() => setOneTimePasswordReveal(null)} style={{ width: '100%', padding: '12px' }}>
              I Have Recorded This Password
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
