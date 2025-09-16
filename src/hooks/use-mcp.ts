// React Hooks for MCP Integration
// Custom hooks for seamless integration of MCP functionality with React components

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  MCPConfig,
  SwarmConfig,
  AgentConfig,
  TaskDefinition,
  SwarmState,
  AgentState,
  TaskExecution,
  SwarmInitResponse,
  AgentSpawnResponse,
  TaskOrchestrationResponse,
  SwarmStatusResponse,
  AgentMetricsResponse,
  MemoryUsageResponse,
  TaskResultsResponse,
  MCPWebSocketEvent,
  MCPEventType,
  AgentStatus,
  TaskStatus,
  SwarmStatus,
  TimeRange,
  MCPError,
  LiveProgress,
  AgentActivity,
  RealtimeMetrics
} from '../types/mcp';
import { MCPClient, getDefaultMCPClient } from '../lib/mcp-client';
import { MCPApi, getDefaultMCPApi, mcpApi } from '../lib/mcp-api';
import MCPRealtimeManager, { 
  getDefaultRealtimeManager, 
  setDefaultRealtimeManager,
  EventFilter,
  EventFilters 
} from '../lib/mcp-realtime';

// Hook Configuration Types
export interface UseMCPConfig {
  client?: MCPClient;
  api?: MCPApi;
  realtimeManager?: MCPRealtimeManager;
  autoConnect?: boolean;
  serverUrl?: string;
  enableRealtime?: boolean;
  enablePersistence?: boolean;
  retryOnError?: boolean;
}

export interface UseSwarmConfig {
  swarmId: string;
  autoRefresh?: boolean;
  refreshInterval?: number;
  includeMetrics?: boolean;
  includeHealth?: boolean;
}

export interface UseRealtimeConfig {
  autoConnect?: boolean;
  filters?: EventFilter[];
  bufferSize?: number;
  onEvent?: (event: MCPWebSocketEvent) => void;
  onError?: (error: Error) => void;
}

// Hook Return Types
export interface UseMCPReturn {
  client: MCPClient;
  api: MCPApi;
  isConnected: boolean;
  isConnecting: boolean;
  error: Error | null;
  connect: (config?: Partial<MCPConfig>) => Promise<void>;
  disconnect: () => Promise<void>;
  retry: () => Promise<void>;
}

export interface UseSwarmReturn {
  swarm: SwarmState | null;
  isLoading: boolean;
  error: Error | null;
  refresh: () => void;
  agents: AgentState[];
  tasks: TaskExecution[];
  status: SwarmStatus;
  health: number;
  performance: any;
  scale: (targetAgents: number) => Promise<void>;
  terminate: () => Promise<void>;
}

export interface UseAgentReturn {
  agent: AgentState | null;
  isLoading: boolean;
  error: Error | null;
  metrics: AgentMetricsResponse | null;
  terminate: () => Promise<void>;
  clone: (modifications?: Partial<AgentConfig>) => Promise<AgentSpawnResponse>;
  update: (updates: Partial<AgentConfig>) => Promise<void>;
}

export interface UseTasksReturn {
  tasks: TaskExecution[];
  isLoading: boolean;
  error: Error | null;
  summary: any;
  orchestrate: (tasks: TaskDefinition[]) => Promise<TaskOrchestrationResponse>;
  cancel: (taskId: string) => Promise<void>;
  retry: (taskId: string) => Promise<void>;
  analytics: any;
}

export interface UseRealtimeReturn {
  isConnected: boolean;
  isConnecting: boolean;
  events: MCPWebSocketEvent[];
  metrics: RealtimeMetrics;
  liveProgress: LiveProgress[];
  agentActivities: AgentActivity[];
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  on: (eventType: MCPEventType, handler: (event: MCPWebSocketEvent) => void) => void;
  off: (eventType: MCPEventType, handler: (event: MCPWebSocketEvent) => void) => void;
  clearEvents: () => void;
}

export interface UseMemoryReturn {
  usage: MemoryUsageResponse | null;
  isLoading: boolean;
  error: Error | null;
  optimize: () => Promise<void>;
  export: () => Promise<any>;
  import: (data: any) => Promise<void>;
  refresh: () => void;
}

