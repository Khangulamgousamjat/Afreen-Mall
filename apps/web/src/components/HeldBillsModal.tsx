import React, { useState, useEffect } from 'react';
import { Layers, Search, X, Play, Clock, AlertTriangle } from 'lucide-react';

interface HeldBill {
  id: string;
  holdNo: string;
  customerPhone?: string;
  customerName?: string;
  items: any[];
  totalAmount: number;
  cashierName: string;
  createdAt: string;
  notes?: string;
}

interface HeldBillsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRecallBill: (heldBill: HeldBill) => void;
}

export const HeldBillsModal: React.FC<HeldBillsModalProps> = ({ isOpen, onClose, onRecallBill }) => {
  const [heldList, setHeldList] = useState<HeldBill[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (isOpen) {
      try {
        const saved = localStorage.getItem('afreen_held_bills');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) setHeldList(parsed);
        } else {
          setHeldList([]);
        }
      } catch {
        setHeldList([]);
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const filtered = heldList.filter((h) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      h.holdNo.toLowerCase().includes(q) ||
      (h.customerName && h.customerName.toLowerCase().includes(q)) ||
      (h.customerPhone && h.customerPhone.includes(q)) ||
      h.cashierName.toLowerCase().includes(q)
    );
  });

  const handleRecall = (bill: HeldBill) => {
    // Remove recalled bill from local storage list
    const updated = heldList.filter((b) => b.id !== bill.id);
    localStorage.setItem('afreen_held_bills', JSON.stringify(updated));
    onRecallBill(bill);
    onClose();
  };

  return (
    <div className="modal-overlay" style={{ zIndex: 1300 }}>
      <div className="modal-content" style={{ maxWidth: '640px', border: '2px solid var(--accent-lime)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Layers size={20} style={{ color: 'var(--accent-lime)' }} />
            <h3 style={{ fontSize: '18px', fontWeight: 'bold', textTransform: 'uppercase' }}>
              Held Bills Registry · Recall Bill (F5)
            </h3>
          </div>
          <button className="btn" onClick={onClose} style={{ padding: '4px 8px' }}>
            <X size={16} />
          </button>
        </div>

        <div style={{ position: 'relative', width: '100%', marginBottom: '16px' }}>
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            className="input-field"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search held bill by Hold ID, Customer Phone, Name, or Cashier..."
            style={{ fontSize: '14px', padding: '10px 12px 10px 38px' }}
            autoFocus
          />
        </div>

        <div className="table-container" style={{ maxHeight: '280px', overflowY: 'auto' }}>
          <table>
            <thead>
              <tr>
                <th>HOLD ID</th>
                <th>TIME</th>
                <th>CUSTOMER</th>
                <th>ITEMS</th>
                <th>TOTAL</th>
                <th style={{ textAlign: 'right' }}>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                    No active held bills matching "{searchQuery}"
                  </td>
                </tr>
              ) : (
                filtered.map((b) => (
                  <tr key={b.id}>
                    <td style={{ fontWeight: 'bold', fontFamily: 'monospace', color: 'var(--accent-lime)' }}>{b.holdNo}</td>
                    <td style={{ fontSize: '12px' }}>{new Date(b.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                    <td>{b.customerName || b.customerPhone || 'Walk-in'}</td>
                    <td className="tabular-nums">{b.items.length} items</td>
                    <td className="monetary" style={{ fontWeight: 'bold' }}>
                      ₹{(b.totalAmount / 100).toFixed(2)}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button className="btn btn-primary" onClick={() => handleRecall(b)} style={{ padding: '3px 10px', fontSize: '11px' }}>
                        <Play size={12} /> <span>Recall Bill</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px', fontSize: '11px', color: 'var(--text-muted)' }}>
          <span>Held bills remain active for the current shift.</span>
          <button className="btn" onClick={onClose} style={{ padding: '6px 14px' }}>
            Close (Esc)
          </button>
        </div>
      </div>
    </div>
  );
};
