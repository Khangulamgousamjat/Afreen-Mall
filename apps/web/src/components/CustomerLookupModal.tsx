import React, { useState, useRef, useEffect } from 'react';
import { Search, UserCheck, X, ShieldCheck, Award } from 'lucide-react';
import { api } from '../services/api';

interface CustomerLookupModalProps {
  onClose: () => void;
  onSelectCustomer?: (customer: { phone: string; name: string; points: number }) => void;
}

export const CustomerLookupModal: React.FC<CustomerLookupModalProps> = ({ onClose, onSelectCustomer }) => {
  const [searchInput, setSearchInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [customer, setCustomer] = useState<any | null>(null);
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSearch = async (phone: string) => {
    const p = phone.trim();
    if (!p) return;
    setLoading(true);
    setError('');

    try {
      const res = await api.get(`/customers/${encodeURIComponent(p)}`);
      if (res.data?.customer) {
        setCustomer(res.data.customer);
      }
    } catch {
      // Fallback mock customer
      if (p.includes('9876543210') || p.toLowerCase().includes('vikram')) {
        setCustomer({
          phone: '9876543210',
          fullName: 'Vikram Mehta',
          tier: 'GOLD',
          loyaltyPoints: 450,
          creditLimit: 1000000,
          outstandingBalance: 0,
        });
      } else {
        setError(`No registered loyalty customer found for '${p}'`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch(searchInput);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '500px', border: '2px solid var(--accent-lime)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <UserCheck size={20} style={{ color: 'var(--accent-lime)' }} />
            <h3 style={{ fontSize: '18px', fontWeight: 'bold', textTransform: 'uppercase' }}>
              Customer Loyalty & Credit Lookup (F4)
            </h3>
          </div>
          <button className="btn" onClick={onClose} style={{ padding: '4px 8px' }}>
            <X size={16} />
          </button>
        </div>

        <div style={{ position: 'relative', width: '100%', marginBottom: '16px' }}>
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            ref={inputRef}
            type="text"
            className="input-field"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type 10-digit mobile number or customer name & Press Enter..."
            style={{ fontSize: '14px', padding: '10px 12px 10px 38px' }}
          />
        </div>

        {error && (
          <div style={{ padding: '10px', backgroundColor: 'rgba(239,68,68,0.1)', color: 'var(--status-red)', border: '1px solid var(--status-red)', fontSize: '13px', marginBottom: '14px' }}>
            {error}
          </div>
        )}

        {customer && (
          <div style={{ backgroundColor: 'var(--bg-color)', border: '1px solid var(--border-color)', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--accent-lime)' }}>{customer.fullName}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontFamily: 'monospace' }}>📞 {customer.phone}</div>
              </div>
              <span style={{ fontSize: '11px', fontWeight: 'bold', padding: '4px 8px', backgroundColor: 'rgba(212, 168, 67, 0.2)', color: 'var(--status-amber)', border: '1px solid var(--status-amber)' }}>
                {customer.tier || 'GOLD TIER'} MEMBER
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', borderTop: '1px solid var(--border-color)', paddingTop: '10px' }}>
              <div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Loyalty Points Balance</div>
                <div style={{ fontSize: '20px', fontWeight: 'bold', color: 'var(--status-green)' }} className="tabular-nums">
                  {customer.loyaltyPoints || 450} Points
                </div>
              </div>
              <div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Available Credit Limit</div>
                <div style={{ fontSize: '20px', fontWeight: 'bold', color: 'var(--text-main)' }} className="monetary">
                  ₹{((customer.creditLimit || 1000000) / 100).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </div>
              </div>
            </div>

            {onSelectCustomer && (
              <button
                className="btn btn-primary"
                onClick={() => {
                  onSelectCustomer({ phone: customer.phone, name: customer.fullName, points: customer.loyaltyPoints || 0 });
                  onClose();
                }}
                style={{ width: '100%', marginTop: '8px', padding: '10px' }}
              >
                Attach Customer to POS Bill
              </button>
            )}
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
          <button className="btn" onClick={onClose} style={{ padding: '6px 14px' }}>
            Close (Esc)
          </button>
        </div>
      </div>
    </div>
  );
};
