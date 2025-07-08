import { create } from 'zustand';
import type { ActuatorCommand, ActuatorDeployment, ActuatorState, CommandStatus } from '../entities/actuator.entity';
import { actuatorApi } from '../../infrastructure/api/actuator-api';
import { componentApi } from '../../infrastructure/api/component-api';

interface ActuatorStoreState {
  commands: ActuatorCommand[];
  deployments: ActuatorDeployment[];
  selectedDeployment: ActuatorDeployment | null;
  isLoading: boolean;
  error: string | null;
  totalCommands: number;
  
  // Actions
  fetchCommands: (params?: { deploymentId?: number; skip?: number; limit?: number }) => Promise<void>;
  sendCommand: (deploymentId: number, command: string, parameters?: Record<string, any>) => Promise<ActuatorCommand>;
  fetchDeploymentStatus: (deploymentId: number) => Promise<{ deploymentId: number; connectionStatus: string; lastInteraction?: string }>;
  fetchActuatorDeployments: (params?: { deviceId?: number; activeOnly?: boolean }) => Promise<void>;
  setSelectedDeployment: (deployment: ActuatorDeployment | null) => void;
  clearError: () => void;
}

// Validation utilities
const isValidActuatorDeployment = (deployment: any): deployment is ActuatorDeployment => {
  return (
    deployment &&
    typeof deployment.deploymentId === 'number' &&
    deployment.componentType &&
    deployment.componentType.category === 'actuator' &&
    deployment.device
  );
};

const isValidActuatorCommand = (command: any): command is ActuatorCommand => {
  return (
    command &&
    typeof command.actuatorCommandId === 'number' &&
    typeof command.deploymentId === 'number' &&
    typeof command.command === 'string'
  );
};

const sanitizeDeployment = (deployment: any): ActuatorDeployment => {
  if (!isValidActuatorDeployment(deployment)) {
    throw new Error('Invalid actuator deployment data');
  }

  return {
    deploymentId: deployment.deploymentId,
    componentTypeId: deployment.componentTypeId,
    deviceId: deployment.deviceId,
    name: deployment.name || deployment.componentType?.name ||deployment.componentType?.identifier || 'Unknown Actuator',
    description: deployment.description || deployment.componentType?.description || '',
    connectionStatus: deployment.connectionStatus || 'unknown',
    lastValue: deployment.lastValue || 0,
    lastValueTs: deployment.lastValueTs || new Date().toISOString(),
    location: deployment.location || deployment.device?.identifier || '',
    unit: deployment.unit || deployment.componentType?.unit,
    active: deployment.active ?? true,
    createdAt: deployment.createdAt || new Date().toISOString(),
    updatedAt: deployment.updatedAt || new Date().toISOString(),
    componentType: {
      id: deployment.componentType.id || 0,
      name: deployment.componentType.name || 'Unknown Type',
      identifier: deployment.componentType.identifier || 'unknown',
      category: deployment.componentType.category || 'actuator',
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

const sanitizeCommand = (command: any): ActuatorCommand => {
  if (!isValidActuatorCommand(command)) {
    throw new Error('Invalid actuator command data');
  }

  return {
    actuatorCommandId: command.actuatorCommandId,
    deploymentId: command.deploymentId,
    command: command.command,
    parameters: command.parameters || {},
    status: command.status as CommandStatus,
    executedAt: command.executedAt,
    createdAt: command.createdAt,
  };
};

export const useActuatorStore = create<ActuatorStoreState>((set, get) => ({
  commands: [],
  deployments: [],
  selectedDeployment: null,
  isLoading: false,
  error: null,
  totalCommands: 0,

  fetchCommands: async (params = {}) => {
    set({ isLoading: true, error: null });
    try {
      const { deploymentId, skip = 0, limit = 50 } = params;
      
      if (!deploymentId) {
        throw new Error('Deployment ID is required to fetch commands');
      }
      
      const response = await actuatorApi.getCommands(deploymentId, { skip, limit })
      
      set({
        commands: response.data,
        totalCommands: response.count || response.data.length,
        isLoading: false
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch commands',
        isLoading: false
      });
    }
  },

  sendCommand: async (deploymentId: number, command: string, parameters?: Record<string, any>) => {
    set({ isLoading: true, error: null });
    try {
      const response = await actuatorApi.sendCommand(deploymentId, { command, parameters });
      
      const newCommand = sanitizeCommand(response);
      
      set(state => ({
        commands: [newCommand, ...state.commands],
        totalCommands: state.totalCommands + 1,
        isLoading: false
      }));
      
      return newCommand;
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to send command',
        isLoading: false
      });
      throw error;
    }
  },

  fetchDeploymentStatus: async (deploymentId: number) => {
    try {
      const response = await actuatorApi.getDeploymentStatus(deploymentId);
      return response;
    } catch (error) {
      throw error;
    }
  },

  fetchActuatorDeployments: async (params = {}) => {
    set({ isLoading: true, error: null });
    try {
      const { deviceId, activeOnly = true } = params;
      
      // Use component API to fetch deployments filtered by actuator category
      const response = await componentApi.getDeployments({ 
        deviceId, 
        activeOnly
      });
      
      // Filter for actuator deployments and validate/sanitize
      const validDeployments = response
        .filter((deployment: any) => deployment.componentType?.category === 'actuator')
        .filter(isValidActuatorDeployment)
        .map(sanitizeDeployment);
      
      set({
        deployments: validDeployments,
        isLoading: false
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch actuator deployments',
        isLoading: false
      });
    }
  },

  setSelectedDeployment: (deployment: ActuatorDeployment | null) => {
    if (deployment && !isValidActuatorDeployment(deployment)) {
      console.warn('Invalid deployment data provided to setSelectedDeployment');
      return;
    }
    set({ selectedDeployment: deployment });
  },

  clearError: () => {
    set({ error: null });
  }
})); 