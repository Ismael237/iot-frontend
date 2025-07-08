import { create } from 'zustand';
import type { ComponentType, ComponentDeployment } from '../entities/component.entity';
import { componentApi } from '../../infrastructure/api/component-api';

interface ComponentStoreState {
  componentTypes: ComponentType[];
  deployments: ComponentDeployment[];
  selectedType: ComponentType | null;
  selectedDeployment: ComponentDeployment | null;
  isLoading: boolean;
  error: string | null;
  totalTypes: number;
  totalDeployments: number;
  
  // Actions
  fetchComponentTypes: (params?: { category?: 'sensor' | 'actuator'; search?: string }) => Promise<void>;
  fetchDeployments: (params?: { deviceId?: number; componentTypeId?: number; activeOnly?: boolean }) => Promise<void>;
  createComponentType: (typeData: CreateComponentTypeData) => Promise<ComponentType>;
  createDeployment: (deploymentData: CreateDeploymentData) => Promise<ComponentDeployment>;
  updateDeployment: (id: number, deploymentData: UpdateDeploymentData) => Promise<ComponentDeployment>;
  deleteDeployment: (id: number) => Promise<void>;
  setSelectedType: (type: ComponentType | null) => void;
  setSelectedDeployment: (deployment: ComponentDeployment | null) => void;
  clearError: () => void;
}

interface CreateComponentTypeData {
  name: string;
  identifier: string;
  category: 'sensor' | 'actuator';
  unit?: string;
  description?: string;
}

interface CreateDeploymentData {
  componentTypeId: number;
  deviceId: number;
  active: boolean;
}

interface UpdateDeploymentData {
  active?: boolean;
}

// Validation utilities
const isValidComponentType = (type: any): type is ComponentType => {
  return (
    type &&
    typeof type.id === 'number' &&
    typeof type.name === 'string' &&
    typeof type.identifier === 'string' &&
    typeof type.category === 'string' &&
    (type.category === 'sensor' || type.category === 'actuator')
  );
};

const isValidComponentDeployment = (deployment: any): deployment is ComponentDeployment => {
  return (
    deployment &&
    typeof deployment.id === 'number' &&
    typeof deployment.componentTypeId === 'number' &&
    typeof deployment.deviceId === 'number' &&
    typeof deployment.active === 'boolean' &&
    deployment.componentType &&
    deployment.device
  );
};

const sanitizeComponentType = (type: any): ComponentType => {
  if (!isValidComponentType(type)) {
    throw new Error('Invalid component type data');
  }

  return {
    id: type.id,
    name: type.name,
    identifier: type.identifier,
    category: type.category as 'sensor' | 'actuator',
    unit: type.unit,
    description: type.description || '',
    metadata: type.metadata || {},
    createdAt: type.createdAt || new Date().toISOString(),
    updatedAt: type.updatedAt || new Date().toISOString(),
  };
};

const sanitizeComponentDeployment = (deployment: any): ComponentDeployment => {
  if (!isValidComponentDeployment(deployment)) {
    throw new Error('Invalid component deployment data');
  }

  return {
    id: deployment.id,
    componentTypeId: deployment.componentTypeId,
    deviceId: deployment.deviceId,
    active: deployment.active,
    createdAt: deployment.createdAt || new Date().toISOString(),
    updatedAt: deployment.updatedAt || new Date().toISOString(),
    componentType: {
      id: deployment.componentType.id || 0,
      name: deployment.componentType.name || 'Unknown Type',
      identifier: deployment.componentType.identifier || 'unknown',
      category: deployment.componentType.category || 'sensor',
      unit: deployment.componentType.unit,
      description: deployment.componentType.description || '',
      metadata: deployment.componentType.metadata || {},
      createdAt: deployment.componentType.createdAt || new Date().toISOString(),
      updatedAt: deployment.componentType.updatedAt || new Date().toISOString(),
    },
    device: {
      id: deployment.device.id || 0,
      identifier: deployment.device.identifier || 'unknown-device',
      deviceType: deployment.device.deviceType || 'esp32',
      model: deployment.device.model || 'Unknown Model',
      ipAddress: deployment.device.ipAddress,
      port: deployment.device.port,
      active: deployment.device.active ?? true,
      status: deployment.device.status || 'unknown',
      lastSeen: deployment.device.lastSeen,
      createdAt: deployment.device.createdAt || new Date().toISOString(),
      updatedAt: deployment.device.updatedAt || new Date().toISOString(),
      componentDeployments: deployment.device.componentDeployments || [],
    },
  };
};

