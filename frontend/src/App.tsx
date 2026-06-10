import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Layout } from './components/Layout';

import LoginPage from './pages/auth/LoginPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import DashboardPage from './pages/DashboardPage';
import FacilitiesPage from './pages/facilities/FacilitiesPage';
import DocumentsPage from './pages/documents/DocumentsPage';
import VehiclesPage from './pages/vehicles/VehiclesPage';
import ItemsPage from './pages/items/ItemsPage';
import InventoryPage from './pages/inventory/InventoryPage';
import StaffPage from './pages/staff/StaffPage';
import LeavePage from './pages/leave/LeavePage';
import NotificationsPage from './pages/NotificationsPage';
import ReportsPage from './pages/reports/ReportsPage';
import ActivityPage from './pages/activity/ActivityPage';

const qc = new QueryClient({ defaultOptions: { queries: { retry: 1, staleTime: 1000 * 60 } } });

export default function App() {
  return (
    <QueryClientProvider client={qc}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />

            <Route element={<ProtectedRoute />}>
              <Route element={<Layout />}>
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/facilities" element={<FacilitiesPage />} />
                <Route path="/vehicles" element={<VehiclesPage />} />
                <Route path="/items" element={<ItemsPage />} />
                <Route path="/inventory" element={<InventoryPage />} />
                <Route path="/notifications" element={<NotificationsPage />} />

                <Route element={<ProtectedRoute roles={['ict_admin', 'rom_supervisor', 'regional_coordinator']} />}>
                  <Route path="/documents" element={<DocumentsPage />} />
                </Route>

                <Route element={<ProtectedRoute roles={['ict_admin']} />}>
                  <Route path="/staff" element={<StaffPage />} />
                  <Route path="/activity" element={<ActivityPage />} />
                </Route>

                <Route element={<ProtectedRoute roles={['ict_admin', 'regional_coordinator']} />}>
                  <Route path="/leave" element={<LeavePage />} />
                  <Route path="/reports" element={<ReportsPage />} />
                </Route>
              </Route>
            </Route>

            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}
