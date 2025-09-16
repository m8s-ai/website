// MCP Context Provider
// React context for managing MCP state across the application

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  MCPConfig,
  SwarmState,
  MCPClientState,
  MCPConnectionInfo,
  MCPError
} from '../types/mcp';
import { MCPClient, createMCPClient, setDefaultMCPClient } from '../lib/mcp-client';
import { MCPApi, createMCPApi, setDefaultMCPApi } from '../lib/mcp-api';
import MCPRealtimeManager, { 
  createRealtimeManager, 
  setDefaultRealtimeManager 
} from '../lib/mcp-realtime';

interface MCPContextState {
  // Core instances
  client: MCPClient | null;
  api: MCPApi | null;
  realtimeManager: MCPRealtimeManager | null;
  
  // Connection state
  isConnected: boolean;
  isConnecting: boolean;
  connectionInfo: MCPConnectionInfo | null;
  
  // Application state
  swarms: Record<string, SwarmState>;
  activeSwarmId: string | null;
  errors: MCPError[];
  
  // Configuration
  config: MCPConfig | null;
  
  // Methods
  connect: (config?: Partial<MCPConfig>) => Promise<void>;
  disconnect: () => Promise<void>;
  setActiveSwarm: (swarmId: string | null) => void;
  clearErrors: () => void;
  initialize: (config: Partial<MCPConfig>) => Promise<void>;
}

interface MCPProviderProps {
  children: ReactNode;
  config?: Partial<MCPConfig>;
  autoConnect?: boolean;
  enableRealtime?: boolean;
  queryClient?: QueryClient;
}

const MCPContext = createContext<MCPContextState | null>(null);

// Default query client for React Query
const defaultQueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes
      retry: (failureCount, error) => {
        // Don't retry on client errors, but do retry on server/network errors
        if (error && typeof error === 'object' && 'code' in error) {
          const mcpError = error as MCPError;
          return mcpError.retryable && failureCount < 3;
        }
        return failureCount < 3;
      },
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000)
    },
    mutations: {
      retry: (failureCount, error) => {
        if (error && typeof error === 'object' && 'code' in error) {
          const mcpError = error as MCPError;
          return mcpError.retryable && failureCount < 2;
        }
        return false;
      }
    }
  }
});

