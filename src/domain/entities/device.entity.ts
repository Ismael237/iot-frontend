import { IotDevice, ComponentDeployment, ConnStatus, DeviceTypeEnum } from '../../shared/types/api.types';
import { DeviceStatus, DeviceType } from '../../shared/types/device.types';

export class Device {
  public readonly id: number;
  public readonly identifier: string;
  public readonly deviceType: DeviceTypeEnum;
  public readonly model?: string;
  public readonly metadata?: Record<string, any>;
  public readonly ipAddress?: string;
  public readonly port?: number;
  public readonly active: boolean;
  public readonly lastSeen?: Date;
  public readonly createdBy?: number;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;
  public readonly componentDeployments?: ComponentDeployment[];

  constructor(data: IotDevice & { component_deployments?: ComponentDeployment[] }) {
    this.id = data.id;
    this.identifier = data.identifier;
    this.deviceType = data.device_type;
    this.model = data.model;
    this.metadata = data.metadata;
    this.ipAddress = data.ip_address;
    this.port = data.port;
    this.active = data.active;
    this.lastSeen = data.last_seen ? new Date(data.last_seen) : undefined;
    this.createdBy = data.created_by;
    this.createdAt = new Date(data.created_at);
    this.updatedAt = new Date(data.updated_at);
    this.componentDeployments = data.component_deployments;
  }

  get displayName(): string {
    return this.model || this.identifier;
  }

  get fullIdentifier(): string {
    return `${this.deviceType} - ${this.identifier}`;
  }

  get deviceTypeLabel(): string {
    const labels: Record<DeviceTypeEnum, string> = {
      arduino_uno: 'Arduino Uno',
      arduino_nano: 'Arduino Nano',
      esp32: 'ESP32',
      esp8266: 'ESP8266',
      raspberry_pi: 'Raspberry Pi',
      sensor_module: 'Sensor Module',
      actuator_module: 'Actuator Module',
      gateway: 'Gateway',
    };
    return labels[this.deviceType] || this.deviceType;
  }

  get deviceTypeIcon(): string {
    const icons: Record<DeviceTypeEnum, string> = {
      arduino_uno: 'chip',
      arduino_nano: 'chip',
      esp32: 'wifi',
      esp8266: 'wifi',
      raspberry_pi: 'computer',
      sensor_module: 'gauge',
      actuator_module: 'zap',
      gateway: 'router',
    };
    return icons[this.deviceType] || 'device';
  }

  get connectionString(): string {
    if (this.ipAddress && this.port) {
      return `${this.ipAddress}:${this.port}`;
    }
    return this.ipAddress || 'No connection info';
  }

  get hasConnectionInfo(): boolean {
    return !!(this.ipAddress && this.port);
  }

