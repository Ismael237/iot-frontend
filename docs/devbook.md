# DevBook Frontend - Application IoT React TypeScript

**Generate a complete, production-ready React application** that interacts with an IoT REST API backend using JWT authentication.
The app follows **Clean Architecture** principles with **kebab-case** file names and uses **react-chartjs-2** for sensor data visualization.

## 1. Project Structure

Follow **Clean Architecture** with this folder layout under `src/`:

```bash
src/
├── domain/                     # Business entities and interfaces
│   ├── entities/              # Core business models
│   │   ├── user.entity.ts
│   │   ├── device.entity.ts
│   │   ├── component.entity.ts
│   │   ├── sensor.entity.ts
│   │   ├── actuator.entity.ts
│   │   ├── zone.entity.ts
│   │   ├── automation.entity.ts
│   │   └── alert.entity.ts
│   └── store/              # Zustand state management slices
│       ├── auth-store.ts
│       ├── user-store.ts
│       ├── device-store.ts
│       ├── component-store.ts
│       ├── sensor-store.ts
│       ├── actuator-store.ts
│       ├── zone-store.ts
│       ├── automation-store.ts
│       └── dashboard-store.ts
├── infrastructure/           # External implementations
│   ├── api/                 # Axios client modules
│   │   ├── axios-client.ts
│   │   ├── auth-api.ts
│   │   ├── user-api.ts
│   │   ├── device-api.ts
│   │   ├── component-api.ts
│   │   ├── sensor-api.ts
│   │   ├── actuator-api.ts
│   │   ├── zone-api.ts
│   │   └── automation-api.ts
│   ├── mock/
│   │   ├── data/
│   │   │   ├── auth-mock-data.ts
│   │   │   ├── user-mock-data.ts
│   │   │   ├── device-mock-data.ts
│   │   │   ├── component-mock-data.ts
│   │   │   ├── sensor-mock-data.ts
│   │   │   ├── actuator-mock-data.ts
│   │   │   ├── zone-mock-data.ts
│   │   │   └── automation-mock-data.ts
│   │   ├── mock-scenarios.ts.ts
│   │   ├── mock-wrapper.ts
│   │   └── index.ts
├── presentation/            # UI components
│   ├── components/         # Reusable components
│   │   ├── ui/            # Buttons, inputs, cards, etc.
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── card.tsx
│   │   │   ├── modal.tsx
│   │   │   ├── table.tsx
│   │   │   ├── form.tsx
│   │   │   └── loading.tsx
│   │   ├── charts/        # react-chartjs-2 wrappers
│   │   │   ├── sensor-line-chart.tsx
│   │   │   ├── sensor-bar-chart.tsx
│   │   │   ├── device-status-chart.tsx
│   │   │   └── automation-stats-chart.tsx
│   │   ├── layout/        # Header, sidebar, footer
│   │   │   ├── header.tsx
│   │   │   ├── sidebar.tsx
│   │   │   ├── footer.tsx
│   │   │   └── main-layout.tsx
│   │   ├── auth/          # Auth-specific components
│   │   │   ├── login-form.tsx
│   │   │   ├── protected-route.tsx
│   │   │   └── auth-guard.tsx
│   │   ├── device/        # Device components
│   │   │   ├── device-card.tsx
│   │   │   ├── device-form.tsx
│   │   │   ├── device-status.tsx
│   │   │   └── device-list.tsx
│   │   ├── sensor/        # Sensor components
│   │   │   ├── sensor-card.tsx
│   │   │   ├── sensor-reading-table.tsx
│   │   │   ├── latest-readings.tsx
│   │   │   └── sensor-deployment-form.tsx
│   │   ├── actuator/      # Actuator components
│   │   │   ├── actuator-card.tsx
│   │   │   ├── actuator-control.tsx
│   │   │   ├── command-history.tsx
│   │   │   └── actuator-deployment-form.tsx
│   │   ├── zone/          # Zone components
│   │   │   ├── zone-tree.tsx
│   │   │   ├── zone-form.tsx
│   │   │   ├── zone-components.tsx
│   │   │   └── zone-hierarchy.tsx
│   │   ├── automation/    # Automation components
│   │   │   ├── rule-card.tsx
│   │   │   ├── rule-form.tsx
│   │   │   ├── condition-builder.tsx
│   │   │   ├── action-builder.tsx
│   │   │   └── alert-list.tsx
│   │   └── dashboard/     # Dashboard components
│   │       ├── dashboard-cards.tsx
│   │       ├── device-overview.tsx
│   │       ├── sensor-overview.tsx
│   │       ├── recent-alerts.tsx
│   │       └── system-metrics.tsx
│   ├── hooks/             # Custom React hooks
│   │   ├── use-auth.ts
│   │   ├── use-api-error-toast.ts
│   │   ├── use-polling.ts
│   │   ├── use-pagination.ts
│   │   ├── use-local-storage.ts
│   │   └── use-form-validation.ts
│   ├── pages/             # Page components
│   │   ├── auth/
│   │   │   ├── login-page.tsx
│   │   │   └── profile-page.tsx
│   │   ├── dashboard/
│   │   │   └── dashboard-page.tsx
│   │   ├── devices/
│   │   │   ├── device-list-page.tsx
│   │   │   ├── device-detail-page.tsx
│   │   │   └── device-form-page.tsx
│   │   ├── components/
│   │   │   ├── component-types-page.tsx
│   │   │   ├── component-deployments-page.tsx
│   │   │   └── component-form-page.tsx
│   │   ├── sensors/
│   │   │   ├── sensor-readings-page.tsx
│   │   │   ├── sensor-stats-page.tsx
│   │   │   └── sensor-detail-page.tsx
│   │   ├── actuators/
│   │   │   ├── actuator-control-page.tsx
│   │   │   └── actuator-history-page.tsx
│   │   ├── zones/
│   │   │   ├── zone-management-page.tsx
│   │   │   └── zone-detail-page.tsx
│   │   ├── automation/
│   │   │   ├── automation-rules-page.tsx
│   │   │   ├── rule-form-page.tsx
│   │   │   └── alerts-page.tsx
│   │   └── users/
│   │       ├── user-list-page.tsx      # Admin only
│   │       └── user-form-page.tsx      # Admin only
│   └── routes/            # React Router v6 config
│       ├── app-routes.tsx
│       ├── auth-routes.tsx
│       ├── protected-routes.tsx
│       └── admin-routes.tsx
└── shared/                # Shared utilities and constants
    ├── types/            # Global TypeScript types
    │   ├── api.types.ts
    │   ├── auth.types.ts
    │   ├── common.types.ts
    │   ├── device.types.ts
    │   ├── sensor.types.ts
    │   ├── automation.types.ts
    │   └── chart.types.ts
    ├── utils/            # Helper functions
    │   ├── date-formatter.ts
    │   ├── number-formatter.ts
    │   ├── validation.ts
    │   ├── constants.ts
    │   ├── permissions.ts
    │   └── chart-config.ts
    └── constants/        # Application constants
        ├── api-endpoints.ts
        ├── device-types.ts
        ├── sensor-units.ts
        └── automation-operators.ts
```

