import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { FlowExecution, ExecutionLogEntry } from '@/types/claude-flow';
import { apiClient } from '@/services/api-client';
import { logger } from '@/lib/env';

interface ExecutionState {
  // Executions
  executions: FlowExecution[];
  currentExecution: FlowExecution | null;
  isLoading: boolean;
  error: string | null;
  
  // Real-time updates
  liveExecutions: Map<string, FlowExecution>;
  
  // Logs
  executionLogs: Map<string, ExecutionLogEntry[]>;
  isLoadingLogs: boolean;
  
  // Pagination
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  
  // Filters
  filters: {
    flow_id: string;
    status: FlowExecution['status'] | '';
  };
}

interface ExecutionActions {
  // Execution management
  loadExecutions: (params?: {
    flow_id?: string;
    status?: FlowExecution['status'];
    page?: number;
    limit?: number;
  }) => Promise<void>;
  loadExecution: (id: string) => Promise<void>;
  executeFlow: (
    flowId: string,
    inputData?: Record<string, any>,
    options?: { async?: boolean; timeout?: number }
  ) => Promise<FlowExecution>;
  cancelExecution: (id: string) => Promise<void>;
  
  // Current execution
  setCurrentExecution: (execution: FlowExecution | null) => void;
  updateExecution: (id: string, updates: Partial<FlowExecution>) => void;
  
  // Real-time updates
  startLiveExecution: (execution: FlowExecution) => void;
  updateLiveExecution: (id: string, updates: Partial<FlowExecution>) => void;
  stopLiveExecution: (id: string) => void;
  clearLiveExecutions: () => void;
  
  // Logs
  loadExecutionLogs: (
    executionId: string,
    params?: {
      level?: ExecutionLogEntry['level'];
      node_id?: string;
      since?: string;
    }
  ) => Promise<void>;
  addLogEntry: (executionId: string, logEntry: ExecutionLogEntry) => void;
  clearLogs: (executionId: string) => void;
  
  // Filters and pagination
  setFilters: (filters: Partial<ExecutionState['filters']>) => void;
  setPagination: (pagination: Partial<ExecutionState['pagination']>) => void;
  
  // Error handling
  setError: (error: string | null) => void;
  clearError: () => void;
}

type ExecutionStore = ExecutionState & ExecutionActions;

