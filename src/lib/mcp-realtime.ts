// MCP Real-time Integration
// WebSocket management, event streaming, and live updates for Claude Flow

import {
  MCPWebSocketEvent,
  MCPEventType,
  SwarmStatusChangedEvent,
  AgentStatusChangedEvent,
  TaskEvent,
  ErrorEvent,
  MetricsUpdatedEvent,
  PerformanceAlertEvent,
  SwarmState,
  AgentState,
  TaskExecution,
  RealTimeMetrics
} from '../types/mcp';

export interface RealtimeConfig {
  reconnectInterval: number;
  heartbeatInterval: number;
  maxReconnectAttempts: number;
  eventBufferSize: number;
  enableMetricsStreaming: boolean;
  enableProgressStreaming: boolean;
  enableErrorStreaming: boolean;
  customEventHandlers: Map<MCPEventType, EventHandler[]>;
}

export type EventHandler = (event: MCPWebSocketEvent) => void | Promise<void>;

export interface RealtimeMetrics {
  eventsReceived: number;
  eventsProcessed: number;
  averageLatency: number;
  connectionUptime: number;
  lastEventTimestamp?: number;
  errorCount: number;
  reconnectCount: number;
}

export interface EventStream {
  id: string;
  filters: EventFilter[];
  buffer: MCPWebSocketEvent[];
  maxBufferSize: number;
  active: boolean;
  onEvent?: EventHandler;
  onError?: (error: Error) => void;
}

export interface EventFilter {
  type?: MCPEventType | MCPEventType[];
  swarmId?: string;
  agentId?: string;
  taskId?: string;
  severity?: string[];
  customFilter?: (event: MCPWebSocketEvent) => boolean;
}

export interface LiveProgress {
  swarmId: string;
  totalTasks: number;
  completedTasks: number;
  failedTasks: number;
  runningTasks: number;
  progress: number; // 0-1
  estimatedCompletion?: number;
  throughput: number; // tasks per minute
  lastUpdate: number;
}

export interface AgentActivity {
  agentId: string;
  swarmId: string;
  status: string;
  currentTask?: string;
  performance: {
    efficiency: number;
    utilization: number;
    lastTaskDuration?: number;
  };
  lastUpdate: number;
}

export class MCPRealtimeManager {
  private config: RealtimeConfig;
  private websocket: WebSocket | null = null;
  private eventStreams: Map<string, EventStream> = new Map();
  private metrics: RealtimeMetrics;
  private reconnectTimer: NodeJS.Timeout | null = null;
  private heartbeatTimer: NodeJS.Timeout | null = null;
  private metricsTimer: NodeJS.Timeout | null = null;
  private isConnected = false;
  private isConnecting = false;
  private reconnectAttempts = 0;
  private serverUrl: string;
  private eventHandlers: Map<MCPEventType, EventHandler[]> = new Map();
  private progressTrackers: Map<string, LiveProgress> = new Map();
  private agentActivities: Map<string, AgentActivity> = new Map();
  private eventBuffer: MCPWebSocketEvent[] = [];

  constructor(serverUrl: string, config?: Partial<RealtimeConfig>) {
    this.serverUrl = serverUrl;
    this.config = this.mergeWithDefaults(config || {});
    this.metrics = this.initializeMetrics();
    this.setupDefaultHandlers();
  }

  private mergeWithDefaults(config: Partial<RealtimeConfig>): RealtimeConfig {
    return {
      reconnectInterval: 5000,
      heartbeatInterval: 30000,
      maxReconnectAttempts: 10,
      eventBufferSize: 1000,
      enableMetricsStreaming: true,
      enableProgressStreaming: true,
      enableErrorStreaming: true,
      customEventHandlers: new Map(),
      ...config
    };
  }

  private initializeMetrics(): RealtimeMetrics {
    return {
      eventsReceived: 0,
      eventsProcessed: 0,
      averageLatency: 0,
      connectionUptime: 0,
      errorCount: 0,
      reconnectCount: 0
    };
  }

