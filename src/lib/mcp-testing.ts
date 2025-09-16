// MCP Testing Utilities and Mock Responses
// Comprehensive testing framework for MCP client functionality

import {
  MCPConfig,
  SwarmConfig,
  AgentConfig,
  TaskDefinition,
  SwarmInitResponse,
  AgentSpawnResponse,
  TaskOrchestrationResponse,
  SwarmStatusResponse,
  AgentMetricsResponse,
  MemoryUsageResponse,
  TaskResultsResponse,
  MCPWebSocketEvent,
  SwarmState,
  AgentState,
  TaskExecution,
  MCPError,
  MCPMockConfig,
  MockScenario,
  SwarmTopology,
  ExecutionStrategy,
  AgentStatus,
  TaskStatus,
  SwarmStatus,
  MCPEventType
} from '../types/mcp';
import { MCPClient } from './mcp-client';
import { MCPApi } from './mcp-api';
import MCPRealtimeManager from './mcp-realtime';

export interface TestingConfig {
  enableMocks: boolean;
  mockLatency: {
    min: number;
    max: number;
  };
  errorSimulation: {
    enabled: boolean;
    rate: number; // 0-1
    types: string[];
  };
  scenarios: MockScenario[];
  persistence: {
    enabled: boolean;
    storageKey: string;
  };
}

export interface TestResult {
  testName: string;
  passed: boolean;
  duration: number;
  error?: Error;
  details?: any;
}

export interface TestSuite {
  name: string;
  tests: TestCase[];
  setup?: () => Promise<void>;
  teardown?: () => Promise<void>;
}

export interface TestCase {
  name: string;
  test: () => Promise<void>;
  timeout?: number;
  skip?: boolean;
  only?: boolean;
}

export interface MockDataGenerator {
  generateSwarm(overrides?: Partial<SwarmState>): SwarmState;
  generateAgent(overrides?: Partial<AgentState>): AgentState;
  generateTask(overrides?: Partial<TaskExecution>): TaskExecution;
  generateEvent(type: MCPEventType, overrides?: any): MCPWebSocketEvent;
  generateError(code?: string): MCPError;
}

export class MCPTestingFramework {
  private config: TestingConfig;
  private mockClient: MockMCPClient | null = null;
  private mockRealtimeManager: MockRealtimeManager | null = null;
  private testResults: TestResult[] = [];
  private scenarios: Map<string, MockScenario> = new Map();
  private dataGenerator: MockDataGenerator;

  constructor(config?: Partial<TestingConfig>) {
    this.config = this.mergeWithDefaults(config || {});
    this.dataGenerator = new DefaultMockDataGenerator();
    this.setupScenarios();
  }

  private mergeWithDefaults(config: Partial<TestingConfig>): TestingConfig {
    return {
      enableMocks: true,
      mockLatency: {
        min: 50,
        max: 200
      },
      errorSimulation: {
        enabled: false,
        rate: 0.1,
        types: ['CONNECTION_ERROR', 'TIMEOUT_ERROR', 'VALIDATION_ERROR']
      },
      scenarios: [],
      persistence: {
        enabled: false,
        storageKey: 'mcp_test_data'
      },
      ...config
    };
  }

  private setupScenarios(): void {
    // Add default test scenarios
    this.addScenario(this.createHealthySwarmScenario());
    this.addScenario(this.createHighLoadScenario());
    this.addScenario(this.createFailureRecoveryScenario());
    this.addScenario(this.createScalingScenario());
    
    // Add custom scenarios from config
    this.config.scenarios.forEach(scenario => {
      this.addScenario(scenario);
    });
  }

  // Test Suite Management
  public async runTestSuite(suite: TestSuite): Promise<TestResult[]> {
    console.log(`Running test suite: ${suite.name}`);
    const suiteResults: TestResult[] = [];

    try {
      // Setup
      if (suite.setup) {
        await suite.setup();
      }

      // Run tests
      for (const testCase of suite.tests) {
        if (testCase.skip) {
          console.log(`Skipping test: ${testCase.name}`);
          continue;
        }

        const result = await this.runSingleTest(testCase);
        suiteResults.push(result);
        this.testResults.push(result);

        // If only is specified, run only that test
        if (testCase.only) {
          break;
        }
      }

      // Teardown
      if (suite.teardown) {
        await suite.teardown();
      }

    } catch (error) {
      console.error(`Test suite ${suite.name} failed during setup/teardown:`, error);
    }

    return suiteResults;
  }