// Main MCP Hook
export function useMCP(config: UseMCPConfig = {}): UseMCPReturn {
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  const client = useMemo(() => {
    return config.client || getDefaultMCPClient();
  }, [config.client]);

  const api = useMemo(() => {
    return config.api || getDefaultMCPApi();
  }, [config.api]);

  const isConnected = client.getState().connected;

  const connect = useCallback(async (mcpConfig?: Partial<MCPConfig>) => {
    if (isConnecting || isConnected) return;

    setIsConnecting(true);
    setError(null);

    try {
      await api.connect(mcpConfig || { serverUrl: config.serverUrl });
      
      // Setup realtime if enabled
      if (config.enableRealtime && config.serverUrl) {
        const realtimeManager = new MCPRealtimeManager(config.serverUrl);
        setDefaultRealtimeManager(realtimeManager);
        await realtimeManager.connect();
      }
    } catch (err) {
      setError(err as Error);
      if (!config.retryOnError) {
        throw err;
      }
    } finally {
      setIsConnecting(false);
    }
  }, [api, config.serverUrl, config.enableRealtime, config.retryOnError, isConnecting, isConnected]);

  const disconnect = useCallback(async () => {
    try {
      await api.disconnect();
      
      // Disconnect realtime if active
      if (config.enableRealtime) {
        try {
          const realtimeManager = getDefaultRealtimeManager();
          await realtimeManager.disconnect();
        } catch (err) {
          console.warn('Failed to disconnect realtime manager:', err);
        }
      }
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  }, [api, config.enableRealtime]);

  const retry = useCallback(async () => {
    if (error && config.retryOnError) {
      await connect();
    }
  }, [error, config.retryOnError, connect]);

  // Auto-connect on mount
  useEffect(() => {
    if (config.autoConnect && !isConnected && !isConnecting) {
      connect().catch(console.error);
    }
  }, [config.autoConnect, isConnected, isConnecting, connect]);

  return {
    client,
    api,
    isConnected,
    isConnecting,
    error,
    connect,
    disconnect,
    retry
  };
}

// Swarm Management Hook
export function useSwarm(config: UseSwarmConfig): UseSwarmReturn {
  const queryClient = useQueryClient();
  const { api } = useMCP();

  const {
    data: swarm,
    isLoading,
    error,
    refetch: refresh
  } = useQuery({
    queryKey: ['swarm', config.swarmId],
    queryFn: () => api.swarmStatus({
      swarmId: config.swarmId,
      includeAgents: true,
      includeTasks: true,
      includeMetrics: config.includeMetrics ?? true,
      includeHealth: config.includeHealth ?? true
    }),
    enabled: !!config.swarmId,
    refetchInterval: config.autoRefresh ? (config.refreshInterval || 5000) : false,
    select: (data) => data.swarm
  });

  const scaleMutation = useMutation({
    mutationFn: ({ targetAgents }: { targetAgents: number }) =>
      api.swarmScale(config.swarmId, targetAgents),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['swarm', config.swarmId] });
    }
  });

  const terminateMutation = useMutation({
    mutationFn: () => api.swarmTerminate(config.swarmId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['swarm', config.swarmId] });
    }
  });

  const scale = useCallback(async (targetAgents: number) => {
    await scaleMutation.mutateAsync({ targetAgents });
  }, [scaleMutation]);

  const terminate = useCallback(async () => {
    await terminateMutation.mutateAsync();
  }, [terminateMutation]);

  return {
    swarm: swarm || null,
    isLoading,
    error: error as Error | null,
    refresh,
    agents: swarm?.agents || [],
    tasks: swarm?.activeTasks || [],
    status: swarm?.status || 'idle',
    health: swarm?.health?.overall || 0,
    performance: swarm?.performance,
    scale,
    terminate
  };
}

