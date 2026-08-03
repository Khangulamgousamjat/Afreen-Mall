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
  { staffId: 300001, username: 'manager1', name: 'Sanjay Gupta', role: 'STORE_MANAGER' },
  { staffId: 300002, username: 'pooja1', name: 'Pooja Sharma', role: 'CASHIER' },
  { staffId: 300003, username: 'vinayak1', name: 'Vinayak Shinde', role: 'CASHIER' },
  { staffId: 300004, username: 'babuji1', name: 'Babuji Namole', role: 'CASH_OFFICER' },
  { staffId: 300005, username: 'amit1', name: 'Amit Verma', role: 'ACCOUNTANT' },
  { staffId: 300006, username: 'auditor1', name: 'Rajesh Deshmukh', role: 'AUDITOR' },
  { staffId: 300010, username: 'rohan1', name: 'Rohan Kadam', role: 'CASHIER' },
  { staffId: 300011, username: 'sunita1', name: 'Sunita Pawar', role: 'CASHIER' },
  { staffId: 300012, username: 'mahesh1', name: 'Mahesh Patil', role: 'CASHIER' },
  { staffId: 300013, username: 'sachin1', name: 'Sachin Jadhav', role: 'CASHIER' },
  { staffId: 300014, username: 'priya1', name: 'Priya Kulkarni', role: 'CASHIER' },
  { staffId: 300015, username: 'rahul1', name: 'Rahul Chavan', role: 'CASHIER' },
  { staffId: 300016, username: 'deepak1', name: 'Deepak Gaikwad', role: 'CASHIER' },
  { staffId: 300017, username: 'sneha1', name: 'Sneha Joshi', role: 'CASHIER' },
  { staffId: 300018, username: 'nitin1', name: 'Nitin More', role: 'CASHIER' },
  { staffId: 300019, username: 'aniket1', name: 'Aniket Salunkhe', role: 'CASHIER' },
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
  
  // Table is HIDDEN by default on screen load
  const [showStaffDirectory, setShowStaffDirectory] = useState(false);

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

  // Select staff member from directory table
  const handleSelectStaff = (staff: StaffMember) => {
    setIdentifier(staff.staffId.toString());
    setShowStaffDirectory(false); // Hide table after selecting valid staff
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
        // Valid ID: keep table HIDDEN, set ID, jump to Password box
        setIdentifier(matched.staffId.toString());
        setShowStaffDirectory(false);
        setError('');
        passwordInputRef.current?.focus();
      } else {
        // Wrong ID: OPEN table automatically and show error message
        setError(`Staff ID "${val}" not found. Please select your account from the directory table below.`);
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

      <div className="card" style={{ maxWidth: '520px', width: '100%', padding: '32px 28px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <button
            className="btn"
            onClick={onBackToWelcome}
            style={{ padding: '4px 8px', fontSize: '12px' }}
          >
            <ArrowLeft size={14} />
            <span>Back</span>
          </button>

          {/* Optional manual directory toggle */}
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
            <span>{showStaffDirectory ? 'Close Directory' : 'Staff Directory'}</span>
            {showStaffDirectory ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        </div>

        <div style={{ textAlign: 'center', marginBottom: '18px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>Staff Secure Login</h2>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
            Enter 6-digit Staff ID & Press Enter
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
          {/* Staff ID / Username Input Box */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <label style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--text-main)' }}>
                6-Digit Staff ID / Username
              </label>
              <button
                type="button"
                onClick={() => setShowStaffDirectory((prev) => !prev)}
                style={{ background: 'none', border: 'none', color: 'var(--accent-lime)', fontSize: '11px', cursor: 'pointer', textDecoration: 'underline' }}
              >
                {showStaffDirectory ? 'Hide Directory' : 'Search Directory'}
              </button>
            </div>
            <input
              ref={identifierInputRef}
              type="text"
              className="input-field tabular-nums"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              onKeyDown={handleIdentifierKeyDown}
              placeholder="Type Staff ID (e.g. 300000) & Press Enter"
              required
              autoFocus
              disabled={loading}
              style={{ fontSize: '14px', padding: '10px 12px' }}
            />
            <span style={{ fontSize: '10px', color: 'var(--text-muted)', display: 'block', marginTop: '4px' }}>
              Press Enter to validate — auto-fills name box below.
            </span>
          </div>

          {/* Dedicated Staff Full Name Box */}
          <div>
            <label style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--text-main)', display: 'block', marginBottom: '6px' }}>
              Staff Member Name (Auto-filled on ID match)
            </label>
            <div
              onClick={() => setShowStaffDirectory((prev) => !prev)}
              style={{
                width: '100%',
                padding: '10px 12px',
                backgroundColor: 'var(--bg-color)',
                border: selectedStaffObj ? '2px solid var(--accent-lime)' : '1px solid var(--border-color)',
                color: selectedStaffObj ? 'var(--text-main)' : 'var(--text-muted)',
                fontWeight: selectedStaffObj ? 'bold' : 'normal',
                fontSize: '14px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justify: 'space-between',
                transition: 'all 0.15s ease',
              }}
              title="Click to select staff member from directory"
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Users size={16} style={{ color: 'var(--accent-lime)' }} />
                <span>
                  {selectedStaffObj ? (
                    <>
                      <strong style={{ color: 'var(--accent-lime)' }}>{selectedStaffObj.name}</strong>
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginLeft: '8px' }}>({selectedStaffObj.role})</span>
                    </>
                  ) : (
                    '▶ Click here to select staff name from table...'
                  )}
                </span>
              </div>
              <ChevronDown size={16} style={{ color: 'var(--text-muted)' }} />
            </div>
          </div>

          {/* Directory Table — ONLY opens if wrong ID is entered or manually requested */}
          {showStaffDirectory && (
            <div style={{ width: '100%', border: '1px solid var(--accent-lime)', backgroundColor: 'var(--surface-color)', borderRadius: '4px', padding: '12px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', color: 'var(--accent-lime)', letterSpacing: '0.5px' }}>
                  Select Correct Account Below
                </span>
                <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{filteredStaff.length} Accounts</span>
              </div>

              {/* Big Search Input Box inside the opened table panel */}
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
                  style={{ fontSize: '13px', padding: '8px 12px 8px 36px', border: '1px solid var(--border-color)' }}
                  autoFocus
                />
              </div>

              {/* Scrollable Accounts Table */}
              <div style={{ maxHeight: '180px', overflowY: 'auto', border: '1px solid var(--border-color)' }}>
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
                        <td colSpan={4} style={{ padding: '16px', textAlign: 'center', color: 'var(--text-muted)', fontStyle: 'italic' }}>
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
                            style={{
                              backgroundColor: isSelected ? 'var(--accent-soft)' : undefined,
                              borderBottom: '1px solid var(--border-color)',
                              cursor: 'pointer',
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

        <div style={{ width: '100%', marginTop: '20px', textAlign: 'center', fontSize: '11px', color: 'var(--text-muted)', borderTop: '1px solid var(--border-color)', paddingTop: '14px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
          <div>Strictly internal access. Accounts provisioned by Store Manager / Super Admin.</div>
          <div className="crafted-by-badge" style={{ marginTop: '4px' }}>
            <span>Made with</span>
            <span className="animated-heart">❤️</span>
            <span>by <strong style={{ color: 'var(--accent-lime)' }}>Gous Khan</strong></span>
          </div>
        </div>
      </div>
    </div>
  );
};
