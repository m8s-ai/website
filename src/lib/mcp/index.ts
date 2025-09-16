// MCP (Model Context Protocol) Client Library - Main Export
// Comprehensive client wrapper for Claude Flow integration

// Core types
export * from '../../types/mcp';

// Core client and API
export {
  MCPClient,
  createMCPClient,
  getDefaultMCPClient,
  setDefaultMCPClient
} from '../mcp-client';

export {
  MCPApi,
  createMCPApi,
  getDefaultMCPApi,
  setDefaultMCPApi,
  mcpApi
} from '../mcp-api';

// Realtime integration
export {
  default as MCPRealtimeManager,
  createRealtimeManager,
  getDefaultRealtimeManager,
  setDefaultRealtimeManager,
  EventFilters
} from '../mcp-realtime';

export type {
  RealtimeConfig,
  EventHandler,
  RealtimeMetrics,
  EventStream,
  EventFilter,
  LiveProgress,
  AgentActivity
} from '../mcp-realtime';

// Testing framework
export {
  default as MCPTestingFramework,
  createTestingFramework,
  getDefaultTestingFramework,
  TestSuites
} from '../mcp-testing';

export type {
  TestingConfig,
  TestResult,
  TestSuite,
  TestCase,
  MockDataGenerator
} from '../mcp-testing';

// React hooks
export {
  useMCP,
  useSwarm,
  useAgent,
  useTasks,
  useRealtime,
  useMemory,
  useSwarmCreation,
  useAgentSpawning,
  useMCPErrorHandler,
  useMCPEventFilter,
  useMCPDefaults,
  useRealtimeDefaults
} from '../../hooks/use-mcp';

export type {
  UseMCPConfig,
  UseSwarmConfig,
  UseRealtimeConfig,
  UseMCPReturn,
  UseSwarmReturn,
  UseAgentReturn,
  UseTasksReturn,
  UseRealtimeReturn,
  UseMemoryReturn
} from '../../hooks/use-mcp';

// React context
export {
  default as MCPProvider,
  useMCPContext,
  withMCP,
  MCPConnectionStatus
} from '../../contexts/MCPContext';

// Utility functions and constants
export const MCP_DEFAULTS = {
  SERVER_URL: 'ws://localhost:8080/mcp',
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
  TIMEOUT: 30000,
  HEARTBEAT_INTERVAL: 30000,
  RECONNECT_INTERVAL: 5000,
  EVENT_BUFFER_SIZE: 1000,
  MEMORY_CACHE_SIZE: 100,
  MAX_AGENTS_PER_SWARM: 50,
  MAX_TASKS_PER_BATCH: 100
};

export const MCP_EVENT_TYPES = [
  'swarm_status_changed',
  'agent_status_changed',
  'task_started',
  'task_completed',
  'task_failed',
  'agent_spawned',
  'agent_terminated',
  'error_occurred',
  'metrics_updated',
  'health_changed',
  'topology_changed',
  'memory_pressure',
  'scaling_event',
  'performance_alert'
] as const;

export const MCP_ERROR_CODES = [
  'CONNECTION_ERROR',
  'AUTHENTICATION_ERROR',
  'TIMEOUT_ERROR',
  'RATE_LIMIT_ERROR',
  'VALIDATION_ERROR',
  'RESOURCE_ERROR',
  'AGENT_ERROR',
  'TASK_ERROR',
  'SWARM_ERROR',
  'MEMORY_ERROR',
  'NETWORK_ERROR',
  'UNKNOWN_ERROR'
] as const;

