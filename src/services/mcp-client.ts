import { io, Socket } from 'socket.io-client';
import { 
  MCPMessage, 
  MCPRequest, 
  MCPResponse, 
  MCPConnectionState, 
  MCPConnectionInfo,
  MCPServerInfo,
  MCPTool,
  MCPResource,
  MCPPrompt,
  MCPToolCall,
  MCPToolResult,
  MCPEventMap,
  MCPEventListener,
} from '@/types/mcp';
import { config, logger } from '@/lib/env';

class MCPClient {
  private socket: Socket | null = null;
  private connectionState: MCPConnectionState = 'disconnected';
  private serverInfo: MCPServerInfo | null = null;
  private requestId = 0;
  private pendingRequests = new Map<string, {
    resolve: (value: any) => void;
    reject: (error: Error) => void;
    timeout: NodeJS.Timeout;
  }>();
  private eventListeners = new Map<keyof MCPEventMap, Set<MCPEventListener<any>>>();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;

  constructor(private url: string = config.mcpServerUrl) {}

  // Connection management
  async connect(): Promise<void> {
    if (this.connectionState === 'connected' || this.connectionState === 'connecting') {
      return;
    }

    this.setConnectionState('connecting');
    logger.info('Connecting to MCP server:', this.url);

    try {
      this.socket = io(this.url, {
        transports: ['websocket'],
        timeout: 10000,
        reconnection: false, // We'll handle reconnection manually
      });

      this.setupSocketListeners();
      
      // Wait for connection
      await new Promise<void>((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('Connection timeout'));
        }, 10000);

        this.socket!.on('connect', () => {
          clearTimeout(timeout);
          resolve();
        });

        this.socket!.on('connect_error', (error) => {
          clearTimeout(timeout);
          reject(error);
        });
      });

      // Initialize the MCP session
      await this.initialize();
      
      this.setConnectionState('connected');
      this.reconnectAttempts = 0;
      logger.info('Connected to MCP server');

    } catch (error) {
      logger.error('Failed to connect to MCP server:', error);
      this.setConnectionState('error');
      this.emit('connection:error', error as Error);
      
      // Attempt reconnection
      this.scheduleReconnect();
      throw error;
    }
  }

  disconnect(): void {
    logger.info('Disconnecting from MCP server');
    
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    
    // Clear pending requests
    this.pendingRequests.forEach(({ reject, timeout }) => {
      clearTimeout(timeout);
      reject(new Error('Connection closed'));
    });
    this.pendingRequests.clear();
    
    this.setConnectionState('disconnected');
  }

  // MCP Protocol methods
  private async initialize(): Promise<void> {
    const response = await this.request('initialize', {
      protocolVersion: '2024-11-05',
      capabilities: {
        roots: {
          listChanged: true,
        },
        sampling: {},
      },
      clientInfo: {
        name: config.appName,
        version: config.appVersion,
      },
    });

    this.serverInfo = {
      name: response.serverInfo?.name || 'Unknown',
      version: response.serverInfo?.version || '1.0.0',
      capabilities: response.capabilities || {},
    };

    this.emit('server:info', this.serverInfo);
    logger.info('MCP session initialized:', this.serverInfo);
  }

  async listTools(): Promise<MCPTool[]> {
    const response = await this.request('tools/list');
    const tools = response.tools || [];
    this.emit('tools:updated', tools);
    return tools;
  }

  async callTool(toolCall: MCPToolCall): Promise<MCPToolResult> {
    return await this.request('tools/call', {
      name: toolCall.name,
      arguments: toolCall.arguments,
    });
  }

  async listResources(): Promise<MCPResource[]> {
    const response = await this.request('resources/list');
    const resources = response.resources || [];
    this.emit('resources:updated', resources);
    return resources;
  }

  async readResource(uri: string): Promise<any> {
    return await this.request('resources/read', { uri });
  }

  async listPrompts(): Promise<MCPPrompt[]> {
    const response = await this.request('prompts/list');
    const prompts = response.prompts || [];
    this.emit('prompts:updated', prompts);
    return prompts;
  }

  async getPrompt(name: string, arguments_?: Record<string, any>): Promise<any> {
    return await this.request('prompts/get', { 
      name, 
      arguments: arguments_ 
    });
  }

  // Core request/response handling
  private async request(method: string, params?: any): Promise<any> {
    if (!this.socket || this.connectionState !== 'connected') {
      throw new Error('Not connected to MCP server');
    }

    const id = `req-${++this.requestId}`;
    const message: MCPRequest = {
      id,
      method,
      params,
    };

    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        this.pendingRequests.delete(id);
        reject(new Error(`Request timeout: ${method}`));
      }, 30000);

      this.pendingRequests.set(id, { resolve, reject, timeout });
      
      this.socket!.emit('mcp-message', {
        jsonrpc: '2.0',
        ...message,
      });

      this.emit('message:sent', { jsonrpc: '2.0', ...message });
      logger.debug('Sent MCP request:', method, params);
    });
  }

  // Socket event handlers
  private setupSocketListeners(): void {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      logger.debug('Socket connected');
    });

    this.socket.on('disconnect', (reason) => {
      logger.warn('Socket disconnected:', reason);
      this.setConnectionState('disconnected');
      
      if (reason === 'io server disconnect') {
        // Server initiated disconnect, don't reconnect
        return;
      }
      
      // Attempt reconnection for other disconnect reasons
      this.scheduleReconnect();
    });

    this.socket.on('connect_error', (error) => {
      logger.error('Socket connection error:', error);
      this.emit('connection:error', error);
    });

    this.socket.on('mcp-message', (message: MCPMessage) => {
      this.handleMessage(message);
    });

    this.socket.on('mcp-notification', (notification: any) => {
      this.handleNotification(notification);
    });
  }

  private handleMessage(message: MCPMessage): void {
    this.emit('message:received', message);
    logger.debug('Received MCP message:', message);

    if (message.id) {
      // This is a response to a request
      const pending = this.pendingRequests.get(message.id);
      if (pending) {
        clearTimeout(pending.timeout);
        this.pendingRequests.delete(message.id);

        if (message.error) {
          pending.reject(new Error(message.error.message));
        } else {
          pending.resolve(message.result);
        }
      }
    }
  }

  private handleNotification(notification: any): void {
    logger.debug('Received MCP notification:', notification);
    
    switch (notification.method) {
      case 'notifications/tools/list_changed':
        this.listTools().catch(logger.error);
        break;
      case 'notifications/resources/list_changed':
        this.listResources().catch(logger.error);
        break;
      case 'notifications/prompts/list_changed':
        this.listPrompts().catch(logger.error);
        break;
      case 'notifications/message':
        this.emit('log:entry', {
          level: notification.params?.level || 'info',
          data: notification.params?.data,
          logger: notification.params?.logger,
        });
        break;
    }
  }

  // Connection state management
  private setConnectionState(state: MCPConnectionState): void {
    if (this.connectionState !== state) {
      this.connectionState = state;
      this.emit('connection:state', state);
      logger.debug('MCP connection state changed:', state);
    }
  }

  private scheduleReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      logger.error('Max reconnection attempts reached');
      this.setConnectionState('error');
      return;
    }

    this.reconnectAttempts++;
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);
    
    logger.info(`Scheduling reconnection attempt ${this.reconnectAttempts} in ${delay}ms`);
    this.setConnectionState('reconnecting');

    setTimeout(() => {
      this.connect().catch((error) => {
        logger.error('Reconnection failed:', error);
      });
    }, delay);
  }

  // Event system
  on<T extends keyof MCPEventMap>(event: T, listener: MCPEventListener<T>): void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, new Set());
    }
    this.eventListeners.get(event)!.add(listener);
  }

  off<T extends keyof MCPEventMap>(event: T, listener: MCPEventListener<T>): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.delete(listener);
    }
  }

  private emit<T extends keyof MCPEventMap>(event: T, data: MCPEventMap[T]): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.forEach((listener) => {
        try {
          listener(data);
        } catch (error) {
          logger.error('Error in MCP event listener:', error);
        }
      });
    }
  }

  // Getters
  getConnectionInfo(): MCPConnectionInfo {
    return {
      state: this.connectionState,
      url: this.url,
      serverInfo: this.serverInfo || undefined,
      reconnectAttempts: this.reconnectAttempts,
      lastConnected: this.connectionState === 'connected' ? new Date() : undefined,
    };
  }

  isConnected(): boolean {
    return this.connectionState === 'connected';
  }

  getServerInfo(): MCPServerInfo | null {
    return this.serverInfo;
  }
}

// Create and export singleton instance
export const mcpClient = new MCPClient();

// Export class for testing or multiple instances
export { MCPClient };