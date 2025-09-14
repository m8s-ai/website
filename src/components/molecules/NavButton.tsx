import React, { memo } from 'react';
import { Button } from '@/components/atoms';
import { useLanguage } from '@/contexts/LanguageContext';

export interface NavButtonProps {
  label: string;
  isActive?: boolean;
  onClick: () => void;
  className?: string;
}

const NavButton = memo<NavButtonProps>(({
  label,
  isActive = false,
  onClick,
  className = ''
}) => {
  const { t } = useLanguage();

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={onClick}
      className={`
        px-4 py-2 font-medium text-sm transition-all duration-200 rounded-lg
        ${isActive 
          ? 'text-emerald-400 bg-emerald-400/10' 
          : 'text-gray-300 hover:text-emerald-400 hover:bg-emerald-400/5'
        }
        ${className}
      `}
    >
      {label}
    </Button>
  );
});

NavButton.displayName = 'NavButton';

export default NavButton;