export interface Actuator {
  id: number;
  name: string;
  type: ActuatorType;
  location: string;
  status: ActuatorStatus;
  currentState: ActuatorState;
  lastCommand?: ActuatorCommand;
  createdAt: string;
  updatedAt: string;
}

export interface ActuatorCommand {
  actuatorCommandId: number;
  deploymentId: number;
  command: string;
  parameters?: Record<string, any>;
  status: CommandStatus;
  executedAt?: string;
  createdAt: string;
}

export interface ActuatorDeployment {
  deploymentId: number;
  componentTypeId: number;
  deviceId: number;
  connectionStatus: ConnStatus;
  lastValue: number;
  lastValueTs: string;
  name: string;
  description?: string;
  location?: string;
  unit?: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  componentType: ComponentType;
  device: IotDevice;
}

export interface ComponentType {
  id: number;
  name: string;
  identifier: string;
  category: 'sensor' | 'actuator';
  unit?: string;
  description?: string;
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface IotDevice {
  id: number;
  identifier: string;
  deviceType: DeviceTypeEnum;
  model?: string;
  ipAddress?: string;
  port?: number;
  active: boolean;
  status: ConnStatus;
  lastSeen?: string;
  createdAt: string;
  updatedAt: string;
  componentDeployments: ComponentDeployment[];
}

export interface ComponentDeployment {
  deploymentId: number;
  componentTypeId: number;
  deviceId: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  componentType: ComponentType;
  device: IotDevice;
}

export enum ActuatorType {
  RELAY = 'relay',
  SERVO = 'servo',
  STEPPER = 'stepper',
  DC_MOTOR = 'dc_motor',
  AC_MOTOR = 'ac_motor',
  VALVE = 'valve',
  PUMP = 'pump',
  HEATER = 'heater',
  COOLER = 'cooler',
  LIGHT = 'light',
  DISPLAY = 'display',
  BUZZER = 'buzzer',
  VIBRATOR = 'vibrator',
  LINEAR_ACTUATOR = 'linear_actuator',
  ROTARY_ACTUATOR = 'rotary_actuator',
  SOLENOID = 'solenoid',
  CUSTOM = 'custom'
}

export interface ActuatorStatus {
  deploymentId: number;
  connectionStatus: ConnStatus;
  lastInteraction?: string;
}

export interface SendCommandRequest {
  command: string;
  parameters?: Record<string, any>;
}

export enum CommandStatus {
  PENDING = 'pending',
  EXECUTING = 'executing',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
  TIMEOUT = 'timeout'
}

export enum DeviceTypeEnum {
  ESP32 = 'esp32',
  ARDUINO = 'arduino',
  RASPBERRY_PI = 'raspberry_pi',
  GATEWAY = 'gateway',
  SENSOR_NODE = 'sensor_node',
  ACTUATOR_NODE = 'actuator_node',
  CONTROLLER = 'controller',
  DISPLAY = 'display',
  CUSTOM = 'custom'
}

export enum ConnStatus {
  ONLINE = 'online',
  OFFLINE = 'offline',
  CONNECTING = 'connecting',
  ERROR = 'error',
  UNKNOWN = 'unknown'
}

export enum ActuatorState {
  ON = 'on',
  OFF = 'off',
  OPEN = 'open',
  CLOSED = 'closed',
  RUNNING = 'running',
  STOPPED = 'stopped',
  HEATING = 'heating',
  COOLING = 'cooling',
  POSITION_0 = 'position_0',
  POSITION_25 = 'position_25',
  POSITION_50 = 'position_50',
  POSITION_75 = 'position_75',
  POSITION_100 = 'position_100',
  CUSTOM = 'custom'
} 