// Agent Management Hook
export function useAgent(agentId: string, swarmId?: string): UseAgentReturn {
  const queryClient = useQueryClient();
  const { api } = useMCP();

  const {
    data: metrics,
    isLoading: metricsLoading,
    error: metricsError
  } = useQuery({
    queryKey: ['agent-metrics', agentId],
    queryFn: () => api.agentMetrics({ agentId }),
    enabled: !!agentId,
    refetchInterval: 10000 // Refresh every 10 seconds
  });

  // Get agent state from swarm data if available
  const { data: swarmData } = useQuery({
    queryKey: ['swarm', swarmId],
    queryFn: () => api.swarmStatus({ swarmId: swarmId!, includeAgents: true }),
    enabled: !!swarmId,
    select: (data) => data.swarm
  });

  const agent = useMemo(() => {
    if (swarmData) {
      return swarmData.agents.find(a => a.id === agentId) || null;
    }
    return null;
  }, [swarmData, agentId]);

  const terminateMutation = useMutation({
    mutationFn: () => api.agentTerminate(agentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agent-metrics', agentId] });
      if (swarmId) {
        queryClient.invalidateQueries({ queryKey: ['swarm', swarmId] });
      }
    }
  });

  const cloneMutation = useMutation({
    mutationFn: (modifications?: Partial<AgentConfig>) =>
      api.agentClone(agentId, modifications),
    onSuccess: () => {
      if (swarmId) {
        queryClient.invalidateQueries({ queryKey: ['swarm', swarmId] });
      }
    }
  });

  const updateMutation = useMutation({
    mutationFn: (updates: Partial<AgentConfig>) =>
      api.agentUpdate(agentId, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agent-metrics', agentId] });
      if (swarmId) {
        queryClient.invalidateQueries({ queryKey: ['swarm', swarmId] });
      }
    }
  });

  const terminate = useCallback(async () => {
    await terminateMutation.mutateAsync();
  }, [terminateMutation]);

  const clone = useCallback(async (modifications?: Partial<AgentConfig>) => {
    return await cloneMutation.mutateAsync(modifications);
  }, [cloneMutation]);

  const update = useCallback(async (updates: Partial<AgentConfig>) => {
    await updateMutation.mutateAsync(updates);
  }, [updateMutation]);

  return {
    agent,
    isLoading: metricsLoading,
    error: metricsError as Error | null,
    metrics: metrics || null,
    terminate,
    clone,
    update
  };
}

// Task Management Hook
export function useTasks(swarmId: string): UseTasksReturn {
  const queryClient = useQueryClient();
  const { api } = useMCP();

  const {
    data: results,
    isLoading,
    error
  } = useQuery({
    queryKey: ['tasks', swarmId],
    queryFn: () => api.taskResults({ swarmId }),
    enabled: !!swarmId,
    refetchInterval: 5000 // Refresh every 5 seconds
  });

  const {
    data: analytics
  } = useQuery({
    queryKey: ['task-analytics', swarmId],
    queryFn: () => api.getTaskAnalytics(swarmId),
    enabled: !!swarmId,
    refetchInterval: 30000 // Refresh every 30 seconds
  });

  const orchestrateMutation = useMutation({
    mutationFn: (tasks: TaskDefinition[]) =>
      api.taskOrchestrate({ swarmId, tasks }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', swarmId] });
      queryClient.invalidateQueries({ queryKey: ['swarm', swarmId] });
    }
  });

  const cancelMutation = useMutation({
    mutationFn: (taskId: string) => api.taskCancel(taskId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', swarmId] });
    }
  });

  const retryMutation = useMutation({
    mutationFn: (taskId: string) => api.taskRetry(taskId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', swarmId] });
    }
  });

  const orchestrate = useCallback(async (tasks: TaskDefinition[]) => {
    return await orchestrateMutation.mutateAsync(tasks);
  }, [orchestrateMutation]);

  const cancel = useCallback(async (taskId: string) => {
    await cancelMutation.mutateAsync(taskId);
  }, [cancelMutation]);

  const retry = useCallback(async (taskId: string) => {
    await retryMutation.mutateAsync(taskId);
  }, [retryMutation]);

  return {
    tasks: results?.tasks || [],
    isLoading,
    error: error as Error | null,
    summary: results?.summary,
    orchestrate,
    cancel,
    retry,
    analytics: analytics || null
  };
}

