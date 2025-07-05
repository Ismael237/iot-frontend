export interface Sensor {
  id: number;
  name: string;
  type: SensorType;
  unit: string;
  location: string;
  status: SensorStatus;
  lastReading?: SensorReading;
  createdAt: string;
  updatedAt: string;
}

export interface SensorReading {
  id: number;
  sensorId: number;
  value: number;
  timestamp: string;
  quality: ReadingQuality;
  metadata?: Record<string, any>;
}

export interface SensorStats {
  sensorId: number;
  sensorName: string;
  sensorType: SensorType;
  minValue: number;
  maxValue: number;
  avgValue: number;
  lastReading: number;
  lastReadingTime: string;
  readingCount: number;
  status: SensorStatus;
}

export interface SensorDeployment {
  id: number;
  componentTypeId: number;
  deviceId: number;
  name: string;
  description?: string;
  location?: string;
  unit?: string;
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

export enum SensorType {
  TEMPERATURE = 'temperature',
  HUMIDITY = 'humidity',
  PRESSURE = 'pressure',
  LIGHT = 'light',
  MOTION = 'motion',
  SOUND = 'sound',
  GAS = 'gas',
  PH = 'ph',
  CONDUCTIVITY = 'conductivity',
  FLOW = 'flow',
  LEVEL = 'level',
  VIBRATION = 'vibration',
  PROXIMITY = 'proximity',
  FORCE = 'force',
  TORQUE = 'torque',
  VOLTAGE = 'voltage',
  CURRENT = 'current',
  POWER = 'power',
  ENERGY = 'energy',
  FREQUENCY = 'frequency',
  CUSTOM = 'custom'
}

export enum SensorStatus {
  ONLINE = 'online',
  OFFLINE = 'offline',
  ERROR = 'error',
  MAINTENANCE = 'maintenance',
  CALIBRATING = 'calibrating'
}

export enum ReadingQuality {
  EXCELLENT = 'excellent',
  GOOD = 'good',
  FAIR = 'fair',
  POOR = 'poor',
  INVALID = 'invalid'
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