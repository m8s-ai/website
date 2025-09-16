// MCP (Model Context Protocol) Client Service
// Core service for connecting to and managing Claude Flow MCP server

import {
  MCPConfig,
  MCPClientState,
  MCPConnectionInfo,
  MCPError,
  MCPErrorCode,
  MCPWebSocketEvent,
  SwarmInitParams,
  SwarmInitResponse,
  AgentSpawnParams,
  AgentSpawnResponse,
  TaskOrchestrationParams,
  TaskOrchestrationResponse,
  SwarmStatusParams,
  SwarmStatusResponse,
  AgentMetricsParams,
  AgentMetricsResponse,
  MemoryUsageParams,
  MemoryUsageResponse,
  TaskResultsParams,
  TaskResultsResponse,
  SwarmState
} from '../types/mcp';

export class MCPClient {
  private config: MCPConfig;
  private state: MCPClientState;
  private connection: MCPConnectionInfo;
  private websocket: WebSocket | null = null;
  private reconnectTimer: NodeJS.Timeout | null = null;
  private heartbeatTimer: NodeJS.Timeout | null = null;
  private operationQueue: OperationQueue = new OperationQueue();
  private eventListeners: Map<string, Set<Function>> = new Map();

  constructor(config: Partial<MCPConfig>) {
    this.config = this.mergeWithDefaults(config);
    this.state = this.initializeState();
    this.connection = this.initializeConnection();
  }

  private mergeWithDefaults(config: Partial<MCPConfig>): MCPConfig {
    return {
      serverUrl: config.serverUrl || 'ws://localhost:8080/mcp',
      maxRetries: config.maxRetries || 3,
      retryDelay: config.retryDelay || 1000,
      timeout: config.timeout || 30000,
      enableWebSocket: config.enableWebSocket !== false,
      features: {
        autoTopologySelection: true,
        parallelExecution: true,
        neuralTraining: true,
        bottleneckAnalysis: true,
        smartAutoSpawning: true,
        selfHealingWorkflows: true,
        crossSessionMemory: true,
        githubIntegration: true,
        ...config.features
      },
      performance: {
        maxAgents: 10,
        defaultTopology: 'hierarchical',
        executionStrategy: 'parallel',
        tokenOptimization: true,
        cacheEnabled: true,
        telemetryLevel: 'detailed',
        ...config.performance
      }
    };
  }

  private initializeState(): MCPClientState {
    return {
      connected: false,
      connecting: false,
      authenticated: false,
      config: this.config,
      swarms: {},
      errors: [],
      lastActivity: Date.now(),
      version: '1.0.0',
      capabilities: [
        'swarm_management',
        'agent_orchestration',
        'task_coordination',
        'real_time_monitoring',
        'memory_management',
        'performance_analytics'
      ]
    };
  }

  private initializeConnection(): MCPConnectionInfo {
    const url = new URL(this.config.serverUrl);
    return {
      url: this.config.serverUrl,
      protocol: url.protocol.includes('ws') ? 'ws' : 'http',
      status: 'disconnected',
      reconnectAttempts: 0
    };
  }

  // Connection Management
  public async connect(): Promise<void> {
    if (this.state.connected || this.state.connecting) {
      throw new MCPError({
        code: 'CONNECTION_ERROR',
        message: 'Already connected or connecting',
        timestamp: Date.now(),
        retryable: false,
        component: 'MCPClient'
      });
    }

    this.state.connecting = true;
    this.connection.status = 'connecting';

    try {
      if (this.config.enableWebSocket) {
        await this.connectWebSocket();
      } else {
        await this.connectHTTP();
      }

      this.state.connected = true;
      this.state.connecting = false;
      this.connection.status = 'connected';
      this.connection.reconnectAttempts = 0;
      this.startHeartbeat();
      
      this.emit('connected', { timestamp: Date.now() });
    } catch (error) {
      this.state.connecting = false;
      this.connection.status = 'error';
      this.handleConnectionError(error);
      throw error;
    }
  }

