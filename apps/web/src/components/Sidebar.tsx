import React from 'react';
import {
  LayoutDashboard,
  ShoppingCart,
  Clock,
  DollarSign,
  Package,
  ShoppingBag,
  Warehouse as WarehouseIcon,
  Users,
  BarChart3,
  Settings,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { RoleName } from '@afreen-mall/shared-types';
import { AfreenMallLogo } from './AfreenMallLogo';

interface SidebarProps {
  currentScreen: string;
  onNavigate: (screen: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentScreen, onNavigate }) => {
  const { user } = useAuth();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'pos', label: 'POS / Billing', icon: ShoppingCart },
    { id: 'dayclose', label: 'Day Close', icon: Clock },
    { id: 'cash', label: 'Cash Reconciliation', icon: DollarSign },
    { id: 'inventory', label: 'Inventory', icon: Package },
    { id: 'purchasing', label: 'Purchasing', icon: ShoppingBag },
    { id: 'warehouse', label: 'Warehouse', icon: WarehouseIcon },
    { id: 'customers', label: 'Customers (Loyalty)', icon: Users },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
    { id: 'settings', label: 'Settings & Staff', icon: Settings, isSuperAdminOnly: true },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header" style={{ padding: '12px 14px', display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
        <AfreenMallLogo size="small" />
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentScreen === item.id;
          const isSuperAdmin = user?.role === RoleName.SUPER_ADMIN;

          return (
            <div
              key={item.id}
              className={`nav-item ${isActive ? 'active' : ''}`}
              onClick={() => onNavigate(item.id)}
              style={{
                opacity: item.isSuperAdminOnly && !isSuperAdmin ? 0.45 : 1,
              }}
            >
              <Icon size={18} />
              <span style={{ flex: 1 }}>{item.label}</span>
              {item.isSuperAdminOnly && (
                <span
                  style={{
                    fontSize: '9px',
                    padding: '2px 4px',
                    backgroundColor: 'var(--border-color)',
                    color: 'var(--text-muted)',
                  }}
                >
                  ADMIN
                </span>
              )}
            </div>
          );
        })}
      </nav>

      <div style={{ padding: '16px', borderTop: '1px solid var(--border-color)', fontSize: '12px', color: 'var(--text-muted)' }}>
        <div>Single Store Instance</div>
        <div style={{ color: 'var(--accent-lime)', marginTop: '2px', fontWeight: 'bold' }}>Store #AFREEN-001</div>
      </div>
    </aside>
  );
};
