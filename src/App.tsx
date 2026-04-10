import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useStore } from './store/useStore';
import { useEffect } from 'react';

// Pages
import { Landing } from './pages/Landing';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { Onboarding } from './pages/Onboarding';
import { PaymentGateway } from './pages/PaymentGateway';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { Overview } from './pages/dashboard/Overview';
import { Inventory } from './pages/dashboard/Inventory';
import { Billing } from './pages/dashboard/Billing';
import { Expenses } from './pages/dashboard/Expenses';
import { StoreBuilder } from './pages/dashboard/StoreBuilder';
import { Settings } from './pages/dashboard/Settings';
import { AIInsights } from './pages/dashboard/AIInsights';
import { AdminLogin } from './pages/admin/AdminLogin';
import { AdminDashboard } from './pages/admin/AdminDashboard';

export default function App() {
  const { theme } = useStore();

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/payment" element={<PaymentGateway />} />
        
        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />

        {/* Protected Dashboard Routes */}
        <Route path="/dashboard" element={<DashboardLayout><Overview /></DashboardLayout>} />
        <Route path="/dashboard/inventory" element={<DashboardLayout><Inventory /></DashboardLayout>} />
        <Route path="/dashboard/billing" element={<DashboardLayout><Billing /></DashboardLayout>} />
        <Route path="/dashboard/expenses" element={<DashboardLayout><Expenses /></DashboardLayout>} />
        <Route path="/dashboard/store" element={<DashboardLayout><StoreBuilder /></DashboardLayout>} />
        <Route path="/dashboard/ai" element={<DashboardLayout><AIInsights /></DashboardLayout>} />
        <Route path="/dashboard/settings" element={<DashboardLayout><Settings /></DashboardLayout>} />
        
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

