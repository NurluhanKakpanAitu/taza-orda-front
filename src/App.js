import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom';
import './App.css';
import { AuthProvider } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ReportsPage from './pages/ReportsPage';
import ReportDetailsPage from './pages/ReportDetailsPage';
import CreateReportPage from './pages/CreateReportPage';
import ProfilePage from './pages/ProfilePage';
import NotificationsPage from './pages/NotificationsPage';
import OperatorDashboard from './pages/operator/OperatorDashboard';
import DistrictsPage from './pages/operator/DistrictsPage';
import ProtectedRoute from './components/ProtectedRoute';
import AppLayout from './components/layout/AppLayout';
import PublicEventsPage from './pages/events/PublicEventsPage';
import EventDetailsPage from './pages/events/EventDetailsPage';
import OperatorEventsPage from './pages/operator/events/OperatorEventsPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route
            path="/"
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="reports" element={<ReportsPage />} />
            <Route path="reports/:id" element={<ReportDetailsPage />} />
            <Route
              path="create"
              element={
                <ProtectedRoute allowedRoles={['Resident', undefined, null, '']}>
                  <CreateReportPage />
                </ProtectedRoute>
              }
            />
            <Route path="events" element={<PublicEventsPage />} />
            <Route path="events/:id" element={<EventDetailsPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="notifications" element={<NotificationsPage />} />
            <Route
              path="operator/dashboard"
              element={
                <ProtectedRoute allowedRoles={['Operator', 'Admin']}>
                  <OperatorDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="operator/events"
              element={
                <ProtectedRoute allowedRoles={['Operator', 'Admin']}>
                  <OperatorEventsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="operator/districts"
              element={
                <ProtectedRoute allowedRoles={['Operator', 'Admin']}>
                  <DistrictsPage />
                </ProtectedRoute>
              }
            />
          </Route>

          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