  private async runSingleTest(testCase: TestCase): Promise<TestResult> {
    const startTime = Date.now();
    let passed = false;
    let error: Error | undefined;
    let details: any;

    try {
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Test timeout')), testCase.timeout || 10000);
      });

      await Promise.race([testCase.test(), timeoutPromise]);
      passed = true;
    } catch (e) {
      error = e as Error;
      passed = false;
    }

    const duration = Date.now() - startTime;

    const result: TestResult = {
      testName: testCase.name,
      passed,
      duration,
      error,
      details
    };

    console.log(`Test ${testCase.name}: ${passed ? 'PASSED' : 'FAILED'} (${duration}ms)`);
    if (error) {
      console.error(`  Error: ${error.message}`);
    }

    return result;
  }

  // Mock Client Creation
  public createMockClient(scenario?: string): MockMCPClient {
    const scenarioData = scenario ? this.scenarios.get(scenario) : undefined;
    this.mockClient = new MockMCPClient(this.config, scenarioData, this.dataGenerator);
    return this.mockClient;
  }

  public createMockRealtimeManager(scenario?: string): MockRealtimeManager {
    const scenarioData = scenario ? this.scenarios.get(scenario) : undefined;
    this.mockRealtimeManager = new MockRealtimeManager(this.config, scenarioData, this.dataGenerator);
    return this.mockRealtimeManager;
  }

  // Scenario Management
  public addScenario(scenario: MockScenario): void {
    this.scenarios.set(scenario.name, scenario);
  }

  public getScenario(name: string): MockScenario | undefined {
    return this.scenarios.get(name);
  }

  public listScenarios(): string[] {
    return Array.from(this.scenarios.keys());
  }

  // Connection Testing
  public async testConnection(serverUrl: string): Promise<TestResult> {
    const testName = `Connection Test: ${serverUrl}`;
    const startTime = Date.now();

    try {
      const client = new MCPClient({ serverUrl });
      await client.connect();
      await client.disconnect();

      return {
        testName,
        passed: true,
        duration: Date.now() - startTime
      };
    } catch (error) {
      return {
        testName,
        passed: false,
        duration: Date.now() - startTime,
        error: error as Error
      };
    }
  }

  // Performance Testing
  public async performanceTest(config: {
    swarmSize: number;
    taskCount: number;
    concurrency: number;
    duration: number;
  }): Promise<PerformanceTestResult> {
    const startTime = Date.now();
    const mockClient = this.createMockClient('high_load');
    const api = new MCPApi(mockClient);

    // Connect
    await api.connect();

    // Initialize swarm
    const swarmResponse = await api.swarmInit({
      name: 'Performance Test Swarm',
      agents: Array.from({ length: config.swarmSize }, (_, i) => 
        this.dataGenerator.generateAgent({ 
          id: `perf_agent_${i}`,
          name: `Performance Agent ${i}`
        }).config
      )
    });

    const swarmId = swarmResponse.swarmId;
    const metrics = {
      tasksCreated: 0,
      tasksCompleted: 0,
      tasksFailed: 0,
      averageLatency: 0,
      throughput: 0,
      errors: [] as Error[]
    };

    // Generate tasks continuously for the specified duration
    const testEndTime = startTime + config.duration;
    const taskPromises: Promise<any>[] = [];

    while (Date.now() < testEndTime) {
      // Create batch of tasks
      const batchSize = Math.min(config.concurrency, config.taskCount - metrics.tasksCreated);
      if (batchSize <= 0) break;

      const tasks = Array.from({ length: batchSize }, (_, i) => ({
        id: `perf_task_${metrics.tasksCreated + i}`,
        name: `Performance Task ${metrics.tasksCreated + i}`,
        description: 'Performance test task',
        type: 'analysis' as const,
        priority: 0.5,
        dependencies: [],
        requirements: {
          agentCapabilities: ['general'],
          minimumAgents: 1,
          resourceLimits: {
            maxTokens: 1000,
            maxMemory: 100,
            maxDuration: 30000
          },
          qualityThreshold: 0.8
        },
        expectedOutput: {
          format: 'text' as const
        },
        timeout: 30000,
        retryPolicy: {
          maxRetries: 1,
          backoffStrategy: 'linear' as const,
          baseDelay: 1000,
          maxDelay: 5000,
          retryConditions: ['TIMEOUT_ERROR']
        }
      }));

      const taskStartTime = Date.now();
      const promise = api.taskOrchestrate({
        swarmId,
        tasks
      }).then(() => {
        const latency = Date.now() - taskStartTime;
        metrics.averageLatency = (metrics.averageLatency * metrics.tasksCompleted + latency) / (metrics.tasksCompleted + 1);
        metrics.tasksCompleted += batchSize;
      }).catch((error) => {
        metrics.tasksFailed += batchSize;
        metrics.errors.push(error);
      });

      taskPromises.push(promise);
      metrics.tasksCreated += batchSize;

      // Limit concurrent requests
      if (taskPromises.length >= config.concurrency) {
        await Promise.race(taskPromises);
        // Remove completed promises
        for (let i = taskPromises.length - 1; i >= 0; i--) {
          if (await this.isPromiseSettled(taskPromises[i])) {
            taskPromises.splice(i, 1);
          }
        }
      }
    }

    // Wait for remaining tasks
    await Promise.allSettled(taskPromises);

    const totalDuration = Date.now() - startTime;
    metrics.throughput = metrics.tasksCompleted / (totalDuration / 1000); // tasks per second

    await api.disconnect();

    return {
      duration: totalDuration,
      metrics,
      config
    };
  }

  private async isPromiseSettled(promise: Promise<any>): Promise<boolean> {
    try {
      await Promise.race([
        promise,
        new Promise(resolve => setTimeout(resolve, 0))
      ]);
      return true;
    } catch {
      return true;
    }
  }

  // Error Simulation
  public enableErrorSimulation(rate: number, types: string[]): void {
    this.config.errorSimulation.enabled = true;
    this.config.errorSimulation.rate = rate;
    this.config.errorSimulation.types = types;
  }

  public disableErrorSimulation(): void {
    this.config.errorSimulation.enabled = false;
  }

  // Mock Scenarios
  private createHealthySwarmScenario(): MockScenario {
    return {
      name: 'healthy_swarm',
      description: 'A well-functioning swarm with stable performance',
      setup: () => {},
      cleanup: () => {},
      responses: {
        swarm_init: this.createMockSwarmInitResponse(),
        agent_spawn: this.createMockAgentSpawnResponse(),
        task_orchestrate: this.createMockTaskOrchestrationResponse(),
        swarm_status: this.createMockSwarmStatusResponse('healthy')
      },
      events: this.createHealthySwarmEvents()
    };
  }

  private createHighLoadScenario(): MockScenario {
    return {
      name: 'high_load',
      description: 'High load scenario with many agents and tasks',
      setup: () => {},
      cleanup: () => {},
      responses: {
        swarm_init: this.createMockSwarmInitResponse({ 
          agents: Array.from({ length: 10 }, (_, i) => 
            this.dataGenerator.generateAgent({ id: `agent_${i}` })
          )
        }),
        swarm_status: this.createMockSwarmStatusResponse('high_load')
      },
      events: this.createHighLoadEvents()
    };
  }

  private createFailureRecoveryScenario(): MockScenario {
    return {
      name: 'failure_recovery',
      description: 'Scenario with failures and recovery mechanisms',
      setup: () => {},
      cleanup: () => {},
      responses: {
        swarm_status: this.createMockSwarmStatusResponse('failure')
      },
      events: this.createFailureRecoveryEvents()
    };
  }

  private createScalingScenario(): MockScenario {
    return {
      name: 'scaling',
      description: 'Dynamic scaling scenario',
      setup: () => {},
      cleanup: () => {},
      responses: {},
      events: this.createScalingEvents()
    };
  }

  // Mock Response Creators
  private createMockSwarmInitResponse(overrides?: any): SwarmInitResponse {
    return {
      swarmId: `swarm_${Date.now()}`,
      status: 'active',
      message: 'Swarm initialized successfully',
      agents: overrides?.agents || [this.dataGenerator.generateAgent()],
      estimatedStartupTime: 5000,
      ...overrides
    };
  }

  private createMockAgentSpawnResponse(overrides?: any): AgentSpawnResponse {
    return {
      agentId: `agent_${Date.now()}`,
      status: 'active',
      message: 'Agent spawned successfully',
      assignedTasks: [],
      integrationTime: 2000,
      ...overrides
    };
  }

  private createMockTaskOrchestrationResponse(overrides?: any): TaskOrchestrationResponse {
    return {
      orchestrationId: `orch_${Date.now()}`,
      scheduledTasks: [this.dataGenerator.generateTask()],
      estimatedCompletion: Date.now() + 60000,
      resourceRequirements: {
        maxTokens: 10000,
        maxMemory: 1000,
        maxDuration: 60000
      },
      warnings: [],
      ...overrides
    };
  }

  private createMockSwarmStatusResponse(scenario: string): SwarmStatusResponse {
    const swarm = this.dataGenerator.generateSwarm();
    
    if (scenario === 'high_load') {
      swarm.performance.throughput = 100;
      swarm.performance.resourceUtilization.cpu = 0.9;
      swarm.performance.resourceUtilization.memory = 0.8;
    } else if (scenario === 'failure') {
      swarm.status = 'error';
      swarm.health.overall = 0.3;
      swarm.health.issues = [{
        id: 'issue_1',
        type: 'performance',
        severity: 'high',
        message: 'High failure rate detected',
        affectedComponents: ['agent_1', 'agent_2'],
        suggestedActions: ['Restart affected agents', 'Check resource limits'],
        timestamp: Date.now()
      }];
    }

    return {
      swarm,
      realTimeMetrics: {
        timestamp: Date.now(),
        activeAgents: swarm.agents.length,
        runningTasks: swarm.activeTasks.length,
        queuedTasks: 0,
        throughput: swarm.performance.throughput,
        latency: 150,
        errorRate: 0.05
      }
    };
  }

  // Mock Event Creators
  private createHealthySwarmEvents(): MCPWebSocketEvent[] {
    return [
      this.dataGenerator.generateEvent('swarm_status_changed', {
        swarmId: 'test_swarm',
        oldStatus: 'initializing',
        newStatus: 'active',
        reason: 'All agents ready'
      }),
      this.dataGenerator.generateEvent('task_completed', {
        taskId: 'test_task_1',
        swarmId: 'test_swarm',
        status: 'completed',
        result: { success: true, output: 'Task completed successfully' }
      })
    ];
  }

  private createHighLoadEvents(): MCPWebSocketEvent[] {
    const events: MCPWebSocketEvent[] = [];
    
    // Generate many task events
    for (let i = 0; i < 50; i++) {
      events.push(this.dataGenerator.generateEvent('task_started', {
        taskId: `load_task_${i}`,
        swarmId: 'load_test_swarm',
        status: 'running'
      }));
    }

    return events;
  }

  private createFailureRecoveryEvents(): MCPWebSocketEvent[] {
    return [
      this.dataGenerator.generateEvent('error_occurred', {
        id: 'error_1',
        type: 'AGENT_ERROR',
        message: 'Agent failed to process task',
        severity: 'high',
        component: 'agent_1'
      }),
      this.dataGenerator.generateEvent('agent_status_changed', {
        agentId: 'agent_1',
        swarmId: 'test_swarm',
        oldStatus: 'active',
        newStatus: 'error',
        reason: 'Task processing failure'
      }),
      this.dataGenerator.generateEvent('agent_status_changed', {
        agentId: 'agent_1',
        swarmId: 'test_swarm',
        oldStatus: 'error',
        newStatus: 'active',
        reason: 'Recovery completed'
      })
    ];
  }

  private createScalingEvents(): MCPWebSocketEvent[] {
    return [
      this.dataGenerator.generateEvent('scaling_event', {
        swarmId: 'scaling_test_swarm',
        action: 'scale_up',
        from: 3,
        to: 5,
        reason: 'High load detected'
      }),
      this.dataGenerator.generateEvent('agent_spawned', {
        agentId: 'new_agent_1',
        swarmId: 'scaling_test_swarm'
      })
    ];
  }

  // Reporting
  public getTestResults(): TestResult[] {
    return [...this.testResults];
  }

  public generateReport(): TestReport {
    const total = this.testResults.length;
    const passed = this.testResults.filter(r => r.passed).length;
    const failed = total - passed;
    const averageDuration = total > 0 
      ? this.testResults.reduce((sum, r) => sum + r.duration, 0) / total 
      : 0;

    return {
      summary: {
        total,
        passed,
        failed,
        passRate: total > 0 ? passed / total : 0,
        averageDuration
      },
      results: this.testResults,
      generatedAt: Date.now()
    };
  }

  public clearResults(): void {
    this.testResults = [];
  }
}

