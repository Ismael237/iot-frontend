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
  status_code: number;
  details?: any;
}

// Authentication Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  user: User;
}

export interface RefreshTokenRequest {
  refresh_token: string;
}

export interface RefreshTokenResponse {
  access_token: string;
}

export interface LogoutRequest {
  refresh_token: string;
}

export interface LogoutResponse {
  success: boolean;
}

// Common Types
export interface TimestampFields {
  created_at: string;
  updated_at: string;
}

export interface CreatedByFields {
  created_by?: number;
}

// User Types
export type UserRole = 'admin' | 'user';

export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  role: UserRole;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateUserRequest {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  role: UserRole;
}

export interface UpdateUserRequest {
  first_name?: string;
  last_name?: string;
  role?: UserRole;
  is_active?: boolean;
}

// Device Types
export type DeviceTypeEnum = 
  | 'arduino_uno' 
  | 'arduino_nano' 
  | 'esp32' 
  | 'esp8266' 
  | 'raspberry_pi' 
  | 'sensor_module' 
  | 'actuator_module' 
  | 'gateway';

export type ConnStatus = 'unknown' | 'online' | 'offline' | 'error';

export interface IotDevice {
  id: number;
  identifier: string;
  device_type: DeviceTypeEnum;
  model?: string;
  ip_address?: string;
  port?: number;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateDeviceRequest {
  identifier: string;
  device_type: DeviceTypeEnum;
  model?: string;
  ip_address?: string;
  port?: number;
  active: boolean;
}

export interface UpdateDeviceRequest {
  model?: string;
  ip_address?: string;
  port?: number;
  active?: boolean;
}

export interface DeviceStatus {
  device_id: number;
  status: ConnStatus;
  last_seen?: string;
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
  created_at: string;
  updated_at: string;
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
  component_type_id: number;
  device_id: number;
  active: boolean;
  created_at: string;
  updated_at: string;
  component_type?: ComponentType;
  device?: IotDevice;
}

export interface CreateComponentDeploymentRequest {
  component_type_id: number;
  device_id: number;
  active: boolean;
}

export interface UpdateComponentDeploymentRequest {
  active?: boolean;
}

// Sensor Types
export interface SensorReading {
  id: number;
  deployment_id: number;
  value: number;
  timestamp: string;
  metadata?: object;
}

export interface SensorStats {
  min: number;
  max: number;
  avg: number;
  count: number;
}

export interface AggregatedSensorData {
  timestamps: string[];
  values: number[];
  avg_values: number[];
}

// Actuator Types
export interface ActuatorCommand {
  id: number;
  deployment_id: number;
  command: string;
  parameters?: object;
  status: 'pending' | 'executed' | 'failed';
  executed_at?: string;
  created_at: string;
}

export interface ActuatorStatus {
  deployment_id: number;
  connection_status: ConnStatus;
  last_interaction?: string;
}

export interface SendActuatorCommandRequest {
  command: string;
  parameters?: object;
}

// Zone Types
export interface Zone {
  id: number;
  name: string;
  description?: string;
  parent_zone_id?: number;
  metadata?: object;
  created_at: string;
  updated_at: string;
  component_deployments?: ComponentDeployment[];
  child_zones?: Zone[];
}

export interface CreateZoneRequest {
  name: string;
  description?: string;
  parent_zone_id?: number;
  metadata?: object;
}

export interface UpdateZoneRequest {
  name?: string;
  description?: string;
  parent_zone_id?: number;
  metadata?: object;
}

// Automation Types
export type ComparisonOperator = '>' | '<' | '>=' | '<=' | '=' | '!=';
export type AutomationActionType = 'create_alert' | 'trigger_actuator';

export interface AutomationRule {
  id: number;
  name: string;
  description?: string;
  sensor_deployment_id: number;
  operator: ComparisonOperator;
  threshold_value: number;
  action_type: AutomationActionType;
  alert_title?: string;
  alert_message?: string;
  alert_severity?: string;
  target_deployment_id?: number;
  actuator_command?: string;
  actuator_parameters?: Record<string, any>;
  cooldown_minutes: number;
  is_active: boolean;
  last_triggered?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateAutomationRuleRequest {
  name: string;
  description?: string;
  sensor_deployment_id: number;
  operator: ComparisonOperator;
  threshold_value: number;
  action_type: AutomationActionType;
  alert_title?: string;
  alert_message?: string;
  alert_severity?: string;
  target_deployment_id?: number;
  actuator_command?: string;
  actuator_parameters?: Record<string, any>;
  cooldown_minutes: number;
}

export interface UpdateAutomationRuleRequest {
  name?: string;
  description?: string;
  sensor_deployment_id?: number;
  operator?: ComparisonOperator;
  threshold_value?: number;
  action_type?: AutomationActionType;
  alert_title?: string;
  alert_message?: string;
  alert_severity?: string;
  target_deployment_id?: number;
  actuator_command?: string;
  actuator_parameters?: Record<string, any>;
  cooldown_minutes?: number;
}

// Alert Types
export interface Alert {
  id: number;
  title: string;
  message: string;
  severity: 'info' | 'warning' | 'error' | 'critical';
  automation_rule_id?: number;
  is_read: boolean;
  created_at: string;
  read_at?: string;
}

// Query Parameters
export interface PaginationParams {
  skip?: number;
  limit?: number;
}

export interface DeviceQueryParams extends PaginationParams {
  device_type?: DeviceTypeEnum;
  active_only?: boolean;
}

export interface ComponentQueryParams extends PaginationParams {
  device_id?: number;
  component_type_id?: number;
  category?: ComponentCategory;
  active_only?: boolean;
}

export interface SensorQueryParams extends PaginationParams {
  deployment_id?: number;
  start_date?: string;
  end_date?: string;
  hours?: number;
}

export interface ZoneQueryParams extends PaginationParams {
  parent_zone_id?: number;
}

export interface AutomationQueryParams extends PaginationParams {
  is_active?: boolean;
}

export interface AlertQueryParams extends PaginationParams {
  severity?: string;
} 