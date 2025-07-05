import { Chart as ChartJS, ChartData, ChartOptions, ChartType } from 'chart.js';

// Chart Configuration Types
export interface ChartConfig {
  type: ChartType;
  data: ChartData;
  options: ChartOptions;
  plugins?: any[];
}

// Sensor Chart Types
export interface SensorChartData {
  labels: string[];
  datasets: SensorChartDataset[];
}

export interface SensorChartDataset {
  label: string;
  data: number[];
  backgroundColor?: string | string[];
  borderColor?: string | string[];
  borderWidth?: number;
  fill?: boolean;
  tension?: number;
  pointRadius?: number;
  pointHoverRadius?: number;
  yAxisID?: string;
}

export interface SensorChartOptions extends ChartOptions {
  responsive: boolean;
  maintainAspectRatio: boolean;
  scales?: {
    x?: {
      type: 'time' | 'linear' | 'category';
      time?: {
        unit: 'millisecond' | 'second' | 'minute' | 'hour' | 'day' | 'week' | 'month' | 'quarter' | 'year';
        displayFormats?: Record<string, string>;
      };
      title?: {
        display: boolean;
        text: string;
      };
    };
    y?: {
      type: 'linear' | 'logarithmic';
      title?: {
        display: boolean;
        text: string;
      };
      beginAtZero?: boolean;
    };
  };
  plugins?: {
    legend?: {
      display: boolean;
      position: 'top' | 'left' | 'bottom' | 'right';
    };
    tooltip?: {
      enabled: boolean;
      mode: 'index' | 'dataset' | 'point' | 'nearest' | 'x' | 'y';
      intersect: boolean;
    };
    annotation?: any;
  };
}

// Device Status Chart Types
export interface DeviceStatusChartData {
  labels: string[];
  datasets: DeviceStatusDataset[];
}

export interface DeviceStatusDataset {
  label: string;
  data: number[];
  backgroundColor: string[];
  borderColor: string[];
  borderWidth: number;
}

export interface DeviceStatusChartOptions extends ChartOptions {
  responsive: boolean;
  maintainAspectRatio: boolean;
  plugins?: {
    legend?: {
      display: boolean;
      position: 'top' | 'left' | 'bottom' | 'right';
    };
    tooltip?: {
      callbacks?: {
        label?: (context: any) => string;
      };
    };
  };
}

// Automation Statistics Chart Types
export interface AutomationStatsChartData {
  labels: string[];
  datasets: AutomationStatsDataset[];
}

export interface AutomationStatsDataset {
  label: string;
  data: number[];
  backgroundColor: string | string[];
  borderColor: string | string[];
  borderWidth: number;
  stack?: string;
}

// Time Series Chart Types
export interface TimeSeriesData {
  timestamp: string;
  value: number;
  quality?: string;
  metadata?: Record<string, any>;
}

export interface TimeSeriesChartConfig {
  data: TimeSeriesData[];
  timeRange: {
    start: string;
    end: string;
  };
  aggregation?: 'raw' | 'minute' | 'hour' | 'day';
  showQuality?: boolean;
  showMetadata?: boolean;
}

// Real-time Chart Types
export interface RealTimeChartConfig {
  maxDataPoints: number;
  updateInterval: number; // milliseconds
  animationDuration: number;
  showLatestValue: boolean;
  thresholdLines?: ThresholdLine[];
}

export interface ThresholdLine {
  value: number;
  color: string;
  style: 'solid' | 'dashed' | 'dotted';
  label?: string;
}

// Multi-axis Chart Types
export interface MultiAxisChartData {
  labels: string[];
  datasets: MultiAxisDataset[];
}

export interface MultiAxisDataset {
  label: string;
  data: number[];
  yAxisID: string;
  type: 'line' | 'bar';
  backgroundColor?: string;
  borderColor?: string;
  borderWidth?: number;
  fill?: boolean;
}

// Gauge Chart Types
export interface GaugeChartData {
  value: number;
  min: number;
  max: number;
  thresholds: GaugeThreshold[];
  unit: string;
  label: string;
}

