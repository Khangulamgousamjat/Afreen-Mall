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

export const AppContent: React.FC = () => {
  const { user } = useAuth();
  const [authView, setAuthView] = useState<'WELCOME' | 'LOGIN'>('WELCOME');
  const [currentScreen, setCurrentScreen] = useState('dashboard');

  if (!user) {
    if (authView === 'LOGIN') {
      return (
        <LoginScreen
          onBackToWelcome={() => setAuthView('WELCOME')}
          onLoginSuccess={() => setCurrentScreen('dashboard')}
        />
      );
    }
    return <WelcomeScreen onGoToLogin={() => setAuthView('LOGIN')} />;
  }

  return (
    <div className="app-container">
      <Sidebar currentScreen={currentScreen} onNavigate={setCurrentScreen} />

      <div className="main-content">
        <Topbar />
        <main className="page-content">
          {currentScreen === 'dashboard' && <DashboardScreen />}
          {currentScreen === 'pos' && <POSScreen />}
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
  );
};
