import { create } from 'zustand';
import type { AutomationRule, Alert, ComparisonOperator, AutomationActionType, AlertSeverity } from '../entities/automation.entity';
import { automationApi } from '../../infrastructure/api/automation-api';

interface AutomationStoreState {
  rules: AutomationRule[];
  alerts: Alert[];
  selectedRule: AutomationRule | null;
  selectedAlert: Alert | null;
  isLoading: boolean;
  error: string | null;
  totalRules: number;
  totalAlerts: number;
  
  // Actions
  fetchRules: (params?: { isActive?: boolean; skip?: number; limit?: number; search?: string }) => Promise<void>;
  fetchAlerts: (params?: { severity?: string; skip?: number; limit?: number; search?: string }) => Promise<void>;
  createRule: (ruleData: CreateRuleData) => Promise<AutomationRule>;
  updateRule: (id: number, ruleData: UpdateRuleData) => Promise<AutomationRule>;
  deleteRule: (id: number) => Promise<void>;
  activateRule: (id: number, isActive: boolean) => Promise<AutomationRule>;
  acknowledgeAlert: (id: number) => Promise<void>;
  setSelectedRule: (rule: AutomationRule | null) => void;
  setSelectedAlert: (alert: Alert | null) => void;
  clearError: () => void;
}

interface CreateRuleData {
  name: string;
  description?: string;
  sensorDeploymentId: number;
  operator: ComparisonOperator;
  thresholdValue: number;
  actionType: AutomationActionType;
  alertTitle?: string;
  alertMessage?: string;
  alertSeverity?: AlertSeverity;
  targetDeploymentId?: number;
  actuatorCommand?: string;
  actuatorParameters?: Record<string, any>;
  cooldownMinutes: number;
}

interface UpdateRuleData {
  name?: string;
  description?: string;
  operator?: ComparisonOperator;
  thresholdValue?: number;
  actionType?: AutomationActionType;
  alertTitle?: string;
  alertMessage?: string;
  alertSeverity?: AlertSeverity;
  actuatorCommand?: string;
  actuatorParameters?: Record<string, any>;
  cooldownMinutes?: number;
}

// Validation utilities
const isValidAutomationRule = (rule: any): rule is AutomationRule => {
  return (
    rule &&
    typeof rule.ruleId === 'number' &&
    typeof rule.name === 'string' &&
    typeof rule.sensorDeploymentId === 'number' &&
    typeof rule.operator === 'string' &&
    typeof rule.thresholdValue === 'number' &&
    typeof rule.actionType === 'string' &&
    typeof rule.cooldownMinutes === 'number' &&
    typeof rule.isActive === 'boolean'
  );
};

const isValidAlert = (alert: any): alert is Alert => {
  return (
    alert &&
    typeof alert.alertId === 'number' &&
    typeof alert.title === 'string' &&
    typeof alert.message === 'string' &&
    typeof alert.severity === 'string'
  );
};

const sanitizeRule = (rule: any): AutomationRule => {
  if (!isValidAutomationRule(rule)) {
    throw new Error('Invalid automation rule data');
  }

  return {
    ruleId: rule.ruleId,
    name: rule.name,
    description: rule.description || '',
    sensorDeploymentId: rule.sensorDeploymentId,
    operator: rule.operator as ComparisonOperator,
    thresholdValue: rule.thresholdValue,
    actionType: rule.actionType as AutomationActionType,
    alertTitle: rule.alertTitle,
    alertMessage: rule.alertMessage,
    alertSeverity: rule.alertSeverity as AlertSeverity,
    targetDeploymentId: rule.targetDeploymentId,
    actuatorCommand: rule.actuatorCommand,
    actuatorParameters: rule.actuatorParameters || {},
    cooldownMinutes: rule.cooldownMinutes,
    isActive: rule.isActive,
    lastTriggered: rule.lastTriggered,
    createdAt: rule.createdAt || new Date().toISOString(),
    updatedAt: rule.updatedAt || new Date().toISOString()
  };
};

