import { AutomationRule, Alert, ComponentDeployment, ComparisonOperator, AutomationActionType } from './api.types';
import { BaseEntity, Severity } from './common.types';

// Automation Condition Types
export interface AutomationCondition {
  condition_id: number;
  rule_id: number;
  condition_type: 'sensor' | 'time' | 'device_status' | 'composite';
  sensor_deployment_id?: number;
  operator?: ComparisonOperator;
  threshold_value?: number;
  time_condition?: {
    type: 'schedule' | 'duration' | 'interval';
    schedule?: {
      days_of_week: number[];
      start_time: string;
      end_time: string;
    };
    duration?: {
      minutes: number;
    };
    interval?: {
      start_date: string;
      end_date: string;
    };
  };
  device_status_condition?: {
    device_id: number;
    status: 'online' | 'offline' | 'error';
  };
  composite_conditions?: {
    operator: 'AND' | 'OR';
    conditions: AutomationCondition[];
  };
  metadata?: Record<string, any>;
}

// Automation Action Types
export interface AutomationAction {
  action_id: number;
  rule_id: number;
  action_type: AutomationActionType;
  order: number;
  delay_seconds?: number;
  
  // Alert Action
  alert_action?: {
    title: string;
    message: string;
    severity: 'info' | 'warning' | 'error' | 'critical';
    notification_channels: string[];
  };
  
  // Actuator Action
  actuator_action?: {
    target_deployment_id: number;
    command: string;
    parameters?: Record<string, any>;
    timeout_seconds?: number;
  };
  
  // Email Action
  email_action?: {
    recipients: string[];
    subject: string;
    template: string;
    variables?: Record<string, any>;
  };
  
  // Webhook Action
  webhook_action?: {
    url: string;
    method: 'GET' | 'POST' | 'PUT' | 'DELETE';
    headers?: Record<string, string>;
    body?: Record<string, any>;
    timeout_seconds?: number;
  };
  
  // SMS Action
  sms_action?: {
    phone_numbers: string[];
    message: string;
    provider?: string;
  };
  
  // HTTP Request Action
  http_action?: {
    url: string;
    method: 'GET' | 'POST' | 'PUT' | 'DELETE';
    headers?: Record<string, string>;
    body?: Record<string, any>;
    timeout_seconds?: number;
    expected_status_codes?: number[];
  };
  
  metadata?: Record<string, any>;
}

// Automation Execution Types
export interface AutomationExecution {
  execution_id: number;
  rule_id: number;
  triggered_at: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';
  condition_evaluation: {
    conditions_met: boolean;
    evaluation_time: string;
    details: Record<string, any>;
  };
  actions_executed: AutomationActionExecution[];
  total_duration_ms: number;
  error_message?: string;
  metadata?: Record<string, any>;
}

export interface AutomationActionExecution {
  action_id: number;
  action_type: AutomationActionType;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'skipped';
  started_at: string;
  completed_at?: string;
  duration_ms?: number;
  result?: any;
  error_message?: string;
  retry_count: number;
  max_retries: number;
}

// Automation Schedule Types
export interface AutomationSchedule {
  schedule_id: number;
  rule_id: number;
  schedule_type: 'immediate' | 'scheduled' | 'recurring' | 'conditional';
  
  immediate?: {
    enabled: boolean;
  };
  
  scheduled?: {
    start_date: string;
    end_date?: string;
    timezone: string;
  };
  
  recurring?: {
    frequency: 'minutely' | 'hourly' | 'daily' | 'weekly' | 'monthly';
    interval: number;
    start_time: string;
    end_time?: string;
    days_of_week?: number[];
    days_of_month?: number[];
    timezone: string;
  };
  
  conditional?: {
    depends_on_rule_id?: number;
    delay_seconds?: number;
  };
  
  enabled: boolean;
  last_run?: string;
  next_run?: string;
}

// Automation Template Types
export interface AutomationTemplate {
  template_id: number;
  name: string;
  description?: string;
  category: 'monitoring' | 'control' | 'notification' | 'maintenance' | 'custom';
  conditions: Omit<AutomationCondition, 'condition_id' | 'rule_id'>[];
  actions: Omit<AutomationAction, 'action_id' | 'rule_id'>[];
  variables: AutomationTemplateVariable[];
  created_by: number;
  created_at: string;
  updated_at: string;
  usage_count: number;
  rating?: number;
  tags: string[];
}

export interface AutomationTemplateVariable {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'select';
  label: string;
  description?: string;
  required: boolean;
  default_value?: any;
  options?: { value: any; label: string }[];
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    custom?: string;
  };
}

// Automation Dashboard Types
export interface AutomationOverview {
  total_rules: number;
  active_rules: number;
  inactive_rules: number;
  executions_today: number;
  successful_executions: number;
  failed_executions: number;
  average_execution_time: number;
  recent_executions: AutomationExecution[];
  top_rules: {
    rule_id: number;
    name: string;
    execution_count: number;
    success_rate: number;
  }[];
  system_health: {
    rules_health_score: number;
    average_response_time: number;
    error_rate: number;
  };
}

