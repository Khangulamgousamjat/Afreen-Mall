import React from 'react';
import {
  LayoutDashboard,
  ShoppingCart,
  RotateCcw,
  Clock,
  DollarSign,
  Package,
  ShoppingBag,
  Warehouse as WarehouseIcon,
  Users,
  BarChart3,
  Settings,
  TrendingUp,
  ShieldCheck,
  Activity,
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
  const isCashier = user?.role === RoleName.CASHIER;

  const allNavItems = [
    { id: 'dashboard', label: isCashier ? 'Cashier Command Center' : 'Dashboard', icon: LayoutDashboard },
    { id: 'pos', label: 'Sale (POS Billing)', icon: ShoppingCart },
    { id: 'pos-return', label: 'Sale Return', icon: RotateCcw },
    { id: 'dayclose', label: isCashier ? 'Close Sale & Return' : 'Day Close', icon: Clock },
    { id: 'cash', label: 'Cash Reconciliation', icon: DollarSign },
    { id: 'inventory', label: 'Inventory', icon: Package },
    { id: 'purchasing', label: 'Purchasing', icon: ShoppingBag },
    { id: 'suppliers', label: 'Supplier Management (VRM)', icon: Truck },
    { id: 'sales', label: 'Sales Management', icon: TrendingUp },
    { id: 'accounting', label: 'Accounting & Finance', icon: DollarSign },
    { id: 'hrms', label: 'HRMS (Employees)', icon: Users },
    { id: 'warehouse', label: 'Warehouse', icon: WarehouseIcon },
    { id: 'customers', label: 'Customers (Loyalty)', icon: Users },
    { id: 'bi', label: 'Executive BI & Analytics', icon: Activity },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
    { id: 'settings', label: 'System Administration', icon: ShieldCheck, isSuperAdminOnly: true },
  ];

  // Cashier role sees strictly Sale, Sale Return, and Close Sale & Return
  const navItems = isCashier
    ? allNavItems.filter((i) => ['dashboard', 'pos', 'pos-return', 'dayclose'].includes(i.id))
    : allNavItems;

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