const sanitizeAlert = (alert: any): Alert => {
  if (!isValidAlert(alert)) {
    throw new Error('Invalid alert data');
  }

  return {
    id: alert.id,
    title: alert.title,
    message: alert.message,
    severity: alert.severity as AlertSeverity,
    automationRuleId: alert.automationRuleId,
    isRead: alert.isRead,
    isAcknowledged: alert.isAcknowledged,
    createdAt: alert.createdAt || new Date().toISOString(),
    readAt: alert.readAt,
    acknowledgedAt: alert.acknowledgedAt
  };
};

export const useAutomationStore = create<AutomationStoreState>((set, get) => ({
  rules: [],
  alerts: [],
  selectedRule: null,
  selectedAlert: null,
  isLoading: false,
  error: null,
  totalRules: 0,
  totalAlerts: 0,

  fetchRules: async (params = {}) => {
    set({ isLoading: true, error: null });
    try {
      const response = await automationApi.getRules(params);
      
      // Validate and sanitize rules
      const validRules = response
        .filter(isValidAutomationRule)
        .map(sanitizeRule);

      set({
        rules: validRules,
        totalRules: response.total || validRules.length,
        isLoading: false
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch rules',
        isLoading: false
      });
    }
  },

  fetchAlerts: async (params = {}) => {
    set({ isLoading: true, error: null });
    try {
      const response = await automationApi.getAlerts(params);
      
      // Validate and sanitize alerts
      const validAlerts = response
        .filter(isValidAlert)
        .map(sanitizeAlert);

      set({
        alerts: validAlerts,
        totalAlerts: response.total || validAlerts.length,
        isLoading: false
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch alerts',
        isLoading: false
      });
    }
  },

  createRule: async (ruleData: CreateRuleData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await automationApi.createRule(ruleData);
      
      const newRule = sanitizeRule(response);
      
      set(state => ({
        rules: [...state.rules, newRule],
        totalRules: state.totalRules + 1,
        isLoading: false
      }));
      
      return newRule;
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to create rule',
        isLoading: false
      });
      throw error;
    }
  },

  updateRule: async (id: number, ruleData: UpdateRuleData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await automationApi.updateRule(id, ruleData);
      
      const updatedRule = sanitizeRule(response);
      
      set(state => ({
        rules: state.rules.map(rule => rule.id === id ? updatedRule : rule),
        isLoading: false
      }));
      
      return updatedRule;
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to update rule',
        isLoading: false
      });
      throw error;
    }
  },

  deleteRule: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      await automationApi.deleteRule(id);
      
      set(state => ({
        rules: state.rules.filter(rule => rule.id !== id),
        totalRules: state.totalRules - 1,
        isLoading: false
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to delete rule',
        isLoading: false
      });
      throw error;
    }
  },

  activateRule: async (id: number, isActive: boolean) => {
    set({ isLoading: true, error: null });
    try {
      const response = await automationApi.activateRule(id, { isActive });
      
      const updatedRule = sanitizeRule(response);
      
      set(state => ({
        rules: state.rules.map(rule => rule.id === id ? updatedRule : rule),
        isLoading: false
      }));
      
      return updatedRule;
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to activate/deactivate rule',
        isLoading: false
      });
      throw error;
    }
  },

  acknowledgeAlert: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      await automationApi.acknowledgeAlert(id);
      
      set(state => ({
        alerts: state.alerts.map(alert => 
          alert.id === id 
            ? { 
                ...alert, 
                isAcknowledged: true, 
                acknowledgedAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
              }
            : alert
        ),
        isLoading: false
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to acknowledge alert',
        isLoading: false
      });
      throw error;
    }
  },

  setSelectedRule: (rule: AutomationRule | null) => {
    if (rule && !isValidAutomationRule(rule)) {
      console.warn('Invalid rule data provided to setSelectedRule');
      return;
    }
    set({ selectedRule: rule });
  },

  setSelectedAlert: (alert: Alert | null) => {
    if (alert && !isValidAlert(alert)) {
      console.warn('Invalid alert data provided to setSelectedAlert');
      return;
    }
    set({ selectedAlert: alert });
  },

  clearError: () => {
    set({ error: null });
  }
})); 