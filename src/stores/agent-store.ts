import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import {
  Agent,
  AgentSwarm,
  AgentTemplate,
  AgentAlert,
  AgentType,
  AgentStatus,
  AgentTask,
} from '@/types/claude-flow';
import { useMCPStore } from './mcp-store';

interface AgentState {
  // Agents
  agents: Agent[];
  selectedAgent: Agent | null;
  
  // Swarms
  swarms: AgentSwarm[];
  selectedSwarm: AgentSwarm | null;
  
  // Templates
  templates: AgentTemplate[];
  
  // Alerts
  alerts: AgentAlert[];
  unreadAlerts: number;
  
  // UI State
  isLoading: boolean;
  isSpawning: boolean;
  error: string | null;
  
  // Filters
  statusFilter: AgentStatus | 'all';
  typeFilter: AgentType | 'all';
  searchQuery: string;
}

interface AgentActions {
  // Agent Management
  loadAgents: () => Promise<void>;
  createAgent: (template: AgentTemplate, config?: Record<string, any>) => Promise<Agent>;
  updateAgent: (id: string, updates: Partial<Agent>) => Promise<void>;
  deleteAgent: (id: string) => Promise<void>;
  pauseAgent: (id: string) => Promise<void>;
  resumeAgent: (id: string) => Promise<void>;
  terminateAgent: (id: string) => Promise<void>;
  
  // Task Management
  assignTask: (agentId: string, task: Omit<AgentTask, 'id' | 'startedAt'>) => Promise<void>;
  cancelTask: (agentId: string, taskId: string) => Promise<void>;
  getTaskHistory: (agentId: string) => AgentTask[];
  
  // Swarm Management
  createSwarm: (name: string, agentIds: string[], config?: Partial<AgentSwarm['configuration']>) => Promise<AgentSwarm>;
  updateSwarm: (id: string, updates: Partial<AgentSwarm>) => Promise<void>;
  deleteSwarm: (id: string) => Promise<void>;
  addAgentToSwarm: (swarmId: string, agentId: string) => Promise<void>;
  removeAgentFromSwarm: (swarmId: string, agentId: string) => Promise<void>;
  scaleSwarm: (swarmId: string, targetCount: number) => Promise<void>;
  
  // Templates
  loadTemplates: () => Promise<void>;
  createTemplate: (template: Omit<AgentTemplate, 'id'>) => Promise<AgentTemplate>;
  updateTemplate: (id: string, updates: Partial<AgentTemplate>) => Promise<void>;
  deleteTemplate: (id: string) => Promise<void>;
  
  // Alerts
  loadAlerts: () => Promise<void>;
  acknowledgeAlert: (id: string) => Promise<void>;
  resolveAlert: (id: string) => Promise<void>;
  clearAlerts: () => void;
  
  // Selection
  selectAgent: (agent: Agent | null) => void;
  selectSwarm: (swarm: AgentSwarm | null) => void;
  
  // Filters
  setStatusFilter: (status: AgentStatus | 'all') => void;
  setTypeFilter: (type: AgentType | 'all') => void;
  setSearchQuery: (query: string) => void;
  
  // Utilities
  getAgentsByStatus: (status: AgentStatus) => Agent[];
  getAgentsByType: (type: AgentType) => Agent[];
  getAgentsBySwarm: (swarmId: string) => Agent[];
  getFilteredAgents: () => Agent[];
  getAgentMetrics: () => {
    total: number;
    active: number;
    idle: number;
    busy: number;
    error: number;
    paused: number;
    terminated: number;
  };
  
  // Real-time updates
  updateAgentStatus: (id: string, status: AgentStatus) => void;
  updateAgentMetrics: (id: string, metrics: Partial<Agent['metrics']>) => void;
  addAlert: (alert: Omit<AgentAlert, 'id' | 'timestamp'>) => void;
  
