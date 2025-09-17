import { useEffect, useState } from 'react';
import { useAgentStore } from '../stores/agent-store';

// Enhanced MCP Service for real Claude Flow integration
export class MCPService {
  private baseUrl: string;
  private apiKey: string;
  private wsConnection: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private heartbeatInterval: NodeJS.Timeout | null = null;
  private lastHeartbeat = 0;
  private isConnected = false;
  private listeners: Map<string, Function[]> = new Map();

  constructor(baseUrl: string = 'ws://localhost:8765', apiKey: string = '') {
    this.baseUrl = baseUrl;
    this.apiKey = apiKey;
  }

  // Connection Management
  async connect(): Promise<boolean> {
    try {
      console.log('🔗 Attempting MCP connection to:', this.baseUrl);

      return new Promise((resolve, _) => {
        try {
          this.wsConnection = new WebSocket(this.baseUrl);
        } catch (error) {
          console.warn('⚠️ WebSocket creation failed:', error);
          resolve(false);
          return;
        }

        this.wsConnection.onopen = () => {
          console.log('🌐 MCP Connection established');
          this.isConnected = true;
          this.reconnectAttempts = 0;
          this.lastHeartbeat = Date.now();
          this.emit('connected', true);

          // Start heartbeat monitoring
          this.startHeartbeat();

          // Send authentication if API key is provided
          if (this.apiKey) {
            this.send('auth', { apiKey: this.apiKey });
          }

          resolve(true);
        };

        this.wsConnection.onmessage = (event) => {
          try {
            const message = JSON.parse(event.data);
            this.handleMessage(message);
          } catch (error) {
            console.error('Failed to parse MCP message:', error);
          }
        };

        this.wsConnection.onclose = (event) => {
          console.log('🔌 MCP Connection closed:', event.code, event.reason);
          this.isConnected = false;
          this.stopHeartbeat();
          this.emit('disconnected', false);

          // Only attempt reconnect if this wasn't a clean close
          if (event.code !== 1000 && this.reconnectAttempts < this.maxReconnectAttempts) {
            this.attemptReconnect();
          }
        };

        this.wsConnection.onerror = (error) => {
          console.warn('⚠️ MCP Connection failed - no server available:', error);
          this.isConnected = false;
          this.emit('error', { message: 'MCP server unavailable' });
          resolve(false); // Resolve with false instead of rejecting
        };

        // Connection timeout
        setTimeout(() => {
          if (!this.isConnected && this.wsConnection?.readyState === WebSocket.CONNECTING) {
            console.warn('⏰ MCP connection timeout - server not responding');
            this.wsConnection?.close();
            resolve(false);
          }
        }, 5000); // Reduced timeout
      });
    } catch (error) {
      console.warn('Failed to connect to MCP server:', error);
      return false;
    }
  }

