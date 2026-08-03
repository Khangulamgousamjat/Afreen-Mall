import React, { useState } from 'react';
import { BarChart3, FileSpreadsheet, ShieldCheck, DollarSign, Calendar } from 'lucide-react';

export const ReportsScreen: React.FC = () => {
  const [reportTab, setReportTab] = useState<'SALES' | 'GST' | 'AUDIT'>('SALES');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', textTransform: 'uppercase' }}>
          Operational Reports & Audit Intelligence
        </h1>
        <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
          GST tax filings, daily sales trends, cash reconciliation history, and audit trail logs
        </div>
      </div>

      <div style={{ display: 'flex', gap: '12px' }}>
        <button
          className={`btn ${reportTab === 'SALES' ? 'btn-primary' : ''}`}
          onClick={() => setReportTab('SALES')}
        >
          DAILY / MONTHLY SALES
        </button>
        <button
          className={`btn ${reportTab === 'GST' ? 'btn-primary' : ''}`}
          onClick={() => setReportTab('GST')}
        >
          GST TAX SUMMARY (CGST/SGST)
        </button>
        <button
          className={`btn ${reportTab === 'AUDIT' ? 'btn-primary' : ''}`}
          onClick={() => setReportTab('AUDIT')}
        >
          IMMUTABLE AUDIT TRAIL LOGS
        </button>
      </div>

      {reportTab === 'SALES' && (
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 'bold', textTransform: 'uppercase', margin: 0 }}>
              Daily Sales & Cash Deposit Breakdown
            </h3>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', backgroundColor: 'var(--bg-card-hover)', padding: '4px 8px', borderRadius: '4px', border: '1px solid var(--border-color)' }}>
              Note: BNA Machine Deposits are classified as <strong>CASH SALES</strong> (Independent of Card & UPI)
            </span>
          </div>

          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Total Invoices</th>
                  <th>Counter Cash (₹)</th>
                  <th>BNA Machine Cash (₹)</th>
                  <th>Total Cash Sales (₹)</th>
                  <th>Card Sales (₹)</th>
                  <th>UPI Sales (₹)</th>
                  <th>Total Revenue (₹)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="tabular-nums">2026-07-28 (Today)</td>
                  <td className="tabular-nums">42</td>
                  <td className="monetary">₹25,000.00</td>
                  <td className="monetary" style={{ color: '#10b981', fontWeight: 'bold' }}>₹20,000.00</td>
                  <td className="monetary" style={{ fontWeight: 'bold', color: 'var(--accent-lime)' }}>₹45,000.00</td>
                  <td className="monetary">₹22,000.00</td>
                  <td className="monetary">₹18,000.00</td>
                  <td className="monetary" style={{ fontWeight: 'bold', color: 'var(--accent-lime)' }}>₹85,000.00</td>
                </tr>
                <tr>
                  <td className="tabular-nums">2026-07-27</td>
                  <td className="tabular-nums">58</td>
                  <td className="monetary">₹32,000.00</td>
                  <td className="monetary" style={{ color: '#10b981', fontWeight: 'bold' }}>₹30,000.00</td>
                  <td className="monetary" style={{ fontWeight: 'bold' }}>₹62,000.00</td>
                  <td className="monetary">₹34,000.00</td>
                  <td className="monetary">₹28,000.00</td>
                  <td className="monetary" style={{ fontWeight: 'bold' }}>₹1,24,000.00</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {reportTab === 'GST' && (
        <div className="card">
          <h3 style={{ fontSize: '16px', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '16px' }}>
            GST Summary Filing Data (July 2026)
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '20px' }}>
            <div className="card" style={{ padding: '16px' }}>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Total Taxable Value</div>
              <div style={{ fontSize: '22px', fontWeight: 'bold', marginTop: '4px' }} className="monetary">₹1,86,607.14</div>
            </div>
            <div className="card" style={{ padding: '16px' }}>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Central GST (CGST)</div>
              <div style={{ fontSize: '22px', fontWeight: 'bold', marginTop: '4px', color: 'var(--accent-lime)' }} className="monetary">₹11,196.43</div>
            </div>
            <div className="card" style={{ padding: '16px' }}>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>State GST (SGST)</div>
              <div style={{ fontSize: '22px', fontWeight: 'bold', marginTop: '4px', color: 'var(--accent-lime)' }} className="monetary">₹11,196.43</div>
            </div>
          </div>
        </div>
      )}

      {reportTab === 'AUDIT' && (
        <div className="card">
          <h3 style={{ fontSize: '16px', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '16px' }}>
            System Audit Trail Logs
          </h3>

          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>Action</th>
                  <th>Performed By</th>
                  <th>Staff ID</th>
                  <th>Reason / Details</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="tabular-nums">2026-07-28 20:25:10</td>
                  <td style={{ fontWeight: 'bold', color: 'var(--accent-lime)' }}>ACCOUNTANT_APPROVE_DAY_CLOSE</td>
                  <td>Priya Patel</td>
                  <td className="tabular-nums">300002</td>
                  <td>Daily consolidated cash report officially approved by Accountant.</td>
                </tr>
                <tr>
                  <td className="tabular-nums">2026-07-28 19:40:02</td>
                  <td style={{ fontWeight: 'bold', color: 'var(--status-amber)' }}>OVERRIDE_CASH_REPORT</td>
                  <td>Rajesh Sharma</td>
                  <td className="tabular-nums">300001</td>
                  <td>Corrected BNA deposit count after physical recount with cashier.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