  // Error handling
  setError: (error: string | null) => void;
  clearError: () => void;
}

type AgentStore = AgentState & AgentActions;

export const useAgentStore = create<AgentStore>()(
  devtools(
    (set, get) => ({
      // Initial state
      agents: [],
      selectedAgent: null,
      swarms: [],
      selectedSwarm: null,
      templates: [],
      alerts: [],
      unreadAlerts: 0,
      isLoading: false,
      isSpawning: false,
      error: null,
      statusFilter: 'all',
      typeFilter: 'all',
      searchQuery: '',

      // Agent Management
      loadAgents: async () => {
        set({ isLoading: true, error: null });
        try {
          // In a real implementation, this would call the MCP server
          const mcpStore = useMCPStore.getState();
          if (mcpStore.connectionInfo.state !== 'connected') {
            throw new Error('MCP server not connected');
          }

          // Simulate API call for now
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Mock agents for demonstration
          const mockAgents: Agent[] = [
            {
              id: 'agent-001',
              name: 'Conversation Agent #1',
              type: 'conversation',
              status: 'active',
              description: 'Handles customer service conversations',
              version: '1.0.0',
              createdAt: new Date().toISOString(),
              lastActivity: new Date().toISOString(),
              capabilities: [
                { name: 'natural-language', description: 'Natural language processing', version: '1.0', enabled: true },
                { name: 'context-memory', description: 'Conversation context memory', version: '1.0', enabled: true },
              ],
              metrics: {
                tasksCompleted: 127,
                tasksInProgress: 3,
                successRate: 0.94,
                averageExecutionTime: 2300,
                errorCount: 8,
                uptime: 86400,
                memoryUsage: 45.2,
                cpuUsage: 12.3,
                lastActivity: new Date().toISOString(),
              },
              configuration: {
                maxConcurrentTasks: 5,
                timeoutMs: 30000,
                retryAttempts: 3,
              },
              taskHistory: [],
            },
            {
              id: 'agent-002',
              name: 'Data Analysis Agent',
              type: 'analysis',
              status: 'busy',
              description: 'Processes and analyzes large datasets',
              version: '1.1.0',
              createdAt: new Date().toISOString(),
              lastActivity: new Date().toISOString(),
              capabilities: [
                { name: 'data-processing', description: 'Large dataset processing', version: '1.1', enabled: true },
                { name: 'statistical-analysis', description: 'Statistical analysis tools', version: '1.0', enabled: true },
              ],
              metrics: {
                tasksCompleted: 89,
                tasksInProgress: 1,
                successRate: 0.98,
                averageExecutionTime: 15200,
                errorCount: 2,
                uptime: 172800,
                memoryUsage: 78.9,
                cpuUsage: 89.1,
                lastActivity: new Date().toISOString(),
              },
              configuration: {
                maxConcurrentTasks: 2,
                timeoutMs: 300000,
                retryAttempts: 1,
              },
              taskHistory: [],
              currentTask: {
                id: 'task-001',
                type: 'data-analysis',
                description: 'Analyzing customer behavior patterns',
                status: 'running',
                startedAt: new Date(Date.now() - 300000).toISOString(),
              },
            },
          ];

          set({ agents: mockAgents, isLoading: false });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to load agents',
            isLoading: false,
          });
        }
      },

      createAgent: async (template, config = {}) => {
        set({ isSpawning: true, error: null });
        try {
          // Simulate agent creation
          await new Promise(resolve => setTimeout(resolve, 2000));
          
          const newAgent: Agent = {
            id: `agent-${Date.now()}`,
            name: `${template.name} #${get().agents.length + 1}`,
            type: template.type,
            status: 'idle',
            description: template.description,
            version: '1.0.0',
            createdAt: new Date().toISOString(),
            lastActivity: new Date().toISOString(),
            capabilities: template.requiredCapabilities.map(cap => ({
              name: cap,
              description: `${cap} capability`,
              version: '1.0',
              enabled: true,
            })),
            metrics: {
              tasksCompleted: 0,
              tasksInProgress: 0,
              successRate: 0,
              averageExecutionTime: 0,
              errorCount: 0,
              uptime: 0,
              memoryUsage: 0,
              cpuUsage: 0,
              lastActivity: new Date().toISOString(),
            },
            configuration: { ...template.defaultConfiguration, ...config },
            taskHistory: [],
          };

          set(state => ({
            agents: [...state.agents, newAgent],
            isSpawning: false,
          }));

          return newAgent;
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to create agent',
            isSpawning: false,
          });
          throw error;
        }
      },

      updateAgent: async (id, updates) => {
        try {
          set(state => ({
            agents: state.agents.map(agent =>
              agent.id === id ? { ...agent, ...updates } : agent
            ),
          }));
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to update agent' });
        }
      },

      deleteAgent: async (id) => {
        try {
          set(state => ({
            agents: state.agents.filter(agent => agent.id !== id),
            selectedAgent: state.selectedAgent?.id === id ? null : state.selectedAgent,
          }));
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to delete agent' });
        }
      },

      pauseAgent: async (id) => {
        await get().updateAgent(id, { status: 'paused' });
      },

      resumeAgent: async (id) => {
        await get().updateAgent(id, { status: 'active' });
      },

      terminateAgent: async (id) => {
        await get().updateAgent(id, { status: 'terminated' });
      },

      // Task Management
      assignTask: async (agentId, task) => {
        try {
          const newTask: AgentTask = {
            ...task,
            id: `task-${Date.now()}`,
            startedAt: new Date().toISOString(),
          };

          set(state => ({
            agents: state.agents.map(agent =>
              agent.id === agentId
                ? {
                    ...agent,
                    currentTask: newTask,
                    taskHistory: [newTask, ...agent.taskHistory],
                    status: 'busy' as AgentStatus,
                  }
                : agent
            ),
          }));
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to assign task' });
        }
      },

      cancelTask: async (agentId, taskId) => {
        try {
          set(state => ({
            agents: state.agents.map(agent =>
              agent.id === agentId
                ? {
                    ...agent,
                    currentTask: agent.currentTask?.id === taskId ? undefined : agent.currentTask,
                    status: 'idle' as AgentStatus,
                  }
                : agent
            ),
          }));
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to cancel task' });
        }
      },

      getTaskHistory: (agentId) => {
        const agent = get().agents.find(a => a.id === agentId);
        return agent?.taskHistory || [];
      },

      // Swarm Management
      createSwarm: async (name, agentIds, config = {}) => {
        try {
          const newSwarm: AgentSwarm = {
            id: `swarm-${Date.now()}`,
            name,
            agents: agentIds,
            coordinatorId: agentIds[0] || '',
            status: 'forming',
            strategy: 'roundrobin',
            metrics: {
              totalAgents: agentIds.length,
              activeAgents: 0,
              totalTasks: 0,
              averageLatency: 0,
              throughput: 0,
            },
            configuration: {
              maxAgents: 10,
              minAgents: 1,
              autoScale: false,
              scaleThreshold: 0.8,
              cooldownPeriod: 300000,
              ...config,
            },
            createdAt: new Date().toISOString(),
            lastModified: new Date().toISOString(),
          };

          set(state => ({
            swarms: [...state.swarms, newSwarm],
            agents: state.agents.map(agent =>
              agentIds.includes(agent.id)
                ? { ...agent, swarmId: newSwarm.id }
                : agent
            ),
          }));

          return newSwarm;
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to create swarm' });
          throw error;
        }
      },

      updateSwarm: async (id, updates) => {
        try {
          set(state => ({
            swarms: state.swarms.map(swarm =>
              swarm.id === id
                ? { ...swarm, ...updates, lastModified: new Date().toISOString() }
                : swarm
            ),
          }));
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to update swarm' });
        }
      },

      deleteSwarm: async (id) => {
        try {
          set(state => ({
            swarms: state.swarms.filter(swarm => swarm.id !== id),
            selectedSwarm: state.selectedSwarm?.id === id ? null : state.selectedSwarm,
            agents: state.agents.map(agent =>
              agent.swarmId === id ? { ...agent, swarmId: undefined } : agent
            ),
          }));
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to delete swarm' });
        }
      },

      addAgentToSwarm: async (swarmId, agentId) => {
        try {
          set(state => ({
            swarms: state.swarms.map(swarm =>
              swarm.id === swarmId
                ? {
                    ...swarm,
                    agents: [...swarm.agents, agentId],
                    lastModified: new Date().toISOString(),
                  }
                : swarm
            ),
            agents: state.agents.map(agent =>
              agent.id === agentId ? { ...agent, swarmId } : agent
            ),
          }));
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to add agent to swarm' });
        }
      },

      removeAgentFromSwarm: async (swarmId, agentId) => {
        try {
          set(state => ({
            swarms: state.swarms.map(swarm =>
              swarm.id === swarmId
                ? {
                    ...swarm,
                    agents: swarm.agents.filter(id => id !== agentId),
                    lastModified: new Date().toISOString(),
                  }
                : swarm
            ),
            agents: state.agents.map(agent =>
              agent.id === agentId ? { ...agent, swarmId: undefined } : agent
            ),
          }));
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to remove agent from swarm' });
        }
      },

      scaleSwarm: async (swarmId, targetCount) => {
        // Implementation would depend on available templates and scaling strategy
        console.log(`Scaling swarm ${swarmId} to ${targetCount} agents`);
      },

      // Templates
      loadTemplates: async () => {
        try {
          // Mock templates for demonstration
          const mockTemplates: AgentTemplate[] = [
            {
              id: 'template-conversation',
              name: 'Conversation Agent',
              type: 'conversation',
              description: 'General purpose conversation agent for customer interactions',
              defaultConfiguration: {
                maxConcurrentTasks: 5,
                timeoutMs: 30000,
                retryAttempts: 3,
              },
              requiredCapabilities: ['natural-language', 'context-memory'],
              resourceRequirements: {
                memory: 512,
                cpu: 0.5,
                storage: 1024,
              },
              tags: ['customer-service', 'chat', 'nlp'],
            },
            {
              id: 'template-analysis',
              name: 'Data Analysis Agent',
              type: 'analysis',
              description: 'Specialized agent for data processing and analysis tasks',
              defaultConfiguration: {
                maxConcurrentTasks: 2,
                timeoutMs: 300000,
                retryAttempts: 1,
              },
              requiredCapabilities: ['data-processing', 'statistical-analysis'],
              resourceRequirements: {
                memory: 2048,
                cpu: 2.0,
                storage: 4096,
              },
              tags: ['analytics', 'data', 'processing'],
            },
          ];

          set({ templates: mockTemplates });
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to load templates' });
        }
      },

      createTemplate: async (template) => {
        try {
          const newTemplate: AgentTemplate = {
            ...template,
            id: `template-${Date.now()}`,
          };

          set(state => ({
            templates: [...state.templates, newTemplate],
          }));

          return newTemplate;
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to create template' });
          throw error;
        }
      },

      updateTemplate: async (id, updates) => {
        try {
          set(state => ({
            templates: state.templates.map(template =>
              template.id === id ? { ...template, ...updates } : template
            ),
          }));
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to update template' });
        }
      },

      deleteTemplate: async (id) => {
        try {
          set(state => ({
            templates: state.templates.filter(template => template.id !== id),
          }));
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to delete template' });
        }
      },

      // Alerts
      loadAlerts: async () => {
        try {
          // Mock alerts for demonstration
          const mockAlerts: AgentAlert[] = [
            {
              id: 'alert-001',
              agentId: 'agent-002',
              type: 'performance',
              severity: 'medium',
              message: 'High CPU usage detected (89%)',
              timestamp: new Date().toISOString(),
              acknowledged: false,
            },
          ];

          set({ alerts: mockAlerts, unreadAlerts: mockAlerts.filter(a => !a.acknowledged).length });
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to load alerts' });
        }
      },

      acknowledgeAlert: async (id) => {
        try {
          set(state => ({
            alerts: state.alerts.map(alert =>
              alert.id === id ? { ...alert, acknowledged: true } : alert
            ),
            unreadAlerts: Math.max(0, state.unreadAlerts - 1),
          }));
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to acknowledge alert' });
        }
      },

      resolveAlert: async (id) => {
        try {
          set(state => ({
            alerts: state.alerts.map(alert =>
              alert.id === id
                ? { ...alert, acknowledged: true, resolvedAt: new Date().toISOString() }
                : alert
            ),
          }));
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to resolve alert' });
        }
      },

      clearAlerts: () => {
        set({ alerts: [], unreadAlerts: 0 });
      },

      // Selection
      selectAgent: (agent) => {
        set({ selectedAgent: agent });
      },

      selectSwarm: (swarm) => {
        set({ selectedSwarm: swarm });
      },

      // Filters
      setStatusFilter: (status) => {
        set({ statusFilter: status });
      },

      setTypeFilter: (type) => {
        set({ typeFilter: type });
      },

      setSearchQuery: (query) => {
        set({ searchQuery: query });
      },

      // Utilities
      getAgentsByStatus: (status) => {
        return get().agents.filter(agent => agent.status === status);
      },

      getAgentsByType: (type) => {
        return get().agents.filter(agent => agent.type === type);
      },

      getAgentsBySwarm: (swarmId) => {
        return get().agents.filter(agent => agent.swarmId === swarmId);
      },

      getFilteredAgents: () => {
        const { agents, statusFilter, typeFilter, searchQuery } = get();
        
        return agents.filter(agent => {
          const matchesStatus = statusFilter === 'all' || agent.status === statusFilter;
          const matchesType = typeFilter === 'all' || agent.type === typeFilter;
          const matchesSearch = !searchQuery || 
            agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            agent.description?.toLowerCase().includes(searchQuery.toLowerCase());

          return matchesStatus && matchesType && matchesSearch;
        });
      },

      getAgentMetrics: () => {
        const agents = get().agents;
        const total = agents.length;
        
        return {
          total,
          active: agents.filter(a => a.status === 'active').length,
          idle: agents.filter(a => a.status === 'idle').length,
          busy: agents.filter(a => a.status === 'busy').length,
          error: agents.filter(a => a.status === 'error').length,
          paused: agents.filter(a => a.status === 'paused').length,
          terminated: agents.filter(a => a.status === 'terminated').length,
        };
      },

      // Real-time updates
      updateAgentStatus: (id, status) => {
        set(state => ({
          agents: state.agents.map(agent =>
            agent.id === id
              ? { ...agent, status, lastActivity: new Date().toISOString() }
              : agent
          ),
        }));
      },

      updateAgentMetrics: (id, metrics) => {
        set(state => ({
          agents: state.agents.map(agent =>
            agent.id === id
              ? {
                  ...agent,
                  metrics: { ...agent.metrics, ...metrics },
                  lastActivity: new Date().toISOString(),
                }
              : agent
          ),
        }));
      },

      addAlert: (alert) => {
        const newAlert: AgentAlert = {
          ...alert,
          id: `alert-${Date.now()}`,
          timestamp: new Date().toISOString(),
        };

        set(state => ({
          alerts: [newAlert, ...state.alerts],
          unreadAlerts: state.unreadAlerts + 1,
        }));
      },

      // Error handling
      setError: (error) => {
        set({ error });
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'agent-store',
    }
  )
);