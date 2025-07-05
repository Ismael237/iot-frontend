import { ComponentType as ApiComponentType, ComponentDeployment as ApiComponentDeployment, ComponentCategory, ConnStatus } from '../../shared/types/api.types';
import { Device } from './device.entity';

export class ComponentType {
  public readonly id: number;
  public readonly name: string;
  public readonly identifier: string;
  public readonly category: 'sensor' | 'actuator';
  public readonly unit?: string;
  public readonly description?: string;
  public readonly createdBy?: number;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  constructor(data: ApiComponentType) {
    this.id = data.component_type_id;
    this.name = data.name;
    this.identifier = data.identifier;
    this.category = data.category;
    this.unit = data.unit;
    this.description = data.description;
    this.createdBy = data.created_by;
    this.createdAt = new Date(data.created_at);
    this.updatedAt = new Date(data.updated_at);
  }

  get isSensor(): boolean {
    return this.category === 'sensor';
  }

  get isActuator(): boolean {
    return this.category === 'actuator';
  }

  get categoryLabel(): string {
    return this.category === 'sensor' ? 'Sensor' : 'Actuator';
  }

  get categoryIcon(): string {
    return this.isSensor ? 'gauge' : 'zap';
  }

  get displayName(): string {
    return this.name || this.identifier;
  }

  get fullName(): string {
    return `${this.category} - ${this.displayName}`;
  }

  get unitDisplay(): string {
    return this.unit || 'N/A';
  }

  get categoryDisplay(): string {
    return this.category.charAt(0).toUpperCase() + this.category.slice(1);
  }

  get categoryColor(): string {
    return this.isSensor ? 'blue' : 'green';
  }

  canBeDeployedOn(deviceType: string): boolean {
    if (this.isSensor) {
      return ['sensor_node', 'gateway', 'controller'].includes(deviceType);
    }
    if (this.isActuator) {
      return ['actuator_node', 'controller'].includes(deviceType);
    }
    return false;
  }

  getCompatibleDevices(): string[] {
    if (this.isSensor) {
      return ['sensor_node', 'gateway', 'controller'];
    }
    if (this.isActuator) {
      return ['actuator_node', 'controller'];
    }
    return [];
  }

  requiresConfiguration(): boolean {
    return false;
  }

  getDefaultConfiguration(): Record<string, any> {
    return {
      sampling_rate: this.isSensor ? 1000 : undefined,
      unit: this.unit,
      category: this.category,
    };
  }

  isValid(): boolean {
    return (
      this.id > 0 &&
      this.name.length > 0 &&
      this.identifier.length > 0 &&
      ['sensor', 'actuator'].includes(this.category) &&
      this.createdAt instanceof Date &&
      this.updatedAt instanceof Date
    );
  }

  hasValidIdentifier(): boolean {
    const identifierRegex = /^[a-zA-Z0-9_]+$/;
    return identifierRegex.test(this.identifier);
  }

  equals(other: ComponentType): boolean {
    return this.id === other.id;
  }

  isSameComponent(other: ComponentType): boolean {
    return this.id === other.id && this.identifier === other.identifier;
  }

  toJSON(): ApiComponentType {
    return {
      component_type_id: this.id,
      name: this.name,
      identifier: this.identifier,
      category: this.category,
      unit: this.unit,
      description: this.description,
      created_by: this.createdBy,
      created_at: this.createdAt.toISOString(),
      updated_at: this.updatedAt.toISOString(),
    };
  }

  static fromJSON(data: ApiComponentType): ComponentType {
    return new ComponentType(data);
  }

  static create(data: Partial<ApiComponentType>): ComponentType {
    const now = new Date().toISOString();
    const defaultData: ApiComponentType = {
      component_type_id: 0,
      name: '',
      identifier: '',
      category: 'sensor',
      unit: undefined,
      description: undefined,
      created_by: undefined,
      created_at: now,
      updated_at: now,
    };

    return new ComponentType({ ...defaultData, ...data });
  }

  update(data: Partial<Pick<ApiComponentType, 'name' | 'unit' | 'description'>>): ComponentType {
    const updatedData: ApiComponentType = {
      ...this.toJSON(),
      ...data,
      updated_at: new Date().toISOString(),
    };
    return new ComponentType(updatedData);
  }

  updateName(name: string): ComponentType {
    return this.update({ name });
  }

  updateUnit(unit: string): ComponentType {
    return this.update({ unit });
  }

  updateDescription(description: string): ComponentType {
    return this.update({ description });
  }
}

export class ComponentDeployment {
  public readonly id: number;
  public readonly componentTypeId: number;
  public readonly deviceId: number;
  public readonly active: boolean;
  public readonly lastInteraction?: Date;
  public readonly connectionStatus: ConnStatus;
  public readonly lastValue?: number;
  public readonly lastValueTimestamp?: Date;
  public readonly createdBy?: number;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  // Relations
  public readonly componentType?: ComponentType;
  public readonly device?: Device;