export const MCPProvider: React.FC<MCPProviderProps> = ({
  children,
  config = {},
  autoConnect = false,
  enableRealtime = true,
  queryClient = defaultQueryClient
}) => {
  const [client, setClient] = useState<MCPClient | null>(null);
  const [api, setApi] = useState<MCPApi | null>(null);
  const [realtimeManager, setRealtimeManager] = useState<MCPRealtimeManager | null>(null);
  
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionInfo, setConnectionInfo] = useState<MCPConnectionInfo | null>(null);
  
  const [swarms, setSwarms] = useState<Record<string, SwarmState>>({});
  const [activeSwarmId, setActiveSwarmId] = useState<string | null>(null);
  const [errors, setErrors] = useState<MCPError[]>([]);
  const [mcpConfig, setMCPConfig] = useState<MCPConfig | null>(null);

  // Initialize MCP instances
  const initialize = async (initConfig: Partial<MCPConfig>) => {
    try {
      // Create and configure client
      const newClient = createMCPClient(initConfig);
      const newApi = createMCPApi(newClient);
      
      // Set as defaults
      setDefaultMCPClient(newClient);
      setDefaultMCPApi(newApi);
      
      // Update state
      setClient(newClient);
      setApi(newApi);
      setMCPConfig(newClient.getState().config);
      
      // Create realtime manager if enabled
      if (enableRealtime && initConfig.serverUrl) {
        const newRealtimeManager = createRealtimeManager(initConfig.serverUrl);
        setDefaultRealtimeManager(newRealtimeManager);
        setRealtimeManager(newRealtimeManager);
        
        // Setup realtime event handlers
        setupRealtimeHandlers(newRealtimeManager);
      }
      
      // Setup client event handlers
      setupClientHandlers(newClient);
      
    } catch (error) {
      console.error('Failed to initialize MCP:', error);
      addError({
        code: 'INITIALIZATION_ERROR',
        message: 'Failed to initialize MCP client',
        details: error,
        timestamp: Date.now(),
        retryable: true,
        component: 'MCPProvider'
      });
      throw error;
    }
  };

  // Setup client event handlers
  const setupClientHandlers = (mcpClient: MCPClient) => {
    mcpClient.on('connected', () => {
      setIsConnected(true);
      setIsConnecting(false);
      setConnectionInfo(mcpClient.getConnection());
    });

    mcpClient.on('disconnected', () => {
      setIsConnected(false);
      setIsConnecting(false);
      setConnectionInfo(mcpClient.getConnection());
    });

    mcpClient.on('error', (error: MCPError) => {
      addError(error);
    });

    // Periodically update connection info and swarms
    const updateInterval = setInterval(() => {
      if (mcpClient.getState().connected) {
        setConnectionInfo(mcpClient.getConnection());
        setSwarms(mcpClient.getSwarms());
      }
    }, 5000);

    // Cleanup on unmount
    return () => {
      clearInterval(updateInterval);
    };
  };

  // Setup realtime event handlers
  const setupRealtimeHandlers = (manager: MCPRealtimeManager) => {
    manager.on('realtime_connected', () => {
      console.log('MCP Realtime connected');
    });

    manager.on('realtime_disconnected', () => {
      console.log('MCP Realtime disconnected');
    });

    manager.on('realtime_error', (error: any) => {
      addError({
        code: 'REALTIME_ERROR',
        message: 'Realtime connection error',
        details: error,
        timestamp: Date.now(),
        retryable: true,
        component: 'RealtimeManager'
      });
    });

    manager.on('swarm_status_changed', (data: any) => {
      setSwarms(prev => ({
        ...prev,
        [data.swarmId]: {
          ...prev[data.swarmId],
          status: data.newStatus,
          lastUpdated: data.timestamp
        }
      }));
    });

    manager.on('agent_status_changed', (data: any) => {
      setSwarms(prev => {
        const swarm = prev[data.swarmId];
        if (!swarm) return prev;

        return {
          ...prev,
          [data.swarmId]: {
            ...swarm,
            agents: swarm.agents.map(agent => 
              agent.id === data.agentId 
                ? { ...agent, status: data.newStatus, lastActivity: data.timestamp }
                : agent
            ),
            lastUpdated: data.timestamp
          }
        };
      });
    });

    manager.on('task_completed', (data: any) => {
      setSwarms(prev => {
        const swarm = prev[data.swarmId];
        if (!swarm) return prev;

        return {
          ...prev,
          [data.swarmId]: {
            ...swarm,
            activeTasks: swarm.activeTasks.map(task =>
              task.id === data.taskId
                ? { ...task, status: 'completed', actualCompletion: data.timestamp }
                : task
            ),
            lastUpdated: data.timestamp
          }
        };
      });
    });

    manager.on('error_occurred', (error: any) => {
      addError({
        code: error.type || 'UNKNOWN_ERROR',
        message: error.message,
        details: error.details,
        timestamp: error.timestamp,
        retryable: error.severity !== 'critical',
        component: error.component || 'Unknown'
      });
    });
  };

  // Connection management
  const connect = async (connectConfig?: Partial<MCPConfig>) => {
    if (isConnecting || isConnected) return;

    setIsConnecting(true);
    setErrors([]); // Clear previous errors

    try {
      // Initialize if not already done
      if (!client || !api) {
        await initialize(connectConfig || config);
      }

      // Connect client
      if (client) {
        await client.connect();
      }

      // Connect realtime if enabled
      if (enableRealtime && realtimeManager) {
        try {
          await realtimeManager.connect();
        } catch (realtimeError) {
          console.warn('Realtime connection failed, continuing without realtime:', realtimeError);
          // Don't fail the entire connection if realtime fails
        }
      }

    } catch (error) {
      setIsConnecting(false);
      const mcpError: MCPError = {
        code: 'CONNECTION_ERROR',
        message: 'Failed to connect to MCP server',
        details: error,
        timestamp: Date.now(),
        retryable: true,
        component: 'MCPProvider'
      };
      addError(mcpError);
      throw mcpError;
    }
  };

  const disconnect = async () => {
    try {
      // Disconnect realtime first
      if (realtimeManager) {
        await realtimeManager.disconnect();
      }

      // Disconnect client
      if (client) {
        await client.disconnect();
      }

      // Clear state
      setSwarms({});
      setActiveSwarmId(null);
      
    } catch (error) {
      const mcpError: MCPError = {
        code: 'DISCONNECTION_ERROR',
        message: 'Failed to disconnect from MCP server',
        details: error,
        timestamp: Date.now(),
        retryable: false,
        component: 'MCPProvider'
      };
      addError(mcpError);
      throw mcpError;
    }
  };

  // Error management
  const addError = (error: MCPError) => {
    setErrors(prev => {
      const newErrors = [...prev, error];
      // Keep only the last 50 errors
      return newErrors.slice(-50);
    });
  };

  const clearErrors = () => {
    setErrors([]);
  };

  // Auto-connect on mount
  useEffect(() => {
    if (autoConnect && !isConnected && !isConnecting) {
      connect(config).catch(console.error);
    }
  }, [autoConnect]);

  // Initialize on mount if config is provided
  useEffect(() => {
    if (Object.keys(config).length > 0 && !client) {
      initialize(config).catch(console.error);
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (client && isConnected) {
        disconnect().catch(console.error);
      }
    };
  }, []);

  const contextValue: MCPContextState = {
    client,
    api,
    realtimeManager,
    isConnected,
    isConnecting,
    connectionInfo,
    swarms,
    activeSwarmId,
    errors,
    config: mcpConfig,
    connect,
    disconnect,
    setActiveSwarm: setActiveSwarmId,
    clearErrors,
    initialize
  };

  return (
    <MCPContext.Provider value={contextValue}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </MCPContext.Provider>
  );
};