// Automation Analytics Types
export interface AutomationAnalytics {
  rule_id: number;
  period: string;
  metrics: {
    total_executions: number;
    successful_executions: number;
    failed_executions: number;
    success_rate: number;
    average_execution_time: number;
    total_duration: number;
    peak_execution_time: string;
    most_common_error?: string;
  };
  trends: {
    executions_per_day: { date: string; count: number }[];
    success_rate_trend: { date: string; rate: number }[];
    execution_time_trend: { date: string; avg_time: number }[];
  };
  action_performance: {
    action_type: AutomationActionType;
    execution_count: number;
    success_rate: number;
    average_duration: number;
  }[];
}

// Automation Import/Export Types
export interface AutomationExport {
  rules: AutomationRule[];
  conditions: AutomationCondition[];
  actions: AutomationAction[];
  schedules: AutomationSchedule[];
  templates: AutomationTemplate[];
  export_date: string;
  version: string;
  metadata?: Record<string, any>;
}

export interface AutomationImport {
  file: File;
  overwrite_existing?: boolean;
  validate_only?: boolean;
  import_templates?: boolean;
}

// Automation Testing Types
export interface AutomationTest {
  test_id: number;
  rule_id: number;
  test_name: string;
  test_data: {
    sensor_values: Record<number, number>;
    device_statuses: Record<number, string>;
    time_conditions: Record<string, any>;
  };
  expected_result: {
    conditions_met: boolean;
    actions_to_execute: number[];
  };
  actual_result?: {
    conditions_met: boolean;
    actions_executed: number[];
    execution_time: number;
    errors?: string[];
  };
  status: 'pending' | 'running' | 'passed' | 'failed';
  created_at: string;
  executed_at?: string;
}

// Automation Workflow Types
export interface AutomationWorkflow {
  workflow_id: number;
  name: string;
  description?: string;
  rules: AutomationWorkflowRule[];
  triggers: AutomationWorkflowTrigger[];
  status: 'draft' | 'active' | 'paused' | 'archived';
  created_by: number;
  created_at: string;
  updated_at: string;
}

export interface AutomationWorkflowRule {
  rule_id: number;
  order: number;
  depends_on?: number[];
  parallel_execution: boolean;
  timeout_seconds?: number;
  retry_config?: {
    max_retries: number;
    retry_delay_seconds: number;
    backoff_multiplier: number;
  };
}

export interface AutomationWorkflowTrigger {
  trigger_id: number;
  trigger_type: 'manual' | 'schedule' | 'webhook' | 'event';
  config: Record<string, any>;
  enabled: boolean;
}

// Automation Rule Types
export interface AutomationRule extends BaseEntity {
  name: string;
  description?: string;
  sensor_deployment_id: number;
  operator: ComparisonOperator;
  threshold_value: number;
  action_type: ActionType;
  alert_title?: string;
  alert_message?: string;
  alert_severity?: Severity;
  target_deployment_id?: number;
  actuator_command?: string;
  actuator_parameters?: Record<string, any>;
  cooldown_minutes: number;
  is_active: boolean;
  last_triggered?: string;
  trigger_count: number;
  success_count: number;
  failure_count: number;
  conditions?: AutomationCondition[];
  actions?: AutomationAction[];
  schedule?: AutomationSchedule;
  priority: number;
  tags?: string[];
}

export enum ActionType {
  SEND_ALERT = 'send_alert',
  CONTROL_ACTUATOR = 'control_actuator',
  SEND_EMAIL = 'send_email',
  SEND_SMS = 'send_sms',
  WEBHOOK = 'webhook',
  SCRIPT = 'script',
  BOTH = 'both'
}

// Automation Conditions
export interface AutomationCondition {
  id: string;
  type: ConditionType;
  sensor_id?: number;
  operator: ComparisonOperator;
  value: any;
  secondary_value?: any;
  duration?: number; // seconds
  aggregation?: AggregationType;
  time_window?: number; // minutes
  enabled: boolean;
  description?: string;
}

export enum ConditionType {
  SENSOR_VALUE = 'sensor_value',
  SENSOR_TREND = 'sensor_trend',
  TIME_BASED = 'time_based',
  DEVICE_STATUS = 'device_status',
  ZONE_OCCUPANCY = 'zone_occupancy',
  WEATHER = 'weather',
  EXTERNAL_API = 'external_api',
  COMPOSITE = 'composite'
}

export enum AggregationType {
  AVERAGE = 'average',
  MIN = 'min',
  MAX = 'max',
  SUM = 'sum',
  COUNT = 'count',
  MEDIAN = 'median',
  STD_DEV = 'std_dev'
}

// Automation Actions
export interface AutomationAction {
  id: string;
  type: ActionType;
  target_id?: number;
  parameters: Record<string, any>;
  delay?: number; // seconds
  retry_count?: number;
  retry_delay?: number; // seconds
  enabled: boolean;
  description?: string;
}

// Automation Schedule
export interface AutomationSchedule {
  enabled: boolean;
  type: ScheduleType;
  start_time?: string;
  end_time?: string;
  days_of_week?: number[];
  days_of_month?: number[];
  months?: number[];
  timezone: string;
  exceptions?: ScheduleException[];
}

