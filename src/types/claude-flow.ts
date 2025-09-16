// Claude Flow UI Types
export interface FlowNode {
  id: string;
  type: 'input' | 'output' | 'processor' | 'decision' | 'loop' | 'api_call' | 'template';
  position: {
    x: number;
    y: number;
  };
  data: {
    label: string;
    description?: string;
    parameters?: Record<string, any>;
    config?: Record<string, any>;
  };
  connections?: {
    input: string[];
    output: string[];
  };
}

export interface FlowEdge {
  id: string;
  source: string;
  target: string;
  type?: 'default' | 'conditional' | 'data' | 'error';
  data?: {
    condition?: string;
    label?: string;
  };
}

export interface Flow {
  id: string;
  name: string;
  description?: string;
  version: string;
  created_at: string;
  updated_at: string;
  nodes: FlowNode[];
  edges: FlowEdge[];
  metadata?: {
    author?: string;
    tags?: string[];
    category?: string;
  };
}

export interface FlowExecution {
  id: string;
  flow_id: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';
  started_at: string;
  completed_at?: string;
  error_message?: string;
  execution_log: ExecutionLogEntry[];
  input_data?: Record<string, any>;
  output_data?: Record<string, any>;
}

export interface ExecutionLogEntry {
  timestamp: string;
  node_id: string;
  level: 'info' | 'warning' | 'error' | 'debug';
  message: string;
  data?: Record<string, any>;
}

export interface MCPServer {
  id: string;
  name: string;
  url: string;
  status: 'connected' | 'disconnected' | 'error';
  capabilities: string[];
  last_heartbeat?: string;
}

export interface MCPTool {
  name: string;
  description: string;
  parameters: Record<string, any>;
  server_id: string;
}

export interface LoadingState {
  isLoading: boolean;
  message?: string;
  progress?: number;
}

export interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

export interface Theme {
  mode: 'light' | 'dark' | 'system';
  primaryColor: string;
  accentColor: string;
  borderRadius: string;
}

export interface NotificationConfig {
  position: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
  duration: number;
  maxNotifications: number;
}

// Agent Types
export type AgentType = 
  | 'conversation' 
  | 'automation' 
  | 'analysis' 
  | 'monitoring' 
  | 'orchestrator' 
  | 'validator' 
  | 'transformer' 
  | 'aggregator';

export type AgentStatus = 
  | 'active' 
  | 'idle' 
  | 'busy' 
  | 'error' 
  | 'paused' 
  | 'terminated';

export interface AgentCapability {
  name: string;
  description: string;
  version: string;
  enabled: boolean;
}

export interface AgentMetrics {
  tasksCompleted: number;
  tasksInProgress: number;
  successRate: number;
  averageExecutionTime: number;
  errorCount: number;
  uptime: number;
  memoryUsage: number;
  cpuUsage: number;
  lastActivity: string;
}

export interface AgentTask {
  id: string;
  type: string;
  description: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  startedAt: string;
  completedAt?: string;
  duration?: number;
  input?: Record<string, any>;
  output?: Record<string, any>;
  error?: string;
}

export interface Agent {
  id: string;
  name: string;
  type: AgentType;
  status: AgentStatus;
  description?: string;
  version: string;
  createdAt: string;
  lastActivity: string;
  capabilities: AgentCapability[];
  metrics: AgentMetrics;
  configuration: Record<string, any>;
  currentTask?: AgentTask;
  taskHistory: AgentTask[];
  swarmId?: string;
  parentId?: string;
  childAgents?: string[];
}

export interface AgentSwarm {
  id: string;
  name: string;
  description?: string;
  agents: string[];
  coordinatorId: string;
  status: 'forming' | 'active' | 'scaling' | 'terminating' | 'terminated';
  strategy: 'roundrobin' | 'loadbalance' | 'priority' | 'custom';
  metrics: {
    totalAgents: number;
    activeAgents: number;
    totalTasks: number;
    averageLatency: number;
    throughput: number;
  };
  configuration: {
    maxAgents: number;
    minAgents: number;
    autoScale: boolean;
    scaleThreshold: number;
    cooldownPeriod: number;
  };
  createdAt: string;
  lastModified: string;
}

export interface AgentTemplate {
  id: string;
  name: string;
  type: AgentType;
  description: string;
  defaultConfiguration: Record<string, any>;
  requiredCapabilities: string[];
  resourceRequirements: {
    memory: number;
    cpu: number;
    storage: number;
  };
  tags: string[];
}

