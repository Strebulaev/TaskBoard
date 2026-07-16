import { Navigate, Outlet } from 'react-router-dom';
import { useUser } from '@hooks/useUser';

export function PublicRoute() {
  const { user, isLoading } = useUser();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (user) {
    const lastRoute = localStorage.getItem('lastRoute');
    if (lastRoute && lastRoute !== '/login' && lastRoute !== '/registration') {
      return <Navigate to={lastRoute} replace />;
    }
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
