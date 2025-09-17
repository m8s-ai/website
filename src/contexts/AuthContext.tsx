import React, { createContext, useContext, useEffect, useReducer, useCallback } from 'react';
import { authService } from '../services/authService';
import type { 
  AuthState, 
  User, 
  AuthToken, 
  LoginCredentials, 
  RegisterCredentials, 
  Permission, 
  UserRole 
} from '../types/auth';

// Auth action types
type AuthAction = 
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: { user: User; token: AuthToken } }
  | { type: 'LOGIN_FAILURE'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'TOKEN_REFRESHED'; payload: AuthToken }
  | { type: 'PREFERENCES_UPDATED'; payload: Partial<User['preferences']> }
  | { type: 'UPDATE_LAST_ACTIVITY' }
  | { type: 'CLEAR_ERROR' };

// Initial auth state
const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  token: null,
  isLoading: false,
  error: null,
  lastActivity: Date.now()
};

// Auth reducer
function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'LOGIN_START':
      return {
        ...state,
        isLoading: true,
        error: null
      };

    case 'LOGIN_SUCCESS':
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.token,
        isLoading: false,
        error: null,
        lastActivity: Date.now()
      };

    case 'LOGIN_FAILURE':
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        token: null,
        isLoading: false,
        error: action.payload
      };

    case 'LOGOUT':
      return {
        ...initialState,
        lastActivity: Date.now()
      };

    case 'TOKEN_REFRESHED':
      return {
        ...state,
        token: action.payload,
        lastActivity: Date.now()
      };

    case 'PREFERENCES_UPDATED':
      return {
        ...state,
        user: state.user ? {
          ...state.user,
          preferences: { ...state.user.preferences, ...action.payload }
        } : null,
        lastActivity: Date.now()
      };

    case 'UPDATE_LAST_ACTIVITY':
      return {
        ...state,
        lastActivity: Date.now()
      };

    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null
      };

    default:
      return state;
  }
}

// Auth context interface
interface AuthContextType {
  // State
  state: AuthState;
  
  // Actions
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
  updatePreferences: (preferences: Partial<User['preferences']>) => Promise<void>;
  clearError: () => void;
  updateActivity: () => void;
  
  // Utility functions
  hasPermission: (permission: Permission) => boolean;
  hasRole: (role: UserRole) => boolean;
  isAuthenticated: () => boolean;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth provider component
interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Initialize auth state from storage
  useEffect(() => {
    const initializeAuth = () => {
      const user = authService.getCurrentUser();
      const token = authService.getCurrentToken();
      
      if (user && token && authService.isAuthenticated()) {
        dispatch({ 
          type: 'LOGIN_SUCCESS', 
          payload: { user, token } 
        });
      }
    };

    initializeAuth();
  }, []);

  // Set up auth service event listeners
  useEffect(() => {
    const handleLogin = (data: { user: User; token: AuthToken }) => {
      dispatch({ type: 'LOGIN_SUCCESS', payload: data });
    };

    const handleLogout = () => {
      dispatch({ type: 'LOGOUT' });
    };

    const handleTokenRefresh = (data: { token: AuthToken }) => {
      dispatch({ type: 'TOKEN_REFRESHED', payload: data.token });
    };

    const handlePreferencesUpdate = (data: { preferences: User['preferences'] }) => {
      dispatch({ type: 'PREFERENCES_UPDATED', payload: data.preferences });
    };

    // Subscribe to auth service events
    authService.on('login', handleLogin);
    authService.on('logout', handleLogout);
    authService.on('token_refreshed', handleTokenRefresh);
    authService.on('preferences_updated', handlePreferencesUpdate);

    // Cleanup
    return () => {
      authService.off('login', handleLogin);
      authService.off('logout', handleLogout);
      authService.off('token_refreshed', handleTokenRefresh);
      authService.off('preferences_updated', handlePreferencesUpdate);
    };
  }, []);

  // Auto-update activity on user interaction
  useEffect(() => {
    const handleActivity = () => {
      if (state.isAuthenticated) {
        dispatch({ type: 'UPDATE_LAST_ACTIVITY' });
      }
    };

    // Listen for user activity
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    events.forEach(event => {
      document.addEventListener(event, handleActivity, true);
    });

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleActivity, true);
      });
    };
  }, [state.isAuthenticated]);

  // Login function
  const login = useCallback(async (credentials: LoginCredentials) => {
    try {
      dispatch({ type: 'LOGIN_START' });
      await authService.login(credentials);
      // Success is handled by the event listener
    } catch (error) {
      dispatch({ 
        type: 'LOGIN_FAILURE', 
        payload: error instanceof Error ? error.message : 'Login failed' 
      });
      throw error;
    }
  }, []);

  // Register function
  const register = useCallback(async (credentials: RegisterCredentials) => {
    try {
      dispatch({ type: 'LOGIN_START' });
      await authService.register(credentials);
      // Success is handled by the event listener
    } catch (error) {
      dispatch({ 
        type: 'LOGIN_FAILURE', 
        payload: error instanceof Error ? error.message : 'Registration failed' 
      });
      throw error;
    }
  }, []);

  // Logout function
  const logout = useCallback(async () => {
    await authService.logout();
    // Logout is handled by the event listener
  }, []);

  // Refresh token function
  const refreshToken = useCallback(async () => {
    try {
      await authService.refreshToken();
    } catch (error) {
      console.error('Token refresh failed:', error);
      // Force logout if refresh fails
      await logout();
    }
  }, [logout]);

  // Update preferences function
  const updatePreferences = useCallback(async (preferences: Partial<User['preferences']>) => {
    try {
      await authService.updatePreferences(preferences);
      // Update is handled by the event listener
    } catch (error) {
      console.error('Failed to update preferences:', error);
      throw error;
    }
  }, []);

  // Clear error function
  const clearError = useCallback(() => {
    dispatch({ type: 'CLEAR_ERROR' });
  }, []);

  // Update activity function
  const updateActivity = useCallback(() => {
    dispatch({ type: 'UPDATE_LAST_ACTIVITY' });
  }, []);

  // Permission check function
  const hasPermission = useCallback((permission: Permission): boolean => {
    return authService.hasPermission(permission);
  }, []);

  // Role check function
  const hasRole = useCallback((role: UserRole): boolean => {
    return authService.hasRole(role);
  }, []);

  // Authentication check function
  const isAuthenticated = useCallback((): boolean => {
    return authService.isAuthenticated();
  }, []);

  // Context value
  const contextValue: AuthContextType = {
    state,
    login,
    register,
    logout,
    refreshToken,
    updatePreferences,
    clearError,
    updateActivity,
    hasPermission,
    hasRole,
    isAuthenticated
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// HOC for authentication requirement
export function withAuth<P extends object>(
  Component: React.ComponentType<P>,
  requiredPermission?: Permission
) {
  return function AuthenticatedComponent(props: P) {
    const { isAuthenticated, hasPermission } = useAuth();
    
    if (!isAuthenticated()) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-gray-950 to-gray-900 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white mb-4">Authentication Required</h1>
            <p className="text-gray-400">Please log in to access this page.</p>
          </div>
        </div>
      );
    }
    
    if (requiredPermission && !hasPermission(requiredPermission)) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-gray-950 to-gray-900 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white mb-4">Access Denied</h1>
            <p className="text-gray-400">You don't have permission to access this page.</p>
          </div>
        </div>
      );
    }
    
    return <Component {...props} />;
  };
}

export default AuthContext;