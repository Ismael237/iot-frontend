import { apiClient } from './axios-client';
import { Zone, ZoneDetail } from '../../domain/entities/zone.entity';

export interface CreateZoneRequest {
  name: string;
  description?: string;
  parentZoneId?: number;
  metadata?: Record<string, any>;
}

export interface UpdateZoneRequest {
  name?: string;
  description?: string;
  parentZoneId?: number;
  metadata?: Record<string, any>;
}

export interface ZonesResponse {
  data: Zone[];
  total: number;
}

export interface ZoneApi {
  getZones: (params?: { parentZoneId?: number; search?: string }) => Promise<ZonesResponse>;
  getZoneById: (id: number) => Promise<ZoneDetail>;
  createZone: (zoneData: CreateZoneRequest) => Promise<Zone>;
  updateZone: (id: number, zoneData: UpdateZoneRequest) => Promise<Zone>;
  deleteZone: (id: number) => Promise<{ success: boolean }>;
  addComponentToZone: (zoneId: number, deploymentId: number) => Promise<{ success: boolean }>;
  removeComponentFromZone: (zoneId: number, deploymentId: number) => Promise<{ success: boolean }>;
}

export const zoneApi: ZoneApi = {
  getZones: async (params = {}) => {
    const { parentZoneId, search } = params;
    const queryParams = new URLSearchParams();
    
    if (parentZoneId !== undefined) queryParams.append('parent_zone_id', parentZoneId.toString());
    if (search) queryParams.append('search', search);
    
    const response = await apiClient.get(`/zones?${queryParams.toString()}`);
    return response;
  },

  getZoneById: async (id: number) => {
    const response = await apiClient.get(`/zones/${id}`);
    return response;
  },

  createZone: async (zoneData: CreateZoneRequest) => {
    const response = await apiClient.post('/zones', zoneData);
    return response;
  },

  updateZone: async (id: number, zoneData: UpdateZoneRequest) => {
    const response = await apiClient.patch(`/zones/${id}`, zoneData);
    return response;
  },

  deleteZone: async (id: number) => {
    const response = await apiClient.delete(`/zones/${id}`);
    return response;
  },

  addComponentToZone: async (zoneId: number, deploymentId: number) => {
    const response = await apiClient.post(`/zones/${zoneId}/components/${deploymentId}`);
    return response;
  },

  removeComponentFromZone: async (zoneId: number, deploymentId: number) => {
    const response = await apiClient.delete(`/zones/${zoneId}/components/${deploymentId}`);
    return response;
  }
}; 