export interface GaugeThreshold {
  value: number;
  color: string;
  label?: string;
}

// Heatmap Chart Types
export interface HeatmapData {
  x: string;
  y: string;
  value: number;
}

export interface HeatmapChartConfig {
  data: HeatmapData[];
  xLabels: string[];
  yLabels: string[];
  colorScale: string[];
  showValues: boolean;
}

// Dashboard Chart Types
export interface DashboardChart {
  id: string;
  title: string;
  type: ChartType;
  data: ChartData;
  options: ChartOptions;
  size: 'small' | 'medium' | 'large';
  position: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  refreshInterval?: number;
  isVisible: boolean;
  isEditable: boolean;
}

// Chart Theme Types
export interface ChartTheme {
  colors: {
    primary: string[];
    secondary: string[];
    success: string[];
    warning: string[];
    error: string[];
    info: string[];
  };
  fonts: {
    family: string;
    size: number;
  };
  background: {
    color: string;
    opacity: number;
  };
  grid: {
    color: string;
    opacity: number;
  };
}

// Chart Export Types
export interface ChartExportOptions {
  format: 'png' | 'jpg' | 'svg' | 'pdf';
  width?: number;
  height?: number;
  backgroundColor?: string;
  quality?: number;
  filename?: string;
}

// Chart Interaction Types
export interface ChartInteraction {
  type: 'click' | 'hover' | 'drag' | 'zoom';
  element: 'point' | 'bar' | 'line' | 'area';
  callback: (data: any) => void;
}

// Chart Animation Types
export interface ChartAnimation {
  duration: number;
  easing: 'linear' | 'easeInQuad' | 'easeOutQuad' | 'easeInOutQuad';
  delay?: number;
  loop?: boolean;
}

// Chart Responsive Types
export interface ChartResponsiveConfig {
  breakpoints: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
  options: Record<string, ChartOptions>;
}

// Chart Performance Types
export interface ChartPerformanceConfig {
  maxDataPoints: number;
  decimation: boolean;
  decimationAlgorithm: 'min-max' | 'lttb' | 'min-max';
  decimationSamples: number;
  animation: boolean;
  responsiveAnimationDuration: number;
}

// Chart Accessibility Types
export interface ChartAccessibilityConfig {
  enabled: boolean;
  description?: string;
  ariaLabel?: string;
  keyboardNavigation: boolean;
  screenReaderSupport: boolean;
  highContrastMode: boolean;
}

// Chart.js Configuration Types
export interface ChartConfig {
  type: 'line' | 'bar' | 'doughnut' | 'pie' | 'radar' | 'polarArea' | 'bubble' | 'scatter';
  data: ChartData;
  options?: ChartOptions;
  plugins?: ChartPlugin[];
}

export interface ChartData {
  labels: string[];
  datasets: ChartDataset[];
}

export interface ChartDataset {
  label: string;
  data: number[] | ChartDataPoint[];
  backgroundColor?: string | string[] | CanvasGradient | CanvasPattern;
  borderColor?: string | string[] | CanvasGradient | CanvasPattern;
  borderWidth?: number;
  borderDash?: number[];
  fill?: boolean | string;
  tension?: number;
  pointBackgroundColor?: string | string[];
  pointBorderColor?: string | string[];
  pointBorderWidth?: number;
  pointRadius?: number;
  pointHoverRadius?: number;
  pointHoverBackgroundColor?: string | string[];
  pointHoverBorderColor?: string | string[];
  pointHoverBorderWidth?: number;
  pointHitRadius?: number;
  pointStyle?: string | string[];
  hidden?: boolean;
  order?: number;
  yAxisID?: string;
  xAxisID?: string;
  stack?: string;
  meta?: Record<string, any>;
}

export interface ChartDataPoint {
  x: number | string;
  y: number;
  r?: number; // for bubble charts
}