## 2. Tech Stack

- **React** (18+ with hooks) + **TypeScript 5+**
- **Chakra UI** for styling & layout with dark/light theme
- **Zustand** for state management (one slice per feature)
- **Axios** with interceptors for JWT auth
- **React Hook Form** + **Zod** for forms & validation
- **React Router v6** for declarative routing with protected routes
- **Lucide React** for consistent iconography
- **react-chartjs-2** + **Chart.js** for sensor time-series charts
- **date-fns** for date manipulation and formatting
- **ESLint + Prettier** with recommended configs

## 3. API Endpoints Documentation

The application connects to a REST API with the following structure:

### Authentication Endpoints (`/api/v1/auth`)
```markdown
## Authentication
- **POST** `/api/v1/auth/login`
  Body: `{ email: string, password: string }`
  Returns: `{ access_token: string, refresh_token: string, user: User }`

- **POST** `/api/v1/auth/refresh`
  Body: `{ refresh_token: string }`
  Returns: `{ access_token: string }`

- **POST** `/api/v1/auth/logout`
  Body: `{ refresh_token: string }`
  Returns: `{ success: boolean }`

- **GET** `/api/v1/auth/me`
  Returns: `User` (current user profile)
```

### Users Endpoints (`/api/v1/users`)
```markdown
## Users (Admin routes)
- **GET** `/api/v1/users?skip=0&limit=20&role=`
  Returns: `{ data: User[], total: number }`

- **POST** `/api/v1/users`
  Body: `{ email: string, password: string, first_name: string, last_name: string, role: 'admin'|'user' }`
  Returns: `User`

- **GET** `/api/v1/users/{id}`
  Returns: `User`

- **PATCH** `/api/v1/users/{id}`
  Body: `{ first_name?: string, last_name?: string, role?: 'admin'|'user', is_active?: boolean }`
  Returns: `User`
```

