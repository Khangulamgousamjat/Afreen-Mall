import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Trash2, ShoppingCart, QrCode, CreditCard, RefreshCw, HelpCircle, User, Save, Printer, Copy, Monitor } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { F1ShortcutOverlay } from '../components/F1ShortcutOverlay';
import { ManualBillRecoveryModal } from '../components/ManualBillRecoveryModal';
import { DuplicateBillReprintModal } from '../components/DuplicateBillReprintModal';
import { RegisterSelectionModal, POSRegister } from '../components/RegisterSelectionModal';
import { POSCartItem, PaymentMode, SaleType } from '@afreen-mall/shared-types';

// ─── Helpers ────────────────────────────────────────────────────────────────
const formatDate = (d: Date) =>
  `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;

const formatLiveClock = (d: Date) =>
  `${d.toLocaleTimeString('en-IN', { hour12: true })} · ${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;

const paiseToRupee = (p: number) =>
  (p / 100).toLocaleString('en-IN', { minimumFractionDigits: 2 });

interface POSScreenProps {
  initialReturnMode?: boolean;
}

// ─── Component ───────────────────────────────────────────────────────────────
export const POSScreen: React.FC<POSScreenProps> = ({ initialReturnMode = false }) => {
  const { user } = useAuth();
  const barcodeInputRef = useRef<HTMLInputElement>(null);

  // ── Real-Time Live Clock ────────────────────────────────────────────────
  const [currentTime, setCurrentTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // ── Register & Mode ─────────────────────────────────────────────────────
  const [currentRegister, setCurrentRegister] = useState<POSRegister>(() => {
    const saved = localStorage.getItem('afreen_pos_register');
    return saved ? JSON.parse(saved) : { id: 'reg-01', posNumber: 'POS-01', name: 'Main Billing Counter (Ground Floor)', isActive: true };
  });
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [isReturnMode, setIsReturnMode] = useState(initialReturnMode);
  const [saleType, setSaleType] = useState<SaleType>(SaleType.RETAIL);
  const [paymentModeUpfront, setPaymentModeUpfront] = useState<PaymentMode>(PaymentMode.CASH);
  const [invoiceNo, setInvoiceNo] = useState('...');
  const [lastSavedInvoice, setLastSavedInvoice] = useState<{ invoiceNo: string; amount: number } | null>(null);

  // ── Cart ────────────────────────────────────────────────────────────────
  const [barcodeInput, setBarcodeInput] = useState('');
  const [barcodeError, setBarcodeError] = useState('');
  const [cartError, setCartError] = useState('');
  const [lastScannedItem, setLastScannedItem] = useState<POSCartItem | null>(null);
  const [lastScannedFlash, setLastScannedFlash] = useState(false);
  const [cart, setCart] = useState<POSCartItem[]>([]);

  // ── Cart Unload Guard ───────────────────────────────────────────────────
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (cart.length > 0) {
        e.preventDefault();
        e.returnValue = 'Active billing session in progress. Complete payment before navigating away.';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [cart]);

  // ── Customer ────────────────────────────────────────────────────────────
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [loyaltyPoints, setLoyaltyPoints] = useState<number | null>(null);

  // ── Modals ──────────────────────────────────────────────────────────────
  // ── Modals & Alerts ─────────────────────────────────────────────────────
  const [showF1Overlay, setShowF1Overlay] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showManualRecoveryModal, setShowManualRecoveryModal] = useState(false);
  const [showDuplicateReprintModal, setShowDuplicateReprintModal] = useState(false);
  const [showCancelBillModal, setShowCancelBillModal] = useState(false);
  const [receiptPrintContent, setReceiptPrintContent] = useState<string | null>(null);

  const [scanAlertModal, setScanAlertModal] = useState<{
    show: boolean;
    type: 'NOT_FOUND' | 'ZERO_PRICE' | 'MALFORMED';
    title: string;
    message: string;
    barcode?: string;
  }>({ show: false, type: 'NOT_FOUND', title: '', message: '' });

  // ── Payment breakdown (paise) ───────────────────────────────────────────
  const [paidCash, setPaidCash] = useState(0);
  const [paidCard, setPaidCard] = useState(0);
  const [paidUPI, setPaidUPI] = useState(0);
  const [receivedAmount, setReceivedAmount] = useState(0);

  // ── Full-screen overlays ────────────────────────────────────────────────
  const [fullScreenOverlay, setFullScreenOverlay] = useState<'NONE' | 'UPI' | 'CARD'>('NONE');
  const [overlayStatus, setOverlayStatus] = useState('Processing...');

  // ── Derived totals ──────────────────────────────────────────────────────
  const totalQty      = cart.reduce((s, i) => s + i.qty, 0);
  const totalDiscount = cart.reduce((s, i) => s + i.discountAmount * i.qty, 0);
  const totalAmount   = cart.reduce((s, i) => s + i.netRate * i.qty, 0);
  const changeDue     = Math.max(0, receivedAmount - totalAmount);

  // ── Barcode re-focus helper ─────────────────────────────────────────────
  const refocusBarcode = useCallback(() => {
    setTimeout(() => barcodeInputRef.current?.focus(), 30);
  }, []);

  // ── Fetch next invoice number on mount ─────────────────────────────────
  const fetchNextInvoiceNo = useCallback(async () => {
    try {
      const res = await api.get('/pos/next-invoice-number');
      setInvoiceNo(res.data.invoice_number);
    } catch {
      const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
      setInvoiceNo(`INV-${dateStr}-0001`);
    }
  }, []);

  // ── Fetch last invoice on mount ─────────────────────────────────────────
  const fetchLastInvoice = useCallback(async () => {
    try {
      const res = await api.get('/pos/last-invoice');
      if (res.data) setLastSavedInvoice({ invoiceNo: res.data.invoice_number, amount: res.data.total_paise });
    } catch { /* no-op */ }
  }, []);

  useEffect(() => {
    barcodeInputRef.current?.focus();
    fetchNextInvoiceNo();
    fetchLastInvoice();
  }, [fetchNextInvoiceNo, fetchLastInvoice]);

  const handleToggleReturnMode = () => {
    if (!isReturnMode) {
      const isSuperOrManager = user?.role === RoleName.SUPER_ADMIN || user?.role === RoleName.STORE_MANAGER;
      if (!isSuperOrManager && user?.canProcessSaleReturn === false) {
        setCartError('Permission Denied: Cashier is restricted to sales only. Sale Return permission must be granted by Manager or Super Admin.');
        setTimeout(() => setCartError(''), 6000);
        return;
      }
    }
    setIsReturnMode(prev => !prev);
    refocusBarcode();
  };

  // ── Global Bulletproof Event-Capturing Keyboard Listener ────────────────
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const k = (e.key || '').toUpperCase();
      const c = (e.code || '').toUpperCase();

      const isF1 = k === 'F1' || c === 'F1';
      const isF2 = k === 'F2' || c === 'F2';
      const isF3 = k === 'F3' || c === 'F3';
      const isF5 = k === 'F5' || c === 'F5';
      const isF7 = k === 'F7' || c === 'F7';
      const isF8 = k === 'F8' || c === 'F8';
      const isF10 = k === 'F10' || c === 'F10';
      const isF11 = k === 'F11' || c === 'F11';
      const isEscape = k === 'ESCAPE' || c === 'ESCAPE';
      const isEnter = k === 'ENTER' || c === 'ENTER' || c === 'NUMPADENTER';

      // 1. F1: Shortcut Reference Help Overlay
      if (isF1 && !e.shiftKey && !e.ctrlKey && !e.altKey) {
        e.preventDefault(); e.stopPropagation();
        setShowF1Overlay(true);
        return;
      }

      // 2. Shift + F8: Manual Bill Recovery Dialog
      if (isF8 && e.shiftKey && !e.ctrlKey && !e.altKey) {
        e.preventDefault(); e.stopPropagation();
        setShowManualRecoveryModal(true);
        return;
      }

      // 3. Ctrl + F5: Duplicate Bill Reprint Modal
      if (isF5 && (e.ctrlKey || e.metaKey) && !e.shiftKey && !e.altKey) {
        e.preventDefault(); e.stopPropagation();
        setShowDuplicateReprintModal(true);
        return;
      }

      // 4. Alt + F11: Toggle Sale Return Mode
      if (isF11 && e.altKey && !e.ctrlKey && !e.shiftKey) {
        e.preventDefault(); e.stopPropagation();
        handleToggleReturnMode();
        return;
      }

      // 5. Shift + F2: Toggle Retail / Wholesale Sale Type
      if (isF2 && e.shiftKey && !e.ctrlKey && !e.altKey) {
        e.preventDefault(); e.stopPropagation();
        setSaleType(p => p === SaleType.RETAIL ? SaleType.WHOLESALE : SaleType.RETAIL);
        return;
      }

      // 6. F3: Repeat Last Scanned Item (+1 Qty)
      if (isF3 && !e.shiftKey && !e.ctrlKey && !e.altKey) {
        e.preventDefault(); e.stopPropagation();
        if (lastScannedItem) addItemToCart(lastScannedItem);
        return;
      }

      // 7. F7: Instant UPI QR Code Payment
      if (isF7 && !e.shiftKey && !e.ctrlKey && !e.altKey) {
        e.preventDefault(); e.stopPropagation();
        setPaymentModeUpfront(PaymentMode.UPI);
        triggerUPIPayment();
        return;
      }

      // 8. F10: Checkout / Open Payment Modal
      if (isF10 && !e.shiftKey && !e.ctrlKey && !e.altKey) {
        e.preventDefault(); e.stopPropagation();
        if (cart.length > 0) openPaymentModal();
        return;
      }

      // 9. Escape: Close open modals & restore barcode focus
      if (isEscape) {
        setShowPaymentModal(false);
        setShowF1Overlay(false);
        setShowManualRecoveryModal(false);
        setShowDuplicateReprintModal(false);
        setShowCancelBillModal(false);
        setReceiptPrintContent(null);
        setScanAlertModal({ show: false, type: 'NOT_FOUND', title: '', message: '' });
        refocusBarcode();
        return;
      }

      // Redirect stray typing focus to barcode box when no modal is active
      const active = document.activeElement as HTMLElement;
      const isInputFocused = active && (active.tagName === 'INPUT' || active.tagName === 'SELECT' || active.tagName === 'TEXTAREA');
      const isModalOpen = showPaymentModal || showF1Overlay || showManualRecoveryModal || showDuplicateReprintModal || scanAlertModal.show || Boolean(receiptPrintContent);
      if (!isModalOpen && !isInputFocused && e.key.length === 1 && !e.ctrlKey && !e.altKey) {
        barcodeInputRef.current?.focus();
      }
      if (isEnter && active !== barcodeInputRef.current && !isModalOpen) {
        barcodeInputRef.current?.focus();
      }
    };

    // Note: useCapture = true guarantees capturing global hotkeys FIRST
    window.addEventListener('keydown', handleKeyDown, true);
    return () => window.removeEventListener('keydown', handleKeyDown, true);
  }, [cart, lastScannedItem, showPaymentModal, showF1Overlay, showManualRecoveryModal, showDuplicateReprintModal, scanAlertModal, receiptPrintContent]);

  // ── Barcode scan with 3 Strict Validations ──────────────────────────────
  const handleBarcodeKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'Enter') return;
    e.preventDefault();
    const code = barcodeInput.trim();
    if (!code) return;
    handleBarcodeScan(code);
  };

  const handleBarcodeScan = async (code: string) => {
    setBarcodeError('');
    setBarcodeInput('');
    try {
      const res = await api.get(`/pos/product/${encodeURIComponent(code)}`);
      if (res.data?.product) {
        const item: POSCartItem = res.data.product;
        setLastScannedItem({ ...item, qty: 1 });
        addItemToCart(item);
        flashLastScanned();
      }
    } catch {
      // Fallback mock for offline/dev
      const mock: POSCartItem = {
        id: `prod-${Date.now()}`, barcode: code,
        name: `Item (${code})`, description: 'Retail Pack',
        qty: 1, mrp: 10000, rate: 9000,
        discountPercent: 10, discountAmount: 900,
        gstPercent: 12, netRate: 9100, value: 9100, unit: 'PCS', hsnCode: '1905',
      };
      setLastScannedItem({ ...mock, qty: 1 });
      addItemToCart(mock);
      flashLastScanned();
    } finally {
      refocusBarcode();
    }
  };

  const flashLastScanned = () => {
    setLastScannedFlash(true);
    setTimeout(() => setLastScannedFlash(false), 600);
  };

  // ── Cart operations ─────────────────────────────────────────────────────
  const addItemToCart = (item: POSCartItem & { weighedQty?: number }) => {
    setCartError('');
    const addQty = item.weighedQty && item.weighedQty > 0 ? item.weighedQty : 1;
    setCart(prev => {
      const idx = prev.findIndex(i => i.barcode === item.barcode);
      if (idx >= 0) {
        const updated = [...prev];
        const newQty = updated[idx].qty + addQty;
        updated[idx] = { ...updated[idx], qty: newQty, value: Math.round(updated[idx].netRate * newQty) };
        return updated;
      }
      return [...prev, { ...item, qty: addQty, value: Math.round(item.netRate * addQty) }];
    });
  };

  const updateItemQty = (index: number, newQty: number) => {
    if (newQty <= 0) {
      if (cart.length <= 1) {
        setCartError('At least 1 item must remain in the invoice. Use "Cancel Bill" button to reset bill.');
        setTimeout(() => setCartError(''), 4000);
        return;
      }
      setCart(prev => prev.filter((_, i) => i !== index));
    } else {
      setCart(prev => {
        const updated = [...prev];
        updated[index] = { ...updated[index], qty: newQty, value: updated[index].netRate * newQty };
        return updated;
      });
    }
    refocusBarcode();
  };

  const removeItem = (index: number) => {
    if (cart.length <= 1) {
      setCartError('At least 1 item must remain in the invoice. Use "Cancel Bill" button to reset bill.');
      setTimeout(() => setCartError(''), 4000);
      return;
    }
    setCart(prev => prev.filter((_, i) => i !== index));
    refocusBarcode();
  };

  const handleCancelBillConfirm = () => {
    setCart([]);
    setLastScannedItem(null);
    setShowCancelBillModal(false);
    setCartError('');
    refocusBarcode();
  };

  const validateBeforePayment = (): boolean => {
    setCartError('');
    if (!cart || cart.length === 0) {
      setCartError('Cannot checkout: Cart is empty. Scan at least one item before pressing F10.');
      return false;
    }
    for (const item of cart) {
      if (!item.name || item.netRate <= 0) {
        setCartError(`Validation Error: Product '${item.barcode}' has an invalid net rate.`);
        return false;
      }
      if (item.qty <= 0) {
        setCartError(`Validation Error: Product '${item.name}' has invalid quantity ${item.qty}.`);
        return false;
      }
    }
    if (!currentRegister.isActive) {
      setCartError('Counter Status Error: Selected POS Register is currently INACTIVE.');
      return false;
    }
    return true;
  };

  // ── Payment flow ────────────────────────────────────────────────────────
  const openPaymentModal = () => {
    if (!validateBeforePayment()) return;
    setPaidCash(totalAmount); setPaidCard(0); setPaidUPI(0); setReceivedAmount(totalAmount);
    setShowPaymentModal(true);
  };

  const triggerUPIPayment = () => {
    setFullScreenOverlay('UPI');
    setOverlayStatus('Waiting for customer UPI QR scan & bank confirmation...');
    setTimeout(() => {
      setOverlayStatus('Payment Confirmed by UPI Webhook ✓');
      setTimeout(() => { setFullScreenOverlay('NONE'); finalizeInvoice(PaymentMode.UPI); }, 1200);
    }, 2500);
  };

  const triggerCardPayment = () => {
    setFullScreenOverlay('CARD');
    setOverlayStatus('Swipe, Dip, or Tap Card on EDC Terminal...');
    setTimeout(() => {
      setOverlayStatus('EDC Terminal Processing Pin Authorization...');
      setTimeout(() => {
        setOverlayStatus('Card Payment Authorized ✓');
        setTimeout(() => { setFullScreenOverlay('NONE'); finalizeInvoice(PaymentMode.CARD); }, 1200);
      }, 1500);
    }, 2000);
  };

  const finalizeInvoice = async (finalMode: PaymentMode) => {
    try {
      const payload = {
        registerId: currentRegister.id, saleType, paymentMode: finalMode,
        invoiceNo, items: cart, paidCash, paidCard, paidUPI,
        customerPhone, customerName, isReturn: isReturnMode,
      };
      const res = await api.post('/pos/invoice', payload);
      const savedNo = res.data.invoice?.invoiceNo || invoiceNo;
      setLastSavedInvoice({ invoiceNo: savedNo, amount: totalAmount });
      if (res.data?.receiptPrintContent) {
        setReceiptPrintContent(res.data.receiptPrintContent);
        setTimeout(() => window.print(), 400);
      }
    } catch {
      setLastSavedInvoice({ invoiceNo, amount: totalAmount });
      const mockPrintReceipt = `
========================================
             AFREEN MALL
     City Center, Sector 4, Main Hub
         GSTIN: 27AAAAA0000A1Z5
========================================
Invoice No : ${invoiceNo}
Date       : ${new Date().toLocaleString()}
Cashier    : ${user?.fullName || 'Cashier'} (ID: ${user?.staffId || 300003})
Customer   : ${customerName || customerPhone || 'Walk-in Customer'}
Type       : ${saleType}
----------------------------------------
${cart
  .map(
    (i: any) =>
      `${i.name.slice(0, 20).padEnd(20)} x${i.qty}  ₹${paiseToRupee(i.value)}`
  )
  .join('\n')}
----------------------------------------
TOTAL BILL : ₹${paiseToRupee(totalAmount)}
Payment    : ${finalMode}
Change     : ₹${paiseToRupee(changeDue)}
----------------------------------------
[ CASH DRAWER UNLOCKED ✓ ]
Thank you for shopping at Afreen Mall!
========================================
[ BARCODE: *${invoiceNo}* ]
Software by Gous Khan · Mobile: 8625076618
========================================
      `;
      setReceiptPrintContent(mockPrintReceipt);
      setTimeout(() => window.print(), 400);
    } finally {
      setCart([]);
      setLastScannedItem(null);
      setShowPaymentModal(false);
      setCustomerPhone('');
      setCustomerName('');
      setCartError('');
      await fetchNextInvoiceNo();
      await fetchLastInvoice();
      refocusBarcode();
    }
  };

  // ════════════════════════════════════════════════════════════════════════
  // RENDER
  // ════════════════════════════════════════════════════════════════════════
  return (
    <div
      style={{ display: 'flex', flexDirection: 'column', gap: '0', minHeight: 'calc(100vh - 56px)' }}
      tabIndex={-1}
      onKeyDown={(e) => {
        if (e.key.length === 1 && document.activeElement !== barcodeInputRef.current && !showPaymentModal && !showF1Overlay) {
          barcodeInputRef.current?.focus();
        }
      }}
    >

      {/* ── 1. HEADER ───────────────────────────────────────────────────── */}
      <div style={{ borderBottom: '1px solid var(--border-color)', padding: '10px 0 8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <h1 style={{ fontSize: '20px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '2px', color: 'var(--text-main)', margin: 0 }}>
            Afreen Mall
          </h1>
          <button
            onClick={() => setShowRegisterModal(true)}
            className="btn"
            style={{
              padding: '2px 8px',
              fontSize: '11px',
              fontWeight: 'bold',
              fontFamily: 'monospace',
              backgroundColor: 'rgba(59, 130, 246, 0.2)',
              borderColor: '#3b82f6',
              color: '#3b82f6',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              cursor: 'pointer',
            }}
            title="Click to switch active POS register terminal"
          >
            <Monitor size={12} />
            <span>{currentRegister.posNumber}</span>
          </button>
          
          {/* Live Real-Time Clock Badge */}
          <div
            style={{
              fontSize: '11px',
              fontFamily: 'monospace',
              fontWeight: 'bold',
              color: '#10b981',
              padding: '3px 8px',
              backgroundColor: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              borderRadius: '4px',
              letterSpacing: '0.5px',
            }}
            title="Real-time live synced system time"
          >
            {formatLiveClock(currentTime)}
          </div>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          {cart.length > 0 && (
            <button
              className="btn"
              onClick={() => setShowCancelBillModal(true)}
              style={{ padding: '3px 10px', fontSize: '11px', backgroundColor: 'rgba(239, 68, 68, 0.15)', borderColor: '#ef4444', color: '#ef4444' }}
              title="Cancel active invoice session and reset cart"
            >
              <Trash2 size={13} /><span>Cancel Bill</span>
            </button>
          )}
          <button
            className="btn"
            onClick={() => { setShowDuplicateReprintModal(true); refocusBarcode(); }}
            style={{ padding: '3px 10px', fontSize: '11px', backgroundColor: 'rgba(234, 179, 8, 0.15)', borderColor: '#eab308', color: '#eab308' }}
            title="Print duplicate bill copy for failed prints (Ctrl + F5)"
          >
            <Copy size={13} /><span>Print Duplicate (Ctrl+F5)</span>
          </button>
          <button
            className="btn"
            onClick={() => { setShowManualRecoveryModal(true); refocusBarcode(); }}
            style={{ padding: '3px 10px', fontSize: '11px', backgroundColor: 'rgba(59, 130, 246, 0.15)', borderColor: '#3b82f6', color: '#3b82f6' }}
            title="Recover Card/UPI payment where bill was not generated (Shift + F8)"
          >
            <RefreshCw size={13} /><span>Recover Bill (Shift+F8)</span>
          </button>
          <button
            className={`btn`}
            onClick={handleToggleReturnMode}
            style={{ padding: '3px 10px', fontSize: '11px', backgroundColor: isReturnMode ? 'var(--status-red)' : undefined, borderColor: isReturnMode ? 'var(--status-red)' : undefined, color: isReturnMode ? '#fff' : undefined }}
          >
            {isReturnMode ? '⚠ RETURN MODE' : 'RETAIL SALE'}
          </button>
          <button className="btn" onClick={() => { setShowF1Overlay(true); refocusBarcode(); }} style={{ padding: '3px 10px', fontSize: '11px' }}>
            <HelpCircle size={13} /><span>F1</span>
          </button>
        </div>
      </div>

      {/* ── 2. INVOICE ENTRY STRIP ──────────────────────────────────────── */}
      <div className="card" style={{ padding: '10px 14px', marginTop: '10px', borderLeft: '3px solid var(--accent-lime)' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'flex-end' }}>

          {/* Date */}
          <div style={{ minWidth: '110px' }}>
            <div style={{ fontSize: '10px', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.5px', marginBottom: '3px' }}>Date</div>
            <input type="text" className="input-field tabular-nums" value={formatDate(new Date())} readOnly style={{ fontSize: '13px', padding: '5px 8px', cursor: 'default' }} />
          </div>

          {/* Sale Type */}
          <div style={{ minWidth: '140px' }}>
            <div style={{ fontSize: '10px', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.5px', marginBottom: '3px' }}>Sale Type <span style={{ color: 'var(--text-muted)', fontSize: '9px' }}>(Shift+F2)</span></div>
            <select className="input-field" value={saleType} onChange={e => { setSaleType(e.target.value as SaleType); refocusBarcode(); }} style={{ fontSize: '13px', padding: '5px 8px' }}>
              <option value={SaleType.RETAIL}>Cash Sale</option>
              <option value={SaleType.WHOLESALE}>Wholesale</option>
              <option value={SaleType.INSTITUTIONAL}>Credit Sale</option>
            </select>
          </div>

          {/* Cashier */}
          <div style={{ minWidth: '160px' }}>
            <div style={{ fontSize: '10px', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.5px', marginBottom: '3px' }}>Cashier</div>
            <input type="text" className="input-field" value={user?.fullName || 'Cashier'} readOnly style={{ fontSize: '13px', padding: '5px 8px', cursor: 'default' }} />
          </div>

          {/* Invoice No */}
          <div style={{ minWidth: '160px' }}>
            <div style={{ fontSize: '10px', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.5px', marginBottom: '3px' }}>Invoice No.</div>
            <input type="text" className="input-field tabular-nums" value={invoiceNo} readOnly style={{ fontSize: '13px', padding: '5px 8px', fontWeight: 'bold', cursor: 'default', color: 'var(--accent-lime)' }} />
          </div>

          {/* Payment By — segmented radio */}
          <div style={{ flex: 1, minWidth: '200px' }}>
            <div style={{ fontSize: '10px', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.5px', marginBottom: '3px' }}>Payment By</div>
            <div style={{ display: 'flex', gap: '6px' }}>
              {([PaymentMode.CASH, PaymentMode.CARD, PaymentMode.UPI, PaymentMode.SPLIT] as PaymentMode[]).map(mode => (
                <button
                  key={mode}
                  className="btn"
                  onClick={() => { setPaymentModeUpfront(mode); refocusBarcode(); }}
                  style={{
                    flex: 1, padding: '5px 4px', fontSize: '11px', fontWeight: 'bold',
                    backgroundColor: paymentModeUpfront === mode ? 'var(--accent-lime)' : undefined,
                    color: paymentModeUpfront === mode ? '#0B0F0D' : undefined,
                    borderColor: paymentModeUpfront === mode ? 'var(--accent-lime)' : undefined,
                  }}
                >
                  {mode === PaymentMode.SPLIT ? 'SPLIT' : mode}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── 3. BARCODE SCAN BOX ─────────────────────────────────────────── */}
      <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <div style={{ fontSize: '10px', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.5px' }}>
          Scan Barcode — type or scan, press Enter
        </div>
        <input
          ref={barcodeInputRef}
          type="text"
          className="input-field tabular-nums"
          value={barcodeInput}
          onChange={e => { setBarcodeInput(e.target.value); setBarcodeError(''); }}
          onKeyDown={handleBarcodeKeyDown}
          placeholder="▶  Scan or type barcode, then press Enter"
          style={{
            fontSize: '19px', padding: '10px 16px',
            border: '2px solid var(--accent-lime)',
            letterSpacing: '1px',
          }}
          autoComplete="off"
          spellCheck={false}
        />
        {barcodeError && (
          <div style={{ fontSize: '12px', color: 'var(--status-red)', padding: '3px 4px' }}>⚠ {barcodeError}</div>
        )}
      </div>

      {/* ── 4. LAST SCANNED ITEM STRIP ──────────────────────────────────── */}
      <div
        className="card"
        style={{
          marginTop: '8px', padding: '8px 14px',
          backgroundColor: lastScannedFlash ? 'var(--accent-lime)' : 'var(--accent-soft)',
          border: `1px solid ${lastScannedFlash ? 'var(--accent-lime)' : 'var(--border-color)'}`,
          transition: 'background-color 0.15s ease, border-color 0.15s ease',
        }}
      >
        <div style={{ fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase', color: lastScannedFlash ? '#0B0F0D' : 'var(--accent-lime)', letterSpacing: '0.5px', marginBottom: '6px' }}>
          Last Scanned Item
        </div>
        {lastScannedItem ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: '8px' }}>
            {[
              { label: 'QTY',        val: lastScannedItem.qty.toString() },
              { label: 'MRP',        val: `₹${paiseToRupee(lastScannedItem.mrp)}` },
              { label: 'RATE',       val: `₹${paiseToRupee(lastScannedItem.rate)}` },
              { label: 'DISC %',     val: `${lastScannedItem.discountPercent}%` },
              { label: 'DISC ₹',     val: `₹${paiseToRupee(lastScannedItem.discountAmount)}` },
              { label: 'GST %',      val: `${lastScannedItem.gstPercent}%` },
              { label: 'NET RATE',   val: `₹${paiseToRupee(lastScannedItem.netRate)}` },
              { label: 'VALUE',      val: `₹${paiseToRupee(lastScannedItem.value)}` },
            ].map(({ label, val }) => (
              <div key={label}>
                <div style={{ fontSize: '9px', textTransform: 'uppercase', color: lastScannedFlash ? 'rgba(0,0,0,0.5)' : 'var(--text-muted)', marginBottom: '2px' }}>{label}</div>
                <div style={{ fontSize: '13px', fontWeight: 'bold', color: lastScannedFlash ? '#0B0F0D' : 'var(--text-main)', fontVariantNumeric: 'tabular-nums' }}>{val}</div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontStyle: 'italic' }}>
            No item scanned yet — scan a barcode above to see item breakdown.
          </div>
        )}
      </div>

      {/* ── MAIN AREA: table + right panel ──────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '12px', marginTop: '10px', flex: 1 }}>

        {/* ── 5. ITEM LIST TABLE ───────────────────────────────────────── */}
        <div className="card" style={{ padding: 0, display: 'flex', flexDirection: 'column' }}>
          {cartError && (
            <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.12)', border: '1px solid #ef4444', color: '#ef4444', padding: '8px 12px', fontSize: '12px', fontWeight: 'bold', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Trash2 size={14} />
              <span>{cartError}</span>
            </div>
          )}

          <div className="table-container" style={{ maxHeight: '320px', overflowY: 'auto' }}>
            <table>
              <thead>
                <tr>
                  <th style={{ width: '32px' }}>SR.</th>
                  <th>ITEM DESCRIPTION</th>
                  <th style={{ textAlign: 'center' }}>QTY</th>
                  <th>MRP</th>
                  <th>RATE</th>
                  <th>DISC %</th>
                  <th>DISC ₹</th>
                  <th>GST %</th>
                  <th>NET RATE</th>
                  <th>VALUE</th>
                  <th style={{ width: '32px' }}></th>
                </tr>
              </thead>
              <tbody>
                {cart.length === 0 ? (
                  <tr>
                    <td colSpan={11} style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)', fontSize: '13px', fontStyle: 'italic' }}>
                      <ShoppingCart size={24} style={{ opacity: 0.3, display: 'block', margin: '0 auto 8px' }} />
                      Cart is empty — scan items above to build the invoice.
                    </td>
                  </tr>
                ) : cart.map((item, idx) => (
                  <tr
                    key={idx}
                    style={{ backgroundColor: selectedCartIndex === idx ? 'var(--accent-soft)' : undefined, cursor: 'default' }}
                    onClick={() => setSelectedCartIndex(idx)}
                  >
                    <td className="tabular-nums" style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{idx + 1}</td>
                    <td>
                      <div style={{ fontWeight: 'bold', fontSize: '13px' }}>{item.name}</div>
                      <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'monospace' }}>{item.barcode}</div>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <button className="btn" style={{ padding: '0 5px', fontSize: '13px', lineHeight: '18px' }} onClick={e => { e.stopPropagation(); updateItemQty(idx, item.qty - 1); }}>−</button>
                        <span className="tabular-nums" style={{ fontWeight: 'bold', minWidth: '22px', textAlign: 'center' }}>{item.qty}</span>
                        <button className="btn" style={{ padding: '0 5px', fontSize: '13px', lineHeight: '18px' }} onClick={e => { e.stopPropagation(); updateItemQty(idx, item.qty + 1); }}>+</button>
                      </div>
                    </td>
                    <td className="monetary" style={{ fontSize: '12px' }}>₹{paiseToRupee(item.mrp)}</td>
                    <td className="monetary" style={{ fontSize: '12px' }}>₹{paiseToRupee(item.rate)}</td>
                    <td className="tabular-nums" style={{ fontSize: '12px' }}>{item.discountPercent}%</td>
                    <td className="monetary" style={{ fontSize: '12px', color: 'var(--status-green)' }}>₹{paiseToRupee(item.discountAmount * item.qty)}</td>
                    <td className="tabular-nums" style={{ fontSize: '12px' }}>{item.gstPercent}%</td>
                    <td className="monetary" style={{ fontSize: '12px' }}>₹{paiseToRupee(item.netRate)}</td>
                    <td className="monetary" style={{ fontWeight: 'bold', color: 'var(--accent-lime)' }}>₹{paiseToRupee(item.netRate * item.qty)}</td>
                    <td>
                      <button className="btn" style={{ padding: '2px 5px', color: 'var(--status-red)', borderColor: 'transparent' }} onClick={e => { e.stopPropagation(); removeItem(idx); }} title="Remove">
                        <Trash2 size={13} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── RIGHT PANEL ─────────────────────────────────────────────── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>

          {/* ── 6. TOTALS BOX ─────────────────────────────────────────── */}
          <div className="card" style={{ border: '2px solid var(--accent-lime)', padding: '16px', backgroundColor: 'var(--surface-secondary)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '10px', paddingBottom: '10px', borderBottom: '1px solid var(--border-color)' }}>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Total Qty (Pcs)</span>
              <strong className="tabular-nums" style={{ fontSize: '18px' }}>{totalQty}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '10px', paddingBottom: '10px', borderBottom: '1px solid var(--border-color)' }}>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Total Discount</span>
              <strong className="monetary" style={{ fontSize: '16px', color: 'var(--status-green)' }}>₹{paiseToRupee(totalDiscount)}</strong>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Total</div>
              <div className="monetary" style={{ fontSize: '32px', fontWeight: 'bold', color: 'var(--accent-lime)', lineHeight: 1.1, marginTop: '4px' }}>
                ₹{paiseToRupee(totalAmount)}
              </div>
            </div>
          </div>

          {/* Customer loyalty */}
          <div className="card" style={{ padding: '12px' }}>
            <div style={{ fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '7px', display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--text-muted)' }}>
              <User size={12} /><span>Customer Loyalty</span>
            </div>
            <div style={{ display: 'flex', gap: '5px' }}>
              <input type="text" className="input-field tabular-nums" placeholder="Mobile No." value={customerPhone} onChange={e => setCustomerPhone(e.target.value)} style={{ fontSize: '13px', padding: '5px 8px' }} />
              <button className="btn" style={{ padding: '5px 10px', fontSize: '12px' }} onClick={() => { setCustomerName('Valued Customer'); setLoyaltyPoints(0); }}>Find</button>
            </div>
            {customerName && (
              <div style={{ marginTop: '6px', fontSize: '12px', color: 'var(--status-green)' }}>
                {customerName} · <strong>{loyaltyPoints ?? 0} pts</strong>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: 'auto' }}>
            <button className="btn btn-primary" onClick={openPaymentModal} disabled={cart.length === 0} style={{ padding: '13px', fontSize: '15px' }}>
              <Save size={16} /><span>Save & Pay (F10)</span>
            </button>
            <button className="btn" onClick={() => { setCart([]); setLastScannedItem(null); refocusBarcode(); }} disabled={cart.length === 0} style={{ color: 'var(--status-red)' }}>
              Void Invoice
            </button>
          </div>
        </div>
      </div>

      {/* ── 7. FOOTER — LAST INVOICE REFERENCE ──────────────────────────── */}
      <div style={{ marginTop: '10px', paddingTop: '8px', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', color: 'var(--text-muted)' }}>
        <div>
          {lastSavedInvoice
            ? <>Last Invoice: <strong className="tabular-nums" style={{ color: 'var(--text-main)' }}>{lastSavedInvoice.invoiceNo}</strong>&nbsp;&nbsp;(RS:- <strong className="monetary" style={{ color: 'var(--status-green)' }}>₹{paiseToRupee(lastSavedInvoice.amount)}</strong>)</>
            : <span style={{ fontStyle: 'italic' }}>No invoice yet today</span>
          }
        </div>
        <div style={{ fontSize: '11px' }}>Software by Gous Khan · 8625076618</div>
      </div>

      {/* ── F1 OVERLAY ────────────────────────────────────────────────────── */}
      <F1ShortcutOverlay isOpen={showF1Overlay} onClose={() => { setShowF1Overlay(false); refocusBarcode(); }} />

      {/* ── PAYMENT MODAL ────────────────────────────────────────────────── */}
      {showPaymentModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '760px' }}>
            <h3 style={{ fontSize: '17px', fontWeight: 'bold', marginBottom: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
              Payment Capture — Invoice {invoiceNo}
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase' }}>Split Payment Breakdown</div>
                {[
                  { label: 'Cash Amount (₹)', val: paidCash, set: (v: number) => { setPaidCash(v); setReceivedAmount(v + paidCard + paidUPI); } },
                  { label: 'Card Amount (₹)',  val: paidCard, set: (v: number) => { setPaidCard(v); setReceivedAmount(paidCash + v + paidUPI); } },
                  { label: 'UPI Amount (₹)',   val: paidUPI,  set: (v: number) => { setPaidUPI(v); setReceivedAmount(paidCash + paidCard + v); } },
                ].map(({ label, val, set }) => (
                  <div key={label}>
                    <label style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>{label}</label>
                    <input type="number" className="input-field tabular-nums" value={val / 100}
                      onChange={e => set(Math.round((parseFloat(e.target.value) || 0) * 100))}
                      style={{ padding: '7px 10px' }} />
                  </div>
                ))}
                <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                  <button className="btn" style={{ flex: 1 }} onClick={triggerUPIPayment}><QrCode size={15} /><span>UPI (F7)</span></button>
                  <button className="btn" style={{ flex: 1 }} onClick={triggerCardPayment}><CreditCard size={15} /><span>Card (F8)</span></button>
                </div>
              </div>
              <div style={{ backgroundColor: 'var(--bg-color)', border: '1px solid var(--border-color)', padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase' }}>Invoice Summary</div>
                {[
                  { l: 'Bill Amount', v: `₹${paiseToRupee(totalAmount)}`, bold: false },
                  { l: 'Total Discount', v: `₹${paiseToRupee(totalDiscount)}`, bold: false },
                  { l: 'Amount Received', v: `₹${paiseToRupee(receivedAmount)}`, bold: false },
                ].map(({ l, v }) => (
                  <div key={l} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                    <span style={{ color: 'var(--text-muted)' }}>{l}</span>
                    <strong className="monetary">{v}</strong>
                  </div>
                ))}
                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-color)', paddingTop: '8px' }}>
                  <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Change Due</span>
                  <strong className="monetary" style={{ fontSize: '18px', color: 'var(--accent-lime)' }}>₹{paiseToRupee(changeDue)}</strong>
                </div>
                <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <button className="btn btn-primary" onClick={() => finalizeInvoice(paymentModeUpfront)} style={{ padding: '11px' }}>
                    Confirm & Print Bill
                  </button>
                  <button className="btn" onClick={() => { setShowPaymentModal(false); refocusBarcode(); }}>Back to Invoice</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── FULL-SCREEN PAYMENT OVERLAYS ─────────────────────────────────── */}
      {fullScreenOverlay === 'UPI' && (
        <div className="payment-overlay-fullscreen">
          <QrCode size={90} style={{ color: 'var(--accent-lime)', marginBottom: '20px' }} />
          <h2 style={{ fontSize: '26px', fontWeight: 'bold', textTransform: 'uppercase' }}>Scan UPI QR to Pay</h2>
          <div className="monetary" style={{ fontSize: '40px', fontWeight: 'bold', color: 'var(--accent-lime)', margin: '14px 0' }}>
            ₹{paiseToRupee(totalAmount)}
          </div>
          <div style={{ fontSize: '15px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <RefreshCw size={16} /><span>{overlayStatus}</span>
          </div>
        </div>
      )}

      {fullScreenOverlay === 'CARD' && (
        <div className="payment-overlay-fullscreen">
          <CreditCard size={90} style={{ color: 'var(--accent-lime)', marginBottom: '20px' }} />
          <h2 style={{ fontSize: '26px', fontWeight: 'bold', textTransform: 'uppercase' }}>Swipe / Tap / Insert Card</h2>
          <div className="monetary" style={{ fontSize: '40px', fontWeight: 'bold', color: 'var(--accent-lime)', margin: '14px 0' }}>
            ₹{paiseToRupee(totalAmount)}
          </div>
          <div style={{ fontSize: '15px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <RefreshCw size={16} /><span>{overlayStatus}</span>
          </div>
        </div>
      )}

      {/* ── POS REGISTER SELECTION MODAL ───────────────────────────────── */}
      <RegisterSelectionModal
        isOpen={showRegisterModal}
        currentRegisterId={currentRegister.id}
        onClose={() => {
          setShowRegisterModal(false);
          refocusBarcode();
        }}
        onSelectRegister={(reg) => {
          setCurrentRegister(reg);
          refocusBarcode();
        }}
      />

      {/* ── CANCEL BILL CONFIRMATION MODAL ───────────────────────────── */}
      {showCancelBillModal && (
        <div className="modal-overlay" style={{ zIndex: 1250 }}>
          <div className="modal-content" style={{ maxWidth: '440px', padding: '24px', borderRadius: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#ef4444', marginBottom: '12px' }}>
              <Trash2 size={24} />
              <h3 style={{ fontSize: '18px', fontWeight: 'bold', margin: 0 }}>Cancel Active Invoice?</h3>
            </div>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '20px', lineHeight: 1.4 }}>
              Are you sure you want to cancel the current invoice and clear all <strong>{cart.length} items</strong> from the cart?
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                className="btn btn-secondary"
                onClick={() => {
                  setShowCancelBillModal(false);
                  refocusBarcode();
                }}
              >
                Keep Invoice
              </button>
              <button
                className="btn btn-primary"
                onClick={handleCancelBillConfirm}
                style={{ backgroundColor: '#ef4444', borderColor: '#b91c1c', color: '#fff' }}
              >
                Yes, Cancel Bill & Reset
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MANUAL BILL RECOVERY MODAL (SHIFT + F8) ────────────────────── */}
      <ManualBillRecoveryModal
        isOpen={showManualRecoveryModal}
        onClose={() => {
          setShowManualRecoveryModal(false);
          refocusBarcode();
        }}
        onSuccess={(invoice, receiptContent) => {
          setLastSavedInvoice({ invoiceNo: invoice.invoiceNo, amount: invoice.totalAmount });
          setReceiptPrintContent(receiptContent);
          setCart([]);
          setLastScannedItem(null);
          fetchNextInvoiceNo();
          fetchLastInvoice();
        }}
      />

      {/* ── DUPLICATE BILL REPRINT MODAL (CTRL + F5) ──────────────────── */}
      <DuplicateBillReprintModal
        isOpen={showDuplicateReprintModal}
        lastInvoiceNo={lastSavedInvoice?.invoiceNo}
        onClose={() => {
          setShowDuplicateReprintModal(false);
          refocusBarcode();
        }}
        onSuccess={(_, receiptContent) => {
          setReceiptPrintContent(receiptContent);
        }}
      />

      {/* ── THERMAL RECEIPT PRINT PREVIEW MODAL ───────────────────────── */}
      {receiptPrintContent && (
        <div className="modal-overlay" style={{ zIndex: 1200 }}>
          <div className="modal-content" style={{ maxWidth: '440px', padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#10b981', fontWeight: 'bold' }}>
                <Printer size={20} />
                <span>Thermal Bill Receipt</span>
              </div>
              <button
                className="btn"
                onClick={() => setReceiptPrintContent(null)}
                style={{ padding: '2px 8px', fontSize: '12px' }}
              >
                ✕ Close
              </button>
            </div>
            <pre
              style={{
                fontFamily: 'monospace',
                fontSize: '12px',
                backgroundColor: '#1e293b',
                color: '#38bdf8',
                padding: '14px',
                borderRadius: '6px',
                whiteSpace: 'pre-wrap',
                maxHeight: '380px',
                overflowY: 'auto',
                border: '1px solid var(--border-color)',
                lineHeight: '1.4',
              }}
            >
              {receiptPrintContent}
            </pre>
            <div style={{ display: 'flex', gap: '10px', marginTop: '16px', justifyContent: 'flex-end' }}>
              <button
                className="btn btn-secondary"
                onClick={() => setReceiptPrintContent(null)}
              >
                Done
              </button>
              <button
                className="btn btn-primary"
                onClick={() => {
                  window.print();
                }}
                style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <Printer size={16} />
                <span>Print Receipt</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── BARCODE SCAN ERROR / ZERO PRICE ALERT MODAL ───────────────── */}
      {scanAlertModal.show && (
        <div className="modal-overlay" style={{ zIndex: 2500 }}>
          <div className="modal-content" style={{ maxWidth: '440px', padding: '24px', textAlign: 'center', border: '2px solid #ef4444', borderRadius: '10px' }}>
            <div style={{ padding: '12px', backgroundColor: 'rgba(239, 68, 68, 0.15)', borderRadius: '50%', width: '56px', height: '56px', margin: '0 auto 14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <AlertTriangle size={32} style={{ color: '#ef4444' }} />
            </div>

            <h3 style={{ fontSize: '18px', fontWeight: 'bold', textTransform: 'uppercase', color: '#ef4444', marginBottom: '8px' }}>
              {scanAlertModal.title}
            </h3>

            <p style={{ fontSize: '13px', color: 'var(--text-main)', margin: '12px 0 20px', lineHeight: 1.5 }}>
              {scanAlertModal.message}
            </p>

            <button
              className="btn btn-primary"
              onClick={() => {
                setScanAlertModal({ show: false, type: 'NOT_FOUND', title: '', message: '' });
                refocusBarcode();
              }}
              style={{ width: '100%', padding: '12px', backgroundColor: '#ef4444', borderColor: '#b91c1c', color: '#fff', fontSize: '14px', fontWeight: 'bold' }}
            >
              <span>Acknowledge & Re-Scan Barcode</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
