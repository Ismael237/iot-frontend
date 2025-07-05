export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: '/auth/login',
    REFRESH: '/auth/refresh',
    LOGOUT: '/auth/logout',
    ME: '/auth/me',
  },

  // Users
  USERS: {
    LIST: '/users',
    CREATE: '/users',
    GET_BY_ID: (id: number) => `/users/${id}`,
    UPDATE: (id: number) => `/users/${id}`,
    DELETE: (id: number) => `/users/${id}`,
  },

  // Devices
  DEVICES: {
    LIST: '/devices',
    CREATE: '/devices',
    GET_BY_ID: (id: number) => `/devices/${id}`,
    UPDATE: (id: number) => `/devices/${id}`,
    DELETE: (id: number) => `/devices/${id}`,
    STATUS: (id: number) => `/devices/${id}/status`,
  },

  // Components
  COMPONENTS: {
    TYPES: {
      LIST: '/components/types',
      CREATE: '/components/types',
    },
    DEPLOYMENTS: {
      LIST: '/components/deployments',
      CREATE: '/components/deployments',
      UPDATE: (id: number) => `/components/deployments/${id}`,
      DELETE: (id: number) => `/components/deployments/${id}`,
    },
  },

  // Sensors
  SENSORS: {
    READINGS: {
      LIST: '/sensors/readings',
      LATEST: '/sensors/readings/latest',
      AGGREGATED: '/sensors/readings/aggregated',
      BY_DEPLOYMENT: (deploymentId: number) => `/sensors/${deploymentId}/readings`,
      STATS: (deploymentId: number) => `/sensors/${deploymentId}/stats`,
    },
  },

  // Actuators
  ACTUATORS: {
    COMMAND: (deploymentId: number) => `/actuators/${deploymentId}/command`,
    COMMANDS: (deploymentId: number) => `/actuators/${deploymentId}/commands`,
    STATUS: (deploymentId: number) => `/actuators/${deploymentId}/status`,
  },

  // Zones
  ZONES: {
    LIST: '/zones',
    CREATE: '/zones',
    GET_BY_ID: (id: number) => `/zones/${id}`,
    UPDATE: (id: number) => `/zones/${id}`,
    DELETE: (id: number) => `/zones/${id}`,
    ADD_COMPONENT: (zoneId: number, deploymentId: number) => 
      `/zones/${zoneId}/components/${deploymentId}`,
    REMOVE_COMPONENT: (zoneId: number, deploymentId: number) => 
      `/zones/${zoneId}/components/${deploymentId}`,
  },

  // Automation
  AUTOMATION: {
    RULES: {
      LIST: '/automation/rules',
      CREATE: '/automation/rules',
      GET_BY_ID: (id: number) => `/automation/rules/${id}`,
      UPDATE: (id: number) => `/automation/rules/${id}`,
      DELETE: (id: number) => `/automation/rules/${id}`,
      ACTIVATE: (id: number) => `/automation/rules/${id}/activate`,
    },
    ALERTS: {
      LIST: '/automation/alerts',
      ACKNOWLEDGE: (id: number) => `/automation/alerts/${id}/acknowledge`,
    },
  },

  // Dashboard
  DASHBOARD: {
    METRICS: '/dashboard/metrics',
    DEVICE_STATUSES: '/dashboard/device-statuses',
    RECENT_ACTIVITIES: '/dashboard/recent-activities',
    SYSTEM_HEALTH: '/dashboard/system-health',
  },

  // Reports
  REPORTS: {
    SENSOR_DATA: '/reports/sensor-data',
    DEVICE_PERFORMANCE: '/reports/device-performance',
    AUTOMATION_ACTIVITY: '/reports/automation-activity',
    SYSTEM_LOGS: '/reports/system-logs',
  },

  // Settings
  SETTINGS: {
    SYSTEM: '/settings/system',
    NOTIFICATIONS: '/settings/notifications',
    INTEGRATIONS: '/settings/integrations',
    SECURITY: '/settings/security',
  },
} as const;

export const QUERY_PARAMS = {
  // Pagination
  SKIP: 'skip',
  LIMIT: 'limit',
  
  // Filtering
  SEARCH: 'search',
  DEVICE_TYPE: 'device_type',
  ACTIVE_ONLY: 'active_only',
  CATEGORY: 'category',
  SEVERITY: 'severity',
  IS_ACTIVE: 'is_active',
  PARENT_ZONE_ID: 'parent_zone_id',
  
  // Date ranges
  START_DATE: 'start_date',
  END_DATE: 'end_date',
  HOURS: 'hours',
  DAYS: 'days',
  INTERVAL: 'interval',
  
  // Component specific
  DEVICE_ID: 'device_id',
  COMPONENT_TYPE_ID: 'component_type_id',
  DEPLOYMENT_ID: 'deployment_id',
  
  // User specific
  ROLE: 'role',
  
  // Status
  STATUS: 'status',
  IS_READ: 'is_read',
  IS_ACKNOWLEDGED: 'is_acknowledged',
} as const;

export const buildQueryString = (params: Record<string, any>): string => {
  const searchParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, String(value));
    }
  });
  
  return searchParams.toString();
};

export const buildUrl = (endpoint: string, params?: Record<string, any>): string => {
  if (!params) return endpoint;
  
  const queryString = buildQueryString(params);
  return queryString ? `${endpoint}?${queryString}` : endpoint;
}; 