// Utility functions
export const createMCPSetup = (config?: {
  serverUrl?: string;
  enableRealtime?: boolean;
  enableTesting?: boolean;
  testingScenario?: string;
}) => {
  const {
    serverUrl = MCP_DEFAULTS.SERVER_URL,
    enableRealtime = true,
    enableTesting = false,
    testingScenario
  } = config || {};

  let client: MCPClient;
  let api: MCPApi;
  let realtimeManager: MCPRealtimeManager | null = null;
  let testingFramework: MCPTestingFramework | null = null;

  if (enableTesting) {
    testingFramework = createTestingFramework();
    client = testingFramework.createMockClient(testingScenario);
    api = createMCPApi(client);
  } else {
    client = createMCPClient({ serverUrl });
    api = createMCPApi(client);
  }

  if (enableRealtime && !enableTesting) {
    realtimeManager = createRealtimeManager(serverUrl);
  }

  // Set as defaults
  setDefaultMCPClient(client);
  setDefaultMCPApi(api);
  if (realtimeManager) {
    setDefaultRealtimeManager(realtimeManager);
  }

  return {
    client,
    api,
    realtimeManager,
    testingFramework,
    async connect() {
      await api.connect();
      if (realtimeManager) {
        await realtimeManager.connect();
      }
    },
    async disconnect() {
      if (realtimeManager) {
        await realtimeManager.disconnect();
      }
      await api.disconnect();
    }
  };
};

// Factory function for creating pre-configured setups
export const createMCPFactory = () => {
  return {
    // Production setup
    production: (serverUrl: string) => createMCPSetup({
      serverUrl,
      enableRealtime: true,
      enableTesting: false
    }),

    // Development setup with mocks
    development: (scenario?: string) => createMCPSetup({
      enableRealtime: true,
      enableTesting: true,
      testingScenario: scenario || 'healthy_swarm'
    }),

    // Testing setup
    testing: (scenario?: string) => createMCPSetup({
      enableRealtime: false,
      enableTesting: true,
      testingScenario: scenario
    }),

    // Minimal setup (client only)
    minimal: (serverUrl: string) => createMCPSetup({
      serverUrl,
      enableRealtime: false,
      enableTesting: false
    })
  };
};

// Ready-to-use factory instance
export const MCPFactory = createMCPFactory();

// Quick start functions
export const quickConnect = async (serverUrl?: string) => {
  const setup = MCPFactory.production(serverUrl || MCP_DEFAULTS.SERVER_URL);
  await setup.connect();
  return setup;
};

export const quickMock = async (scenario?: string) => {
  const setup = MCPFactory.development(scenario);
  await setup.connect();
  return setup;
};

// Type guards and validation utilities
export const isMCPError = (error: any): error is import('../../types/mcp').MCPError => {
  return error && typeof error === 'object' && 'code' in error && 'timestamp' in error;
};

export const isSwarmActive = (swarm: import('../../types/mcp').SwarmState): boolean => {
  return swarm.status === 'active';
};

export const isAgentAvailable = (agent: import('../../types/mcp').AgentState): boolean => {
  return agent.status === 'idle' || agent.status === 'active';
};

export const isTaskRunning = (task: import('../../types/mcp').TaskExecution): boolean => {
  return task.status === 'running';
};

// Configuration builders
export const buildSwarmConfig = (
  name: string,
  agentConfigs: Partial<import('../../types/mcp').AgentConfig>[],
  overrides?: Partial<import('../../types/mcp').SwarmConfig>
): import('../../types/mcp').SwarmConfig => {
  return {
    id: `swarm_${Date.now()}`,
    name,
    topology: 'hierarchical',
    agents: agentConfigs.map((config, index) => ({
      id: config.id || `agent_${index}`,
      name: config.name || `Agent ${index + 1}`,
      type: config.type || 'general',
      capabilities: config.capabilities || ['general'],
      maxConcurrentTasks: config.maxConcurrentTasks || 3,
      memorySize: config.memorySize || 1000,
      ...config
    })) as import('../../types/mcp').AgentConfig[],
    orchestrationRules: [],
    scalingPolicy: {
      minAgents: 1,
      maxAgents: 10,
      scaleUpThreshold: 0.8,
      scaleDownThreshold: 0.3,
      cooldownPeriod: 300,
      strategy: 'reactive'
    },
    communicationProtocol: {
      method: 'mesh',
      reliability: 'at_least_once',
      encryption: true,
      compression: true
    },
    failureHandling: {
      strategy: 'restart',
      maxFailures: 3,
      quarantinePeriod: 60,
      notificationThreshold: 2
    },
    ...overrides
  };
};