  constructor(data: ApiComponentDeployment) {
    this.id = data.deployment_id;
    this.componentTypeId = data.component_type_id;
    this.deviceId = data.device_id;
    this.active = data.active;
    this.lastInteraction = data.last_interaction ? new Date(data.last_interaction) : undefined;
    this.connectionStatus = data.connection_status;
    this.lastValue = data.last_value;
    this.lastValueTimestamp = data.last_value_ts ? new Date(data.last_value_ts) : undefined;
    this.createdBy = data.created_by;
    this.createdAt = new Date(data.created_at);
    this.updatedAt = new Date(data.updated_at);

    // Relations
    if (data.component_type) {
      this.componentType = ComponentType.fromJSON(data.component_type);
    }
    if (data.device) {
      this.device = Device.fromJSON(data.device);
    }
  }

  get displayName(): string {
    if (this.componentType) {
      return `${this.componentType.name} on ${this.device?.displayName || `Device ${this.deviceId}`}`;
    }
    return `Component ${this.id}`;
  }

  get componentName(): string {
    return this.componentType?.name || 'Unknown Component';
  }

  get deviceName(): string {
    return this.device?.displayName || `Device ${this.deviceId}`;
  }

  get isSensor(): boolean {
    return this.componentType?.isSensor || false;
  }

  get isActuator(): boolean {
    return this.componentType?.isActuator || false;
  }

  get category(): ComponentCategory | undefined {
    return this.componentType?.category;
  }

  get unit(): string | undefined {
    return this.componentType?.unit;
  }

  get lastValueFormatted(): string {
    if (this.lastValue === undefined || this.lastValue === null) return 'N/A';
    const unit = this.unit || '';
    return `${this.lastValue}${unit}`;
  }

  get lastInteractionFormatted(): string {
    if (!this.lastInteraction) return 'Never';
    const now = new Date();
    const diff = now.getTime() - this.lastInteraction.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days} days ago`;
    if (hours > 0) return `${hours} hours ago`;
    if (minutes > 0) return `${minutes} minutes ago`;
    return 'Just now';
  }

  get isOnline(): boolean {
    return this.connectionStatus === 'online';
  }

  get statusColor(): string {
    switch (this.connectionStatus) {
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
    switch (this.connectionStatus) {
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

  get isActive(): boolean {
    return this.active && this.connectionStatus === 'online';
  }

  get hasRecentData(): boolean {
    if (!this.lastInteraction) return false;
    const now = new Date();
    const diff = now.getTime() - this.lastInteraction.getTime();
    return diff < 5 * 60 * 1000; // 5 minutes
  }

  get valueStatus(): 'normal' | 'warning' | 'critical' | 'unknown' {
    if (this.lastValue === undefined || this.lastValue === null) return 'unknown';
    
    // This would typically be based on thresholds from the component type
    // For now, we'll use a simple heuristic
    if (this.isSensor) {
      // Assume normal range for most sensors
      return 'normal';
    }
    
    return 'normal';
  }

  get valueStatusColor(): string {
    switch (this.valueStatus) {
      case 'normal':
        return 'green';
      case 'warning':
        return 'orange';
      case 'critical':
        return 'red';
      default:
        return 'gray';
    }
  }

  canBeActivated(): boolean {
    return true;
  }

  canBeDeactivated(): boolean {
    return true;
  }

  isValid(): boolean {
    return (
      this.id > 0 &&
      this.componentTypeId > 0 &&
      this.deviceId > 0 &&
      this.active !== undefined &&
      this.createdAt instanceof Date &&
      this.updatedAt instanceof Date
    );
  }

  equals(other: ComponentDeployment): boolean {
    return this.id === other.id;
  }

  toJSON(): ApiComponentDeployment {
    return {
      deployment_id: this.id,
      component_type_id: this.componentTypeId,
      device_id: this.deviceId,
      active: this.active,
      last_interaction: this.lastInteraction?.toISOString(),
      connection_status: this.connectionStatus,
      last_value: this.lastValue,
      last_value_ts: this.lastValueTimestamp?.toISOString(),
      created_by: this.createdBy,
      created_at: this.createdAt.toISOString(),
      updated_at: this.updatedAt.toISOString(),
      component_type: this.componentType?.toJSON(),
      device: this.device?.toJSON(),
    };
  }

  static fromJSON(data: ApiComponentDeployment): ComponentDeployment {
    return new ComponentDeployment(data);
  }

  static create(data: Partial<ApiComponentDeployment>): ComponentDeployment {
    const now = new Date().toISOString();
    const defaultData: ApiComponentDeployment = {
      deployment_id: 0,
      component_type_id: 0,
      device_id: 0,
      active: true,
      last_interaction: undefined,
      connection_status: 'unknown',
      last_value: undefined,
      last_value_ts: undefined,
      created_by: undefined,
      created_at: now,
      updated_at: now,
    };

    return new ComponentDeployment({ ...defaultData, ...data });
  }

  update(data: Partial<Pick<ApiComponentDeployment, 'active'>>): ComponentDeployment {
    const updatedData = {
      ...this.toJSON(),
      ...data,
      updated_at: new Date().toISOString(),
    };
    return new ComponentDeployment(updatedData);
  }

  activate(): ComponentDeployment {
    return this.update({ active: true });
  }

  deactivate(): ComponentDeployment {
    return this.update({ active: false });
  }
} 