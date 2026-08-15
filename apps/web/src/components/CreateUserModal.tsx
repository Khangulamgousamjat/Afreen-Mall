import React, { useState } from 'react';
import { UserPlus, Key, Building2, GitBranch, Eye, EyeOff } from 'lucide-react';
import { api } from '../services/api';
import { RoleName } from '@afreen-mall/shared-types';

interface CreateUserModalProps {
  onClose: () => void;
  onCreated: (user: any, tempPassword: string) => void;
}

const DEPARTMENTS = ['Sales', 'Purchase', 'Inventory', 'Accounting', 'HR', 'CRM', 'IT', 'Operations', 'Management'];
const BRANCHES = ['AFREEN-001 – Main Store', 'AFREEN-002 – North Branch', 'AFREEN-003 – South Branch'];
const COMPANIES = ['Afreen Mall Enterprises Pvt. Ltd.'];

export const CreateUserModal: React.FC<CreateUserModalProps> = ({ onClose, onCreated }) => {
  const [form, setForm] = useState({
    fullName: '',
    username: '',
    email: '',
    mobile: '',
    employeeCode: '',
    department: '',
    branch: BRANCHES[0],
    company: COMPANIES[0],
    role: RoleName.CASHIER as RoleName,
    initialPassword: 'Pass@123',
    canProcessSaleReturn: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const set = (k: string, v: any) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.fullName || !form.username || !form.role) {
      setError('Full Name, Username, and Role are required');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/admin/users', form);
      onCreated(res.data.user, res.data.oneTimeTemporaryPassword || form.initialPassword || 'Pass@123');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '560px', maxHeight: '90vh', overflowY: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
          <UserPlus size={24} style={{ color: '#10b981' }} />
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: 'bold' }}>Create New ERP User</h3>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Staff ID will be auto-assigned with an initial temporary password.</div>
          </div>
        </div>

        {error && (
          <div style={{ backgroundColor: 'rgba(239,68,68,0.1)', border: '1px solid #ef4444', color: '#ef4444', padding: '10px', marginBottom: '14px', fontSize: '13px' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Full Name *</label>
              <input type="text" className="input-field" value={form.fullName} onChange={(e) => set('fullName', e.target.value)} placeholder="e.g. Ramesh Kumar" required />
            </div>
            <div>
              <label style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Username *</label>
              <input type="text" className="input-field" value={form.username} onChange={(e) => set('username', e.target.value.toLowerCase())} placeholder="e.g. ramesh.k" required />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Email</label>
              <input type="email" className="input-field" value={form.email} onChange={(e) => set('email', e.target.value)} placeholder="ramesh@afreenmall.com" />
            </div>
            <div>
              <label style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Mobile</label>
              <input type="tel" className="input-field" value={form.mobile} onChange={(e) => set('mobile', e.target.value)} placeholder="+91 98765 43210" />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Employee Code (HRMS Link)</label>
              <input type="text" className="input-field" value={form.employeeCode} onChange={(e) => set('employeeCode', e.target.value)} placeholder="EMP-2026-000001" />
            </div>
            <div>
              <label style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Department</label>
              <select className="input-field" value={form.department} onChange={(e) => set('department', e.target.value)}>
                <option value="">Select Department</option>
                {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                <Building2 size={12} style={{ display: 'inline', marginRight: '4px' }} />Company
              </label>
              <select className="input-field" value={form.company} onChange={(e) => set('company', e.target.value)}>
                {COMPANIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                <GitBranch size={12} style={{ display: 'inline', marginRight: '4px' }} />Branch
              </label>
              <select className="input-field" value={form.branch} onChange={(e) => set('branch', e.target.value)}>
                {BRANCHES.map((b) => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Assign Role *</label>
              <select className="input-field" value={form.role} onChange={(e) => set('role', e.target.value as RoleName)}>
                {Object.values(RoleName).map((r) => <option key={r} value={r}>{r.replace(/_/g, ' ')}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Initial Temporary Password</label>
              <input type="text" className="input-field" value={form.initialPassword} onChange={(e) => set('initialPassword', e.target.value)} placeholder="Pass@123" />
            </div>
          </div>

          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px' }}>
            <input type="checkbox" checked={form.canProcessSaleReturn} onChange={(e) => set('canProcessSaleReturn', e.target.checked)} />
            Allow Cashier — Sale Return Permission
          </label>

          <div style={{ backgroundColor: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.2)', padding: '12px', fontSize: '12px', color: 'var(--text-muted)' }}>
            <Key size={12} style={{ display: 'inline', marginRight: '6px', color: '#10b981' }} />
            Staff ID is auto-assigned from 300000+. User will be forced to change this temporary password on first login.
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
            <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={loading}>
              {loading ? 'Creating…' : 'Create User Account'}
            </button>
            <button type="button" className="btn" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};
