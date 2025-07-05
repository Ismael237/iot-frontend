import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Auth Components
import { PublicRoute, AdminRoute } from '@components/auth/protected-route';

// Pages
import { LoginPage } from '@pages/auth/login-page';
import { DashboardPage } from '@pages/dashboard/dashboard-page';
import { DeviceListPage } from '@pages/devices/device-list-page';
import { DeviceDetailPage } from '@pages/devices/device-detail-page';
import { DeviceFormPage } from '@pages/devices/device-form-page';
import { ComponentTypesPage } from '@pages/components/component-types-page';
import { ComponentDeploymentsPage } from '@pages/components/component-deployments-page';
import { ComponentFormPage } from '@pages/components/component-form-page';
import { SensorsPage } from '@pages/sensors/sensors-page';
import { SensorReadingsPage } from '@pages/sensors/sensor-readings-page';
import { SensorStatsPage } from '@pages/sensors/sensor-stats-page';
import { SensorDetailPage } from '@pages/sensors/sensor-detail-page';
import { ActuatorControlPage } from '@pages/actuators/actuator-control-page';
import { ActuatorHistoryPage } from '@pages/actuators/actuator-history-page';
import { ZoneManagementPage } from '@pages/zones/zone-management-page';
import { ZoneDetailPage } from '@pages/zones/zone-detail-page';
import { AutomationRulesPage } from '@pages/automation/automation-rules-page';
import { RuleFormPage } from '@pages/automation/rule-form-page';
import { AlertsPage } from '@pages/automation/alerts-page';
import { UserListPage } from '@pages/users/user-list-page';
import { UserFormPage } from '@pages/users/user-form-page';
import { ProfilePage } from '@pages/auth/profile-page';
import { NotFoundPage } from '@pages/error/not-found-page';
import { ErrorBoundary } from '@pages/error/error-boundary';


// Layout Components
import { MainLayout } from '@components/layout/main-layout';

export const AppRoutes: React.FC = () => {
  return (
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            }
          />

          {/* Protected Routes */}
          <Route
            path="/"
            element={
              // <ProtectedRoute>
                <MainLayout />
              // </ProtectedRoute>
            }
          >
            {/* Dashboard */}
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<DashboardPage />} />

            {/* Devices */}
            <Route path="devices">
              <Route index element={<DeviceListPage />} />
              <Route path="new" element={<DeviceFormPage />} />
              <Route path=":id" element={<DeviceDetailPage />} />
              <Route path=":id/edit" element={<DeviceFormPage />} />
            </Route>

            {/* Components */}
            <Route path="components">
              <Route path="types" element={<ComponentTypesPage />} />
              <Route path="deployments" element={<ComponentDeploymentsPage />} />
              <Route path="types/new" element={<ComponentFormPage />} />
              <Route path="types/:id/edit" element={<ComponentFormPage />} />
            </Route>

            {/* Sensors */}
            <Route path="sensors">
              <Route index element={<SensorsPage />} />
              <Route path="readings" element={<SensorReadingsPage />} />
              <Route path="stats" element={<SensorStatsPage />} />
              <Route path=":id" element={<SensorDetailPage />} />
            </Route>

            {/* Actuators */}
            <Route path="actuators">
              <Route path="control" element={<ActuatorControlPage />} />
              <Route path="history" element={<ActuatorHistoryPage />} />
            </Route>

            {/* Zones */}
            <Route path="zones">
              <Route index element={<ZoneManagementPage />} />
              <Route path=":id" element={<ZoneDetailPage />} />
            </Route>

            {/* Automation */}
            <Route path="automation">
              <Route path="rules" element={<AutomationRulesPage />} />
              <Route path="rules/new" element={<RuleFormPage />} />
              <Route path="rules/:id/edit" element={<RuleFormPage />} />
              <Route path="alerts" element={<AlertsPage />} />
            </Route>

            {/* Admin Routes */}
            <Route
              path="users"
              element={
                <AdminRoute>
                  <UserListPage />
                </AdminRoute>
              }
            />
            <Route
              path="users/new"
              element={
                <AdminRoute>
                  <UserFormPage />
                </AdminRoute>
              }
            />
            <Route
              path="users/:id/edit"
              element={
                <AdminRoute>
                  <UserFormPage />
                </AdminRoute>
              }
            />

            {/* Profile */}
            <Route path="profile" element={<ProfilePage />} />
          </Route>

          {/* Error Routes */}
          <Route path="/error" element={
            <ErrorBoundary>
              <NotFoundPage />
            </ErrorBoundary>
          } />
          <Route path="/unauthorized" element={<NotFoundPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
  );
};

export default AppRoutes; 