  private setupDefaultHandlers(): void {
    // Setup built-in event handlers
    this.on('swarm_status_changed', this.handleSwarmStatusChanged.bind(this));
    this.on('agent_status_changed', this.handleAgentStatusChanged.bind(this));
    this.on('task_started', this.handleTaskEvent.bind(this));
    this.on('task_completed', this.handleTaskEvent.bind(this));
    this.on('task_failed', this.handleTaskEvent.bind(this));
    this.on('metrics_updated', this.handleMetricsUpdated.bind(this));
    this.on('error_occurred', this.handleErrorEvent.bind(this));
    this.on('performance_alert', this.handlePerformanceAlert.bind(this));
  }

  // Connection Management
  public async connect(): Promise<void> {
    if (this.isConnected || this.isConnecting) {
      throw new Error('Already connected or connecting');
    }

    this.isConnecting = true;
    this.reconnectAttempts = 0;

    try {
      await this.establishConnection();
      this.isConnected = true;
      this.isConnecting = false;
      this.startHeartbeat();
      this.startMetricsCollection();
      this.emit('realtime_connected', { timestamp: Date.now() });
    } catch (error) {
      this.isConnecting = false;
      this.handleConnectionError(error);
      throw error;
    }
  }

  private async establishConnection(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        // Convert HTTP URLs to WebSocket URLs
        const wsUrl = this.serverUrl.replace(/^http/, 'ws') + '/realtime';
        this.websocket = new WebSocket(wsUrl);

        this.websocket.onopen = () => {
          console.log('MCP realtime connection established');
          this.setupWebSocketHandlers();
          resolve();
        };

        this.websocket.onerror = (error) => {
          reject(new Error(`WebSocket connection failed: ${error}`));
        };

        this.websocket.onclose = (event) => {
          this.handleDisconnection(event);
        };

      } catch (error) {
        reject(error);
      }
    });
  }

  private setupWebSocketHandlers(): void {
    if (!this.websocket) return;

    this.websocket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        this.handleIncomingMessage(data);
      } catch (error) {
        console.error('Failed to parse WebSocket message:', error);
        this.metrics.errorCount++;
      }
    };

    this.websocket.onpong = () => {
      // Handle pong responses for latency calculation
      const now = Date.now();
      if (this.metrics.lastEventTimestamp) {
        const latency = now - this.metrics.lastEventTimestamp;
        this.updateLatencyMetrics(latency);
      }
    };
  }

  private handleIncomingMessage(data: any): void {
    this.metrics.eventsReceived++;
    this.metrics.lastEventTimestamp = Date.now();

    if (data.type === 'event') {
      this.processEvent(data as MCPWebSocketEvent);
    } else if (data.type === 'metrics') {
      this.processMetricsUpdate(data);
    } else if (data.type === 'heartbeat') {
      this.processHeartbeat(data);
    } else {
      console.warn('Unknown message type:', data.type);
    }
  }

  private processEvent(event: MCPWebSocketEvent): void {
    // Add to event buffer
    this.eventBuffer.push(event);
    if (this.eventBuffer.length > this.config.eventBufferSize) {
      this.eventBuffer.shift(); // Remove oldest event
    }

    // Process through event streams
    this.processEventStreams(event);

    // Handle with registered event handlers
    this.handleEvent(event);

    this.metrics.eventsProcessed++;
  }

  private processEventStreams(event: MCPWebSocketEvent): void {
    for (const stream of this.eventStreams.values()) {
      if (!stream.active) continue;

      if (this.eventMatchesFilters(event, stream.filters)) {
        stream.buffer.push(event);
        
        // Trim buffer if it exceeds max size
        if (stream.buffer.length > stream.maxBufferSize) {
          stream.buffer.shift();
        }

        // Call stream event handler
        if (stream.onEvent) {
          try {
            stream.onEvent(event);
          } catch (error) {
            console.error(`Error in stream ${stream.id} event handler:`, error);
            if (stream.onError) {
              stream.onError(error as Error);
            }
          }
        }
      }
    }
  }

  private eventMatchesFilters(event: MCPWebSocketEvent, filters: EventFilter[]): boolean {
    if (filters.length === 0) return true;

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

      // Severity filter
      if (filter.severity && event.data.severity && 
          !filter.severity.includes(event.data.severity)) {
        return false;
      }

      // Custom filter
      if (filter.customFilter && !filter.customFilter(event)) {
        return false;
      }

      return true;
    });
  }

  private handleEvent(event: MCPWebSocketEvent): void {
    const handlers = this.eventHandlers.get(event.type) || [];
    
    for (const handler of handlers) {
      try {
        const result = handler(event);
        if (result instanceof Promise) {
          result.catch(error => {
            console.error(`Error in async event handler for ${event.type}:`, error);
          });
        }
      } catch (error) {
        console.error(`Error in event handler for ${event.type}:`, error);
      }
    }
  }

  public async disconnect(): Promise<void> {
    this.stopHeartbeat();
    this.stopMetricsCollection();
    this.stopReconnectTimer();

    if (this.websocket) {
      this.websocket.close();
      this.websocket = null;
    }

    this.isConnected = false;
    this.emit('realtime_disconnected', { timestamp: Date.now() });
  }

  private handleDisconnection(event: CloseEvent): void {
    this.isConnected = false;
    this.stopHeartbeat();
    this.stopMetricsCollection();

    console.log(`WebSocket disconnected: ${event.code} - ${event.reason}`);
    this.emit('realtime_disconnected', { 
      code: event.code, 
      reason: event.reason, 
      timestamp: Date.now() 
    });

    // Attempt reconnection if not a clean disconnect
    if (!event.wasClean && this.reconnectAttempts < this.config.maxReconnectAttempts) {
      this.scheduleReconnect();
    }
  }

  private handleConnectionError(error: any): void {
    console.error('MCP realtime connection error:', error);
    this.metrics.errorCount++;
    this.emit('realtime_error', { error, timestamp: Date.now() });
  }

  private scheduleReconnect(): void {
    if (this.reconnectTimer) return;

    this.reconnectAttempts++;
    this.metrics.reconnectCount++;

    const delay = Math.min(
      this.config.reconnectInterval * Math.pow(2, this.reconnectAttempts - 1),
      30000 // Max 30 seconds
    );

    console.log(`Scheduling reconnect attempt ${this.reconnectAttempts} in ${delay}ms`);

    this.reconnectTimer = setTimeout(async () => {
      this.reconnectTimer = null;
      try {
        await this.connect();
      } catch (error) {
        console.error('Reconnect attempt failed:', error);
      }
    }, delay);
  }

  private stopReconnectTimer(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
  }

  private startHeartbeat(): void {
    this.heartbeatTimer = setInterval(() => {
      if (this.websocket && this.websocket.readyState === WebSocket.OPEN) {
        this.websocket.ping();
      }
    }, this.config.heartbeatInterval);
  }

  private stopHeartbeat(): void {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
  }

  private startMetricsCollection(): void {
    if (!this.config.enableMetricsStreaming) return;

    this.metricsTimer = setInterval(() => {
      this.updateConnectionUptime();
      this.emit('metrics_snapshot', this.getMetrics());
    }, 10000); // Every 10 seconds
  }

  private stopMetricsCollection(): void {
    if (this.metricsTimer) {
      clearInterval(this.metricsTimer);
      this.metricsTimer = null;
    }
  }

  private updateConnectionUptime(): void {
    if (this.isConnected) {
      this.metrics.connectionUptime += 10000; // 10 seconds
    }
  }

  private updateLatencyMetrics(latency: number): void {
    // Exponential moving average
    this.metrics.averageLatency = this.metrics.averageLatency === 0 
      ? latency 
      : (this.metrics.averageLatency * 0.9) + (latency * 0.1);
  }

  // Event Handlers
  private handleSwarmStatusChanged(event: MCPWebSocketEvent): void {
    const data = event.data as SwarmStatusChangedEvent;
    console.log(`Swarm ${data.swarmId} status changed: ${data.oldStatus} -> ${data.newStatus}`);
    
    this.emit('swarm_status_update', {
      swarmId: data.swarmId,
      status: data.newStatus,
      previousStatus: data.oldStatus,
      timestamp: data.timestamp
    });
  }

  private handleAgentStatusChanged(event: MCPWebSocketEvent): void {
    const data = event.data as AgentStatusChangedEvent;
    
    // Update agent activity tracking
    this.agentActivities.set(data.agentId, {
      agentId: data.agentId,
      swarmId: data.swarmId,
      status: data.newStatus,
      performance: this.agentActivities.get(data.agentId)?.performance || {
        efficiency: 0,
        utilization: 0
      },
      lastUpdate: data.timestamp
    });

    console.log(`Agent ${data.agentId} status changed: ${data.oldStatus} -> ${data.newStatus}`);
    
    this.emit('agent_status_update', {
      agentId: data.agentId,
      swarmId: data.swarmId,
      status: data.newStatus,
      previousStatus: data.oldStatus,
      timestamp: data.timestamp
    });
  }

  private handleTaskEvent(event: MCPWebSocketEvent): void {
    const data = event.data as TaskEvent;
    
    // Update progress tracking
    if (data.swarmId) {
      this.updateProgressTracking(data.swarmId, event.type, data);
    }

    console.log(`Task ${data.taskId} ${event.type}: ${data.status}`);
    
    this.emit('task_update', {
      taskId: data.taskId,
      swarmId: data.swarmId,
      agentId: data.agentId,
      status: data.status,
      progress: data.progress,
      result: data.result,
      error: data.error,
      eventType: event.type,
      timestamp: data.timestamp
    });
  }

  private handleMetricsUpdated(event: MCPWebSocketEvent): void {
    const data = event.data as MetricsUpdatedEvent;
    
    if (data.agentId) {
      // Update agent activity with performance metrics
      const activity = this.agentActivities.get(data.agentId);
      if (activity) {
        activity.performance = {
          efficiency: data.metrics.throughput / 60, // Convert to tasks per minute
          utilization: Math.min(data.metrics.activeAgents / 10, 1), // Assuming max 10 agents
        };
        activity.lastUpdate = data.timestamp;
      }
    }

    this.emit('metrics_update', {
      swarmId: data.swarmId,
      agentId: data.agentId,
      metrics: data.metrics,
      timestamp: data.timestamp
    });
  }

  private handleErrorEvent(event: MCPWebSocketEvent): void {
    const data = event.data as ErrorEvent;
    console.error(`MCP Error [${data.severity}]: ${data.message}`, data.details);
    
    this.metrics.errorCount++;
    
    this.emit('error_event', {
      id: data.id,
      type: data.type,
      message: data.message,
      severity: data.severity,
      component: data.component,
      details: data.details,
      timestamp: data.timestamp
    });
  }

  private handlePerformanceAlert(event: MCPWebSocketEvent): void {
    const data = event.data as PerformanceAlertEvent;
    console.warn(`Performance Alert [${data.severity}]: ${data.message}`);
    
    this.emit('performance_alert', {
      alertId: data.alertId,
      type: data.type,
      message: data.message,
      severity: data.severity,
      component: data.component,
      metric: data.metric,
      value: data.value,
      threshold: data.threshold,
      timestamp: data.timestamp
    });
  }

  private updateProgressTracking(swarmId: string, eventType: string, data: TaskEvent): void {
    let progress = this.progressTrackers.get(swarmId);
    
    if (!progress) {
      progress = {
        swarmId,
        totalTasks: 0,
        completedTasks: 0,
        failedTasks: 0,
        runningTasks: 0,
        progress: 0,
        throughput: 0,
        lastUpdate: Date.now()
      };
      this.progressTrackers.set(swarmId, progress);
    }

    switch (eventType) {
      case 'task_started':
        progress.runningTasks++;
        progress.totalTasks++;
        break;
      case 'task_completed':
        progress.runningTasks--;
        progress.completedTasks++;
        break;
      case 'task_failed':
        progress.runningTasks--;
        progress.failedTasks++;
        break;
    }

    // Calculate overall progress
    const finishedTasks = progress.completedTasks + progress.failedTasks;
    progress.progress = progress.totalTasks > 0 ? finishedTasks / progress.totalTasks : 0;

    // Calculate throughput (tasks completed per minute)
    const timeDiff = (Date.now() - progress.lastUpdate) / 1000 / 60; // minutes
    if (timeDiff > 0) {
      progress.throughput = progress.completedTasks / timeDiff;
    }

    progress.lastUpdate = Date.now();

    this.emit('progress_update', { ...progress });
  }

  // Public API
  public on(eventType: MCPEventType | string, handler: EventHandler): void {
    if (!this.eventHandlers.has(eventType as MCPEventType)) {
      this.eventHandlers.set(eventType as MCPEventType, []);
    }
    this.eventHandlers.get(eventType as MCPEventType)!.push(handler);
  }

  public off(eventType: MCPEventType | string, handler: EventHandler): void {
    const handlers = this.eventHandlers.get(eventType as MCPEventType);
    if (handlers) {
      const index = handlers.indexOf(handler);
      if (index !== -1) {
        handlers.splice(index, 1);
      }
    }
  }

  private emit(eventType: string, data: any): void {
    const event: MCPWebSocketEvent = {
      type: eventType as MCPEventType,
      timestamp: Date.now(),
      source: 'realtime_manager',
      data
    };

    this.handleEvent(event);
  }

  public createEventStream(id: string, filters: EventFilter[], options?: {
    maxBufferSize?: number;
    onEvent?: EventHandler;
    onError?: (error: Error) => void;
  }): EventStream {
    const stream: EventStream = {
      id,
      filters,
      buffer: [],
      maxBufferSize: options?.maxBufferSize || 100,
      active: true,
      onEvent: options?.onEvent,
      onError: options?.onError
    };

    this.eventStreams.set(id, stream);
    return stream;
  }

  public getEventStream(id: string): EventStream | undefined {
    return this.eventStreams.get(id);
  }

  public removeEventStream(id: string): boolean {
    return this.eventStreams.delete(id);
  }

  public getEventHistory(filters?: EventFilter[], limit?: number): MCPWebSocketEvent[] {
    let events = [...this.eventBuffer];

    if (filters && filters.length > 0) {
      events = events.filter(event => this.eventMatchesFilters(event, filters));
    }

    if (limit) {
      events = events.slice(-limit);
    }

    return events;
  }

  public getLiveProgress(swarmId?: string): LiveProgress[] {
    if (swarmId) {
      const progress = this.progressTrackers.get(swarmId);
      return progress ? [progress] : [];
    }
    return Array.from(this.progressTrackers.values());
  }

  public getAgentActivities(swarmId?: string): AgentActivity[] {
    let activities = Array.from(this.agentActivities.values());
    
    if (swarmId) {
      activities = activities.filter(activity => activity.swarmId === swarmId);
    }

    return activities;
  }

  public getMetrics(): RealtimeMetrics {
    return { ...this.metrics };
  }

  public isRealtimeConnected(): boolean {
    return this.isConnected;
  }

  public getConnectionStatus(): {
    connected: boolean;
    connecting: boolean;
    reconnectAttempts: number;
    uptime: number;
  } {
    return {
      connected: this.isConnected,
      connecting: this.isConnecting,
      reconnectAttempts: this.reconnectAttempts,
      uptime: this.metrics.connectionUptime
    };
  }

  private processMetricsUpdate(data: any): void {
    // Handle streaming metrics updates
    this.emit('streaming_metrics', data);
  }

  private processHeartbeat(data: any): void {
    // Handle heartbeat for connection health
    this.metrics.lastEventTimestamp = Date.now();
  }
}