  get lastSeenFormatted(): string {
    if (!this.lastSeen) return 'Never';
    const now = new Date();
    const diff = now.getTime() - this.lastSeen.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days} days ago`;
    if (hours > 0) return `${hours} hours ago`;
    if (minutes > 0) return `${minutes} minutes ago`;
    return 'Just now';
  }

  get isOnline(): boolean {
    if (!this.lastSeen) return false;
    const now = new Date();
    const diff = now.getTime() - this.lastSeen.getTime();
    return diff < 5 * 60 * 1000; // 5 minutes
  }

  get status(): ConnStatus {
    if (!this.active) return 'offline';
    if (!this.lastSeen) return 'unknown';
    if (this.isOnline) return 'online';
    return 'offline';
  }

  get statusColor(): string {
    switch (this.status) {
      case 'online':
        return 'green';
      case 'offline':
        return 'red';
      case 'error':
        return 'orange';
      default:
        return 'gray';
    }
  }

  get statusLabel(): string {
    switch (this.status) {
      case 'online':
        return 'Online';
      case 'offline':
        return 'Offline';
      case 'error':
        return 'Error';
      default:
        return 'Unknown';
    }
  }

  get tags(): string[] {
    if (!this.metadata?.tags) return [];
    return Array.isArray(this.metadata.tags) ? this.metadata.tags : [];
  }

  get firmwareVersion(): string | undefined {
    return this.metadata?.firmware;
  }

  get location(): string | undefined {
    return this.metadata?.location;
  }

  get description(): string | undefined {
    return this.metadata?.description;
  }

  get isGateway(): boolean {
    return this.deviceType === DeviceTypeEnum.GATEWAY;
  }

  get isSensorNode(): boolean {
    return this.deviceType === DeviceTypeEnum.SENSOR_NODE;
  }

  get isActuatorNode(): boolean {
    return this.deviceType === DeviceTypeEnum.ACTUATOR_NODE;
  }

  get isController(): boolean {
    return this.deviceType === DeviceTypeEnum.CONTROLLER;
  }

  get activeComponents(): ComponentDeployment[] {
    return this.componentDeployments?.filter(comp => comp.active) || [];
  }

  get sensorComponents(): ComponentDeployment[] {
    return this.componentDeployments?.filter(comp => 
      comp.component_type?.category === 'sensor' && comp.active
    ) || [];
  }

  get actuatorComponents(): ComponentDeployment[] {
    return this.componentDeployments?.filter(comp => 
      comp.component_type?.category === 'actuator' && comp.active
    ) || [];
  }

  get componentCount(): number {
    return this.componentDeployments?.length || 0;
  }

  get activeComponentCount(): number {
    return this.activeComponents.length;
  }

  canConnect(): boolean {
    return this.active && this.hasConnectionInfo;
  }

  canDeployComponent(componentType: string): boolean {
    // Check if device supports the component type
    // This would need to be enhanced with device capability logic
    return this.active;
  }

  hasComponent(componentTypeId: number): boolean {
    return this.componentDeployments?.some(comp => 
      comp.component_type_id === componentTypeId && comp.active
    ) || false;
  }

  getComponentDeployment(componentTypeId: number): ComponentDeployment | undefined {
    return this.componentDeployments?.find(comp => 
      comp.component_type_id === componentTypeId && comp.active
    );
  }

  canReceiveCommands(): boolean {
    return this.active && this.isActuatorNode;
  }

  canSendData(): boolean {
    return this.active && (this.isSensorNode || this.isGateway);
  }

  isValid(): boolean {
    return (
      this.id > 0 &&
      this.identifier.length > 0 &&
      Object.values(DeviceTypeEnum).includes(this.deviceType) &&
      this.active !== undefined &&
      this.createdAt instanceof Date &&
      this.updatedAt instanceof Date
    );
  }

  hasValidConnectionInfo(): boolean {
    if (!this.ipAddress) return false;
    
    // Basic IP validation
    const ipRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    if (!ipRegex.test(this.ipAddress)) return false;
    
    // Port validation
    if (this.port !== undefined && (this.port < 1 || this.port > 65535)) {
      return false;
    }
    
    return true;
  }

  getStatus(): DeviceStatus {
    if (!this.active) return DeviceStatus.OFFLINE;
    if (!this.hasConnectionInfo) return DeviceStatus.ERROR;
    return DeviceStatus.ONLINE;
  }

  getStatusColor(): string {
    const status = this.getStatus();
    switch (status) {
      case DeviceStatus.ONLINE:
        return 'green';
      case DeviceStatus.OFFLINE:
        return 'red';
      case DeviceStatus.ERROR:
        return 'orange';
      case DeviceStatus.MAINTENANCE:
        return 'yellow';
      default:
        return 'gray';
    }
  }

  equals(other: Device): boolean {
    return this.id === other.id;
  }

  isSameDevice(other: Device): boolean {
    return this.id === other.id && this.identifier === other.identifier;
  }

  toJSON(): IotDevice {
    return {
      id: this.id,
      identifier: this.identifier,
      device_type: this.deviceType,
      model: this.model,
      metadata: this.metadata,
      ip_address: this.ipAddress,
      port: this.port,
      active: this.active,
      last_seen: this.lastSeen?.toISOString(),
      created_by: this.createdBy,
      created_at: this.createdAt.toISOString(),
      updated_at: this.updatedAt.toISOString(),
    };
  }

  static fromJSON(data: IotDevice & { component_deployments?: ComponentDeployment[] }): Device {
    return new Device(data);
  }

  static create(data: Partial<IotDevice>): Device {
    const now = new Date().toISOString();
    const deviceData: IotDevice = {
      id: 0, // Will be set by backend
      identifier: data.identifier || '',
      device_type: data.device_type || DeviceTypeEnum.SENSOR_NODE,
      model: data.model,
      metadata: {},
      ip_address: data.ip_address,
      port: data.port,
      active: data.active ?? true,
      last_seen: undefined,
      created_by: undefined,
      created_at: data.created_at || now,
      updated_at: data.updated_at || now,
    };
    return new Device(deviceData);
  }

  update(data: Partial<Pick<IotDevice, 'model' | 'ip_address' | 'port' | 'active'>>): Device {
    const updatedData: IotDevice = {
      ...this.toJSON(),
      ...data,
      updated_at: new Date().toISOString(),
    };
    return new Device(updatedData);
  }

  activate(): Device {
    return this.update({ active: true });
  }

  deactivate(): Device {
    return this.update({ active: false });
  }

  updateConnectionInfo(ipAddress: string, port?: number): Device {
    return this.update({ ip_address: ipAddress, port });
  }

  addComponentDeployment(deployment: ComponentDeployment): Device {
    const updatedDeployments = [...(this.componentDeployments || []), deployment];
    return new Device({
      ...this.toJSON(),
      component_deployments: updatedDeployments,
    });
  }

  removeComponentDeployment(deploymentId: number): Device {
    const updatedDeployments = this.componentDeployments?.filter(
      comp => comp.id !== deploymentId
    ) || [];
    return new Device({
      ...this.toJSON(),
      component_deployments: updatedDeployments,
    });
  }

  updateComponentDeployment(deploymentId: number, updates: Partial<ComponentDeployment>): Device {
    const updatedDeployments = this.componentDeployments?.map(comp =>
      comp.id === deploymentId ? { ...comp, ...updates } : comp
    ) || [];
    return new Device({
      ...this.toJSON(),
      component_deployments: updatedDeployments,
    });
  }
} 