// Hook to use MCP context
export const useMCPContext = (): MCPContextState => {
  const context = useContext(MCPContext);
  if (!context) {
    throw new Error('useMCPContext must be used within an MCPProvider');
  }
  return context;
};

// HOC for components that require MCP connection
export const withMCP = <P extends object>(
  Component: React.ComponentType<P>
): React.FC<P & { requireConnection?: boolean }> => {
  return ({ requireConnection = false, ...props }: P & { requireConnection?: boolean }) => {
    const { isConnected, isConnecting, connect, errors } = useMCPContext();

    // Auto-connect if required
    useEffect(() => {
      if (requireConnection && !isConnected && !isConnecting) {
        connect().catch(console.error);
      }
    }, [requireConnection, isConnected, isConnecting, connect]);

    // Show loading state if connection is required but not available
    if (requireConnection && !isConnected) {
      if (isConnecting) {
        return (
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2">Connecting to MCP server...</span>
          </div>
        );
      }

      if (errors.length > 0) {
        const lastError = errors[errors.length - 1];
        return (
          <div className="flex flex-col items-center justify-center p-8 text-red-600">
            <div className="text-lg font-semibold mb-2">Connection Failed</div>
            <div className="text-sm mb-4">{lastError.message}</div>
            <button
              onClick={() => connect()}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Retry Connection
            </button>
          </div>
        );
      }
    }

    return <Component {...(props as P)} />;
  };
};

// Utility component for displaying connection status
export const MCPConnectionStatus: React.FC<{ 
  showDetails?: boolean;
  className?: string;
}> = ({ showDetails = false, className = "" }) => {
  const { 
    isConnected, 
    isConnecting, 
    connectionInfo, 
    errors,
    connect,
    disconnect 
  } = useMCPContext();

  const getStatusColor = () => {
    if (isConnecting) return 'text-yellow-600';
    if (isConnected) return 'text-green-600';
    return 'text-red-600';
  };

  const getStatusText = () => {
    if (isConnecting) return 'Connecting...';
    if (isConnected) return 'Connected';
    return 'Disconnected';
  };

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <div className={`w-3 h-3 rounded-full ${
        isConnecting ? 'bg-yellow-500 animate-pulse' :
        isConnected ? 'bg-green-500' : 'bg-red-500'
      }`} />
      
      <span className={`text-sm font-medium ${getStatusColor()}`}>
        {getStatusText()}
      </span>

      {showDetails && connectionInfo && (
        <div className="text-xs text-gray-500">
          ({connectionInfo.protocol}://{new URL(connectionInfo.url).host})
        </div>
      )}

      {errors.length > 0 && (
        <div className="text-xs text-red-500">
          ({errors.length} error{errors.length > 1 ? 's' : ''})
        </div>
      )}

      <div className="flex space-x-1">
        {!isConnected && (
          <button
            onClick={() => connect()}
            disabled={isConnecting}
            className="text-xs px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            Connect
          </button>
        )}
        
        {isConnected && (
          <button
            onClick={() => disconnect()}
            className="text-xs px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Disconnect
          </button>
        )}
      </div>
    </div>
  );
};

export default MCPProvider;