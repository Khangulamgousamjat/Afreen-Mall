import React, { useState } from 'react';
import { ShoppingBag, Plus, CheckCircle, Truck, ArrowRight } from 'lucide-react';

export const PurchasingScreen: React.FC = () => {
  const [orders, setOrders] = useState([
    { id: 'po-1', poNumber: 'PO-2026-0001', supplier: 'Metro Wholesale Traders Pvt Ltd', amount: 15400000, status: 'APPROVED', date: '2026-07-28' },
    { id: 'po-2', poNumber: 'PO-2026-0002', supplier: 'Britannia Industries Distribution', amount: 4800000, status: 'COMPLETED', date: '2026-07-27' },
  ]);

  const [showCreatePO, setShowCreatePO] = useState(false);

  const handleReceiveGRN = (poNumber: string) => {
    alert(`GRN Processed for ${poNumber}. Inventory decrements/increments updated in DB transaction.`);
    setOrders((prev) =>
      prev.map((o) => (o.poNumber === poNumber ? { ...o, status: 'COMPLETED' } : o))
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', textTransform: 'uppercase' }}>
            Purchasing & Supplier Procurement Pipeline
          </h1>
          <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            Purchase Request → PO → Supplier Approval → Goods Receipt Note (GRN) → Stock Update
          </div>
        </div>

        <button className="btn btn-primary" onClick={() => setShowCreatePO(true)}>
          <Plus size={16} />
          <span>Create Purchase Order</span>
        </button>
      </div>

      {/* Pipeline Status Workflow Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
        <div className="card" style={{ padding: '12px', fontSize: '12px', textAlign: 'center' }}>
          <div style={{ color: 'var(--text-muted)' }}>1. PURCHASE REQUEST</div>
          <div style={{ fontWeight: 'bold', fontSize: '16px', marginTop: '4px' }}>2 Pending</div>
        </div>
        <div className="card" style={{ padding: '12px', fontSize: '12px', textAlign: 'center' }}>
          <div style={{ color: 'var(--text-muted)' }}>2. PURCHASE ORDER</div>
          <div style={{ fontWeight: 'bold', fontSize: '16px', marginTop: '4px', color: 'var(--accent-lime)' }}>1 Approved</div>
        </div>
        <div className="card" style={{ padding: '12px', fontSize: '12px', textAlign: 'center' }}>
          <div style={{ color: 'var(--text-muted)' }}>3. GOODS RECEIPT NOTE (GRN)</div>
          <div style={{ fontWeight: 'bold', fontSize: '16px', marginTop: '4px', color: 'var(--status-amber)' }}>Ready to Receive</div>
        </div>
        <div className="card" style={{ padding: '12px', fontSize: '12px', textAlign: 'center' }}>
          <div style={{ color: 'var(--text-muted)' }}>4. INVENTORY STOCK INCREMENT</div>
          <div style={{ fontWeight: 'bold', fontSize: '16px', marginTop: '4px', color: 'var(--status-green)' }}>Auto Updated</div>
        </div>
      </div>

      {/* PO Table */}
      <div className="card">
        <h3 style={{ fontSize: '16px', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '16px' }}>
          Purchase Orders & GRN Receiving Status
        </h3>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>PO Number</th>
                <th>Supplier Name</th>
                <th>PO Date</th>
                <th>Total PO Value (₹)</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((po) => (
                <tr key={po.id}>
                  <td className="tabular-nums" style={{ fontWeight: 'bold', fontFamily: 'monospace' }}>{po.poNumber}</td>
                  <td>{po.supplier}</td>
                  <td className="tabular-nums">{po.date}</td>
                  <td className="monetary" style={{ fontWeight: 'bold' }}>₹{(po.amount / 100).toFixed(2)}</td>
                  <td>
                    <span
                      style={{
                        fontSize: '11px',
                        padding: '2px 6px',
                        border: '1px solid var(--border-color)',
                        backgroundColor: po.status === 'COMPLETED' ? 'rgba(74,222,128,0.1)' : 'rgba(228,253,151,0.1)',
                        color: po.status === 'COMPLETED' ? 'var(--status-green)' : 'var(--accent-lime)',
                      }}
                    >
                      {po.status}
                    </span>
                  </td>
                  <td>
                    {po.status === 'APPROVED' ? (
                      <button
                        className="btn btn-primary"
                        style={{ padding: '4px 10px', fontSize: '12px' }}
                        onClick={() => handleReceiveGRN(po.poNumber)}
                      >
                        <Truck size={12} />
                        <span>Receive Goods (GRN)</span>
                      </button>
                    ) : (
                      <span style={{ fontSize: '12px', color: 'var(--status-green)' }}>GRN Received & Stock Updated ✓</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
