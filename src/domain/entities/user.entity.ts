import type { User as ApiUser } from '@shared/types/api.types';
import type { UserPermissions } from '@shared/types/auth.types';

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
    this.firstName = data.firstName;
    this.lastName = data.lastName;
    this.role = data.role;
    this.isActive = data.isActive || false;
    this.createdAt = data.createdAt ? new Date(data.createdAt) : new Date();
    this.updatedAt = data.updatedAt ? new Date(data.updatedAt) : new Date();
  }

  // Computed properties
  get fullName(): string {
    return `${this.firstName} ${this.lastName}`.trim();
  }

  get displayName(): string {
    return this.fullName || this.email;
  }

  get initials(): string {
    const firstInitial = this.firstName.charAt(0);
    const lastInitial = this.lastName.charAt(0);
    const initials = `${firstInitial}${lastInitial}`.trim();

    if (initials.length > 0) {
      return initials.toUpperCase();
    }

    return this.email.charAt(0).toUpperCase();
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
      firstName: this.firstName,
      lastName: this.lastName,
      role: this.role,
      isActive: this.isActive,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
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
      firstName: data.firstName || '',
      lastName: data.lastName || '',
      role: data.role || 'user',
      isActive: data.isActive ?? true,
      createdAt: data.createdAt || now,
      updatedAt: data.updatedAt || now,
    };
    return new User(userData);
  }

  // Update methods (returns new instance)
  update(data: Partial<Pick<ApiUser, 'firstName' | 'lastName' | 'role' | 'isActive'>>): User {
    const updatedData: ApiUser = {
      ...this.toJSON(),
      ...data,
      updatedAt: new Date().toISOString(),
    };
    return new User(updatedData);
  }

  activate(): User {
    return this.update({ isActive: true });
  }

  deactivate(): User {
    return this.update({ isActive: false });
  }

  promoteToAdmin(): User {
    return this.update({ role: 'admin' });
  }

  demoteToUser(): User {
    return this.update({ role: 'user' });
  }
} 