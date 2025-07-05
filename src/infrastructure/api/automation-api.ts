import { apiClient } from './axios-client';
import { AutomationRule, Alert, ComparisonOperator, ActionType, AlertSeverity } from '../../domain/entities/automation.entity';

export interface CreateRuleRequest {
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
}

export interface UpdateRuleRequest {
  name?: string;
  description?: string;
  operator?: ComparisonOperator;
  thresholdValue?: number;
  actionType?: ActionType;
  alertTitle?: string;
  alertMessage?: string;
  alertSeverity?: AlertSeverity;
  actuatorCommand?: string;
  actuatorParameters?: Record<string, any>;
  cooldownMinutes?: number;
}

export interface ActivateRuleRequest {
  isActive: boolean;
}

export interface RulesResponse {
  data: AutomationRule[];
  total: number;
}

export interface AlertsResponse {
  data: Alert[];
  total: number;
}

export interface AutomationApi {
  getRules: (params?: { isActive?: boolean; skip?: number; limit?: number; search?: string }) => Promise<RulesResponse>;
  getRuleById: (id: number) => Promise<AutomationRule>;
  createRule: (ruleData: CreateRuleRequest) => Promise<AutomationRule>;
  updateRule: (id: number, ruleData: UpdateRuleRequest) => Promise<AutomationRule>;
  deleteRule: (id: number) => Promise<{ success: boolean }>;
  activateRule: (id: number, activateData: ActivateRuleRequest) => Promise<AutomationRule>;
  getAlerts: (params?: { severity?: string; skip?: number; limit?: number; search?: string }) => Promise<AlertsResponse>;
  acknowledgeAlert: (id: number) => Promise<{ success: boolean }>;
}

export const automationApi: AutomationApi = {
  getRules: async (params = {}) => {
    const { isActive = true, skip = 0, limit = 20, search } = params;
    const queryParams = new URLSearchParams();
    
    if (isActive !== undefined) queryParams.append('is_active', isActive.toString());
    if (skip !== undefined) queryParams.append('skip', skip.toString());
    if (limit !== undefined) queryParams.append('limit', limit.toString());
    if (search) queryParams.append('search', search);
    
    const response = await apiClient.get(`/automation/rules?${queryParams.toString()}`);
    return response;
  },

  getRuleById: async (id: number) => {
    const response = await apiClient.get(`/automation/rules/${id}`);
    return response;
  },

  createRule: async (ruleData: CreateRuleRequest) => {
    const response = await apiClient.post('/automation/rules', ruleData);
    return response;
  },

  updateRule: async (id: number, ruleData: UpdateRuleRequest) => {
    const response = await apiClient.patch(`/automation/rules/${id}`, ruleData);
    return response;
  },

  deleteRule: async (id: number) => {
    const response = await apiClient.delete(`/automation/rules/${id}`);
    return response;
  },

  activateRule: async (id: number, activateData: ActivateRuleRequest) => {
    const response = await apiClient.post(`/automation/rules/${id}/activate`, activateData);
    return response;
  },

  getAlerts: async (params = {}) => {
    const { severity, skip = 0, limit = 50, search } = params;
    const queryParams = new URLSearchParams();
    
    if (severity) queryParams.append('severity', severity);
    if (skip !== undefined) queryParams.append('skip', skip.toString());
    if (limit !== undefined) queryParams.append('limit', limit.toString());
    if (search) queryParams.append('search', search);
    
    const response = await apiClient.get(`/automation/alerts?${queryParams.toString()}`);
    return response;
  },

  acknowledgeAlert: async (id: number) => {
    const response = await apiClient.post(`/automation/alerts/${id}/acknowledge`);
    return response;
  }
}; 