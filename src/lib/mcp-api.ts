// MCP API Wrapper Functions
// High-level API wrappers for common MCP operations with additional convenience features

import {
  MCPClient,
  getDefaultMCPClient,
  createMCPClient
} from './mcp-client';
import {
  SwarmConfig,
  AgentConfig,
  TaskDefinition,
  SwarmInitParams,
  SwarmInitResponse,
  AgentSpawnParams,
  AgentSpawnResponse,
  TaskOrchestrationParams,
  TaskOrchestrationResponse,
  SwarmStatusResponse,
  AgentMetricsResponse,
  MemoryUsageResponse,
  TaskResultsResponse,
  SwarmTopology,
  ExecutionStrategy,
  AgentStatus,
  TaskStatus,
  SwarmStatus,
  MCPConfig,
  TimeRange,
  MemoryItem
} from '../types/mcp';

export class MCPApi {
  private client: MCPClient;

  constructor(client?: MCPClient) {
    this.client = client || getDefaultMCPClient();
  }

  // Connection Management
  public async connect(config?: Partial<MCPConfig>): Promise<void> {
    if (config) {
      this.client = createMCPClient(config);
    }
    return await this.client.connect();
  }

  public async disconnect(): Promise<void> {
    return await this.client.disconnect();
  }

  public isConnected(): boolean {
    return this.client.getState().connected;
  }

  // Enhanced Swarm Management
  public async swarmInit(config: Partial<SwarmConfig>, options?: SwarmInitOptions): Promise<SwarmInitResponse> {
    const fullConfig = this.buildSwarmConfig(config);
    const params: SwarmInitParams = {
      config: fullConfig,
      autoStart: options?.autoStart ?? true,
      initialTasks: options?.initialTasks
    };

    const response = await this.client.swarmInit(params);

    // Auto-spawn agents if specified
    if (options?.autoSpawnAgents && response.swarmId) {
      await this.spawnInitialAgents(response.swarmId, fullConfig.agents, options.agentSpawnDelay);
    }

    return response;
  }

  private async spawnInitialAgents(
    swarmId: string, 
    agentConfigs: AgentConfig[], 
    delay: number = 1000
  ): Promise<AgentSpawnResponse[]> {
    const responses: AgentSpawnResponse[] = [];
    
    for (const config of agentConfigs) {
      try {
        const response = await this.agentSpawn({
          swarmId,
          config,
          autoAssign: true
        });
        responses.push(response);
        
        // Delay between spawns to avoid overwhelming the system
        if (delay > 0) {
          await this.sleep(delay);
        }
      } catch (error) {
        console.error(`Failed to spawn agent ${config.name}:`, error);
      }
    }

    return responses;
  }

  public async swarmTerminate(swarmId: string, options?: SwarmTerminateOptions): Promise<void> {
    // Gracefully stop all tasks first
    if (options?.gracefulShutdown !== false) {
      await this.stopAllTasks(swarmId, options?.gracePeriod || 30000);
    }

    // Save memory if requested
    if (options?.saveMemory) {
      await this.exportSwarmMemory(swarmId);
    }

    // Terminate the swarm
    return await this.client.executeOperation('swarm_terminate', { 
      swarmId,
      force: options?.force || false
    });
  }

  public async swarmScale(
    swarmId: string, 
    targetAgents: number, 
    options?: SwarmScaleOptions
  ): Promise<{ added: AgentSpawnResponse[], removed: string[] }> {
    const swarm = await this.swarmStatus({ swarmId });
    const currentAgents = swarm.swarm.agents.length;
    
    if (targetAgents === currentAgents) {
      return { added: [], removed: [] };
    }

    if (targetAgents > currentAgents) {
      return await this.scaleUp(swarmId, targetAgents - currentAgents, options);
    } else {
      return await this.scaleDown(swarmId, currentAgents - targetAgents, options);
    }
  }

  private async scaleUp(
    swarmId: string, 
    count: number, 
    options?: SwarmScaleOptions
  ): Promise<{ added: AgentSpawnResponse[], removed: string[] }> {
    const swarm = await this.swarmStatus({ swarmId });
    const template = options?.agentTemplate || this.createDefaultAgentConfig();
    const added: AgentSpawnResponse[] = [];

    for (let i = 0; i < count; i++) {
      const config = {
        ...template,
        id: `${template.id}_${Date.now()}_${i}`,
        name: `${template.name}_${i + 1}`
      };

      try {
        const response = await this.agentSpawn({
          swarmId,
          config,
          autoAssign: true
        });
        added.push(response);
      } catch (error) {
        console.error(`Failed to scale up agent ${i + 1}:`, error);
      }
    }

    return { added, removed: [] };
  }

