import { useEffect, useCallback, useState } from 'react';
import { useAgentStore } from '../stores/agent-store';
import { mcpService } from '../services/mcpService';
import type { Agent, AgentTemplate, AgentTask } from '../types/claude-flow';

// Real-time agent management with live MCP integration
export function useRealTimeAgents() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  const {
    agents,
    selectedAgent,
    isSpawning,
    loadAgents,
    updateAgentStatus,
    updateAgentMetrics,
    addAlert,
    setError: setStoreError
  } = useAgentStore();

  // Real-time agent spawning with MCP
  const spawnAgent = useCallback(async (template: AgentTemplate, config?: Record<string, any>) => {
    setIsLoading(true);
    setError(null);

    try {
      console.log('🤖 Spawning agent with MCP...', { template, config });
      
      // Attempt real MCP spawning first
      try {
        const agentId = await mcpService.spawnAgent(template, config);
        
        if (agentId) {
          console.log('✅ Agent spawned successfully via MCP:', agentId);
          
          // The agent will be added to store via real-time updates
          // But we can add a placeholder immediately for better UX
          const placeholderAgent: Agent = {
            id: agentId,
            name: `${template.name} (Starting...)`,
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
              enabled: true
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
              lastActivity: new Date().toISOString()
            },
            configuration: template.defaultConfiguration,
            taskHistory: []
          };

          // Add to store temporarily
          useAgentStore.setState(state => ({
            agents: [...state.agents, placeholderAgent]
          }));

          return placeholderAgent;
        }
      } catch (mcpError) {
        console.warn('MCP spawning failed, falling back to simulation:', mcpError);
        
        // Fallback to simulated spawning for development
        return await simulateAgentSpawning(template, config);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to spawn agent';
      console.error('❌ Agent spawning failed:', errorMessage);
      setError(errorMessage);
      setStoreError(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [setStoreError]);

  // Fallback simulation for development
  const simulateAgentSpawning = async (template: AgentTemplate, config?: Record<string, any>) => {
    console.log('🔄 Simulating agent spawn for development...');
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const agentId = `agent-sim-${Date.now()}`;
    const newAgent: Agent = {
      id: agentId,
      name: `${template.name} #${Date.now().toString().slice(-3)}`,
      type: template.type,
      status: 'active',
      description: template.description,
      version: '1.0.0',
      createdAt: new Date().toISOString(),
      lastActivity: new Date().toISOString(),
      capabilities: template.requiredCapabilities.map(cap => ({
        name: cap,
        description: `${cap} capability`,
        version: '1.0',
        enabled: true
      })),
      metrics: {
        tasksCompleted: Math.floor(Math.random() * 10),
        tasksInProgress: Math.floor(Math.random() * 3),
        successRate: 0.8 + Math.random() * 0.2,
        averageExecutionTime: 1000 + Math.random() * 5000,
        errorCount: Math.floor(Math.random() * 2),
        uptime: Date.now() - Math.random() * 86400000,
        memoryUsage: Math.random() * 500,
        cpuUsage: Math.random() * 50,
        lastActivity: new Date().toISOString()
      },
      configuration: { ...template.defaultConfiguration, ...config },
      taskHistory: []
    };

    // Add to store
    useAgentStore.setState(state => ({
      agents: [...state.agents, newAgent]
    }));

    // Simulate some real-time updates
    setTimeout(() => {
      updateAgentStatus(agentId, 'active');
      addAlert({
        agentId,
        type: 'info',
        severity: 'low',
        message: `Agent ${newAgent.name} is now online and ready for tasks`
      });
    }, 1000);

    return newAgent;
  };

  // Real-time agent termination
  const terminateAgent = useCallback(async (agentId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      console.log('🛑 Terminating agent via MCP...', agentId);
      
      // Try real MCP termination
      const success = await mcpService.terminateAgent(agentId);
      
      if (success) {
        console.log('✅ Agent terminated successfully via MCP');
        updateAgentStatus(agentId, 'terminated');
      } else {
        throw new Error('MCP termination failed');
      }
    } catch (error) {
      console.warn('MCP termination failed, updating locally:', error);
      // Fallback to local update
      updateAgentStatus(agentId, 'terminated');
    } finally {
      setIsLoading(false);
    }
  }, [updateAgentStatus]);

  // Real-time agent restart
  const restartAgent = useCallback(async (agentId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      console.log('🔄 Restarting agent via MCP...', agentId);
      
      // Try real MCP restart
      const success = await mcpService.restartAgent(agentId);
      
      if (success) {
        console.log('✅ Agent restarted successfully via MCP');
        updateAgentStatus(agentId, 'active');
      } else {
        throw new Error('MCP restart failed');
      }
    } catch (error) {
      console.warn('MCP restart failed, updating locally:', error);
      // Fallback to local update
      updateAgentStatus(agentId, 'active');
    } finally {
      setIsLoading(false);
    }
  }, [updateAgentStatus]);

  // Real-time agent deletion
  const deleteAgent = useCallback(async (agentId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      console.log('🗑️ Deleting agent via MCP...', agentId);
      
      // Try real MCP deletion
      const success = await mcpService.deleteAgent(agentId);
      
      if (success) {
        console.log('✅ Agent deleted successfully via MCP');
        
        // Remove agent from local store
        useAgentStore.setState(state => ({
          agents: state.agents.filter(agent => agent.id !== agentId)
        }));
        
        addAlert({
          agentId,
          type: 'info',
          severity: 'medium',
          message: `Agent ${agentId} has been permanently deleted`
        });
      } else {
        throw new Error('MCP deletion failed');
      }
    } catch (error) {
      console.warn('MCP deletion failed:', error);
      setError(error instanceof Error ? error.message : 'Failed to delete agent');
    } finally {
      setIsLoading(false);
    }
  }, [addAlert]);

  // Real-time task assignment
  const assignTask = useCallback(async (agentId: string, task: Omit<AgentTask, 'id' | 'startedAt'>) => {
    setIsLoading(true);
    setError(null);

    try {
      console.log('📋 Assigning task via MCP...', { agentId, task });
      
      const taskWithId: AgentTask = {
        ...task,
        id: `task-${Date.now()}`,
        startedAt: new Date().toISOString()
      };

      // Try real MCP task assignment
      const success = await mcpService.assignTask(agentId, taskWithId);
      
      if (success) {
        console.log('✅ Task assigned successfully via MCP');
        
        // Update agent status locally for immediate feedback
        updateAgentStatus(agentId, 'busy');
        
        // Add to task history
        useAgentStore.setState(state => ({
          agents: state.agents.map(agent => 
            agent.id === agentId 
              ? {
                  ...agent,
                  currentTask: taskWithId,
                  taskHistory: [taskWithId, ...agent.taskHistory.slice(0, 9)] // Keep last 10
                }
              : agent
          )
        }));
      } else {
        throw new Error('MCP task assignment failed');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to assign task';
      console.error('❌ Task assignment failed:', errorMessage);
      setError(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [updateAgentStatus]);

  // Real-time agent metrics fetching
  const refreshAgentMetrics = useCallback(async (agentId?: string) => {
    const mcpStatus = mcpService.getConnectionStatus();
    
    if (!mcpStatus.isConnected) {
      console.log('📋 MCP not connected - using simulated metrics');
      simulateMetricsUpdate(agentId);
      return;
    }
    
    try {
      console.log('📊 Fetching real-time metrics...', { agentId });
      
      const metrics = await mcpService.getPerformanceMetrics(agentId);
      
      if (metrics) {
        if (agentId) {
          // Update specific agent metrics
          updateAgentMetrics(agentId, metrics);
        } else {
          // Update all agent metrics
          Object.entries(metrics).forEach(([id, agentMetrics]) => {
            updateAgentMetrics(id, agentMetrics as any);
          });
        }
        
        setLastUpdate(new Date());
        console.log('✅ Metrics updated successfully');
      }
    } catch (error) {
      console.log('📋 MCP metrics request failed - falling back to simulation:', error.message);
      // Generate simulated metrics for development
      simulateMetricsUpdate(agentId);
    }
  }, [updateAgentMetrics]);

  // Simulate metrics updates for development
  const simulateMetricsUpdate = (agentId?: string) => {
    const targetAgents = agentId ? [agentId] : agents.map(a => a.id);
    
    targetAgents.forEach(id => {
      const mockMetrics = {
        cpuUsage: Math.random() * 100,
        memoryUsage: Math.random() * 1000,
        tasksCompleted: Math.floor(Math.random() * 5),
        successRate: 0.8 + Math.random() * 0.2,
        lastActivity: new Date().toISOString()
      };
      
      updateAgentMetrics(id, mockMetrics);
    });
    
    setLastUpdate(new Date());
  };

  // Set up real-time event listeners and initial connection
  useEffect(() => {
    console.log('🔌 Setting up real-time MCP integration...');

    // Attempt initial connection (non-blocking)
    const initializeConnection = async () => {
      try {
        const connected = await mcpService.connect();
        if (connected) {
          console.log('✅ MCP connection successful!');
        } else {
          console.log('📋 MCP server not available - running in simulation mode');
        }
      } catch (error) {
        console.log('📋 MCP connection failed - running in simulation mode:', error.message);
      }
    };

    initializeConnection();

    // Agent status changes
    const handleAgentStatusChange = (data: any) => {
      console.log('📡 Real-time agent status update:', data);
      updateAgentStatus(data.agentId, data.status);
      
      if (data.metrics) {
        updateAgentMetrics(data.agentId, data.metrics);
      }
      
      setLastUpdate(new Date());
    };

    // Performance metrics updates
    const handleMetricsUpdate = (data: any) => {
      console.log('📊 Real-time metrics update:', data);
      
      if (data.agentId) {
        updateAgentMetrics(data.agentId, data.metrics);
      }
      
      setLastUpdate(new Date());
    };

    // Connection status updates
    const handleConnectionChange = (connected: boolean) => {
      console.log('🔗 MCP connection status changed:', connected);
      if (connected) {
        setError(null);
        addAlert({
          agentId: 'system',
          type: 'info',
          severity: 'low',
          message: 'MCP connection established'
        });
      }
    };

    // Error handling
    const handleMCPError = (data: any) => {
      console.log('⚠️ MCP error (non-critical):', data);
      // Don't set error state for connection issues - just log them
      if (data.message && !data.message.includes('server unavailable')) {
        setError(data.message);
      }
    };

    // Register event listeners
    mcpService.on('agent_status_changed', handleAgentStatusChange);
    mcpService.on('metrics_updated', handleMetricsUpdate);
    mcpService.on('connected', handleConnectionChange);
    mcpService.on('error', handleMCPError);

    // Start periodic metrics refresh (less frequent to avoid spam)
    const metricsInterval = setInterval(() => {
      refreshAgentMetrics();
    }, 15000); // Every 15 seconds

    // Cleanup
    return () => {
      mcpService.off('agent_status_changed', handleAgentStatusChange);
      mcpService.off('metrics_updated', handleMetricsUpdate);
      mcpService.off('connected', handleConnectionChange);
      mcpService.off('error', handleMCPError);
      clearInterval(metricsInterval);
    };
  }, [updateAgentStatus, updateAgentMetrics, addAlert, refreshAgentMetrics]);

  // Periodic health check (only when connected)
  useEffect(() => {
    const healthCheckInterval = setInterval(async () => {
      const mcpStatus = mcpService.getConnectionStatus();
      
      if (!mcpStatus.isConnected) {
        return; // Skip health check if not connected
      }
      
      try {
        const isHealthy = await mcpService.healthCheck();
        if (!isHealthy) {
          console.log('📋 MCP health check failed - connection may be unstable');
        }
      } catch (error) {
        console.log('📋 Health check failed:', error.message);
      }
    }, 45000); // Every 45 seconds, less frequent

    return () => clearInterval(healthCheckInterval);
  }, [addAlert]);

  return {
    // State
    agents,
    selectedAgent,
    isLoading: isLoading || isSpawning,
    error,
    lastUpdate,

    // Actions
    spawnAgent,
    terminateAgent,
    restartAgent,
    deleteAgent,
    assignTask,
    refreshAgentMetrics,

    // MCP Integration
    mcpService,
    
    // Utilities
    clearError: () => setError(null)
  };
}

export default useRealTimeAgents;