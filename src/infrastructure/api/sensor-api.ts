import { apiClient } from './axios-client';
import type { SensorReading, SensorStats, SensorDeployment } from '../../domain/entities/sensor.entity';
import { API_ENDPOINTS, buildQueryString } from '../../shared/constants/api-endpoints';

export interface SensorReadingsParams {
  limit?: number;
  deploymentId?: number;
  startDate?: string;
  endDate?: string;
  skip?: number;
}

export interface AggregatedReadingsParams {
  interval: 'hour' | 'day' | 'week';
  deploymentId?: number;
  startDate?: string;
  endDate?: string;
}

export interface SensorStatsParams {
  deploymentId?: number;
  days?: number;
}

export interface SensorDeploymentsParams {
  deviceId?: number;
  activeOnly?: boolean;
  skip?: number;
  limit?: number;
}

export interface SensorReadingsResponse {
  data: SensorReading[];
  total: number;
}

export interface AggregatedReadingsResponse {
  timestamps: string[];
  values: number[];
  avgValues: number[];
  minValues: number[];
  maxValues: number[];
}

export interface SensorStatsResponse {
  data: SensorStats[];
  total: number;
}

export type SensorDeploymentsResponse = SensorDeployment[];

export interface SensorApi {
  getReadings: (params?: SensorReadingsParams) => Promise<SensorReading[]>;
  getLatestReadings: (params?: { deploymentId?: number }) => Promise<SensorReading[]>;
  getAggregatedReadings: (params: AggregatedReadingsParams) => Promise<AggregatedReadingsResponse>;
  getSensorReadings: (deploymentId: number, params?: SensorReadingsParams) => Promise<SensorReading[]>;
  getSensorStats: (deploymentId: number, params?: SensorStatsParams) => Promise<SensorStatsResponse>;
  getSensorDeployments: (params?: SensorDeploymentsParams) => Promise<SensorDeploymentsResponse>;
}

export const sensorApi: SensorApi = {
  getReadings: async (params = {}) => {
    const queryString = buildQueryString(params);
    const url = queryString ? `${API_ENDPOINTS.SENSORS.READINGS.LIST}?${queryString}` : API_ENDPOINTS.SENSORS.READINGS.LIST;
    const response = await apiClient.get(url);
    return response;
  },

  getLatestReadings: async (params = {}) => {
    const queryString = buildQueryString(params);
    const url = queryString ? `${API_ENDPOINTS.SENSORS.READINGS.LATEST}?${queryString}` : API_ENDPOINTS.SENSORS.READINGS.LATEST;
    const response = await apiClient.get(url);
    return response;
  },

  getAggregatedReadings: async (params) => {
    const queryString = buildQueryString(params);
    const url = queryString ? `${API_ENDPOINTS.SENSORS.READINGS.AGGREGATED}?${queryString}` : API_ENDPOINTS.SENSORS.READINGS.AGGREGATED;
    const response = await apiClient.get(url);
    return response;
  },

  getSensorReadings: async (deploymentId: number, params = {}) => {
    const queryString = buildQueryString(params);
    const url = queryString 
      ? `${API_ENDPOINTS.SENSORS.READINGS.BY_DEPLOYMENT(deploymentId)}?${queryString}` 
      : API_ENDPOINTS.SENSORS.READINGS.BY_DEPLOYMENT(deploymentId);
    const response = await apiClient.get(url);
    return response;
  },

  getSensorStats: async (deploymentId: number, params = {}) => {
    const queryString = buildQueryString(params);
    const url = queryString 
      ? `${API_ENDPOINTS.SENSORS.READINGS.STATS(deploymentId)}?${queryString}` 
      : API_ENDPOINTS.SENSORS.READINGS.STATS(deploymentId);
    const response = await apiClient.get(url);
    return response;
  },

  getSensorDeployments: async (params = {}) => {
    const queryString = buildQueryString(params);
    const url = queryString ? `${API_ENDPOINTS.COMPONENTS.DEPLOYMENTS.LIST}?${queryString}` : API_ENDPOINTS.COMPONENTS.DEPLOYMENTS.LIST;
    const response = await apiClient.get(url);
    return response;
  }
}; 