  private async scaleDown(
    swarmId: string, 
    count: number, 
    options?: SwarmScaleOptions
  ): Promise<{ added: AgentSpawnResponse[], removed: string[] }> {
    const swarm = await this.swarmStatus({ swarmId, includeAgents: true });
    const agents = swarm.swarm.agents;
    
    // Sort agents by utilization (remove least utilized first)
    const sortedAgents = agents
      .filter(a => a.status === 'idle' || a.status === 'active')
      .sort((a, b) => a.performance.efficiencyScore - b.performance.efficiencyScore)
      .slice(0, count);

    const removed: string[] = [];
    
    for (const agent of sortedAgents) {
      try {
        await this.agentTerminate(agent.id, { graceful: options?.graceful !== false });
        removed.push(agent.id);
      } catch (error) {
        console.error(`Failed to terminate agent ${agent.id}:`, error);
      }
    }

    return { added: [], removed };
  }

  // Enhanced Agent Management
  public async agentSpawn(params: AgentSpawnParams): Promise<AgentSpawnResponse> {
    const enhancedConfig = this.enhanceAgentConfig(params.config);
    return await this.client.agentSpawn({
      ...params,
      config: enhancedConfig
    });
  }

  public async agentTerminate(agentId: string, options?: AgentTerminateOptions): Promise<void> {
    if (options?.graceful !== false) {
      // Allow current tasks to complete
      await this.waitForAgentIdle(agentId, options?.gracePeriod || 30000);
    }

    return await this.client.executeOperation('agent_terminate', {
      agentId,
      force: options?.force || false,
      saveMemory: options?.saveMemory !== false
    });
  }

  private async waitForAgentIdle(agentId: string, timeout: number): Promise<void> {
    const startTime = Date.now();
    
    while (Date.now() - startTime < timeout) {
      const metrics = await this.agentMetrics({ agentId });
      const agent = Object.values(metrics.agents)[0];
      
      if (!agent || !agent.lastTaskDuration) {
        break; // Agent is idle
      }
      
      await this.sleep(1000); // Check every second
    }
  }

  public async agentUpdate(agentId: string, updates: Partial<AgentConfig>): Promise<void> {
    return await this.client.executeOperation('agent_update', {
      agentId,
      updates
    });
  }

  public async agentClone(agentId: string, modifications?: Partial<AgentConfig>): Promise<AgentSpawnResponse> {
    const metrics = await this.agentMetrics({ agentId });
    const originalAgent = Object.values(metrics.agents)[0];
    
    if (!originalAgent) {
      throw new Error(`Agent ${agentId} not found`);
    }

    // Get the original agent's config (you'd need to store this or fetch it)
    const swarms = this.client.getSwarms();
    let agentConfig: AgentConfig | undefined;
    
    for (const swarm of Object.values(swarms)) {
      const agent = swarm.agents.find(a => a.id === agentId);
      if (agent) {
        agentConfig = agent.config;
        break;
      }
    }

    if (!agentConfig) {
      throw new Error(`Cannot find config for agent ${agentId}`);
    }

    const clonedConfig: AgentConfig = {
      ...agentConfig,
      id: `${agentConfig.id}_clone_${Date.now()}`,
      name: `${agentConfig.name}_clone`,
      ...modifications
    };

    // Find the swarm this agent belongs to
    const swarmId = Object.keys(swarms).find(id => 
      swarms[id].agents.some(a => a.id === agentId)
    );

    if (!swarmId) {
      throw new Error(`Cannot find swarm for agent ${agentId}`);
    }

    return await this.agentSpawn({
      swarmId,
      config: clonedConfig,
      autoAssign: true
    });
  }

