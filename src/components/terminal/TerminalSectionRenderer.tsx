import React from 'react';
import { TerminalPreview } from '../TerminalPreview';
import { TechnologiesSection } from '../sections/TechnologiesSection';
import { TerminalHeroSection } from './TerminalHeroSection';
import { WhatWeDoSection } from './WhatWeDoSection';
import { UserTypesSection } from './UserTypesSection';
import { TerminalPricingSection } from './TerminalPricingSection';
import { TerminalContactSection } from './TerminalContactSection';
import { TerminalAboutSection } from './TerminalAboutSection';

interface TerminalSectionRendererProps {
  sectionId: string;
  onStartProject: () => void;
  onLearnMore: () => void;
  onTerminalPreviewExpand: () => void;
  sessionStartTime: number;
  audio: {
    playSelectionSound: () => Promise<void>;
  };
}

export const TerminalSectionRenderer: React.FC<TerminalSectionRendererProps> = ({
  sectionId,
  onStartProject,
  onLearnMore,
  onTerminalPreviewExpand,
  sessionStartTime,
  audio
}) => {
  switch (sectionId) {
    case 'home':
      return (
        <div className="space-y-16">
          {/* Hero Section */}
          <TerminalHeroSection 
            onStartProject={onStartProject}
            onLearnMore={onLearnMore}
          />

          {/* Terminal Preview */}
          <TerminalPreview onExpand={onTerminalPreviewExpand} />

          {/* What We Do */}
          <WhatWeDoSection />
          
          {/* For Different User Types */}
          <UserTypesSection />
          
          {/* Technologies Section */}
          <TechnologiesSection />
        </div>
      );

    case 'pricing':
      return (
        <TerminalPricingSection 
          sessionStartTime={sessionStartTime}
          audio={audio}
        />
      );

    case 'contact':
      return (
        <TerminalContactSection 
          sessionStartTime={sessionStartTime}
          audio={audio}
        />
      );

    case 'about':
      return <TerminalAboutSection />;

    default:
      return null;
  }
};