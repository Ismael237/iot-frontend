import { create } from 'zustand';
import { ComponentType, ComponentDeployment } from '../entities/component.entity';

interface ComponentState {
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

export const useComponentStore = create<ComponentState>((set, get) => ({
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
      // Mock API call - replace with actual API
      const { category, search } = params;
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock data
      const mockTypes: ComponentType[] = [
        {
          id: 1,
          name: 'Temperature Sensor',
          identifier: 'TEMP_SENSOR',
          category: 'sensor',
          unit: '°C',
          description: 'Digital temperature sensor with high accuracy',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z'
        },
        {
          id: 2,
          name: 'Humidity Sensor',
          identifier: 'HUMIDITY_SENSOR',
          category: 'sensor',
          unit: '%',
          description: 'Relative humidity sensor',
          createdAt: '2024-01-02T00:00:00Z',
          updatedAt: '2024-01-02T00:00:00Z'
        },
        {
          id: 3,
          name: 'Relay Switch',
          identifier: 'RELAY_SWITCH',
          category: 'actuator',
          description: 'Digital relay for controlling electrical devices',
          createdAt: '2024-01-03T00:00:00Z',
          updatedAt: '2024-01-03T00:00:00Z'
        },
        {
          id: 4,
          name: 'Servo Motor',
          identifier: 'SERVO_MOTOR',
          category: 'actuator',
          unit: 'degrees',
          description: 'Precision servo motor for position control',
          createdAt: '2024-01-04T00:00:00Z',
          updatedAt: '2024-01-04T00:00:00Z'
        }
      ];

      let filteredTypes = mockTypes;
      
      if (category) {
        filteredTypes = filteredTypes.filter(type => type.category === category);
      }
      
      if (search) {
        filteredTypes = filteredTypes.filter(type => 
          type.name.toLowerCase().includes(search.toLowerCase()) ||
          type.identifier.toLowerCase().includes(search.toLowerCase()) ||
          type.description?.toLowerCase().includes(search.toLowerCase())
        );
      }
      
      set({
        componentTypes: filteredTypes,
        totalTypes: filteredTypes.length,
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
      // Mock API call - replace with actual API
      const { deviceId, componentTypeId, activeOnly = true } = params;
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock data
      const mockDeployments: ComponentDeployment[] = [
        {
          id: 1,
          componentTypeId: 1,
          deviceId: 1,
          active: true,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
          componentType: {
            id: 1,
            name: 'Temperature Sensor',
            identifier: 'TEMP_SENSOR',
            category: 'sensor',
            unit: '°C',
            description: 'Digital temperature sensor with high accuracy',
            createdAt: '2024-01-01T00:00:00Z',
            updatedAt: '2024-01-01T00:00:00Z'
          },
          device: {
            id: 1,
            identifier: 'GATEWAY-001',
            deviceType: 'gateway' as any,
            model: 'IoT Gateway Pro',
            ipAddress: '192.168.1.100',
            port: 8080,
            active: true,
            status: 'connected' as any,
            lastSeen: new Date().toISOString(),
            createdAt: '2024-01-01T00:00:00Z',
            updatedAt: '2024-01-01T00:00:00Z',
            componentDeployments: []
          }
        },
        {
          id: 2,
          componentTypeId: 2,
          deviceId: 2,
          active: true,
          createdAt: '2024-01-02T00:00:00Z',
          updatedAt: '2024-01-02T00:00:00Z',
          componentType: {
            id: 2,
            name: 'Humidity Sensor',
            identifier: 'HUMIDITY_SENSOR',
            category: 'sensor',
            unit: '%',
            description: 'Relative humidity sensor',
            createdAt: '2024-01-02T00:00:00Z',
            updatedAt: '2024-01-02T00:00:00Z'
          },
          device: {
            id: 2,
            identifier: 'SENSOR-001',
            deviceType: 'sensor_node' as any,
            model: 'Temperature Sensor',
            ipAddress: '192.168.1.101',
            port: 8081,
            active: true,
            status: 'connected' as any,
            lastSeen: new Date().toISOString(),
            createdAt: '2024-01-02T00:00:00Z',
            updatedAt: '2024-01-02T00:00:00Z',
            componentDeployments: []
          }
        }
      ];

      let filteredDeployments = mockDeployments;
      
      if (deviceId) {
        filteredDeployments = filteredDeployments.filter(deployment => deployment.deviceId === deviceId);
      }
      
      if (componentTypeId) {
        filteredDeployments = filteredDeployments.filter(deployment => deployment.componentTypeId === componentTypeId);
      }
      
      if (activeOnly) {
        filteredDeployments = filteredDeployments.filter(deployment => deployment.active);
      }
      
      set({
        deployments: filteredDeployments,
        totalDeployments: filteredDeployments.length,
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
      // Mock API call - replace with actual API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newType: ComponentType = {
        id: Date.now(),
        ...typeData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
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
      // Mock API call - replace with actual API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newDeployment: ComponentDeployment = {
        id: Date.now(),
        ...deploymentData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        componentType: {
          id: deploymentData.componentTypeId,
          name: 'Mock Component',
          identifier: 'MOCK_COMP',
          category: 'sensor',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z'
        },
        device: {
          id: deploymentData.deviceId,
          identifier: 'MOCK_DEVICE',
          deviceType: 'sensor_node' as any,
          active: true,
          status: 'connected' as any,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
          componentDeployments: []
        }
      };
      
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
      // Mock API call - replace with actual API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      set(state => ({
        deployments: state.deployments.map(deployment => 
          deployment.id === id 
            ? { ...deployment, ...deploymentData, updatedAt: new Date().toISOString() }
            : deployment
        ),
        isLoading: false
      }));
      
      const updatedDeployment = get().deployments.find(d => d.id === id);
      return updatedDeployment!;
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
      // Mock API call - replace with actual API
      await new Promise(resolve => setTimeout(resolve, 500));
      
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
    set({ selectedType: type });
  },

  setSelectedDeployment: (deployment: ComponentDeployment | null) => {
    set({ selectedDeployment: deployment });
  },

  clearError: () => {
    set({ error: null });
  }
})); 