export const buildTaskDefinition = (
  id: string,
  name: string,
  description: string,
  overrides?: Partial<import('../../types/mcp').TaskDefinition>
): import('../../types/mcp').TaskDefinition => {
  return {
    id,
    name,
    description,
    type: 'analysis',
    priority: 0.5,
    dependencies: [],
    requirements: {
      agentCapabilities: ['general'],
      minimumAgents: 1,
      resourceLimits: {
        maxTokens: 10000,
        maxMemory: 1000,
        maxDuration: 300000
      },
      qualityThreshold: 0.8
    },
    expectedOutput: {
      format: 'text'
    },
    timeout: 300000,
    retryPolicy: {
      maxRetries: 2,
      backoffStrategy: 'exponential',
      baseDelay: 1000,
      maxDelay: 10000,
      retryConditions: ['TIMEOUT_ERROR', 'AGENT_ERROR']
    },
    ...overrides
  };
};

// Performance monitoring utilities
export const createPerformanceMonitor = () => {
  const metrics = {
    connectionLatency: 0,
    tasksPerSecond: 0,
    errorRate: 0,
    memoryUsage: 0,
    agentUtilization: 0
  };

  const monitor = {
    getMetrics: () => ({ ...metrics }),
    startMonitoring: (api: MCPApi) => {
      // Implementation would depend on specific monitoring needs
      console.log('Performance monitoring started');
    },
    stopMonitoring: () => {
      console.log('Performance monitoring stopped');
    }
  };

  return monitor;
};

// Debug utilities
export const createDebugLogger = (prefix: string = 'MCP') => {
  return {
    log: (message: string, data?: any) => {
      if (process.env.NODE_ENV === 'development') {
        console.log(`[${prefix}] ${message}`, data);
      }
    },
    error: (message: string, error?: any) => {
      console.error(`[${prefix}] ERROR: ${message}`, error);
    },
    warn: (message: string, data?: any) => {
      console.warn(`[${prefix}] WARNING: ${message}`, data);
    }
  };
};

// Version information
export const MCP_CLIENT_VERSION = '1.0.0';
export const MCP_PROTOCOL_VERSION = '1.0';
export const SUPPORTED_FEATURES = [
  'swarm_management',
  'agent_orchestration',
  'task_coordination',
  'real_time_monitoring',
  'memory_management',
  'performance_analytics',
  'error_recovery',
  'auto_scaling',
  'testing_framework'
];

// Export everything as a namespace for convenience
export const MCP = {
  // Core
  Client: MCPClient,
  Api: MCPApi,
  RealtimeManager: MCPRealtimeManager,
  TestingFramework: MCPTestingFramework,
  
  // Factories
  createClient: createMCPClient,
  createApi: createMCPApi,
  createRealtime: createRealtimeManager,
  createTesting: createTestingFramework,
  
  // Quick setup
  Factory: MCPFactory,
  quickConnect,
  quickMock,
  
  // Utilities
  buildSwarmConfig,
  buildTaskDefinition,
  createPerformanceMonitor,
  createDebugLogger,
  
  // Type guards
  isMCPError,
  isSwarmActive,
  isAgentAvailable,
  isTaskRunning,
  
  // Constants
  DEFAULTS: MCP_DEFAULTS,
  EVENT_TYPES: MCP_EVENT_TYPES,
  ERROR_CODES: MCP_ERROR_CODES,
  VERSION: MCP_CLIENT_VERSION
};

export default MCP;