  // Enhanced Task Management
  public async taskOrchestrate(params: TaskOrchestrationParams): Promise<TaskOrchestrationResponse> {
    // Validate task dependencies
    this.validateTaskDependencies(params.tasks);
    
    // Optimize task order based on dependencies and agent capabilities
    const optimizedTasks = await this.optimizeTaskOrder(params.swarmId, params.tasks);
    
    return await this.client.taskOrchestrate({
      ...params,
      tasks: optimizedTasks
    });
  }

  private validateTaskDependencies(tasks: TaskDefinition[]): void {
    const taskIds = new Set(tasks.map(t => t.id));
    
    for (const task of tasks) {
      for (const depId of task.dependencies) {
        if (!taskIds.has(depId)) {
          throw new Error(`Task ${task.id} depends on unknown task ${depId}`);
        }
      }
    }

    // Check for circular dependencies
    this.checkCircularDependencies(tasks);
  }

  private checkCircularDependencies(tasks: TaskDefinition[]): void {
    const visited = new Set<string>();
    const recursionStack = new Set<string>();
    const taskMap = new Map(tasks.map(t => [t.id, t]));

    const hasCycle = (taskId: string): boolean => {
      if (recursionStack.has(taskId)) return true;
      if (visited.has(taskId)) return false;

      visited.add(taskId);
      recursionStack.add(taskId);

      const task = taskMap.get(taskId);
      if (task) {
        for (const depId of task.dependencies) {
          if (hasCycle(depId)) return true;
        }
      }

      recursionStack.delete(taskId);
      return false;
    };

    for (const task of tasks) {
      if (hasCycle(task.id)) {
        throw new Error(`Circular dependency detected involving task ${task.id}`);
      }
    }
  }

  private async optimizeTaskOrder(swarmId: string, tasks: TaskDefinition[]): Promise<TaskDefinition[]> {
    const swarm = await this.swarmStatus({ swarmId, includeAgents: true });
    const agentCapabilities = swarm.swarm.agents.map(a => a.config.capabilities).flat();
    
    // Topological sort with capability-based prioritization
    const sorted: TaskDefinition[] = [];
    const inDegree = new Map<string, number>();
    const graph = new Map<string, string[]>();
    
    // Build dependency graph
    tasks.forEach(task => {
      inDegree.set(task.id, task.dependencies.length);
      task.dependencies.forEach(depId => {
        if (!graph.has(depId)) graph.set(depId, []);
        graph.get(depId)!.push(task.id);
      });
    });

    // Queue for tasks with no dependencies
    const queue = tasks.filter(task => task.dependencies.length === 0);
    
    // Sort by priority and capability match
    queue.sort((a, b) => {
      const aMatch = a.requirements.agentCapabilities.every(cap => agentCapabilities.includes(cap));
      const bMatch = b.requirements.agentCapabilities.every(cap => agentCapabilities.includes(cap));
      
      if (aMatch !== bMatch) return bMatch ? 1 : -1;
      return b.priority - a.priority;
    });

    while (queue.length > 0) {
      const current = queue.shift()!;
      sorted.push(current);

      const dependents = graph.get(current.id) || [];
      dependents.forEach(depId => {
        const newInDegree = inDegree.get(depId)! - 1;
        inDegree.set(depId, newInDegree);
        
        if (newInDegree === 0) {
          const task = tasks.find(t => t.id === depId)!;
          queue.push(task);
          queue.sort((a, b) => b.priority - a.priority);
        }
      });
    }

    return sorted;
  }

  public async taskCancel(taskId: string, reason?: string): Promise<void> {
    return await this.client.executeOperation('task_cancel', {
      taskId,
      reason: reason || 'Cancelled by user'
    });
  }

  public async taskRetry(taskId: string, modifications?: Partial<TaskDefinition>): Promise<TaskOrchestrationResponse> {
    const results = await this.taskResults({ taskId });
    const originalTask = results.tasks[0];
    
    if (!originalTask) {
      throw new Error(`Task ${taskId} not found`);
    }

    // Create a new task based on the original with modifications
    const retryTask: TaskDefinition = {
      ...originalTask.taskId as any, // This would need proper task definition retrieval
      id: `${taskId}_retry_${Date.now()}`,
      ...modifications
    };

    return await this.taskOrchestrate({
      swarmId: '', // Would need to determine from task
      tasks: [retryTask]
    });
  }