// Mock Client Implementation
class MockMCPClient extends MCPClient {
  private mockConfig: TestingConfig;
  private scenario?: MockScenario;
  private dataGenerator: MockDataGenerator;

  constructor(config: TestingConfig, scenario?: MockScenario, dataGenerator?: MockDataGenerator) {
    super({});
    this.mockConfig = config;
    this.scenario = scenario;
    this.dataGenerator = dataGenerator || new DefaultMockDataGenerator();
  }

  public async connect(): Promise<void> {
    await this.simulateLatency();
    this.simulateErrors();
    // Override internal state to simulate connection
    (this as any).state.connected = true;
  }

  public async disconnect(): Promise<void> {
    await this.simulateLatency();
    (this as any).state.connected = false;
  }

  protected async executeOperation<T>(operation: string, params: any): Promise<T> {
    await this.simulateLatency();
    this.simulateErrors();

    // Return mock response from scenario if available
    if (this.scenario?.responses[operation]) {
      return this.scenario.responses[operation];
    }

    // Generate default mock response
    return this.generateMockResponse(operation, params);
  }

  private async simulateLatency(): Promise<void> {
    const { min, max } = this.mockConfig.mockLatency;
    const delay = Math.random() * (max - min) + min;
    await new Promise(resolve => setTimeout(resolve, delay));
  }

