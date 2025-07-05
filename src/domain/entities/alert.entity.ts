export interface Alert {
  id: number;
  title: string;
  message: string;
  severity: AlertSeverity;
  source: AlertSource;
  sourceId?: number;
  sourceName?: string;
  metadata?: Record<string, any>;
  isRead: boolean;
  isAcknowledged: boolean;
  acknowledgedAt?: string;
  acknowledgedBy?: number;
  acknowledgedByUser?: User;
  createdAt: string;
  updatedAt: string;
}

export interface AlertSummary {
  total: number;
  unread: number;
  unacknowledged: number;
  bySeverity: Record<AlertSeverity, number>;
  bySource: Record<AlertSource, number>;
  recentAlerts: Alert[];
}

export interface AlertFilter {
  severity?: AlertSeverity[];
  source?: AlertSource[];
  isRead?: boolean;
  isAcknowledged?: boolean;
  startDate?: string;
  endDate?: string;
  searchTerm?: string;
}

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
  NETWORK_ALERT = 'network_alert',
  SECURITY_ALERT = 'security_alert',
  PERFORMANCE_ALERT = 'performance_alert',
  MANUAL = 'manual',
  EXTERNAL = 'external'
}

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  OPERATOR = 'operator',
  VIEWER = 'viewer'
} 