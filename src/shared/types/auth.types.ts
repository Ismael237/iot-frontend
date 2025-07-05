import { User } from './api.types';

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshAuth: () => Promise<void>;
  clearError: () => void;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthUser {
  user: User;
  tokens: AuthTokens;
}

export interface PasswordChangeRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordResetConfirm {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

export interface TwoFactorAuthRequest {
  code: string;
}

export interface TwoFactorAuthSetup {
  secret: string;
  qrCode: string;
  backupCodes: string[];
}

export interface SessionInfo {
  id: string;
  device: string;
  location: string;
  lastActive: string;
  isCurrent: boolean;
}

export interface UserPermissions {
  canManageUsers: boolean;
  canManageDevices: boolean;
  canManageAutomation: boolean;
  canViewAnalytics: boolean;
  canManageSystem: boolean;
}

export interface AuthError {
  code: string;
  message: string;
  field?: string;
}

export interface AuthResponse {
  user: User;
  tokens: AuthTokens;
}

export interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'user';
}

export interface AuthGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
} 