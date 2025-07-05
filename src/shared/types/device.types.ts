import { DeviceTypeEnum, ConnStatus, IotDevice, ComponentDeployment } from './api.types';
import { BaseEntity, Status, Severity } from './common.types';

// Device Status Types
export interface DeviceHealthStatus {
  device_id: number;
  status: ConnStatus;
  last_seen: string;
  uptime?: number;
  memory_usage?: number;
  cpu_usage?: number;
  temperature?: number;
}

export interface DeviceMetrics {
  device_id: number;
  timestamp: string;
  metrics: {
    uptime: number;
    memory_usage: number;
    cpu_usage: number;
    temperature: number;
    network_latency: number;
  };
}

// Device Configuration Types
export interface DeviceConfig {
  device_id: number;
  wifi_ssid?: string;
  wifi_password?: string;
  mqtt_broker?: string;
  mqtt_port?: number;
  mqtt_username?: string;
  mqtt_password?: string;
  update_interval: number;
  sensor_readings_interval: number;
  heartbeat_interval: number;
}

export interface DeviceFirmware {
  device_id: number;
  current_version: string;
  latest_version: string;
  update_available: boolean;
  last_check: string;
  changelog?: string;
}

// Device Pin Configuration
export interface PinConfig {
  pin_number: number;
  pin_type: 'digital' | 'analog' | 'pwm' | 'i2c' | 'spi';
  direction: 'input' | 'output';
  component_deployment_id?: number;
  metadata?: Record<string, any>;
}

export interface DevicePinMapping {
  device_id: number;
  pins: PinConfig[];
}

// Device Network Types
export interface NetworkInfo {
  device_id: number;
  ip_address: string;
  mac_address: string;
  subnet_mask: string;
  gateway: string;
  dns_servers: string[];
  wifi_strength?: number;
  connection_type: 'wifi' | 'ethernet' | 'cellular';
}

// Device Location Types
export interface DeviceLocation {
  device_id: number;
  latitude?: number;
  longitude?: number;
  altitude?: number;
  location_name?: string;
  zone_id?: number;
}

// Device Event Types
export interface DeviceEvent {
  event_id: number;
  device_id: number;
  event_type: 'connection' | 'disconnection' | 'error' | 'warning' | 'info';
  message: string;
  timestamp: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  metadata?: Record<string, any>;
}

// Device Command Types
export interface DeviceCommand {
  command_id: number;
  device_id: number;
  command: string;
  parameters?: Record<string, any>;
  issued_by: number;
  timestamp: string;
  status: 'pending' | 'executing' | 'completed' | 'failed';
  result?: any;
  error_message?: string;
}

// Device Group Types
export interface DeviceGroup {
  group_id: number;
  name: string;
  description?: string;
  device_ids: number[];
  created_by: number;
  created_at: string;
  updated_at: string;
}

// Device Template Types
export interface DeviceTemplate {
  template_id: number;
  name: string;
  device_type: DeviceTypeEnum;
  description?: string;
  default_config: DeviceConfig;
  default_pin_mapping: DevicePinMapping;
  created_by: number;
  created_at: string;
  updated_at: string;
}

// Device Dashboard Types
export interface DeviceOverview {
  total_devices: number;
  online_devices: number;
  offline_devices: number;
  error_devices: number;
  device_types: Record<DeviceTypeEnum, number>;
  recent_events: DeviceEvent[];
  system_health: {
    average_uptime: number;
    average_memory_usage: number;
    average_cpu_usage: number;
  };
}

// Device Filter Types
export interface DeviceFilter {
  device_type?: DeviceTypeEnum;
  status?: ConnStatus;
  zone_id?: number;
  created_by?: number;
  active_only?: boolean;
  search?: string;
  date_range?: {
    start_date: string;
    end_date: string;
  };
}

// Device Bulk Operations
export interface BulkDeviceOperation {
  operation: 'activate' | 'deactivate' | 'restart' | 'update_firmware' | 'delete';
  device_ids: number[];
  parameters?: Record<string, any>;
}

// Device Import/Export Types
export interface DeviceExport {
  devices: IotDevice[];
  component_deployments: ComponentDeployment[];
  device_configs: DeviceConfig[];
  pin_mappings: DevicePinMapping[];
  export_date: string;
  version: string;
}

export interface DeviceImport {
  file: File;
  overwrite_existing?: boolean;
  validate_only?: boolean;
}

// Device Monitoring Types
export interface DeviceMonitoringConfig {
  device_id: number;
  enabled: boolean;
  monitoring_interval: number;
  alert_thresholds: {
    cpu_usage: number;
    memory_usage: number;
    temperature: number;
    network_latency: number;
  };
  notifications: {
    email: boolean;
    sms: boolean;
    webhook?: string;
  };
}

// Device Backup Types
export interface DeviceBackup {
  backup_id: number;
  device_id: number;
  backup_type: 'full' | 'config' | 'data';
  filename: string;
  size: number;
  created_at: string;
  status: 'pending' | 'completed' | 'failed';
  download_url?: string;
}

// Device Types
export interface Device extends BaseEntity {
  identifier: string;
  device_type: DeviceType;
  model?: string;
  ip_address?: string;
  port?: number;
  active: boolean;
  status: DeviceStatus;
  last_seen?: string;
  metadata?: DeviceMetadata;
  location?: DeviceLocation;
  firmware_version?: string;
  hardware_version?: string;
  manufacturer?: string;
  serial_number?: string;
}

