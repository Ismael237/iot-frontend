import { apiClient } from './axios-client';
import { ActuatorCommand, ActuatorDeployment, CommandStatus } from '../../domain/entities/actuator.entity';

export interface SendCommandRequest {
  command: string;
  parameters?: Record<string, any>;
}

export interface CommandsResponse {
  data: ActuatorCommand[];
  total: number;
}

export interface DeploymentStatusResponse {
  deploymentId: number;
  connectionStatus: string;
  lastInteraction?: string;
}

export interface ActuatorApi {
  sendCommand: (deploymentId: number, commandData: SendCommandRequest) => Promise<ActuatorCommand>;
  getCommands: (deploymentId: number, params?: { skip?: number; limit?: number }) => Promise<CommandsResponse>;
  getDeploymentStatus: (deploymentId: number) => Promise<DeploymentStatusResponse>;
}

export const actuatorApi: ActuatorApi = {
  sendCommand: async (deploymentId: number, commandData: SendCommandRequest) => {
    const response = await apiClient.post(`/actuators/${deploymentId}/command`, commandData);
    return response;
  },

  getCommands: async (deploymentId: number, params = {}) => {
    const { skip = 0, limit = 50 } = params;
    const queryParams = new URLSearchParams();
    
    if (skip !== undefined) queryParams.append('skip', skip.toString());
    if (limit !== undefined) queryParams.append('limit', limit.toString());
    
    const response = await apiClient.get(`/actuators/${deploymentId}/commands?${queryParams.toString()}`);
    return response;
  },

  getDeploymentStatus: async (deploymentId: number) => {
    const response = await apiClient.get(`/actuators/${deploymentId}/status`);
    return response;
  }
}; 