# Firebase Analytics Setup Guide for m8s

## Quick Setup Steps

### Step 1: Create Firebase Project
1. Go to https://console.firebase.google.com
2. Click "Create a project"
3. Project name: "m8s-analytics"
4. Enable Google Analytics when prompted
5. Choose your Google Analytics account or create new one
6. Click "Create project"

### Step 2: Add Web App
1. In Firebase console, click the web icon "</>"
2. App nickname: "m8s-website"
3. Check "Also set up Firebase Hosting" (optional)
4. Click "Register app"
5. Copy the configuration object that appears

### Step 3: Update Firebase Config
1. Open `src/utils/firebase.js` in your project
2. Replace the placeholder config with your real config:

```javascript
const firebaseConfig = {
  apiKey: "your-actual-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456",
  measurementId: "G-XXXXXXXXXX"
};
```

### Step 4: Test the Implementation
1. Run `npm start` in your terminal
2. Open browser to http://localhost:8080
3. Open browser console (F12 → Console tab)
4. Look for messages starting with "🔥 Analytics:"
5. Go through the user flow: landing → terminal → Aria conversation

### Step 5: Verify Data in Firebase
1. Go to Firebase Console → Analytics → Events
2. Click on "DebugView" in the left sidebar
3. You should see events appearing in real-time
4. Main events to look for:
   - session_start
   - app_initialized
   - terminal_entered
   - terminal_boot_started

## Viewing Your Analytics Data

### Real-time Monitoring
- **Firebase Console → Analytics → Realtime**
- Shows active users and current events
- Updates every few seconds
- Great for testing new features

### Event Analysis
- **Firebase Console → Analytics → Events**
- All custom events we've implemented
- Click any event to see parameters
- Filter by date ranges

### Debug View (Development)
- **Firebase Console → Analytics → DebugView**
- Real-time event stream
- Only shows events from debug-enabled devices
- Perfect for testing new tracking

### Conversion Events
Set up these events as conversions:
1. Go to Firebase Console → Analytics → Events
2. Find these events and click "Mark as conversion":
   - aria_conversation_completed
   - terminal_conversation_initiated
   - navigation_cta_clicked

## Key Reports to Create

### User Journey Funnel
Create a custom funnel to track:
1. session_start → terminal_entered
2. terminal_entered → terminal_conversation_initiated  
3. terminal_conversation_initiated → aria_conversation_started
4. aria_conversation_started → aria_conversation_completed

### Lead Quality Dashboard
Monitor these metrics:
- Average lead_score from aria_conversation_completed events
- Conversion rate by conversation_path (start_project vs learn_more)
- Response quality (answer_length, answer_words)
- Time to conversion (total_duration)

### Abandonment Analysis
Track drop-off points:
- terminal_boot_started vs terminal_boot_completed
- aria_question_presented vs aria_question_answered
- Most common abandonment_point values
- Correlation between audio_enabled and completion rates

## Troubleshooting

### No Events Appearing
1. Check browser console for Firebase errors
2. Verify Firebase config is correct
3. Make sure you're not using an ad blocker
4. Try incognito/private browsing mode

### Events Missing Parameters
1. Check console for parameter truncation warnings
2. Firebase limits: parameter names ≤40 chars, values ≤100 chars
3. Our analytics manager handles this automatically

### Real-time vs Reporting Delay
- DebugView: Instant
- Realtime reports: 1-2 minutes
- Standard reports: 24-48 hours
- Export to BigQuery: Near real-time

## Advanced Configuration

### Export to BigQuery (Recommended)
1. Firebase Console → Project Settings
2. Click "Integrations" tab
3. Find BigQuery and click "Link"
4. Enable for Analytics data
5. This allows custom SQL queries and advanced analysis

### Custom Audiences
Create user segments based on behavior:
- Users who completed conversations
- Users who abandoned at specific points
- High-value leads (lead_score > 15)
- Return visitors vs new visitors

### A/B Testing Setup
1. Firebase Console → Remote Config
2. Create parameters for:
   - Boot sequence timing
   - Question ordering
   - Audio default state
   - Conversation flow variations

## Privacy & Compliance

### GDPR Compliance
- Firebase Analytics uses anonymized data
- No cookie consent required for basic analytics
- User IDs are generated, not personal
- Data retention: 14 months (configurable)

### Data Processing
- All events are processed client-side
- No sensitive data (passwords, emails) tracked
- User responses truncated to 100 characters
- Location data limited to country/region

## Business Intelligence Integration

### Export Options
- **Firebase Console**: Basic reports and dashboards
- **Google Analytics**: Advanced web analytics features
- **BigQuery**: SQL queries and custom analysis
- **Data Studio**: Visual dashboards and reports
- **API Access**: Custom integrations and real-time monitoring

### Key Metrics to Monitor
- **Conversion Rate**: terminal_entered → aria_conversation_completed
- **Lead Quality**: Average lead_score trends
- **User Experience**: Session duration and abandonment points
- **Feature Usage**: Audio toggle rates, conversation paths chosen
- **Technical Performance**: Response times and error rates

## Getting Help

### Resources
- **Firebase Documentation**: https://firebase.google.com/docs/analytics
- **Analytics Events Reference**: See our analytics-events.md document
- **Console Help**: Click "?" in Firebase Console for contextual help

### Common Issues
- **Slow event reporting**: Normal for first 24-48 hours
- **Missing events**: Check console for JavaScript errors
- **Parameter limits**: Our system auto-truncates long values
- **Cross-domain tracking**: Not needed for single-page app

Your analytics system is now fully implemented and ready to provide insights into user behavior, conversion optimization opportunities, and business intelligence for the m8s platform!