import { create } from 'zustand';
import { User, UserRole } from '../entities/user.entity';

interface UserState {
  users: User[];
  currentUser: User | null;
  isLoading: boolean;
  error: string | null;
  totalUsers: number;
  
  // Actions
  fetchUsers: (params?: { skip?: number; limit?: number; role?: UserRole; search?: string }) => Promise<void>;
  fetchUserById: (id: number) => Promise<User | null>;
  createUser: (userData: CreateUserData) => Promise<User>;
  updateUser: (id: number, userData: UpdateUserData) => Promise<User>;
  deleteUser: (id: number) => Promise<void>;
  setCurrentUser: (user: User) => void;
  clearError: () => void;
}

interface CreateUserData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
}

interface UpdateUserData {
  firstName?: string;
  lastName?: string;
  role?: UserRole;
  isActive?: boolean;
}

export const useUserStore = create<UserState>((set, get) => ({
  users: [],
  currentUser: null,
  isLoading: false,
  error: null,
  totalUsers: 0,

  fetchUsers: async (params = {}) => {
    set({ isLoading: true, error: null });
    try {
      // Mock API call - replace with actual API
      const { skip = 0, limit = 20, role, search } = params;
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock data
      const mockUsers: User[] = [
        {
          id: 1,
          email: 'admin@iot.com',
          firstName: 'Admin',
          lastName: 'User',
          role: UserRole.ADMIN,
          isActive: true,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z'
        },
        {
          id: 2,
          email: 'operator@iot.com',
          firstName: 'Operator',
          lastName: 'User',
          role: UserRole.OPERATOR,
          isActive: true,
          createdAt: '2024-01-02T00:00:00Z',
          updatedAt: '2024-01-02T00:00:00Z'
        },
        {
          id: 3,
          email: 'viewer@iot.com',
          firstName: 'Viewer',
          lastName: 'User',
          role: UserRole.VIEWER,
          isActive: true,
          createdAt: '2024-01-03T00:00:00Z',
          updatedAt: '2024-01-03T00:00:00Z'
        }
      ];

      let filteredUsers = mockUsers;
      
      if (role) {
        filteredUsers = filteredUsers.filter(user => user.role === role);
      }
      
      if (search) {
        filteredUsers = filteredUsers.filter(user => 
          user.email.toLowerCase().includes(search.toLowerCase()) ||
          user.firstName.toLowerCase().includes(search.toLowerCase()) ||
          user.lastName.toLowerCase().includes(search.toLowerCase())
        );
      }

      const paginatedUsers = filteredUsers.slice(skip, skip + limit);
      
      set({
        users: paginatedUsers,
        totalUsers: filteredUsers.length,
        isLoading: false
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch users',
        isLoading: false
      });
    }
  },

  fetchUserById: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      // Mock API call - replace with actual API
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const mockUser: User = {
        id,
        email: `user${id}@iot.com`,
        firstName: `User${id}`,
        lastName: 'Test',
        role: UserRole.USER,
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      };
      
      set({ isLoading: false });
      return mockUser;
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch user',
        isLoading: false
      });
      return null;
    }
  },

  createUser: async (userData: CreateUserData) => {
    set({ isLoading: true, error: null });
    try {
      // Mock API call - replace with actual API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newUser: User = {
        id: Date.now(),
        ...userData,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      set(state => ({
        users: [...state.users, newUser],
        totalUsers: state.totalUsers + 1,
        isLoading: false
      }));
      
      return newUser;
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to create user',
        isLoading: false
      });
      throw error;
    }
  },

  updateUser: async (id: number, userData: UpdateUserData) => {
    set({ isLoading: true, error: null });
    try {
      // Mock API call - replace with actual API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const updatedUser: User = {
        id,
        email: `user${id}@iot.com`,
        firstName: userData.firstName || 'User',
        lastName: userData.lastName || 'Test',
        role: userData.role || UserRole.USER,
        isActive: userData.isActive ?? true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: new Date().toISOString()
      };
      
      set(state => ({
        users: state.users.map(user => user.id === id ? updatedUser : user),
        isLoading: false
      }));
      
      return updatedUser;
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to update user',
        isLoading: false
      });
      throw error;
    }
  },

  deleteUser: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      // Mock API call - replace with actual API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      set(state => ({
        users: state.users.filter(user => user.id !== id),
        totalUsers: state.totalUsers - 1,
        isLoading: false
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to delete user',
        isLoading: false
      });
      throw error;
    }
  },

  setCurrentUser: (user: User) => {
    set({ currentUser: user });
  },

  clearError: () => {
    set({ error: null });
  }
})); 