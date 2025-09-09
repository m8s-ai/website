# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Essential Commands
- `npm run dev` - Start development server on port 8080 with hot-reloading
- `npm run build` - Build production version of the application
- `npm run build:dev` - Build development version with debugging enabled
- `npm run lint` - Run ESLint to check code quality
- `npm run preview` - Preview the built application locally

### Development Workflow
- Use `npm run dev` for local development
- Run `npm run lint` before committing changes
- Use `npm run build` to test production builds

### Agent Commands
- **project-discovery** (Alex) - Project Discovery Consultant for business requirements gathering
  - Activate with: `/BMad:agents:discovery`
  - Commands: `*help`, `*business-discovery`, `*user-discovery`, `*problem-discovery`, `*success-discovery`, `*scope-discovery`, `*constraint-discovery`, `*competition-discovery`, `*vision-discovery`, `*generate-project-brief`, `*next-steps`, `*doc-out`, `*yolo`, `*exit`
  - Use when: Starting new projects with non-technical stakeholders or translating business needs into project specifications

## Project Architecture

This is a React + TypeScript application built with Vite, featuring a modern tech stack with:

### Core Technologies
- **Vite** - Build tool and development server
- **React 18** with TypeScript
- **React Router** for client-side routing
- **Tailwind CSS** for styling
- **shadcn/ui** component library (extensive set of Radix UI components)

### Key Architectural Patterns

#### Multi-language Support
- Built-in internationalization with English and Hebrew support
- `LanguageContext` provides translation system via `t()` function
- RTL (right-to-left) support for Hebrew
- Translations stored in `/src/contexts/LanguageContext.tsx`

#### Protected Routes
- Password protection system using session storage
- `Protected` component wraps sensitive routes like `/marketplace` and `/automation/:id`
- Authentication state managed via session storage key `site_authenticated`

#### Component Organization
- **Pages**: Main application pages in `/src/pages/`
- **Components**: Reusable components in `/src/components/`
  - `sections/`: Page-specific sections (Hero, CTA, Services, etc.)
  - `ui/`: shadcn/ui component library
- **Context**: Global state management in `/src/contexts/`
- **Types**: TypeScript interfaces in `/src/types/`

#### Styling System
- Tailwind CSS with custom design system
- CSS custom properties for colors, gradients, shadows
- Glass-morphism and modern UI effects
- Dark mode support configured
- Custom animations (fade-in, slide-up, glow, float, shimmer)

### Business Context
This is an AI automation company website with:
- Marketing pages for services, industries, solutions
- Multilingual support (English/Hebrew)
- Password-protected marketplace for automation workflows
- Focus on enterprise AI automation solutions

### Development Notes
- Uses path alias `@` for `./src`
- ESLint configured with React and TypeScript rules
- Lovable platform integration for collaborative development
- No testing framework configured - add tests as needed
- Uses React Query (@tanstack/react-query) for data fetching

### Component Naming
- Follow existing patterns: PascalCase for components
- Use descriptive names that match business domain
- Maintain consistency with existing shadcn/ui component structure