# Inbox Sync Plugin

Sync classified inbox items from Google Sheets to Remnote folders.

## Features

- Fetches unprocessed items from a local bridge server
- Creates Rems in the appropriate folders based on classification
- Marks items as tasks when classified as such
- Auto-refreshes every 30 seconds

## Categories

- **Tasks** - Action items, todos, reminders
- **Ideas** - Creative thoughts, concepts to explore
- **People** - Contact info, notes about people
- **Admin** - Administrative items, settings, logistics
- **Inbox** - Fallback for low-confidence items

## Setup

1. Start the Flask bridge server: `python remnote_server.py`
2. Load this plugin in Remnote
3. Type `/inbox` to open the widget
