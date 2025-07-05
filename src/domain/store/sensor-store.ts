import { create } from 'zustand';
import { SensorReading, SensorStats, SensorDeployment } from '../entities/sensor.entity';

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
  fetchReadings: (params?: { deploymentId?: number; skip?: number; limit?: number; startDate?: string; endDate?: string }) => Promise<void>;
  fetchLatestReadings: (params?: { deploymentId?: number }) => Promise<void>;
  fetchAggregatedReadings: (params?: { deploymentId?: number; hours?: number; interval?: string }) => Promise<void>;
  fetchSensorStats: (params?: { deploymentId?: number; days?: number }) => Promise<void>;
  fetchSensorDeployments: (params?: { deviceId?: number; activeOnly?: boolean }) => Promise<void>;
  setSelectedDeployment: (deployment: SensorDeployment | null) => void;
  clearError: () => void;
}

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
      // Mock API call - replace with actual API
      const { deploymentId, skip = 0, limit = 100, startDate, endDate } = params;
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock data
      const mockReadings: SensorReading[] = Array.from({ length: 50 }, (_, i) => ({
        id: i + 1,
        sensorId: deploymentId || 1,
        value: Math.random() * 100,
        timestamp: new Date(Date.now() - i * 60000).toISOString(),
        quality: ['excellent', 'good', 'fair', 'poor'][Math.floor(Math.random() * 4)] as any,
        metadata: {
          battery: Math.random() * 100,
          signal: Math.random() * 100
        }
      }));
      
      set({
        readings: mockReadings,
        totalReadings: mockReadings.length,
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
      // Mock API call - replace with actual API
      const { deploymentId } = params;
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Mock data
      const mockLatestReadings: SensorReading[] = [
        {
          id: 1,
          sensorId: deploymentId || 1,
          value: 23.5,
          timestamp: new Date().toISOString(),
          quality: 'excellent',
          metadata: {
            battery: 85,
            signal: 92
          }
        }
      ];
      
      set({
        readings: mockLatestReadings,
        isLoading: false
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch latest readings',
        isLoading: false
      });
    }
  },

  fetchAggregatedReadings: async (params = {}) => {
    set({ isLoading: true, error: null });
    try {
      // Mock API call - replace with actual API
      const { deploymentId, hours = 24, interval = 'hour' } = params;
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 400));
      
      // Mock aggregated data
      const timestamps = Array.from({ length: hours }, (_, i) => 
        new Date(Date.now() - (hours - i - 1) * 60 * 60 * 1000).toISOString()
      );
      
      const values = timestamps.map(() => Math.random() * 100);
      const avgValues = timestamps.map(() => Math.random() * 100);
      
      // Store aggregated data in a way that can be used by charts
      set({
        isLoading: false
      });
      
      return { timestamps, values, avgValues };
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
      // Mock API call - replace with actual API
      const { deploymentId, days = 7 } = params;
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 400));
      
      // Mock stats data
      const mockStats: SensorStats[] = [
        {
          sensorId: deploymentId || 1,
          sensorName: 'Temperature Sensor',
          sensorType: 'temperature' as any,
          minValue: 18.5,
          maxValue: 28.3,
          avgValue: 23.4,
          lastReading: 24.1,
          lastReadingTime: new Date().toISOString(),
          readingCount: 1008,
          status: 'online' as any
        },
        {
          sensorId: deploymentId || 2,
          sensorName: 'Humidity Sensor',
          sensorType: 'humidity' as any,
          minValue: 45.2,
          maxValue: 78.9,
          avgValue: 62.3,
          lastReading: 65.7,
          lastReadingTime: new Date().toISOString(),
          readingCount: 1008,
          status: 'online' as any
        }
      ];
      
      set({
        stats: mockStats,
        totalStats: mockStats.length,
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
      // Mock API call - replace with actual API
      const { deviceId, activeOnly = true } = params;
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock deployments data
      const mockDeployments: SensorDeployment[] = [
        {
          id: 1,
          componentTypeId: 1,
          deviceId: deviceId || 1,
          name: 'Temperature Sensor 1',
          description: 'Main temperature sensor in zone A',
          location: 'Zone A - Room 101',
          unit: '°C',
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
            id: deviceId || 1,
            identifier: 'SENSOR-001',
            deviceType: 'sensor_node' as any,
            model: 'Temperature Sensor Pro',
            ipAddress: '192.168.1.101',
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
          componentTypeId: 2,
          deviceId: deviceId || 2,
          name: 'Humidity Sensor 1',
          description: 'Main humidity sensor in zone A',
          location: 'Zone A - Room 101',
          unit: '%',
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
            id: deviceId || 2,
            identifier: 'SENSOR-002',
            deviceType: 'sensor_node' as any,
            model: 'Humidity Sensor Pro',
            ipAddress: '192.168.1.102',
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
        error: error instanceof Error ? error.message : 'Failed to fetch sensor deployments',
        isLoading: false
      });
    }
  },

  setSelectedDeployment: (deployment: SensorDeployment | null) => {
    set({ selectedDeployment: deployment });
  },

  clearError: () => {
    set({ error: null });
  }
})); 