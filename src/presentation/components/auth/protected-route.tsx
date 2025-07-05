import React from 'react';
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
  const { isAuthenticated, isLoading, user } = useAuthStore();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (isLoading && showLoading) {
    return (
      <Center minH="100vh">
        <VStack gap={4}>
          <Spinner size="xl" color="blue.500" />
          <Text color="gray.600" fontSize="sm">
            Loading...
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
  redirectTo = '/dashboard',
  showLoading = true,
}) => {
  const { isAuthenticated, isLoading } = useAuthStore();

  // Show loading spinner while checking authentication
  if (isLoading && showLoading) {
    return (
      <Center minH="100vh">
        <VStack gap={4}>
          <Spinner size="xl" color="blue.500" />
          <Text color="gray.600" fontSize="sm">
            Loading...
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