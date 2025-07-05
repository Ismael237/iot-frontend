import { BaseEntity, Severity } from './common.types';
import { SensorReading, ComponentDeployment, ConnStatus } from './api.types';

// Sensor Data Types
export interface SensorDataPoint {
  timestamp: string;
  value: number;
  unit?: string;
  quality?: 'good' | 'fair' | 'poor';
  flags?: string[];
}

export interface SensorTimeSeries {
  deployment_id: number;
  sensor_name: string;
  unit: string;
  data: SensorDataPoint[];
  metadata?: {
    min_value: number;
    max_value: number;
    avg_value: number;
    total_readings: number;
  };
}

// Sensor Aggregation Types
export interface SensorAggregation {
  deployment_id: number;
  interval: 'minute' | 'hour' | 'day' | 'week' | 'month';
  start_time: string;
  end_time: string;
  data: {
    timestamp: string;
    min: number;
    max: number;
    avg: number;
    count: number;
    sum: number;
  }[];
}

export interface SensorStatistics {
  deployment_id: number;
  period: string;
  statistics: {
    min: number;
    max: number;
    avg: number;
    median: number;
    std_dev: number;
    variance: number;
    count: number;
    sum: number;
  };
  percentiles: {
    p10: number;
    p25: number;
    p50: number;
    p75: number;
    p90: number;
    p95: number;
    p99: number;
  };
}

// Sensor Alert Types
export interface SensorAlert {
  alert_id: number;
  deployment_id: number;
  sensor_name: string;
  alert_type: 'threshold' | 'trend' | 'anomaly' | 'connection';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  threshold_value?: number;
  current_value?: number;
  triggered_at: string;
  acknowledged_at?: string;
  acknowledged_by?: number;
  resolved_at?: string;
  metadata?: Record<string, any>;
}

export interface SensorAlertRule {
  rule_id: number;
  deployment_id: number;
  alert_type: 'threshold' | 'trend' | 'anomaly';
  condition: {
    operator: '>' | '<' | '>=' | '<=' | '=' | '!=';
    value: number;
    duration?: number; // minutes
  };
  severity: 'low' | 'medium' | 'high' | 'critical';
  enabled: boolean;
  cooldown_minutes: number;
  notification_channels: string[];
}

// Sensor Calibration Types
export interface SensorCalibration {
  calibration_id: number;
  deployment_id: number;
  calibration_date: string;
  calibration_type: 'zero' | 'span' | 'full';
  reference_value: number;
  measured_value: number;
  correction_factor: number;
  uncertainty: number;
  calibrated_by: number;
  notes?: string;
  next_calibration_date?: string;
}

// Sensor Health Types
export interface SensorHealth {
  deployment_id: number;
  status: 'healthy' | 'warning' | 'error' | 'maintenance';
  last_reading: SensorReading;
  connection_status: ConnStatus;
  battery_level?: number;
  signal_strength?: number;
  error_count: number;
  last_error?: string;
  maintenance_due?: string;
  health_score: number; // 0-100
}

// Sensor Configuration Types
export interface SensorConfig {
  deployment_id: number;
  reading_interval: number; // seconds
  transmission_interval: number; // seconds
  calibration_offset: number;
  calibration_scale: number;
  alarm_thresholds: {
    low_low: number;
    low: number;
    high: number;
    high_high: number;
  };
  data_quality: {
    min_acceptable_value: number;
    max_acceptable_value: number;
    max_rate_of_change: number;
  };
  metadata?: Record<string, any>;
}

// Sensor Dashboard Types
export interface SensorOverview {
  total_sensors: number;
  active_sensors: number;
  inactive_sensors: number;
  error_sensors: number;
  total_readings_today: number;
  average_readings_per_hour: number;
  sensor_categories: Record<string, number>;
  recent_alerts: SensorAlert[];
  system_performance: {
    average_response_time: number;
    data_quality_score: number;
    uptime_percentage: number;
  };
}

// Sensor Filter Types
export interface SensorFilter {
  deployment_id?: number;
  device_id?: number;
  zone_id?: number;
  sensor_type?: string;
  status?: ConnStatus;
  date_range?: {
    start_date: string;
    end_date: string;
  };
  value_range?: {
    min_value: number;
    max_value: number;
  };
  search?: string;
}

// Sensor Export Types
export interface SensorDataExport {
  deployment_id: number;
  format: 'csv' | 'json' | 'excel';
  date_range: {
    start_date: string;
    end_date: string;
  };
  include_metadata?: boolean;
  aggregation?: 'raw' | 'hourly' | 'daily';
  filters?: SensorFilter;
}

