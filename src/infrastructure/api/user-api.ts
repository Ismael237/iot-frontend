import { apiClient } from './axios-client';
import { User, UserRole } from '../../domain/entities/user.entity';

export interface CreateUserRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
}

export interface UpdateUserRequest {
  firstName?: string;
  lastName?: string;
  role?: UserRole;
  isActive?: boolean;
}

export interface UsersResponse {
  data: User[];
  total: number;
}

export interface UserApi {
  getUsers: (params?: { skip?: number; limit?: number; role?: UserRole; search?: string }) => Promise<UsersResponse>;
  getUserById: (id: number) => Promise<User>;
  createUser: (userData: CreateUserRequest) => Promise<User>;
  updateUser: (id: number, userData: UpdateUserRequest) => Promise<User>;
  deleteUser: (id: number) => Promise<{ success: boolean }>;
}

export const userApi: UserApi = {
  getUsers: async (params = {}) => {
    const { skip = 0, limit = 20, role, search } = params;
    const queryParams = new URLSearchParams();
    
    if (skip !== undefined) queryParams.append('skip', skip.toString());
    if (limit !== undefined) queryParams.append('limit', limit.toString());
    if (role) queryParams.append('role', role);
    if (search) queryParams.append('search', search);
    
    const response = await apiClient.get(`/users?${queryParams.toString()}`);
    return response;
  },

  getUserById: async (id: number) => {
    const response = await apiClient.get(`/users/${id}`);
    return response;
  },

  createUser: async (userData: CreateUserRequest) => {
    const response = await apiClient.post('/users', userData);
    return response;
  },

  updateUser: async (id: number, userData: UpdateUserRequest) => {
    const response = await apiClient.patch(`/users/${id}`, userData);
    return response;
  },

  deleteUser: async (id: number) => {
    const response = await apiClient.delete(`/users/${id}`);
    return response;
  }
}; 