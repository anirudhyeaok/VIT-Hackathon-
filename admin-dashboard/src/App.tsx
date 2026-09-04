import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import DashboardPage from './pages/DashboardPage';
import UsersPage from './pages/UsersPage';
import UserDetailPage from './pages/UserDetailPage';
import LoansPage from './pages/LoansPage';
import AnalyticsPage from './pages/AnalyticsPage';
import ConsentsPage from './pages/ConsentsPage';
import { WorkflowsPage } from './pages/WorkflowsPage';
import LoginPage from './pages/LoginPage';
import UserPortalPage from './pages/UserPortalPage';
import AdminProfilePage from './pages/AdminProfilePage';
import { ToastProvider } from './components/Toast';
import { useAuth } from './context/AuthContext';

function AdminLayout() {
  return (
    <div className="flex h-screen overflow-hidden bg-[#F6F6F3] dark:bg-[#1A1C1A] text-[#30332F] dark:text-[#E5E7E3]">
      <Sidebar />
      <div className="flex-1 overflow-y-auto">
        <main className="p-10 max-w-7xl mx-auto w-full">
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/users" element={<UsersPage />} />
            <Route path="/users/:id" element={<UserDetailPage />} />
            <Route path="/loans" element={<LoansPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/consents" element={<ConsentsPage />} />
            <Route path="/workflows" element={<WorkflowsPage />} />
            <Route path="/profile" element={<AdminProfilePage />} />
            <Route path="*" element={<Navigate to="/admin" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

function App() {
  const { isAuthenticated, user } = useAuth();

  return (
    <ToastProvider>
      <Routes>
        <Route path="/login" element={
          isAuthenticated
            ? <Navigate to={user?.role === 'admin' ? '/admin' : '/portal'} replace />
            : <LoginPage />
        } />
        <Route path="/portal" element={
          isAuthenticated && user?.role === 'user'
            ? <UserPortalPage />
            : <Navigate to="/login" replace />
        } />
        <Route path="/admin/*" element={
          isAuthenticated && user?.role === 'admin'
            ? <AdminLayout />
            : <Navigate to="/login" replace />
        } />
        <Route path="/" element={
          <Navigate to={isAuthenticated ? (user?.role === 'admin' ? '/admin' : '/portal') : '/login'} replace />
        } />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </ToastProvider>
  );
}

export default App;