export const useExecutionStore = create<ExecutionStore>()(
  devtools(
    (set, get) => ({
      // Initial state
      executions: [],
      currentExecution: null,
      isLoading: false,
      error: null,
      liveExecutions: new Map(),
      executionLogs: new Map(),
      isLoadingLogs: false,
      pagination: {
        page: 1,
        limit: 20,
        total: 0,
        totalPages: 0,
      },
      filters: {
        flow_id: '',
        status: '',
      },

      // Actions
      loadExecutions: async (params) => {
        set({ isLoading: true, error: null });
        try {
          const result = await apiClient.getExecutions(params);
          set({
            executions: result.data,
            pagination: result.pagination,
            isLoading: false,
          });
        } catch (error) {
          logger.error('Failed to load executions:', error);
          set({
            error: error instanceof Error ? error.message : 'Failed to load executions',
            isLoading: false,
          });
        }
      },

      loadExecution: async (id) => {
        set({ isLoading: true, error: null });
        try {
          const execution = await apiClient.getExecution(id);
          set({
            currentExecution: execution,
            isLoading: false,
          });
        } catch (error) {
          logger.error('Failed to load execution:', error);
          set({
            error: error instanceof Error ? error.message : 'Failed to load execution',
            isLoading: false,
          });
        }
      },

      executeFlow: async (flowId, inputData = {}, options = {}) => {
        set({ isLoading: true, error: null });
        try {
          const execution = await apiClient.executeFlow(flowId, inputData, options);
          
          // Add to executions list
          set((state) => ({
            executions: [execution, ...state.executions],
            currentExecution: execution,
            isLoading: false,
          }));

          // Start live tracking if async execution
          if (options.async !== false && execution.status === 'running') {
            get().startLiveExecution(execution);
          }

          return execution;
        } catch (error) {
          logger.error('Failed to execute flow:', error);
          set({
            error: error instanceof Error ? error.message : 'Failed to execute flow',
            isLoading: false,
          });
          throw error;
        }
      },

      cancelExecution: async (id) => {
        set({ isLoading: true, error: null });
        try {
          await apiClient.cancelExecution(id);
          
          // Update execution status
          set((state) => ({
            executions: state.executions.map((execution) =>
              execution.id === id 
                ? { ...execution, status: 'cancelled' }
                : execution
            ),
            currentExecution: state.currentExecution?.id === id
              ? { ...state.currentExecution, status: 'cancelled' }
              : state.currentExecution,
            isLoading: false,
          }));

          // Stop live tracking
          get().stopLiveExecution(id);
        } catch (error) {
          logger.error('Failed to cancel execution:', error);
          set({
            error: error instanceof Error ? error.message : 'Failed to cancel execution',
            isLoading: false,
          });
        }
      },

      setCurrentExecution: (execution) => {
        set({ currentExecution: execution });
      },

      updateExecution: (id, updates) => {
        set((state) => ({
          executions: state.executions.map((execution) =>
            execution.id === id ? { ...execution, ...updates } : execution
          ),
          currentExecution: state.currentExecution?.id === id
            ? { ...state.currentExecution, ...updates }
            : state.currentExecution,
        }));
      },

      startLiveExecution: (execution) => {
        set((state) => {
          const newLiveExecutions = new Map(state.liveExecutions);
          newLiveExecutions.set(execution.id, execution);
          return { liveExecutions: newLiveExecutions };
        });
      },

      updateLiveExecution: (id, updates) => {
        set((state) => {
          const newLiveExecutions = new Map(state.liveExecutions);
          const existing = newLiveExecutions.get(id);
          if (existing) {
            newLiveExecutions.set(id, { ...existing, ...updates });
          }
          return { liveExecutions: newLiveExecutions };
        });

        // Also update in main executions list
        get().updateExecution(id, updates);
      },

      stopLiveExecution: (id) => {
        set((state) => {
          const newLiveExecutions = new Map(state.liveExecutions);
          newLiveExecutions.delete(id);
          return { liveExecutions: newLiveExecutions };
        });
      },

      clearLiveExecutions: () => {
        set({ liveExecutions: new Map() });
      },

      loadExecutionLogs: async (executionId, params) => {
        set({ isLoadingLogs: true, error: null });
        try {
          const logs = await apiClient.getExecutionLogs(executionId, params);
          set((state) => {
            const newExecutionLogs = new Map(state.executionLogs);
            newExecutionLogs.set(executionId, logs);
            return {
              executionLogs: newExecutionLogs,
              isLoadingLogs: false,
            };
          });
        } catch (error) {
          logger.error('Failed to load execution logs:', error);
          set({
            error: error instanceof Error ? error.message : 'Failed to load logs',
            isLoadingLogs: false,
          });
        }
      },

      addLogEntry: (executionId, logEntry) => {
        set((state) => {
          const newExecutionLogs = new Map(state.executionLogs);
          const existingLogs = newExecutionLogs.get(executionId) || [];
          newExecutionLogs.set(executionId, [...existingLogs, logEntry]);
          return { executionLogs: newExecutionLogs };
        });
      },

      clearLogs: (executionId) => {
        set((state) => {
          const newExecutionLogs = new Map(state.executionLogs);
          newExecutionLogs.delete(executionId);
          return { executionLogs: newExecutionLogs };
        });
      },

      setFilters: (filters) => {
        set((state) => ({
          filters: { ...state.filters, ...filters },
        }));
      },

      setPagination: (pagination) => {
        set((state) => ({
          pagination: { ...state.pagination, ...pagination },
        }));
      },

      setError: (error) => {
        set({ error });
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'execution-store',
    }
  )
);