// Utility functions for creating common event filters
export const EventFilters = {
  swarmEvents: (swarmId: string): EventFilter => ({
    swarmId,
    type: ['swarm_status_changed', 'agent_spawned', 'agent_terminated', 'scaling_event']
  }),

  agentEvents: (agentId: string): EventFilter => ({
    agentId,
    type: ['agent_status_changed', 'task_started', 'task_completed', 'task_failed']
  }),

  taskEvents: (taskId: string): EventFilter => ({
    taskId,
    type: ['task_started', 'task_completed', 'task_failed']
  }),

  errorEvents: (severity?: string[]): EventFilter => ({
    type: ['error_occurred'],
    severity: severity || ['medium', 'high', 'critical']
  }),

  performanceEvents: (): EventFilter => ({
    type: ['metrics_updated', 'performance_alert', 'topology_changed']
  }),

  customFilter: (filterFn: (event: MCPWebSocketEvent) => boolean): EventFilter => ({
    customFilter: filterFn
  })
};

// Default realtime manager instance
let defaultRealtimeManager: MCPRealtimeManager | null = null;

export function createRealtimeManager(serverUrl: string, config?: Partial<RealtimeConfig>): MCPRealtimeManager {
  return new MCPRealtimeManager(serverUrl, config);
}

export function getDefaultRealtimeManager(): MCPRealtimeManager {
  if (!defaultRealtimeManager) {
    throw new Error('Default realtime manager not initialized. Call setDefaultRealtimeManager first.');
  }
  return defaultRealtimeManager;
}

export function setDefaultRealtimeManager(manager: MCPRealtimeManager): void {
  defaultRealtimeManager = manager;
}

export default MCPRealtimeManager;