import { analytics } from './firebase';
import { logEvent, setUserProperties, setUserId } from 'firebase/analytics';

class AnalyticsManager {
  constructor() {
    this.sessionId = this.generateSessionId();
    this.sessionStart = Date.now();
    this.conversationStartTime = null;
    this.waveStartTime = null;
    this.questionStartTime = null;
    this.conversationPath = null;
    this.userId = this.generateUserId();
    
    this.initializeSession();
  }

  generateSessionId() {
    return 'sess_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
  }

  generateUserId() {
    let userId = localStorage.getItem('m8s_user_id');
    if (!userId) {
      userId = 'user_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
      localStorage.setItem('m8s_user_id', userId);
    }
    return userId;
  }

  initializeSession() {
    try {
      setUserId(analytics, this.userId);
      
      setUserProperties(analytics, {
        session_id: this.sessionId,
        first_visit: !localStorage.getItem('m8s_user_id'),
        user_agent: navigator.userAgent.substring(0, 50),
        screen_resolution: `${screen.width}x${screen.height}`,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
      });

      this.track('session_start', {
        session_id: this.sessionId,
        entry_page: window.location.pathname,
        referrer: document.referrer || 'direct'
      });
    } catch (error) {
      console.warn('Analytics initialization failed:', error);
    }
  }

  track(eventName, parameters = {}) {
    try {
      const enrichedParams = {
        ...parameters,
        session_id: this.sessionId,
        timestamp: Date.now(),
        page_url: window.location.pathname,
        session_duration: Math.round((Date.now() - this.sessionStart) / 1000)
      };

      const sanitizedParams = this.sanitizeParameters(enrichedParams);
      logEvent(analytics, eventName, sanitizedParams);
      console.log('🔥 Analytics:', eventName, sanitizedParams);
    } catch (error) {
      console.warn('Analytics tracking failed:', error);
    }
  }

  sanitizeParameters(params) {
    const sanitized = {};
    
    Object.entries(params).forEach(([key, value]) => {
      // Firebase parameter names must be <= 40 chars
      const sanitizedKey = key.length > 40 ? key.substring(0, 40) : key;
      
      // Firebase string values must be <= 100 chars
      if (typeof value === 'string' && value.length > 100) {
        sanitized[sanitizedKey] = value.substring(0, 97) + '...';
      } else if (typeof value === 'object' && value !== null) {
        const jsonString = JSON.stringify(value);
        sanitized[sanitizedKey] = jsonString.length > 100 
          ? jsonString.substring(0, 97) + '...'
          : jsonString;
      } else {
        sanitized[sanitizedKey] = value;
      }
    });
    
    return sanitized;
  }

  // Terminal events
  trackTerminalEvent(eventName, params = {}) {
    this.track(`terminal_${eventName}`, {
      ...params,
      component: 'terminal'
    });
  }

  // Navigation events
  trackNavigationEvent(eventName, params = {}) {
    this.track(`navigation_${eventName}`, {
      ...params,
      component: 'navigation'
    });
  }

  // Conversation events
  trackConversationEvent(eventName, params = {}) {
    this.track(`aria_${eventName}`, {
      ...params,
      component: 'aria_bot',
      conversation_path: this.conversationPath
    });
  }

  // Session management
  startConversation(path) {
    this.conversationPath = path;
    this.conversationStartTime = Date.now();
  }

  startWave(waveId) {
    this.waveStartTime = Date.now();
  }

  startQuestion(questionId) {
    this.questionStartTime = Date.now();
  }

  getSessionDuration() {
    return Math.round((Date.now() - this.sessionStart) / 1000);
  }

  getConversationDuration() {
    return this.conversationStartTime 
      ? Math.round((Date.now() - this.conversationStartTime) / 1000) 
      : 0;
  }

  getWaveDuration() {
    return this.waveStartTime 
      ? Math.round((Date.now() - this.waveStartTime) / 1000) 
      : 0;
  }

  getQuestionResponseTime() {
    return this.questionStartTime 
      ? Math.round((Date.now() - this.questionStartTime) / 1000) 
      : 0;
  }
}

export const analyticsManager = new AnalyticsManager();