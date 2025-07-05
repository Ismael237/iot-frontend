import { create } from 'zustand';
import { IotDevice, DeviceTypeEnum, ConnStatus } from '../entities/device.entity';

interface DeviceState {
  devices: IotDevice[];
  selectedDevice: IotDevice | null;
  isLoading: boolean;
  error: string | null;
  totalDevices: number;
  
  // Actions
  fetchDevices: (params?: { skip?: number; limit?: number; deviceType?: DeviceTypeEnum; activeOnly?: boolean; search?: string }) => Promise<void>;
  fetchDeviceById: (id: number) => Promise<IotDevice | null>;
  createDevice: (deviceData: CreateDeviceData) => Promise<IotDevice>;
  updateDevice: (id: number, deviceData: UpdateDeviceData) => Promise<IotDevice>;
  deleteDevice: (id: number) => Promise<void>;
  fetchDeviceStatus: (id: number) => Promise<{ deviceId: number; status: ConnStatus; lastSeen?: string }>;
  setSelectedDevice: (device: IotDevice | null) => void;
  clearError: () => void;
}

interface CreateDeviceData {
  identifier: string;
  deviceType: DeviceTypeEnum;
  model?: string;
  ipAddress?: string;
  port?: number;
  active: boolean;
}

interface UpdateDeviceData {
  model?: string;
  ipAddress?: string;
  port?: number;
  active?: boolean;
}

export const useDeviceStore = create<DeviceState>((set, get) => ({
  devices: [],
  selectedDevice: null,
  isLoading: false,
  error: null,
  totalDevices: 0,

  fetchDevices: async (params = {}) => {
    set({ isLoading: true, error: null });
    try {
      // Mock API call - replace with actual API
      const { skip = 0, limit = 20, deviceType, activeOnly = true, search } = params;
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock data
      const mockDevices: IotDevice[] = [
        {
          id: 1,
          identifier: 'GATEWAY-001',
          deviceType: DeviceTypeEnum.GATEWAY,
          model: 'IoT Gateway Pro',
          ipAddress: '192.168.1.100',
          port: 8080,
          active: true,
          status: ConnStatus.CONNECTED,
          lastSeen: new Date().toISOString(),
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
          componentDeployments: []
        },
        {
          id: 2,
          identifier: 'SENSOR-001',
          deviceType: DeviceTypeEnum.SENSOR_NODE,
          model: 'Temperature Sensor',
          ipAddress: '192.168.1.101',
          port: 8081,
          active: true,
          status: ConnStatus.CONNECTED,
          lastSeen: new Date().toISOString(),
          createdAt: '2024-01-02T00:00:00Z',
          updatedAt: '2024-01-02T00:00:00Z',
          componentDeployments: []
        },
        {
          id: 3,
          identifier: 'ACTUATOR-001',
          deviceType: DeviceTypeEnum.ACTUATOR_NODE,
          model: 'Smart Relay',
          ipAddress: '192.168.1.102',
          port: 8082,
          active: true,
          status: ConnStatus.CONNECTED,
          lastSeen: new Date().toISOString(),
          createdAt: '2024-01-03T00:00:00Z',
          updatedAt: '2024-01-03T00:00:00Z',
          componentDeployments: []
        },
        {
          id: 4,
          identifier: 'CONTROLLER-001',
          deviceType: DeviceTypeEnum.CONTROLLER,
          model: 'IoT Controller',
          ipAddress: '192.168.1.103',
          port: 8083,
          active: false,
          status: ConnStatus.DISCONNECTED,
          lastSeen: '2024-01-15T10:30:00Z',
          createdAt: '2024-01-04T00:00:00Z',
          updatedAt: '2024-01-15T10:30:00Z',
          componentDeployments: []
        }
      ];

      let filteredDevices = mockDevices;
      
      if (deviceType) {
        filteredDevices = filteredDevices.filter(device => device.deviceType === deviceType);
      }
      
      if (activeOnly) {
        filteredDevices = filteredDevices.filter(device => device.active);
      }
      
      if (search) {
        filteredDevices = filteredDevices.filter(device => 
          device.identifier.toLowerCase().includes(search.toLowerCase()) ||
          device.model?.toLowerCase().includes(search.toLowerCase()) ||
          device.ipAddress?.includes(search)
        );
      }

      const paginatedDevices = filteredDevices.slice(skip, skip + limit);
      
      set({
        devices: paginatedDevices,
        totalDevices: filteredDevices.length,
        isLoading: false
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch devices',
        isLoading: false
      });
    }
  },

  fetchDeviceById: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      // Mock API call - replace with actual API
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const mockDevice: IotDevice = {
        id,
        identifier: `DEVICE-${id.toString().padStart(3, '0')}`,
        deviceType: DeviceTypeEnum.SENSOR_NODE,
        model: 'Generic IoT Device',
        ipAddress: `192.168.1.${100 + id}`,
        port: 8080 + id,
        active: true,
        status: ConnStatus.CONNECTED,
        lastSeen: new Date().toISOString(),
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        componentDeployments: []
      };
      
      set({ isLoading: false });
      return mockDevice;
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch device',
        isLoading: false
      });
      return null;
    }
  },

  createDevice: async (deviceData: CreateDeviceData) => {
    set({ isLoading: true, error: null });
    try {
      // Mock API call - replace with actual API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newDevice: IotDevice = {
        id: Date.now(),
        ...deviceData,
        status: ConnStatus.UNKNOWN,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        componentDeployments: []
      };
      
      set(state => ({
        devices: [...state.devices, newDevice],
        totalDevices: state.totalDevices + 1,
        isLoading: false
      }));
      
      return newDevice;
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to create device',
        isLoading: false
      });
      throw error;
    }
  },

  updateDevice: async (id: number, deviceData: UpdateDeviceData) => {
    set({ isLoading: true, error: null });
    try {
      // Mock API call - replace with actual API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const updatedDevice: IotDevice = {
        id,
        identifier: `DEVICE-${id.toString().padStart(3, '0')}`,
        deviceType: DeviceTypeEnum.SENSOR_NODE,
        model: deviceData.model || 'Generic IoT Device',
        ipAddress: deviceData.ipAddress || `192.168.1.${100 + id}`,
        port: deviceData.port || 8080 + id,
        active: deviceData.active ?? true,
        status: ConnStatus.CONNECTED,
        lastSeen: new Date().toISOString(),
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: new Date().toISOString(),
        componentDeployments: []
      };
      
      set(state => ({
        devices: state.devices.map(device => device.id === id ? updatedDevice : device),
        isLoading: false
      }));
      
      return updatedDevice;
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to update device',
        isLoading: false
      });
      throw error;
    }
  },

  deleteDevice: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      // Mock API call - replace with actual API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      set(state => ({
        devices: state.devices.filter(device => device.id !== id),
        totalDevices: state.totalDevices - 1,
        isLoading: false
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to delete device',
        isLoading: false
      });
      throw error;
    }
  },

  fetchDeviceStatus: async (id: number) => {
    try {
      // Mock API call - replace with actual API
      await new Promise(resolve => setTimeout(resolve, 200));
      
      return {
        deviceId: id,
        status: ConnStatus.CONNECTED,
        lastSeen: new Date().toISOString()
      };
    } catch (error) {
      throw error;
    }
  },

  setSelectedDevice: (device: IotDevice | null) => {
    set({ selectedDevice: device });
  },

  clearError: () => {
    set({ error: null });
  }
})); 