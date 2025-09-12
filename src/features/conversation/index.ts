// Main template export
export { ConversationTemplate } from './templates/ConversationTemplate';
export type { ConversationTemplateProps } from './templates/ConversationTemplate';

// Organism exports
export { ConversationHeader } from './organisms/ConversationHeader';
export type { ConversationHeaderProps, BotMode } from './organisms/ConversationHeader';

export { ConversationHistory } from './organisms/ConversationHistory';
export type { ConversationHistoryProps, ConversationMessage } from './organisms/ConversationHistory';

export { QuestionInterface } from './organisms/QuestionInterface';
export type { QuestionInterfaceProps, QuestionData } from './organisms/QuestionInterface';

// Molecule exports
export { ChatMessage } from './molecules/ChatMessage';
export type { ChatMessageProps } from './molecules/ChatMessage';

export { MultipleChoiceQuestion } from './molecules/MultipleChoiceQuestion';
export type { MultipleChoiceQuestionProps } from './molecules/MultipleChoiceQuestion';

export { TextInputQuestion } from './molecules/TextInputQuestion';
export type { TextInputQuestionProps } from './molecules/TextInputQuestion';

// Atom exports
export { Avatar } from './atoms/Avatar';
export type { AvatarProps } from './atoms/Avatar';

export { Button } from './atoms/Button';
export type { ButtonProps } from './atoms/Button';

export { Input } from './atoms/Input';
export type { InputProps } from './atoms/Input';

export { LoadingDots } from './atoms/LoadingDots';
export type { LoadingDotsProps } from './atoms/LoadingDots';

// Hook exports
export { useConversationState } from './hooks/useConversationState';
export type { ConversationState, ConversationActions } from './hooks/useConversationState';

export { useBotStrategy } from './hooks/useBotStrategy';
export type { UseBotStrategyProps } from './hooks/useBotStrategy';