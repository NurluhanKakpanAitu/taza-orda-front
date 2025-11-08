import { Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, initializing, user } = useAuth();

  if (initializing) {
    return (
      <div className="page-loader">
        <div className="spinner" />
        <p>Загрузка профиля...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const isRoleAllowed =
    !allowedRoles || (Array.isArray(allowedRoles) && allowedRoles.includes(user?.role));

  if (!isRoleAllowed) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;
