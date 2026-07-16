import { Navigate, Outlet } from 'react-router-dom';
import { useUser } from '@hooks/useUser';

export function ProtectedRoute() {
  const { user, isLoading } = useUser();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
