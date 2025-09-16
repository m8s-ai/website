# Claude Flow UI - React Project Setup

This document describes the complete Claude Flow UI setup that has been configured in this React project.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run linting
npm run lint

# Format code
npm run format
```

## 📁 Project Structure

```
src/
├── components/
│   └── claude-flow/          # Core Claude Flow UI components
│       ├── ErrorBoundary.tsx # Error handling component
│       ├── Layout.tsx        # Layout wrapper components
│       ├── Loading.tsx       # Loading state components
│       ├── Navigation.tsx    # Navigation component
│       ├── ThemeProvider.tsx # Theme management
│       └── index.ts         # Component exports
├── pages/
│   └── claude-flow/         # Claude Flow specific pages
│       ├── Dashboard.tsx    # Main dashboard
│       └── ClaudeFlowApp.tsx # Main app component
├── services/
│   ├── api-client.ts        # REST API client
│   ├── mcp-client.ts        # MCP protocol client
│   └── index.ts             # Service exports
├── stores/
│   ├── flow-store.ts        # Flow management state
│   ├── execution-store.ts   # Execution tracking state
│   ├── mcp-store.ts         # MCP connection state
│   └── index.ts             # Store exports
├── types/
│   ├── claude-flow.ts       # Core Claude Flow types
│   └── mcp.ts               # MCP protocol types
├── lib/
│   └── env.ts               # Environment configuration
└── hooks/                   # Custom React hooks
```

## 🎯 Core Features

### 1. **Modern React Architecture**
- React 18 with TypeScript
- Vite for fast development and building
- React Router for client-side routing
- Strict TypeScript configuration

### 2. **State Management**
- Zustand for global state management
- Organized stores for different domains:
  - `useFlowStore` - Flow creation and management
  - `useExecutionStore` - Flow execution tracking
  - `useMCPStore` - MCP server connection

### 3. **MCP Integration**
- Model Context Protocol client for Claude integration
- Real-time WebSocket communication
- Tool, resource, and prompt management
- Connection state monitoring with auto-reconnection

### 4. **Component Library**
- shadcn/ui component library
- Custom Claude Flow specific components
- Error boundaries for robust error handling
- Loading states and skeletons
- Responsive navigation

### 5. **Development Tools**
- ESLint with React and TypeScript rules
- Prettier for code formatting
- TypeScript strict mode
- Hot module replacement

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file with:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:3000/api
VITE_MCP_SERVER_URL=ws://localhost:3001
VITE_WEBSOCKET_URL=ws://localhost:3001/ws

# Feature Flags
VITE_ENABLE_REAL_TIME=true
VITE_ENABLE_COLLABORATION=false
VITE_ENABLE_ANALYTICS=true

# Development
VITE_DEBUG_MODE=false
VITE_LOG_LEVEL=info
```

### TypeScript Configuration

- Strict mode enabled for better type safety
- Path aliases configured (`@/` maps to `./src/`)
- Modern ES2020 target with DOM types

### Build Configuration

- Vite with React SWC plugin for fast compilation
- Optimized for modern browsers
- Code splitting and tree shaking
- Development server on localhost:8080

## 🎨 Theme System

The theme system supports:
- Light/Dark/System mode switching
- Custom color schemes
- CSS custom properties
- Tailwind CSS integration

```tsx
import { useTheme } from '@/components/claude-flow/ThemeProvider';

const MyComponent = () => {
  const { theme, toggleMode, isDark } = useTheme();
  // Use theme state...
};
```

## 📡 API Integration

### REST API Client

```tsx
import { apiClient } from '@/services/api-client';

// Flow management
const flows = await apiClient.getFlows();
const newFlow = await apiClient.createFlow(flowData);

// Flow execution
const execution = await apiClient.executeFlow(flowId, inputData);
```

### MCP Client

```tsx
import { mcpClient } from '@/services/mcp-client';

// Connect to MCP server
await mcpClient.connect();

// List available tools
const tools = await mcpClient.listTools();

// Call a tool
const result = await mcpClient.callTool({
  name: 'toolName',
  arguments: { param: 'value' }
});
```

## 🔄 State Management

### Flow Store

```tsx
import { useFlowStore } from '@/stores/flow-store';

const FlowComponent = () => {
  const {
    flows,
    currentFlow,
    isLoading,
    loadFlows,
    createFlow,
    updateFlow
  } = useFlowStore();

  // Component logic...
};
```

### Execution Store

```tsx
import { useExecutionStore } from '@/stores/execution-store';

const ExecutionComponent = () => {
  const {
    executions,
    liveExecutions,
    executeFlow,
    loadExecutions
  } = useExecutionStore();

  // Component logic...
};
```

## 🛠 Development Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues
- `npm run type-check` - Check TypeScript types
- `npm run format` - Format code with Prettier
- `npm run claude-flow:build` - Full build with checks

## 🚀 Deployment

### Production Build

```bash
npm run claude-flow:build
```

This runs type checking, linting, and builds the project.

### Environment Setup

For production, ensure these environment variables are set:
- `VITE_API_BASE_URL` - Production API URL
- `VITE_MCP_SERVER_URL` - Production MCP server URL
- `VITE_ENABLE_ANALYTICS` - Enable analytics
- `VITE_ENABLE_ERROR_REPORTING` - Enable error reporting

## 📚 Key Dependencies

### Runtime Dependencies
- **React 18** - UI library
- **TypeScript** - Type safety
- **React Router** - Client-side routing
- **Zustand** - State management
- **Socket.io Client** - Real-time communication
- **React Hot Toast** - Notifications
- **Lucide React** - Icons
- **Tailwind CSS** - Styling
- **shadcn/ui** - Component library

### Development Dependencies
- **Vite** - Build tool
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **TypeScript** - Type checking

## 🎯 Next Steps

1. **Add Flow Editor**: Create a visual flow editor component
2. **Implement Real-time Updates**: WebSocket integration for live execution updates
3. **Add Testing**: Unit and integration tests with Jest/Vitest
4. **Enhance Error Handling**: Better error boundaries and user feedback
5. **Add Analytics**: User behavior tracking and performance monitoring

## 🤝 Contributing

1. Follow the existing code style (Prettier enforced)
2. Use TypeScript strict mode
3. Add proper error handling
4. Test your changes
5. Update documentation as needed

## 📄 License

This project is part of the M8S AI automation platform.