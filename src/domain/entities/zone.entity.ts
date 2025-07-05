export interface Zone {
  id: number;
  name: string;
  description?: string;
  parentZoneId?: number;
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
  childZones: Zone[];
  componentDeployments: ComponentDeployment[];
}

export interface ZoneHierarchy {
  id: number;
  name: string;
  description?: string;
  level: number;
  path: string;
  children: ZoneHierarchy[];
  componentCount: number;
  deviceCount: number;
}

export interface ZoneDetail extends Zone {
  componentDeployments: ComponentDeployment[];
  childZones: Zone[];
  parentZone?: Zone;
  deviceCount: number;
  sensorCount: number;
  actuatorCount: number;
  status: ZoneStatus;
}

export interface ComponentDeployment {
  id: number;
  componentTypeId: number;
  deviceId: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  componentType: ComponentType;
  device: IotDevice;
}

export interface ComponentType {
  id: number;
  name: string;
  identifier: string;
  category: 'sensor' | 'actuator';
  unit?: string;
  description?: string;
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface IotDevice {
  id: number;
  identifier: string;
  deviceType: DeviceTypeEnum;
  model?: string;
  ipAddress?: string;
  port?: number;
  active: boolean;
  status: ConnStatus;
  lastSeen?: string;
  createdAt: string;
  updatedAt: string;
  componentDeployments: ComponentDeployment[];
}

export enum ZoneStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  MAINTENANCE = 'maintenance',
  ALERT = 'alert'
}

export enum DeviceTypeEnum {
  GATEWAY = 'gateway',
  SENSOR_NODE = 'sensor_node',
  ACTUATOR_NODE = 'actuator_node',
  CONTROLLER = 'controller',
  DISPLAY = 'display',
  CUSTOM = 'custom'
}

export enum ConnStatus {
  CONNECTED = 'connected',
  DISCONNECTED = 'disconnected',
  CONNECTING = 'connecting',
  ERROR = 'error',
  UNKNOWN = 'unknown'
} 