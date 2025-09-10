# Enhanced Project Interrogation Bot Template

**Role**: Smart Project Discovery & Documentation Generator
**Purpose**: Collect project requirements AND generate structured project briefs

## Template Configuration

```yaml
template:
  id: project-interrogation-output-template-v3
  name: Project Discovery Session Results
  version: 3.0
  output:
    format: markdown
    filename: docs/project-discovery-session-{{sessionId}}.md
    title: "Project Discovery Session Results"

workflow:
  mode: interactive
  adaptive_questioning: true
  smart_follow_up: true

sections:
  - id: header
    content: |
      **Discovery Date:** {{date}}
      **Session ID:** {{sessionId}}
      **Lead Consultant:** AI Project Specialist
      **Client:** {{client_name}}
      **Company:** {{company_name}}

  - id: executive-summary
    title: Executive Summary
    sections:
      - id: project-overview
        template: |
          **Project Concept:** {{project_idea}}
          
          **Project Scale:** {{project_scale}}
          
          **Business Priority:** {{priority_level}}
          
          **Complexity Assessment:** {{complexity_rating}}
          
          **Lead Score:** {{lead_score}}/20

  - id: discovery-details
    title: Discovery Session Details
    sections:
      - id: questions-answered
        title: "Questions Explored ({{total_questions}} total)"
        repeatable: true
        type: numbered-list
        template: |
          **{{question_text}}**
          - Client Response: {{client_answer}}
          - Follow-up Insights: {{follow_up_notes}}
          - Technical Implications: {{tech_implications}}

  - id: project-breakdown
    title: Project Analysis & Categorization
    sections:
      - id: immediate-requirements
        title: Immediate Requirements
        content: "*What can be built right away*"
        repeatable: true
        type: bullet-list
        template: |
          - **{{requirement_name}}**: {{description}}
            - Technical approach: {{tech_approach}}
            - Estimated effort: {{effort_estimate}}

      - id: future-enhancements
        title: Future Enhancement Opportunities
        content: "*Features for Phase 2+*"
        repeatable: true
        type: bullet-list
        template: |
          - **{{enhancement_name}}**: {{description}}
            - Dependencies: {{dependencies}}
            - Business value: {{value_proposition}}

      - id: technical-considerations
        title: Technical Considerations
        sections:
          - id: constraints
            title: Known Constraints
            type: bullet-list
            template: "- {{constraint}}: {{impact_description}}"
          - id: integrations
            title: Required Integrations
            type: bullet-list
            template: "- {{integration}}: {{purpose_and_complexity}}"
          - id: scalability
            title: Scalability Requirements
            type: bullet-list
            template: "- {{scalability_aspect}}: {{requirement_details}}"

  - id: business-context
    title: Business Context & Success Metrics
    sections:
      - id: business-problem
        title: Core Business Problem
        template: |
          **Problem Statement:** {{problem_statement}}
          
          **Current Pain Points:**
          {{#each pain_points}}
          - {{this}}
          {{/each}}
          
          **Expected Business Impact:** {{business_impact}}

      - id: success-criteria
        title: Success Criteria
        type: numbered-list
        template: |
          **{{success_metric}}**
          - Measurement method: {{how_to_measure}}
          - Target value: {{target_value}}
          - Timeline: {{achievement_timeline}}

  - id: project-roadmap
    title: Recommended Project Roadmap
    sections:
      - id: phase-1
        title: "Phase 1: Foundation ({{phase1_duration}})"
        template: |
          **Scope:** {{phase1_scope}}
          
          **Key Deliverables:**
          {{#each phase1_deliverables}}
          - {{this}}
          {{/each}}
          
          **Success Criteria:** {{phase1_success}}
          
          **Estimated Investment:** {{phase1_cost}}

      - id: phase-2
        title: "Phase 2: Enhancement ({{phase2_duration}})"
        template: |
          **Scope:** {{phase2_scope}}
          
          **Key Deliverables:**
          {{#each phase2_deliverables}}
          - {{this}}
          {{/each}}
          
          **Dependencies:** {{phase2_dependencies}}

      - id: phase-3
        title: "Phase 3: Optimization ({{phase3_duration}})"
        template: |
          **Scope:** {{phase3_scope}}
          
          **Advanced Features:**
          {{#each phase3_features}}
          - {{this}}
          {{/each}}

  - id: resource-planning
    title: Resource & Timeline Planning
    sections:
      - id: team-composition
        title: Recommended Team Composition
        template: |
          **Core Team:**
          - {{core_team_roles}}
          
          **Specialized Expertise Needed:**
          {{#each specialist_needs}}
          - {{role}}: {{reason}}
          {{/each}}
          
          **Estimated Team Size:** {{team_size}} people
          **Project Duration:** {{total_duration}}

      - id: technology-stack
        title: Technology Stack Recommendations
        sections:
          - id: frontend
            title: Frontend Technologies
            type: bullet-list
            template: "- {{technology}}: {{rationale}}"
          - id: backend
            title: Backend Technologies  
            type: bullet-list
            template: "- {{technology}}: {{rationale}}"
          - id: infrastructure
            title: Infrastructure & DevOps
            type: bullet-list
            template: "- {{technology}}: {{rationale}}"

  - id: risk-mitigation
    title: Risk Assessment & Mitigation
    sections:
      - id: identified-risks
        title: Identified Risks
        repeatable: true
        template: |
          **Risk:** {{risk_name}}
          - Probability: {{probability}}
          - Impact: {{impact_level}}
          - Mitigation Strategy: {{mitigation_approach}}

  - id: next-steps
    title: Immediate Next Steps
    sections:
      - id: action-items
        title: Action Items
        type: numbered-list
        template: |
          **{{action_item}}**
          - Owner: {{owner}}
          - Timeline: {{timeline}}
          - Dependencies: {{dependencies}}

      - id: decision-points
        title: Key Decisions Needed
        type: bullet-list
        template: "- {{decision}}: {{context_and_options}}"

      - id: follow-up-meeting
        title: Follow-up Session Planning
        template: |
          **Recommended Next Meeting:** {{next_meeting_type}}
          **Suggested Timeline:** {{next_meeting_timeframe}}
          **Participants Needed:** {{next_meeting_participants}}
          **Preparation Required:** {{preparation_needed}}

  - id: appendix
    title: Technical Appendix
    sections:
      - id: detailed-requirements
        title: Detailed Technical Requirements
        repeatable: true
        type: bullet-list
        template: "- {{requirement}}: {{technical_specification}}"
      
      - id: integration-details
        title: Integration Specifications
        repeatable: true
        template: |
          **{{integration_name}}**
          - API Requirements: {{api_specs}}
          - Data Flow: {{data_flow_description}}
          - Security Considerations: {{security_notes}}

  - id: footer
    content: |
      ---
      
      *This project discovery session was conducted using the m8s AI-assisted project interrogation system*
      
      **Next Steps:** Schedule architecture review meeting within {{followup_timeframe}}
      **Contact:** {{contact_information}}
```

