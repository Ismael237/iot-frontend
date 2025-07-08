import { create } from 'zustand';
import type { IotDevice, DeviceTypeEnum, ConnStatus } from '../../shared/types/api.types';
import { deviceApi } from '../../infrastructure/api/device-api';

interface DeviceStoreState {
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

// Validation utilities
const isValidDevice = (device: any): device is IotDevice => {
  return (
    device &&
    typeof device.id === 'number' &&
    typeof device.identifier === 'string' &&
    typeof device.deviceType === 'string' &&
    typeof device.active === 'boolean'
  );
};

const sanitizeDevice = (device: any): IotDevice => {
  if (!isValidDevice(device)) {
    throw new Error('Invalid device data');
  }

  return {
    id: device.id,
    identifier: device.identifier,
    deviceType: device.deviceType as DeviceTypeEnum,
    model: device.model,
    ipAddress: device.ipAddress,
    port: device.port,
    active: device.active,
    status: device.status as ConnStatus,
    lastSeen: device.lastSeen,
    createdAt: device.createdAt || new Date().toISOString(),
    updatedAt: device.updatedAt || new Date().toISOString(),
    componentDeployments: device.componentDeployments || [],
  };
};

export const useDeviceStore = create<DeviceStoreState>((set, get) => ({
  devices: [],
  selectedDevice: null,
  isLoading: false,
  error: null,
  totalDevices: 0,

  fetchDevices: async (params = {}) => {
    set({ isLoading: true, error: null });
    try {
      const response = await deviceApi.getDevices(params);
      
      // Validate and sanitize devices
      const validDevices = response
        .filter(isValidDevice)
        .map(sanitizeDevice);

      set({
        devices: validDevices,
        totalDevices: response.total || validDevices.length,
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
      const response = await deviceApi.getDeviceById(id);
      
      const device = sanitizeDevice(response);
      
      set({ isLoading: false });
      return device;
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
      const response = await deviceApi.createDevice(deviceData);
      
      const newDevice = sanitizeDevice(response);
      
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
      const response = await deviceApi.updateDevice(id, deviceData);
      
      const updatedDevice = sanitizeDevice(response);
      
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
      await deviceApi.deleteDevice(id);
      
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
      const response = await deviceApi.getDeviceStatus(id);
      return response;
    } catch (error) {
      throw error;
    }
  },

  setSelectedDevice: (device: IotDevice | null) => {
    if (device && !isValidDevice(device)) {
      console.warn('Invalid device data provided to setSelectedDevice');
      return;
    }
    set({ selectedDevice: device });
  },

  clearError: () => {
    set({ error: null });
  }
})); 