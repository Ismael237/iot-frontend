import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../domain/store/auth-store';

export const useAuth = () => {
  const navigate = useNavigate();
  const {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    checkAuth,
    clearError
  } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const handleLogin = async (email: string, password: string) => {
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    login: handleLogin,
    logout: handleLogout,
    clearError
  };
}; 