// Realtime Hook
export function useRealtime(config: UseRealtimeConfig = {}): UseRealtimeReturn {
  const [isConnecting, setIsConnecting] = useState(false);
  const [events, setEvents] = useState<MCPWebSocketEvent[]>([]);
  const [metrics, setMetrics] = useState<RealtimeMetrics>({
    eventsReceived: 0,
    eventsProcessed: 0,
    averageLatency: 0,
    connectionUptime: 0,
    errorCount: 0,
    reconnectCount: 0
  });
  const [liveProgress, setLiveProgress] = useState<LiveProgress[]>([]);
  const [agentActivities, setAgentActivities] = useState<AgentActivity[]>([]);

  const realtimeManagerRef = useRef<MCPRealtimeManager | null>(null);
  const eventHandlersRef = useRef<Map<MCPEventType, Set<Function>>>(new Map());

  // Initialize realtime manager
  useEffect(() => {
    try {
      realtimeManagerRef.current = getDefaultRealtimeManager();
    } catch {
      // No default manager set
      realtimeManagerRef.current = null;
    }
  }, []);

  const isConnected = realtimeManagerRef.current?.isRealtimeConnected() || false;

  const connect = useCallback(async () => {
    if (!realtimeManagerRef.current) {
      throw new Error('Realtime manager not initialized');
    }

    if (isConnecting || isConnected) return;

    setIsConnecting(true);
    try {
      await realtimeManagerRef.current.connect();
      
      // Setup event listeners
      const manager = realtimeManagerRef.current;
      
      // General event handler
      const handleEvent = (event: MCPWebSocketEvent) => {
        setEvents(prev => [...prev.slice(-99), event]); // Keep last 100 events
        
        // Update specific state based on event type
        switch (event.type) {
          case 'progress_update':
            setLiveProgress(prev => {
              const existing = prev.find(p => p.swarmId === event.data.swarmId);
              if (existing) {
                return prev.map(p => p.swarmId === event.data.swarmId ? event.data : p);
              } else {
                return [...prev, event.data];
              }
            });
            break;
          case 'agent_status_update':
            setAgentActivities(prev => {
              const existing = prev.find(a => a.agentId === event.data.agentId);
              if (existing) {
                return prev.map(a => a.agentId === event.data.agentId ? {
                  ...existing,
                  status: event.data.status,
                  lastUpdate: event.data.timestamp
                } : a);
              } else {
                return [...prev, {
                  agentId: event.data.agentId,
                  swarmId: event.data.swarmId,
                  status: event.data.status,
                  performance: { efficiency: 0, utilization: 0 },
                  lastUpdate: event.data.timestamp
                }];
              }
            });
            break;
        }

        // Call custom event handler
        if (config.onEvent) {
          config.onEvent(event);
        }
      };

      manager.on('event' as MCPEventType, handleEvent);

      // Metrics handler
      const handleMetrics = (metricsData: RealtimeMetrics) => {
        setMetrics(metricsData);
      };

      manager.on('metrics_snapshot' as MCPEventType, handleMetrics);

      // Error handler
      const handleError = (error: Error) => {
        if (config.onError) {
          config.onError(error);
        }
      };

      manager.on('realtime_error' as MCPEventType, handleError);

    } catch (error) {
      if (config.onError) {
        config.onError(error as Error);
      }
      throw error;
    } finally {
      setIsConnecting(false);
    }
  }, [isConnecting, isConnected, config.onEvent, config.onError]);

  const disconnect = useCallback(async () => {
    if (realtimeManagerRef.current) {
      await realtimeManagerRef.current.disconnect();
    }
  }, []);

  const on = useCallback((eventType: MCPEventType, handler: (event: MCPWebSocketEvent) => void) => {
    if (!eventHandlersRef.current.has(eventType)) {
      eventHandlersRef.current.set(eventType, new Set());
    }
    eventHandlersRef.current.get(eventType)!.add(handler);

    if (realtimeManagerRef.current) {
      realtimeManagerRef.current.on(eventType, handler);
    }
  }, []);

  const off = useCallback((eventType: MCPEventType, handler: (event: MCPWebSocketEvent) => void) => {
    const handlers = eventHandlersRef.current.get(eventType);
    if (handlers) {
      handlers.delete(handler);
    }

    if (realtimeManagerRef.current) {
      realtimeManagerRef.current.off(eventType, handler);
    }
  }, []);

  const clearEvents = useCallback(() => {
    setEvents([]);
  }, []);

  // Auto-connect
  useEffect(() => {
    if (config.autoConnect && realtimeManagerRef.current && !isConnected && !isConnecting) {
      connect().catch(console.error);
    }
  }, [config.autoConnect, isConnected, isConnecting, connect]);

  return {
    isConnected,
    isConnecting,
    events,
    metrics,
    liveProgress,
    agentActivities,
    connect,
    disconnect,
    on,
    off,
    clearEvents
  };
}

