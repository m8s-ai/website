# m8s Firebase Analytics Events Documentation

## Overview
This document describes all Firebase Analytics events tracked across the m8s website, terminal experience, and Aria conversational bot. Each event captures user behavior and provides insights for conversion optimization.

## Event Categories

### 1. Session & App Events

**session_start**
- Category: System
- Description: User starts a new session
- Parameters: session_id, entry_page, referrer

**app_initialized**
- Category: System  
- Description: Application loads successfully
- Parameters: app_version, environment

### 2. Terminal Experience Events

**terminal_entered**
- Category: Terminal
- Description: User enters the terminal experience
- Parameters: is_return_visit, skip_boot_requested, entry_method

**terminal_redirected_to_home**
- Category: Terminal
- Description: Return visitor redirected to home
- Parameters: reason

**terminal_boot_skipped**
- Category: Terminal
- Description: User skips boot sequence
- Parameters: reason

**terminal_boot_started**
- Category: Terminal
- Description: Boot sequence begins
- Parameters: audio_enabled

**terminal_boot_line_displayed**
- Category: Terminal
- Description: Each boot line appears
- Parameters: line_number, line_text, audio_enabled, elapsed_time

**terminal_boot_completed**
- Category: Terminal
- Description: Boot sequence finishes
- Parameters: total_boot_time, lines_completed, audio_enabled

**terminal_greeting_completed**
- Category: Terminal
- Description: Aria greeting finishes typing
- Parameters: message_length

**terminal_conversation_initiated**
- Category: Terminal
- Description: User starts conversation with Aria
- Parameters: interaction_method, total_terminal_time, audio_enabled

**terminal_audio_toggled**
- Category: Terminal
- Description: User toggles sound on/off
- Parameters: new_state, terminal_stage

**terminal_auto_completed**
- Category: Terminal
- Description: Terminal auto-completes (skip boot)
- Parameters: reason

### 3. Website Navigation Events

**navigation_website_loaded**
- Category: Navigation
- Description: Website homepage loads
- Parameters: initial_section, referrer

**navigation_menu_clicked**
- Category: Navigation
- Description: User clicks navigation menu item
- Parameters: section_selected, previous_section, session_duration

**navigation_cta_clicked**
- Category: Navigation
- Description: User clicks call-to-action button
- Parameters: button_type, button_location, current_section, session_duration

**navigation_contact_interaction**
- Category: Navigation
- Description: User interacts with contact options
- Parameters: interaction_type, contact_method, email, context, session_duration

### 4. Aria Conversation Events

**aria_conversation_started**
- Category: Conversation
- Description: Conversation with Aria begins
- Parameters: conversation_id, entry_method

**aria_wave_started**
- Category: Conversation
- Description: New conversation wave starts
- Parameters: wave_id, wave_name, questions_count

**aria_question_presented**
- Category: Conversation
- Description: Question displayed to user
- Parameters: wave_id, question_id, question_text, question_type, has_options, options_count

**aria_question_answered**
- Category: Conversation
- Description: User responds to question
- Parameters: wave_id, question_id, user_answer, response_time, answer_length, answer_words

**aria_path_selected**
- Category: Conversation
- Description: User chooses conversation path
- Parameters: path_chosen, decision_time

**aria_conversation_completed**
- Category: Conversation
- Description: Full conversation finished
- Parameters: conversation_id, total_duration, questions_answered, lead_score, completion_rate

**aria_conversation_abandoned**
- Category: Conversation
- Description: User exits before completion
- Parameters: abandonment_point, progress_percent, questions_answered, abandonment_reason

## Event Parameters Reference

### Common Parameters
- `session_id`: Unique session identifier
- `timestamp`: Event timestamp in milliseconds
- `page_url`: Current page URL
- `session_duration`: Time since session started (seconds)

### Terminal-Specific Parameters
- `audio_enabled`: Boolean - whether sound is on/off
- `is_return_visit`: Boolean - if user has visited terminal before
- `entry_method`: String - how user accessed terminal ("organic" or "direct_link")
- `interaction_method`: String - how user initiated action ("button_click" or "enter_key")
- `total_terminal_time`: Number - seconds spent in terminal experience
- `terminal_stage`: String - current phase ("greeting" or "boot_sequence")

