import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { Flow, FlowNode, FlowEdge } from '@/types/claude-flow';
import { apiClient } from '@/services/api-client';
import { logger } from '@/lib/env';

interface FlowState {
  // Current flows
  flows: Flow[];
  currentFlow: Flow | null;
  isLoading: boolean;
  error: string | null;
  
  // Flow editor state
  selectedNodes: string[];
  selectedEdges: string[];
  isEditing: boolean;
  hasUnsavedChanges: boolean;
  
  // Pagination
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  
  // Filters
  filters: {
    search: string;
    category: string;
    author: string;
  };
}

interface FlowActions {
  // Flow management
  loadFlows: (params?: {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
    author?: string;
  }) => Promise<void>;
  loadFlow: (id: string) => Promise<void>;
  createFlow: (flow: Omit<Flow, 'id' | 'created_at' | 'updated_at'>) => Promise<Flow>;
  updateFlow: (id: string, updates: Partial<Flow>) => Promise<void>;
  deleteFlow: (id: string) => Promise<void>;
  duplicateFlow: (id: string, name?: string) => Promise<Flow>;
  
  // Current flow operations
  setCurrentFlow: (flow: Flow | null) => void;
  updateCurrentFlow: (updates: Partial<Flow>) => void;
  addNode: (node: FlowNode) => void;
  updateNode: (nodeId: string, updates: Partial<FlowNode>) => void;
  removeNode: (nodeId: string) => void;
  addEdge: (edge: FlowEdge) => void;
  updateEdge: (edgeId: string, updates: Partial<FlowEdge>) => void;
  removeEdge: (edgeId: string) => void;
  
  // Selection management
  selectNode: (nodeId: string, multiSelect?: boolean) => void;
  selectEdge: (edgeId: string, multiSelect?: boolean) => void;
  clearSelection: () => void;
  selectMultiple: (nodeIds: string[], edgeIds: string[]) => void;
  
  // Editor state
  setIsEditing: (isEditing: boolean) => void;
  setHasUnsavedChanges: (hasChanges: boolean) => void;
  saveCurrentFlow: () => Promise<void>;
  discardChanges: () => void;
  
  // Filters and pagination
  setFilters: (filters: Partial<FlowState['filters']>) => void;
  setPagination: (pagination: Partial<FlowState['pagination']>) => void;
  
  // Error handling
  setError: (error: string | null) => void;
  clearError: () => void;
}

type FlowStore = FlowState & FlowActions;