export enum DeviceType {
  GATEWAY = 'gateway',
  SENSOR_NODE = 'sensor_node',
  ACTUATOR_NODE = 'actuator_node',
  CONTROLLER = 'controller',
  CAMERA = 'camera',
  DISPLAY = 'display',
  RELAY = 'relay',
  MOTOR = 'motor',
  VALVE = 'valve',
  PUMP = 'pump'
}

export enum DeviceStatus {
  ONLINE = 'online',
  OFFLINE = 'offline',
  ERROR = 'error',
  MAINTENANCE = 'maintenance',
  CONFIGURING = 'configuring',
  UPDATING = 'updating'
}

export interface DeviceMetadata {
  capabilities?: string[];
  protocols?: string[];
  power_source?: 'battery' | 'wired' | 'solar';
  battery_level?: number;
  signal_strength?: number;
  temperature?: number;
  humidity?: number;
  custom_fields?: Record<string, any>;
}

export interface DeviceLocation {
  latitude?: number;
  longitude?: number;
  altitude?: number;
  address?: string;
  building?: string;
  floor?: string;
  room?: string;
  zone_id?: number;
}

// Device Events
export interface DeviceEvent extends BaseEntity {
  device_id: number;
  event_type: DeviceEventType;
  severity: Severity;
  message: string;
  metadata?: Record<string, any>;
  acknowledged: boolean;
  acknowledged_by?: number;
  acknowledged_at?: string;
}

export enum DeviceEventType {
  CONNECTION_LOST = 'connection_lost',
  CONNECTION_RESTORED = 'connection_restored',
  ERROR_OCCURRED = 'error_occurred',
  MAINTENANCE_REQUIRED = 'maintenance_required',
  FIRMWARE_UPDATE = 'firmware_update',
  CONFIGURATION_CHANGE = 'configuration_change',
  BATTERY_LOW = 'battery_low',
  SIGNAL_WEAK = 'signal_weak',
  TEMPERATURE_HIGH = 'temperature_high',
  TEMPERATURE_LOW = 'temperature_low'
}

// Device Commands
export interface DeviceCommand extends BaseEntity {
  device_id: number;
  command_type: DeviceCommandType;
  parameters?: Record<string, any>;
  status: CommandStatus;
  executed_at?: string;
  result?: any;
  error_message?: string;
}

export enum DeviceCommandType {
  RESTART = 'restart',
  SHUTDOWN = 'shutdown',
  UPDATE_FIRMWARE = 'update_firmware',
  UPDATE_CONFIG = 'update_config',
  RESET = 'reset',
  CALIBRATE = 'calibrate',
  TEST_CONNECTION = 'test_connection',
  SEND_DATA = 'send_data',
  CUSTOM = 'custom'
}

export enum CommandStatus {
  PENDING = 'pending',
  EXECUTING = 'executing',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled'
}

// Device Groups
export interface DeviceGroup extends BaseEntity {
  name: string;
  description?: string;
  device_ids: number[];
  rules?: DeviceGroupRule[];
  metadata?: Record<string, any>;
}

export interface DeviceGroupRule {
  field: string;
  operator: 'equals' | 'contains' | 'starts_with' | 'ends_with' | 'regex';
  value: string;
}

// Device Templates
export interface DeviceTemplate extends BaseEntity {
  name: string;
  description?: string;
  device_type: DeviceType;
  manufacturer?: string;
  model?: string;
  default_config: DeviceConfig;
  capabilities: string[];
  metadata?: Record<string, any>;
}

export interface DeviceConfig {
  network?: NetworkConfig;
  sensors?: SensorConfig[];
  actuators?: ActuatorConfig[];
  communication?: CommunicationConfig;
  security?: SecurityConfig;
  custom?: Record<string, any>;
}

export interface NetworkConfig {
  protocol: 'wifi' | 'ethernet' | 'cellular' | 'bluetooth' | 'zigbee' | 'lora';
  ssid?: string;
  password?: string;
  ip_address?: string;
  port?: number;
  gateway?: string;
  dns?: string[];
}

export interface SensorConfig {
  type: string;
  pin?: number;
  unit?: string;
  calibration?: CalibrationConfig;
  sampling_rate?: number;
}

export interface ActuatorConfig {
  type: string;
  pin?: number;
  control_type: 'digital' | 'pwm' | 'analog';
  min_value?: number;
  max_value?: number;
  default_value?: number;
}

export interface CommunicationConfig {
  protocol: 'mqtt' | 'http' | 'coap' | 'websocket';
  broker_url?: string;
  topic_prefix?: string;
  username?: string;
  password?: string;
  keepalive?: number;
}

export interface SecurityConfig {
  encryption: boolean;
  authentication: boolean;
  certificate_path?: string;
  private_key_path?: string;
}

export interface CalibrationConfig {
  offset: number;
  scale: number;
  min_value?: number;
  max_value?: number;
}

// Device Statistics
export interface DeviceStats {
  device_id: number;
  uptime: number;
  total_events: number;
  error_count: number;
  warning_count: number;
  last_maintenance?: string;
  next_maintenance?: string;
  data_points_collected: number;
  commands_executed: number;
  failed_commands: number;
}

// Device Health
export interface DeviceHealth {
  device_id: number;
  overall_health: 'excellent' | 'good' | 'fair' | 'poor' | 'critical';
  components: ComponentHealth[];
  last_check: string;
  next_check?: string;
}

export interface ComponentHealth {
  name: string;
  status: 'healthy' | 'warning' | 'error' | 'unknown';
  value?: number;
  unit?: string;
  threshold?: number;
  message?: string;
} 