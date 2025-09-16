// Environment Configuration for Claude Flow UI

interface ClaudeFlowConfig {
  // Application
  nodeEnv: string;
  appName: string;
  appVersion: string;
  
  // API Configuration
  apiBaseUrl: string;
  mcpServerUrl: string;
  websocketUrl: string;
  
  // Authentication
  authEnabled: boolean;
  authProvider: string;
  
  // Feature Flags
  enableRealTime: boolean;
  enableCollaboration: boolean;
  enableAnalytics: boolean;
  enableErrorReporting: boolean;
  
  // Application Limits
  maxExecutionTime: number;
  maxFlowNodes: number;
  
  // Development
  debugMode: boolean;
  logLevel: string;
  
  // External Services
  sentryDsn?: string;
  analyticsId?: string;
}

const getEnvVar = (key: string, defaultValue?: string): string => {
  const value = import.meta.env[key];
  if (value === undefined && defaultValue === undefined) {
    console.warn(`Environment variable ${key} is not defined`);
    return '';
  }
  return value || defaultValue || '';
};

const getBooleanEnvVar = (key: string, defaultValue: boolean = false): boolean => {
  const value = import.meta.env[key];
  if (value === undefined) return defaultValue;
  return value === 'true' || value === '1';
};

const getNumberEnvVar = (key: string, defaultValue: number): number => {
  const value = import.meta.env[key];
  if (value === undefined) return defaultValue;
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? defaultValue : parsed;
};

// Load and validate environment configuration
export const config: ClaudeFlowConfig = {
  // Application
  nodeEnv: getEnvVar('NODE_ENV', 'development'),
  appName: getEnvVar('VITE_APP_NAME', 'Claude Flow'),
  appVersion: getEnvVar('VITE_APP_VERSION', '1.0.0'),
  
  // API Configuration
  apiBaseUrl: getEnvVar('VITE_API_BASE_URL', 'http://localhost:3000/api'),
  mcpServerUrl: getEnvVar('VITE_MCP_SERVER_URL', 'ws://localhost:3001'),
  websocketUrl: getEnvVar('VITE_WEBSOCKET_URL', 'ws://localhost:3001/ws'),
  
  // Authentication
  authEnabled: getBooleanEnvVar('VITE_AUTH_ENABLED', true),
  authProvider: getEnvVar('VITE_AUTH_PROVIDER', 'local'),
  
  // Feature Flags
  enableRealTime: getBooleanEnvVar('VITE_ENABLE_REAL_TIME', true),
  enableCollaboration: getBooleanEnvVar('VITE_ENABLE_COLLABORATION', false),
  enableAnalytics: getBooleanEnvVar('VITE_ENABLE_ANALYTICS', true),
  enableErrorReporting: getBooleanEnvVar('VITE_ENABLE_ERROR_REPORTING', true),
  
  // Application Limits
  maxExecutionTime: getNumberEnvVar('VITE_MAX_EXECUTION_TIME', 300000), // 5 minutes
  maxFlowNodes: getNumberEnvVar('VITE_MAX_FLOW_NODES', 100),
  
  // Development
  debugMode: getBooleanEnvVar('VITE_DEBUG_MODE', false),
  logLevel: getEnvVar('VITE_LOG_LEVEL', 'info'),
  
  // External Services
  sentryDsn: getEnvVar('VITE_SENTRY_DSN'),
  analyticsId: getEnvVar('VITE_ANALYTICS_ID'),
};

// Validation
const validateConfig = (): void => {
  const errors: string[] = [];
  
  // Validate required URLs
  try {
    new URL(config.apiBaseUrl);
  } catch {
    errors.push('Invalid VITE_API_BASE_URL');
  }
  
  try {
    new URL(config.mcpServerUrl);
  } catch {
    errors.push('Invalid VITE_MCP_SERVER_URL');
  }
  
  try {
    new URL(config.websocketUrl);
  } catch {
    errors.push('Invalid VITE_WEBSOCKET_URL');
  }
  
  // Validate numeric limits
  if (config.maxExecutionTime < 1000) {
    errors.push('VITE_MAX_EXECUTION_TIME must be at least 1000ms');
  }
  
  if (config.maxFlowNodes < 1) {
    errors.push('VITE_MAX_FLOW_NODES must be at least 1');
  }
  
  // Validate log level
  const validLogLevels = ['error', 'warn', 'info', 'debug'];
  if (!validLogLevels.includes(config.logLevel)) {
    errors.push(`Invalid VITE_LOG_LEVEL. Must be one of: ${validLogLevels.join(', ')}`);
  }
  
  if (errors.length > 0) {
    console.error('Configuration validation failed:', errors);
    if (config.nodeEnv === 'production') {
      throw new Error('Invalid configuration. Check environment variables.');
    }
  }
};

// Validate configuration on load
validateConfig();

// Helper functions
export const isDevelopment = () => config.nodeEnv === 'development';
export const isProduction = () => config.nodeEnv === 'production';
export const isDebugEnabled = () => config.debugMode || isDevelopment();

// Logging utility
export const logger = {
  error: (...args: any[]) => {
    if (['error', 'warn', 'info', 'debug'].includes(config.logLevel)) {
      console.error('[Claude Flow]', ...args);
    }
  },
  warn: (...args: any[]) => {
    if (['warn', 'info', 'debug'].includes(config.logLevel)) {
      console.warn('[Claude Flow]', ...args);
    }
  },
  info: (...args: any[]) => {
    if (['info', 'debug'].includes(config.logLevel)) {
      console.info('[Claude Flow]', ...args);
    }
  },
  debug: (...args: any[]) => {
    if (config.logLevel === 'debug' || isDebugEnabled()) {
      console.debug('[Claude Flow]', ...args);
    }
  },
};

export default config;