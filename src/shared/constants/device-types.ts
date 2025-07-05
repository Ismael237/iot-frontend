export const DEVICE_TYPES = {
  GATEWAY: 'gateway',
  SENSOR_NODE: 'sensor_node',
  ACTUATOR_NODE: 'actuator_node',
  CONTROLLER: 'controller',
  DISPLAY: 'display',
  CUSTOM: 'custom',
} as const;

export type DeviceType = typeof DEVICE_TYPES[keyof typeof DEVICE_TYPES];

export const DEVICE_TYPE_LABELS: Record<DeviceType, string> = {
  [DEVICE_TYPES.GATEWAY]: 'Gateway',
  [DEVICE_TYPES.SENSOR_NODE]: 'Sensor Node',
  [DEVICE_TYPES.ACTUATOR_NODE]: 'Actuator Node',
  [DEVICE_TYPES.CONTROLLER]: 'Controller',
  [DEVICE_TYPES.DISPLAY]: 'Display',
  [DEVICE_TYPES.CUSTOM]: 'Custom',
};

export const DEVICE_TYPE_DESCRIPTIONS: Record<DeviceType, string> = {
  [DEVICE_TYPES.GATEWAY]: 'Central communication hub for IoT devices',
  [DEVICE_TYPES.SENSOR_NODE]: 'Device equipped with sensors for data collection',
  [DEVICE_TYPES.ACTUATOR_NODE]: 'Device equipped with actuators for control actions',
  [DEVICE_TYPES.CONTROLLER]: 'Device for controlling other IoT components',
  [DEVICE_TYPES.DISPLAY]: 'Device for displaying information and status',
  [DEVICE_TYPES.CUSTOM]: 'Custom device type',
};

export const DEVICE_TYPE_ICONS: Record<DeviceType, string> = {
  [DEVICE_TYPES.GATEWAY]: 'router',
  [DEVICE_TYPES.SENSOR_NODE]: 'radio',
  [DEVICE_TYPES.ACTUATOR_NODE]: 'zap',
  [DEVICE_TYPES.CONTROLLER]: 'cpu',
  [DEVICE_TYPES.DISPLAY]: 'monitor',
  [DEVICE_TYPES.CUSTOM]: 'settings',
};

export const DEVICE_TYPE_COLORS: Record<DeviceType, string> = {
  [DEVICE_TYPES.GATEWAY]: 'blue',
  [DEVICE_TYPES.SENSOR_NODE]: 'green',
  [DEVICE_TYPES.ACTUATOR_NODE]: 'orange',
  [DEVICE_TYPES.CONTROLLER]: 'purple',
  [DEVICE_TYPES.DISPLAY]: 'teal',
  [DEVICE_TYPES.CUSTOM]: 'gray',
};

export const DEVICE_TYPE_CAPABILITIES: Record<DeviceType, string[]> = {
  [DEVICE_TYPES.GATEWAY]: [
    'Network communication',
    'Protocol translation',
    'Data aggregation',
    'Security management'
  ],
  [DEVICE_TYPES.SENSOR_NODE]: [
    'Data collection',
    'Environmental monitoring',
    'Real-time sensing',
    'Low power operation'
  ],
  [DEVICE_TYPES.ACTUATOR_NODE]: [
    'Control actions',
    'Physical actuation',
    'Command execution',
    'Status feedback'
  ],
  [DEVICE_TYPES.CONTROLLER]: [
    'Process control',
    'Decision making',
    'Automation logic',
    'System coordination'
  ],
  [DEVICE_TYPES.DISPLAY]: [
    'Information display',
    'Status visualization',
    'User interface',
    'Real-time updates'
  ],
  [DEVICE_TYPES.CUSTOM]: [
    'Custom functionality',
    'Specialized operations',
    'Unique requirements',
    'Flexible configuration'
  ],
};

export const DEVICE_TYPE_DEFAULT_PORTS: Record<DeviceType, number> = {
  [DEVICE_TYPES.GATEWAY]: 8080,
  [DEVICE_TYPES.SENSOR_NODE]: 8081,
  [DEVICE_TYPES.ACTUATOR_NODE]: 8082,
  [DEVICE_TYPES.CONTROLLER]: 8083,
  [DEVICE_TYPES.DISPLAY]: 8084,
  [DEVICE_TYPES.CUSTOM]: 8085,
};

export const DEVICE_TYPE_DEFAULT_MODELS: Record<DeviceType, string> = {
  [DEVICE_TYPES.GATEWAY]: 'IoT Gateway Pro',
  [DEVICE_TYPES.SENSOR_NODE]: 'Sensor Node Standard',
  [DEVICE_TYPES.ACTUATOR_NODE]: 'Actuator Node Standard',
  [DEVICE_TYPES.CONTROLLER]: 'IoT Controller Pro',
  [DEVICE_TYPES.DISPLAY]: 'Smart Display',
  [DEVICE_TYPES.CUSTOM]: 'Custom Device',
};

export const getDeviceTypeInfo = (type: DeviceType) => ({
  label: DEVICE_TYPE_LABELS[type],
  description: DEVICE_TYPE_DESCRIPTIONS[type],
  icon: DEVICE_TYPE_ICONS[type],
  color: DEVICE_TYPE_COLORS[type],
  capabilities: DEVICE_TYPE_CAPABILITIES[type],
  defaultPort: DEVICE_TYPE_DEFAULT_PORTS[type],
  defaultModel: DEVICE_TYPE_DEFAULT_MODELS[type],
});

export const DEVICE_TYPE_OPTIONS = Object.entries(DEVICE_TYPE_LABELS).map(([value, label]) => ({
  value,
  label,
  description: DEVICE_TYPE_DESCRIPTIONS[value as DeviceType],
  icon: DEVICE_TYPE_ICONS[value as DeviceType],
  color: DEVICE_TYPE_COLORS[value as DeviceType],
})); 