export const useFlowStore = create<FlowStore>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        flows: [],
        currentFlow: null,
        isLoading: false,
        error: null,
        selectedNodes: [],
        selectedEdges: [],
        isEditing: false,
        hasUnsavedChanges: false,
        pagination: {
          page: 1,
          limit: 20,
          total: 0,
          totalPages: 0,
        },
        filters: {
          search: '',
          category: '',
          author: '',
        },

        // Actions
        loadFlows: async (params) => {
          set({ isLoading: true, error: null });
          try {
            const result = await apiClient.getFlows(params);
            set({
              flows: result.data,
              pagination: result.pagination,
              isLoading: false,
            });
          } catch (error) {
            logger.error('Failed to load flows:', error);
            set({
              error: error instanceof Error ? error.message : 'Failed to load flows',
              isLoading: false,
            });
          }
        },

        loadFlow: async (id) => {
          set({ isLoading: true, error: null });
          try {
            const flow = await apiClient.getFlow(id);
            set({
              currentFlow: flow,
              isLoading: false,
              hasUnsavedChanges: false,
            });
          } catch (error) {
            logger.error('Failed to load flow:', error);
            set({
              error: error instanceof Error ? error.message : 'Failed to load flow',
              isLoading: false,
            });
          }
        },

        createFlow: async (flowData) => {
          set({ isLoading: true, error: null });
          try {
            const newFlow = await apiClient.createFlow(flowData);
            set((state) => ({
              flows: [newFlow, ...state.flows],
              currentFlow: newFlow,
              isLoading: false,
              hasUnsavedChanges: false,
            }));
            return newFlow;
          } catch (error) {
            logger.error('Failed to create flow:', error);
            set({
              error: error instanceof Error ? error.message : 'Failed to create flow',
              isLoading: false,
            });
            throw error;
          }
        },

        updateFlow: async (id, updates) => {
          set({ isLoading: true, error: null });
          try {
            const updatedFlow = await apiClient.updateFlow(id, updates);
            set((state) => ({
              flows: state.flows.map((flow) =>
                flow.id === id ? updatedFlow : flow
              ),
              currentFlow: state.currentFlow?.id === id ? updatedFlow : state.currentFlow,
              isLoading: false,
              hasUnsavedChanges: false,
            }));
          } catch (error) {
            logger.error('Failed to update flow:', error);
            set({
              error: error instanceof Error ? error.message : 'Failed to update flow',
              isLoading: false,
            });
          }
        },

        deleteFlow: async (id) => {
          set({ isLoading: true, error: null });
          try {
            await apiClient.deleteFlow(id);
            set((state) => ({
              flows: state.flows.filter((flow) => flow.id !== id),
              currentFlow: state.currentFlow?.id === id ? null : state.currentFlow,
              isLoading: false,
            }));
          } catch (error) {
            logger.error('Failed to delete flow:', error);
            set({
              error: error instanceof Error ? error.message : 'Failed to delete flow',
              isLoading: false,
            });
          }
        },

        duplicateFlow: async (id, name) => {
          set({ isLoading: true, error: null });
          try {
            const duplicatedFlow = await apiClient.duplicateFlow(id, name);
            set((state) => ({
              flows: [duplicatedFlow, ...state.flows],
              isLoading: false,
            }));
            return duplicatedFlow;
          } catch (error) {
            logger.error('Failed to duplicate flow:', error);
            set({
              error: error instanceof Error ? error.message : 'Failed to duplicate flow',
              isLoading: false,
            });
            throw error;
          }
        },

        setCurrentFlow: (flow) => {
          set({
            currentFlow: flow,
            selectedNodes: [],
            selectedEdges: [],
            hasUnsavedChanges: false,
          });
        },

        updateCurrentFlow: (updates) => {
          set((state) => ({
            currentFlow: state.currentFlow
              ? { ...state.currentFlow, ...updates }
              : null,
            hasUnsavedChanges: true,
          }));
        },

        addNode: (node) => {
          set((state) => {
            if (!state.currentFlow) return state;
            return {
              currentFlow: {
                ...state.currentFlow,
                nodes: [...state.currentFlow.nodes, node],
              },
              hasUnsavedChanges: true,
            };
          });
        },

        updateNode: (nodeId, updates) => {
          set((state) => {
            if (!state.currentFlow) return state;
            return {
              currentFlow: {
                ...state.currentFlow,
                nodes: state.currentFlow.nodes.map((node) =>
                  node.id === nodeId ? { ...node, ...updates } : node
                ),
              },
              hasUnsavedChanges: true,
            };
          });
        },

        removeNode: (nodeId) => {
          set((state) => {
            if (!state.currentFlow) return state;
            return {
              currentFlow: {
                ...state.currentFlow,
                nodes: state.currentFlow.nodes.filter((node) => node.id !== nodeId),
                edges: state.currentFlow.edges.filter(
                  (edge) => edge.source !== nodeId && edge.target !== nodeId
                ),
              },
              selectedNodes: state.selectedNodes.filter((id) => id !== nodeId),
              hasUnsavedChanges: true,
            };
          });
        },

        addEdge: (edge) => {
          set((state) => {
            if (!state.currentFlow) return state;
            return {
              currentFlow: {
                ...state.currentFlow,
                edges: [...state.currentFlow.edges, edge],
              },
              hasUnsavedChanges: true,
            };
          });
        },

        updateEdge: (edgeId, updates) => {
          set((state) => {
            if (!state.currentFlow) return state;
            return {
              currentFlow: {
                ...state.currentFlow,
                edges: state.currentFlow.edges.map((edge) =>
                  edge.id === edgeId ? { ...edge, ...updates } : edge
                ),
              },
              hasUnsavedChanges: true,
            };
          });
        },

        removeEdge: (edgeId) => {
          set((state) => {
            if (!state.currentFlow) return state;
            return {
              currentFlow: {
                ...state.currentFlow,
                edges: state.currentFlow.edges.filter((edge) => edge.id !== edgeId),
              },
              selectedEdges: state.selectedEdges.filter((id) => id !== edgeId),
              hasUnsavedChanges: true,
            };
          });
        },

        selectNode: (nodeId, multiSelect = false) => {
          set((state) => ({
            selectedNodes: multiSelect
              ? state.selectedNodes.includes(nodeId)
                ? state.selectedNodes.filter((id) => id !== nodeId)
                : [...state.selectedNodes, nodeId]
              : [nodeId],
            selectedEdges: multiSelect ? state.selectedEdges : [],
          }));
        },

        selectEdge: (edgeId, multiSelect = false) => {
          set((state) => ({
            selectedEdges: multiSelect
              ? state.selectedEdges.includes(edgeId)
                ? state.selectedEdges.filter((id) => id !== edgeId)
                : [...state.selectedEdges, edgeId]
              : [edgeId],
            selectedNodes: multiSelect ? state.selectedNodes : [],
          }));
        },

        clearSelection: () => {
          set({ selectedNodes: [], selectedEdges: [] });
        },

        selectMultiple: (nodeIds, edgeIds) => {
          set({ selectedNodes: nodeIds, selectedEdges: edgeIds });
        },

        setIsEditing: (isEditing) => {
          set({ isEditing });
        },

        setHasUnsavedChanges: (hasChanges) => {
          set({ hasUnsavedChanges: hasChanges });
        },

        saveCurrentFlow: async () => {
          const { currentFlow, updateFlow } = get();
          if (!currentFlow) return;

          await updateFlow(currentFlow.id, currentFlow);
        },

        discardChanges: () => {
          const { currentFlow } = get();
          if (currentFlow) {
            get().loadFlow(currentFlow.id);
          }
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
        name: 'claude-flow-store',
        partialize: (state) => ({
          // Only persist filters and pagination
          filters: state.filters,
          pagination: { ...state.pagination, page: 1 }, // Reset page
        }),
      }
    ),
    {
      name: 'flow-store',
    }
  )
);