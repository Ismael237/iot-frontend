import type { IotDevice, ComponentDeployment, ConnStatus, DeviceTypeEnum } from '@shared/types/api.types';
import { DeviceStatus, DeviceType } from '@shared/types/device.types';

export class Device {
  public readonly id: number;
  public readonly identifier: string;
  public readonly deviceType: DeviceTypeEnum;
  public readonly model?: string;
  public readonly metadata?: Record<string, any>;
  public readonly ipAddress?: string;
  public readonly port?: number;
  public readonly active: boolean;
  public readonly status: ConnStatus;
  public readonly lastSeen?: Date;
  public readonly createdBy?: number;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;
  public readonly componentDeployments?: ComponentDeployment[];

  constructor(data: IotDevice & { componentDeployments?: ComponentDeployment[] }) {
    this.id = data.id;
    this.identifier = data.identifier;
    this.deviceType = data.deviceType;
    this.model = data.model;
    this.metadata = data.metadata;
    this.ipAddress = data.ipAddress;
    this.port = data.port;
    this.active = data.active;
    this.status = data.status;
    this.lastSeen = data.lastSeen ? new Date(data.lastSeen) : undefined;
    this.createdBy = data.createdBy;
    this.createdAt = new Date(data.createdAt);
    this.updatedAt = new Date(data.updatedAt);
    this.componentDeployments = data.componentDeployments;
  }

  get displayName(): string {
    return this.model || this.identifier;
  }

  get fullIdentifier(): string {
    return `${this.deviceType} - ${this.identifier}`;
  }

  get deviceTypeLabel(): string {
    const labels: Record<DeviceTypeEnum, string> = {
      esp32: 'ESP32',
      arduino: 'Arduino',
      raspberry_pi: 'Raspberry Pi',
      gateway: 'Gateway',
      sensor_node: 'Sensor Node',
      actuator_node: 'Actuator Node',
      controller: 'Controller',
      display: 'Display',
      custom: 'Custom Device',
    };
    return labels[this.deviceType] || this.deviceType;
  }

  get deviceTypeIcon(): string {
    const icons: Record<DeviceTypeEnum, string> = {
      esp32: 'wifi',
      arduino: 'chip',
      raspberry_pi: 'computer',
      gateway: 'router',
      sensor_node: 'gauge',
      actuator_node: 'zap',
      controller: 'cpu',
      display: 'monitor',
      custom: 'device',
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
    return this.status === 'connected';
  }

  get statusColor(): string {
    switch (this.status) {
      case 'connected':
        return 'green';
      case 'disconnected':
        return 'red';
      case 'connecting':
        return 'yellow';
      case 'error':
        return 'orange';
      default:
        return 'gray';
    }
  }

  get statusLabel(): string {
    switch (this.status) {
      case 'connected':
        return 'Connected';
      case 'disconnected':
        return 'Disconnected';
      case 'connecting':
        return 'Connecting';
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
      comp.componentType?.category === 'sensor' && comp.active
    ) || [];
  }

  get actuatorComponents(): ComponentDeployment[] {
    return this.componentDeployments?.filter(comp => 
      comp.componentType?.category === 'actuator' && comp.active
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
    return this.componentDeployments?.some(comp => comp.componentTypeId === componentTypeId) || false;
  }

  getComponentDeployment(componentTypeId: number): ComponentDeployment | undefined {
    return this.componentDeployments?.find(comp => comp.componentTypeId === componentTypeId);
  }

  canReceiveCommands(): boolean {
    return this.active && this.isOnline;
  }

  canSendData(): boolean {
    return this.active && this.isOnline;
  }

  isValid(): boolean {
    return (
      this.id > 0 &&
      this.identifier.length > 0 &&
      this.deviceType &&
      this.active !== undefined &&
      this.status &&
      this.createdAt instanceof Date &&
      this.updatedAt instanceof Date
    );
  }

  hasValidConnectionInfo(): boolean {
    if (!this.ipAddress) return false;
    
    // Basic IP validation
    const ipRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    if (!ipRegex.test(this.ipAddress)) return false;
    
    // Port validation if provided
    if (this.port !== undefined) {
      return this.port >= 1 && this.port <= 65535;
    }
    
    return true;
  }

  getStatus(): DeviceStatus {
    return {
      deviceId: this.id,
      status: this.status,
      lastSeen: this.lastSeen?.toISOString(),
    };
  }

  getStatusColor(): string {
    return this.statusColor;
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
      deviceType: this.deviceType,
      model: this.model,
      ipAddress: this.ipAddress,
      port: this.port,
      active: this.active,
      status: this.status,
      lastSeen: this.lastSeen?.toISOString(),
      metadata: this.metadata,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
      componentDeployments: this.componentDeployments,
    };
  }

  static fromJSON(data: IotDevice & { componentDeployments?: ComponentDeployment[] }): Device {
    return new Device(data);
  }

  static create(data: Partial<IotDevice>): Device {
    const now = new Date().toISOString();
    const deviceData: IotDevice = {
      id: 0, // Will be set by backend
      identifier: data.identifier || '',
      deviceType: data.deviceType || DeviceTypeEnum.ESP32,
      model: data.model,
      ipAddress: data.ipAddress,
      port: data.port,
      active: data.active ?? true,
      status: data.status || 'unknown',
      lastSeen: data.lastSeen,
      metadata: data.metadata,
      createdAt: data.createdAt || now,
      updatedAt: data.updatedAt || now,
      componentDeployments: data.componentDeployments,
    };
    return new Device(deviceData);
  }

  update(data: Partial<Pick<IotDevice, 'model' | 'ipAddress' | 'port' | 'active' | 'metadata'>>): Device {
    const updatedData: IotDevice = {
      ...this.toJSON(),
      ...data,
      updatedAt: new Date().toISOString(),
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
    return this.update({ ipAddress, port });
  }

  addComponentDeployment(deployment: ComponentDeployment): Device {
    const updatedDeployments = [...(this.componentDeployments || []), deployment];
    const updatedData: IotDevice = {
      ...this.toJSON(),
      componentDeployments: updatedDeployments,
      updatedAt: new Date().toISOString(),
    };
    return new Device(updatedData);
  }

  removeComponentDeployment(deploymentId: number): Device {
    const updatedDeployments = this.componentDeployments?.filter(
      deployment => deployment.id !== deploymentId
    ) || [];
    const updatedData: IotDevice = {
      ...this.toJSON(),
      componentDeployments: updatedDeployments,
      updatedAt: new Date().toISOString(),
    };
    return new Device(updatedData);
  }

  updateComponentDeployment(deploymentId: number, updates: Partial<ComponentDeployment>): Device {
    const updatedDeployments = this.componentDeployments?.map(deployment =>
      deployment.id === deploymentId
        ? { ...deployment, ...updates, updatedAt: new Date().toISOString() }
        : deployment
    ) || [];
    const updatedData: IotDevice = {
      ...this.toJSON(),
      componentDeployments: updatedDeployments,
      updatedAt: new Date().toISOString(),
    };
    return new Device(updatedData);
  }
} 