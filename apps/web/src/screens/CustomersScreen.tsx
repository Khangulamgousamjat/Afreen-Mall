import React, { useState } from 'react';
import { Users, Search, Award, ShieldAlert } from 'lucide-react';

export const CustomersScreen: React.FC = () => {
  const [search, setSearch] = useState('');
  const [customers] = useState([
    { id: '1', name: 'Vikram Mehta', phone: '9876543210', tier: 'GOLD', points: 450, lastVisit: '2026-07-28' },
    { id: '2', name: 'Ananya Deshmukh', phone: '9820011223', tier: 'PLATINUM', points: 1280, lastVisit: '2026-07-26' },
    { id: '3', name: 'Ramesh Kulkarni', phone: '9765432109', tier: 'SILVER', points: 120, lastVisit: '2026-07-20' },
  ]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', textTransform: 'uppercase' }}>
          Shopper Loyalty Records (Operational Reference Only)
        </h1>
        <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
          Customer loyalty points lookups at POS checkout. Customers never authenticate into this system.
        </div>
      </div>

      {/* Security Disclaimer Banner */}
      <div
        className="card"
        style={{
          borderLeft: '4px solid var(--accent-lime)',
          backgroundColor: 'var(--accent-soft)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '12px 16px',
        }}
      >
        <ShieldAlert size={20} style={{ color: 'var(--accent-lime)' }} />
        <div style={{ fontSize: '13px' }}>
          <strong>Strict Security Policy:</strong> This module is an internal read/write staff directory for loyalty points only. Customer registration, public login, and customer accounts are non-existent by platform design.
        </div>
      </div>

      <div className="card">
        <div style={{ marginBottom: '16px', maxWidth: '360px' }}>
          <input
            type="text"
            className="input-field tabular-nums"
            placeholder="Search by phone number or customer name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Customer Name</th>
                <th>Mobile Number</th>
                <th>Loyalty Tier</th>
                <th>Loyalty Points Balance</th>
                <th>Last Store Visit</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((c) => (
                <tr key={c.id}>
                  <td style={{ fontWeight: 'bold' }}>{c.name}</td>
                  <td className="tabular-nums">{c.phone}</td>
                  <td>
                    <span
                      style={{
                        fontSize: '11px',
                        padding: '2px 6px',
                        border: '1px solid var(--border-color)',
                        fontWeight: 'bold',
                        color: c.tier === 'PLATINUM' ? '#a855f7' : c.tier === 'GOLD' ? 'var(--status-amber)' : 'var(--text-muted)',
                      }}
                    >
                      {c.tier}
                    </span>
                  </td>
                  <td className="tabular-nums" style={{ fontWeight: 'bold', color: 'var(--accent-lime)' }}>
                    {c.points} Points
                  </td>
                  <td className="tabular-nums">{c.lastVisit}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