// Memory Management Hook
export function useMemory(target: { swarmId?: string; agentId?: string }): UseMemoryReturn {
  const queryClient = useQueryClient();
  const { api } = useMCP();

  const {
    data: usage,
    isLoading,
    error,
    refetch: refresh
  } = useQuery({
    queryKey: ['memory', target.swarmId, target.agentId],
    queryFn: () => api.memoryUsage(target),
    enabled: !!(target.swarmId || target.agentId),
    refetchInterval: 30000 // Refresh every 30 seconds
  });

  const optimizeMutation = useMutation({
    mutationFn: () => api.memoryOptimize(target),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['memory', target.swarmId, target.agentId] });
    }
  });

  const exportMutation = useMutation({
    mutationFn: () => api.memoryExport(target)
  });

  const importMutation = useMutation({
    mutationFn: (data: any) => api.memoryImport(target, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['memory', target.swarmId, target.agentId] });
    }
  });

  const optimize = useCallback(async () => {
    await optimizeMutation.mutateAsync();
  }, [optimizeMutation]);

  const exportMemory = useCallback(async () => {
    return await exportMutation.mutateAsync();
  }, [exportMutation]);

  const importMemory = useCallback(async (data: any) => {
    await importMutation.mutateAsync(data);
  }, [importMutation]);

  return {
    usage: usage || null,
    isLoading,
    error: error as Error | null,
    optimize,
    export: exportMemory,
    import: importMemory,
    refresh
  };
}

// Swarm Creation Hook
export function useSwarmCreation() {
  const queryClient = useQueryClient();
  const { api } = useMCP();

  const createMutation = useMutation({
    mutationFn: ({ config, options }: { 
      config: Partial<SwarmConfig>; 
      options?: any 
    }) => api.swarmInit(config, options),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['swarms'] });
    }
  });

  const create = useCallback(async (
    config: Partial<SwarmConfig>, 
    options?: any
  ): Promise<SwarmInitResponse> => {
    return await createMutation.mutateAsync({ config, options });
  }, [createMutation]);

  return {
    create,
    isCreating: createMutation.isPending,
    error: createMutation.error
  };
}

// Agent Spawning Hook
export function useAgentSpawning(swarmId: string) {
  const queryClient = useQueryClient();
  const { api } = useMCP();

  const spawnMutation = useMutation({
    mutationFn: (config: AgentConfig) => 
      api.agentSpawn({ swarmId, config, autoAssign: true }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['swarm', swarmId] });
    }
  });

  const spawn = useCallback(async (config: AgentConfig): Promise<AgentSpawnResponse> => {
    return await spawnMutation.mutateAsync(config);
  }, [spawnMutation]);

  return {
    spawn,
    isSpawning: spawnMutation.isPending,
    error: spawnMutation.error
  };
}

// Custom hook for handling MCP errors with retry logic
export function useMCPErrorHandler() {
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 3;

  const handleError = useCallback(async (
    error: MCPError,
    retryFn: () => Promise<any>
  ): Promise<any> => {
    console.error('MCP Error:', error);

    if (error.retryable && retryCount < maxRetries) {
      setRetryCount(prev => prev + 1);
      
      // Exponential backoff
      const delay = Math.pow(2, retryCount) * 1000;
      await new Promise(resolve => setTimeout(resolve, delay));
      
      try {
        const result = await retryFn();
        setRetryCount(0); // Reset on success
        return result;
      } catch (retryError) {
        return handleError(retryError as MCPError, retryFn);
      }
    }

    throw error;
  }, [retryCount, maxRetries]);

  const reset = useCallback(() => {
    setRetryCount(0);
  }, []);

  return { handleError, retryCount, maxRetries, reset };
}

// Utility hook for MCP event filtering
export function useMCPEventFilter(filters: EventFilter[]) {
  const { events } = useRealtime();

  const filteredEvents = useMemo(() => {
    if (filters.length === 0) return events;

    return events.filter(event => {
      return filters.some(filter => {
        // Type filter
        if (filter.type) {
          const types = Array.isArray(filter.type) ? filter.type : [filter.type];
          if (!types.includes(event.type)) return false;
        }

        // Swarm ID filter
        if (filter.swarmId && event.data.swarmId !== filter.swarmId) {
          return false;
        }

        // Agent ID filter
        if (filter.agentId && event.data.agentId !== filter.agentId) {
          return false;
        }

        // Task ID filter
        if (filter.taskId && event.data.taskId !== filter.taskId) {
          return false;
        }

        // Custom filter
        if (filter.customFilter && !filter.customFilter(event)) {
          return false;
        }

        return true;
      });
    });
  }, [events, filters]);

  return filteredEvents;
}

// Convenience hooks with common configurations
export const useMCPDefaults = () => useMCP({ autoConnect: true, enableRealtime: true });
export const useRealtimeDefaults = () => useRealtime({ autoConnect: true });

// Export utility functions
export { EventFilters, mcpApi };