  // Monitoring and Analytics
  public async swarmStatus(params: { swarmId: string, includeAgents?: boolean, includeTasks?: boolean, includeMetrics?: boolean, includeHealth?: boolean }): Promise<SwarmStatusResponse> {
    return await this.client.swarmStatus({
      swarmId: params.swarmId,
      includeAgents: params.includeAgents ?? true,
      includeTasks: params.includeTasks ?? true,
      includeMetrics: params.includeMetrics ?? true,
      includeHealth: params.includeHealth ?? true
    });
  }

  public async agentMetrics(params: { agentId?: string, swarmId?: string, timeRange?: TimeRange }): Promise<AgentMetricsResponse> {
    return await this.client.agentMetrics({
      agentId: params.agentId,
      swarmId: params.swarmId,
      timeRange: params.timeRange || this.getDefaultTimeRange(),
      metrics: ['performance', 'utilization', 'errors', 'efficiency']
    });
  }

  public async swarmHealthCheck(swarmId: string): Promise<SwarmHealthReport> {
    const status = await this.swarmStatus({ 
      swarmId, 
      includeHealth: true, 
      includeMetrics: true 
    });

    const health = status.swarm.health;
    const performance = status.swarm.performance;

    return {
      swarmId,
      overallHealth: health.overall,
      status: status.swarm.status,
      issues: health.issues,
      recommendations: health.recommendations,
      performance: {
        throughput: performance.throughput,
        successRate: performance.successRate,
        efficiency: performance.efficiency,
        resourceUtilization: performance.resourceUtilization
      },
      agents: {
        total: status.swarm.agents.length,
        active: status.swarm.agents.filter(a => a.status === 'active').length,
        idle: status.swarm.agents.filter(a => a.status === 'idle').length,
        error: status.swarm.agents.filter(a => a.status === 'error').length
      },
      tasks: {
        total: status.swarm.activeTasks.length,
        running: status.swarm.activeTasks.filter(t => t.status === 'running').length,
        completed: status.swarm.activeTasks.filter(t => t.status === 'completed').length,
        failed: status.swarm.activeTasks.filter(t => t.status === 'failed').length
      },
      timestamp: Date.now()
    };
  }

  // Memory Management
  public async memoryUsage(params?: { swarmId?: string, agentId?: string }): Promise<MemoryUsageResponse> {
    return await this.client.memoryUsage({
      swarmId: params?.swarmId,
      agentId: params?.agentId,
      type: undefined,
      includeContent: false
    });
  }

  public async memoryOptimize(target: { swarmId?: string, agentId?: string }): Promise<MemoryOptimizationResult> {
    const usage = await this.memoryUsage(target);
    
    const result: MemoryOptimizationResult = {
      beforeOptimization: usage.total,
      optimizationActions: [],
      projectedSavings: 0
    };

    // Implement optimization logic based on usage.optimization suggestions
    for (const suggestion of usage.optimization.suggestions) {
      try {
        await this.client.executeOperation('memory_optimize', {
          ...target,
          action: suggestion
        });
        result.optimizationActions.push(suggestion);
      } catch (error) {
        console.error(`Failed to execute optimization: ${suggestion}`, error);
      }
    }

    const afterUsage = await this.memoryUsage(target);
    result.afterOptimization = afterUsage.total;
    result.actualSavings = usage.total.used - afterUsage.total.used;

    return result;
  }

  public async memoryExport(target: { swarmId?: string, agentId?: string }): Promise<MemoryExport> {
    return await this.client.executeOperation('memory_export', target);
  }

  public async memoryImport(target: { swarmId?: string, agentId?: string }, data: MemoryExport): Promise<void> {
    return await this.client.executeOperation('memory_import', {
      ...target,
      data
    });
  }

  // Task Results and Analytics
  public async taskResults(params?: { taskId?: string, swarmId?: string, status?: TaskStatus, timeRange?: TimeRange }): Promise<TaskResultsResponse> {
    return await this.client.taskResults({
      taskId: params?.taskId,
      swarmId: params?.swarmId,
      status: params?.status,
      timeRange: params?.timeRange || this.getDefaultTimeRange(),
      includeArtifacts: true,
      limit: 100
    });
  }

  public async getTaskAnalytics(swarmId: string, timeRange?: TimeRange): Promise<TaskAnalytics> {
    const results = await this.taskResults({ swarmId, timeRange });
    
    return {
      summary: results.summary,
      insights: results.insights,
      trends: this.calculateTaskTrends(results.tasks),
      efficiency: this.calculateTaskEfficiency(results.tasks),
      bottlenecks: results.insights.bottlenecks,
      recommendations: results.insights.recommendations
    };
  }

