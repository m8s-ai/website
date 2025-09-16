import { Flow, FlowExecution, ExecutionLogEntry } from '@/types/claude-flow';
import { config, logger } from '@/lib/env';

interface ApiResponse<T = any> {
  data: T;
  success: boolean;
  message?: string;
  errors?: string[];
}

interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface ApiRequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  body?: any;
  signal?: AbortSignal;
}

class ApiClient {
  private baseUrl: string;
  private defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  constructor(baseUrl: string = config.apiBaseUrl) {
    this.baseUrl = baseUrl.replace(/\/$/, ''); // Remove trailing slash
  }

  // Core HTTP methods
  private async request<T>(
    endpoint: string, 
    options: ApiRequestOptions = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    const { method = 'GET', headers = {}, body, signal } = options;

    const requestHeaders = {
      ...this.defaultHeaders,
      ...headers,
    };

    // Add authentication if available
    const token = this.getAuthToken();
    if (token) {
      requestHeaders.Authorization = `Bearer ${token}`;
    }

    const requestOptions: RequestInit = {
      method,
      headers: requestHeaders,
      signal,
    };

    if (body && method !== 'GET') {
      requestOptions.body = JSON.stringify(body);
    }

    try {
      logger.debug('API Request:', method, url, body);
      
      const response = await fetch(url, requestOptions);
      const responseData = await response.json();

      if (!response.ok) {
        throw new ApiError(
          responseData.message || 'Request failed',
          response.status,
          responseData
        );
      }

      logger.debug('API Response:', responseData);
      return responseData;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      
      logger.error('API Request failed:', error);
      throw new ApiError(
        error instanceof Error ? error.message : 'Network error',
        0,
        error
      );
    }
  }

  // Authentication
  private getAuthToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('claude-flow-token') || 
             sessionStorage.getItem('claude-flow-token');
    }
    return null;
  }

  setAuthToken(token: string, persistent: boolean = true): void {
    if (typeof window !== 'undefined') {
      if (persistent) {
        localStorage.setItem('claude-flow-token', token);
      } else {
        sessionStorage.setItem('claude-flow-token', token);
      }
    }
  }

  clearAuthToken(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('claude-flow-token');
      sessionStorage.removeItem('claude-flow-token');
    }
  }

  // Flow Management
  async getFlows(params?: {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
    author?: string;
  }): Promise<PaginatedResponse<Flow>> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }

    const endpoint = `/flows${queryParams.toString() ? `?${queryParams}` : ''}`;
    const response = await this.request<PaginatedResponse<Flow>>(endpoint);
    return response.data;
  }

  async getFlow(id: string): Promise<Flow> {
    const response = await this.request<Flow>(`/flows/${id}`);
    return response.data;
  }

  async createFlow(flow: Omit<Flow, 'id' | 'created_at' | 'updated_at'>): Promise<Flow> {
    const response = await this.request<Flow>('/flows', {
      method: 'POST',
      body: flow,
    });
    return response.data;
  }

  async updateFlow(id: string, updates: Partial<Flow>): Promise<Flow> {
    const response = await this.request<Flow>(`/flows/${id}`, {
      method: 'PUT',
      body: updates,
    });
    return response.data;
  }

  async deleteFlow(id: string): Promise<void> {
    await this.request(`/flows/${id}`, { method: 'DELETE' });
  }

  async duplicateFlow(id: string, name?: string): Promise<Flow> {
    const response = await this.request<Flow>(`/flows/${id}/duplicate`, {
      method: 'POST',
      body: { name },
    });
    return response.data;
  }

  // Flow Execution
  async executeFlow(
    flowId: string, 
    inputData: Record<string, any> = {},
    options: {
      async?: boolean;
      timeout?: number;
    } = {}
  ): Promise<FlowExecution> {
    const response = await this.request<FlowExecution>(`/flows/${flowId}/execute`, {
      method: 'POST',
      body: {
        input_data: inputData,
        options,
      },
    });
    return response.data;
  }

  async getExecution(id: string): Promise<FlowExecution> {
    const response = await this.request<FlowExecution>(`/executions/${id}`);
    return response.data;
  }

  async getExecutions(params?: {
    flow_id?: string;
    status?: FlowExecution['status'];
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<FlowExecution>> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }

    const endpoint = `/executions${queryParams.toString() ? `?${queryParams}` : ''}`;
    const response = await this.request<PaginatedResponse<FlowExecution>>(endpoint);
    return response.data;
  }

  async cancelExecution(id: string): Promise<void> {
    await this.request(`/executions/${id}/cancel`, { method: 'POST' });
  }

  async getExecutionLogs(
    executionId: string,
    params?: {
      level?: ExecutionLogEntry['level'];
      node_id?: string;
      since?: string;
    }
  ): Promise<ExecutionLogEntry[]> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }

    const endpoint = `/executions/${executionId}/logs${queryParams.toString() ? `?${queryParams}` : ''}`;
    const response = await this.request<ExecutionLogEntry[]>(endpoint);
    return response.data;
  }

  // Templates
  async getFlowTemplates(): Promise<Flow[]> {
    const response = await this.request<Flow[]>('/templates');
    return response.data;
  }

  async createFlowFromTemplate(templateId: string, name: string): Promise<Flow> {
    const response = await this.request<Flow>(`/templates/${templateId}/create`, {
      method: 'POST',
      body: { name },
    });
    return response.data;
  }

  // Health Check
  async healthCheck(): Promise<{
    status: 'healthy' | 'unhealthy';
    timestamp: string;
    version: string;
    uptime: number;
  }> {
    const response = await this.request('/health');
    return response.data;
  }

  // File Upload (for flow import/export)
  async uploadFile(file: File, type: 'flow' | 'template' = 'flow'): Promise<{
    id: string;
    filename: string;
    size: number;
  }> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    const response = await fetch(`${this.baseUrl}/upload`, {
      method: 'POST',
      headers: {
        ...this.getAuthHeaders(),
      },
      body: formData,
    });

    if (!response.ok) {
      throw new ApiError('Upload failed', response.status);
    }

    const data = await response.json();
    return data.data;
  }

  async downloadFlow(id: string): Promise<Blob> {
    const token = this.getAuthToken();
    const headers: Record<string, string> = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${this.baseUrl}/flows/${id}/export`, {
      headers,
    });

    if (!response.ok) {
      throw new ApiError('Download failed', response.status);
    }

    return response.blob();
  }

  private getAuthHeaders(): Record<string, string> {
    const token = this.getAuthToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }
}

// Custom error class for API errors
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// Create and export singleton instance
export const apiClient = new ApiClient();

// Export class for testing or multiple instances
export { ApiClient };