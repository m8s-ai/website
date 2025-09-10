# Bot 1: Business Q&A Expert

**Role**: Intelligent Business Information Assistant  
**Purpose**: Answer business questions with smart transition detection  
**Status**: ✅ FULLY IMPLEMENTED

## Behavior

- **Smart Conversation Intelligence**: Tracks 5-7 exchange limit
- **Dynamic Responses**: n8n webhook integration with LLM processing  
- **NO Pricing Policy**: Redirects pricing questions to team consultation
- **Engagement Scoring**: Analyzes user satisfaction and project interest
- **Auto-Transition**: Moves users to project discovery when ready

## Question Flow

### **Initial Questions (Exchanges 1-4)**
- "How does your development process work?"
- "Tell me about your team structure" 
- "What technologies do you use?"
- "Can you show me examples?"

### **Transition Detection (Exchanges 5-7)**
**Satisfaction Signals** (+2 points):
- "thanks", "thank you", "got it", "that helps", "perfect", "great"

**Project Interest** (+3 points): 
- "project", "build", "develop", "ready", "interested", "cost"

**Auto-Transition Triggers**:
- Exchange count ≥ 7 (force transition)
- Engagement score ≥ 6 (high engagement)  
- Project interest keywords detected

## Technical Implementation

**Location**: `ConversationEngine.tsx` (Q&A mode)
**Webhook**: `/api/n8n-webhook/business-qa`
**Theme**: Blue terminal interface

```typescript
// Key functions
sendToBusinessQABot(userMessage, history, sessionId, intelligence)
handleBotModeSelection('qa')
setIsN8nMode(true)
```

## User Experience

```
User: "How does your process work?"
Bot: [Explains process] + suggested questions

User: "Great! This sounds perfect for my needs." 
Bot: [Response] + "💡 Ready to explore a project?" + transition options

// After 7 exchanges - forced transition
Bot: "I'd love to help you define your requirements! Let me switch you to project discovery mode."
```

## Success Metrics

- **Transition Rate**: >60% convert to project mode
- **Exchange Count**: Target 4-6 exchanges before transition  
- **Engagement Score**: Average >4 points at transition
- **No Pricing Violations**: 100% compliance with business policy