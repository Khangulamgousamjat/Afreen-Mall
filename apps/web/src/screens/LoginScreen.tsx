import React, { useState, useRef, useEffect } from 'react';
import { AlertOctagon, ArrowLeft, Eye, EyeOff, Search, Users, ChevronDown, ChevronUp, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

interface LoginScreenProps {
  onBackToWelcome: () => void;
  onLoginSuccess: () => void;
}

interface StaffMember {
  staffId: number;
  username: string;
  name: string;
  role: string;
}

// Default seeded staff directory
const INITIAL_STAFF_LIST: StaffMember[] = [
  { staffId: 300000, username: 'Superkhan', name: 'Gous Khan', role: 'SUPER_ADMIN' },
  { staffId: 300001, username: 'manager1', name: 'Store Manager', role: 'STORE_MANAGER' },
  { staffId: 300002, username: 'cashier1', name: 'Head Cashier', role: 'CASHIER' },
  { staffId: 300003, username: 'cashofficer1', name: 'Cash Officer', role: 'CASH_OFFICER' },
  { staffId: 300004, username: 'inventory1', name: 'Inventory Specialist', role: 'INVENTORY_STAFF' },
  { staffId: 300005, username: 'warehouse1', name: 'Warehouse Lead', role: 'WAREHOUSE_STAFF' },
  { staffId: 300006, username: 'auditor1', name: 'Audit Officer', role: 'AUDITOR' },
];

export const LoginScreen: React.FC<LoginScreenProps> = ({ onBackToWelcome, onLoginSuccess }) => {
  const { login, theme } = useAuth();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Staff directory & search state
  const [staffList, setStaffList] = useState<StaffMember[]>(INITIAL_STAFF_LIST);
  const [staffSearchQuery, setStaffSearchQuery] = useState('');
  const [showStaffDirectory, setShowStaffDirectory] = useState(false);

  const passwordInputRef = useRef<HTMLInputElement>(null);

  // Fetch live users from API if available to auto-populate newly added staff
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get('/users');
        if (res.data?.users && Array.isArray(res.data.users)) {
          const apiUsers: StaffMember[] = res.data.users.map((u: any) => ({
            staffId: u.staffId,
            username: u.username,
            name: u.fullName || u.username,
            role: u.role,
          }));
          if (apiUsers.length > 0) {
            setStaffList(apiUsers);
          }
        }
      } catch {
        // Fallback to INITIAL_STAFF_LIST if offline/unauthenticated
      }
    };
    fetchUsers();
  }, []);

  // Filter staff by Name, Staff ID, or Role
  const filteredStaff = staffList.filter((s) => {
    const q = staffSearchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      s.name.toLowerCase().includes(q) ||
      s.staffId.toString().includes(q) ||
      s.username.toLowerCase().includes(q) ||
      s.role.toLowerCase().includes(q)
    );
  });

  const handleSelectStaff = (staff: StaffMember) => {
    setIdentifier(staff.staffId.toString());
    setShowStaffDirectory(false);
    setError('');
    // Auto-focus password input after selecting staff
    setTimeout(() => {
      passwordInputRef.current?.focus();
    }, 50);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!identifier.trim() || !password) {
      setError('Staff ID / Username and Password are required');
      return;
    }

    try {
      setLoading(true);
      await login(identifier.trim(), password);
      onLoginSuccess();
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  // Get selected staff display name if identifier matches a staff member
  const selectedStaffObj = staffList.find(
    (s) => s.staffId.toString() === identifier.trim() || s.username.toLowerCase() === identifier.trim().toLowerCase()
  );

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: 'var(--bg-color)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        position: 'relative',
      }}
    >
      {/* Top-left logo header — matches every internal page */}
      <div style={{ position: 'absolute', top: '16px', left: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <img
          src={theme === 'dark' ? '/logo-dark.jpg' : '/logo-light.jpg'}
          alt="Afreen Mall"
          style={{ height: '42px', width: 'auto', objectFit: 'contain' }}
          draggable={false}
        />
        <div style={{ lineHeight: 1.2 }}>
          <div style={{ fontSize: '16px', fontWeight: '500', color: 'var(--text-main)', letterSpacing: '0.5px' }}>Afreen Mall</div>
          <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.8px' }}>Internal Operations</div>
        </div>
      </div>

      <div className="card" style={{ maxWidth: '460px', width: '100%', padding: '32px 28px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <button
            className="btn"
            onClick={onBackToWelcome}
            style={{ padding: '4px 8px', fontSize: '12px' }}
          >
            <ArrowLeft size={14} />
            <span>Back</span>
          </button>

          {/* Quick Staff Directory Toggle Button */}
          <button
            className="btn"
            type="button"
            onClick={() => setShowStaffDirectory((prev) => !prev)}
            style={{
              padding: '4px 10px',
              fontSize: '12px',
              borderColor: showStaffDirectory ? 'var(--accent-lime)' : 'var(--border-color)',
              color: showStaffDirectory ? 'var(--accent-lime)' : 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Users size={14} />
            <span>Staff Directory</span>
            {showStaffDirectory ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        </div>

        <div style={{ textAlign: 'center', marginBottom: '16px', marginTop: '4px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>Staff Secure Login</h2>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
            Enter Staff ID, select name below, or use username
          </div>
        </div>

        {/* Quick Staff Selection & Search Directory Dropdown Panel */}
        {showStaffDirectory && (
          <div
            style={{
              width: '100%',
              backgroundColor: 'var(--surface-color)',
              border: '1px solid var(--border-color)',
              padding: '12px',
              marginBottom: '16px',
              borderRadius: '4px',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
            }}
          >
            <div style={{ fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', color: 'var(--accent-lime)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span>Search & Select Staff Member</span>
              <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{filteredStaff.length} Accounts</span>
            </div>

            {/* Search Input Box */}
            <div style={{ position: 'relative', width: '100%' }}>
              <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="text"
                className="input-field"
                placeholder="Search by Name, Staff ID, or Role..."
                value={staffSearchQuery}
                onChange={(e) => setStaffSearchQuery(e.target.value)}
                style={{ paddingLeft: '32px', fontSize: '12px', padding: '6px 10px 6px 32px' }}
                autoFocus
              />
            </div>

            {/* Scrollable Staff List */}
            <div style={{ maxHeight: '160px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '4px' }}>
              {filteredStaff.length === 0 ? (
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', textAlign: 'center', padding: '12px', fontStyle: 'italic' }}>
                  No staff member matching "{staffSearchQuery}"
                </div>
              ) : (
                filteredStaff.map((staff) => {
                  const isSelected = identifier.trim() === staff.staffId.toString() || identifier.trim().toLowerCase() === staff.username.toLowerCase();
                  return (
                    <div
                      key={staff.staffId}
                      onClick={() => handleSelectStaff(staff)}
                      style={{
                        padding: '8px 10px',
                        backgroundColor: isSelected ? 'var(--accent-soft)' : 'var(--bg-color)',
                        border: `1px solid ${isSelected ? 'var(--accent-lime)' : 'var(--border-color)'}`,
                        borderRadius: '3px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                        <div style={{ fontSize: '13px', fontWeight: 'bold', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span>{staff.name}</span>
                          {isSelected && <CheckCircle2 size={13} style={{ color: 'var(--accent-lime)' }} />}
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                          ID: <strong style={{ color: 'var(--text-main)' }}>{staff.staffId}</strong> ({staff.username})
                        </div>
                      </div>
                      <span
                        style={{
                          fontSize: '10px',
                          padding: '2px 6px',
                          backgroundColor: 'rgba(255,255,255,0.06)',
                          border: '1px solid var(--border-color)',
                          color: 'var(--accent-lime)',
                          fontWeight: 'bold',
                          letterSpacing: '0.4px',
                        }}
                      >
                        {staff.role}
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* Selected Staff Info Badge */}
        {selectedStaffObj && !showStaffDirectory && (
          <div
            style={{
              width: '100%',
              backgroundColor: 'var(--accent-soft)',
              border: '1px solid var(--accent-lime)',
              padding: '8px 12px',
              marginBottom: '14px',
              fontSize: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <span style={{ color: 'var(--text-muted)', fontSize: '11px' }}>Selected Staff: </span>
              <strong style={{ color: 'var(--text-main)' }}>{selectedStaffObj.name}</strong>
              <span style={{ color: 'var(--text-muted)', fontSize: '11px', marginLeft: '6px' }} className="tabular-nums">(ID: {selectedStaffObj.staffId})</span>
            </div>
            <span style={{ fontSize: '10px', fontWeight: 'bold', color: 'var(--accent-lime)' }}>{selectedStaffObj.role}</span>
          </div>
        )}

        {error && (
          <div
            style={{
              width: '100%',
              backgroundColor: 'rgba(248, 113, 113, 0.1)',
              border: '1px solid var(--status-red)',
              color: 'var(--status-red)',
              padding: '10px 12px',
              fontSize: '13px',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            <AlertOctagon size={18} style={{ flexShrink: 0 }} />
            <div>{error}</div>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
              <label style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                6-Digit Staff ID / Username
              </label>
              <button
                type="button"
                onClick={() => setShowStaffDirectory(true)}
                style={{ background: 'none', border: 'none', color: 'var(--accent-lime)', fontSize: '11px', cursor: 'pointer', textDecoration: 'underline' }}
              >
                Search Name / Directory
              </button>
            </div>
            <input
              type="text"
              className="input-field tabular-nums"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="e.g. 300000 or click Staff Directory"
              required
              autoFocus
              disabled={loading}
            />
          </div>

          {/* Password Input Field with Eye Show/Hide Toggle */}
          <div>
            <label style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
              Password
            </label>
            <div style={{ position: 'relative', width: '100%' }}>
              <input
                ref={passwordInputRef}
                type={showPassword ? 'text' : 'password'}
                className="input-field"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                required
                disabled={loading}
                style={{ paddingRight: '40px' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                title={showPassword ? 'Hide password' : 'Show password'}
                style={{
                  position: 'absolute',
                  right: '8px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading} style={{ padding: '12px', marginTop: '6px' }}>
            {loading ? 'Authenticating...' : 'Sign In to Operations'}
          </button>
        </form>

        <div style={{ width: '100%', marginTop: '20px', textAlign: 'center', fontSize: '11px', color: 'var(--text-muted)', borderTop: '1px solid var(--border-color)', paddingTop: '14px' }}>
          Strictly internal access. Accounts provisioned by Super Admin.
        </div>
      </div>
    </div>
  );
};