export const useComponentStore = create<ComponentStoreState>((set, get) => ({
  componentTypes: [],
  deployments: [],
  selectedType: null,
  selectedDeployment: null,
  isLoading: false,
  error: null,
  totalTypes: 0,
  totalDeployments: 0,

  fetchComponentTypes: async (params = {}) => {
    set({ isLoading: true, error: null });
    try {
      const response = await componentApi.getComponentTypes(params);
      
      // Validate and sanitize component types
      const validTypes = response
        .filter(isValidComponentType)
        .map(sanitizeComponentType);
      
      set({
        componentTypes: validTypes,
        totalTypes: response.total || validTypes.length,
        isLoading: false
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch component types',
        isLoading: false
      });
    }
  },

  fetchDeployments: async (params = {}) => {
    set({ isLoading: true, error: null });
    try {
      const response = await componentApi.getDeployments(params);
      
      // Validate and sanitize deployments
      const validDeployments = response
        .filter(isValidComponentDeployment)
        .map(sanitizeComponentDeployment);
      
      set({
        deployments: validDeployments,
        totalDeployments: response.total || validDeployments.length,
        isLoading: false
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch deployments',
        isLoading: false
      });
    }
  },

  createComponentType: async (typeData: CreateComponentTypeData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await componentApi.createComponentType(typeData);
      
      const newType = sanitizeComponentType(response);
      
      set(state => ({
        componentTypes: [...state.componentTypes, newType],
        totalTypes: state.totalTypes + 1,
        isLoading: false
      }));
      
      return newType;
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to create component type',
        isLoading: false
      });
      throw error;
    }
  },

  createDeployment: async (deploymentData: CreateDeploymentData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await componentApi.createDeployment(deploymentData);
      
      const newDeployment = sanitizeComponentDeployment(response);
      
      set(state => ({
        deployments: [...state.deployments, newDeployment],
        totalDeployments: state.totalDeployments + 1,
        isLoading: false
      }));
      
      return newDeployment;
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to create deployment',
        isLoading: false
      });
      throw error;
    }
  },

  updateDeployment: async (id: number, deploymentData: UpdateDeploymentData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await componentApi.updateDeployment(id, deploymentData);
      
      const updatedDeployment = sanitizeComponentDeployment(response);
      
      set(state => ({
        deployments: state.deployments.map(deployment => deployment.id === id ? updatedDeployment : deployment),
        isLoading: false
      }));
      
      return updatedDeployment;
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to update deployment',
        isLoading: false
      });
      throw error;
    }
  },

  deleteDeployment: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      await componentApi.deleteDeployment(id);
      
      set(state => ({
        deployments: state.deployments.filter(deployment => deployment.id !== id),
        totalDeployments: state.totalDeployments - 1,
        isLoading: false
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to delete deployment',
        isLoading: false
      });
      throw error;
    }
  },

  setSelectedType: (type: ComponentType | null) => {
    if (type && !isValidComponentType(type)) {
      console.warn('Invalid component type data provided to setSelectedType');
      return;
    }
    set({ selectedType: type });
  },

  setSelectedDeployment: (deployment: ComponentDeployment | null) => {
    if (deployment && !isValidComponentDeployment(deployment)) {
      console.warn('Invalid deployment data provided to setSelectedDeployment');
      return;
    }
    set({ selectedDeployment: deployment });
  },

  clearError: () => {
    set({ error: null });
  }
})); 