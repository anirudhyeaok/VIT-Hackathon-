import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import DashboardPage from './pages/DashboardPage';
import UsersPage from './pages/UsersPage';
import UserDetailPage from './pages/UserDetailPage';
import LoansPage from './pages/LoansPage';
import AnalyticsPage from './pages/AnalyticsPage';
import ConsentsPage from './pages/ConsentsPage';
import { WorkflowsPage } from './pages/WorkflowsPage';
import { ToastProvider } from './components/Toast';

function App() {
  return (
    <ToastProvider>
      <div className="flex h-screen overflow-hidden bg-canvas text-content-primary">
        <Sidebar />
        <div className="flex-1 overflow-y-auto">
          <main className="p-10 max-w-7xl mx-auto w-full">
            <Routes>
              <Route path="/" element={<Navigate to="/admin" replace />} />
              <Route path="/admin" element={<DashboardPage />} />
              <Route path="/admin/users" element={<UsersPage />} />
              <Route path="/admin/users/:id" element={<UserDetailPage />} />
              <Route path="/admin/loans" element={<LoansPage />} />
              <Route path="/admin/analytics" element={<AnalyticsPage />} />
              <Route path="/admin/consents" element={<ConsentsPage />} />
              <Route path="/admin/workflows" element={<WorkflowsPage />} />
              <Route path="*" element={<Navigate to="/admin" replace />} />
            </Routes>
          </main>
        </div>
      </div>
    </ToastProvider>
  );
}

export default App;
