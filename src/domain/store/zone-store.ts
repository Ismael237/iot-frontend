import { create } from 'zustand';
import type { Zone, ZoneDetail, ZoneStats, CreateZoneRequest, UpdateZoneRequest } from '../entities/zone.entity';
import { zoneApi, type ZonesResponse } from '../../infrastructure/api/zone-api';

interface ZoneState {
  zones: Zone[];
  selectedZone: ZoneDetail | null;
  zoneStats: ZoneStats[];
  isLoading: boolean;
  error: string | null;
  totalZones: number;
  
  // Actions
  fetchZones: (params?: { parentZoneId?: number; search?: string }) => Promise<void>;
  fetchZoneById: (id: number) => Promise<void>;
  createZone: (zoneData: CreateZoneRequest) => Promise<void>;
  updateZone: (id: number, zoneData: UpdateZoneRequest) => Promise<void>;
  deleteZone: (id: number) => Promise<void>;
  addComponentToZone: (zoneId: number, deploymentId: number) => Promise<void>;
  removeComponentFromZone: (zoneId: number, deploymentId: number) => Promise<void>;
  setSelectedZone: (zone: ZoneDetail | null) => void;
  clearError: () => void;
}

// Validation utilities
const isValidZone = (zone: any): zone is Zone => {
  return (
    zone &&
    typeof zone.zoneId === 'number' &&
    typeof zone.name === 'string' &&
    typeof zone.createdAt === 'string' &&
    typeof zone.updatedAt === 'string'
  );
};

const isValidZoneDetail = (zone: any): zone is ZoneDetail => {
  return (
    isValidZone(zone) &&
    Array.isArray(zone.componentAssignments) &&
    Array.isArray(zone.subZones)
  );
};

const sanitizeZone = (zone: any): Zone => {
  if (!isValidZone(zone)) {
    throw new Error('Invalid zone data');
  }

  return {
    zoneId: zone.zoneId,
    name: zone.name || 'Unknown Zone',
    description: zone.description || '',
    parentZoneId: zone.parentZoneId,
    metadata: zone.metadata || {},
    createdAt: zone.createdAt || new Date().toISOString(),
    updatedAt: zone.updatedAt || new Date().toISOString(),
    componentDeployments: zone.componentAssignments || [],
    childZones: zone.subZones || [],
  };
};

const sanitizeZoneDetail = (zone: any): ZoneDetail => {
  if (!isValidZoneDetail(zone)) {
    throw new Error('Invalid zone detail data');
  }

  return {
    ...sanitizeZone(zone),
    componentDeployments: zone.componentAssignments	 || [],
    childZones: zone.childZones || [],
    parentZone: zone.parentZone || null,
    deviceCount: zone.deviceCount || 0,
    sensorCount: zone.sensorCount || 0,
    actuatorCount: zone.actuatorCount || 0,
    status: zone.status || 'active',
  };
};

export const useZoneStore = create<ZoneState>((set, get) => ({
  zones: [],
  selectedZone: null,
  zoneStats: [],
  isLoading: false,
  error: null,
  totalZones: 0,

  fetchZones: async (params = {}) => {
    set({ isLoading: true, error: null });
    try {
      const response: ZonesResponse = await zoneApi.getZones(params);
      
      // Validate and sanitize zones
      const validZones = response
        .filter(isValidZone)
        .map(sanitizeZone);

      set({
        zones: validZones,
        totalZones: response.total || validZones.length,
        isLoading: false
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch zones',
        isLoading: false
      });
    }
  },

  fetchZoneById: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      const response = await zoneApi.getZoneById(id);
      
      // Validate and sanitize zone detail
      const validZoneDetail = sanitizeZoneDetail(response);

      set({
        selectedZone: validZoneDetail,
        isLoading: false
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch zone details',
        isLoading: false
      });
    }
  },

  createZone: async (zoneData: CreateZoneRequest) => {
    set({ isLoading: true, error: null });
    try {
      const newZone = await zoneApi.createZone(zoneData);
      
      // Add the new zone to the list
      const currentZones = get().zones;
      set({
        zones: [...currentZones, sanitizeZone(newZone)],
        totalZones: get().totalZones + 1,
        isLoading: false
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to create zone',
        isLoading: false
      });
    }
  },

  updateZone: async (id: number, zoneData: UpdateZoneRequest) => {
    set({ isLoading: true, error: null });
    try {
      const updatedZone = await zoneApi.updateZone(id, zoneData);
      
      // Update the zone in the list
      const currentZones = get().zones;
      const updatedZones = currentZones.map(zone => 
        zone.zoneId === id ? sanitizeZone(updatedZone) : zone
      );
      
      set({
        zones: updatedZones,
        isLoading: false
      });

      // Update selected zone if it's the one being updated
      const selectedZone = get().selectedZone;
      if (selectedZone && selectedZone.id === id) {
        set({
          selectedZone: sanitizeZoneDetail(updatedZone)
        });
      }
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to update zone',
        isLoading: false
      });
    }
  },

  deleteZone: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      await zoneApi.deleteZone(id);
      
      // Remove the zone from the list
      const currentZones = get().zones;
      const filteredZones = currentZones.filter(zone => zone.id !== id);
      
      set({
        zones: filteredZones,
        totalZones: get().totalZones - 1,
        isLoading: false
      });

      // Clear selected zone if it's the one being deleted
      const selectedZone = get().selectedZone;
      if (selectedZone && selectedZone.id === id) {
        set({ selectedZone: null });
      }
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to delete zone',
        isLoading: false
      });
    }
  },

  addComponentToZone: async (zoneId: number, deploymentId: number) => {
    set({ isLoading: true, error: null });
    try {
      await zoneApi.addComponentToZone(zoneId, deploymentId);
      
      // Refresh the selected zone if it's the one being updated
      const selectedZone = get().selectedZone;
      if (selectedZone && selectedZone.id === zoneId) {
        await get().fetchZoneById(zoneId);
      }
      
      set({ isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to add component to zone',
        isLoading: false
      });
    }
  },

  removeComponentFromZone: async (zoneId: number, deploymentId: number) => {
    set({ isLoading: true, error: null });
    try {
      await zoneApi.removeComponentFromZone(zoneId, deploymentId);
      
      // Refresh the selected zone if it's the one being updated
      const selectedZone = get().selectedZone;
      if (selectedZone && selectedZone.id === zoneId) {
        await get().fetchZoneById(zoneId);
      }
      
      set({ isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to remove component from zone',
        isLoading: false
      });
    }
  },

  setSelectedZone: (zone: ZoneDetail | null) => {
    if (zone && !isValidZoneDetail(zone)) {
      console.warn('Invalid zone data provided to setSelectedZone');
      return;
    }
    set({ selectedZone: zone });
  },

  clearError: () => {
    set({ error: null });
  }
})); 