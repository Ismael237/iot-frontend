import { USER_ROLES } from './constants';

export type Permission = 
  | 'devices:read'
  | 'devices:write'
  | 'devices:delete'
  | 'sensors:read'
  | 'sensors:write'
  | 'sensors:delete'
  | 'actuators:read'
  | 'actuators:write'
  | 'actuators:delete'
  | 'actuators:control'
  | 'zones:read'
  | 'zones:write'
  | 'zones:delete'
  | 'automation:read'
  | 'automation:write'
  | 'automation:delete'
  | 'alerts:read'
  | 'alerts:acknowledge'
  | 'users:read'
  | 'users:write'
  | 'users:delete'
  | 'system:admin'
  | 'dashboard:read'
  | 'reports:read'
  | 'settings:read'
  | 'settings:write';

export type UserRole = keyof typeof USER_ROLES;

interface RolePermissions {
  [key: string]: Permission[];
}

const ROLE_PERMISSIONS: RolePermissions = {
  [USER_ROLES.ADMIN]: [
    'devices:read',
    'devices:write',
    'devices:delete',
    'sensors:read',
    'sensors:write',
    'sensors:delete',
    'actuators:read',
    'actuators:write',
    'actuators:delete',
    'actuators:control',
    'zones:read',
    'zones:write',
    'zones:delete',
    'automation:read',
    'automation:write',
    'automation:delete',
    'alerts:read',
    'alerts:acknowledge',
    'users:read',
    'users:write',
    'users:delete',
    'system:admin',
    'dashboard:read',
    'reports:read',
    'settings:read',
    'settings:write'
  ],
  [USER_ROLES.OPERATOR]: [
    'devices:read',
    'devices:write',
    'sensors:read',
    'sensors:write',
    'actuators:read',
    'actuators:write',
    'actuators:control',
    'zones:read',
    'zones:write',
    'automation:read',
    'automation:write',
    'alerts:read',
    'alerts:acknowledge',
    'dashboard:read',
    'reports:read',
    'settings:read'
  ],
  [USER_ROLES.USER]: [
    'devices:read',
    'sensors:read',
    'actuators:read',
    'actuators:control',
    'zones:read',
    'automation:read',
    'alerts:read',
    'dashboard:read',
    'reports:read',
    'settings:read'
  ],
  [USER_ROLES.VIEWER]: [
    'devices:read',
    'sensors:read',
    'actuators:read',
    'zones:read',
    'automation:read',
    'alerts:read',
    'dashboard:read',
    'reports:read'
  ]
};

export const hasPermission = (userRole: UserRole, permission: Permission): boolean => {
  const rolePermissions = ROLE_PERMISSIONS[userRole];
  return rolePermissions ? rolePermissions.includes(permission) : false;
};

export const hasAnyPermission = (userRole: UserRole, permissions: Permission[]): boolean => {
  return permissions.some(permission => hasPermission(userRole, permission));
};

export const hasAllPermissions = (userRole: UserRole, permissions: Permission[]): boolean => {
  return permissions.every(permission => hasPermission(userRole, permission));
};

export const getRolePermissions = (userRole: UserRole): Permission[] => {
  return ROLE_PERMISSIONS[userRole] || [];
};

export const canReadDevices = (userRole: UserRole): boolean => {
  return hasPermission(userRole, 'devices:read');
};

export const canWriteDevices = (userRole: UserRole): boolean => {
  return hasPermission(userRole, 'devices:write');
};

export const canDeleteDevices = (userRole: UserRole): boolean => {
  return hasPermission(userRole, 'devices:delete');
};

export const canReadSensors = (userRole: UserRole): boolean => {
  return hasPermission(userRole, 'sensors:read');
};

export const canWriteSensors = (userRole: UserRole): boolean => {
  return hasPermission(userRole, 'sensors:write');
};

export const canDeleteSensors = (userRole: UserRole): boolean => {
  return hasPermission(userRole, 'sensors:delete');
};

export const canReadActuators = (userRole: UserRole): boolean => {
  return hasPermission(userRole, 'actuators:read');
};

