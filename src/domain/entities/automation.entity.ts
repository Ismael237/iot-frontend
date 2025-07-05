export interface AutomationRule {
  id: number;
  name: string;
  description?: string;
  sensorDeploymentId: number;
  operator: ComparisonOperator;
  thresholdValue: number;
  actionType: ActionType;
  alertTitle?: string;
  alertMessage?: string;
  alertSeverity?: AlertSeverity;
  targetDeploymentId?: number;
  actuatorCommand?: string;
  actuatorParameters?: Record<string, any>;
  cooldownMinutes: number;
  isActive: boolean;
  lastTriggered?: string;
  triggerCount: number;
  createdAt: string;
  updatedAt: string;
  sensorDeployment: ComponentDeployment;
  targetDeployment?: ComponentDeployment;
}

export interface Alert {
  id: number;
  title: string;
  message: string;
  severity: AlertSeverity;
  source: AlertSource;
  sourceId?: number;
  metadata?: Record<string, any>;
  isRead: boolean;
  isAcknowledged: boolean;
  acknowledgedAt?: string;
  acknowledgedBy?: number;
  createdAt: string;
  updatedAt: string;
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

export enum ComparisonOperator {
  EQUALS = 'equals',
  NOT_EQUALS = 'not_equals',
  GREATER_THAN = 'greater_than',
  GREATER_THAN_OR_EQUAL = 'greater_than_or_equal',
  LESS_THAN = 'less_than',
  LESS_THAN_OR_EQUAL = 'less_than_or_equal',
  BETWEEN = 'between',
  NOT_BETWEEN = 'not_between',
  CONTAINS = 'contains',
  NOT_CONTAINS = 'not_contains',
  STARTS_WITH = 'starts_with',
  ENDS_WITH = 'ends_with',
  IS_NULL = 'is_null',
  IS_NOT_NULL = 'is_not_null'
}

export enum ActionType {
  SEND_ALERT = 'send_alert',
  ACTIVATE_ACTUATOR = 'activate_actuator',
  DEACTIVATE_ACTUATOR = 'deactivate_actuator',
  TOGGLE_ACTUATOR = 'toggle_actuator',
  SET_ACTUATOR_VALUE = 'set_actuator_value',
  SEND_NOTIFICATION = 'send_notification',
  LOG_EVENT = 'log_event',
  EXECUTE_SCRIPT = 'execute_script',
  HTTP_REQUEST = 'http_request',
  EMAIL = 'email',
  SMS = 'sms',
  WEBHOOK = 'webhook'
}

export enum AlertSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error'
}

export enum AlertSource {
  AUTOMATION_RULE = 'automation_rule',
  SYSTEM_MONITOR = 'system_monitor',
  DEVICE_ALERT = 'device_alert',
  SENSOR_ALERT = 'sensor_alert',
  ACTUATOR_ALERT = 'actuator_alert',
  ZONE_ALERT = 'zone_alert',
  MANUAL = 'manual',
  EXTERNAL = 'external'
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