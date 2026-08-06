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
import { SalesScreen } from './screens/SalesScreen';
import { SupplierScreen } from './screens/SupplierScreen';
import { AccountingScreen } from './screens/AccountingScreen';
import { HRMSScreen } from './screens/HRMSScreen';
import { SystemAdminScreen } from './screens/SystemAdminScreen';
import { BusinessIntelligenceScreen } from './screens/BusinessIntelligenceScreen';

import { SecurityGuard } from './components/SecurityGuard';

export const AppContent: React.FC = () => {
  const { user } = useAuth();
  const [authView, setAuthView] = useState<'WELCOME' | 'LOGIN'>('WELCOME');
  const [currentScreen, setCurrentScreen] = useState('dashboard');

  if (!user) {
    if (authView === 'LOGIN') {
      return (
        <SecurityGuard>
          <LoginScreen
            onBackToWelcome={() => setAuthView('WELCOME')}
            onLoginSuccess={() => setCurrentScreen('dashboard')}
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
          {currentScreen === 'suppliers' && <SupplierScreen />}
          {currentScreen === 'accounting' && <AccountingScreen />}
          {currentScreen === 'hrms' && <HRMSScreen />}
          {currentScreen === 'sales' && <SalesScreen />}
          {currentScreen === 'warehouse' && <WarehouseScreen />}
          {currentScreen === 'customers' && <CustomersScreen />}
          {currentScreen === 'reports' && <ReportsScreen />}
          {currentScreen === 'bi' && <BusinessIntelligenceScreen />}
          {currentScreen === 'settings' && <SystemAdminScreen />}
          {currentScreen === 'admin' && <SystemAdminScreen />}
        </main>
      </div>

      {/* Force Password Change Modal on first login */}
      <PasswordChangeModal />
    </div>
    </SecurityGuard>
  );
};
