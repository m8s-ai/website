import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import {
  MCPConnectionState,
  MCPConnectionInfo,
  MCPServerInfo,
  MCPTool,
  MCPResource,
  MCPPrompt,
  MCPLogEntry,
} from '@/types/mcp';
import { mcpClient } from '@/services/mcp-client';
import { logger } from '@/lib/env';

interface MCPState {
  // Connection
  connectionInfo: MCPConnectionInfo;
  serverInfo: MCPServerInfo | null;
  isConnecting: boolean;
  connectionError: string | null;
  
  // Capabilities
  tools: MCPTool[];
  resources: MCPResource[];
  prompts: MCPPrompt[];
  
  // Logs
  logs: MCPLogEntry[];
  maxLogs: number;
  
  // Loading states
  isLoadingTools: boolean;
  isLoadingResources: boolean;
  isLoadingPrompts: boolean;
  
  // Errors
  error: string | null;
}

interface MCPActions {
  // Connection management
  connect: () => Promise<void>;
  disconnect: () => void;
  reconnect: () => Promise<void>;
  
  // Server info
  updateServerInfo: (serverInfo: MCPServerInfo) => void;
  updateConnectionState: (state: MCPConnectionState) => void;
  
  // Tools
  loadTools: () => Promise<void>;
  updateTools: (tools: MCPTool[]) => void;
  callTool: (name: string, arguments_: Record<string, any>) => Promise<any>;
  
  // Resources
  loadResources: () => Promise<void>;
  updateResources: (resources: MCPResource[]) => void;
  readResource: (uri: string) => Promise<any>;
  
  // Prompts
  loadPrompts: () => Promise<void>;
  updatePrompts: (prompts: MCPPrompt[]) => void;
  getPrompt: (name: string, arguments_?: Record<string, any>) => Promise<any>;
  
  // Logs
  addLogEntry: (logEntry: MCPLogEntry) => void;
  clearLogs: () => void;
  setMaxLogs: (maxLogs: number) => void;
  
  // Error handling
  setError: (error: string | null) => void;
  setConnectionError: (error: string | null) => void;
  clearError: () => void;
}

type MCPStore = MCPState & MCPActions;

