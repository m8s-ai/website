# n8n Business Q&A Bot Deployment Guide

## Overview
This guide covers deploying the enhanced Business Q&A workflow that follows n8n best practices for production use.

## Workflows to Import

1. **Primary Workflow**: `bot1-qa-enhanced-workflow.json`
   - Handles business Q&A queries with AI responses
   - Includes input validation, intent detection, and proper error handling
   - Webhook endpoint: `/webhook/business-qa`

2. **Error Handler**: `business-qa-error-handler.json`
   - Handles failures from the primary workflow
   - Provides fallback responses and team notifications
   - Auto-linked to primary workflow

## Required Environment Variables

Set these in your n8n environment:

```bash
# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_CREDENTIAL_ID=your_n8n_openai_credential_id

# Slack Notifications (Optional but Recommended)
SLACK_BOT_TOKEN=xoxb-your-slack-bot-token
SLACK_ERROR_CHANNEL_ID=your_error_channel_id
SLACK_CREDENTIAL_ID=your_n8n_slack_credential_id

# n8n Configuration
N8N_BASE_URL=https://your-n8n-instance.com

# Security
N8N_WEBHOOK_SECRET=your_webhook_secret_for_validation
```

## Deployment Steps

### 1. Prepare Credentials

**OpenAI Credential:**
1. Go to n8n Credentials
2. Create new "OpenAI" credential
3. Add your OpenAI API key
4. Note the credential ID for environment variables

**Slack Credential (Optional):**
1. Create new "Slack OAuth2 API" credential
2. Configure OAuth2 with your Slack app
3. Note the credential ID

### 2. Import Workflows

1. **Import Error Handler First:**
   ```bash
   # Import business-qa-error-handler.json
   # This creates the error workflow that the main workflow references
   ```

2. **Import Main Workflow:**
   ```bash
   # Import bot1-qa-enhanced-workflow.json
   # Ensure it references the correct error workflow ID
   ```

### 3. Configure Webhook

1. Open the main workflow
2. Click on "Business Q&A Webhook" node
3. Note the webhook URL: `https://your-n8n-instance.com/webhook/business-qa`
4. Test with the "Test URL" first
5. Activate the workflow to enable the production URL

### 4. Update Your Website

Update your website's `.env` file:

```bash
# Update this line in your .env file
VITE_N8N_BUSINESS_QA_WEBHOOK_URL=https://your-n8n-instance.com/webhook/business-qa
```

## Testing the Workflow

### Test Payload Structure

```json
{
  "userMessage": "How does your development process work?",
  "conversationHistory": [],
  "sessionId": "test-session-123",
  "businessPolicy": {
    "noPricing": true,
    "redirectPricingToTeam": true,
    "focusAreas": ["services", "process", "team", "technical_capabilities"]
  },
  "conversationFlow": {
    "exchangeCount": 1,
    "engagementScore": 0,
    "phase": "exploration",
    "shouldTransition": false
  }
}
```

### Expected Response Structure

```json
{
  "text": "Our development process follows a proven 4-step approach...",
  "suggestedQuestions": [
    "Tell me about your team structure",
    "What technologies do you use?",
    "Can you show me examples?",
    "Ready to discuss my project"
  ],
  "requiresTeamConsultation": false,
  "conversationPhase": "exploration",
  "exchangeCount": 1,
  "shouldTransition": false,
  "metadata": {
    "responseType": "ai_generated",
    "sessionId": "test-session-123",
    "executionId": "workflow_12345_1234567890",
    "aiModel": "gpt-3.5-turbo",
    "timestamp": "2024-01-15T10:30:00.000Z"
  }
}
```

## Testing Scenarios

### 1. Basic Q&A
```bash
curl -X POST https://your-n8n-instance.com/webhook/business-qa \
  -H "Content-Type: application/json" \
  -d '{
    "userMessage": "What services do you offer?",
    "sessionId": "test-001",
    "conversationHistory": []
  }'
```

### 2. Pricing Query (Should Redirect)
```bash
curl -X POST https://your-n8n-instance.com/webhook/business-qa \
  -H "Content-Type: application/json" \
  -d '{
    "userMessage": "How much do you charge?",
    "sessionId": "test-002",
    "conversationHistory": []
  }'
```

### 3. Project Transition
```bash
curl -X POST https://your-n8n-instance.com/webhook/business-qa \
  -H "Content-Type: application/json" \
  -d '{
    "userMessage": "I want to start my project",
    "sessionId": "test-003",
    "conversationHistory": []
  }'
```

## Monitoring & Maintenance

### Key Metrics to Monitor
- Response time (should be <2s)
- Error rate (should be <1%)
- OpenAI API usage and costs
- Webhook success rate

### Log Analysis
Check n8n execution logs for:
- Execution time patterns
- Error frequency by node
- Session patterns and conversation flow
- AI response quality

### Scaling Considerations
- Enable Queue mode for high volume (>10 req/s)
- Configure worker concurrency based on OpenAI rate limits
- Monitor OpenAI API quotas and billing
- Set up alerts for high error rates

## Security Best Practices

1. **Webhook Security**
   - Use HTTPS only
   - Implement request validation
   - Rate limiting at reverse proxy level

2. **API Key Management**
   - Rotate OpenAI keys regularly
   - Use environment variables only
   - Monitor API usage for anomalies

3. **Access Control**
   - Limit n8n editor access
   - Use role-based permissions
   - Audit workflow changes

## Troubleshooting

### Common Issues

**"Missing OpenAI credentials"**
- Verify OPENAI_CREDENTIAL_ID matches actual credential
- Check OpenAI API key is valid and has sufficient quota

**"Webhook not responding"**
- Ensure workflow is activated
- Check webhook URL is correct
- Verify network connectivity from website

**"Error workflow not triggering"**
- Confirm error workflow is imported and activated
- Check error workflow ID in main workflow settings

**"Slow response times"**
- Monitor OpenAI API response times
- Check n8n instance resources
- Consider enabling queue mode

### Debug Mode
For debugging, temporarily add console.log statements in Code nodes:

```javascript
console.log('Debug checkpoint:', {
  userMessage: $json.userMessage,
  sessionId: $json.sessionId,
  timestamp: new Date().toISOString()
});
```

## Support

For issues with this deployment:
1. Check n8n execution logs first
2. Review error workflow notifications
3. Test with simplified payloads
4. Contact the development team with execution IDs