  private async connectWebSocket(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.websocket = new WebSocket(this.config.serverUrl);
        
        this.websocket.onopen = () => {
          this.setupWebSocketHandlers();
          resolve();
        };

        this.websocket.onerror = (error) => {
          reject(new MCPError({
            code: 'CONNECTION_ERROR',
            message: 'WebSocket connection failed',
            details: error,
            timestamp: Date.now(),
            retryable: true,
            component: 'WebSocket'
          }));
        };

        this.websocket.onclose = () => {
          this.handleDisconnection();
        };

      } catch (error) {
        reject(new MCPError({
          code: 'CONNECTION_ERROR',
          message: 'Failed to create WebSocket connection',
          details: error,
          timestamp: Date.now(),
          retryable: true,
          component: 'WebSocket'
        }));
      }
    });
  }

  private async connectHTTP(): Promise<void> {
    try {
      const response = await fetch(`${this.config.serverUrl}/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'MCP-Client/1.0.0'
        },
        signal: AbortSignal.timeout(this.config.timeout)
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const health = await response.json();
      this.state.version = health.version || '1.0.0';
      
    } catch (error) {
      throw new MCPError({
        code: 'CONNECTION_ERROR',
        message: 'HTTP connection failed',
        details: error,
        timestamp: Date.now(),
        retryable: true,
        component: 'HTTP'
      });
    }
  }

  private setupWebSocketHandlers(): void {
    if (!this.websocket) return;

    this.websocket.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        this.handleWebSocketMessage(message);
      } catch (error) {
        this.addError({
          code: 'NETWORK_ERROR',
          message: 'Failed to parse WebSocket message',
          details: { event: event.data, error },
          timestamp: Date.now(),
          retryable: false,
          component: 'WebSocket'
        });
      }
    };

    this.websocket.onpong = () => {
      this.connection.lastPing = Date.now();
      this.updateConnectionLatency();
    };
  }

  private handleWebSocketMessage(message: any): void {
    this.state.lastActivity = Date.now();

    if (message.type === 'event') {
      this.handleEvent(message.data as MCPWebSocketEvent);
    } else if (message.type === 'response') {
      this.operationQueue.resolveOperation(message.id, message.data);
    } else if (message.type === 'error') {
      this.operationQueue.rejectOperation(message.id, message.error);
    } else if (message.type === 'pong') {
      this.connection.lastPing = Date.now();
    }
  }

  private handleEvent(event: MCPWebSocketEvent): void {
    // Update internal state based on event
    switch (event.type) {
      case 'swarm_status_changed':
        this.updateSwarmState(event.data);
        break;
      case 'agent_status_changed':
        this.updateAgentState(event.data);
        break;
      case 'task_completed':
      case 'task_failed':
        this.updateTaskState(event.data);
        break;
    }

    // Emit event to listeners
    this.emit(event.type, event.data);
    this.emit('event', event);
  }

  private updateSwarmState(data: any): void {
    if (data.swarmId && this.state.swarms[data.swarmId]) {
      this.state.swarms[data.swarmId] = {
        ...this.state.swarms[data.swarmId],
        status: data.newStatus,
        lastUpdated: Date.now()
      };
    }
  }

  private updateAgentState(data: any): void {
    const swarm = this.state.swarms[data.swarmId];
    if (swarm) {
      const agentIndex = swarm.agents.findIndex(a => a.id === data.agentId);
      if (agentIndex !== -1) {
        swarm.agents[agentIndex].status = data.newStatus;
        swarm.agents[agentIndex].lastActivity = Date.now();
      }
    }
  }

  private updateTaskState(data: any): void {
    const swarm = this.state.swarms[data.swarmId];
    if (swarm) {
      const taskIndex = swarm.activeTasks.findIndex(t => t.id === data.taskId);
      if (taskIndex !== -1) {
        swarm.activeTasks[taskIndex] = {
          ...swarm.activeTasks[taskIndex],
          status: data.status,
          result: data.result,
          actualCompletion: data.timestamp
        };
      }
    }
  }

  public async disconnect(): Promise<void> {
    this.stopHeartbeat();
    this.stopReconnectTimer();

    if (this.websocket) {
      this.websocket.close();
      this.websocket = null;
    }

    this.state.connected = false;
    this.state.connecting = false;
    this.connection.status = 'disconnected';
    
    this.emit('disconnected', { timestamp: Date.now() });
  }

  private handleDisconnection(): void {
    this.state.connected = false;
    this.connection.status = 'disconnected';
    this.stopHeartbeat();

    this.emit('disconnected', { timestamp: Date.now() });

    if (this.connection.reconnectAttempts < this.config.maxRetries) {
      this.scheduleReconnect();
    }
  }

  private handleConnectionError(error: any): void {
    const mcpError = error instanceof MCPError ? error : new MCPError({
      code: 'CONNECTION_ERROR',
      message: 'Connection failed',
      details: error,
      timestamp: Date.now(),
      retryable: true,
      component: 'MCPClient'
    });

    this.addError(mcpError);
    this.emit('error', mcpError);
  }

  private scheduleReconnect(): void {
    if (this.reconnectTimer) return;

    const delay = this.config.retryDelay * Math.pow(2, this.connection.reconnectAttempts);
    this.connection.reconnectAttempts++;

    this.reconnectTimer = setTimeout(async () => {
      this.reconnectTimer = null;
      try {
        await this.connect();
      } catch (error) {
        // Error is already handled in connect()
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
    if (!this.config.enableWebSocket) return;

    this.heartbeatTimer = setInterval(() => {
      if (this.websocket && this.websocket.readyState === WebSocket.OPEN) {
        this.websocket.ping();
      }
    }, 30000); // 30 seconds
  }

  private stopHeartbeat(): void {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
  }

  private updateConnectionLatency(): void {
    if (this.connection.lastPing) {
      this.connection.latency = Date.now() - this.connection.lastPing;
    }
  }

  // Core MCP Tool Wrappers
  public async swarmInit(params: SwarmInitParams): Promise<SwarmInitResponse> {
    const response = await this.executeOperation('swarm_init', params);
    
    // Update local state
    if (response.swarmId) {
      this.state.swarms[response.swarmId] = {
        id: response.swarmId,
        status: response.status,
        config: params.config,
        agents: response.agents,
        activeTasks: [],
        performance: this.createEmptyPerformance(),
        topology: this.createEmptyTopology(),
        health: this.createEmptyHealth(),
        createdAt: Date.now(),
        lastUpdated: Date.now()
      };
    }

    return response;
  }

  public async agentSpawn(params: AgentSpawnParams): Promise<AgentSpawnResponse> {
    const response = await this.executeOperation('agent_spawn', params);
    
    // Update local state
    const swarm = this.state.swarms[params.swarmId];
    if (swarm && response.agentId) {
      const agentState = {
        id: response.agentId,
        status: response.status,
        config: params.config,
        performance: this.createEmptyAgentPerformance(),
        memory: this.createEmptyMemory(),
        lastActivity: Date.now(),
        createdAt: Date.now()
      };
      swarm.agents.push(agentState);
    }

    return response;
  }

  public async taskOrchestrate(params: TaskOrchestrationParams): Promise<TaskOrchestrationResponse> {
    const response = await this.executeOperation('task_orchestrate', params);
    
    // Update local state
    const swarm = this.state.swarms[params.swarmId];
    if (swarm) {
      swarm.activeTasks.push(...response.scheduledTasks);
    }

    return response;
  }

  public async swarmStatus(params: SwarmStatusParams): Promise<SwarmStatusResponse> {
    const response = await this.executeOperation('swarm_status', params);
    
    // Update local state
    if (response.swarm) {
      this.state.swarms[params.swarmId] = {
        ...this.state.swarms[params.swarmId],
        ...response.swarm,
        lastUpdated: Date.now()
      };
    }

    return response;
  }

  public async agentMetrics(params: AgentMetricsParams): Promise<AgentMetricsResponse> {
    return await this.executeOperation('agent_metrics', params);
  }

  public async memoryUsage(params: MemoryUsageParams): Promise<MemoryUsageResponse> {
    return await this.executeOperation('memory_usage', params);
  }

  public async taskResults(params: TaskResultsParams): Promise<TaskResultsResponse> {
    return await this.executeOperation('task_results', params);
  }

  // Operation Execution
  private async executeOperation<T>(operation: string, params: any): Promise<T> {
    if (!this.state.connected) {
      throw new MCPError({
        code: 'CONNECTION_ERROR',
        message: 'Not connected to MCP server',
        timestamp: Date.now(),
        retryable: true,
        component: 'MCPClient'
      });
    }

    if (this.config.enableWebSocket && this.websocket) {
      return await this.executeWebSocketOperation(operation, params);
    } else {
      return await this.executeHTTPOperation(operation, params);
    }
  }

  private async executeWebSocketOperation<T>(operation: string, params: any): Promise<T> {
    if (!this.websocket || this.websocket.readyState !== WebSocket.OPEN) {
      throw new MCPError({
        code: 'CONNECTION_ERROR',
        message: 'WebSocket not available',
        timestamp: Date.now(),
        retryable: true,
        component: 'WebSocket'
      });
    }

    const operationId = this.generateOperationId();
    const message = {
      id: operationId,
      type: 'request',
      operation,
      params,
      timestamp: Date.now()
    };

    return new Promise((resolve, reject) => {
      // Set up operation timeout
      const timeout = setTimeout(() => {
        this.operationQueue.rejectOperation(operationId, new MCPError({
          code: 'TIMEOUT_ERROR',
          message: `Operation ${operation} timed out`,
          timestamp: Date.now(),
          retryable: true,
          component: 'MCPClient'
        }));
      }, this.config.timeout);

      // Queue the operation
      this.operationQueue.addOperation(operationId, resolve, reject, timeout);

      // Send the message
      this.websocket!.send(JSON.stringify(message));
    });
  }

  private async executeHTTPOperation<T>(operation: string, params: any): Promise<T> {
    const url = `${this.config.serverUrl}/operations/${operation}`;
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'MCP-Client/1.0.0'
        },
        body: JSON.stringify(params),
        signal: AbortSignal.timeout(this.config.timeout)
      });

      if (!response.ok) {
        throw new MCPError({
          code: 'NETWORK_ERROR',
          message: `HTTP ${response.status}: ${response.statusText}`,
          timestamp: Date.now(),
          retryable: response.status >= 500,
          component: 'HTTP'
        });
      }

      return await response.json();
    } catch (error) {
      if (error instanceof MCPError) {
        throw error;
      }

      throw new MCPError({
        code: 'NETWORK_ERROR',
        message: 'HTTP request failed',
        details: error,
        timestamp: Date.now(),
        retryable: true,
        component: 'HTTP'
      });
    }
  }

  // Event Management
  public on(event: string, listener: Function): void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, new Set());
    }
    this.eventListeners.get(event)!.add(listener);
  }

  public off(event: string, listener: Function): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.delete(listener);
    }
  }

  private emit(event: string, data: any): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.forEach(listener => {
        try {
          listener(data);
        } catch (error) {
          console.error(`Error in event listener for ${event}:`, error);
        }
      });
    }
  }

  // State Management
  public getState(): MCPClientState {
    return { ...this.state };
  }

  public getConnection(): MCPConnectionInfo {
    return { ...this.connection };
  }

  public getSwarms(): Record<string, SwarmState> {
    return { ...this.state.swarms };
  }

  public getSwarm(swarmId: string): SwarmState | undefined {
    return this.state.swarms[swarmId] ? { ...this.state.swarms[swarmId] } : undefined;
  }

  // Error Management
  private addError(error: MCPError): void {
    this.state.errors.push(error);
    
    // Keep only the last 100 errors
    if (this.state.errors.length > 100) {
      this.state.errors = this.state.errors.slice(-100);
    }
  }

  public getErrors(): MCPError[] {
    return [...this.state.errors];
  }

  public clearErrors(): void {
    this.state.errors = [];
  }

  // Utility Methods
  private generateOperationId(): string {
    return `op_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private createEmptyPerformance() {
    return {
      throughput: 0,
      averageTaskTime: 0,
      successRate: 0,
      resourceUtilization: {
        cpu: 0,
        memory: 0,
        network: 0,
        tokens: 0,
        maxTokens: 1000000
      },
      efficiency: 0,
      cost: {
        totalTokens: 0,
        estimatedCost: 0,
        costPerTask: 0,
        costPerHour: 0
      }
    };
  }

  private createEmptyTopology() {
    return {
      type: this.config.performance.defaultTopology,
      connections: [],
      centralNodes: [],
      leafNodes: [],
      clusters: []
    };
  }

  private createEmptyHealth() {
    return {
      overall: 1.0,
      agents: {},
      connections: {},
      issues: [],
      recommendations: []
    };
  }

  private createEmptyAgentPerformance() {
    return {
      tasksCompleted: 0,
      averageTaskTime: 0,
      successRate: 0,
      errorCount: 0,
      tokensUsed: 0,
      efficiencyScore: 0
    };
  }

  private createEmptyMemory() {
    return {
      shortTerm: [],
      longTerm: [],
      shared: [],
      capacity: 1000,
      used: 0
    };
  }
}

// Operation Queue for managing async operations
class OperationQueue {
  private operations: Map<string, PendingOperation> = new Map();

  addOperation(id: string, resolve: Function, reject: Function, timeout: NodeJS.Timeout): void {
    this.operations.set(id, { resolve, reject, timeout });
  }

  resolveOperation(id: string, result: any): void {
    const operation = this.operations.get(id);
    if (operation) {
      clearTimeout(operation.timeout);
      operation.resolve(result);
      this.operations.delete(id);
    }
  }

  rejectOperation(id: string, error: any): void {
    const operation = this.operations.get(id);
    if (operation) {
      clearTimeout(operation.timeout);
      operation.reject(error);
      this.operations.delete(id);
    }
  }
}

interface PendingOperation {
  resolve: Function;
  reject: Function;
  timeout: NodeJS.Timeout;
}

// Utility function to create MCPError
function MCPError(params: {
  code: MCPErrorCode;
  message: string;
  details?: any;
  timestamp: number;
  retryable: boolean;
  component: string;
}): MCPError {
  return {
    code: params.code,
    message: params.message,
    details: params.details,
    timestamp: params.timestamp,
    retryable: params.retryable,
    component: params.component
  };
}

// Default client instance
let defaultClient: MCPClient | null = null;

export function createMCPClient(config: Partial<MCPConfig>): MCPClient {
  return new MCPClient(config);
}

export function getDefaultMCPClient(): MCPClient {
  if (!defaultClient) {
    defaultClient = new MCPClient({});
  }
  return defaultClient;
}

export function setDefaultMCPClient(client: MCPClient): void {
  defaultClient = client;
}