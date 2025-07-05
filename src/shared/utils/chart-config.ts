import { CHART_CONFIG } from './constants';

export interface ChartColors {
  primary: string;
  secondary: string;
  success: string;
  warning: string;
  error: string;
  info: string;
  background: string;
  text: string;
  grid: string;
  border: string;
}

export interface ChartTheme {
  colors: ChartColors;
  fontFamily: string;
  fontSize: number;
  animationDuration: number;
}

export const getChartTheme = (isDarkMode: boolean = false): ChartTheme => {
  const colors: ChartColors = isDarkMode
    ? {
        primary: '#3182CE',
        secondary: '#718096',
        success: '#38A169',
        warning: '#D69E2E',
        error: '#E53E3E',
        info: '#3182CE',
        background: '#1A202C',
        text: '#E2E8F0',
        grid: '#2D3748',
        border: '#4A5568'
      }
    : {
        primary: '#3182CE',
        secondary: '#718096',
        success: '#38A169',
        warning: '#D69E2E',
        error: '#E53E3E',
        info: '#3182CE',
        background: '#FFFFFF',
        text: '#2D3748',
        grid: '#E2E8F0',
        border: '#CBD5E0'
      };

  return {
    colors,
    fontFamily: 'Inter, system-ui, sans-serif',
    fontSize: 12,
    animationDuration: CHART_CONFIG.ANIMATION_DURATION
  };
};

export const getLineChartConfig = (theme: ChartTheme) => ({
  stroke: theme.colors.primary,
  strokeWidth: 2,
  dot: {
    fill: theme.colors.primary,
    strokeWidth: 2,
    r: 4
  },
  activeDot: {
    r: 6,
    stroke: theme.colors.primary,
    strokeWidth: 2
  }
});

export const getBarChartConfig = (theme: ChartTheme) => ({
  fill: theme.colors.primary,
  radius: [4, 4, 0, 0]
});

export const getPieChartConfig = (theme: ChartTheme) => ({
  colors: [
    theme.colors.primary,
    theme.colors.success,
    theme.colors.warning,
    theme.colors.error,
    theme.colors.info,
    theme.colors.secondary
  ]
});

export const getAreaChartConfig = (theme: ChartTheme) => ({
  fill: theme.colors.primary,
  fillOpacity: 0.1,
  stroke: theme.colors.primary,
  strokeWidth: 2
});

export const getScatterChartConfig = (theme: ChartTheme) => ({
  fill: theme.colors.primary,
  stroke: theme.colors.background,
  strokeWidth: 1,
  r: 4
});

export const getCommonChartConfig = (theme: ChartTheme) => ({
  grid: {
    stroke: theme.colors.grid,
    strokeDasharray: '3 3'
  },
  axis: {
    stroke: theme.colors.text,
    fontSize: theme.fontSize,
    fontFamily: theme.fontFamily
  },
  tooltip: {
    backgroundColor: theme.colors.background,
    border: `1px solid ${theme.colors.border}`,
    borderRadius: '8px',
    color: theme.colors.text,
    fontSize: theme.fontSize,
    fontFamily: theme.fontFamily
  },
  legend: {
    fontSize: theme.fontSize,
    fontFamily: theme.fontFamily,
    color: theme.colors.text
  }
});

export const getSensorChartColors = () => [
  '#3182CE', // Blue - Temperature
  '#38A169', // Green - Humidity
  '#D69E2E', // Yellow - Pressure
  '#E53E3E', // Red - Light
  '#805AD5', // Purple - Motion
  '#319795', // Teal - Sound
  '#DD6B20', // Orange - Gas
  '#2B6CB0', // Dark Blue - pH
  '#38B2AC', // Light Teal - Conductivity
  '#ED8936', // Light Orange - Flow
  '#9F7AEA', // Light Purple - Level
  '#F56565', // Light Red - Vibration
  '#4299E1', // Light Blue - Proximity
  '#48BB78', // Light Green - Force
  '#EDF2F7', // Gray - Torque
  '#4A5568', // Dark Gray - Voltage
  '#A0AEC0', // Medium Gray - Current
  '#E2E8F0', // Light Gray - Power
  '#CBD5E0', // Very Light Gray - Energy
  '#F7FAFC'  // Almost White - Frequency
];

export const getDeviceStatusColors = () => ({
  online: '#38A169',
  offline: '#E53E3E',
  error: '#D69E2E',
  maintenance: '#3182CE',
  unknown: '#718096'
});

export const getAlertSeverityColors = () => ({
  low: '#38A169',
  medium: '#D69E2E',
  high: '#E53E3E',
  critical: '#9B2C2C',
  info: '#3182CE',
  warning: '#D69E2E',
  error: '#E53E3E'
});

export const getAutomationActionColors = () => ({
  send_alert: '#E53E3E',
  activate_actuator: '#38A169',
  deactivate_actuator: '#D69E2E',
  toggle_actuator: '#3182CE',
  set_actuator_value: '#805AD5',
  send_notification: '#319795',
  log_event: '#718096',
  execute_script: '#DD6B20',
  http_request: '#2B6CB0',
  email: '#38B2AC',
  sms: '#ED8936',
  webhook: '#9F7AEA'
});

export const getChartAnimationConfig = () => ({
  duration: CHART_CONFIG.ANIMATION_DURATION,
  easing: 'ease-in-out'
});

export const getResponsiveConfig = () => ({
  width: '100%',
  height: CHART_CONFIG.DEFAULT_HEIGHT,
  aspect: 2
});

export const getTooltipConfig = (theme: ChartTheme) => ({
  cursor: { fill: 'transparent' },
  contentStyle: {
    backgroundColor: theme.colors.background,
    border: `1px solid ${theme.colors.border}`,
    borderRadius: '8px',
    color: theme.colors.text,
    fontSize: theme.fontSize,
    fontFamily: theme.fontFamily,
    padding: '8px 12px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
  }
});

export const getLegendConfig = (theme: ChartTheme) => ({
  verticalAlign: 'top' as const,
  horizontalAlign: 'right' as const,
  iconType: 'circle' as const,
  fontSize: theme.fontSize,
  fontFamily: theme.fontFamily,
  color: theme.colors.text
}); 