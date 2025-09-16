// MCP (Model Context Protocol) Types for Claude Flow

export interface MCPRequest {
  id: string;
  method: string;
  params?: Record<string, any>;
}

export interface MCPResponse {
  id: string;
  result?: any;
  error?: {
    code: number;
    message: string;
    data?: any;
  };
}

export interface MCPNotification {
  method: string;
  params?: Record<string, any>;
}

export interface MCPMessage {
  jsonrpc: '2.0';
  id?: string;
  method?: string;
  params?: Record<string, any>;
  result?: any;
  error?: {
    code: number;
    message: string;
    data?: any;
  };
}

export interface MCPServerInfo {
  name: string;
  version: string;
  capabilities: MCPCapabilities;
}

export interface MCPCapabilities {
  tools?: {
    listChanged?: boolean;
  };
  resources?: {
    subscribe?: boolean;
    listChanged?: boolean;
  };
  prompts?: {
    listChanged?: boolean;
  };
  logging?: {
    level?: 'debug' | 'info' | 'warning' | 'error';
  };
}

export interface MCPTool {
  name: string;
  description?: string;
  inputSchema: {
    type: 'object';
    properties: Record<string, any>;
    required?: string[];
  };
}

export interface MCPToolCall {
  name: string;
  arguments: Record<string, any>;
}

export interface MCPToolResult {
  content: Array<{
    type: 'text' | 'image' | 'resource';
    text?: string;
    data?: string;
    mimeType?: string;
  }>;
  isError?: boolean;
}

export interface MCPResource {
  uri: string;
  name: string;
  description?: string;
  mimeType?: string;
}

export interface MCPPrompt {
  name: string;
  description?: string;
  arguments?: Array<{
    name: string;
    description?: string;
    required?: boolean;
  }>;
}

export interface MCPLogEntry {
  level: 'debug' | 'info' | 'warning' | 'error';
  data: any;
  logger?: string;
}

// Connection states
export type MCPConnectionState = 
  | 'disconnected' 
  | 'connecting' 
  | 'connected' 
  | 'error' 
  | 'reconnecting';

export interface MCPConnectionInfo {
  state: MCPConnectionState;
  url: string;
  serverInfo?: MCPServerInfo;
  error?: string;
  lastConnected?: Date;
  reconnectAttempts: number;
}

// Event types
export interface MCPEventMap {
  'connection:state': MCPConnectionState;
  'connection:error': Error;
  'server:info': MCPServerInfo;
  'tools:updated': MCPTool[];
  'resources:updated': MCPResource[];
  'prompts:updated': MCPPrompt[];
  'log:entry': MCPLogEntry;
  'message:received': MCPMessage;
  'message:sent': MCPMessage;
}

export type MCPEventListener<T extends keyof MCPEventMap> = (
  data: MCPEventMap[T]
) => void;