  private simulateErrors(): void {
    if (!this.mockConfig.errorSimulation.enabled) return;

    if (Math.random() < this.mockConfig.errorSimulation.rate) {
      const errorType = this.mockConfig.errorSimulation.types[
        Math.floor(Math.random() * this.mockConfig.errorSimulation.types.length)
      ];
      throw this.dataGenerator.generateError(errorType);
    }
  }

  private generateMockResponse(operation: string, params: any): any {
    switch (operation) {
      case 'swarm_init':
        return {
          swarmId: `mock_swarm_${Date.now()}`,
          status: 'active',
          message: 'Mock swarm initialized',
          agents: params.config?.agents?.map((config: AgentConfig) => 
            this.dataGenerator.generateAgent({ config }).config
          ) || [],
          estimatedStartupTime: 3000
        };

      case 'agent_spawn':
        return {
          agentId: `mock_agent_${Date.now()}`,
          status: 'active',
          message: 'Mock agent spawned',
          assignedTasks: [],
          integrationTime: 1500
        };

      case 'task_orchestrate':
        return {
          orchestrationId: `mock_orch_${Date.now()}`,
          scheduledTasks: params.tasks?.map((task: TaskDefinition) => 
            this.dataGenerator.generateTask({ taskId: task.id })
          ) || [],
          estimatedCompletion: Date.now() + 30000,
          resourceRequirements: {
            maxTokens: 5000,
            maxMemory: 500,
            maxDuration: 30000
          },
          warnings: []
        };

      default:
        return { success: true, message: `Mock response for ${operation}` };
    }
  }
}

