import { apiClient } from './axios-client';
import { ComponentType, ComponentDeployment } from '../../domain/entities/component.entity';

export interface CreateComponentTypeRequest {
  name: string;
  identifier: string;
  category: 'sensor' | 'actuator';
  unit?: string;
  description?: string;
}

export interface CreateDeploymentRequest {
  componentTypeId: number;
  deviceId: number;
  active: boolean;
}

export interface UpdateDeploymentRequest {
  active?: boolean;
}

export interface ComponentTypesResponse {
  data: ComponentType[];
  total: number;
}

export interface DeploymentsResponse {
  data: ComponentDeployment[];
  total: number;
}

export interface ComponentApi {
  getComponentTypes: (params?: { category?: 'sensor' | 'actuator'; search?: string }) => Promise<ComponentTypesResponse>;
  createComponentType: (typeData: CreateComponentTypeRequest) => Promise<ComponentType>;
  getDeployments: (params?: { deviceId?: number; componentTypeId?: number; activeOnly?: boolean }) => Promise<DeploymentsResponse>;
  createDeployment: (deploymentData: CreateDeploymentRequest) => Promise<ComponentDeployment>;
  updateDeployment: (id: number, deploymentData: UpdateDeploymentRequest) => Promise<ComponentDeployment>;
  deleteDeployment: (id: number) => Promise<{ success: boolean }>;
}

export const componentApi: ComponentApi = {
  getComponentTypes: async (params = {}) => {
    const { category, search } = params;
    const queryParams = new URLSearchParams();
    
    if (category) queryParams.append('category', category);
    if (search) queryParams.append('search', search);
    
    const response = await apiClient.get(`/components/types?${queryParams.toString()}`);
    return response;
  },

  createComponentType: async (typeData: CreateComponentTypeRequest) => {
    const response = await apiClient.post('/components/types', typeData);
    return response;
  },

  getDeployments: async (params = {}) => {
    const { deviceId, componentTypeId, activeOnly = true } = params;
    const queryParams = new URLSearchParams();
    
    if (deviceId) queryParams.append('device_id', deviceId.toString());
    if (componentTypeId) queryParams.append('component_type_id', componentTypeId.toString());
    if (activeOnly !== undefined) queryParams.append('active_only', activeOnly.toString());
    
    const response = await apiClient.get(`/components/deployments?${queryParams.toString()}`);
    return response;
  },

  createDeployment: async (deploymentData: CreateDeploymentRequest) => {
    const response = await apiClient.post('/components/deployments', deploymentData);
    return response;
  },

  updateDeployment: async (id: number, deploymentData: UpdateDeploymentRequest) => {
    const response = await apiClient.patch(`/components/deployments/${id}`, deploymentData);
    return response;
  },

  deleteDeployment: async (id: number) => {
    const response = await apiClient.delete(`/components/deployments/${id}`);
    return response;
  }
}; 