import { create } from 'zustand';
import { AutomationRule, Alert, ComparisonOperator, ActionType, AlertSeverity } from '../entities/automation.entity';

interface AutomationState {
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
  actionType: ActionType;
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
  actionType?: ActionType;
  alertTitle?: string;
  alertMessage?: string;
  alertSeverity?: AlertSeverity;
  actuatorCommand?: string;
  actuatorParameters?: Record<string, any>;
  cooldownMinutes?: number;
}

export const useAutomationStore = create<AutomationState>((set, get) => ({
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
      // Mock API call - replace with actual API
      const { isActive = true, skip = 0, limit = 20, search } = params;
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock data
      const mockRules: AutomationRule[] = [
        {
          id: 1,
          name: 'High Temperature Alert',
          description: 'Alert when temperature exceeds 30°C',
          sensorDeploymentId: 1,
          operator: ComparisonOperator.GREATER_THAN,
          thresholdValue: 30,
          actionType: ActionType.SEND_ALERT,
          alertTitle: 'High Temperature Detected',
          alertMessage: 'Temperature has exceeded 30°C in Zone A',
          alertSeverity: AlertSeverity.HIGH,
          cooldownMinutes: 15,
          isActive: true,
          lastTriggered: '2024-01-15T14:30:00Z',
          triggerCount: 5,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-15T14:30:00Z',
          sensorDeployment: {} as any,
          targetDeployment: undefined
        },
        {
          id: 2,
          name: 'Low Humidity Control',
          description: 'Activate humidifier when humidity drops below 40%',
          sensorDeploymentId: 2,
          operator: ComparisonOperator.LESS_THAN,
          thresholdValue: 40,
          actionType: ActionType.ACTIVATE_ACTUATOR,
          targetDeploymentId: 3,
          actuatorCommand: 'on',
          cooldownMinutes: 30,
          isActive: true,
          lastTriggered: '2024-01-15T12:15:00Z',
          triggerCount: 3,
          createdAt: '2024-01-02T00:00:00Z',
          updatedAt: '2024-01-15T12:15:00Z',
          sensorDeployment: {} as any,
          targetDeployment: {} as any
        },
        {
          id: 3,
          name: 'Motion Detection',
          description: 'Turn on lights when motion is detected',
          sensorDeploymentId: 4,
          operator: ComparisonOperator.EQUALS,
          thresholdValue: 1,
          actionType: ActionType.ACTIVATE_ACTUATOR,
          targetDeploymentId: 5,
          actuatorCommand: 'on',
          cooldownMinutes: 5,
          isActive: false,
          lastTriggered: undefined,
          triggerCount: 0,
          createdAt: '2024-01-03T00:00:00Z',
          updatedAt: '2024-01-10T00:00:00Z',
          sensorDeployment: {} as any,
          targetDeployment: {} as any
        }
      ];

      let filteredRules = mockRules;
      
      if (isActive !== undefined) {
        filteredRules = filteredRules.filter(rule => rule.isActive === isActive);
      }
      
      if (search) {
        filteredRules = filteredRules.filter(rule => 
          rule.name.toLowerCase().includes(search.toLowerCase()) ||
          rule.description?.toLowerCase().includes(search.toLowerCase())
        );
      }

      const paginatedRules = filteredRules.slice(skip, skip + limit);
      
      set({
        rules: paginatedRules,
        totalRules: filteredRules.length,
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
      // Mock API call - replace with actual API
      const { severity, skip = 0, limit = 50, search } = params;
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock data
      const mockAlerts: Alert[] = [
        {
          id: 1,
          title: 'High Temperature Detected',
          message: 'Temperature has exceeded 30°C in Zone A',
          severity: AlertSeverity.HIGH,
          source: 'automation_rule' as any,
          sourceId: 1,
          sourceName: 'High Temperature Alert',
          isRead: false,
          isAcknowledged: false,
          createdAt: '2024-01-15T14:30:00Z',
          updatedAt: '2024-01-15T14:30:00Z'
        },
        {
          id: 2,
          title: 'Device Offline',
          message: 'Sensor device SENSOR-001 has been offline for more than 5 minutes',
          severity: AlertSeverity.MEDIUM,
          source: 'device_alert' as any,
          sourceId: 1,
          sourceName: 'SENSOR-001',
          isRead: true,
          isAcknowledged: true,
          acknowledgedAt: '2024-01-15T14:35:00Z',
          acknowledgedBy: 1,
          createdAt: '2024-01-15T14:25:00Z',
          updatedAt: '2024-01-15T14:35:00Z'
        },
        {
          id: 3,
          title: 'Low Battery Warning',
          message: 'Battery level is below 20% on device ACTUATOR-001',
          severity: AlertSeverity.LOW,
          source: 'device_alert' as any,
          sourceId: 2,
          sourceName: 'ACTUATOR-001',
          isRead: false,
          isAcknowledged: false,
          createdAt: '2024-01-15T13:45:00Z',
          updatedAt: '2024-01-15T13:45:00Z'
        }
      ];

      let filteredAlerts = mockAlerts;
      
      if (severity) {
        filteredAlerts = filteredAlerts.filter(alert => alert.severity === severity);
      }
      
      if (search) {
        filteredAlerts = filteredAlerts.filter(alert => 
          alert.title.toLowerCase().includes(search.toLowerCase()) ||
          alert.message.toLowerCase().includes(search.toLowerCase())
        );
      }

      const paginatedAlerts = filteredAlerts.slice(skip, skip + limit);
      
      set({
        alerts: paginatedAlerts,
        totalAlerts: filteredAlerts.length,
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
      // Mock API call - replace with actual API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newRule: AutomationRule = {
        id: Date.now(),
        ...ruleData,
        isActive: true,
        lastTriggered: undefined,
        triggerCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        sensorDeployment: {} as any,
        targetDeployment: ruleData.targetDeploymentId ? {} as any : undefined
      };
      
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
      // Mock API call - replace with actual API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      set(state => ({
        rules: state.rules.map(rule => 
          rule.id === id 
            ? { ...rule, ...ruleData, updatedAt: new Date().toISOString() }
            : rule
        ),
        isLoading: false
      }));
      
      const updatedRule = get().rules.find(r => r.id === id);
      return updatedRule!;
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
      // Mock API call - replace with actual API
      await new Promise(resolve => setTimeout(resolve, 500));
      
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
      // Mock API call - replace with actual API
      await new Promise(resolve => setTimeout(resolve, 300));
      
      set(state => ({
        rules: state.rules.map(rule => 
          rule.id === id 
            ? { ...rule, isActive, updatedAt: new Date().toISOString() }
            : rule
        ),
        isLoading: false
      }));
      
      const updatedRule = get().rules.find(r => r.id === id);
      return updatedRule!;
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
      // Mock API call - replace with actual API
      await new Promise(resolve => setTimeout(resolve, 300));
      
      set(state => ({
        alerts: state.alerts.map(alert => 
          alert.id === id 
            ? { 
                ...alert, 
                isAcknowledged: true, 
                acknowledgedAt: new Date().toISOString(),
                acknowledgedBy: 1,
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
    set({ selectedRule: rule });
  },

  setSelectedAlert: (alert: Alert | null) => {
    set({ selectedAlert: alert });
  },

  clearError: () => {
    set({ error: null });
  }
})); 