// Mock Realtime Manager
class MockRealtimeManager extends MCPRealtimeManager {
  private mockConfig: TestingConfig;
  private scenario?: MockScenario;
  private dataGenerator: MockDataGenerator;
  private eventSimulator: NodeJS.Timeout | null = null;

  constructor(config: TestingConfig, scenario?: MockScenario, dataGenerator?: MockDataGenerator) {
    super('ws://mock-server');
    this.mockConfig = config;
    this.scenario = scenario;
    this.dataGenerator = dataGenerator || new DefaultMockDataGenerator();
  }

  public async connect(): Promise<void> {
    await this.simulateLatency();
    (this as any).isConnected = true;
    this.startEventSimulation();
  }

  public async disconnect(): Promise<void> {
    this.stopEventSimulation();
    (this as any).isConnected = false;
  }

  private async simulateLatency(): Promise<void> {
    const { min, max } = this.mockConfig.mockLatency;
    const delay = Math.random() * (max - min) + min;
    await new Promise(resolve => setTimeout(resolve, delay));
  }

  private startEventSimulation(): void {
    if (!this.scenario?.events) return;

    let eventIndex = 0;
    this.eventSimulator = setInterval(() => {
      if (eventIndex < this.scenario!.events.length) {
        const event = this.scenario!.events[eventIndex];
        (this as any).handleEvent(event);
        eventIndex++;
      } else {
        // Generate random events
        const randomEvent = this.generateRandomEvent();
        (this as any).handleEvent(randomEvent);
      }
    }, 1000);
  }

