import React from 'react';

interface ShelfTagGaugeProps {
  currentStock: number;
  minStockLevel: number;
}

export const ShelfTagGauge: React.FC<ShelfTagGaugeProps> = ({ currentStock, minStockLevel }) => {
  const percentage = Math.min(100, Math.round((currentStock / (minStockLevel || 10)) * 100));

  let colorClass = 'green';
  if (percentage < 40) colorClass = 'red';
  else if (percentage < 85) colorClass = 'amber';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', width: '120px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)' }}>
        <span>Stock: {currentStock}</span>
        <span>Min: {minStockLevel}</span>
      </div>
      <div className="shelf-tag-gauge">
        <div className={`shelf-tag-fill ${colorClass}`} style={{ width: `${percentage}%` }} />
      </div>
    </div>
  );
};
