import { create } from 'zustand';
import type { User, UserRole } from '../entities/user.entity';
import { userApi } from '../../infrastructure/api/user-api';

interface UserStoreState {
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

// Validation utilities
const isValidUser = (user: any): user is User => {
  return (
    user &&
    typeof user.id === 'number' &&
    typeof user.email === 'string' &&
    typeof user.firstName === 'string' &&
    typeof user.lastName === 'string' &&
    typeof user.role === 'string' &&
    typeof user.isActive === 'boolean'
  );
};

const sanitizeUser = (user: any): User => {
  if (!isValidUser(user)) {
    throw new Error('Invalid user data');
  }

  return {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    role: user.role as UserRole,
    isActive: user.isActive,
    createdAt: user.createdAt || new Date().toISOString(),
    updatedAt: user.updatedAt || new Date().toISOString()
  };
};

export const useUserStore = create<UserStoreState>((set, get) => ({
  users: [],
  currentUser: null,
  isLoading: false,
  error: null,
  totalUsers: 0,

  fetchUsers: async (params = {}) => {
    set({ isLoading: true, error: null });
    try {
      const response = await userApi.getUsers(params);
      
      // Validate and sanitize users
      const validUsers = response
        .filter(isValidUser)
        .map(sanitizeUser);

      set({
        users: validUsers,
        totalUsers: response.total || validUsers.length,
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
      const response = await userApi.getUserById(id);
      
      const user = sanitizeUser(response);
      
      set({ isLoading: false });
      return user;
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
      const response = await userApi.createUser(userData);
      
      const newUser = sanitizeUser(response);
      
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
      const response = await userApi.updateUser(id, userData);
      
      const updatedUser = sanitizeUser(response);
      
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
      await userApi.deleteUser(id);
      
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
    if (!isValidUser(user)) {
      console.warn('Invalid user data provided to setCurrentUser');
      return;
    }
    set({ currentUser: user });
  },

  clearError: () => {
    set({ error: null });
  }
})); 