export const useMCPStore = create<MCPStore>()(
  devtools(
    (set, get) => ({
      // Initial state
      connectionInfo: {
        state: 'disconnected',
        url: '',
        reconnectAttempts: 0,
      },
      serverInfo: null,
      isConnecting: false,
      connectionError: null,
      tools: [],
      resources: [],
      prompts: [],
      logs: [],
      maxLogs: 1000,
      isLoadingTools: false,
      isLoadingResources: false,
      isLoadingPrompts: false,
      error: null,

      // Actions
      connect: async () => {
        if (get().isConnecting || get().connectionInfo.state === 'connected') {
          return;
        }

        set({ 
          isConnecting: true, 
          connectionError: null,
          error: null 
        });

        try {
          await mcpClient.connect();
          
          // Connection successful, load initial data
          const state = get();
          Promise.all([
            state.loadTools(),
            state.loadResources(),
            state.loadPrompts(),
          ]).catch((error) => {
            logger.error('Failed to load initial MCP data:', error);
          });

        } catch (error) {
          logger.error('Failed to connect to MCP server:', error);
          set({
            connectionError: error instanceof Error ? error.message : 'Connection failed',
          });
        } finally {
          set({ isConnecting: false });
        }
      },

      disconnect: () => {
        mcpClient.disconnect();
        set({
          connectionInfo: {
            ...get().connectionInfo,
            state: 'disconnected',
          },
          serverInfo: null,
          connectionError: null,
          tools: [],
          resources: [],
          prompts: [],
        });
      },

      reconnect: async () => {
        const { disconnect, connect } = get();
        disconnect();
        await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
        await connect();
      },

      updateServerInfo: (serverInfo) => {
        set({ serverInfo });
      },

      updateConnectionState: (state) => {
        set((prevState) => ({
          connectionInfo: {
            ...prevState.connectionInfo,
            state,
            lastConnected: state === 'connected' ? new Date() : prevState.connectionInfo.lastConnected,
          },
        }));
      },

      loadTools: async () => {
        if (!mcpClient.isConnected()) {
          return;
        }

        set({ isLoadingTools: true, error: null });
        try {
          const tools = await mcpClient.listTools();
          set({ tools, isLoadingTools: false });
        } catch (error) {
          logger.error('Failed to load tools:', error);
          set({
            error: error instanceof Error ? error.message : 'Failed to load tools',
            isLoadingTools: false,
          });
        }
      },

      updateTools: (tools) => {
        set({ tools });
      },

      callTool: async (name, arguments_) => {
        if (!mcpClient.isConnected()) {
          throw new Error('Not connected to MCP server');
        }

        try {
          const result = await mcpClient.callTool({ name, arguments: arguments_ });
          
          // Log the tool call
          get().addLogEntry({
            level: 'info',
            data: {
              action: 'tool_call',
              tool: name,
              arguments: arguments_,
              result,
            },
          });

          return result;
        } catch (error) {
          logger.error('Tool call failed:', error);
          
          // Log the error
          get().addLogEntry({
            level: 'error',
            data: {
              action: 'tool_call_failed',
              tool: name,
              arguments: arguments_,
              error: error instanceof Error ? error.message : 'Unknown error',
            },
          });

          throw error;
        }
      },

      loadResources: async () => {
        if (!mcpClient.isConnected()) {
          return;
        }

        set({ isLoadingResources: true, error: null });
        try {
          const resources = await mcpClient.listResources();
          set({ resources, isLoadingResources: false });
        } catch (error) {
          logger.error('Failed to load resources:', error);
          set({
            error: error instanceof Error ? error.message : 'Failed to load resources',
            isLoadingResources: false,
          });
        }
      },

      updateResources: (resources) => {
        set({ resources });
      },

      readResource: async (uri) => {
        if (!mcpClient.isConnected()) {
          throw new Error('Not connected to MCP server');
        }

        try {
          const result = await mcpClient.readResource(uri);
          
          // Log the resource read
          get().addLogEntry({
            level: 'info',
            data: {
              action: 'resource_read',
              uri,
              result,
            },
          });

          return result;
        } catch (error) {
          logger.error('Resource read failed:', error);
          
          // Log the error
          get().addLogEntry({
            level: 'error',
            data: {
              action: 'resource_read_failed',
              uri,
              error: error instanceof Error ? error.message : 'Unknown error',
            },
          });

          throw error;
        }
      },

      loadPrompts: async () => {
        if (!mcpClient.isConnected()) {
          return;
        }

        set({ isLoadingPrompts: true, error: null });
        try {
          const prompts = await mcpClient.listPrompts();
          set({ prompts, isLoadingPrompts: false });
        } catch (error) {
          logger.error('Failed to load prompts:', error);
          set({
            error: error instanceof Error ? error.message : 'Failed to load prompts',
            isLoadingPrompts: false,
          });
        }
      },

      updatePrompts: (prompts) => {
        set({ prompts });
      },

      getPrompt: async (name, arguments_) => {
        if (!mcpClient.isConnected()) {
          throw new Error('Not connected to MCP server');
        }

        try {
          const result = await mcpClient.getPrompt(name, arguments_);
          
          // Log the prompt get
          get().addLogEntry({
            level: 'info',
            data: {
              action: 'prompt_get',
              prompt: name,
              arguments: arguments_,
              result,
            },
          });

          return result;
        } catch (error) {
          logger.error('Get prompt failed:', error);
          
          // Log the error
          get().addLogEntry({
            level: 'error',
            data: {
              action: 'prompt_get_failed',
              prompt: name,
              arguments: arguments_,
              error: error instanceof Error ? error.message : 'Unknown error',
            },
          });

          throw error;
        }
      },

      addLogEntry: (logEntry) => {
        set((state) => {
          const newLogs = [
            {
              ...logEntry,
              timestamp: new Date().toISOString(),
            },
            ...state.logs,
          ].slice(0, state.maxLogs);

          return { logs: newLogs };
        });
      },

      clearLogs: () => {
        set({ logs: [] });
      },

      setMaxLogs: (maxLogs) => {
        set((state) => ({
          maxLogs,
          logs: state.logs.slice(0, maxLogs),
        }));
      },

      setError: (error) => {
        set({ error });
      },

      setConnectionError: (error) => {
        set({ connectionError: error });
      },

      clearError: () => {
        set({ error: null, connectionError: null });
      },
    }),
    {
      name: 'mcp-store',
    }
  )
);

// Setup MCP client event listeners
mcpClient.on('connection:state', (state) => {
  useMCPStore.getState().updateConnectionState(state);
});

mcpClient.on('connection:error', (error) => {
  useMCPStore.getState().setConnectionError(error.message);
});

mcpClient.on('server:info', (serverInfo) => {
  useMCPStore.getState().updateServerInfo(serverInfo);
});

mcpClient.on('tools:updated', (tools) => {
  useMCPStore.getState().updateTools(tools);
});

mcpClient.on('resources:updated', (resources) => {
  useMCPStore.getState().updateResources(resources);
});

mcpClient.on('prompts:updated', (prompts) => {
  useMCPStore.getState().updatePrompts(prompts);
});

mcpClient.on('log:entry', (logEntry) => {
  useMCPStore.getState().addLogEntry(logEntry);
});