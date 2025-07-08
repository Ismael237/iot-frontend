import { create } from 'zustand';
import type { SensorReading, SensorStats, SensorDeployment } from '../entities/sensor.entity';
import { sensorApi, type SensorReadingsParams, type AggregatedReadingsParams, type SensorStatsParams, type SensorDeploymentsParams } from '../../infrastructure/api/sensor-api';

interface SensorState {
  readings: SensorReading[];
  stats: SensorStats[];
  deployments: SensorDeployment[];
  selectedDeployment: SensorDeployment | null;
  isLoading: boolean;
  error: string | null;
  totalReadings: number;
  totalStats: number;
  
  // Actions
  fetchReadings: (params?: SensorReadingsParams) => Promise<void>;
  fetchLatestReadings: (params?: { deploymentId?: number }) => Promise<void>;
  fetchAggregatedReadings: (params?: AggregatedReadingsParams) => Promise<any>;
  fetchSensorStats: (params?: SensorStatsParams) => Promise<void>;
  fetchSensorDeployments: (params?: SensorDeploymentsParams) => Promise<SensorDeployment[]>;
  setSelectedDeployment: (deployment: SensorDeployment | null) => void;
  clearError: () => void;
}

// Validation utilities
const isValidSensorDeployment = (deployment: any): deployment is SensorDeployment => {
  return (
    deployment &&
    typeof deployment.deploymentId === 'number' &&
    deployment.componentType &&
    deployment.componentType.category === 'sensor' &&
    deployment.device
  );
};

const isValidSensorReading = (reading: any): reading is SensorReading => {
  return (
    reading &&
    typeof reading.readingId === 'number' &&
    typeof reading.sensorId === 'number' &&
    typeof reading.value === 'number' &&
    typeof reading.timestamp === 'string'
  );
};

const sanitizeDeployment = (deployment: any): SensorDeployment => {
  if (!isValidSensorDeployment(deployment)) {
    throw new Error('Invalid sensor deployment data');
  }

  return {
    deploymentId: deployment.deploymentId,
    componentTypeId: deployment.componentTypeId,
    deviceId: deployment.deviceId,
    name: deployment.name || deployment.componentType?.name || 'Unknown Sensor',
    description: deployment.description || deployment.componentType?.description || '',
    location: deployment.location || deployment.device?.identifier || '',
    unit: deployment.unit || deployment.componentType?.unit || '°C',
    lastIteration: deployment.lastIteration,
    connectionStatus: deployment.connectionStatus,
    lastValue: deployment.lastValue,
    lastValueTs: deployment.lastValueTs,
    active: deployment.active ?? true,
    createdAt: deployment.createdAt || new Date().toISOString(),
    updatedAt: deployment.updatedAt || new Date().toISOString(),
    componentType: {
      id: deployment.componentType.id || 0,
      name: deployment.componentType.name || 'Unknown Type',
      identifier: deployment.componentType.identifier || 'unknown',
      category: deployment.componentType.category || 'sensor',
      unit: deployment.componentType.unit || '°C',
      description: deployment.componentType.description || '',
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

const sanitizeReading = (reading: any): SensorReading => {
  if (!isValidSensorReading(reading)) {
    throw new Error('Invalid sensor reading data');
  }

  return {
    readingId: reading.readingId,
    sensorId: reading.sensorId,
    value: reading.value,
    timestamp: reading.timestamp,
  };
};

export const useSensorStore = create<SensorState>((set, get) => ({
  readings: [],
  stats: [],
  deployments: [],
  selectedDeployment: null,
  isLoading: false,
  error: null,
  totalReadings: 0,
  totalStats: 0,

  fetchReadings: async (params = {}) => {
    set({ isLoading: true, error: null });
    try {
      const response = await sensorApi.getReadings(params);
      
      // Validate and sanitize readings
      const validReadings = response
        .filter(isValidSensorReading)
        .map(sanitizeReading);

      set({
        readings: validReadings,
        totalReadings: response.total || validReadings.length,
        isLoading: false
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch readings',
        isLoading: false
      });
    }
  },

  fetchLatestReadings: async (params = {}) => {
    set({ isLoading: true, error: null });
    try {
      const response = await sensorApi.getLatestReadings(params);
      
      // Validate and sanitize readings
      const validReadings = response
        .filter(isValidSensorReading)
        .map(sanitizeReading);

      set({
        readings: validReadings,
        totalReadings: response.total || validReadings.length,
        isLoading: false
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch latest readings',
        isLoading: false
      });
    }
  },

  fetchAggregatedReadings: async (params = { interval: 'hour' }) => {
    set({ isLoading: true, error: null });
    try {
      const response = await sensorApi.getAggregatedReadings(params);
      set({
        isLoading: false
      });
      
      return response;
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch aggregated readings',
        isLoading: false
      });
    }
  },

  fetchSensorStats: async (params = {}) => {
    set({ isLoading: true, error: null });
    try {
      const { deploymentId, days = 7 } = params;
      
      if (!deploymentId) {
        throw new Error('Deployment ID is required for sensor stats');
      }
      
      const response = await sensorApi.getSensorStats(deploymentId, { days });
      
      // Validate stats data
      const validStats = response.filter((stat: any) => 
        stat && typeof stat.sensorId === 'number' && typeof stat.sensorName === 'string'
      );

      set({
        stats: validStats,
        totalStats: response.total || validStats.length,
        isLoading: false
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch sensor stats',
        isLoading: false
      });
    }
  },

  fetchSensorDeployments: async (params = {}) => {
    set({ isLoading: true, error: null });
    try {
      const response = await sensorApi.getSensorDeployments(params);
      
      // Validate and sanitize deployments
      const validDeployments = response
        .filter(isValidSensorDeployment)
        .map(sanitizeDeployment);

      
      set({
        deployments: validDeployments,
        isLoading: false
      });
      return validDeployments;
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch sensor deployments',
        isLoading: false
      });
    }
  },

  setSelectedDeployment: (deployment: SensorDeployment | null) => {
    if (deployment && !isValidSensorDeployment(deployment)) {
      console.warn('Invalid deployment data provided to setSelectedDeployment');
      return;
    }
    set({ selectedDeployment: deployment });
  },

  clearError: () => {
    set({ error: null });
  }
})); 