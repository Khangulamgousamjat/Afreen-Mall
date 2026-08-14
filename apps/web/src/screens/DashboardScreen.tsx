import React, { useState, useEffect } from 'react';
import { TrendingUp, ShoppingBag, AlertTriangle, CheckCircle2, DollarSign } from 'lucide-react';
import { api } from '../services/api';
import { ShelfTagGauge } from '../components/ShelfTagGauge';

export const DashboardScreen: React.FC = () => {
  const [metrics, setMetrics] = useState({
    todayRevenue: 1245000, // ₹12,450.00
    todayTransactionCount: 42,
    lowStockCount: 3,
    pendingCashReports: 1,
  });

  const [lowStockItems, setLowStockItems] = useState([
    { id: '1', barcode: '890103000004', name: 'Amul Butter 500g', category: 'Grocery & Staples', currentStock: 5, minStockLevel: 20, mrp: 27500 },
    { id: '2', barcode: '890103000002', name: 'Britannia Good Day Biscuits 200g', category: 'Snacks & Beverages', currentStock: 12, minStockLevel: 50, mrp: 4000 },
    { id: '3', barcode: '890103000003', name: 'Coca Cola Soft Drink 1.25L', category: 'Snacks & Beverages', currentStock: 45, minStockLevel: 30, mrp: 6500 },
  ]);

  const [recentTransactions, setRecentTransactions] = useState([
    { invoiceNo: 'INV-20260728-0042', cashier: 'Amit Verma', total: 65000, mode: 'UPI', time: '20:15' },
    { invoiceNo: 'INV-20260728-0041', cashier: 'Amit Verma', total: 12500, mode: 'CASH', time: '20:08' },
    { invoiceNo: 'INV-20260728-0040', cashier: 'Amit Verma', total: 34000, mode: 'CARD', time: '19:54' },
  ]);

  useEffect(() => {
    api.get('/reports/dashboard').then((res) => {
      if (res.data) setMetrics(res.data);
    }).catch(() => {});
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Top Header */}
      <div>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', textTransform: 'uppercase' }}>Store Dashboard & Live KPIs</h1>
        <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
          Real-time store performance, cash reconciliation status, and inventory alerts
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        <div className="card" style={{ borderLeft: '3px solid var(--accent-lime)' }}>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Today's Sales Revenue</div>
          <div style={{ fontSize: '26px', fontWeight: 'bold', marginTop: '6px' }} className="monetary">
            ₹{(metrics.todayRevenue / 100).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--status-green)', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <TrendingUp size={12} />
            <span>+14.2% vs yesterday</span>
          </div>
        </div>

        <div className="card" style={{ borderLeft: '3px solid var(--status-green)' }}>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Total Transactions</div>
          <div style={{ fontSize: '26px', fontWeight: 'bold', marginTop: '6px' }} className="tabular-nums">
            {metrics.todayTransactionCount}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>Across 3 Active Registers</div>
        </div>

        <div className="card" style={{ borderLeft: '3px solid var(--status-red)' }}>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Low Stock Items</div>
          <div style={{ fontSize: '26px', fontWeight: 'bold', marginTop: '6px', color: 'var(--status-red)' }} className="tabular-nums">
            {metrics.lowStockCount}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--status-red)', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <AlertTriangle size={12} />
            <span>Action Required in Inventory</span>
          </div>
        </div>

        <div className="card" style={{ borderLeft: '3px solid var(--status-amber)' }}>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Pending Day Close Approvals</div>
          <div style={{ fontSize: '26px', fontWeight: 'bold', marginTop: '6px', color: 'var(--status-amber)' }} className="tabular-nums">
            {metrics.pendingCashReports}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>Awaiting Accountant Sign-Off</div>
        </div>
      </div>

      {/* Main Content Split */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        {/* Left: Low Stock Items with Notched Shelf-Tag Gauge */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 'bold', textTransform: 'uppercase' }}>
              Low Stock Alerts (Notched Shelf-Tag Gauges)
            </h3>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Threshold &lt; Minimum Stock</span>
          </div>

          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Barcode</th>
                  <th>Product Name</th>
                  <th>Category</th>
                  <th>MRP</th>
                  <th>Stock Gauge</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {lowStockItems.map((item) => (
                  <tr key={item.id}>
                    <td className="tabular-nums" style={{ fontFamily: 'monospace' }}>{item.barcode}</td>
                    <td style={{ fontWeight: 'bold' }}>{item.name}</td>
                    <td style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{item.category}</td>
                    <td className="monetary">₹{(item.mrp / 100).toFixed(2)}</td>
                    <td>
                      <ShelfTagGauge currentStock={item.currentStock} minStockLevel={item.minStockLevel} />
                    </td>
                    <td>
                      <span
                        style={{
                          fontSize: '11px',
                          padding: '2px 6px',
                          backgroundColor: item.currentStock < item.minStockLevel ? 'rgba(248,113,113,0.15)' : 'rgba(251,191,36,0.15)',
                          color: item.currentStock < item.minStockLevel ? 'var(--status-red)' : 'var(--status-amber)',
                          border: `1px solid ${item.currentStock < item.minStockLevel ? 'var(--status-red)' : 'var(--status-amber)'}`,
                        }}
                      >
                        {item.currentStock < item.minStockLevel ? 'CRITICAL LOW' : 'WARNING'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Recent Transactions Panel */}
        <div className="card">
          <h3 style={{ fontSize: '16px', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '16px' }}>
            Recent POS Transactions
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {recentTransactions.map((tx, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '10px 12px',
                  backgroundColor: 'var(--bg-color)',
                  border: '1px solid var(--border-color)',
                }}
              >
                <div>
                  <div className="tabular-nums" style={{ fontWeight: 'bold', fontSize: '13px' }}>{tx.invoiceNo}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                    Cashier: {tx.cashier} · {tx.time}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div className="monetary" style={{ fontWeight: 'bold', color: 'var(--accent-lime)' }}>
                    ₹{(tx.total / 100).toFixed(2)}
                  </div>
                  <span
                    style={{
                      fontSize: '10px',
                      padding: '1px 5px',
                      border: '1px solid var(--border-color)',
                      textTransform: 'uppercase',
                    }}
                  >
                    {tx.mode}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
