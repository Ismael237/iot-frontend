import { AutomationRule, Alert } from '../../shared/types/api.types';

export interface AutomationRule {
  ruleId: number;
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

export interface Alert {
  id: number;
  title: string;
  message: string;
  severity: AlertSeverity;
  automationRuleId?: number;
  isRead: boolean;
  isAcknowledged: boolean;
  createdAt: string;
  readAt?: string;
  acknowledgedAt?: string;
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

export type ComparisonOperator = 'gt' | 'lt' | 'gte' | 'lte' | 'eq' | 'ne';
export type AutomationActionType = 'create_alert' | 'trigger_actuator';
export type AlertSeverity = 'info' | 'warning' | 'error' | 'critical';

export type CreateAutomationRuleRequest = Omit<AutomationRule, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateAutomationRuleRequest = Partial<Omit<AutomationRule, 'id' | 'createdAt' | 'updatedAt'>>;

export interface AutomationRuleExecution {
  id: number;
  ruleId: number;
  sensorValue: number;
  thresholdValue: number;
  triggered: boolean;
  actionExecuted: boolean;
  executedAt: string;
  result?: string;
  error?: string;
}

export interface AutomationRuleStats {
  ruleId: number;
  totalExecutions: number;
  successfulExecutions: number;
  failedExecutions: number;
  lastExecution?: string;
  averageExecutionTime: number;
  alertsGenerated: number;
  actuatorsTriggered: number;
}

export interface AutomationSystemStatus {
  totalRules: number;
  activeRules: number;
  inactiveRules: number;
  rulesExecutedToday: number;
  alertsGeneratedToday: number;
  actuatorsTriggeredToday: number;
  systemHealth: 'healthy' | 'warning' | 'error';
  lastSystemCheck: string;
}

export enum ComparisonOperatorEnum {
  GREATER_THAN = 'gt',
  LESS_THAN = 'lt',
  GREATER_THAN_OR_EQUAL = 'gte',
  LESS_THAN_OR_EQUAL = 'lte',
  EQUAL = 'eq',
  NOT_EQUAL = 'ne'
}

export enum AutomationActionTypeEnum {
  CREATE_ALERT = 'create_alert',
  TRIGGER_ACTUATOR = 'trigger_actuator'
}

export enum AlertSeverityEnum {
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error',
  CRITICAL = 'critical'
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