// Sensor Comparison Types
export interface SensorComparison {
  deployment_ids: number[];
  metric: 'value' | 'trend' | 'variance';
  time_range: {
    start_date: string;
    end_date: string;
  };
  comparison_data: {
    deployment_id: number;
    sensor_name: string;
    data: SensorDataPoint[];
    statistics: SensorStatistics;
  }[];
}

// Sensor Trend Analysis
export interface SensorTrend {
  deployment_id: number;
  trend_type: 'increasing' | 'decreasing' | 'stable' | 'fluctuating';
  confidence: number; // 0-1
  slope: number;
  r_squared: number;
  period: string;
  prediction?: {
    next_value: number;
    confidence_interval: [number, number];
    prediction_date: string;
  };
}

// Sensor Anomaly Detection
export interface SensorAnomaly {
  anomaly_id: number;
  deployment_id: number;
  timestamp: string;
  value: number;
  expected_value: number;
  deviation: number;
  anomaly_score: number; // 0-1
  anomaly_type: 'spike' | 'drop' | 'trend_change' | 'level_shift';
  severity: 'low' | 'medium' | 'high' | 'critical';
  detected_by: string;
  metadata?: Record<string, any>;
}

// Sensor Maintenance Types
export interface SensorMaintenance {
  maintenance_id: number;
  deployment_id: number;
  maintenance_type: 'calibration' | 'cleaning' | 'replacement' | 'inspection';
  scheduled_date: string;
  completed_date?: string;
  performed_by?: number;
  status: 'scheduled' | 'in_progress' | 'completed' | 'overdue';
  description: string;
  cost?: number;
  notes?: string;
  next_maintenance_date?: string;
}

// Sensor Types
export interface Sensor extends BaseEntity {
  deployment_id: number;
  sensor_type: SensorType;
  name: string;
  description?: string;
  unit: string;
  min_value?: number;
  max_value?: number;
  accuracy?: number;
  resolution?: number;
  calibration_data?: CalibrationData;
  location?: SensorLocation;
  metadata?: SensorMetadata;
  is_active: boolean;
  last_reading?: SensorReading;
  status: SensorStatus;
}

export enum SensorType {
  TEMPERATURE = 'temperature',
  HUMIDITY = 'humidity',
  PRESSURE = 'pressure',
  LIGHT = 'light',
  MOTION = 'motion',
  SOUND = 'sound',
  VIBRATION = 'vibration',
  GAS = 'gas',
  PH = 'ph',
  CONDUCTIVITY = 'conductivity',
  FLOW = 'flow',
  LEVEL = 'level',
  WEIGHT = 'weight',
  VOLTAGE = 'voltage',
  CURRENT = 'current',
  POWER = 'power',
  ENERGY = 'energy',
  CO2 = 'co2',
  TVOC = 'tvoc',
  PM25 = 'pm25',
  PM10 = 'pm10',
  CUSTOM = 'custom'
}

export enum SensorStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  ERROR = 'error',
  CALIBRATING = 'calibrating',
  MAINTENANCE = 'maintenance'
}

export interface SensorReading extends BaseEntity {
  sensor_id: number;
  value: number;
  unit: string;
  timestamp: string;
  quality: ReadingQuality;
  metadata?: Record<string, any>;
  raw_value?: number;
  processed_value?: number;
}

export enum ReadingQuality {
  EXCELLENT = 'excellent',
  GOOD = 'good',
  FAIR = 'fair',
  POOR = 'poor',
  INVALID = 'invalid'
}

export interface CalibrationData {
  offset: number;
  scale: number;
  reference_values: CalibrationPoint[];
  last_calibration: string;
  next_calibration?: string;
  calibration_method: string;
}

export interface CalibrationPoint {
  reference_value: number;
  measured_value: number;
  timestamp: string;
}

export interface SensorLocation {
  latitude?: number;
  longitude?: number;
  altitude?: number;
  zone_id?: number;
  room?: string;
  position?: {
    x: number;
    y: number;
    z: number;
  };
}

export interface SensorMetadata {
  manufacturer?: string;
  model?: string;
  serial_number?: string;
  firmware_version?: string;
  sampling_rate?: number;
  range_min?: number;
  range_max?: number;
  accuracy_class?: string;
  protection_class?: string;
  operating_temperature?: {
    min: number;
    max: number;
  };
  operating_humidity?: {
    min: number;
    max: number;
  };
  power_consumption?: number;
  battery_life?: number;
  custom_fields?: Record<string, any>;
}

// Sensor Statistics
export interface SensorStats {
  sensor_id: number;
  period: string;
  count: number;
  min_value: number;
  max_value: number;
  avg_value: number;
  std_deviation: number;
  median: number;
  percentiles: {
    p10: number;
    p25: number;
    p50: number;
    p75: number;
    p90: number;
  };
  quality_distribution: Record<ReadingQuality, number>;
  missing_readings: number;
  error_count: number;
}