### IoT Devices Endpoints (`/api/v1/devices`)
```markdown
## IoT Devices
- **GET** `/api/v1/devices?skip=0&limit=20&device_type=&active_only=true`
  Returns: `{ data: IotDevice[], total: number }`

- **POST** `/api/v1/devices`
  Body: `{ identifier: string, device_type: DeviceTypeEnum, model?: string, ip_address?: string, port?: number, active: boolean }`
  Returns: `IotDevice`

- **GET** `/api/v1/devices/{id}`
  Returns: `IotDevice & { component_deployments: ComponentDeployment[] }`

- **PATCH** `/api/v1/devices/{id}`
  Body: `{ model?: string, ip_address?: string, port?: number, active?: boolean }`
  Returns: `IotDevice`

- **DELETE** `/api/v1/devices/{id}`
  Returns: `{ success: boolean }`

- **GET** `/api/v1/devices/{id}/status`
  Returns: `{ device_id: number, status: ConnStatus, last_seen?: string }`
```

### Component Types & Deployments (`/api/v1/components`)
```markdown
## Component Types
- **GET** `/api/v1/components/types?category=sensor|actuator`
  Returns: `{ data: ComponentType[], total: number }`

- **POST** `/api/v1/components/types`
  Body: `{ name: string, identifier: string, category: 'sensor'|'actuator', unit?: string, description?: string }`
  Returns: `ComponentType`

## Component Deployments
- **GET** `/api/v1/components/deployments?device_id=&component_type_id=&active_only=true`
  Returns: `{ data: ComponentDeployment[], total: number }`

- **POST** `/api/v1/components/deployments`
  Body: `{ component_type_id: number, device_id: number, active: boolean }`
  Returns: `ComponentDeployment`

- **PATCH** `/api/v1/components/deployments/{id}`
  Body: `{ active?: boolean }`
  Returns: `ComponentDeployment`

- **DELETE** `/api/v1/components/deployments/{id}`
  Returns: `{ success: boolean }`
```

### Sensor Data (`/api/v1/sensors`)
```markdown
## Sensor Readings
- **GET** `/api/v1/sensors/readings?deployment_id=&skip=0&limit=100&start_date=&end_date=`
  Returns: `{ data: SensorReading[], total: number }`

- **GET** `/api/v1/sensors/readings/latest?deployment_id=`
  Returns: `{ data: SensorReading[] }` (latest reading per deployment)

- **GET** `/api/v1/sensors/readings/aggregated?deployment_id=&hours=24&interval=hour`
  Returns: `{ timestamps: string[], values: number[], avg_values: number[] }`

- **GET** `/api/v1/sensors/{deploymentId}/readings?hours=24`
  Returns: `{ data: SensorReading[] }`

- **GET** `/api/v1/sensors/{deploymentId}/stats?days=7`
  Returns: `{ min: number, max: number, avg: number, count: number }`
```

### Actuator Control (`/api/v1/actuators`)
```markdown
## Actuator Commands
- **POST** `/api/v1/actuators/{deploymentId}/command`
  Body: `{ command: string, parameters?: object }`
  Returns: `ActuatorCommand`

- **GET** `/api/v1/actuators/{deploymentId}/commands?skip=0&limit=50`
  Returns: `{ data: ActuatorCommand[], total: number }`

- **GET** `/api/v1/actuators/{deploymentId}/status`
  Returns: `{ deployment_id: number, connection_status: ConnStatus, last_interaction?: string }`
```

