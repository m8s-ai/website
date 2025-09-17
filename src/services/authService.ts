import type { 
  User, 
  AuthToken, 
  LoginCredentials, 
  RegisterCredentials, 
  SecurityEvent,
  SessionInfo,
  UserRole,
  Permission
} from '../types/auth';

import { ROLE_PERMISSIONS, DEFAULT_USER_PREFERENCES } from '../types/auth';

// Mock user database - In production, this would be handled by your backend
const MOCK_USERS: User[] = [
  {
    id: 'user-admin-1',
    email: 'admin@clauseflow.ai',
    username: 'admin',
    firstName: 'Claude',
    lastName: 'Administrator',
    role: 'admin',
    status: 'active',
    createdAt: new Date().toISOString(),
    lastLoginAt: new Date().toISOString(),
    preferences: DEFAULT_USER_PREFERENCES,
    permissions: ROLE_PERMISSIONS.admin
  },
  {
    id: 'user-dev-1',
    email: 'developer@clauseflow.ai',
    username: 'developer',
    firstName: 'Claude',
    lastName: 'Developer',
    role: 'developer',
    status: 'active',
    createdAt: new Date().toISOString(),
    preferences: DEFAULT_USER_PREFERENCES,
    permissions: ROLE_PERMISSIONS.developer
  },
  {
    id: 'user-demo-1',
    email: 'demo@clauseflow.ai',
    username: 'demo',
    firstName: 'Demo',
    lastName: 'User',
    role: 'user',
    status: 'active',
    createdAt: new Date().toISOString(),
    preferences: DEFAULT_USER_PREFERENCES,
    permissions: ROLE_PERMISSIONS.user
  }
];

class AuthService {
  private readonly TOKEN_KEY = 'claude_flow_token';
  private readonly USER_KEY = 'claude_flow_user';
  private readonly SESSION_KEY = 'claude_flow_session';
  private readonly REFRESH_THRESHOLD = 5 * 60 * 1000; // 5 minutes

  private refreshTimer?: NodeJS.Timeout;
  private listeners: Map<string, Function[]> = new Map();

  constructor() {
    this.initializeAutoRefresh();
  }