export interface ChartOptions {
  responsive?: boolean;
  maintainAspectRatio?: boolean;
  aspectRatio?: number;
  plugins?: {
    title?: {
      display?: boolean;
      text?: string;
      color?: string;
      font?: {
        family?: string;
        size?: number;
        weight?: string;
        lineHeight?: number;
      };
      padding?: number | { top: number; bottom: number; left: number; right: number };
      align?: 'start' | 'center' | 'end';
    };
    legend?: {
      display?: boolean;
      position?: 'top' | 'left' | 'bottom' | 'right';
      align?: 'start' | 'center' | 'end';
      labels?: {
        color?: string;
        font?: {
          family?: string;
          size?: number;
          weight?: string;
        };
        padding?: number;
        usePointStyle?: boolean;
        pointStyle?: string;
      };
    };
    tooltip?: {
      enabled?: boolean;
      mode?: 'index' | 'dataset' | 'point' | 'nearest' | 'x' | 'y';
      intersect?: boolean;
      backgroundColor?: string;
      titleColor?: string;
      bodyColor?: string;
      borderColor?: string;
      borderWidth?: number;
      cornerRadius?: number;
      displayColors?: boolean;
      titleFont?: {
        family?: string;
        size?: number;
        weight?: string;
      };
      bodyFont?: {
        family?: string;
        size?: number;
        weight?: string;
      };
      padding?: number;
      callbacks?: {
        title?: (context: any[]) => string | string[];
        label?: (context: any) => string | string[];
        afterLabel?: (context: any) => string | string[];
        footer?: (context: any[]) => string | string[];
      };
    };
  };
  scales?: {
    x?: ScaleOptions;
    y?: ScaleOptions;
  };
  interaction?: {
    mode?: 'index' | 'dataset' | 'point' | 'nearest' | 'x' | 'y';
    intersect?: boolean;
  };
  animation?: {
    duration?: number;
    easing?: string;
    delay?: number;
    loop?: boolean;
  };
  elements?: {
    line?: {
      tension?: number;
      borderWidth?: number;
      borderColor?: string;
      borderCapStyle?: string;
      borderDash?: number[];
      borderDashOffset?: number;
      borderJoinStyle?: string;
      fill?: boolean | string;
    };
    point?: {
      radius?: number;
      pointStyle?: string;
      backgroundColor?: string;
      borderWidth?: number;
      borderColor?: string;
      borderDash?: number[];
      borderDashOffset?: number;
      borderCapStyle?: string;
      borderJoinStyle?: string;
      hitRadius?: number;
      hoverRadius?: number;
      hoverBorderWidth?: number;
    };
    rectangle?: {
      backgroundColor?: string;
      borderWidth?: number;
      borderColor?: string;
      borderSkipped?: string;
    };
  };
}

export interface ScaleOptions {
  type?: 'linear' | 'logarithmic' | 'time' | 'radialLinear' | 'category';
  display?: boolean;
  position?: 'left' | 'top' | 'right' | 'bottom';
  beginAtZero?: boolean;
  min?: number;
  max?: number;
  ticks?: {
    display?: boolean;
    color?: string;
    font?: {
      family?: string;
      size?: number;
      weight?: string;
    };
    padding?: number;
    callback?: (value: any, index: number, values: any[]) => string;
    stepSize?: number;
    maxTicksLimit?: number;
  };
  grid?: {
    display?: boolean;
    color?: string;
    lineWidth?: number;
    drawBorder?: boolean;
    drawOnChartArea?: boolean;
    drawTicks?: boolean;
    borderDash?: number[];
    borderDashOffset?: number;
    borderWidth?: number;
    borderColor?: string;
  };
  border?: {
    display?: boolean;
    color?: string;
    width?: number;
  };
}