export interface AgentAlert {
  id: string;
  agentId: string;
  type: 'error' | 'warning' | 'info' | 'performance';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  timestamp: string;
  acknowledged: boolean;
  resolvedAt?: string;
  data?: Record<string, any>;
}

// SPARC Workflow Types
export type SPARCPhase = 'specification' | 'pseudocode' | 'architecture' | 'refinement' | 'completion';

export interface SPARCStep {
  id: string;
  phase: SPARCPhase;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'blocked' | 'skipped';
  progress: number; // 0-100
  estimatedDuration?: number; // in minutes
  actualDuration?: number;
  dependencies?: string[]; // step IDs
  artifacts?: SPARCArtifact[];
  assignedAgent?: string;
  startedAt?: string;
  completedAt?: string;
}

export interface SPARCArtifact {
  id: string;
  type: 'requirement' | 'specification' | 'pseudocode' | 'architecture' | 'code' | 'test' | 'documentation';
  name: string;
  content: string;
  version: number;
  createdAt: string;
  updatedAt: string;
  author?: string;
  status: 'draft' | 'review' | 'approved' | 'rejected';
}

export interface SPARCWorkflow {
  id: string;
  name: string;
  description: string;
  status: 'planning' | 'active' | 'paused' | 'completed' | 'cancelled';
  currentPhase: SPARCPhase;
  steps: SPARCStep[];
  timeline: SPARCTimeline;
  metrics: SPARCMetrics;
  stakeholders: Stakeholder[];
  createdAt: string;
  updatedAt: string;
  dueDate?: string;
}

export interface SPARCTimeline {
  startDate: string;
  endDate?: string;
  milestones: Milestone[];
  dependencies: Dependency[];
}

export interface Milestone {
  id: string;
  title: string;
  description?: string;
  dueDate: string;
  status: 'upcoming' | 'in_progress' | 'completed' | 'overdue';
  linkedSteps: string[];
}

export interface Dependency {
  id: string;
  fromStepId: string;
  toStepId: string;
  type: 'finish_to_start' | 'start_to_start' | 'finish_to_finish' | 'start_to_finish';
  lag?: number; // in days
}

export interface SPARCMetrics {
  totalSteps: number;
  completedSteps: number;
  overallProgress: number;
  qualityScore?: number;
  testCoverage?: number;
  performanceScore?: number;
  timeEfficiency: number; // actual vs estimated time
  blockerCount: number;
}

export interface Stakeholder {
  id: string;
  name: string;
  role: string;
  email?: string;
  responsibilities: string[];
  availability?: 'available' | 'busy' | 'unavailable';
}

export interface Requirement {
  id: string;
  title: string;
  description: string;
  type: 'functional' | 'non_functional' | 'constraint' | 'assumption';
  priority: 'critical' | 'high' | 'medium' | 'low';
  status: 'proposed' | 'approved' | 'rejected' | 'implemented' | 'tested';
  acceptanceCriteria: AcceptanceCriteria[];
  stakeholderId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AcceptanceCriteria {
  id: string;
  description: string;
  testable: boolean;
  status: 'pending' | 'passed' | 'failed';
}

export interface PseudocodeBlock {
  id: string;
  title: string;
  algorithm: string;
  complexity: {
    time: string;
    space: string;
  };
  flowDiagram?: string; // JSON representation of flow
  dependencies: string[];
  status: 'draft' | 'review' | 'approved';
}

export interface ArchitectureComponent {
  id: string;
  name: string;
  type: 'service' | 'database' | 'api' | 'ui' | 'library' | 'external';
  description: string;
  technology: string;
  dependencies: string[];
  interfaces: ComponentInterface[];
  status: 'planned' | 'in_development' | 'completed' | 'deprecated';
}

export interface ComponentInterface {
  id: string;
  name: string;
  type: 'input' | 'output' | 'bidirectional';
  protocol: string;
  dataFormat: string;
  description: string;
}

export interface QualityMetric {
  name: string;
  value: number;
  target: number;
  unit: string;
  status: 'good' | 'warning' | 'critical';
  trend: 'improving' | 'stable' | 'degrading';
}

export interface RefinementSuggestion {
  id: string;
  type: 'performance' | 'security' | 'maintainability' | 'scalability' | 'testing';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  suggestedFix: string;
  estimatedEffort: number; // in hours
  impact: string;
  status: 'open' | 'in_progress' | 'resolved' | 'dismissed';
}