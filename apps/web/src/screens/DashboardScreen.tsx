import React, { useState, useEffect } from 'react';
import { TrendingUp, ShoppingBag, AlertTriangle, CheckCircle2, DollarSign, ShoppingCart, RotateCcw, Clock, FileText, ArrowRight } from 'lucide-react';
import { api } from '../services/api';
import { ShelfTagGauge } from '../components/ShelfTagGauge';
import { useAuth } from '../context/AuthContext';
import { RoleName } from '@afreen-mall/shared-types';

interface DashboardScreenProps {
  onNavigate?: (screen: string) => void;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const isCashier = user?.role === RoleName.CASHIER;

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
    { invoiceNo: 'INV-20260728-0042', cashier: 'Vinayak Shinde', total: 65000, mode: 'UPI', time: '20:15' },
    { invoiceNo: 'INV-20260728-0041', cashier: 'Vinayak Shinde', total: 12500, mode: 'CASH', time: '20:08' },
    { invoiceNo: 'INV-20260728-0040', cashier: 'Vinayak Shinde', total: 34000, mode: 'CARD', time: '19:54' },
  ]);

  useEffect(() => {
    api.get('/reports/dashboard').then((res) => {
      if (res.data) setMetrics(res.data);
    }).catch(() => {});
  }, []);

  // ── CASHIER DEDICATED COMMAND CENTER ─────────────────────────────────────
  if (isCashier) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Cashier Welcome Header */}
        <div style={{ borderLeft: '4px solid var(--accent-lime)', paddingLeft: '16px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>
            Cashier Command Center
          </h1>
          <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>
            Welcome, <strong>{user?.fullName}</strong> (Staff ID: {user?.staffId}) · Terminal Desk Operations
          </div>
        </div>

        {/* 4 Main Cashier Quick Action Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
          {/* Card 1: Sale */}
          <div
            className="card"
            style={{
              padding: '24px',
              borderLeft: '4px solid #10b981',
              backgroundColor: 'var(--surface-color)',
              cursor: 'pointer',
              transition: 'transform 0.15s ease, border-color 0.15s ease',
            }}
            onClick={() => onNavigate && onNavigate('pos')}
            title="Start new retail barcode billing"
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div style={{ padding: '10px', backgroundColor: 'rgba(16, 185, 129, 0.15)', borderRadius: '8px', color: '#10b981' }}>
                <ShoppingCart size={28} />
              </div>
              <span style={{ fontSize: '11px', fontWeight: 'bold', padding: '2px 8px', backgroundColor: 'rgba(16, 185, 129, 0.2)', color: '#10b981', borderRadius: '12px' }}>
                NEW BILL
              </span>
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: 'bold', textTransform: 'uppercase', margin: '0 0 6px' }}>
              1. Retail Sale (POS)
            </h3>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0, lineHeight: 1.4 }}>
              Scan barcodes, process items, apply discounts, and complete customer payment.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#10b981', fontWeight: 'bold', fontSize: '12px', marginTop: '16px' }}>
              <span>Launch POS Billing</span>
              <ArrowRight size={14} />
            </div>
          </div>

          {/* Card 2: Sale Return */}
          <div
            className="card"
            style={{
              padding: '24px',
              borderLeft: '4px solid #ef4444',
              backgroundColor: 'var(--surface-color)',
              cursor: 'pointer',
              transition: 'transform 0.15s ease, border-color 0.15s ease',
            }}
            onClick={() => onNavigate && onNavigate('pos-return')}
            title="Process item exchange or refund return"
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div style={{ padding: '10px', backgroundColor: 'rgba(239, 68, 68, 0.15)', borderRadius: '8px', color: '#ef4444' }}>
                <RotateCcw size={28} />
              </div>
              <span style={{ fontSize: '11px', fontWeight: 'bold', padding: '2px 8px', backgroundColor: 'rgba(239, 68, 68, 0.2)', color: '#ef4444', borderRadius: '12px' }}>
                RETURN MODE
              </span>
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: 'bold', textTransform: 'uppercase', margin: '0 0 6px' }}>
              2. Process Sale Return
            </h3>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0, lineHeight: 1.4 }}>
              Accept customer returned items, issue credit notes, or process cash refunds.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#ef4444', fontWeight: 'bold', fontSize: '12px', marginTop: '16px' }}>
              <span>Launch Return Desk</span>
              <ArrowRight size={14} />
            </div>
          </div>

          {/* Card 3: Close Sale */}
          <div
            className="card"
            style={{
              padding: '24px',
              borderLeft: '4px solid #3b82f6',
              backgroundColor: 'var(--surface-color)',
              cursor: 'pointer',
              transition: 'transform 0.15s ease, border-color 0.15s ease',
            }}
            onClick={() => onNavigate && onNavigate('dayclose')}
            title="Submit register shift close & cash count"
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div style={{ padding: '10px', backgroundColor: 'rgba(59, 130, 246, 0.15)', borderRadius: '8px', color: '#3b82f6' }}>
                <Clock size={28} />
              </div>
              <span style={{ fontSize: '11px', fontWeight: 'bold', padding: '2px 8px', backgroundColor: 'rgba(59, 130, 246, 0.2)', color: '#3b82f6', borderRadius: '12px' }}>
                DAY CLOSE
              </span>
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: 'bold', textTransform: 'uppercase', margin: '0 0 6px' }}>
              3. Close Sale (Register Close)
            </h3>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0, lineHeight: 1.4 }}>
              Count drawer cash, enter BNA slip deposit, and submit cashier shift close report.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#3b82f6', fontWeight: 'bold', fontSize: '12px', marginTop: '16px' }}>
              <span>Submit Day Close</span>
              <ArrowRight size={14} />
            </div>
          </div>

          {/* Card 4: Close Sale Return */}
          <div
            className="card"
            style={{
              padding: '24px',
              borderLeft: '4px solid #f59e0b',
              backgroundColor: 'var(--surface-color)',
              cursor: 'pointer',
              transition: 'transform 0.15s ease, border-color 0.15s ease',
            }}
            onClick={() => onNavigate && onNavigate('dayclose')}
            title="Review return vouchers & handover reconciliation"
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div style={{ padding: '10px', backgroundColor: 'rgba(245, 158, 11, 0.15)', borderRadius: '8px', color: '#f59e0b' }}>
                <FileText size={28} />
              </div>
              <span style={{ fontSize: '11px', fontWeight: 'bold', padding: '2px 8px', backgroundColor: 'rgba(245, 158, 11, 0.2)', color: '#f59e0b', borderRadius: '12px' }}>
                HANDOVER
              </span>
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: 'bold', textTransform: 'uppercase', margin: '0 0 6px' }}>
              4. Close Sale Return Summary
            </h3>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0, lineHeight: 1.4 }}>
              Verify daily return vouchers, exchange tallies, and submit handover summary to manager.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#f59e0b', fontWeight: 'bold', fontSize: '12px', marginTop: '16px' }}>
              <span>View Handover Report</span>
              <ArrowRight size={14} />
            </div>
          </div>
        </div>

        {/* Counter Summary Panel */}
        <div className="card">
          <h3 style={{ fontSize: '16px', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '12px' }}>
            Today's Counter Summary & Recent Invoices
          </h3>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Invoice No</th>
                  <th>Cashier Name</th>
                  <th>Payment Mode</th>
                  <th>Time</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {recentTransactions.map((tx, idx) => (
                  <tr key={idx}>
                    <td style={{ fontWeight: 'bold', fontFamily: 'monospace', color: 'var(--accent-lime)' }}>{tx.invoiceNo}</td>
                    <td>{tx.cashier}</td>
                    <td>
                      <span style={{ fontSize: '10px', fontWeight: 'bold', padding: '2px 6px', border: '1px solid var(--border-color)' }}>
                        {tx.mode}
                      </span>
                    </td>
                    <td className="tabular-nums">{tx.time}</td>
                    <td className="monetary" style={{ fontWeight: 'bold' }}>
                      ₹{(tx.total / 100).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

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