  private stopEventSimulation(): void {
    if (this.eventSimulator) {
      clearInterval(this.eventSimulator);
      this.eventSimulator = null;
    }
  }

  private generateRandomEvent(): MCPWebSocketEvent {
    const eventTypes: MCPEventType[] = [
      'metrics_updated',
      'task_completed',
      'agent_status_changed'
    ];
    const randomType = eventTypes[Math.floor(Math.random() * eventTypes.length)];
    return this.dataGenerator.generateEvent(randomType, {});
  }
}

// Default Mock Data Generator
class DefaultMockDataGenerator implements MockDataGenerator {
  generateSwarm(overrides?: Partial<SwarmState>): SwarmState {
    return {
      id: `swarm_${Date.now()}`,
      status: 'active',
      config: {
        id: `swarm_${Date.now()}`,
        name: 'Mock Swarm',
        topology: 'hierarchical',
        agents: [],
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
        }
      },
      agents: [],
      activeTasks: [],
      performance: {
        throughput: 10,
        averageTaskTime: 5000,
        successRate: 0.95,
        resourceUtilization: {
          cpu: 0.4,
          memory: 0.3,
          network: 0.2,
          tokens: 5000,
          maxTokens: 100000
        },
        efficiency: 0.8,
        cost: {
          totalTokens: 10000,
          estimatedCost: 5.50,
          costPerTask: 0.10,
          costPerHour: 2.75
        }
      },
      topology: {
        type: 'hierarchical',
        connections: [],
        centralNodes: [],
        leafNodes: [],
        clusters: []
      },
      health: {
        overall: 0.9,
        agents: {},
        connections: {},
        issues: [],
        recommendations: []
      },
      createdAt: Date.now() - 3600000,
      lastUpdated: Date.now(),
      ...overrides
    };
  }

  generateAgent(overrides?: Partial<AgentState>): AgentState {
    const id = `agent_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    return {
      id,
      status: 'active',
      config: {
        id,
        name: `Mock Agent ${id}`,
        type: 'general',
        capabilities: ['analysis', 'generation'],
        maxConcurrentTasks: 3,
        memorySize: 1000,
        personality: {
          creativity: 0.6,
          focus: 0.8,
          collaboration: 0.7,
          riskTolerance: 0.4,
          detailOrientation: 0.9
        },
        constraints: {
          maxTokensPerTask: 5000,
          timeoutSeconds: 300
        }
      },
      performance: {
        tasksCompleted: Math.floor(Math.random() * 100),
        averageTaskTime: 3000 + Math.random() * 5000,
        successRate: 0.9 + Math.random() * 0.1,
        errorCount: Math.floor(Math.random() * 5),
        tokensUsed: Math.floor(Math.random() * 10000),
        efficiencyScore: 0.7 + Math.random() * 0.3
      },
      memory: {
        shortTerm: [],
        longTerm: [],
        shared: [],
        capacity: 1000,
        used: Math.floor(Math.random() * 500)
      },
      lastActivity: Date.now() - Math.random() * 3600000,
      createdAt: Date.now() - 7200000,
      ...overrides
    };
  }

  generateTask(overrides?: Partial<TaskExecution>): TaskExecution {
    const id = `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    return {
      id,
      taskId: id,
      assignedAgents: [`agent_${Math.random().toString(36).substr(2, 9)}`],
      status: 'running',
      progress: Math.random(),
      startedAt: Date.now() - Math.random() * 300000,
      estimatedCompletion: Date.now() + Math.random() * 600000,
      errors: [],
      metrics: {
        duration: Math.random() * 60000,
        tokensUsed: Math.floor(Math.random() * 5000),
        apiCalls: Math.floor(Math.random() * 50),
        memoryPeak: Math.floor(Math.random() * 500),
        agentUtilization: {},
        bottlenecks: []
      },
      ...overrides
    };
  }

  generateEvent(type: MCPEventType, overrides?: any): MCPWebSocketEvent {
    return {
      type,
      timestamp: Date.now(),
      source: 'mock_generator',
      data: {
        swarmId: `swarm_${Math.random().toString(36).substr(2, 9)}`,
        agentId: `agent_${Math.random().toString(36).substr(2, 9)}`,
        taskId: `task_${Math.random().toString(36).substr(2, 9)}`,
        ...overrides
      }
    };
  }

  generateError(code?: string): MCPError {
    return {
      code: code || 'UNKNOWN_ERROR',
      message: `Mock error: ${code || 'Unknown error occurred'}`,
      timestamp: Date.now(),
      retryable: Math.random() > 0.5,
      component: 'MockGenerator',
      details: { generated: true, random: Math.random() }
    };
  }
}

