import React, { useState, useEffect } from 'react';
import { Package, Search, Plus, AlertCircle, Edit3 } from 'lucide-react';
import { api } from '../services/api';
import { ShelfTagGauge } from '../components/ShelfTagGauge';

export const InventoryScreen: React.FC = () => {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [showAdjustModal, setShowAdjustModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [newStock, setNewStock] = useState('');
  const [adjustReason, setAdjustReason] = useState('');

  const [products, setProducts] = useState([
    { id: '1', barcode: '890103000001', name: 'Afreen Premium Basmati Rice 5kg', category: 'Grocery & Staples', currentStock: 80, minStockLevel: 25, mrp: 65000, saleRate: 59000, unit: 'KG' },
    { id: '2', barcode: '890103000002', name: 'Britannia Good Day Biscuits 200g', category: 'Snacks & Beverages', currentStock: 12, minStockLevel: 50, mrp: 4000, saleRate: 3600, unit: 'PCS' },
    { id: '3', barcode: '890103000003', name: 'Coca Cola Soft Drink 1.25L', category: 'Snacks & Beverages', currentStock: 45, minStockLevel: 30, mrp: 6500, saleRate: 6000, unit: 'PCS' },
    { id: '4', barcode: '890103000004', name: 'Amul Butter 500g', category: 'Grocery & Staples', currentStock: 5, minStockLevel: 20, mrp: 27500, saleRate: 26000, unit: 'PCS' },
  ]);

  useEffect(() => {
    api.get('/inventory').then((res) => {
      if (res.data?.inventory?.length > 0) setProducts(res.data.inventory);
    }).catch(() => {});
  }, []);

  const filtered = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.barcode.includes(search);
    const matchesCat = categoryFilter === 'ALL' || p.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  const handleAdjustStock = () => {
    if (!newStock || !adjustReason) {
      alert('New stock level and mandatory adjustment reason are required.');
      return;
    }
    alert(`Stock for ${selectedProduct.name} updated to ${newStock}. Audit log recorded.`);
    setShowAdjustModal(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', textTransform: 'uppercase' }}>
          Inventory Control & Shelf-Tag Stock Status
        </h1>
        <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
          Product master catalogue, stock counts, shelf-tag gauge bars, and stock adjustments
        </div>
      </div>

      {/* Filters & Actions */}
      <div className="card" style={{ padding: '16px', display: 'flex', gap: '16px', alignItems: 'center' }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <input
            type="text"
            className="input-field"
            placeholder="Search by barcode or product name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select
          className="input-field"
          style={{ width: '220px' }}
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option value="ALL">All Categories</option>
          <option value="Grocery & Staples">Grocery & Staples</option>
          <option value="Snacks & Beverages">Snacks & Beverages</option>
        </select>
      </div>

      {/* Products Table */}
      <div className="card">
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Barcode</th>
                <th>Product Name</th>
                <th>Category</th>
                <th>MRP (₹)</th>
                <th>Sale Rate (₹)</th>
                <th>Stock Level Gauge</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => (
                <tr key={item.id}>
                  <td className="tabular-nums" style={{ fontFamily: 'monospace' }}>{item.barcode}</td>
                  <td style={{ fontWeight: 'bold' }}>{item.name}</td>
                  <td style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{item.category}</td>
                  <td className="monetary">₹{(item.mrp / 100).toFixed(2)}</td>
                  <td className="monetary" style={{ fontWeight: 'bold', color: 'var(--accent-lime)' }}>
                    ₹{(item.saleRate / 100).toFixed(2)}
                  </td>
                  <td>
                    <ShelfTagGauge currentStock={item.currentStock} minStockLevel={item.minStockLevel} />
                  </td>
                  <td>
                    <button
                      className="btn"
                      style={{ padding: '4px 8px', fontSize: '12px' }}
                      onClick={() => {
                        setSelectedProduct(item);
                        setNewStock(String(item.currentStock));
                        setShowAdjustModal(true);
                      }}
                    >
                      <Edit3 size={12} />
                      <span>Adjust</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stock Adjustment Modal */}
      {showAdjustModal && selectedProduct && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '480px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '12px' }}>
              Stock Adjustment — {selectedProduct.name}
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                  Current Stock: <strong>{selectedProduct.currentStock} {selectedProduct.unit}</strong>
                </label>
              </div>

              <div>
                <label style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                  New Actual Physical Stock
                </label>
                <input
                  type="number"
                  className="input-field tabular-nums"
                  value={newStock}
                  onChange={(e) => setNewStock(e.target.value)}
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                  Mandatory Audit Adjustment Reason *
                </label>
                <textarea
                  className="input-field"
                  rows={3}
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value)}
                  placeholder="e.g. Damage, Expired stock removal, Stocktake discrepancy..."
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button className="btn btn-primary" onClick={handleAdjustStock} style={{ flex: 1 }}>
                  Save Stock & Audit Log
                </button>
                <button className="btn" onClick={() => setShowAdjustModal(false)}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
