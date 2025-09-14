import React, { memo } from 'react';
import { Container, Typography } from '@/components/atoms';
import { Navigation, type NavigationSection } from '@/components/organisms';
import PageTemplate from './PageTemplate';

export interface MainLayoutProps {
  children: React.ReactNode;
  navigationSections: NavigationSection[];
  activeSection: string;
  onNavigate: (sectionId: string) => void;
  className?: string;
}

const MainLayout = memo<MainLayoutProps>(({
  children,
  navigationSections,
  activeSection,
  onNavigate,
  className = ''
}) => {
  return (
    <PageTemplate className={className}>
      {/* Navigation */}
      <Navigation
        sections={navigationSections}
        activeSection={activeSection}
        onNavigate={onNavigate}
      />
      
      {/* Main Content */}
      <main className="relative z-10 pt-16">
        <Container size="full" padding="md" className="mx-auto">
          <div className="min-h-screen flex flex-col">
            {children}
          </div>
        </Container>
      </main>
      
      {/* Footer */}
      <footer className="relative z-10 border-t border-gray-800/50 bg-black/60 backdrop-blur-md">
        <Container size="full" padding="lg" className="mx-auto">
          <div className="text-center">
            <Typography variant="caption" color="muted">
              m8s.ai • Advanced Project Validation Systems • Est. 2024
            </Typography>
          </div>
        </Container>
      </footer>
    </PageTemplate>
  );
});

MainLayout.displayName = 'MainLayout';

export default MainLayout;