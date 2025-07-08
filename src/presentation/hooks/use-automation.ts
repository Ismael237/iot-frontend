import { useState, useCallback } from 'react';
import { apiClient } from '../../infrastructure/api/axios-client';
import { AutomationRule, Alert } from '../../shared/types/automation.types';

export function useAutomation() {
  const [rules, setRules] = useState<AutomationRule[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch automation rules
  const fetchRules = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get('/automation/rules', { params });
      setRules(response || []);
    } catch (err: any) {
      setError(err?.message || 'Failed to load rules');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch alerts
  const fetchAlerts = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get('/automation/alerts', { params });
      setAlerts(response || []);
    } catch (err: any) {
      setError(err?.message || 'Failed to load alerts');
    } finally {
      setLoading(false);
    }
  }, []);

  // Create a new rule
  const createRule = useCallback(async (data: Partial<AutomationRule>) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.post('/automation/rules', data);
      setRules(prev => [...prev, response]);
      return response;
    } catch (err: any) {
      setError(err?.message || 'Failed to create rule');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Update a rule
  const updateRule = useCallback(async (id: number, data: Partial<AutomationRule>) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.patch(`/automation/rules/${id}`, data);
      setRules(prev => prev.map(r => (r.rule_id === id ? response : r)));
      return response;
    } catch (err: any) {
      setError(err?.message || 'Failed to update rule');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Delete a rule
  const deleteRule = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      await apiClient.delete(`/automation/rules/${id}`);
      setRules(prev => prev.filter(r => r.rule_id !== id));
    } catch (err: any) {
      setError(err?.message || 'Failed to delete rule');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    rules,
    alerts,
    loading,
    error,
    fetchRules,
    fetchAlerts,
    createRule,
    updateRule,
    deleteRule,
  };
} 