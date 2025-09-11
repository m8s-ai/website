import { useState, useEffect, useCallback } from 'react';
import { analyticsManager } from '@/utils/analyticsManager';

export const useWebsiteAnalytics = () => {
  const [sessionStartTime] = useState(Date.now());

  // Track website load
  useEffect(() => {
    analyticsManager.trackNavigationEvent('website_loaded', {
      initial_section: 'home',
      referrer: document.referrer || 'direct'
    });
  }, []);

  const trackNavigation = useCallback((sectionId: string, previousSection: string) => {
    const sessionDuration = Math.round((Date.now() - sessionStartTime) / 1000);
    
    analyticsManager.trackNavigationEvent('menu_clicked', {
      section_selected: sectionId,
      previous_section: previousSection,
      session_duration: sessionDuration
    });
  }, [sessionStartTime]);

  const trackCTAClick = useCallback((buttonType: string, buttonLocation: string, currentSection: string) => {
    const sessionDuration = Math.round((Date.now() - sessionStartTime) / 1000);
    
    analyticsManager.trackNavigationEvent('cta_clicked', {
      button_type: buttonType,
      button_location: buttonLocation,
      current_section: currentSection,
      session_duration: sessionDuration
    });
  }, [sessionStartTime]);

  const trackContactInteraction = useCallback((interactionType: string, contactMethod: string, context: string) => {
    const sessionDuration = Math.round((Date.now() - sessionStartTime) / 1000);
    
    analyticsManager.trackNavigationEvent('contact_interaction', {
      interaction_type: interactionType,
      contact_method: contactMethod,
      email: 'contact@m8s.ai',
      context: context,
      session_duration: sessionDuration
    });
  }, [sessionStartTime]);

  const getSessionDuration = useCallback(() => {
    return Math.round((Date.now() - sessionStartTime) / 1000);
  }, [sessionStartTime]);

  return {
    sessionStartTime,
    trackNavigation,
    trackCTAClick,
    trackContactInteraction,
    getSessionDuration
  };
};