// Built-in Test Suites
export const TestSuites = {
  connectionTests: (): TestSuite => ({
    name: 'Connection Tests',
    tests: [
      {
        name: 'Should connect to MCP server',
        test: async () => {
          const framework = new MCPTestingFramework();
          const client = framework.createMockClient();
          await client.connect();
          if (!client.getState().connected) {
            throw new Error('Client not connected');
          }
        }
      },
      {
        name: 'Should handle connection failures gracefully',
        test: async () => {
          const framework = new MCPTestingFramework({
            errorSimulation: { enabled: true, rate: 1, types: ['CONNECTION_ERROR'] }
          });
          const client = framework.createMockClient();
          
          try {
            await client.connect();
            throw new Error('Expected connection to fail');
          } catch (error) {
            if (!(error as MCPError).code?.includes('CONNECTION_ERROR')) {
              throw new Error('Expected CONNECTION_ERROR');
            }
          }
        }
      }
    ]
  }),

  swarmManagementTests: (): TestSuite => ({
    name: 'Swarm Management Tests',
    tests: [
      {
        name: 'Should initialize swarm successfully',
        test: async () => {
          const framework = new MCPTestingFramework();
          const api = new MCPApi(framework.createMockClient());
          await api.connect();
          
          const response = await api.swarmInit({
            name: 'Test Swarm',
            agents: []
          });
          
          if (!response.swarmId) {
            throw new Error('Swarm ID not returned');
          }
        }
      },
      {
        name: 'Should spawn agents in swarm',
        test: async () => {
          const framework = new MCPTestingFramework();
          const api = new MCPApi(framework.createMockClient());
          await api.connect();
          
          const swarmResponse = await api.swarmInit({ name: 'Test Swarm' });
          const agentResponse = await api.agentSpawn({
            swarmId: swarmResponse.swarmId,
            config: {
              id: 'test_agent',
              name: 'Test Agent',
              type: 'general',
              capabilities: ['analysis'],
              maxConcurrentTasks: 1,
              memorySize: 500
            }
          });
          
          if (!agentResponse.agentId) {
            throw new Error('Agent ID not returned');
          }
        }
      }
    ]
  }),

  realtimeTests: (): TestSuite => ({
    name: 'Realtime Tests',
    tests: [
      {
        name: 'Should receive realtime events',
        test: async () => {
          const framework = new MCPTestingFramework();
          const realtimeManager = framework.createMockRealtimeManager('healthy_swarm');
          
          let eventReceived = false;
          realtimeManager.on('task_completed', () => {
            eventReceived = true;
          });
          
          await realtimeManager.connect();
          
          // Wait for events
          await new Promise(resolve => setTimeout(resolve, 2000));
          
          if (!eventReceived) {
            throw new Error('No events received');
          }
        }
      }
    ]
  })
};

// Additional Types
interface PerformanceTestResult {
  duration: number;
  metrics: {
    tasksCreated: number;
    tasksCompleted: number;
    tasksFailed: number;
    averageLatency: number;
    throughput: number;
    errors: Error[];
  };
  config: {
    swarmSize: number;
    taskCount: number;
    concurrency: number;
    duration: number;
  };
}

interface TestReport {
  summary: {
    total: number;
    passed: number;
    failed: number;
    passRate: number;
    averageDuration: number;
  };
  results: TestResult[];
  generatedAt: number;
}

// Default testing framework instance
let defaultTestingFramework: MCPTestingFramework | null = null;

export function createTestingFramework(config?: Partial<TestingConfig>): MCPTestingFramework {
  return new MCPTestingFramework(config);
}

export function getDefaultTestingFramework(): MCPTestingFramework {
  if (!defaultTestingFramework) {
    defaultTestingFramework = new MCPTestingFramework();
  }
  return defaultTestingFramework;
}

export default MCPTestingFramework;