export interface ChartPlugin {
  id: string;
  beforeInit?: (chart: ChartJS) => void;
  afterInit?: (chart: ChartJS) => void;
  beforeUpdate?: (chart: ChartJS, args: { mode: string }) => void;
  afterUpdate?: (chart: ChartJS, args: { mode: string }) => void;
  beforeLayout?: (chart: ChartJS) => void;
  afterLayout?: (chart: ChartJS) => void;
  beforeDatasetsUpdate?: (chart: ChartJS, args: { mode: string }) => void;
  afterDatasetsUpdate?: (chart: ChartJS, args: { mode: string }) => void;
  beforeDatasetUpdate?: (chart: ChartJS, args: { datasetIndex: number; mode: string }) => void;
  afterDatasetUpdate?: (chart: ChartJS, args: { datasetIndex: number; mode: string }) => void;
  beforeRender?: (chart: ChartJS, args: { animation: any }) => void;
  afterRender?: (chart: ChartJS, args: { animation: any }) => void;
  beforeDraw?: (chart: ChartJS, args: { animation: any }) => void;
  afterDraw?: (chart: ChartJS, args: { animation: any }) => void;
  beforeDatasetsDraw?: (chart: ChartJS, args: { animation: any }) => void;
  afterDatasetsDraw?: (chart: ChartJS, args: { animation: any }) => void;
  beforeDatasetDraw?: (chart: ChartJS, args: { datasetIndex: number; animation: any }) => void;
  afterDatasetDraw?: (chart: ChartJS, args: { datasetIndex: number; animation: any }) => void;
  beforeEvent?: (chart: ChartJS, args: { event: Event; replay: boolean }) => void;
  afterEvent?: (chart: ChartJS, args: { event: Event; replay: boolean }) => void;
  resize?: (chart: ChartJS, args: { size: { width: number; height: number } }) => void;
  destroy?: (chart: ChartJS) => void;
}

// IoT Specific Chart Types
export interface SensorChartConfig extends ChartConfig {
  sensorId: number;
  timeRange: {
    start: string;
    end: string;
  };
  aggregation?: 'raw' | 'minute' | 'hour' | 'day';
  showThresholds?: boolean;
  thresholds?: {
    warning: number;
    critical: number;
    color: string;
  }[];
}

export interface DeviceStatusChartConfig extends ChartConfig {
  deviceIds: number[];
  statusTypes: ('online' | 'offline' | 'error')[];
  timeRange: {
    start: string;
    end: string;
  };
}

export interface AutomationChartConfig extends ChartConfig {
  ruleIds: number[];
  metric: 'executions' | 'success_rate' | 'execution_time';
  timeRange: {
    start: string;
    end: string;
  };
  groupBy?: 'hour' | 'day' | 'week' | 'month';
}

// Chart Component Props
export interface ChartComponentProps {
  data: ChartData;
  options?: ChartOptions;
  width?: number | string;
  height?: number | string;
  className?: string;
  style?: React.CSSProperties;
  onChartClick?: (event: any, elements: any[]) => void;
  onChartHover?: (event: any, elements: any[]) => void;
  loading?: boolean;
  error?: string | null;
}

// Real-time Chart Types
export interface RealTimeChartConfig extends ChartConfig {
  updateInterval: number; // milliseconds
  maxDataPoints: number;
  autoScroll?: boolean;
  onDataUpdate?: (newData: ChartData) => void;
}

// Chart Theme Types
export interface ChartTheme {
  colors: {
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
  };
  fonts: {
    family: string;
    size: {
      small: number;
      medium: number;
      large: number;
    };
  };
  spacing: {
    padding: number;
    margin: number;
  };
}

// Chart Export Types
export interface ChartExportOptions {
  format: 'png' | 'jpg' | 'svg' | 'pdf';
  width?: number;
  height?: number;
  backgroundColor?: string;
  quality?: number;
  filename?: string;
}

// Chart Interaction Types
export interface ChartInteraction {
  type: 'click' | 'hover' | 'drag' | 'zoom' | 'pan';
  target: 'point' | 'dataset' | 'axis' | 'legend';
  callback: (event: any, data: any) => void;
}

// Chart Annotation Types
export interface ChartAnnotation {
  type: 'line' | 'box' | 'point' | 'label';
  xMin?: number | string;
  xMax?: number | string;
  yMin?: number;
  yMax?: number;
  x?: number | string;
  y?: number;
  label?: string;
  color?: string;
  borderColor?: string;
  borderWidth?: number;
  backgroundColor?: string;
  opacity?: number;
  font?: {
    family?: string;
    size?: number;
    weight?: string;
    color?: string;
  };
} 