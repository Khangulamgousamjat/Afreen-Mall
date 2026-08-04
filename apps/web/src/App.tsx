import React, { useState } from 'react';
import { useAuth } from './context/AuthContext';
import { Sidebar } from './components/Sidebar';
import { Topbar } from './components/Topbar';
import { PasswordChangeModal } from './components/PasswordChangeModal';

import { WelcomeScreen } from './screens/WelcomeScreen';
import { LoginScreen } from './screens/LoginScreen';
import { DashboardScreen } from './screens/DashboardScreen';
import { POSScreen } from './screens/POSScreen';
import { DayCloseScreen } from './screens/DayCloseScreen';
import { CashReconciliationScreen } from './screens/CashReconciliationScreen';
import { InventoryScreen } from './screens/InventoryScreen';
import { PurchasingScreen } from './screens/PurchasingScreen';
import { WarehouseScreen } from './screens/WarehouseScreen';
import { CustomersScreen } from './screens/CustomersScreen';
import { ReportsScreen } from './screens/ReportsScreen';
import { SettingsScreen } from './screens/SettingsScreen';

import { SecurityGuard } from './components/SecurityGuard';
import { useIdleTimer } from './hooks/useIdleTimer';
import { ShieldAlert, LogOut } from 'lucide-react';

export const AppContent: React.FC = () => {
  const { user, logout } = useAuth();
  const [authView, setAuthView] = useState<'WELCOME' | 'LOGIN'>('WELCOME');
  const [currentScreen, setCurrentScreen] = useState('dashboard');
  const [showIdleModal, setShowIdleModal] = useState(false);

  const handleIdleLogout = useCallback(() => {
    logout();
    setShowIdleModal(true);
  }, [logout]);

  // 15-Minute Inactivity Auto-Logout Security Watchdog
  useIdleTimer({
    timeoutMs: 15 * 60 * 1000,
    onIdle: handleIdleLogout,
    enabled: Boolean(user),
  });

  if (!user) {
    if (authView === 'LOGIN' || showIdleModal) {
      return (
        <SecurityGuard>
          {showIdleModal && (
            <div className="modal-overlay" style={{ zIndex: 3000 }}>
              <div className="modal-content" style={{ maxWidth: '440px', padding: '24px', textAlign: 'center', borderRadius: '12px' }}>
                <ShieldAlert size={48} style={{ color: '#ef4444', margin: '0 auto 12px' }} />
                <h3 style={{ fontSize: '18px', fontWeight: 'bold', textTransform: 'uppercase', color: '#ef4444' }}>
                  Security Session Expired
                </h3>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: '12px 0 20px', lineHeight: 1.4 }}>
                  You were automatically logged out due to <strong>15 minutes of inactivity</strong>. To protect operational data, please sign in again with your 6-digit Staff ID.
                </p>
                <button
                  className="btn btn-primary"
                  style={{ width: '100%', padding: '12px' }}
                  onClick={() => {
                    setShowIdleModal(false);
                    setAuthView('LOGIN');
                  }}
                >
                  <LogOut size={16} />
                  <span>Re-Authenticate & Sign In</span>
                </button>
              </div>
            </div>
          )}
          <LoginScreen
            onBackToWelcome={() => { setShowIdleModal(false); setAuthView('WELCOME'); }}
            onLoginSuccess={() => { setShowIdleModal(false); setCurrentScreen('dashboard'); }}
          />
        </SecurityGuard>
      );
    }
    return (
      <SecurityGuard>
        <WelcomeScreen onGoToLogin={() => setAuthView('LOGIN')} />
      </SecurityGuard>
    );
  }

  return (
    <SecurityGuard>
      <div className="app-container">
      <Sidebar currentScreen={currentScreen} onNavigate={setCurrentScreen} />

      <div className="main-content">
        <Topbar />
        <main className="page-content">
          {currentScreen === 'dashboard' && <DashboardScreen onNavigate={setCurrentScreen} />}
          {currentScreen === 'pos' && <POSScreen initialReturnMode={false} />}
          {currentScreen === 'pos-return' && <POSScreen initialReturnMode={true} />}
          {currentScreen === 'dayclose' && <DayCloseScreen />}
          {currentScreen === 'cash' && <CashReconciliationScreen />}
          {currentScreen === 'inventory' && <InventoryScreen />}
          {currentScreen === 'purchasing' && <PurchasingScreen />}
          {currentScreen === 'warehouse' && <WarehouseScreen />}
          {currentScreen === 'customers' && <CustomersScreen />}
          {currentScreen === 'reports' && <ReportsScreen />}
          {currentScreen === 'settings' && <SettingsScreen />}
        </main>
      </div>

      {/* Force Password Change Modal on first login */}
      <PasswordChangeModal />
    </div>
    </SecurityGuard>
  );
};
