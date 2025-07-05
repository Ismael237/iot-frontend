import { api, buildUrl } from './axios-client';
import { 
  LoginRequest, 
  LoginResponse, 
  RefreshTokenRequest, 
  RefreshTokenResponse,
  LogoutRequest,
  LogoutResponse,
  User,
  CreateUserRequest,
  UpdateUserRequest
} from '../../shared/types/api.types';
import { 
  LoginCredentials, 
  PasswordChangeRequest, 
  PasswordResetRequest, 
  PasswordResetConfirm,
  TwoFactorAuthRequest,
  TwoFactorAuthSetup,
  SessionInfo
} from '../../shared/types/auth.types';

// Auth API endpoints
const AUTH_ENDPOINTS = {
  LOGIN: '/auth/login',
  REFRESH: '/auth/refresh',
  LOGOUT: '/auth/logout',
  ME: '/auth/me',
  CHANGE_PASSWORD: '/auth/change-password',
  RESET_PASSWORD: '/auth/reset-password',
  RESET_PASSWORD_CONFIRM: '/auth/reset-password/confirm',
  TWO_FACTOR_SETUP: '/auth/2fa/setup',
  TWO_FACTOR_VERIFY: '/auth/2fa/verify',
  TWO_FACTOR_DISABLE: '/auth/2fa/disable',
  SESSIONS: '/auth/sessions',
  REVOKE_SESSION: '/auth/sessions/revoke',
} as const;

export class AuthApi {
  /**
   * Authenticate user with email and password
   */
  static async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>(AUTH_ENDPOINTS.LOGIN, credentials);
    return response.data;
  }

  /**
   * Refresh access token using refresh token
   */
  static async refreshToken(request: RefreshTokenRequest): Promise<RefreshTokenResponse> {
    const response = await api.post<RefreshTokenResponse>(AUTH_ENDPOINTS.REFRESH, request);
    return response.data;
  }

  /**
   * Logout user and invalidate refresh token
   */
  static async logout(request: LogoutRequest): Promise<LogoutResponse> {
    const response = await api.post<LogoutResponse>(AUTH_ENDPOINTS.LOGOUT, request);
    return response.data;
  }

  /**
   * Get current user profile
   */
  static async getCurrentUser(): Promise<User> {
    const response = await api.get<User>(AUTH_ENDPOINTS.ME);
    return response.data;
  }

  /**
   * Change user password
   */
  static async changePassword(request: PasswordChangeRequest): Promise<{ success: boolean }> {
    const response = await api.post<{ success: boolean }>(AUTH_ENDPOINTS.CHANGE_PASSWORD, request);
    return response.data;
  }

  /**
   * Request password reset
   */
  static async requestPasswordReset(request: PasswordResetRequest): Promise<{ success: boolean }> {
    const response = await api.post<{ success: boolean }>(AUTH_ENDPOINTS.RESET_PASSWORD, request);
    return response.data;
  }

  /**
   * Confirm password reset with token
   */
  static async confirmPasswordReset(request: PasswordResetConfirm): Promise<{ success: boolean }> {
    const response = await api.post<{ success: boolean }>(AUTH_ENDPOINTS.RESET_PASSWORD_CONFIRM, request);
    return response.data;
  }

  /**
   * Setup two-factor authentication
   */
  static async setupTwoFactor(): Promise<TwoFactorAuthSetup> {
    const response = await api.post<TwoFactorAuthSetup>(AUTH_ENDPOINTS.TWO_FACTOR_SETUP);
    return response.data;
  }

  /**
   * Verify two-factor authentication code
   */
  static async verifyTwoFactor(request: TwoFactorAuthRequest): Promise<{ success: boolean }> {
    const response = await api.post<{ success: boolean }>(AUTH_ENDPOINTS.TWO_FACTOR_VERIFY, request);
    return response.data;
  }

  /**
   * Disable two-factor authentication
   */
  static async disableTwoFactor(request: TwoFactorAuthRequest): Promise<{ success: boolean }> {
    const response = await api.post<{ success: boolean }>(AUTH_ENDPOINTS.TWO_FACTOR_DISABLE, request);
    return response.data;
  }

  /**
   * Get user sessions
   */
  static async getSessions(): Promise<SessionInfo[]> {
    const response = await api.get<SessionInfo[]>(AUTH_ENDPOINTS.SESSIONS);
    return response.data;
  }

  /**
   * Revoke a specific session
   */
  static async revokeSession(sessionId: string): Promise<{ success: boolean }> {
    const url = buildUrl(AUTH_ENDPOINTS.REVOKE_SESSION, { session_id: sessionId });
    const response = await api.post<{ success: boolean }>(url);
    return response.data;
  }

  /**
   * Revoke all sessions except current
   */
  static async revokeAllSessions(): Promise<{ success: boolean }> {
    const url = buildUrl(AUTH_ENDPOINTS.REVOKE_SESSION, { all: true });
    const response = await api.post<{ success: boolean }>(url);
    return response.data;
  }
}