export enum ScheduleType {
  ALWAYS = 'always',
  TIME_WINDOW = 'time_window',
  DAYS_OF_WEEK = 'days_of_week',
  DAYS_OF_MONTH = 'days_of_month',
  SEASONAL = 'seasonal',
  CUSTOM = 'custom'
}

export interface ScheduleException {
  date: string;
  start_time?: string;
  end_time?: string;
  enabled: boolean;
  reason?: string;
}

// Automation Execution
export interface AutomationExecution extends BaseEntity {
  rule_id: number;
  trigger_type: TriggerType;
  trigger_value: any;
  conditions_met: boolean;
  actions_executed: ActionExecution[];
  status: ExecutionStatus;
  error_message?: string;
  execution_time: number; // milliseconds
  metadata?: Record<string, any>;
}

export enum TriggerType {
  SENSOR_THRESHOLD = 'sensor_threshold',
  SCHEDULE = 'schedule',
  MANUAL = 'manual',
  WEBHOOK = 'webhook',
  COMPOSITE = 'composite'
}

export enum ExecutionStatus {
  PENDING = 'pending',
  RUNNING = 'running',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
  TIMEOUT = 'timeout'
}

export interface ActionExecution {
  action_id: string;
  type: ActionType;
  status: ExecutionStatus;
  start_time: string;
  end_time?: string;
  result?: any;
  error_message?: string;
  retry_count: number;
}

// Automation Templates
export interface AutomationTemplate extends BaseEntity {
  name: string;
  description: string;
  category: AutomationCategory;
  conditions_template: AutomationCondition[];
  actions_template: AutomationAction[];
  parameters: TemplateParameter[];
  tags: string[];
  usage_count: number;
  rating: number;
  is_public: boolean;
  created_by: number;
}

export enum AutomationCategory {
  ENVIRONMENTAL = 'environmental',
  SECURITY = 'security',
  ENERGY = 'energy',
  MAINTENANCE = 'maintenance',
  NOTIFICATION = 'notification',
  INTEGRATION = 'integration',
  CUSTOM = 'custom'
}

export interface TemplateParameter {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'select' | 'date';
  label: string;
  description?: string;
  required: boolean;
  default_value?: any;
  options?: Array<{ value: any; label: string }>;
  validation?: ParameterValidation;
}

export interface ParameterValidation {
  min?: number;
  max?: number;
  pattern?: string;
  min_length?: number;
  max_length?: number;
  custom_validator?: string;
}

// Automation Analytics
export interface AutomationAnalytics {
  rule_id: number;
  period: string;
  total_executions: number;
  successful_executions: number;
  failed_executions: number;
  average_execution_time: number;
  total_trigger_count: number;
  success_rate: number;
  most_common_triggers: TriggerStats[];
  action_performance: ActionPerformance[];
  error_analysis: ErrorAnalysis[];
}

export interface TriggerStats {
  trigger_type: TriggerType;
  count: number;
  percentage: number;
}

export interface ActionPerformance {
  action_type: ActionType;
  total_executions: number;
  success_count: number;
  failure_count: number;
  average_execution_time: number;
  success_rate: number;
}

export interface ErrorAnalysis {
  error_type: string;
  count: number;
  percentage: number;
  last_occurrence: string;
  common_causes: string[];
}

// Automation Workflow
export interface AutomationWorkflow extends BaseEntity {
  name: string;
  description?: string;
  version: string;
  rules: AutomationRule[];
  connections: WorkflowConnection[];
  entry_points: string[];
  exit_points: string[];
  variables: WorkflowVariable[];
  is_active: boolean;
  execution_mode: ExecutionMode;
  timeout: number; // seconds
}

export interface WorkflowConnection {
  id: string;
  from_rule_id: number;
  to_rule_id: number;
  condition?: string;
  type: ConnectionType;
}

export enum ConnectionType {
  SUCCESS = 'success',
  FAILURE = 'failure',
  CONDITIONAL = 'conditional',
  PARALLEL = 'parallel'
}

export interface WorkflowVariable {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'object';
  initial_value?: any;
  description?: string;
  is_global: boolean;
}

export enum ExecutionMode {
  SEQUENTIAL = 'sequential',
  PARALLEL = 'parallel',
  CONDITIONAL = 'conditional'
}

// Automation Monitoring
export interface AutomationMonitor {
  rule_id: number;
  is_monitoring: boolean;
  metrics: MonitorMetric[];
  alerts: MonitorAlert[];
  last_check: string;
  next_check?: string;
}

export interface MonitorMetric {
  name: string;
  value: number;
  unit: string;
  timestamp: string;
  threshold?: number;
  status: 'normal' | 'warning' | 'critical';
}

export interface MonitorAlert {
  id: string;
  type: 'performance' | 'error_rate' | 'execution_time' | 'custom';
  severity: Severity;
  message: string;
  timestamp: string;
  is_active: boolean;
  acknowledged: boolean;
} 