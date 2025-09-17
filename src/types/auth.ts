// Authentication and User Management Types

export interface User {
  id: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  status: UserStatus;
  avatar?: string;
  createdAt: string;
  lastLoginAt?: string;
  preferences: UserPreferences;
  permissions: Permission[];
}

export type UserRole = 'admin' | 'user' | 'viewer' | 'developer';

export type UserStatus = 'active' | 'inactive' | 'suspended' | 'pending';

export interface UserPreferences {
  theme: 'dark' | 'light' | 'system';
  language: 'en' | 'he';
  notifications: {
    email: boolean;
    browser: boolean;
    agentAlerts: boolean;
    systemUpdates: boolean;
  };
  dashboard: {
    defaultView: 'overview' | 'agents' | 'chat' | 'analytics';
    refreshInterval: number;
    showAdvancedMetrics: boolean;
  };
  privacy: {
    shareUsageData: boolean;
    allowAnalytics: boolean;
  };
}

export type Permission = 
  | 'agents:create'
  | 'agents:read'
  | 'agents:update'
  | 'agents:delete'
  | 'agents:chat'
  | 'swarms:create'
  | 'swarms:manage'
  | 'files:read'
  | 'files:write'
  | 'files:delete'
  | 'analytics:view'
  | 'users:manage'
  | 'system:admin';

export interface AuthToken {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
  tokenType: 'Bearer';
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterCredentials {
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: AuthToken | null;
  isLoading: boolean;
  error: string | null;
  lastActivity: number;
}

export interface SessionInfo {
  id: string;
  userId: string;
  deviceInfo: {
    userAgent: string;
    ip: string;
    location?: string;
  };
  createdAt: string;
  lastActivity: string;
  isActive: boolean;
}

export interface SecurityEvent {
  id: string;
  userId: string;
  type: SecurityEventType;
  details: Record<string, any>;
  timestamp: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  resolved: boolean;
}

export type SecurityEventType = 
  | 'login_success'
  | 'login_failed'
  | 'logout'
  | 'password_changed'
  | 'email_changed'
  | 'role_changed'
  | 'permission_denied'
  | 'suspicious_activity'
  | 'account_locked'
  | 'token_refresh'
  | 'session_expired';

// Role-based permission mapping
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  admin: [
    'agents:create', 'agents:read', 'agents:update', 'agents:delete', 'agents:chat',
    'swarms:create', 'swarms:manage',
    'files:read', 'files:write', 'files:delete',
    'analytics:view',
    'users:manage',
    'system:admin'
  ],
  developer: [
    'agents:create', 'agents:read', 'agents:update', 'agents:delete', 'agents:chat',
    'swarms:create', 'swarms:manage',
    'files:read', 'files:write', 'files:delete',
    'analytics:view'
  ],
  user: [
    'agents:create', 'agents:read', 'agents:update', 'agents:chat',
    'swarms:create',
    'files:read', 'files:write',
    'analytics:view'
  ],
  viewer: [
    'agents:read', 'agents:chat',
    'files:read',
    'analytics:view'
  ]
};

// Default user preferences
export const DEFAULT_USER_PREFERENCES: UserPreferences = {
  theme: 'dark',
  language: 'en',
  notifications: {
    email: true,
    browser: true,
    agentAlerts: true,
    systemUpdates: false
  },
  dashboard: {
    defaultView: 'overview',
    refreshInterval: 30000, // 30 seconds
    showAdvancedMetrics: false
  },
  privacy: {
    shareUsageData: false,
    allowAnalytics: true
  }
};