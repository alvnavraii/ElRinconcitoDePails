import { useAuth } from '../hooks/useAuth';
import { Navigate, Outlet } from 'react-router-dom';

export const Dashboard = () => {
  const auth = useAuth();

  if (!auth || !auth.user) {
    return <Navigate to="/" />;
  }

  return <Outlet />;
}; 