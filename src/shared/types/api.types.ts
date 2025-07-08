// API Response Types
export interface ApiResponse<T> {
  data: T;
  total?: number;
  message?: string;
  success?: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  skip: number;
  limit: number;
}

export interface ErrorResponse {
  error: string;
  message: string;
  statusCode: number;
  details?: any;
}

// Authentication Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  user: User;
}

export interface RefreshTokenResponse {
  accessToken: string;
}

export interface LogoutResponse {
  message: string;
}

// Common Types
export interface TimestampFields {
  createdAt: string;
  updatedAt: string;
}

export interface CreatedByFields {
  createdBy?: number;
}

// User Types
export type UserRole = 'admin' | 'user';

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
}

export interface UpdateUserRequest {
  firstName?: string;
  lastName?: string;
  role?: UserRole;
  isActive?: boolean;
}

// Device Types
export type DeviceTypeEnum = 
  | 'esp32' 
  | 'arduino' 
  | 'raspberry_pi' 
  | 'gateway'
  | 'sensor_node'
  | 'actuator_node'
  | 'controller'
  | 'display'
  | 'custom';

export type ConnStatus = 'connected' | 'disconnected' | 'connecting' | 'error' | 'unknown';

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
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
  componentDeployments?: ComponentDeployment[];
}

export interface CreateDeviceRequest {
  identifier: string;
  deviceType: DeviceTypeEnum;
  model?: string;
  metadata?: Record<string, any>;
}

export interface UpdateDeviceRequest {
  model?: string;
  active?: boolean;
  metadata?: Record<string, any>;
}

export interface DeviceStatus {
  deviceId: number;
  status: ConnStatus;
  lastSeen?: string;
}

// Component Types
export type ComponentCategory = 'sensor' | 'actuator';

export interface ComponentType {
  id: number;
  name: string;
  identifier: string;
  category: ComponentCategory;
  unit?: string;
  description?: string;
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface CreateComponentTypeRequest {
  name: string;
  identifier: string;
  category: ComponentCategory;
  unit?: string;
  description?: string;
}

export interface ComponentDeployment {
  id: number;
  componentTypeId: number;
  deviceId: number;
  name?: string;
  description?: string;
  location?: string;
  unit?: string;
  active: boolean;
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
  componentType?: ComponentType;
  device?: IotDevice;
}

export interface CreateComponentDeploymentRequest {
  componentTypeId: number;
  deviceId: number;
  name?: string;
  description?: string;
  location?: string;
  unit?: string;
  metadata?: Record<string, any>;
}

export interface UpdateComponentDeploymentRequest {
  name?: string;
  description?: string;
  location?: string;
  unit?: string;
  active?: boolean;
  metadata?: Record<string, any>;
}

// Sensor Types
export type ReadingQuality = 'excellent' | 'good' | 'fair' | 'poor' | 'invalid';

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
  sensorType: string;
  minValue: number;
  maxValue: number;
  avgValue: number;
  lastReading: number;
  lastReadingTime: string;
  readingCount: number;
  status: ConnStatus;
}

export interface AggregatedSensorData {
  timestamps: string[];
  values: number[];
  avgValues: number[];
  minValues: number[];
  maxValues: number[];
}

// Actuator Types
export interface ActuatorCommand {
  id: number;
  deploymentId: number;
  command: string;
  parameters?: Record<string, any>;
  status: 'pending' | 'executed' | 'failed';
  executedAt?: string;
  createdAt: string;
}

export interface ActuatorStatus {
  deploymentId: number;
  connectionStatus: ConnStatus;
  lastInteraction?: string;
}

export interface SendActuatorCommandRequest {
  command: string;
  parameters?: Record<string, any>;
}

// Zone Types
export interface Zone {
  id: number;
  name: string;
  description?: string;
  parentZoneId?: number;
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
  componentDeployments?: ComponentDeployment[];
  childZones?: Zone[];
}

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

// Automation Types
export type ComparisonOperator = 'gt' | 'lt' | 'gte' | 'lte' | 'eq' | 'ne';
export type AutomationActionType = 'create_alert' | 'trigger_actuator';

export interface AutomationRule {
  id: number;
  name: string;
  description?: string;
  sensorDeploymentId: number;
  operator: ComparisonOperator;
  thresholdValue: number;
  actionType: AutomationActionType;
  alertTitle?: string;
  alertMessage?: string;
  alertSeverity?: string;
  targetDeploymentId?: number;
  actuatorCommand?: string;
  actuatorParameters?: Record<string, any>;
  cooldownMinutes: number;
  isActive: boolean;
  lastTriggered?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAutomationRuleRequest {
  name: string;
  description?: string;
  sensorDeploymentId: number;
  operator: ComparisonOperator;
  thresholdValue: number;
  actionType: AutomationActionType;
  alertTitle?: string;
  alertMessage?: string;
  alertSeverity?: string;
  targetDeploymentId?: number;
  actuatorCommand?: string;
  actuatorParameters?: Record<string, any>;
  cooldownMinutes: number;
}

export interface UpdateAutomationRuleRequest {
  name?: string;
  description?: string;
  sensorDeploymentId?: number;
  operator?: ComparisonOperator;
  thresholdValue?: number;
  actionType?: AutomationActionType;
  alertTitle?: string;
  alertMessage?: string;
  alertSeverity?: string;
  targetDeploymentId?: number;
  actuatorCommand?: string;
  actuatorParameters?: Record<string, any>;
  cooldownMinutes?: number;
  isActive?: boolean;
}

export interface Alert {
  id: number;
  title: string;
  message: string;
  severity: 'info' | 'warning' | 'error' | 'critical';
  automationRuleId?: number;
  isRead: boolean;
  isAcknowledged: boolean;
  createdAt: string;
  readAt?: string;
  acknowledgedAt?: string;
}

// Query Parameters
export interface PaginationParams {
  skip?: number;
  limit?: number;
}

export interface DeviceQueryParams extends PaginationParams {
  deviceType?: DeviceTypeEnum;
  activeOnly?: boolean;
}

export interface ComponentQueryParams extends PaginationParams {
  deviceId?: number;
  componentTypeId?: number;
  category?: ComponentCategory;
  activeOnly?: boolean;
}

export interface SensorQueryParams extends PaginationParams {
  deploymentId?: number;
  startDate?: string;
  endDate?: string;
  hours?: number;
  interval?: 'hour' | 'day' | 'week';
}

export interface ZoneQueryParams extends PaginationParams {
  parentZoneId?: number;
}

export interface AutomationQueryParams extends PaginationParams {
  isActive?: boolean;
}

export interface AlertQueryParams extends PaginationParams {
  severity?: string;
  resolved?: boolean;
} 