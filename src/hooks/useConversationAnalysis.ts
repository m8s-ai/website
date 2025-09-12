import { useCallback } from 'react';
import type { ProjectInsight, EnhancedConversationData } from '@/types/conversation';

export const useConversationAnalysis = () => {
  // Smart analysis functions
  const analyzeProjectComplexity = useCallback((responses: Record<string, string>): 'simple' | 'standard' | 'complex' => {
    const factors = {
      integration: responses.integration_needs?.includes('several') ? 2 : responses.integration_needs?.includes('one') ? 1 : 0,
      scale: responses.project_scale?.includes('Enterprise') ? 3 : responses.project_scale?.includes('Production') ? 2 : 1,
      timeline: responses.timeline_expectations?.includes('ASAP') ? 2 : 0,
      experience: responses.technical_experience?.includes('No technical') ? 2 : responses.technical_experience?.includes('Limited') ? 1 : 0
    };
    
    const totalComplexity = factors.integration + factors.scale + factors.timeline + factors.experience;
    return totalComplexity >= 6 ? 'complex' : totalComplexity >= 3 ? 'standard' : 'simple';
  }, []);

  const generateProjectInsights = useCallback((responses: Record<string, string>): ProjectInsight[] => {
    const insights: ProjectInsight[] = [];
    
    // Business impact analysis
    if (responses.business_problem?.length > 20) {
      insights.push({
        category: 'immediate',
        description: 'Clear business problem identified with good articulation',
        impact: 'high',
        source: 'business_problem_analysis'
      });
    }
    
    // Timeline risk assessment
    if (responses.timeline_expectations?.includes('ASAP')) {
      insights.push({
        category: 'risk',
        description: 'Urgent timeline may require scope reduction or additional resources',
        impact: 'high',
        source: 'timeline_analysis'
      });
    }
    
    // Technical readiness
    if (responses.technical_experience?.includes('No technical')) {
      insights.push({
        category: 'technical',
        description: 'Additional technical consulting and training will be beneficial',
        impact: 'medium',
        source: 'technical_assessment'
      });
    }
    
    // Integration complexity
    if (responses.integration_needs?.includes('several')) {
      insights.push({
        category: 'technical',
        description: 'Multiple integrations increase project complexity and timeline',
        impact: 'high',
        source: 'integration_analysis'
      });
    }
    
    return insights;
  }, []);

  const identifyRiskFlags = useCallback((responses: Record<string, string>): string[] => {
    const flags: string[] = [];
    
    if (responses.timeline_expectations?.includes('ASAP')) {
      flags.push('urgent_timeline');
    }
    
    if (!responses.success_criteria || responses.success_criteria.length < 10) {
      flags.push('unclear_success_metrics');
    }
    
    if (responses.project_idea && responses.project_idea.length < 20) {
      flags.push('vague_requirements');
    }
    
    if (responses.integration_needs?.includes('several')) {
      flags.push('complex_integrations');
    }
    
    if (responses.technical_experience?.includes('No technical')) {
      flags.push('limited_technical_resources');
    }
    
    return flags;
  }, []);

  const suggestTechStack = useCallback((responses: Record<string, string>): string[] => {
    const stack: string[] = [];
    
    // Base recommendations
    if (responses.project_scale?.includes('Enterprise')) {
      stack.push('Microservices Architecture', 'Docker/Kubernetes', 'Database Cluster');
    } else if (responses.project_scale?.includes('Production')) {
      stack.push('REST API', 'Database', 'Cloud Hosting');
    } else {
      stack.push('Simple Backend', 'Basic Database', 'Prototype Hosting');
    }
    
    // Integration-based additions
    if (responses.integration_needs?.includes('several')) {
      stack.push('API Gateway', 'Message Queue', 'Integration Platform');
    }
    
    return stack;
  }, []);

  const generateProjectPhases = useCallback((responses: Record<string, string>) => {
    const complexity = analyzeProjectComplexity(responses);
    
    const phases = {
      phase1: [] as string[],
      phase2: [] as string[],
      phase3: [] as string[]
    };
    
    // Phase 1 - Foundation
    phases.phase1 = [
      'Requirements Analysis & Specification',
      'Technical Architecture Design',
      'Development Environment Setup'
    ];
    
    if (complexity === 'complex') {
      phases.phase1.push('Stakeholder Alignment Workshop', 'Risk Assessment & Mitigation Plan');
    }
    
    // Phase 2 - Development
    phases.phase2 = ['Core Functionality Development', 'Initial Testing & QA'];
    
    if (responses.integration_needs?.includes('several')) {
      phases.phase2.push('API Integrations', 'Integration Testing');
    }
    
    if (complexity !== 'simple') {
      phases.phase2.push('Performance Optimization', 'Security Implementation');
    }
    
    // Phase 3 - Deployment
    phases.phase3 = ['Production Deployment', 'User Training & Documentation'];
    
    if (complexity === 'complex') {
      phases.phase3.push('Monitoring Setup', 'Maintenance Plan', 'Scale Planning');
    }
    
    return phases;
  }, [analyzeProjectComplexity]);

  const estimateEffort = useCallback((responses: Record<string, string>): string => {
    const complexity = analyzeProjectComplexity(responses);
    const hasIntegrations = responses.integration_needs?.includes('Yes');
    const isUrgent = responses.timeline_expectations?.includes('ASAP');
    
    let baseWeeks = 0;
    
    switch (complexity) {
      case 'simple':
        baseWeeks = 4;
        break;
      case 'standard':
        baseWeeks = 8;
        break;
      case 'complex':
        baseWeeks = 16;
        break;
    }
    
    // Adjustment factors
    if (hasIntegrations) baseWeeks *= 1.5;
    if (isUrgent) baseWeeks *= 1.3; // More resources needed for urgent projects
    if (responses.technical_experience?.includes('No technical')) baseWeeks *= 1.2;
    
    const weeks = Math.ceil(baseWeeks);
    
    if (weeks <= 6) return `${weeks} weeks`;
    if (weeks <= 12) return `${Math.ceil(weeks / 4)} months`;
    return `${Math.ceil(weeks / 4)}-${Math.ceil(weeks / 4) + 1} months`;
  }, [analyzeProjectComplexity]);

  const assessBusinessImpact = useCallback((responses: Record<string, string>): string => {
    const hasGoodProblemStatement = responses.business_problem && responses.business_problem.length > 20;
    const hasSuccessMetrics = responses.success_criteria && responses.success_criteria.length > 10;
    const scale = responses.project_scale;
    
    if (scale?.includes('Enterprise') && hasGoodProblemStatement && hasSuccessMetrics) {
      return 'High - Clear ROI potential with well-defined success metrics';
    } else if (scale?.includes('Production') && hasGoodProblemStatement) {
      return 'Medium-High - Solid business case with production implementation';
    } else if (hasGoodProblemStatement) {
      return 'Medium - Good problem identification, needs success metrics refinement';
    } else {
      return 'Low-Medium - Business case needs clarification and success metrics';
    }
  }, []);

  const generateEnhancedData = useCallback((responses: Record<string, string>): EnhancedConversationData => {
    const insights = generateProjectInsights(responses);
    const complexity = analyzeProjectComplexity(responses);
    const riskFlags = identifyRiskFlags(responses);
    const techStack = suggestTechStack(responses);
    const phases = generateProjectPhases(responses);
    const estimatedEffort = estimateEffort(responses);
    const businessImpact = assessBusinessImpact(responses);

    return {
      responses,
      insights,
      complexity,
      riskFlags,
      techStack,
      phases,
      estimatedEffort,
      businessImpact
    };
  }, [generateProjectInsights, analyzeProjectComplexity, identifyRiskFlags, suggestTechStack, generateProjectPhases, estimateEffort, assessBusinessImpact]);

  return {
    analyzeProjectComplexity,
    generateProjectInsights,
    identifyRiskFlags,
    suggestTechStack,
    generateProjectPhases,
    estimateEffort,
    assessBusinessImpact,
    generateEnhancedData
  };
};