import { createContext, useContext, useState, ReactNode } from 'react';

interface ChatWindowContextType {
  isChatExpanded: boolean;
  isChatMinimized: boolean;
  setIsChatExpanded: (expanded: boolean) => void;
  setIsChatMinimized: (minimized: boolean) => void;
}

const ChatWindowContext = createContext<ChatWindowContextType | undefined>(undefined);

export const ChatWindowProvider = ({ children }: { children: ReactNode }) => {
  const [isChatExpanded, setIsChatExpanded] = useState(false);
  const [isChatMinimized, setIsChatMinimized] = useState(false);

  return (
    <ChatWindowContext.Provider value={{
      isChatExpanded,
      isChatMinimized,
      setIsChatExpanded,
      setIsChatMinimized
    }}>
      {children}
    </ChatWindowContext.Provider>
  );
};

export const useChatWindow = () => {
  const context = useContext(ChatWindowContext);
  if (context === undefined) {
    throw new Error('useChatWindow must be used within a ChatWindowProvider');
  }
  return context;
};
