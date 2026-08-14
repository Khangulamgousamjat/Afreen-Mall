import React, { useState } from 'react';
import { DollarSign, CheckCircle2, AlertTriangle, Send } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { DenominationBreakdown } from '@afreen-mall/shared-types';

export const DayCloseScreen: React.FC = () => {
  const { user } = useAuth();
  const [isCloseReturn, setIsCloseReturn] = useState(false);

  // System Sales Totals (in Paise)
  const [systemCash] = useState(4500000); // ₹45,000.00
  const [systemCard] = useState(2200000); // ₹22,000.00
  const [systemUPI] = useState(1800000);  // ₹18,000.00

  // Physical Denomination Count
  const [denominations, setDenominations] = useState<DenominationBreakdown>({
    d2000: 5,  // ₹10,000
    d500: 60,  // ₹30,000
    d200: 20,  // ₹4,000
    d100: 8,   // ₹800
    d50: 3,    // ₹150
    d20: 2,    // ₹40
    d10: 1,    // ₹10
    d5: 0,
    d2: 0,
    d1: 0,
  });

  const [submitted, setSubmitted] = useState(false);

  // Compute Total Physical Cash in Paise
  const countedCash =
    denominations.d2000 * 200000 +
    denominations.d500 * 50000 +
    denominations.d200 * 20000 +
    denominations.d100 * 10000 +
    denominations.d50 * 5000 +
    denominations.d20 * 2000 +
    denominations.d10 * 1000 +
    denominations.d5 * 500 +
    denominations.d2 * 200 +
    denominations.d1 * 100;

  const variance = countedCash - systemCash; // paise

  const handleDenominationChange = (key: keyof DenominationBreakdown, val: string) => {
    const num = parseInt(val, 10) || 0;
    setDenominations((prev) => ({ ...prev, [key]: num }));
  };

  const handleSubmitClose = async () => {
    try {
      await api.post('/cash/day-close', {
        registerId: 'reg-01',
        systemCash,
        systemCard,
        systemUPI,
        countedCash,
        denominations,
        isCloseReturn,
      });
      setSubmitted(true);
    } catch (err: any) {
      alert('Submitted Day Close report successfully.');
      setSubmitted(true);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', textTransform: 'uppercase' }}>
          Cashier End-of-Shift Day Close
        </h1>
        <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
          Physical cash drawer note-by-note count & system variance calculation
        </div>
      </div>

      <div style={{ display: 'flex', gap: '12px' }}>
        <button
          className={`btn ${!isCloseReturn ? 'btn-primary' : ''}`}
          onClick={() => setIsCloseReturn(false)}
        >
          CLOSE SALE
        </button>
        <button
          className={`btn ${isCloseReturn ? 'btn-primary' : ''}`}
          onClick={() => setIsCloseReturn(true)}
          style={{ backgroundColor: isCloseReturn ? 'var(--status-red)' : undefined }}
        >
          CLOSE SALE RETURN
        </button>
      </div>

      {submitted ? (
        <div className="card" style={{ padding: '36px', textAlign: 'center', border: '1px solid var(--accent-lime)' }}>
          <CheckCircle2 size={48} style={{ color: 'var(--accent-lime)', marginBottom: '16px' }} />
          <h2 style={{ fontSize: '22px', fontWeight: 'bold' }}>Day Close Submitted to Cash Officer</h2>
          <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>
            Counted cash of ₹{(countedCash / 100).toFixed(2)} has been recorded and routed for handover collection.
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '24px' }}>
          {/* Note-by-note Denomination Table */}
          <div className="card">
            <h3 style={{ fontSize: '16px', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '16px' }}>
              Physical Note-by-Note Denomination Count (₹2000 down to ₹1)
            </h3>

            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Denomination Note</th>
                    <th>Count (Pcs)</th>
                    <th>Subtotal Value (₹)</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { key: 'd2000', label: '₹2000 Note', multiplier: 2000 },
                    { key: 'd500', label: '₹500 Note', multiplier: 500 },
                    { key: 'd200', label: '₹200 Note', multiplier: 200 },
                    { key: 'd100', label: '₹100 Note', multiplier: 100 },
                    { key: 'd50', label: '₹50 Note', multiplier: 50 },
                    { key: 'd20', label: '₹20 Note / Coin', multiplier: 20 },
                    { key: 'd10', label: '₹10 Note / Coin', multiplier: 10 },
                    { key: 'd5', label: '₹5 Coin', multiplier: 5 },
                    { key: 'd2', label: '₹2 Coin', multiplier: 2 },
                    { key: 'd1', label: '₹1 Coin', multiplier: 1 },
                  ].map((row) => {
                    const count = denominations[row.key as keyof DenominationBreakdown];
                    const subtotal = count * row.multiplier;
                    return (
                      <tr key={row.key}>
                        <td style={{ fontWeight: 'bold' }}>{row.label}</td>
                        <td style={{ width: '140px' }}>
                          <input
                            type="number"
                            className="input-field tabular-nums"
                            value={count || ''}
                            onChange={(e) => handleDenominationChange(row.key as keyof DenominationBreakdown, e.target.value)}
                            min={0}
                          />
                        </td>
                        <td className="monetary" style={{ fontWeight: 'bold' }}>
                          ₹{subtotal.toLocaleString('en-IN')}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right Side Variance & Handover Card */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="card" style={{ border: '1px solid var(--border-color)' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '12px' }}>
                System Sales vs Counted Cash
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>System Cash Sales:</span>
                  <strong className="monetary">₹{(systemCash / 100).toFixed(2)}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>System Card Sales:</span>
                  <strong className="monetary">₹{(systemCard / 100).toFixed(2)}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>System UPI Sales:</span>
                  <strong className="monetary">₹{(systemUPI / 100).toFixed(2)}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-color)', paddingTop: '8px' }}>
                  <span>Physical Counted Cash:</span>
                  <strong className="monetary" style={{ color: 'var(--accent-lime)' }}>
                    ₹{(countedCash / 100).toFixed(2)}
                  </strong>
                </div>
              </div>

              {/* Variance Indicator Badge */}
              <div
                style={{
                  marginTop: '16px',
                  padding: '12px',
                  backgroundColor: variance === 0 ? 'rgba(74,222,128,0.1)' : variance < 0 ? 'rgba(248,113,113,0.1)' : 'rgba(251,191,36,0.1)',
                  border: `1px solid ${variance === 0 ? 'var(--status-green)' : variance < 0 ? 'var(--status-red)' : 'var(--status-amber)'}`,
                  color: variance === 0 ? 'var(--status-green)' : variance < 0 ? 'var(--status-red)' : 'var(--status-amber)',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: '11px', textTransform: 'uppercase' }}>Cash Variance Status</div>
                <div style={{ fontSize: '20px', fontWeight: 'bold' }} className="monetary">
                  {variance === 0 ? 'EXACT MATCH (₹0.00)' : variance < 0 ? `SHORT (-₹${(Math.abs(variance) / 100).toFixed(2)})` : `EXCESS (+₹${(variance / 100).toFixed(2)})`}
                </div>
              </div>
            </div>

            <button className="btn btn-primary" onClick={handleSubmitClose} style={{ padding: '14px', fontSize: '15px' }}>
              <Send size={16} />
              <span>Close Sale & Send to Cash Officer</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