  private attemptReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`🔄 Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);

      setTimeout(async () => {
        const success = await this.connect();
        if (!success) {
          console.warn('Reconnection attempt failed');
        }
      }, this.reconnectDelay * this.reconnectAttempts);
    } else {
      console.warn('⚠️ Max reconnection attempts reached - operating in offline mode');
      this.emit('maxReconnectAttemptsReached', true);
    }
  }

  disconnect() {
    if (this.wsConnection) {
      this.wsConnection.close(1000, 'Client disconnect');
      this.wsConnection = null;
    }
    this.stopHeartbeat();
    this.isConnected = false;
  }

  // Heartbeat Management
  private startHeartbeat() {
    this.stopHeartbeat(); // Clear any existing heartbeat

    this.heartbeatInterval = setInterval(() => {
      if (this.isConnected && this.wsConnection?.readyState === WebSocket.OPEN) {
        const now = Date.now();

        // Check if we haven't received a heartbeat response recently
        if (now - this.lastHeartbeat > 30000) { // 30 seconds timeout
          console.warn('⚠️ MCP heartbeat timeout - connection may be stale');
          this.wsConnection.close();
          return;
        }

        // Send heartbeat ping
        this.send('heartbeat', { timestamp: now });
      }
    }, 15000); // Every 15 seconds
  }

  private stopHeartbeat() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  // Message Handling
  private send(type: string, data: any): boolean {
    if (!this.isConnected || !this.wsConnection) {
      console.warn('Cannot send message: MCP not connected');
      return false;
    }

    try {
      const message = {
        type,
        data,
        timestamp: new Date().toISOString(),
        id: this.generateId()
      };

      this.wsConnection.send(JSON.stringify(message));
      return true;
    } catch (error) {
      console.error('Failed to send MCP message:', error);
      return false;
    }
  }

  private handleMessage(message: any) {
    // Input validation
    if (!message || typeof message !== 'object') {
      console.warn('⚠️ Invalid MCP message format:', message);
      return;
    }

    const { type, data } = message;

    if (!type || typeof type !== 'string') {
      console.warn('⚠️ MCP message missing valid type:', message);
      return;
    }

    switch (type) {
      case 'heartbeat_response':
        this.lastHeartbeat = Date.now();
        break;
      case 'agent_status_update':
        this.handleAgentStatusUpdate(data);
        break;
      case 'swarm_update':
        this.handleSwarmUpdate(data);
        break;
      case 'memory_update':
        this.handleMemoryUpdate(data);
        break;
      case 'performance_metrics':
        this.handlePerformanceMetrics(data);
        break;
      case 'chat_message':
        this.handleChatMessage(data);
        break;
      case 'error':
        this.handleError(data);
        break;
      default:
        this.emit(type, data);
    }
  }

  // Agent Management
  async spawnAgent(template: any, config: any): Promise<string | null> {
    // Input validation
    if (!template || !template.type || !template.name) {
      throw new Error('Invalid template: missing required fields (type, name)');
    }

    if (!config || typeof config !== 'object') {
      throw new Error('Invalid config: must be an object');
    }

    if (!this.send('spawn_agent', { template, config })) {
      return null;
    }

    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Agent spawn timeout'));
      }, 30000);

      const handler = (data: any) => {
        clearTimeout(timeout);
        if (data.success) {
          resolve(data.agentId);
        } else {
          reject(new Error(data.error || 'Failed to spawn agent'));
        }
        this.off('agent_spawned', handler);
      };

      this.on('agent_spawned', handler);
    });
  }

  async terminateAgent(agentId: string): Promise<boolean> {
    return this.send('terminate_agent', { agentId });
  }

  async restartAgent(agentId: string): Promise<boolean> {
    return this.send('restart_agent', { agentId });
  }

  async pauseAgent(agentId: string): Promise<boolean> {
    return this.send('pause_agent', { agentId });
  }

  async resumeAgent(agentId: string): Promise<boolean> {
    return this.send('resume_agent', { agentId });
  }

  async assignTask(agentId: string, task: any): Promise<boolean> {
    return this.send('assign_task', { agentId, task });
  }

  async deleteAgent(agentId: string): Promise<boolean> {
    // Input validation
    if (!agentId || typeof agentId !== 'string') {
      throw new Error('Invalid agentId: must be a non-empty string');
    }

    return new Promise((resolve, reject) => {
      if (!this.send('delete_agent', { agentId })) {
        reject(new Error('Failed to send delete agent request'));
        return;
      }

      const timeout = setTimeout(() => {
        reject(new Error('Agent deletion timeout'));
      }, 10000);

      const handler = (data: any) => {
        clearTimeout(timeout);
        if (data.success) {
          resolve(true);
        } else {
          reject(new Error(data.error || 'Failed to delete agent'));
        }
        this.off('agent_deleted', handler);
      };

      this.on('agent_deleted', handler);
    });
  }

  // Swarm Management
  async createSwarm(name: string, agentIds: string[], strategy: string): Promise<string | null> {
    if (!this.send('create_swarm', { name, agentIds, strategy })) {
      return null;
    }

    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Swarm creation timeout'));
      }, 15000);

      const handler = (data: any) => {
        clearTimeout(timeout);
        if (data.success) {
          resolve(data.swarmId);
        } else {
          reject(new Error(data.error || 'Failed to create swarm'));
        }
        this.off('swarm_created', handler);
      };

      this.on('swarm_created', handler);
    });
  }

  async deploySwarm(swarmId: string): Promise<boolean> {
    return this.send('deploy_swarm', { swarmId });
  }

  async destroySwarm(swarmId: string): Promise<boolean> {
    return this.send('destroy_swarm', { swarmId });
  }

  // Memory Management
  async storeMemory(agentId: string, memory: any): Promise<boolean> {
    return this.send('store_memory', { agentId, memory });
  }

  async retrieveMemory(agentId: string, query?: string): Promise<any[]> {
    return new Promise((resolve, reject) => {
      if (!this.send('retrieve_memory', { agentId, query })) {
        reject(new Error('Failed to send memory request'));
        return;
      }

      const timeout = setTimeout(() => {
        reject(new Error('Memory retrieval timeout'));
      }, 10000);

      const handler = (data: any) => {
        clearTimeout(timeout);
        resolve(data.memories || []);
        this.off('memory_retrieved', handler);
      };

      this.on('memory_retrieved', handler);
    });
  }

  // Chat Integration
  async sendChatMessage(agentId: string, message: string): Promise<string> {
    // Input validation
    if (!agentId || typeof agentId !== 'string') {
      throw new Error('Invalid agentId: must be a non-empty string');
    }

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      throw new Error('Invalid message: must be a non-empty string');
    }

    // Sanitize message
    const sanitizedMessage = message.trim().slice(0, 2000); // Limit length

    return new Promise((resolve, reject) => {
      if (!this.send('chat_message', { agentId, message: sanitizedMessage })) {
        reject(new Error('Failed to send chat message'));
        return;
      }

      const timeout = setTimeout(() => {
        reject(new Error('Chat response timeout'));
      }, 30000);

      const handler = (data: any) => {
        if (data.agentId === agentId) {
          clearTimeout(timeout);
          resolve(data.response);
          this.off('chat_response', handler);
        }
      };

      this.on('chat_response', handler);
    });
  }

  // Performance Monitoring
  async getPerformanceMetrics(agentId?: string): Promise<any> {
    if (!this.isConnected) {
      console.warn('⚠️ Cannot fetch metrics - MCP not connected');
      throw new Error('MCP server not available');
    }

    return new Promise((resolve, reject) => {
      if (!this.send('get_performance_metrics', { agentId })) {
        reject(new Error('Failed to request performance metrics'));
        return;
      }

      const timeout = setTimeout(() => {
        reject(new Error('Performance metrics timeout'));
      }, 5000);

      const handler = (data: any) => {
        clearTimeout(timeout);
        resolve(data);
        this.off('performance_metrics_response', handler);
      };

      this.on('performance_metrics_response', handler);
    });
  }

  // Event Handlers
  private handleAgentStatusUpdate(data: any) {
    const agentStore = useAgentStore.getState();
    agentStore.updateAgentStatus(data.agentId, data.status);

    if (data.metrics) {
      agentStore.updateAgentMetrics(data.agentId, data.metrics);
    }

    this.emit('agent_status_changed', data);
  }

  private handleSwarmUpdate(data: any) {
    // Update swarm state in store
    this.emit('swarm_status_changed', data);
  }

  private handleMemoryUpdate(data: any) {
    // Update memory state
    this.emit('memory_changed', data);
  }

  private handlePerformanceMetrics(data: any) {
    // Update performance metrics
    this.emit('metrics_updated', data);
  }

  private handleChatMessage(data: any) {
    // Handle incoming chat messages
    this.emit('chat_message_received', data);
  }

  private handleError(data: any) {
    console.error('MCP Error:', data);
    this.emit('mcp_error', data);
  }

  // Event System
  on(event: string, callback: Function) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(callback);
  }

  off(event: string, callback: Function) {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      const index = eventListeners.indexOf(callback);
      if (index > -1) {
        eventListeners.splice(index, 1);
      }
    }
  }

  private emit(event: string, data: any) {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      eventListeners.forEach(callback => callback(data));
    }
  }

  // Utility Methods
  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  getConnectionStatus(): {
    isConnected: boolean;
    reconnectAttempts: number;
    lastError?: string;
  } {
    return {
      isConnected: this.isConnected,
      reconnectAttempts: this.reconnectAttempts
    };
  }

  // Health Check
  async healthCheck(): Promise<boolean> {
    if (!this.isConnected) {
      return false;
    }

    return new Promise((resolve) => {
      if (!this.send('health_check', {})) {
        resolve(false);
        return;
      }

      const timeout = setTimeout(() => {
        resolve(false);
      }, 3000); // Shorter timeout

      const handler = (data: any) => {
        clearTimeout(timeout);
        resolve(data.status === 'healthy');
        this.off('health_check_response', handler);
      };

      this.on('health_check_response', handler);
    });
  }

  // File Operations (for integration with file explorer)
  async executeFileOperation(operation: string, path: string, content?: string): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!this.send('file_operation', { operation, path, content })) {
        reject(new Error('Failed to send file operation'));
        return;
      }

      const timeout = setTimeout(() => {
        reject(new Error('File operation timeout'));
      }, 10000);

      const handler = (data: any) => {
        clearTimeout(timeout);
        if (data.success) {
          resolve(data.result);
        } else {
          reject(new Error(data.error || 'File operation failed'));
        }
        this.off('file_operation_response', handler);
      };

      this.on('file_operation_response', handler);
    });
  }
}

// Singleton instance - Create with fallback URL that indicates no server
const MCP_URL = import.meta.env.VITE_MCP_URL || 'ws://localhost:8765';
const MCP_API_KEY = import.meta.env.VITE_MCP_API_KEY || '';

console.log('🔧 Initializing MCP Service with URL:', MCP_URL);
if (!import.meta.env.VITE_MCP_URL) {
  console.warn('⚠️ No VITE_MCP_URL configured - using default ws://localhost:8765');
  console.warn('💡 To connect to a real MCP server, set VITE_MCP_URL in your .env file');
}

export const mcpService = new MCPService(MCP_URL, MCP_API_KEY);

// Enhanced MCP Hook with real integration
export function useMCPIntegration() {
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<string>('disconnected');
  const [lastError, setLastError] = useState<string | null>(null);

  useEffect(() => {
    // Set up event listeners
    mcpService.on('connected', () => {
      setIsConnected(true);
      setConnectionStatus('connected');
      setLastError(null);
    });

    mcpService.on('disconnected', () => {
      setIsConnected(false);
      setConnectionStatus('disconnected');
    });

    mcpService.on('error', (error: any) => {
      setLastError(error.message || 'Connection error');
      setConnectionStatus('error');
    });

    mcpService.on('maxReconnectAttemptsReached', () => {
      setConnectionStatus('failed');
    });

    // Attempt initial connection
    mcpService.connect().catch((error) => {
      console.warn('Initial MCP connection failed:', error);
      setLastError(error.message);
    });

    return () => {
      mcpService.disconnect();
    };
  }, []);

  return {
    isConnected,
    connectionStatus,
    lastError,
    mcpService,
    connect: () => mcpService.connect(),
    disconnect: () => mcpService.disconnect(),
    healthCheck: () => mcpService.healthCheck()
  };
};

export default mcpService;