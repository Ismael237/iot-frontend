import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Spinner, Center, Text, VStack } from '@chakra-ui/react';
import { useAuthStore } from '@domain/store/auth-store';
import { User } from '@domain/entities/user.entity';

export interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'user';
  fallbackPath?: string;
  showLoading?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
  fallbackPath = '/login',
  showLoading = true,
}) => {
  const { 
    isAuthenticated, 
    isLoading, 
    user, 
    hasValidToken, 
    getCurrentUser, 
    clearAuth,
    setTokens 
  } = useAuthStore();
  
  const location = useLocation();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [authMessage, setAuthMessage] = useState('Verifying authentication...');

  useEffect(() => {
    const verifyAuthentication = async () => {
      try {

        // Check if we have a valid access token in local storage
        const authTokens = localStorage.getItem('auth_tokens');
        const tokens = authTokens ? JSON.parse(authTokens) : null;
        // Check if we have a valid token first
        if (!authTokens && !hasValidToken) {
          setAuthMessage('No valid authentication token found');
          setIsCheckingAuth(false);
          return;
        }
        if (authTokens) {
          setTokens({ 
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken
          });
        }

        setAuthMessage('Verifying user session...');
        
        // Try to get current user from API
        await getCurrentUser();
        
        setAuthMessage('Authentication verified successfully');
        setIsCheckingAuth(false);
      } catch (error) {
        console.error('Authentication verification failed:', error);
        setAuthMessage('Authentication verification failed');
        // Clear auth data on verification failure
        clearAuth();
        setIsCheckingAuth(false);
      }
    };

    // Only verify if we're not already loading and we have a token
    if (!isLoading && !user) {
      verifyAuthentication();
    } else if (!isLoading) {
      setIsCheckingAuth(false);
    }
  }, [hasValidToken, user, isLoading, getCurrentUser, clearAuth, setTokens]);

  // Show loading spinner while checking authentication
  if ((isLoading || isCheckingAuth) && showLoading) {
    return (
      <Center minH="100vh">
        <VStack gap={4}>
          <Spinner size="xl" color="blue.500" />
          <Text color="gray.600" fontSize="sm">
            {authMessage}
          </Text>
        </VStack>
      </Center>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return (
      <Navigate
        to={fallbackPath}
        state={{ from: location }}
        replace
      />
    );
  }

  // Check role-based access if required
  if (requiredRole && user) {
    const hasRequiredRole = checkUserRole(user, requiredRole);
    
    if (!hasRequiredRole) {
      return (
        <Navigate
          to="/unauthorized"
          state={{ from: location, requiredRole }}
          replace
        />
      );
    }
  }

  return <>{children}</>;
};

// Helper function to check user role
const checkUserRole = (user: User, requiredRole: 'admin' | 'user'): boolean => {
  if (requiredRole === 'admin') {
    return user.role === 'admin';
  }
  
  if (requiredRole === 'user') {
    return user.role === 'user' || user.role === 'admin';
  }
  
  return true;
};

// Admin-only route wrapper
export const AdminRoute: React.FC<Omit<ProtectedRouteProps, 'requiredRole'>> = (props) => (
  <ProtectedRoute requiredRole="admin" {...props} />
);

// User route wrapper (includes both user and admin roles)
export const UserRoute: React.FC<Omit<ProtectedRouteProps, 'requiredRole'>> = (props) => (
  <ProtectedRoute requiredRole="user" {...props} />
);

// Public route that redirects authenticated users
export interface PublicRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
  showLoading?: boolean;
}

export const PublicRoute: React.FC<PublicRouteProps> = ({
  children,
  redirectTo = '/sensors',
  showLoading = true,
}) => {
  const { isAuthenticated, isLoading, hasValidToken, getCurrentUser, clearAuth } = useAuthStore();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [authMessage, setAuthMessage] = useState('Verifying authentication...');

  useEffect(() => {
    const verifyAuthentication = async () => {
      try {
        // Check if we have a valid token first
        if (!hasValidToken) {
          setAuthMessage('No valid authentication token found');
          setIsCheckingAuth(false);
          return;
        }

        setAuthMessage('Verifying user session...');
        
        // Try to get current user from API
        await getCurrentUser();
        
        setAuthMessage('Authentication verified successfully');
        setIsCheckingAuth(false);
      } catch (error) {
        console.error('Authentication verification failed:', error);
        setAuthMessage('Authentication verification failed');
        // Clear auth data on verification failure
        clearAuth();
        setIsCheckingAuth(false);
      }
    };

    // Only verify if we're not already loading and we have a token
    if (!isLoading && hasValidToken && !isAuthenticated) {
      verifyAuthentication();
    } else if (!isLoading) {
      setIsCheckingAuth(false);
    }
  }, []);

  // Show loading spinner while checking authentication
  if ((isLoading || isCheckingAuth) && showLoading) {
    return (
      <Center minH="100vh">
        <VStack gap={4}>
          <Spinner size="xl" color="blue.500" />
          <Text color="gray.600" fontSize="sm">
            {authMessage}
          </Text>
        </VStack>
      </Center>
    );
  }

  // Redirect authenticated users away from public routes (like login)
  if (isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute; 