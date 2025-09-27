// components/ProtectedRoute.js
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';
import LoadingScreen from './LoadingScreen';

const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <LoadingScreen/>; 
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/signIn" />;
};

export default ProtectedRoute;