// User management endpoints (admin only)
const USER_ENDPOINTS = {
  USERS: '/users',
  USER_BY_ID: (id: number) => `/users/${id}`,
} as const;

export class UserApi {
  /**
   * Get paginated list of users
   */
  static async getUsers(params?: {
    skip?: number;
    limit?: number;
    role?: string;
    search?: string;
  }): Promise<{ data: User[]; total: number }> {
    const url = buildUrl(USER_ENDPOINTS.USERS, params);
    const response = await api.get<{ data: User[]; total: number }>(url);
    return response.data;
  }

  /**
   * Get user by ID
   */
  static async getUserById(id: number): Promise<User> {
    const response = await api.get<User>(USER_ENDPOINTS.USER_BY_ID(id));
    return response.data;
  }

  /**
   * Create new user
   */
  static async createUser(request: CreateUserRequest): Promise<User> {
    const response = await api.post<User>(USER_ENDPOINTS.USERS, request);
    return response.data;
  }

  /**
   * Update user
   */
  static async updateUser(id: number, request: UpdateUserRequest): Promise<User> {
    const response = await api.patch<User>(USER_ENDPOINTS.USER_BY_ID(id), request);
    return response.data;
  }

  /**
   * Delete user
   */
  static async deleteUser(id: number): Promise<{ success: boolean }> {
    const response = await api.delete<{ success: boolean }>(USER_ENDPOINTS.USER_BY_ID(id));
    return response.data;
  }

  /**
   * Activate user
   */
  static async activateUser(id: number): Promise<User> {
    const response = await api.patch<User>(USER_ENDPOINTS.USER_BY_ID(id), { is_active: true });
    return response.data;
  }

  /**
   * Deactivate user
   */
  static async deactivateUser(id: number): Promise<User> {
    const response = await api.patch<User>(USER_ENDPOINTS.USER_BY_ID(id), { is_active: false });
    return response.data;
  }
}

// Export convenience functions
export const authApi = {
  // Authentication
  login: AuthApi.login,
  refreshToken: AuthApi.refreshToken,
  logout: AuthApi.logout,
  getCurrentUser: AuthApi.getCurrentUser,
  
  // Password management
  changePassword: AuthApi.changePassword,
  requestPasswordReset: AuthApi.requestPasswordReset,
  confirmPasswordReset: AuthApi.confirmPasswordReset,
  
  // Two-factor authentication
  setupTwoFactor: AuthApi.setupTwoFactor,
  verifyTwoFactor: AuthApi.verifyTwoFactor,
  disableTwoFactor: AuthApi.disableTwoFactor,
  
  // Session management
  getSessions: AuthApi.getSessions,
  revokeSession: AuthApi.revokeSession,
  revokeAllSessions: AuthApi.revokeAllSessions,
  
  // User management (admin only)
  getUsers: UserApi.getUsers,
  getUserById: UserApi.getUserById,
  createUser: UserApi.createUser,
  updateUser: UserApi.updateUser,
  deleteUser: UserApi.deleteUser,
  activateUser: UserApi.activateUser,
  deactivateUser: UserApi.deactivateUser,
};

export default authApi; 