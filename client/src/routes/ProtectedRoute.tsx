import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useUser } from '@hooks/useUser';
import { useEffect } from 'react';

export function ProtectedRoute() {
  const { user, isLoading } = useUser();
  const location = useLocation();

  useEffect(() => {
    if (user && location.pathname !== '/login' && location.pathname !== '/registration') {
      localStorage.setItem('lastRoute', location.pathname);
    }
  }, [location, user]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