### Navigation-Specific Parameters
- `section_selected`: String - which section user navigated to
- `previous_section`: String - previous section user was viewing
- `button_type`: String - type of CTA button clicked
- `button_location`: String - where button was located on page
- `interaction_type`: String - type of contact interaction
- `contact_method`: String - method of contact ("email", "phone")

### Conversation-Specific Parameters
- `conversation_id`: Unique conversation identifier
- `wave_id`: String - conversation wave identifier
- `wave_name`: String - descriptive wave name
- `question_id`: String - unique question identifier
- `question_type`: String - type of question ("multiple-choice", "text", "yes-no")
- `user_answer`: String - user's response (truncated to 100 chars)
- `response_time`: Number - seconds to respond to question
- `answer_length`: Number - character count of response
- `answer_words`: Number - word count of response
- `path_chosen`: String - conversation path ("start_project" or "learn_more")
- `lead_score`: Number - calculated lead quality score (0-20)
- `completion_rate`: Number - percentage of conversation completed
- `abandonment_point`: String - where user left conversation
- `abandonment_reason`: String - reason for leaving ("user_abort", "page_unload")

## User Journey Tracking

### Typical User Flow & Events
1. **Landing** → `session_start`, `app_initialized`
2. **Terminal Entry** → `terminal_entered`, `terminal_boot_started`
3. **Boot Sequence** → `terminal_boot_line_displayed` (x5), `terminal_boot_completed`
4. **Greeting** → `terminal_greeting_completed`
5. **Conversation Start** → `terminal_conversation_initiated`
6. **Aria Conversation** → `aria_conversation_started`, `aria_wave_started`
7. **Questions & Answers** → `aria_question_presented`, `aria_question_answered` (repeat)
8. **Path Selection** → `aria_path_selected`
9. **Completion** → `aria_conversation_completed`

### Alternative Paths
- **Website Navigation**: `navigation_website_loaded` → `navigation_menu_clicked` → `navigation_cta_clicked`
- **Direct Terminal**: `terminal_entered` with `skip_boot_requested: true`
- **Return Visitor**: `terminal_entered` → `terminal_redirected_to_home`
- **Abandonment**: Any point → `aria_conversation_abandoned`

## Data Collection Compliance

### Data Stored
- User interactions and choices
- Response times and engagement metrics
- Session duration and navigation patterns
- Lead quality scoring
- Technical metadata (browser, screen size, etc.)

### Data NOT Stored
- Personal identifying information
- Full conversation transcripts (answers truncated)
- Location data beyond timezone
- Sensitive user inputs

### Privacy Considerations
- Firebase Analytics doesn't require cookie consent for basic functionality
- All data is anonymized with generated user IDs
- Local storage used only for session management
- Data retention follows Firebase's standard policies

## Business Intelligence Use Cases

### Conversion Optimization
- Identify drop-off points in terminal → conversation funnel
- A/B test different conversation flows
- Optimize question ordering based on abandonment rates
- Measure impact of audio on engagement

### Lead Quality Analysis
- Score leads based on response depth and engagement
- Identify high-intent users for sales prioritization
- Analyze conversation paths that produce better leads
- Track correlation between session duration and conversion

### User Experience Insights
- Monitor terminal boot sequence engagement
- Track audio preference impact on completion rates
- Analyze navigation patterns on website
- Identify technical issues causing abandonment

### Performance Monitoring
- Track response times and user frustration points
- Monitor session duration trends
- Identify browser/device-specific issues
- Measure overall user satisfaction indicators

## Implementation Files

- **Analytics Manager**: `src/utils/analyticsManager.js`
- **Firebase Config**: `src/utils/firebase.js`
- **Terminal Tracking**: `src/components/Terminal.tsx`
- **Website Tracking**: `src/components/TerminalWebsite.tsx`
- **Conversation Tracking**: `src/components/ConversationEngine.tsx`
- **App Initialization**: `src/App.tsx`

## Firebase Console Access

Events can be viewed in real-time at:
- **Firebase Console** → Analytics → Events
- **DebugView** for development testing
- **Real-time** for live user monitoring
- **Custom Reports** for business intelligence

All events appear within 1-2 minutes of user interaction and include full parameter data for analysis.