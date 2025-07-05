import { create } from 'zustand';
import { ActuatorCommand, ActuatorDeployment, ActuatorState, CommandStatus } from '../entities/actuator.entity';

interface ActuatorState {
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

export const useActuatorStore = create<ActuatorState>((set, get) => ({
  commands: [],
  deployments: [],
  selectedDeployment: null,
  isLoading: false,
  error: null,
  totalCommands: 0,

  fetchCommands: async (params = {}) => {
    set({ isLoading: true, error: null });
    try {
      // Mock API call - replace with actual API
      const { deploymentId, skip = 0, limit = 50 } = params;
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock data
      const mockCommands: ActuatorCommand[] = Array.from({ length: 20 }, (_, i) => ({
        id: i + 1,
        actuatorId: deploymentId || 1,
        command: ['on', 'off', 'toggle', 'set_position'][Math.floor(Math.random() * 4)],
        parameters: Math.random() > 0.5 ? { position: Math.floor(Math.random() * 100) } : undefined,
        status: ['completed', 'pending', 'failed', 'executing'][Math.floor(Math.random() * 4)] as CommandStatus,
        executedAt: new Date(Date.now() - i * 300000).toISOString(),
        completedAt: Math.random() > 0.3 ? new Date(Date.now() - i * 300000 + 5000).toISOString() : undefined,
        result: Math.random() > 0.3 ? 'Command executed successfully' : undefined,
        error: Math.random() > 0.8 ? 'Connection timeout' : undefined,
        createdAt: new Date(Date.now() - i * 300000).toISOString()
      }));
      
      set({
        commands: mockCommands,
        totalCommands: mockCommands.length,
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
      // Mock API call - replace with actual API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newCommand: ActuatorCommand = {
        id: Date.now(),
        actuatorId: deploymentId,
        command,
        parameters,
        status: CommandStatus.COMPLETED,
        executedAt: new Date().toISOString(),
        completedAt: new Date().toISOString(),
        result: 'Command executed successfully',
        createdAt: new Date().toISOString()
      };
      
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
      // Mock API call - replace with actual API
      await new Promise(resolve => setTimeout(resolve, 200));
      
      return {
        deploymentId,
        connectionStatus: 'connected',
        lastInteraction: new Date().toISOString()
      };
    } catch (error) {
      throw error;
    }
  },

  fetchActuatorDeployments: async (params = {}) => {
    set({ isLoading: true, error: null });
    try {
      // Mock API call - replace with actual API
      const { deviceId, activeOnly = true } = params;
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock deployments data
      const mockDeployments: ActuatorDeployment[] = [
        {
          id: 1,
          componentTypeId: 3,
          deviceId: deviceId || 1,
          name: 'Relay Switch 1',
          description: 'Main power relay for zone A',
          location: 'Zone A - Electrical Panel',
          active: true,
          currentState: ActuatorState.OFF,
          lastInteraction: new Date().toISOString(),
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
          componentType: {
            id: 3,
            name: 'Relay Switch',
            identifier: 'RELAY_SWITCH',
            category: 'actuator',
            description: 'Digital relay for controlling electrical devices',
            createdAt: '2024-01-01T00:00:00Z',
            updatedAt: '2024-01-01T00:00:00Z'
          },
          device: {
            id: deviceId || 1,
            identifier: 'ACTUATOR-001',
            deviceType: 'actuator_node' as any,
            model: 'Smart Relay Pro',
            ipAddress: '192.168.1.201',
            port: 8081,
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
          componentTypeId: 4,
          deviceId: deviceId || 2,
          name: 'Servo Motor 1',
          description: 'Ventilation damper control',
          location: 'Zone A - HVAC System',
          active: true,
          currentState: ActuatorState.POSITION_50,
          lastInteraction: new Date().toISOString(),
          createdAt: '2024-01-02T00:00:00Z',
          updatedAt: '2024-01-02T00:00:00Z',
          componentType: {
            id: 4,
            name: 'Servo Motor',
            identifier: 'SERVO_MOTOR',
            category: 'actuator',
            unit: 'degrees',
            description: 'Precision servo motor for position control',
            createdAt: '2024-01-02T00:00:00Z',
            updatedAt: '2024-01-02T00:00:00Z'
          },
          device: {
            id: deviceId || 2,
            identifier: 'ACTUATOR-002',
            deviceType: 'actuator_node' as any,
            model: 'Servo Controller Pro',
            ipAddress: '192.168.1.202',
            port: 8082,
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
      
      if (activeOnly) {
        filteredDeployments = filteredDeployments.filter(deployment => deployment.active);
      }
      
      set({
        deployments: filteredDeployments,
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
    set({ selectedDeployment: deployment });
  },

  clearError: () => {
    set({ error: null });
  }
})); 