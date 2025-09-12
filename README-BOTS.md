# Simple 3-Bot System

## What You Have

### 🤖 **3 Bot Definitions**
- `bots/bot1-qa.md` - Q&A Bot (answers business questions, NO pricing)
- `bots/bot2-project-interrogation.md` - Project Bot (collects requirements)  
- `bots/bot3-summarizer.md` - Summarizer Bot (processes data, notifies team)

### ⚙️ **3 n8n Workflows**
- `n8n-workflows/bot1-qa-workflow.json` - Q&A webhook workflow
- `n8n-workflows/bot2-project-interrogation-workflow.json` - Project data processor  
- `n8n-workflows/bot3-summarizer-workflow.json` - Team notifications & Excel updates

### 📁 **Code Files**
- `src/components/ConversationEngine.tsx` - Main bot interface (production-ready)
- `src/utils/n8nWebhooks.ts` - Webhook integration utility
- `.env.example` - Environment variables template

## Quick Setup

1. **Import n8n workflows** - Import the 3 JSON files into n8n
2. **Set webhook URLs** - Copy n8n webhook URLs to `.env.local`
3. **Configure Excel/Google Sheets** - Set up your spreadsheet ID in Bot 3 workflow
4. **Test** - Run `npm run dev` and test both bot modes

## Bot Flow

**User** → **Bot 1 (Q&A)** → After 5+ questions → **Bot 2 (Project)** → When complete → **Bot 3 (Summarizer)** → Excel + Team Notifications

### How It Works:
1. **Bot 1**: User asks questions, NO pricing discussions, suggests project mode after 5+ exchanges
2. **Bot 2**: Collects project requirements, automatically sends data to Bot 3 when complete  
3. **Bot 3**: Processes data, updates Excel, sends team notifications (Slack + Email)

### n8n Setup:
- **Bot 1**: Webhook receives Q&A requests from website
- **Bot 2**: Webhook receives project data from website → forwards to Bot 3  
- **Bot 3**: Webhook receives data from Bot 2 → Excel + notifications

That's it! Clean and simple. 🚀