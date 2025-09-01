import React from 'react';
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

export const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      onClick={toggleTheme}
      size="icon"
      variant="ghost"
      className="w-10 h-10 hover:bg-secondary/50 transition-all duration-300"
      aria-label={`Switch to ${theme === 'dark' ? 'bright' : 'dark'} theme`}
    >
      {theme === 'dark' ? (
        <Sun className="w-5 h-5 text-foreground" />
      ) : (
        <Moon className="w-5 h-5 text-foreground" />
      )}
    </Button>
  );
};