  // Utility Methods
  private buildSwarmConfig(partial: Partial<SwarmConfig>): SwarmConfig {
    return {
      id: partial.id || `swarm_${Date.now()}`,
      name: partial.name || `Swarm ${Date.now()}`,
      topology: partial.topology || 'hierarchical',
      agents: partial.agents || [],
      orchestrationRules: partial.orchestrationRules || [],
      scalingPolicy: partial.scalingPolicy || this.getDefaultScalingPolicy(),
      communicationProtocol: partial.communicationProtocol || this.getDefaultCommunicationProtocol(),
      failureHandling: partial.failureHandling || this.getDefaultFailureHandling()
    };
  }

  private enhanceAgentConfig(config: AgentConfig): AgentConfig {
    return {
      ...config,
      capabilities: config.capabilities || ['general'],
      maxConcurrentTasks: config.maxConcurrentTasks || 3,
      memorySize: config.memorySize || 1000,
      personality: config.personality || {
        creativity: 0.5,
        focus: 0.7,
        collaboration: 0.8,
        riskTolerance: 0.3,
        detailOrientation: 0.6
      },
      constraints: config.constraints || {
        maxTokensPerTask: 10000,
        timeoutSeconds: 300
      }
    };
  }

  private createDefaultAgentConfig(): AgentConfig {
    return {
      id: `agent_${Date.now()}`,
      name: `Agent_${Date.now()}`,
      type: 'general',
      capabilities: ['general', 'analysis'],
      maxConcurrentTasks: 3,
      memorySize: 1000,
      personality: {
        creativity: 0.5,
        focus: 0.7,
        collaboration: 0.8,
        riskTolerance: 0.3,
        detailOrientation: 0.6
      },
      constraints: {
        maxTokensPerTask: 10000,
        timeoutSeconds: 300
      }
    };
  }

  private getDefaultTimeRange(): TimeRange {
    const now = Date.now();
    return {
      start: now - (24 * 60 * 60 * 1000), // Last 24 hours
      end: now,
      granularity: 'hour'
    };
  }

  private getDefaultScalingPolicy() {
    return {
      minAgents: 1,
      maxAgents: 10,
      scaleUpThreshold: 0.8,
      scaleDownThreshold: 0.3,
      cooldownPeriod: 300,
      strategy: 'reactive' as const
    };
  }

  private getDefaultCommunicationProtocol() {
    return {
      method: 'mesh' as const,
      reliability: 'at_least_once' as const,
      encryption: true,
      compression: true
    };
  }

  private getDefaultFailureHandling() {
    return {
      strategy: 'restart' as const,
      maxFailures: 3,
      quarantinePeriod: 60,
      notificationThreshold: 2
    };
  }

  private async sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private async stopAllTasks(swarmId: string, gracePeriod: number): Promise<void> {
    const status = await this.swarmStatus({ swarmId, includeTasks: true });
    const runningTasks = status.swarm.activeTasks.filter(t => t.status === 'running');
    
    // Signal all tasks to stop gracefully
    await Promise.all(
      runningTasks.map(task => this.taskCancel(task.id, 'Swarm shutdown'))
    );

    // Wait for grace period
    await this.sleep(gracePeriod);
  }

  private async exportSwarmMemory(swarmId: string): Promise<void> {
    const memory = await this.memoryExport({ swarmId });
    // Save to persistent storage (implementation would depend on storage backend)
    localStorage.setItem(`swarm_memory_${swarmId}`, JSON.stringify(memory));
  }

  private calculateTaskTrends(tasks: any[]): any[] {
    // Implementation for calculating task performance trends
    return [];
  }

  private calculateTaskEfficiency(tasks: any[]): number {
    if (tasks.length === 0) return 0;
    
    const completed = tasks.filter(t => t.status === 'completed').length;
    return completed / tasks.length;
  }
}

// Additional Types
interface SwarmInitOptions {
  autoStart?: boolean;
  initialTasks?: TaskDefinition[];
  autoSpawnAgents?: boolean;
  agentSpawnDelay?: number;
}

