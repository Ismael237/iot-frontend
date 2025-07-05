// Common UI Types
export interface BaseEntity {
  id: number;
  created_at: string;
  updated_at: string;
}

export interface TimestampFields {
  created_at: string;
  updated_at: string;
}

export interface CreatedByFields {
  created_by: number;
  updated_by?: number;
}

export interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

export interface TableColumn<T = any> {
  key: string;
  header: string;
  accessor: keyof T | ((item: T) => any);
  sortable?: boolean;
  width?: string;
  align?: 'left' | 'center' | 'right';
  render?: (value: any, item: T) => React.ReactNode;
}

export interface PaginationState {
  page: number;
  pageSize: number;
  total: number;
}

export interface SortState {
  field: string;
  direction: 'asc' | 'desc';
}

export interface FilterState {
  [key: string]: any;
}

// Pagination Types
export interface PaginationParams {
  skip?: number;
  limit?: number;
  page?: number;
}

export interface PaginationMeta {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

// Filter Types
export interface FilterParams {
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  filters?: Record<string, any>;
}

export interface DateRange {
  startDate: string;
  endDate: string;
}

// Status Types
export type Status = 'active' | 'inactive' | 'pending' | 'error';
export type Severity = 'info' | 'warning' | 'error' | 'critical' | 'success';

// Form Types
export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'number' | 'select' | 'textarea' | 'checkbox' | 'radio' | 'date' | 'datetime';
  required?: boolean;
  placeholder?: string;
  options?: Array<{ value: string; label: string }>;
  validation?: any;
}

export interface FormConfig {
  fields: FormField[];
  submitLabel: string;
  cancelLabel?: string;
}

// Modal Types
export interface ModalConfig {
  isOpen: boolean;
  title: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  onClose: () => void;
  onConfirm?: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
  isDestructive?: boolean;
}

// Toast Types
export interface ToastConfig {
  title: string;
  description?: string;
  status: Severity;
  duration?: number;
  isClosable?: boolean;
  position?: 'top' | 'top-right' | 'top-left' | 'bottom' | 'bottom-right' | 'bottom-left';
}

// Loading States
export interface LoadingState {
  isLoading: boolean;
  error: string | null;
  data: any | null;
}

export interface AsyncState<T> extends LoadingState {
  data: T | null;
}

// Chart Types
export interface ChartDataPoint {
  x: string | number;
  y: number;
  label?: string;
}

export interface ChartDataset {
  label: string;
  data: ChartDataPoint[];
  backgroundColor?: string;
  borderColor?: string;
  fill?: boolean;
}

export interface ChartConfig {
  type: 'line' | 'bar' | 'pie' | 'doughnut' | 'radar' | 'polarArea';
  data: {
    labels: string[];
    datasets: ChartDataset[];
  };
  options?: any;
}

// Table Types
export interface TableConfig<T = any> {
  columns: TableColumn<T>[];
  data: T[];
  loading?: boolean;
  pagination?: PaginationMeta;
  onPageChange?: (page: number) => void;
  onSort?: (key: string, order: 'asc' | 'desc') => void;
  onRowClick?: (item: T) => void;
  selectable?: boolean;
  onSelectionChange?: (selectedItems: T[]) => void;
}

// Navigation Types
export interface NavItem {
  label: string;
  path: string;
  icon?: React.ComponentType<any>;
  children?: NavItem[];
  badge?: string | number;
  isActive?: boolean;
  isDisabled?: boolean;
  requiresAuth?: boolean;
  requiresRole?: string[];
}

// Breadcrumb Types
export interface BreadcrumbItem {
  label: string;
  path?: string;
  isActive?: boolean;
}

// File Upload Types
export interface FileUploadConfig {
  accept?: string;
  maxSize?: number;
  multiple?: boolean;
  onUpload: (files: File[]) => void;
  onError?: (error: string) => void;
}

// API Response Wrapper
export interface ApiResult<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Event Types
export interface AppEvent {
  type: string;
  payload: any;
  timestamp: string;
  source: string;
}

// Theme Types
export interface ThemeConfig {
  mode: 'light' | 'dark';
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
}

// Settings Types
export interface UserSettings {
  theme: ThemeConfig;
  language: string;
  timezone: string;
  dateFormat: string;
  timeFormat: '12h' | '24h';
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  dashboard: {
    refreshInterval: number;
    defaultView: string;
    widgets: string[];
  };
}

// Permission Types
export interface Permission {
  resource: string;
  action: 'create' | 'read' | 'update' | 'delete';
}

export interface UserPermissions {
  userId: number;
  permissions: Permission[];
}

// Real-time Types
export interface WebSocketMessage {
  type: string;
  payload: any;
  timestamp: string;
}

export interface RealTimeConfig {
  enabled: boolean;
  reconnectInterval: number;
  maxReconnectAttempts: number;
} 