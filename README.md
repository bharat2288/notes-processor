# Inbox Sync Plugin

Sync classified inbox items from Google Sheets to Remnote folders.

## Features

- Fetches unprocessed items from a local bridge server
- Creates Rems in the appropriate folders based on classification
- Marks items as tasks when classified as such
- Auto-refreshes every 30 seconds

## Setup

1. Start the Flask bridge server: `python remnote_server.py`
2. Install this plugin in Remnote
3. Open the Inbox Sync widget from the right sidebar
