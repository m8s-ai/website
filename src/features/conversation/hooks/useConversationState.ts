import { useState, useCallback, useRef } from 'react';
import type { BotMode } from '../organisms/ConversationHeader';
import type { ConversationMessage } from '../organisms/ConversationHistory';
import type { QuestionData } from '../organisms/QuestionInterface';

export interface ConversationState {
  // Core state
  conversationHistory: ConversationMessage[];
  userInput: string;
  selectedOption: number;
  suggestedQuestions: string[];
  currentQuestion: QuestionData | null;
  
  // UI state
  isLoading: boolean;
  error: string;
  currentMode: BotMode;
  conversationId: string;
  exchangeCount: number;
  
  // Project-specific state
  projectState: {
    currentWave: number;
    currentQuestion: number;
    responses: Record<string, string>;
    userInput: string;
    selectedOption: number;
    validationMessage: string;
  } | null;
}

export interface ConversationActions {
  setUserInput: (input: string) => void;
  setSelectedOption: (option: number) => void;
  setSuggestedQuestions: (questions: string[]) => void;
  setCurrentQuestion: (question: QuestionData | null) => void;
  setIsLoading: (loading: boolean) => void;
  setError: (error: string) => void;
  setCurrentMode: (mode: BotMode) => void;
  addToConversationHistory: (role: 'bot' | 'user', text: string) => void;
  clearConversation: () => void;
  setProjectState: (state: ConversationState['projectState']) => void;
  updateProjectState: (updates: Partial<NonNullable<ConversationState['projectState']>>) => void;
}

const initialState: ConversationState = {
  conversationHistory: [],
  userInput: '',
  selectedOption: 0,
  suggestedQuestions: [],
  currentQuestion: null,
  isLoading: false,
  error: '',
  currentMode: 'qa',
  conversationId: '',
  exchangeCount: 0,
  projectState: null
};

export const useConversationState = (initialMode?: BotMode): [ConversationState, ConversationActions] => {
  const [state, setState] = useState<ConversationState>({
    ...initialState,
    currentMode: initialMode || 'qa',
    conversationId: Math.random().toString(36).substring(7)
  });

  const stateRef = useRef(state);
  stateRef.current = state;

  const setUserInput = useCallback((input: string) => {
    setState(prev => ({ ...prev, userInput: input }));
  }, []);

  const setSelectedOption = useCallback((option: number) => {
    setState(prev => ({ ...prev, selectedOption: option }));
  }, []);

  const setSuggestedQuestions = useCallback((questions: string[]) => {
    setState(prev => ({ ...prev, suggestedQuestions: questions }));
  }, []);

  const setCurrentQuestion = useCallback((question: QuestionData | null) => {
    setState(prev => ({ ...prev, currentQuestion: question }));
  }, []);

  const setIsLoading = useCallback((loading: boolean) => {
    setState(prev => ({ ...prev, isLoading: loading }));
  }, []);

  const setError = useCallback((error: string) => {
    setState(prev => ({ ...prev, error }));
  }, []);

  const setCurrentMode = useCallback((mode: BotMode) => {
    setState(prev => ({ ...prev, currentMode: mode }));
  }, []);

  const addToConversationHistory = useCallback((role: 'bot' | 'user', text: string) => {
    setState(prev => ({
      ...prev,
      conversationHistory: [
        ...prev.conversationHistory,
        { role, text, timestamp: new Date() }
      ],
      exchangeCount: role === 'user' ? prev.exchangeCount + 1 : prev.exchangeCount
    }));
  }, []);

  const clearConversation = useCallback(() => {
    setState(prev => ({
      ...initialState,
      currentMode: prev.currentMode,
      conversationId: Math.random().toString(36).substring(7)
    }));
  }, []);

  const setProjectState = useCallback((projectState: ConversationState['projectState']) => {
    setState(prev => ({ ...prev, projectState }));
  }, []);

  const updateProjectState = useCallback((updates: Partial<NonNullable<ConversationState['projectState']>>) => {
    setState(prev => ({
      ...prev,
      projectState: prev.projectState ? { ...prev.projectState, ...updates } : null
    }));
  }, []);

  const actions: ConversationActions = {
    setUserInput,
    setSelectedOption,
    setSuggestedQuestions,
    setCurrentQuestion,
    setIsLoading,
    setError,
    setCurrentMode,
    addToConversationHistory,
    clearConversation,
    setProjectState,
    updateProjectState
  };

  return [state, actions];
};