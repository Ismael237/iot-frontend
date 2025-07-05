import { User as ApiUser } from '../../shared/types/api.types';
import { UserPermissions } from '../../shared/types/auth.types';

export class User {
  public readonly id: number;
  public readonly email: string;
  public readonly firstName: string;
  public readonly lastName: string;
  public readonly role: 'admin' | 'user';
  public readonly isActive: boolean;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  constructor(data: ApiUser) {
    this.id = data.id;
    this.email = data.email;
    this.firstName = data.first_name;
    this.lastName = data.last_name;
    this.role = data.role;
    this.isActive = data.is_active;
    this.createdAt = new Date(data.created_at);
    this.updatedAt = new Date(data.updated_at);
  }

  // Computed properties
  get fullName(): string {
    return `${this.firstName} ${this.lastName}`.trim();
  }

  get displayName(): string {
    return this.fullName || this.email;
  }

  get initials(): string {
    if (this.firstName && this.lastName) {
      return `${this.firstName[0]}${this.lastName[0]}`.toUpperCase();
    }
    return this.email[0].toUpperCase();
  }

  get isAdmin(): boolean {
    return this.role === 'admin';
  }

  get isUser(): boolean {
    return this.role === 'user';
  }

  get permissions(): UserPermissions {
    return {
      canManageUsers: this.isAdmin,
      canManageDevices: this.isAdmin || this.isUser,
      canManageAutomation: this.isAdmin || this.isUser,
      canViewAnalytics: this.isAdmin || this.isUser,
      canManageSystem: this.isAdmin,
    };
  }

  // Business logic methods
  canAccess(permission: keyof UserPermissions): boolean {
    return this.permissions[permission];
  }

  canManageUser(targetUser: User): boolean {
    // Admins can manage any user, users can only manage themselves
    return this.isAdmin || this.id === targetUser.id;
  }

  canDeleteUser(targetUser: User): boolean {
    // Only admins can delete users, and they can't delete themselves
    return this.isAdmin && this.id !== targetUser.id;
  }

  canViewDevice(deviceId: number): boolean {
    // For now, all authenticated users can view devices
    // This could be enhanced with device-specific permissions
    return this.isActive;
  }

  canManageDevice(deviceId: number): boolean {
    // Admins can manage all devices, users can manage devices they own
    // This would need to be enhanced with device ownership logic
    return this.isAdmin || this.isUser;
  }

  canViewAutomation(automationId: number): boolean {
    return this.isActive;
  }

  canManageAutomation(automationId: number): boolean {
    return this.isAdmin || this.isUser;
  }

  // Validation methods
  isValid(): boolean {
    return (
      this.id > 0 &&
      this.email.length > 0 &&
      this.email.includes('@') &&
      this.firstName.length > 0 &&
      this.lastName.length > 0 &&
      ['admin', 'user'].includes(this.role) &&
      this.isActive !== undefined &&
      this.createdAt instanceof Date &&
      this.updatedAt instanceof Date
    );
  }

  hasValidEmail(): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(this.email);
  }

  // Comparison methods
  equals(other: User): boolean {
    return this.id === other.id;
  }

  isSameUser(other: User): boolean {
    return this.id === other.id && this.email === other.email;
  }

  // Serialization methods
  toJSON(): ApiUser {
    return {
      id: this.id,
      email: this.email,
      first_name: this.firstName,
      last_name: this.lastName,
      role: this.role,
      is_active: this.isActive,
      created_at: this.createdAt.toISOString(),
      updated_at: this.updatedAt.toISOString(),
    };
  }

  static fromJSON(data: ApiUser): User {
    return new User(data);
  }

  // Factory methods
  static create(data: Partial<ApiUser>): User {
    const now = new Date().toISOString();
    const userData: ApiUser = {
      id: 0, // Will be set by backend
      email: data.email || '',
      first_name: data.first_name || '',
      last_name: data.last_name || '',
      role: data.role || 'user',
      is_active: data.is_active ?? true,
      created_at: data.created_at || now,
      updated_at: data.updated_at || now,
    };
    return new User(userData);
  }

  // Update methods (returns new instance)
  update(data: Partial<Pick<ApiUser, 'first_name' | 'last_name' | 'role' | 'is_active'>>): User {
    const updatedData: ApiUser = {
      ...this.toJSON(),
      ...data,
      updated_at: new Date().toISOString(),
    };
    return new User(updatedData);
  }

  activate(): User {
    return this.update({ is_active: true });
  }

  deactivate(): User {
    return this.update({ is_active: false });
  }

  promoteToAdmin(): User {
    return this.update({ role: 'admin' });
  }

  demoteToUser(): User {
    return this.update({ role: 'user' });
  }
} 