import React, { useState, useRef, useEffect } from 'react';
import { AlertOctagon, ArrowLeft, Eye, EyeOff, Search, Users, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';
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

  const [staffList, setStaffList] = useState<StaffMember[]>(INITIAL_STAFF_LIST);
  const [staffSearchQuery, setStaffSearchQuery] = useState('');
  const [showStaffDirectory, setShowStaffDirectory] = useState(true);

  const identifierInputRef = useRef<HTMLInputElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);

  // Fetch live staff members from API if available to auto-include newly provisioned accounts
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
        // Fallback to INITIAL_STAFF_LIST
      }
    };
    fetchUsers();
  }, []);

  // Filter staff by Name, Staff ID, Username, or Role
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

  // Select staff member and auto-focus password field
  const handleSelectStaff = (staff: StaffMember) => {
    setIdentifier(staff.staffId.toString());
    setError('');
    setTimeout(() => {
      passwordInputRef.current?.focus();
    }, 50);
  };

  // Keyboard Enter handler on Staff ID box
  const handleIdentifierKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const val = identifier.trim();
      if (!val) {
        setShowStaffDirectory(true);
        return;
      }

      // Check if typed identifier matches a valid staff account
      const matched = staffList.find(
        (s) => s.staffId.toString() === val || s.username.toLowerCase() === val.toLowerCase()
      );

      if (matched) {
        setIdentifier(matched.staffId.toString());
        setError('');
        passwordInputRef.current?.focus();
      } else {
        setError(`Staff ID "${val}" not found. Please choose your account from the table below.`);
        setShowStaffDirectory(true);
      }
    }
  };

  // Form submission handler (instant 1-second login)
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
      {/* Top-left logo header */}
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

      <div className="card" style={{ maxWidth: '680px', width: '100%', padding: '28px 32px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <button
            className="btn"
            onClick={onBackToWelcome}
            style={{ padding: '4px 8px', fontSize: '12px' }}
          >
            <ArrowLeft size={14} />
            <span>Back</span>
          </button>

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
            <span>{showStaffDirectory ? 'Hide Directory Table' : 'Show Directory Table'}</span>
            {showStaffDirectory ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        </div>

        <div style={{ textAlign: 'center', marginBottom: '18px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>Staff Secure Login</h2>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
            Type Staff ID & Press Enter, or Search & Select your account from the table below
          </div>
        </div>

        {error && (
          <div
            style={{
              width: '100%',
              backgroundColor: 'rgba(248, 113, 113, 0.1)',
              border: '1px solid var(--status-red)',
              color: 'var(--status-red)',
              padding: '10px 14px',
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

        <form onSubmit={handleSubmit} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Side-by-side Inputs: Staff ID Box (Left) + Big Search Box (Right) */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', alignItems: 'flex-start' }}>
            {/* Left: Staff ID / Username Input */}
            <div>
              <label style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--text-main)', display: 'block', marginBottom: '6px' }}>
                6-Digit Staff ID / Username
              </label>
              <input
                ref={identifierInputRef}
                type="text"
                className="input-field tabular-nums"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                onKeyDown={handleIdentifierKeyDown}
                placeholder="Type ID (e.g. 300000) & Press Enter"
                required
                autoFocus
                disabled={loading}
                style={{ fontSize: '14px', padding: '10px 12px' }}
              />
              <span style={{ fontSize: '10px', color: 'var(--text-muted)', display: 'block', marginTop: '4px' }}>
                Press Enter to validate & jump to password
              </span>
            </div>

            {/* Right: Big Staff Search Input */}
            <div>
              <label style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--accent-lime)', display: 'block', marginBottom: '6px' }}>
                Search Staff Directory (Name / Role / ID)
              </label>
              <div style={{ position: 'relative', width: '100%' }}>
                <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  ref={searchInputRef}
                  type="text"
                  className="input-field"
                  value={staffSearchQuery}
                  onChange={(e) => setStaffSearchQuery(e.target.value)}
                  placeholder="Search by Name, Staff ID, or Role..."
                  disabled={loading}
                  style={{ fontSize: '14px', padding: '10px 12px 10px 36px', border: '1px solid var(--accent-lime)' }}
                />
              </div>
              <span style={{ fontSize: '10px', color: 'var(--text-muted)', display: 'block', marginTop: '4px' }}>
                Filters staff table live as you type
              </span>
            </div>
          </div>

          {/* Prominent Staff Accounts Table */}
          {showStaffDirectory && (
            <div style={{ width: '100%', border: '1px solid var(--border-color)', backgroundColor: 'var(--surface-color)', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ padding: '8px 12px', backgroundColor: 'var(--surface-secondary)', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', color: 'var(--accent-lime)', letterSpacing: '0.5px' }}>
                  Staff Accounts Directory
                </span>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                  Showing {filteredStaff.length} of {staffList.length} accounts (Click or Enter to select)
                </span>
              </div>

              <div style={{ maxHeight: '190px', overflowY: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                  <thead>
                    <tr style={{ backgroundColor: 'var(--bg-color)', borderBottom: '1px solid var(--border-color)', textAlign: 'left', color: 'var(--text-muted)', fontSize: '10px', textTransform: 'uppercase' }}>
                      <th style={{ padding: '8px 12px' }}>STAFF ID</th>
                      <th style={{ padding: '8px 12px' }}>STAFF NAME</th>
                      <th style={{ padding: '8px 12px' }}>ROLE</th>
                      <th style={{ padding: '8px 12px', textAlign: 'right' }}>ACTION</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStaff.length === 0 ? (
                      <tr>
                        <td colSpan={4} style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                          No staff member matching "{staffSearchQuery}"
                        </td>
                      </tr>
                    ) : (
                      filteredStaff.map((staff) => {
                        const isSelected = identifier.trim() === staff.staffId.toString() || identifier.trim().toLowerCase() === staff.username.toLowerCase();
                        return (
                          <tr
                            key={staff.staffId}
                            onClick={() => handleSelectStaff(staff)}
                            onKeyDown={(e) => { if (e.key === 'Enter') handleSelectStaff(staff); }}
                            tabIndex={0}
                            style={{
                              backgroundColor: isSelected ? 'var(--accent-soft)' : undefined,
                              borderBottom: '1px solid var(--border-color)',
                              cursor: 'pointer',
                              transition: 'background-color 0.15s ease',
                            }}
                          >
                            <td style={{ padding: '8px 12px', fontFamily: 'monospace', fontWeight: 'bold', color: 'var(--text-main)' }}>
                              {staff.staffId}
                            </td>
                            <td style={{ padding: '8px 12px', fontWeight: 'bold', color: isSelected ? 'var(--accent-lime)' : 'var(--text-main)' }}>
                              {staff.name}
                              {isSelected && <CheckCircle2 size={13} style={{ display: 'inline', marginLeft: '6px', color: 'var(--accent-lime)' }} />}
                            </td>
                            <td style={{ padding: '8px 12px' }}>
                              <span
                                style={{
                                  fontSize: '10px',
                                  padding: '2px 6px',
                                  backgroundColor: 'rgba(255,255,255,0.06)',
                                  border: '1px solid var(--border-color)',
                                  color: 'var(--accent-lime)',
                                  fontWeight: 'bold',
                                }}
                              >
                                {staff.role}
                              </span>
                            </td>
                            <td style={{ padding: '8px 12px', textAlign: 'right' }}>
                              <button
                                type="button"
                                className={`btn ${isSelected ? 'btn-primary' : ''}`}
                                style={{ padding: '2px 8px', fontSize: '11px' }}
                                onClick={(e) => { e.stopPropagation(); handleSelectStaff(staff); }}
                              >
                                {isSelected ? 'Selected ✓' : 'Select'}
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Selected Staff Info Bar */}
          {selectedStaffObj && (
            <div
              style={{
                width: '100%',
                backgroundColor: 'var(--accent-soft)',
                border: '1px solid var(--accent-lime)',
                padding: '8px 14px',
                fontSize: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <span style={{ color: 'var(--text-muted)', fontSize: '11px' }}>Account Selected: </span>
                <strong style={{ color: 'var(--accent-lime)' }}>{selectedStaffObj.name}</strong>
                <span style={{ color: 'var(--text-muted)', fontSize: '11px', marginLeft: '6px' }} className="tabular-nums">(ID: {selectedStaffObj.staffId})</span>
              </div>
              <span style={{ fontSize: '10px', fontWeight: 'bold', color: 'var(--accent-lime)', textTransform: 'uppercase' }}>{selectedStaffObj.role}</span>
            </div>
          )}

          {/* Password Input Box with Eye Show/Hide Toggle */}
          <div>
            <label style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--text-main)', display: 'block', marginBottom: '6px' }}>
              Password
            </label>
            <div style={{ position: 'relative', width: '100%' }}>
              <input
                ref={passwordInputRef}
                type={showPassword ? 'text' : 'password'}
                className="input-field"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password & Press Enter to sign in"
                required
                disabled={loading}
                style={{ fontSize: '14px', padding: '10px 40px 10px 12px' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                title={showPassword ? 'Hide password' : 'Show password'}
                style={{
                  position: 'absolute',
                  right: '10px',
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
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <span style={{ fontSize: '10px', color: 'var(--text-muted)', display: 'block', marginTop: '4px' }}>
              Press Enter inside password field to sign in instantly
            </span>
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading} style={{ padding: '14px', fontSize: '15px', marginTop: '4px' }}>
            {loading ? 'Authenticating...' : 'Sign In to Operations (Enter)'}
          </button>
        </form>

        <div style={{ width: '100%', marginTop: '20px', textAlign: 'center', fontSize: '11px', color: 'var(--text-muted)', borderTop: '1px solid var(--border-color)', paddingTop: '14px' }}>
          Strictly internal access. Accounts provisioned by Super Admin.
        </div>
      </div>
    </div>
  );
};