export const canWriteActuators = (userRole: UserRole): boolean => {
  return hasPermission(userRole, 'actuators:write');
};

export const canDeleteActuators = (userRole: UserRole): boolean => {
  return hasPermission(userRole, 'actuators:delete');
};

export const canControlActuators = (userRole: UserRole): boolean => {
  return hasPermission(userRole, 'actuators:control');
};

export const canReadZones = (userRole: UserRole): boolean => {
  return hasPermission(userRole, 'zones:read');
};

export const canWriteZones = (userRole: UserRole): boolean => {
  return hasPermission(userRole, 'zones:write');
};

export const canDeleteZones = (userRole: UserRole): boolean => {
  return hasPermission(userRole, 'zones:delete');
};

export const canReadAutomation = (userRole: UserRole): boolean => {
  return hasPermission(userRole, 'automation:read');
};

export const canWriteAutomation = (userRole: UserRole): boolean => {
  return hasPermission(userRole, 'automation:write');
};

export const canDeleteAutomation = (userRole: UserRole): boolean => {
  return hasPermission(userRole, 'automation:delete');
};

export const canReadAlerts = (userRole: UserRole): boolean => {
  return hasPermission(userRole, 'alerts:read');
};

export const canAcknowledgeAlerts = (userRole: UserRole): boolean => {
  return hasPermission(userRole, 'alerts:acknowledge');
};

export const canReadUsers = (userRole: UserRole): boolean => {
  return hasPermission(userRole, 'users:read');
};

export const canWriteUsers = (userRole: UserRole): boolean => {
  return hasPermission(userRole, 'users:write');
};

export const canDeleteUsers = (userRole: UserRole): boolean => {
  return hasPermission(userRole, 'users:delete');
};

export const isAdmin = (userRole: UserRole): boolean => {
  return hasPermission(userRole, 'system:admin');
};

export const canReadDashboard = (userRole: UserRole): boolean => {
  return hasPermission(userRole, 'dashboard:read');
};

export const canReadReports = (userRole: UserRole): boolean => {
  return hasPermission(userRole, 'reports:read');
};

export const canReadSettings = (userRole: UserRole): boolean => {
  return hasPermission(userRole, 'settings:read');
};

export const canWriteSettings = (userRole: UserRole): boolean => {
  return hasPermission(userRole, 'settings:write');
};

// Permission groups for easier checking
export const PERMISSION_GROUPS = {
  DEVICE_MANAGEMENT: ['devices:read', 'devices:write', 'devices:delete'] as Permission[],
  SENSOR_MANAGEMENT: ['sensors:read', 'sensors:write', 'sensors:delete'] as Permission[],
  ACTUATOR_MANAGEMENT: ['actuators:read', 'actuators:write', 'actuators:delete', 'actuators:control'] as Permission[],
  ZONE_MANAGEMENT: ['zones:read', 'zones:write', 'zones:delete'] as Permission[],
  AUTOMATION_MANAGEMENT: ['automation:read', 'automation:write', 'automation:delete'] as Permission[],
  ALERT_MANAGEMENT: ['alerts:read', 'alerts:acknowledge'] as Permission[],
  USER_MANAGEMENT: ['users:read', 'users:write', 'users:delete'] as Permission[],
  SYSTEM_ADMIN: ['system:admin'] as Permission[],
  VIEW_ONLY: ['dashboard:read', 'reports:read'] as Permission[],
} as const;

export const hasPermissionGroup = (userRole: UserRole, permissionGroup: keyof typeof PERMISSION_GROUPS): boolean => {
  const permissions = PERMISSION_GROUPS[permissionGroup];
  return hasAllPermissions(userRole, permissions);
};

export const getEffectivePermissions = (userRole: UserRole): Permission[] => {
  const basePermissions = getRolePermissions(userRole);
  
  // Admin gets all permissions
  if (isAdmin(userRole)) {
    return Object.values(PERMISSION_GROUPS).flat();
  }
  
  return basePermissions;
}; 