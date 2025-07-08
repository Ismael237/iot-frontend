import { Alert } from '../../shared/types/api.types';

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

export type AlertSeverity = 'info' | 'warning' | 'error' | 'critical';

export interface CreateAlertRequest {
  title: string;
  message: string;
  severity: AlertSeverity;
  automationRuleId?: number;
}

export interface UpdateAlertRequest {
  title?: string;
  message?: string;
  severity?: AlertSeverity;
  isRead?: boolean;
  isAcknowledged?: boolean;
}

export interface AlertStats {
  total: number;
  unread: number;
  unacknowledged: number;
  bySeverity: {
    info: number;
    warning: number;
    error: number;
    critical: number;
  };
  today: number;
  thisWeek: number;
  thisMonth: number;
}

export interface AlertFilter {
  severity?: AlertSeverity;
  isRead?: boolean;
  isAcknowledged?: boolean;
  automationRuleId?: number;
  startDate?: string;
  endDate?: string;
  limit?: number;
  offset?: number;
}

export interface AlertSummary {
  id: number;
  title: string;
  severity: AlertSeverity;
  isRead: boolean;
  isAcknowledged: boolean;
  createdAt: string;
  automationRuleId?: number;
}

export enum AlertSeverityEnum {
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error',
  CRITICAL = 'critical'
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

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  OPERATOR = 'operator',
  VIEWER = 'viewer'
} 