interface SwarmTerminateOptions {
  gracefulShutdown?: boolean;
  gracePeriod?: number;
  saveMemory?: boolean;
  force?: boolean;
}

interface SwarmScaleOptions {
  agentTemplate?: AgentConfig;
  graceful?: boolean;
}

interface AgentTerminateOptions {
  graceful?: boolean;
  gracePeriod?: number;
  saveMemory?: boolean;
  force?: boolean;
}

interface SwarmHealthReport {
  swarmId: string;
  overallHealth: number;
  status: SwarmStatus;
  issues: any[];
  recommendations: string[];
  performance: {
    throughput: number;
    successRate: number;
    efficiency: number;
    resourceUtilization: any;
  };
  agents: {
    total: number;
    active: number;
    idle: number;
    error: number;
  };
  tasks: {
    total: number;
    running: number;
    completed: number;
    failed: number;
  };
  timestamp: number;
}

interface MemoryOptimizationResult {
  beforeOptimization: any;
  afterOptimization?: any;
  optimizationActions: string[];
  projectedSavings: number;
  actualSavings?: number;
}

interface MemoryExport {
  swarmId?: string;
  agentId?: string;
  data: MemoryItem[];
  metadata: {
    exportedAt: number;
    version: string;
    totalItems: number;
    totalSize: number;
  };
}

interface TaskAnalytics {
  summary: any;
  insights: any;
  trends: any[];
  efficiency: number;
  bottlenecks: string[];
  recommendations: string[];
}

// Default API instance
let defaultApi: MCPApi | null = null;

export function createMCPApi(client?: MCPClient): MCPApi {
  return new MCPApi(client);
}

export function getDefaultMCPApi(): MCPApi {
  if (!defaultApi) {
    defaultApi = new MCPApi();
  }
  return defaultApi;
}

export function setDefaultMCPApi(api: MCPApi): void {
  defaultApi = api;
}

// Convenience functions
export const mcpApi = {
  // Connection
  connect: (config?: Partial<MCPConfig>) => getDefaultMCPApi().connect(config),
  disconnect: () => getDefaultMCPApi().disconnect(),
  isConnected: () => getDefaultMCPApi().isConnected(),

  // Swarm management
  swarmInit: (config: Partial<SwarmConfig>, options?: SwarmInitOptions) => 
    getDefaultMCPApi().swarmInit(config, options),
  swarmTerminate: (swarmId: string, options?: SwarmTerminateOptions) => 
    getDefaultMCPApi().swarmTerminate(swarmId, options),
  swarmScale: (swarmId: string, targetAgents: number, options?: SwarmScaleOptions) => 
    getDefaultMCPApi().swarmScale(swarmId, targetAgents, options),
  swarmStatus: (swarmId: string) => 
    getDefaultMCPApi().swarmStatus({ swarmId }),
  swarmHealthCheck: (swarmId: string) => 
    getDefaultMCPApi().swarmHealthCheck(swarmId),

  // Agent management
  agentSpawn: (params: AgentSpawnParams) => 
    getDefaultMCPApi().agentSpawn(params),
  agentTerminate: (agentId: string, options?: AgentTerminateOptions) => 
    getDefaultMCPApi().agentTerminate(agentId, options),
  agentClone: (agentId: string, modifications?: Partial<AgentConfig>) => 
    getDefaultMCPApi().agentClone(agentId, modifications),

  // Task management
  taskOrchestrate: (params: TaskOrchestrationParams) => 
    getDefaultMCPApi().taskOrchestrate(params),
  taskCancel: (taskId: string, reason?: string) => 
    getDefaultMCPApi().taskCancel(taskId, reason),
  taskResults: (params?: { taskId?: string, swarmId?: string, status?: TaskStatus }) => 
    getDefaultMCPApi().taskResults(params),

  // Analytics
  agentMetrics: (params: { agentId?: string, swarmId?: string, timeRange?: TimeRange }) => 
    getDefaultMCPApi().agentMetrics(params),
  memoryUsage: (params?: { swarmId?: string, agentId?: string }) => 
    getDefaultMCPApi().memoryUsage(params),
  getTaskAnalytics: (swarmId: string, timeRange?: TimeRange) => 
    getDefaultMCPApi().getTaskAnalytics(swarmId, timeRange)
};

export default MCPApi;