### Zones Management (`/api/v1/zones`)
```markdown
## Zones
- **GET** `/api/v1/zones?parent_zone_id=`
  Returns: `{ data: Zone[], total: number }`

- **POST** `/api/v1/zones`
  Body: `{ name: string, description?: string, parent_zone_id?: number, metadata?: object }`
  Returns: `Zone`

- **GET** `/api/v1/zones/{id}`
  Returns: `Zone & { component_deployments: ComponentDeployment[], child_zones: Zone[] }`

- **PATCH** `/api/v1/zones/{id}`
  Body: `{ name?: string, description?: string, parent_zone_id?: number, metadata?: object }`
  Returns: `Zone`

- **DELETE** `/api/v1/zones/{id}`
  Returns: `{ success: boolean }`

- **POST** `/api/v1/zones/{id}/components/{deploymentId}`
  Returns: `{ success: boolean }`

- **DELETE** `/api/v1/zones/{id}/components/{deploymentId}`
  Returns: `{ success: boolean }`
```

### Automation System (`/api/v1/automation`)
```markdown
## Automation Rules
- **GET** `/api/v1/automation/rules?is_active=true&skip=0&limit=20`
  Returns: `{ data: AutomationRule[], total: number }`

- **POST** `/api/v1/automation/rules`
  Body: `{ name: string, description?: string, sensor_deployment_id: number, operator: ComparisonOperator, threshold_value: number, action_type: ActionType, alert_title?: string, alert_message?: string, alert_severity?: string, target_deployment_id?: number, actuator_command?: string, actuator_parameters?: object, cooldown_minutes: number }`
  Returns: `AutomationRule`

- **GET** `/api/v1/automation/rules/{id}`
  Returns: `AutomationRule`

- **PATCH** `/api/v1/automation/rules/{id}`
  Returns: `AutomationRule`

- **DELETE** `/api/v1/automation/rules/{id}`
  Returns: `{ success: boolean }`

- **POST** `/api/v1/automation/rules/{id}/activate`
  Body: `{ is_active: boolean }`
  Returns: `AutomationRule`

## Alerts
- **GET** `/api/v1/automation/alerts?severity=&skip=0&limit=50`
  Returns: `{ data: Alert[], total: number }`
```

## 4. Architecture Examples

### Axios Client with JWT Interceptors (`infrastructure/api/axios-client.ts`)
```typescript
import axios, { AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from '../store/auth-store';

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for JWT
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = useAuthStore.getState().accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for token refresh
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response.data,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = useAuthStore.getState().refreshToken;
        if (refreshToken) {
          const response = await axios.post('/auth/refresh', { refresh_token: refreshToken });
          const { access_token } = response.data;
          
          useAuthStore.getState().setTokens(access_token, refreshToken);
          originalRequest.headers.Authorization = `Bearer ${access_token}`;
          
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        useAuthStore.getState().logout();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error.response?.data || error);
  }
);
```

### Zustand Store with Auth (`infrastructure/store/auth-store.ts`)
```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '../../domain/entities/user.entity';
import { AuthRepository } from '../../domain/repositories/auth.repository';
import { AuthRepositoryImpl } from '../repositories/auth.repository.impl';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  setTokens: (accessToken: string, refreshToken: string) => void;
  checkAuth: () => Promise<void>;
}

const authRepository: AuthRepository = new AuthRepositoryImpl();

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (email: string, password: string) => {
        set({ isLoading: true });
        try {
          const response = await authRepository.login(email, password);
          set({
            user: response.user,
            accessToken: response.access_token,
            refreshToken: response.refresh_token,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      logout: async () => {
        const { refreshToken } = get();
        if (refreshToken) {
          try {
            await authRepository.logout(refreshToken);
          } catch (error) {
            console.error('Logout error:', error);
          }
        }
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
        });
      },

      setTokens: (accessToken: string, refreshToken: string) => {
        set({ accessToken, refreshToken, isAuthenticated: true });
      },

      checkAuth: async () => {
        const { accessToken } = get();
        if (accessToken) {
          try {
            const user = await authRepository.getCurrentUser();
            set({ user, isAuthenticated: true });
          } catch (error) {
            set({
              user: null,
              accessToken: null,
              refreshToken: null,
              isAuthenticated: false,
            });
          }
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        user: state.user,
      }),
    }
  )
);
```