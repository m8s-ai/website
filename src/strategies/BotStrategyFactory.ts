import { BaseBotStrategy, type BotStrategyProps } from './BaseBotStrategy';
import { QABotStrategy } from './QABotStrategy';
import { ProjectDiscoveryBotStrategy } from './ProjectDiscoveryBotStrategy';
import { useConversationAnalysis } from '@/hooks/useConversationAnalysis';
import { useN8nWebhook } from '@/hooks/useN8nWebhook';
import type { BotMode } from '@/types/conversation';

export interface BotStrategyDependencies {
  conversationAnalysis: ReturnType<typeof useConversationAnalysis>;
  n8nWebhook: ReturnType<typeof useN8nWebhook>;
}

export class BotStrategyFactory {
  private static strategies = new Map<string, BaseBotStrategy>();

  static createStrategy(
    mode: BotMode, 
    props: BotStrategyProps, 
    dependencies: BotStrategyDependencies
  ): BaseBotStrategy {
    const key = `${mode}-${props.conversationId}`;
    
    // Clean up existing strategy if it exists
    if (this.strategies.has(key)) {
      const existingStrategy = this.strategies.get(key);
      existingStrategy?.cleanup();
      this.strategies.delete(key);
    }

    let strategy: BaseBotStrategy;

    switch (mode) {
      case 'qa':
        strategy = new QABotStrategy(props, dependencies.n8nWebhook);
        break;
      
      case 'project':
        strategy = new ProjectDiscoveryBotStrategy(
          props, 
          dependencies.conversationAnalysis, 
          dependencies.n8nWebhook
        );
        break;
      
      default:
        throw new Error(`Unknown bot mode: ${mode}`);
    }

    this.strategies.set(key, strategy);
    return strategy;
  }

  static getStrategy(mode: BotMode, conversationId: string): BaseBotStrategy | null {
    const key = `${mode}-${conversationId}`;
    return this.strategies.get(key) || null;
  }

  static switchStrategy(
    fromMode: BotMode,
    toMode: BotMode,
    props: BotStrategyProps,
    dependencies: BotStrategyDependencies
  ): BaseBotStrategy {
    // Clean up the current strategy
    const fromKey = `${fromMode}-${props.conversationId}`;
    if (this.strategies.has(fromKey)) {
      const currentStrategy = this.strategies.get(fromKey);
      currentStrategy?.cleanup();
      this.strategies.delete(fromKey);
    }

    // Create and return new strategy
    return this.createStrategy(toMode, props, dependencies);
  }

  static cleanupStrategy(mode: BotMode, conversationId: string): void {
    const key = `${mode}-${conversationId}`;
    if (this.strategies.has(key)) {
      const strategy = this.strategies.get(key);
      strategy?.cleanup();
      this.strategies.delete(key);
    }
  }

  static cleanupAllStrategies(): void {
    this.strategies.forEach(strategy => strategy.cleanup());
    this.strategies.clear();
  }

  static getBotInfo(mode: BotMode): { name: string; description: string; icon: string } {
    switch (mode) {
      case 'qa':
        return {
          name: 'Business Q&A Assistant',
          description: 'Ask questions about m8s, our services, methodologies, and how we can help your business. Get instant answers from our knowledge base.',
          icon: '🧠'
        };
      
      case 'project':
        return {
          name: 'Project Discovery Assistant',
          description: 'Start an intelligent conversation to define your project requirements, get a detailed analysis, and receive a comprehensive project plan.',
          icon: '🚀'
        };
      
      default:
        return {
          name: 'Unknown Assistant',
          description: 'Unknown bot type',
          icon: '❓'
        };
    }
  }
}