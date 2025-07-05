import { apiClient } from './axios-client';
import { IotDevice, DeviceTypeEnum, ConnStatus } from '../../domain/entities/device.entity';

export interface CreateDeviceRequest {
  identifier: string;
  deviceType: DeviceTypeEnum;
  model?: string;
  ipAddress?: string;
  port?: number;
  active: boolean;
}

export interface UpdateDeviceRequest {
  model?: string;
  ipAddress?: string;
  port?: number;
  active?: boolean;
}

export interface DevicesResponse {
  data: IotDevice[];
  total: number;
}

export interface DeviceStatusResponse {
  deviceId: number;
  status: ConnStatus;
  lastSeen?: string;
}

export interface DeviceApi {
  getDevices: (params?: { skip?: number; limit?: number; deviceType?: DeviceTypeEnum; activeOnly?: boolean; search?: string }) => Promise<DevicesResponse>;
  getDeviceById: (id: number) => Promise<IotDevice>;
  createDevice: (deviceData: CreateDeviceRequest) => Promise<IotDevice>;
  updateDevice: (id: number, deviceData: UpdateDeviceRequest) => Promise<IotDevice>;
  deleteDevice: (id: number) => Promise<{ success: boolean }>;
  getDeviceStatus: (id: number) => Promise<DeviceStatusResponse>;
}

export const deviceApi: DeviceApi = {
  getDevices: async (params = {}) => {
    const { skip = 0, limit = 20, deviceType, activeOnly = true, search } = params;
    const queryParams = new URLSearchParams();
    
    if (skip !== undefined) queryParams.append('skip', skip.toString());
    if (limit !== undefined) queryParams.append('limit', limit.toString());
    if (deviceType) queryParams.append('device_type', deviceType);
    if (activeOnly !== undefined) queryParams.append('active_only', activeOnly.toString());
    if (search) queryParams.append('search', search);
    
    const response = await apiClient.get(`/devices?${queryParams.toString()}`);
    return response;
  },

  getDeviceById: async (id: number) => {
    const response = await apiClient.get(`/devices/${id}`);
    return response;
  },

  createDevice: async (deviceData: CreateDeviceRequest) => {
    const response = await apiClient.post('/devices', deviceData);
    return response;
  },

  updateDevice: async (id: number, deviceData: UpdateDeviceRequest) => {
    const response = await apiClient.patch(`/devices/${id}`, deviceData);
    return response;
  },

  deleteDevice: async (id: number) => {
    const response = await apiClient.delete(`/devices/${id}`);
    return response;
  },

  getDeviceStatus: async (id: number) => {
    const response = await apiClient.get(`/devices/${id}/status`);
    return response;
  }
}; 