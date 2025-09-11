# Terminal Website Architecture

This directory contains the refactored, modular components for the Terminal Website. The original monolithic `TerminalWebsite.tsx` has been broken down into smaller, focused components following good architectural patterns.

## Architecture Overview

### 1. Terminal Mode System (`/types/terminalModes.ts`, `/hooks/useTerminalMode.ts`)
- **Extensible bot types**: `project`, `qa`, `demo`, `support`
- **Easy to add new flows**: Simply add new modes to the `TerminalMode` type and `TERMINAL_BOT_CONFIGS`
- **Centralized configuration**: Each bot mode has its own config with name, description, capabilities, etc.

### 2. Component Structure

#### Core Components
- **`TerminalWebsiteRefactored.tsx`**: Main container component using all modular pieces
- **`TerminalNavigation.tsx`**: Navigation with mobile/desktop logic
- **`TerminalModal.tsx`**: Terminal overlay with improved keyboard handling
- **`TerminalSectionRenderer.tsx`**: Centralized section rendering logic

#### Section Components
- **`TerminalHeroSection.tsx`**: Hero section with CTA buttons
- **`UserTypesSection.tsx`**: User type cards (businesses, individuals, companies)
- **`WhatWeDoSection.tsx`**: Service description section
- **`TerminalPricingSection.tsx`**: Pricing and development services
- **`TerminalContactSection.tsx`**: Contact information and CTA
- **`TerminalAboutSection.tsx`**: About us and metrics

### 3. Custom Hooks
- **`useTerminalMode.ts`**: Manages terminal bot modes and configurations
- **`useWebsiteAnalytics.ts`**: Centralized analytics tracking for navigation, CTAs, and interactions

## Benefits of This Architecture

### 1. **Separation of Concerns**
- Each component has a single responsibility
- Terminal modes are managed independently
- Analytics logic is centralized and reusable

### 2. **Extensibility**
- Adding new bot flows requires minimal changes:
  1. Add new mode to `TerminalMode` type
  2. Add configuration to `TERMINAL_BOT_CONFIGS`
  3. Optionally add custom logic in components

### 3. **Maintainability**
- Smaller, focused components are easier to understand and modify
- Shared logic is extracted into hooks
- Clear separation between presentation and business logic

### 4. **Reusability**
- Section components can be reused in other parts of the application
- Hooks can be used by other components
- Terminal mode system can be extended for other features

### 5. **Type Safety**
- Full TypeScript support with proper type definitions
- Terminal modes are type-safe and prevent invalid configurations

## Usage

### Using the Refactored Component
```tsx
import { TerminalWebsiteRefactored } from '@/components/terminal';

// Replace the original TerminalWebsite with the refactored version
<TerminalWebsiteRefactored className="custom-class" />
```

### Adding a New Bot Mode
1. Update the type:
```tsx
export type TerminalMode = 'project' | 'qa' | 'demo' | 'support' | 'newMode';
```

2. Add configuration:
```tsx
export const TERMINAL_BOT_CONFIGS: Record<TerminalMode, TerminalBotConfig> = {
  // ... existing configs
  newMode: {
    id: 'newMode',
    name: 'New Mode Assistant',
    description: 'Description of what this mode does',
    initialPrompt: 'Welcome message for new mode',
    capabilities: ['Feature 1', 'Feature 2'],
    analyticsCategory: 'new_mode_interaction'
  }
};
```

3. Update the mapping in `TerminalOverlay.tsx` if needed:
```tsx
const mapToBotMode = (terminalMode: TerminalMode): 'qa' | 'project' => {
  switch (terminalMode) {
    case 'newMode':
      return 'qa'; // or 'project' depending on behavior
    // ... rest of cases
  }
};
```

### Using Individual Components
```tsx
import { 
  TerminalHeroSection, 
  TerminalNavigation, 
  useTerminalMode,
  useWebsiteAnalytics 
} from '@/components/terminal';

// Use components individually as needed
```

## Migration Notes

The refactored components maintain the same visual appearance and functionality as the original `TerminalWebsite.tsx`. To migrate:

1. Replace imports from `TerminalWebsite` to `TerminalWebsiteRefactored`
2. Update any direct references to internal state or methods (now handled by hooks)
3. Test all functionality to ensure analytics and terminal modes work as expected

## Future Enhancements

1. **Dynamic Mode Loading**: Load bot configurations from a CMS or API
2. **A/B Testing**: Easy to test different bot modes or section layouts
3. **Personalization**: Customize sections based on user preferences or history
4. **Performance**: Lazy load sections or implement virtualization for large content
5. **Multi-language**: Extend terminal mode configs to support multiple languages