  // Event system for auth state changes
  on(event: string, callback: Function) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(callback);
  }

  off(event: string, callback: Function) {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      const index = eventListeners.indexOf(callback);
      if (index > -1) {
        eventListeners.splice(index, 1);
      }
    }
  }

  private emit(event: string, data: any) {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      eventListeners.forEach(callback => callback(data));
    }
  }

  // Login with email and password
  async login(credentials: LoginCredentials): Promise<{ user: User; token: AuthToken }> {
    // Input validation
    if (!credentials.email || !credentials.password) {
      throw new Error('Email and password are required');
    }

    if (!this.isValidEmail(credentials.email)) {
      throw new Error('Invalid email format');
    }

    // Simulate API delay
    await this.delay(500);

    // Find user by email
    const user = MOCK_USERS.find(u => u.email === credentials.email);
    
    if (!user) {
      await this.logSecurityEvent('login_failed', { email: credentials.email, reason: 'user_not_found' });
      throw new Error('Invalid email or password');
    }

    if (user.status !== 'active') {
      await this.logSecurityEvent('login_failed', { userId: user.id, reason: 'account_inactive' });
      throw new Error('Account is not active');
    }

    // In production, verify password hash
    // For demo, we'll accept any password for existing users
    const isValidPassword = this.verifyPassword(credentials.password, user);
    
    if (!isValidPassword) {
      await this.logSecurityEvent('login_failed', { userId: user.id, reason: 'invalid_password' });
      throw new Error('Invalid email or password');
    }

    // Generate JWT tokens
    const token = this.generateTokens(user);

    // Update last login
    user.lastLoginAt = new Date().toISOString();

    // Store in localStorage for persistence
    this.storeAuthData(user, token);

    // Log successful login
    await this.logSecurityEvent('login_success', { userId: user.id });

    this.emit('login', { user, token });

    return { user, token };
  }

  // Register new user
  async register(credentials: RegisterCredentials): Promise<{ user: User; token: AuthToken }> {
    // Input validation
    this.validateRegistrationData(credentials);

    // Check if user already exists
    const existingUser = MOCK_USERS.find(u => 
      u.email === credentials.email || u.username === credentials.username
    );

    if (existingUser) {
      throw new Error('User with this email or username already exists');
    }

    // Create new user
    const newUser: User = {
      id: `user-${Date.now()}`,
      email: credentials.email,
      username: credentials.username,
      firstName: credentials.firstName,
      lastName: credentials.lastName,
      role: 'user', // Default role
      status: 'active',
      createdAt: new Date().toISOString(),
      preferences: DEFAULT_USER_PREFERENCES,
      permissions: ROLE_PERMISSIONS.user
    };

    // Add to mock database
    MOCK_USERS.push(newUser);

    // Generate tokens
    const token = this.generateTokens(newUser);

    // Store auth data
    this.storeAuthData(newUser, token);

    // Log registration
    await this.logSecurityEvent('login_success', { userId: newUser.id, action: 'registration' });

    this.emit('register', { user: newUser, token });

    return { user: newUser, token };
  }

  // Logout user
  async logout(): Promise<void> {
    const user = this.getCurrentUser();
    
    if (user) {
      await this.logSecurityEvent('logout', { userId: user.id });
    }

    // Clear stored data
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    localStorage.removeItem(this.SESSION_KEY);

    // Clear refresh timer
    if (this.refreshTimer) {
      clearInterval(this.refreshTimer);
    }

    this.emit('logout', {});
  }

  // Get current user from storage
  getCurrentUser(): User | null {
    try {
      const userData = localStorage.getItem(this.USER_KEY);
      return userData ? JSON.parse(userData) : null;
    } catch {
      return null;
    }
  }

  // Get current token from storage
  getCurrentToken(): AuthToken | null {
    try {
      const tokenData = localStorage.getItem(this.TOKEN_KEY);
      return tokenData ? JSON.parse(tokenData) : null;
    } catch {
      return null;
    }
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    const token = this.getCurrentToken();
    if (!token) return false;
    
    // Check if token is expired
    return Date.now() < token.expiresAt;
  }

  // Check if user has specific permission
  hasPermission(permission: Permission): boolean {
    const user = this.getCurrentUser();
    if (!user) return false;
    
    return user.permissions.includes(permission);
  }

  // Check if user has role
  hasRole(role: UserRole): boolean {
    const user = this.getCurrentUser();
    return user?.role === role;
  }

  // Refresh token
  async refreshToken(): Promise<AuthToken | null> {
    const currentToken = this.getCurrentToken();
    const user = this.getCurrentUser();

    if (!currentToken || !user) {
      return null;
    }

    try {
      // In production, this would call your refresh endpoint
      const newToken = this.generateTokens(user);
      
      // Store new token
      localStorage.setItem(this.TOKEN_KEY, JSON.stringify(newToken));

      await this.logSecurityEvent('token_refresh', { userId: user.id });

      this.emit('token_refreshed', { token: newToken });

      return newToken;
    } catch (error) {
      console.error('Token refresh failed:', error);
      await this.logout();
      return null;
    }
  }

  // Update user preferences
  async updatePreferences(preferences: Partial<User['preferences']>): Promise<void> {
    const user = this.getCurrentUser();
    if (!user) throw new Error('User not authenticated');

    // Update preferences
    user.preferences = { ...user.preferences, ...preferences };

    // Store updated user
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));

    this.emit('preferences_updated', { preferences: user.preferences });
  }

  // Get user sessions (mock implementation)
  async getUserSessions(): Promise<SessionInfo[]> {
    const user = this.getCurrentUser();
    if (!user) return [];

    // Mock session data
    return [
      {
        id: 'session-current',
        userId: user.id,
        deviceInfo: {
          userAgent: navigator.userAgent,
          ip: '127.0.0.1',
          location: 'Local Development'
        },
        createdAt: new Date(Date.now() - 3600000).toISOString(),
        lastActivity: new Date().toISOString(),
        isActive: true
      }
    ];
  }

  // Private helper methods
  private validateRegistrationData(credentials: RegisterCredentials): void {
    if (!credentials.email || !this.isValidEmail(credentials.email)) {
      throw new Error('Valid email is required');
    }

    if (!credentials.username || credentials.username.length < 3) {
      throw new Error('Username must be at least 3 characters');
    }

    if (!credentials.firstName || credentials.firstName.length < 1) {
      throw new Error('First name is required');
    }

    if (!credentials.lastName || credentials.lastName.length < 1) {
      throw new Error('Last name is required');
    }

    if (!credentials.password || credentials.password.length < 6) {
      throw new Error('Password must be at least 6 characters');
    }

    if (credentials.password !== credentials.confirmPassword) {
      throw new Error('Passwords do not match');
    }

    if (!credentials.acceptTerms) {
      throw new Error('You must accept the terms and conditions');
    }
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private verifyPassword(password: string, user: User): boolean {
    // In production, this would verify against a hashed password
    // For demo purposes, we'll use simple rules:
    
    // Admin/demo accounts accept any password
    if (user.role === 'admin' || user.username === 'demo') {
      return true;
    }

    // For other accounts, password should be at least 6 characters
    return password.length >= 6;
  }

  private generateTokens(user: User): AuthToken {
    const now = Date.now();
    const expiresIn = 24 * 60 * 60 * 1000; // 24 hours

    // In production, these would be actual JWT tokens
    const accessToken = this.generateMockJWT(user, now + expiresIn);
    const refreshToken = this.generateMockJWT(user, now + (7 * 24 * 60 * 60 * 1000)); // 7 days

    return {
      accessToken,
      refreshToken,
      expiresAt: now + expiresIn,
      tokenType: 'Bearer'
    };
  }

  private generateMockJWT(user: User, expiresAt: number): string {
    // This is a mock JWT - in production, use a proper JWT library
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payload = btoa(JSON.stringify({ 
      sub: user.id, 
      email: user.email, 
      role: user.role,
      exp: Math.floor(expiresAt / 1000)
    }));
    const signature = btoa(`mock-signature-${user.id}-${expiresAt}`);
    
    return `${header}.${payload}.${signature}`;
  }

  private storeAuthData(user: User, token: AuthToken): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    localStorage.setItem(this.TOKEN_KEY, JSON.stringify(token));
    
    // Store session info
    const sessionInfo: SessionInfo = {
      id: `session-${Date.now()}`,
      userId: user.id,
      deviceInfo: {
        userAgent: navigator.userAgent,
        ip: '127.0.0.1'
      },
      createdAt: new Date().toISOString(),
      lastActivity: new Date().toISOString(),
      isActive: true
    };
    
    localStorage.setItem(this.SESSION_KEY, JSON.stringify(sessionInfo));
  }

  private async logSecurityEvent(type: SecurityEvent['type'], details: Record<string, any>): Promise<void> {
    const event: SecurityEvent = {
      id: `event-${Date.now()}`,
      userId: details.userId || 'anonymous',
      type,
      details,
      timestamp: new Date().toISOString(),
      severity: this.getEventSeverity(type),
      resolved: false
    };

    // In production, this would send to your logging service
    console.log('🔒 Security Event:', event);
    
    this.emit('security_event', event);
  }

  private getEventSeverity(type: SecurityEvent['type']): SecurityEvent['severity'] {
    const severityMap: Record<SecurityEvent['type'], SecurityEvent['severity']> = {
      login_success: 'low',
      login_failed: 'medium',
      logout: 'low',
      password_changed: 'medium',
      email_changed: 'medium',
      role_changed: 'high',
      permission_denied: 'medium',
      suspicious_activity: 'high',
      account_locked: 'critical',
      token_refresh: 'low',
      session_expired: 'low'
    };

    return severityMap[type] || 'medium';
  }

  private initializeAutoRefresh(): void {
    // Check token refresh every minute
    this.refreshTimer = setInterval(() => {
      const token = this.getCurrentToken();
      if (token && this.isAuthenticated()) {
        const timeUntilExpiry = token.expiresAt - Date.now();
        
        // Refresh if within threshold
        if (timeUntilExpiry <= this.REFRESH_THRESHOLD) {
          this.refreshToken();
        }
      }
    }, 60000); // Check every minute
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Export singleton instance
export const authService = new AuthService();
export default authService;