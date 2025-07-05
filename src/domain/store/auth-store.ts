import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { AuthState, LoginCredentials, AuthTokens, AuthUser } from '../../shared/types/auth.types';
import { User } from '../entities/user.entity';
import { User as ApiUser } from '../../shared/types/api.types';

interface AuthStore extends AuthState {
  // Actions
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
  setUser: (user: User) => void;
  setTokens: (tokens: AuthTokens) => void;
  clearAuth: () => void;
  setError: (error: string | null) => void;
  setLoading: (loading: boolean) => void;
  
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
          const payload = JSON.parse(atob(token.split('.')[1]));
          return payload.exp * 1000; // Convert to milliseconds
        } catch {
          return null;
        }
      },

      // Actions
      login: async (credentials: LoginCredentials) => {
        set({ isLoading: true, error: null });
        
        try {
          // This would call the actual API
          // const response = await authApi.login(credentials);
          
          // Mock response for now
          const mockResponse: AuthUser = {
            user: {
              id: 1,
              email: credentials.email,
              first_name: 'John',
              last_name: 'Doe',
              role: 'admin',
              is_active: true,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            },
            tokens: {
              accessToken: 'mock-access-token',
              refreshToken: 'mock-refresh-token',
            },
          };

          const user = new User(mockResponse.user);
          
          set({
            user,
            accessToken: mockResponse.tokens.accessToken,
            refreshToken: mockResponse.tokens.refreshToken,
            isLoading: false,
            error: null,
          });

          // Store tokens in localStorage if rememberMe is true
          if (credentials.rememberMe) {
            localStorage.setItem('auth_tokens', JSON.stringify(mockResponse.tokens));
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

      logout: async () => {
        set({ isLoading: true });
        
        try {
          const { refreshToken } = get();
          
          // Call logout API if we have a refresh token
          if (refreshToken) {
            // await authApi.logout({ refresh_token: refreshToken });
          }
        } catch (error) {
          // Continue with logout even if API call fails
          console.warn('Logout API call failed:', error);
        } finally {
          // Clear all auth data
          get().clearAuth();
          set({ isLoading: false });
        }
      },

      refreshToken: async () => {
        const { refreshToken } = get();
        
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        set({ isLoading: true, error: null });
        
        try {
          // This would call the actual API
          // const response = await authApi.refreshToken({ refresh_token: refreshToken });
          
          // Mock response for now
          const mockResponse = {
            access_token: 'new-mock-access-token',
          };

          set({
            accessToken: mockResponse.access_token,
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
          state.user = new User(state.user as ApiUser);
        }
      },
    }
  )
);

// Auto-refresh token when needed
let refreshTimer: NodeJS.Timeout | null = null;

const setupTokenRefresh = () => {
  const store = useAuthStore.getState();
  
  if (refreshTimer) {
    clearTimeout(refreshTimer);
  }
  
  if (store.isAuthenticated && store.shouldRefreshToken()) {
    refreshTimer = setTimeout(async () => {
      try {
        await store.refreshToken();
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
  refreshToken: state.refreshToken,
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