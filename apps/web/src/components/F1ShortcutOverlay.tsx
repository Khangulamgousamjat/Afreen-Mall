import React from 'react';
import { X, Keyboard } from 'lucide-react';

interface F1ShortcutOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export const F1ShortcutOverlay: React.FC<F1ShortcutOverlayProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const shortcuts = [
    { key: 'F1', desc: 'Show this keyboard shortcut overlay' },
    { key: 'F2', desc: 'Scan 2D / QR code camera scanner' },
    { key: 'F3', desc: 'Repeat last scanned item in cart' },
    { key: 'F4', desc: 'Open quick calculator' },
    { key: 'F5', desc: 'Sale add-on item' },
    { key: 'F7', desc: 'UPI Pay dynamic QR payment' },
    { key: 'F8', desc: 'Save & capture card payment' },
    { key: 'F9', desc: 'Change qty & rate of selected item' },
    { key: 'F10', desc: 'Save invoice & enter checkout' },
    { key: 'Alt + F9', desc: 'Cash @ POS drawer popup' },
    { key: 'Alt + F11', desc: 'Toggle Sale Return mode' },
    { key: 'Alt + F12', desc: 'Issue Credit Note' },
    { key: 'Alt + B', desc: 'Get customer loyalty details' },
    { key: 'Ctrl + F11', desc: 'Restore held invoice' },
    { key: 'Ctrl + F5', desc: 'Reprint Duplicate Bill (Cash Officer / Manager Authorization)' },
    { key: 'Shift + F2', desc: 'Change sale type (Retail/Wholesale)' },
    { key: 'Shift + F8', desc: 'Recover Bill (Card/UPI Paid but Bill Not Generated)' },
    { key: 'Shift + B', desc: 'Open Item Master Detail side panel' },
  ];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: '750px' }} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Keyboard size={24} style={{ color: 'var(--accent-lime)' }} />
            <h3 style={{ fontSize: '18px', fontWeight: 'bold' }}>POS Keyboard Shortcut Reference (F1 Help)</h3>
          </div>
          <button className="btn" onClick={onClose} style={{ padding: '4px 8px' }}>
            <X size={16} />
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', maxHeight: '420px', overflowY: 'auto' }}>
          {shortcuts.map((s, idx) => (
            <div
              key={idx}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '8px 12px',
                backgroundColor: 'var(--bg-color)',
                border: '1px solid var(--border-color)',
              }}
            >
              <span
                style={{
                  fontFamily: 'monospace',
                  fontWeight: 'bold',
                  color: 'var(--accent-lime)',
                  backgroundColor: 'rgba(255,255,255,0.05)',
                  padding: '2px 8px',
                  border: '1px solid var(--border-color)',
                }}
              >
                {s.key}
              </span>
              <span style={{ fontSize: '13px', color: 'var(--text-main)', textAlign: 'right' }}>{s.desc}</span>
            </div>
          ))}
        </div>

        <div style={{ marginTop: '20px', textAlign: 'right' }}>
          <button className="btn btn-primary" onClick={onClose}>
            Close Reference
          </button>
        </div>
      </div>
    </div>
  );
};
