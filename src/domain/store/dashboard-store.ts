import { create } from 'zustand';

interface DashboardMetrics {
  totalDevices: number;
  onlineDevices: number;
  totalSensors: number;
  totalActuators: number;
  totalZones: number;
  activeRules: number;
  unreadAlerts: number;
  systemHealth: 'excellent' | 'good' | 'fair' | 'poor';
}

interface DeviceStatus {
  deviceId: number;
  deviceName: string;
  status: 'online' | 'offline' | 'error' | 'maintenance';
  lastSeen: string;
  componentCount: number;
}

interface RecentActivity {
  id: number;
  type: 'sensor_reading' | 'actuator_command' | 'alert' | 'rule_triggered' | 'device_status_change';
  title: string;
  description: string;
  timestamp: string;
  severity?: 'low' | 'medium' | 'high' | 'critical';
  sourceId?: number;
  sourceName?: string;
}

interface SystemHealth {
  cpuUsage: number;
  memoryUsage: number;
  diskUsage: number;
  networkLatency: number;
  activeConnections: number;
  uptime: number;
}

interface DashboardState {
  metrics: DashboardMetrics | null;
  deviceStatuses: DeviceStatus[];
  recentActivities: RecentActivity[];
  systemHealth: SystemHealth | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchDashboardMetrics: () => Promise<void>;
  fetchDeviceStatuses: () => Promise<void>;
  fetchRecentActivities: (limit?: number) => Promise<void>;
  fetchSystemHealth: () => Promise<void>;
  refreshDashboard: () => Promise<void>;
  clearError: () => void;
}

export const useDashboardStore = create<DashboardState>((set, get) => ({
  metrics: null,
  deviceStatuses: [],
  recentActivities: [],
  systemHealth: null,
  isLoading: false,
  error: null,

  fetchDashboardMetrics: async () => {
    set({ isLoading: true, error: null });
    try {
      // Mock API call - replace with actual API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const mockMetrics: DashboardMetrics = {
        totalDevices: 25,
        onlineDevices: 23,
        totalSensors: 45,
        totalActuators: 18,
        totalZones: 12,
        activeRules: 8,
        unreadAlerts: 3,
        systemHealth: 'good'
      };
      
      set({
        metrics: mockMetrics,
        isLoading: false
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch dashboard metrics',
        isLoading: false
      });
    }
  },

  fetchDeviceStatuses: async () => {
    set({ isLoading: true, error: null });
    try {
      // Mock API call - replace with actual API
      await new Promise(resolve => setTimeout(resolve, 400));
      
      const mockDeviceStatuses: DeviceStatus[] = [
        {
          deviceId: 1,
          deviceName: 'GATEWAY-001',
          status: 'online',
          lastSeen: new Date().toISOString(),
          componentCount: 8
        },
        {
          deviceId: 2,
          deviceName: 'SENSOR-001',
          status: 'online',
          lastSeen: new Date().toISOString(),
          componentCount: 3
        },
        {
          deviceId: 3,
          deviceName: 'ACTUATOR-001',
          status: 'online',
          lastSeen: new Date().toISOString(),
          componentCount: 2
        },
        {
          deviceId: 4,
          deviceName: 'CONTROLLER-001',
          status: 'offline',
          lastSeen: '2024-01-15T10:30:00Z',
          componentCount: 5
        },
        {
          deviceId: 5,
          deviceName: 'SENSOR-002',
          status: 'error',
          lastSeen: '2024-01-15T12:15:00Z',
          componentCount: 1
        }
      ];
      
      set({
        deviceStatuses: mockDeviceStatuses,
        isLoading: false
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch device statuses',
        isLoading: false
      });
    }
  },

  fetchRecentActivities: async (limit = 10) => {
    set({ isLoading: true, error: null });
    try {
      // Mock API call - replace with actual API
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const mockActivities: RecentActivity[] = [
        {
          id: 1,
          type: 'alert',
          title: 'High Temperature Alert',
          description: 'Temperature exceeded 30°C in Zone A',
          timestamp: new Date().toISOString(),
          severity: 'high',
          sourceId: 1,
          sourceName: 'Temperature Sensor'
        },
        {
          id: 2,
          type: 'actuator_command',
          title: 'Relay Activated',
          description: 'Relay switch turned ON in response to automation rule',
          timestamp: new Date(Date.now() - 300000).toISOString(),
          sourceId: 3,
          sourceName: 'Relay Switch'
        },
        {
          id: 3,
          type: 'sensor_reading',
          title: 'Humidity Reading',
          description: 'Humidity level: 65% in Zone B',
          timestamp: new Date(Date.now() - 600000).toISOString(),
          sourceId: 2,
          sourceName: 'Humidity Sensor'
        },
        {
          id: 4,
          type: 'rule_triggered',
          title: 'Automation Rule Executed',
          description: 'Low humidity rule triggered - humidifier activated',
          timestamp: new Date(Date.now() - 900000).toISOString(),
          severity: 'medium',
          sourceId: 2,
          sourceName: 'Low Humidity Rule'
        },
        {
          id: 5,
          type: 'device_status_change',
          title: 'Device Offline',
          description: 'SENSOR-003 went offline',
          timestamp: new Date(Date.now() - 1200000).toISOString(),
          severity: 'medium',
          sourceId: 4,
          sourceName: 'SENSOR-003'
        }
      ];
      
      set({
        recentActivities: mockActivities.slice(0, limit),
        isLoading: false
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch recent activities',
        isLoading: false
      });
    }
  },

  fetchSystemHealth: async () => {
    set({ isLoading: true, error: null });
    try {
      // Mock API call - replace with actual API
      await new Promise(resolve => setTimeout(resolve, 200));
      
      const mockSystemHealth: SystemHealth = {
        cpuUsage: 45.2,
        memoryUsage: 67.8,
        diskUsage: 23.4,
        networkLatency: 12.5,
        activeConnections: 156,
        uptime: 86400 // 24 hours in seconds
      };
      
      set({
        systemHealth: mockSystemHealth,
        isLoading: false
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch system health',
        isLoading: false
      });
    }
  },

  refreshDashboard: async () => {
    set({ isLoading: true, error: null });
    try {
      // Fetch all dashboard data in parallel
      await Promise.all([
        get().fetchDashboardMetrics(),
        get().fetchDeviceStatuses(),
        get().fetchRecentActivities(),
        get().fetchSystemHealth()
      ]);
      
      set({ isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to refresh dashboard',
        isLoading: false
      });
    }
  },

  clearError: () => {
    set({ error: null });
  }
})); 