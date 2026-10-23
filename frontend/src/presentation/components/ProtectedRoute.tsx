import { Navigate, Outlet } from 'react-router-dom';
import { TokenStorage } from '../../infrastructure/auth/TokenStorage';

interface ProtectedRouteProps {
  roles?: string[];
}

export default function ProtectedRoute({ roles }: ProtectedRouteProps) {
  const token = TokenStorage.get();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (roles?.length) {
    try {
      const payload = token.split('.')[1];
      const decoded = JSON.parse(
        atob(payload.replace(/-/g, '+').replace(/_/g, '/')),
      );

      const userRole = decoded.role ?? decoded.roles?.[0];

      if (!roles.includes(userRole)) {
        return <Navigate to="/dashboard" replace />;
      }
    } catch {
      TokenStorage.clear();
      return <Navigate to="/login" replace />;
    }
  }

  return <Outlet />;
}