# Notes Processor

Classify and organize notes using Claude AI.

## Features

### Inbox Sync
- Fetches classified items from Google Sheets (via local bridge server)
- Creates Rems in today's Daily Doc, tagged with category
- Marks tasks with checkbox
- Auto-refreshes every 10 minutes

### Process Notes
- Classifies items in the **active page** you're viewing
- Sends each top-level child to Claude for classification
- Tags items with appropriate category
- Marks tasks with checkbox

## Categories

- **Tasks** - Action items, todos, reminders
- **Ideas** - Creative thoughts, concepts to explore
- **People** - Contact info, notes about people
- **Admin** - Administrative items, settings, credentials
- **Inbox** - Fallback for low-confidence items

## Setup

1. Start the Flask bridge server: `python remnote_server.py`
2. Load this plugin in RemNote (localhost:8080)
3. Use the sidebar buttons or type `/pn` for Process Notes