## Enhanced Question Flow

### Adaptive Questioning Logic
- **Smart Follow-ups:** AI generates contextual follow-up questions based on answers
- **Risk Detection:** Identifies potential project risks early
- **Technical Depth:** Automatically adjusts technical detail level based on client expertise
- **Business Alignment:** Ensures technical solutions align with business goals

### Question Categories

#### 1. Project Foundation (Always Asked)
- Core project concept and goals
- Project scale and timeline expectations
- Success criteria definition

#### 2. Technical Context (Adaptive)
- Current technology stack (if applicable)
- Integration requirements
- Performance expectations
- Security and compliance needs

#### 3. Business Context (Adaptive) 
- Business problem being solved
- User personas and use cases
- Revenue/cost impact expectations
- Competitive landscape

#### 4. Resource Planning (Based on Scale)
- Budget range and flexibility
- Team involvement expectations
- Timeline constraints
- Ongoing maintenance plans

### Smart Data Processing
- **Auto-categorization:** Responses automatically sorted into project phases
- **Risk flagging:** AI identifies potential project risks
- **Effort estimation:** Preliminary effort estimates based on responses
- **Technology matching:** Suggests optimal tech stack based on requirements

## Integration with Current System

This enhanced template integrates with your existing ConversationEngine by:

1. **Maintaining current n8n webhook flow**
2. **Adding structured template processing**
3. **Generating rich project documentation**
4. **Providing actionable next steps**
5. **Creating professional client-ready outputs**

The result is a much more valuable client experience that positions m8s as sophisticated consultants rather than just question-collectors.