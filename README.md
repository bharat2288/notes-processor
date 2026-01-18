# Notes Processor

A RemNote plugin that uses Claude AI to automatically classify and tag notes, turning chaotic daily captures into organized knowledge.

## The Problem

When capturing notes throughout the day — ideas, tasks, contact info, random thoughts — everything ends up in a single Daily Doc. Manually sorting these into categories is tedious, and items often sit unprocessed. The cognitive overhead of "where does this go?" interrupts the capture flow.

## The Solution

Notes Processor classifies your notes using Claude and applies tags automatically. Items stay where you captured them (in your Daily Doc), but gain structured tags that make them findable and actionable.

**Before:** A messy Daily Doc with 20 unorganized items.
**After:** The same items, each tagged with their category — Tasks visible in your task views, People notes linked to your contacts, Ideas collected for review.

## How It Works

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   RemNote       │────▶│  Local Server   │────▶│   Claude AI     │
│   Plugin        │◀────│  (Flask)        │◀────│   (Sonnet)      │
└─────────────────┘     └─────────────────┘     └─────────────────┘
                               │
                               ▼
                        ┌─────────────────┐
                        │  Google Sheets  │
                        │  (Audit Log)    │
                        └─────────────────┘
```

1. **You capture notes** in RemNote's Daily Doc as usual
2. **Click "Process Notes"** in the sidebar (or type `/pn`)
3. **Each note is sent to Claude** for classification
4. **Tags are applied** — items stay in place, just gain category tags
5. **Everything is logged** to Google Sheets for audit/review

## Categories

| Category | What It Catches | Examples |
|----------|-----------------|----------|
| **Tasks** | Action items, reminders, todos | "Call mom Tuesday", "Buy groceries", "Review PR" |
| **Ideas** | Exploratory thoughts, no commitment | "What if I tried...", "Maybe consider..." |
| **People** | Information about people | "Sarah's birthday March 15", "John mentioned..." |
| **Admin** | Reference info, credentials, settings | "Bank login: user123", "Account #12345" |
| **Inbox** | Low-confidence items needing review | Ambiguous items that don't fit cleanly |

## Features

### Process Notes
The core feature. Analyzes children of your current Daily Doc and tags each one.

- Skips items that already have a category tag (won't re-process)
- Automatically marks Tasks as todos (checkbox)
- Works on any page you navigate to
- Confidence threshold: items below 70% confidence go to Inbox for manual review

### Inbox Sync (Secondary)
Imports pre-classified items from a Google Sheets queue. Useful if you have an external capture flow (e.g., iOS Shortcuts → Sheets → RemNote).

## Setup

### Prerequisites
- RemNote (desktop or web)
- Python 3.8+
- Anthropic API key
- Google Cloud service account with Sheets API access

### 1. Clone and Install

```bash
git clone https://github.com/bharat2288/notes-processor.git
cd notes-processor
npm install
```

### 2. Configure the Server

Create a `server/` directory with:
- `credentials.json` — Google Cloud service account credentials
- `.env` file with your Anthropic API key:

```
ANTHROPIC_API_KEY=sk-ant-...
```

Update the `SPREADSHEET_ID` in `remnote_server.py` to your Google Sheet.

### 3. Create Category Rems

In RemNote, create top-level Rems named exactly:
- `Tasks`
- `Ideas`
- `People`
- `Admin`
- `Inbox`

The plugin auto-discovers these on first load.

### 4. Start the Server

```bash
cd server
python remnote_server.py
```

Server runs at `http://localhost:5050`

### 5. Load the Plugin

**For development:**
```bash
npm run dev
```
Then load `http://localhost:8080` as a plugin in RemNote.

**For production:**
```bash
npm run build
```
Upload the generated `PluginZip.zip` to RemNote.

## Usage

1. Write notes in your Daily Doc as usual
2. When ready to process, click **"Process Notes"** in the left sidebar
3. Watch as items get tagged (toast notifications show progress)
4. Use RemNote's tag-based views to see categorized items

**Slash command:** Type `/pn` anywhere to trigger processing.

## Architecture

### Plugin (`src/`)
- **index.tsx** — Plugin registration, commands, category discovery
- **inbox_sidebar.tsx** — Sidebar widget with buttons
- **inbox_sync.tsx** — Popup for Google Sheets import

### Server (`server/`)
- **remnote_server.py** — Flask bridge handling:
  - `/classify-and-log` — Send text to Claude, log result to Sheets
  - `/unprocessed` — Get items from Sheets queue
  - `/mark-processed` — Update Sheets after import

### Why a Local Server?

RemNote plugins run in a sandboxed environment without direct API access. The Flask server acts as a bridge, handling:
- Anthropic API calls (Claude classification)
- Google Sheets API (audit logging)
- CORS for plugin requests

## Classification Logic

Claude uses a detailed prompt with explicit rules:

- Action verbs → Task (even "Call mom" = Task, not People)
- Questions needing research → Task
- Aspirational without commitment → Idea
- Pure information about a person → People
- Contains credentials/numbers → Admin
- Ambiguous or low confidence → Inbox

See the full prompt in `remnote_server.py`.

## License

MIT