// Sensor Alerts
export interface SensorAlert extends BaseEntity {
  sensor_id: number;
  alert_type: SensorAlertType;
  severity: Severity;
  threshold_value: number;
  current_value: number;
  message: string;
  is_active: boolean;
  acknowledged: boolean;
  acknowledged_by?: number;
  acknowledged_at?: string;
  resolved_at?: string;
}

export enum SensorAlertType {
  HIGH_THRESHOLD = 'high_threshold',
  LOW_THRESHOLD = 'low_threshold',
  RATE_OF_CHANGE = 'rate_of_change',
  MISSING_DATA = 'missing_data',
  QUALITY_DEGRADATION = 'quality_degradation',
  CALIBRATION_DUE = 'calibration_due',
  MAINTENANCE_DUE = 'maintenance_due'
}

// Sensor Aggregation
export interface SensorAggregation {
  sensor_id: number;
  period: AggregationPeriod;
  start_time: string;
  end_time: string;
  count: number;
  sum: number;
  min: number;
  max: number;
  avg: number;
  std_dev: number;
  median: number;
  percentiles: number[];
}

export enum AggregationPeriod {
  MINUTE = 'minute',
  HOUR = 'hour',
  DAY = 'day',
  WEEK = 'week',
  MONTH = 'month',
  YEAR = 'year'
}

// Sensor Trends
export interface SensorTrend {
  sensor_id: number;
  period: string;
  trend_direction: 'increasing' | 'decreasing' | 'stable' | 'fluctuating';
  trend_strength: number; // 0-1
  slope: number;
  r_squared: number;
  confidence_interval: {
    lower: number;
    upper: number;
  };
  seasonality?: {
    period: number;
    strength: number;
  };
  anomalies: TrendAnomaly[];
}

export interface TrendAnomaly {
  timestamp: string;
  value: number;
  expected_value: number;
  deviation: number;
  severity: 'low' | 'medium' | 'high';
}

// Sensor Calibration
export interface CalibrationSession extends BaseEntity {
  sensor_id: number;
  calibration_type: CalibrationType;
  reference_values: CalibrationReference[];
  results: CalibrationResult;
  performed_by: number;
  notes?: string;
  next_calibration_date?: string;
}

export enum CalibrationType {
  ZERO_POINT = 'zero_point',
  SPAN = 'span',
  MULTI_POINT = 'multi_point',
  FIELD = 'field',
  LABORATORY = 'laboratory'
}

export interface CalibrationReference {
  reference_value: number;
  measured_value: number;
  uncertainty?: number;
  timestamp: string;
}

export interface CalibrationResult {
  offset: number;
  scale: number;
  uncertainty: number;
  correlation_coefficient: number;
  standard_error: number;
  is_acceptable: boolean;
  recommendations?: string[];
}

// Sensor Maintenance
export interface SensorMaintenance extends BaseEntity {
  sensor_id: number;
  maintenance_type: MaintenanceType;
  description: string;
  performed_by: number;
  start_time: string;
  end_time?: string;
  status: MaintenanceStatus;
  parts_replaced?: string[];
  cost?: number;
  notes?: string;
  next_maintenance_date?: string;
}

export enum MaintenanceType {
  PREVENTIVE = 'preventive',
  CORRECTIVE = 'corrective',
  PREDICTIVE = 'predictive',
  EMERGENCY = 'emergency'
}

export enum MaintenanceStatus {
  SCHEDULED = 'scheduled',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  OVERDUE = 'overdue'
}

// Sensor Configuration
export interface SensorConfig {
  sensor_id: number;
  sampling_rate: number;
  averaging_window: number;
  alert_thresholds: AlertThreshold[];
  calibration_schedule: CalibrationSchedule;
  maintenance_schedule: MaintenanceSchedule;
  data_retention: DataRetentionConfig;
  quality_checks: QualityCheck[];
}

export interface AlertThreshold {
  type: SensorAlertType;
  value: number;
  enabled: boolean;
  severity: Severity;
  message?: string;
}

export interface CalibrationSchedule {
  frequency: number; // days
  type: CalibrationType;
  tolerance: number;
  auto_schedule: boolean;
}

export interface MaintenanceSchedule {
  frequency: number; // days
  type: MaintenanceType;
  estimated_duration: number; // hours
  auto_schedule: boolean;
}

export interface DataRetentionConfig {
  raw_data_days: number;
  aggregated_data_days: number;
  archive_enabled: boolean;
  archive_location?: string;
}

export interface QualityCheck {
  name: string;
  enabled: boolean;
  parameters: Record<string, any>;
} 