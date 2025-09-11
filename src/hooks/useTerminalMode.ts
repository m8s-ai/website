import { useState, useCallback } from 'react';
import { TerminalMode, TERMINAL_BOT_CONFIGS, TerminalBotConfig } from '@/types/terminalModes';

export const useTerminalMode = (initialMode: TerminalMode = 'project') => {
  const [currentMode, setCurrentMode] = useState<TerminalMode>(initialMode);

  const setMode = useCallback((mode: TerminalMode) => {
    setCurrentMode(mode);
  }, []);

  const getConfig = useCallback((mode: TerminalMode): TerminalBotConfig => {
    return TERMINAL_BOT_CONFIGS[mode];
  }, []);

  const getAllModes = useCallback((): TerminalBotConfig[] => {
    return Object.values(TERMINAL_BOT_CONFIGS);
  }, []);

  const getCurrentConfig = useCallback((): TerminalBotConfig => {
    return TERMINAL_BOT_CONFIGS[currentMode];
  }, [currentMode]);

  return {
    currentMode,
    setMode,
    getConfig,
    getAllModes,
    getCurrentConfig
  };
};