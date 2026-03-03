import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import FloatingParticles from './components/FloatingParticles';
import AIChatButton from './components/AIChatButton';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/admin/AdminDashboard';
import ThreatReports from './pages/admin/ThreatReports';
import RaidBookings from './pages/admin/RaidBookings';
import DrugMonitoringPage from './pages/admin/DrugMonitoring';
import ClientDashboard from './pages/client/ClientDashboard';
import ReportThreat from './pages/client/ReportThreat';
import BookRaid from './pages/client/BookRaid';

const adminNav = [
  { to: '/admin', label: 'Dashboard' },
  { to: '/admin/threats', label: 'Threat reports' },
  { to: '/admin/raids', label: 'Raid bookings' },
  { to: '/admin/drugs', label: 'Drug monitoring' },
];

const clientNav = [
  { to: '/client', label: 'Dashboard' },
  { to: '/client/report-threat', label: 'Report threat' },
  { to: '/client/book-raid', label: 'Book raid' },
];

function ProtectedRoute({ children, role }: { children: React.ReactNode; role: 'admin' | 'client' }) {
  const { user, isAuthenticated } = useAuth();
  if (!isAuthenticated || !user) return <Navigate to="/login" replace />;
  if (user.role !== role) return <Navigate to={user.role === 'admin' ? '/admin' : '/client'} replace />;
  return <>{children}</>;
}

export default function App() {
  return (
    <BrowserRouter>
      <FloatingParticles />
      <div className="relative z-10">
        <AIChatButton />
        <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute role="admin">
              <Layout title="Threat Monitoring — Admin" navItems={adminNav} />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="threats" element={<ThreatReports />} />
          <Route path="raids" element={<RaidBookings />} />
          <Route path="drugs" element={<DrugMonitoringPage />} />
        </Route>
        <Route
          path="/client"
          element={
            <ProtectedRoute role="client">
              <Layout title="Threat Monitoring — Client" navItems={clientNav} />
            </ProtectedRoute>
          }
        >
          <Route index element={<ClientDashboard />} />
          <Route path="report-threat" element={<ReportThreat />} />
          <Route path="book-raid" element={<BookRaid />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      </div>
    </BrowserRouter>
  );
}
