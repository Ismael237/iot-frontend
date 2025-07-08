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
  readingId: number;
  sensorId: number;
  value: number;
  timestamp: string;
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
  deploymentId: number;
  componentTypeId: number;
  deviceId: number;
  lastIteration: string;
  connectionStatus: ConnStatus;
  lastValue: number;
  lastValueTs: string;
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
  deploymentId: number;
  componentTypeId: number;
  deviceId: number;
  active: boolean;
  lastIteration: string;
  connectionStatus: ConnStatus;
  lastValue: number;
  lastValueTs: string;
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
  ESP32 = 'esp32',
  ARDUINO = 'arduino',
  RASPBERRY_PI = 'raspberry_pi',
  GATEWAY = 'gateway',
  SENSOR_NODE = 'sensor_node',
  ACTUATOR_NODE = 'actuator_node',
  CONTROLLER = 'controller',
  DISPLAY = 'display',
  CUSTOM = 'custom'
}

export enum ConnStatus {
  ONLINE = 'online',
  OFFLINE = 'offline',
  CONNECTING = 'connecting',
  ERROR = 'error',
  UNKNOWN = 'unknown'
} 