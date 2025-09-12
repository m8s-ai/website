import type { BotMode, Question, EnhancedConversationData } from '@/types/conversation';
import type { AudioManagerRef } from '@/components/AudioManager';

export interface BotStrategyState {
  conversationHistory: Array<{role: 'user' | 'bot', content: string}>;
  suggestedQuestions: string[];
  isGenerating: boolean;
  conversationId: string;
}

export interface BotStrategyProps {
  audio: AudioManagerRef;
  onComplete: (data: EnhancedConversationData) => void;
  conversationId: string;
}

export abstract class BaseBotStrategy {
  protected audio: AudioManagerRef;
  protected onComplete: (data: EnhancedConversationData) => void;
  protected conversationId: string;
  protected state: BotStrategyState;
  protected stateUpdateCallback?: (state: Partial<BotStrategyState>) => void;

  constructor(props: BotStrategyProps) {
    this.audio = props.audio;
    this.onComplete = props.onComplete;
    this.conversationId = props.conversationId;
    
    this.state = {
      conversationHistory: [],
      suggestedQuestions: [],
      isGenerating: false,
      conversationId: props.conversationId
    };
  }

  // Abstract methods that must be implemented by each strategy
  abstract getBotMode(): BotMode;
  abstract getBotName(): string;
  abstract getBotDescription(): string;
  abstract getIcon(): string;
  abstract initialize(): Promise<void>;
  abstract handleUserInput(input: string): Promise<void>;
  abstract handleSuggestedQuestion(question: string): Promise<void>;
  abstract getCurrentQuestion(): Question | null;
  abstract isReadyForInput(): boolean;
  abstract cleanup(): void;

  // State management
  setStateUpdateCallback(callback: (state: Partial<BotStrategyState>) => void) {
    this.stateUpdateCallback = callback;
  }

  protected updateState(newState: Partial<BotStrategyState>) {
    this.state = { ...this.state, ...newState };
    if (this.stateUpdateCallback) {
      this.stateUpdateCallback(newState);
    }
  }

  getState(): BotStrategyState {
    return { ...this.state };
  }

  // Common utility methods
  protected async playSound(soundType: 'selection' | 'error' = 'selection') {
    try {
      if (soundType === 'selection') {
        await this.audio.playSelectionSound();
      } else {
        await this.audio.playSelectionSound(); // Use selection sound for error as well
      }
    } catch (error) {
      console.warn('Audio playback failed:', error);
    }
  }

  protected addToConversationHistory(role: 'user' | 'bot', content: string) {
    const newHistory = [...this.state.conversationHistory, { role, content }];
    this.updateState({ conversationHistory: newHistory });
    return newHistory;
  }

  protected setGenerating(isGenerating: boolean) {
    this.updateState({ isGenerating });
  }

  protected setSuggestedQuestions(questions: string[]) {
    this.updateState({ suggestedQuestions: questions });
  }

  protected clearConversation() {
    this.updateState({
      conversationHistory: [],
      suggestedQuestions: [],
      isGenerating: false
    });
  }
}