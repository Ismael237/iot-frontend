import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { LoginCredentials, AuthTokens } from '@shared/types/auth.types';
import type { User as ApiUser, LoginRequest, LoginResponse, RefreshTokenRequest, RefreshTokenResponse, LogoutRequest } from '@shared/types/api.types';
import { authApi } from '@infrastructure/api/auth-api';
import { User } from '../entities/user.entity';
import { getErrorMessage } from '@infrastructure/api/axios-client';
import type { AxiosError } from 'axios';

interface AuthStoreState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  error: string | null;
}

interface AuthStore extends AuthStoreState {
  // Actions
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  refreshAuthToken: () => Promise<void>;
  setUser: (user: User) => void;
  setTokens: (tokens: AuthTokens) => void;
  clearAuth: () => void;
  setError: (error: string | null) => void;
  setLoading: (loading: boolean) => void;
  getCurrentUser: () => Promise<User | null>;
  
  // Computed
  isAuthenticated: boolean;
  hasValidToken: boolean;
  tokenExpiryTime: number | null;
  
  // Token management
  getAccessToken: () => string | null;
  getRefreshToken: () => string | null;
  isTokenExpired: () => boolean;
  shouldRefreshToken: () => boolean;
}

const TOKEN_REFRESH_THRESHOLD = 5 * 60 * 1000; // 5 minutes before expiry

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      accessToken: null,
      refreshToken: null,
      isLoading: false,
      error: null,

      // Computed properties
      get isAuthenticated() {
        const { user, accessToken } = get();
        return !!(user && accessToken && !get().isTokenExpired());
      },

      get hasValidToken() {
        const { accessToken } = get();
        return !!(accessToken && !get().isTokenExpired());
      },

      get tokenExpiryTime() {
        const token = get().accessToken;
        if (!token) return null;
        
        try {
          const parts = token.split('.');
          if (parts.length !== 3 || !parts[1]) return null;
          
          const payload = JSON.parse(atob(parts[1]));
          return payload.exp * 1000; // Convert to milliseconds
        } catch {
          return null;
        }
      },

      // Actions
      login: async (credentials: LoginCredentials) => {
        set({ isLoading: true, error: null });
        
        try {
          const loginRequest: LoginRequest = {
            email: credentials.email,
            password: credentials.password,
          };

          const response: LoginResponse = await authApi.login(loginRequest);

          const { accessToken } = response;

          set({
            accessToken: accessToken,
          });

          // Store tokens in localStorage if rememberMe is true
          if (credentials.rememberMe) {
            localStorage.setItem('auth_tokens', JSON.stringify({
              accessToken: accessToken,
            }));
          }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Login failed';
          set({ 
            isLoading: false, 
            error: errorMessage,
            user: null,
            accessToken: null,
            refreshToken: null,
          });
          throw error;
        }
    },

      getCurrentUser: async () => {
        set({ isLoading: true, error: null });
        try {
          const response = await authApi.getCurrentUser();
          const userEntity = new User(response);
          set({
            user: userEntity,
            isLoading: false,
            isAuthenticated: true,
            error: null,
          });
          return userEntity;
        } catch (error) {
          const errorMessage = getErrorMessage(error as AxiosError);
          console.error('Failed to get current user:', error);
          set({ isLoading: false, error: errorMessage, isAuthenticated: false });
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      logout: async () => {
        set({ isLoading: true });
        
        try {
          const { refreshToken } = get();
          
          // Call logout API if we have a refresh token
          if (refreshToken) {
            const logoutRequest: LogoutRequest = {
              refreshToken: refreshToken,
            };
            await authApi.logout(logoutRequest);
          }
          localStorage.removeItem('auth_tokens');


        } catch (error) {
          // Continue with logout even if API call fails
          console.warn('Logout API call failed:', error);
        } finally {
          // Clear all auth data
          get().clearAuth();
          set({ isLoading: false });
        }
      },

      refreshAuthToken: async () => {
        const { refreshToken } = get();
        
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        set({ isLoading: true, error: null });
        
        try {
          const refreshRequest: RefreshTokenRequest = {
            refreshToken: refreshToken,
          };
          
          const response: RefreshTokenResponse = await authApi.refreshToken(refreshRequest);

          set({
            accessToken: response.accessToken,
            isLoading: false,
            error: null,
          });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Token refresh failed';
          set({ 
            isLoading: false, 
            error: errorMessage,
            user: null,
            accessToken: null,
            refreshToken: null,
          });
          throw error;
        }
      },

      setUser: (user: User) => {
        set({ user });
      },

      setTokens: (tokens: AuthTokens) => {
        set({
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
        });
      },

      clearAuth: () => {
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isLoading: false,
          isAuthenticated: false,
          error: null,
        });
        
        // Clear from localStorage
        localStorage.removeItem('auth_tokens');
      },

      setError: (error: string | null) => {
        set({ error });
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      // Token management
      getAccessToken: () => {
        return get().accessToken;
      },

      getRefreshToken: () => {
        return get().refreshToken;
      },

      isTokenExpired: () => {
        const expiryTime = get().tokenExpiryTime;
        if (!expiryTime) return true;
        
        return Date.now() >= expiryTime;
      },

      shouldRefreshToken: () => {
        const expiryTime = get().tokenExpiryTime;
        if (!expiryTime) return false;
        
        return Date.now() >= (expiryTime - TOKEN_REFRESH_THRESHOLD);
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
      }),
      onRehydrateStorage: () => (state) => {
        // Rehydrate user entity after storage
        if (state?.user) {
          state.user = new User(state.user as unknown as ApiUser);
        }
      },
    }
  )
);

// Auto-refresh token when needed
let refreshTimer: ReturnType<typeof setTimeout> | null = null;

const setupTokenRefresh = () => {
  const store = useAuthStore.getState();
  
  if (refreshTimer) {
    clearTimeout(refreshTimer);
  }
  
  if (store.isAuthenticated && store.shouldRefreshToken()) {
    refreshTimer = setTimeout(async () => {
      try {
        await store.refreshAuthToken();
        setupTokenRefresh(); // Setup next refresh
      } catch (error) {
        console.error('Auto token refresh failed:', error);
        store.clearAuth();
      }
    }, 1000); // Check again in 1 second
  }
};

// Subscribe to auth changes to setup auto-refresh
useAuthStore.subscribe((state) => {
  if (state.isAuthenticated) {
    setupTokenRefresh();
  } else if (refreshTimer) {
    clearTimeout(refreshTimer);
    refreshTimer = null;
  }
});

// Export selectors for better performance
export const useAuth = () => useAuthStore((state) => ({
  user: state.user,
  isAuthenticated: state.isAuthenticated,
  isLoading: state.isLoading,
  error: state.error,
}));

export const useAuthActions = () => useAuthStore((state) => ({
  login: state.login,
  logout: state.logout,
  refreshAuthToken: state.refreshAuthToken,
  clearAuth: state.clearAuth,
  setError: state.setError,
}));

export const useAuthTokens = () => useAuthStore((state) => ({
  accessToken: state.accessToken,
  refreshToken: state.refreshToken,
  hasValidToken: state.hasValidToken,
  isTokenExpired: state.isTokenExpired,
  shouldRefreshToken: state.shouldRefreshToken,
})); 