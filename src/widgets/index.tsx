import { declareIndexPlugin, type ReactRNPlugin, WidgetLocation } from '@remnote/plugin-sdk';
import '../style.css';

// Category names to look up
const CATEGORIES = ['Tasks', 'Ideas', 'People', 'Admin', 'Inbox'];
const SERVER_URL = 'http://localhost:5050';

// Shared function to process notes in today's Daily Doc
async function processDailyNotes(plugin: ReactRNPlugin) {
  await plugin.app.toast('Processing Daily Notes...');

  try {
    // Get today's Daily Doc - this is the working logic
    const dailyDoc = await plugin.date.getTodaysDoc();
    if (!dailyDoc) {
      await plugin.app.toast('No Daily Doc found for today');
      return;
    }

    // Get children of Daily Doc
    const children = await dailyDoc.getChildrenRem();
    if (!children || children.length === 0) {
      await plugin.app.toast('No items in today\'s Daily Doc');
      return;
    }

    // Get stored category IDs
    const categoryIds = await plugin.storage.getSynced('categoryRemIds') as Record<string, string> | null;
    if (!categoryIds || Object.keys(categoryIds).length === 0) {
      await plugin.app.toast('No categories configured. Please create Tasks, Ideas, People, Admin, Inbox Rems.');
      return;
    }

    const categoryIdSet = new Set(Object.values(categoryIds));
    let processed = 0;
    let skipped = 0;

    for (const child of children) {
      // Check if already has a category tag
      const tags = await child.getTagRems();
      const hasCategory = tags.some(t => categoryIdSet.has(t._id));

      if (hasCategory) {
        skipped++;
        continue;
      }

      // Get text content
      const textContent = child.text;
      const text = textContent?.map(t => (typeof t === 'string' ? t : '')).join('') || '';

      if (!text.trim()) {
        skipped++;
        continue;
      }

      // Classify via server
      try {
        const response = await fetch(`${SERVER_URL}/classify-and-log`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text }),
        });

        if (!response.ok) {
          console.error('Classification failed for:', text.substring(0, 50));
          continue;
        }

        const result = await response.json();

        // Handle new multi-category response format
        const folders = result.folders || [result.target_folder];

        // Add all applicable tags
        let taggedAny = false;
        for (const folder of folders) {
          const folderKey = folder.toLowerCase();
          const targetId = categoryIds[folderKey];

          if (targetId) {
            const targetRem = await plugin.rem.findOne(targetId);
            if (targetRem) {
              await child.addTag(targetRem);
              taggedAny = true;
            }
          }
        }

        // Set as todo if task is in categories
        if (result.is_task) {
          await child.setIsTodo(true);
        }

        if (taggedAny) {
          processed++;
        }
      } catch (err) {
        console.error('Error classifying item:', err);
      }
    }

    await plugin.app.toast(`Done! Processed: ${processed}, Skipped: ${skipped}`);
  } catch (err) {
    console.error('Error processing daily notes:', err);
    await plugin.app.toast('Error processing daily notes');
  }
}

async function onActivate(plugin: ReactRNPlugin) {
  // Auto-configure: Find category Rems and store their IDs
  const storedIds = await plugin.storage.getSynced('categoryRemIds');

  if (!storedIds) {
    const categoryIds: Record<string, string> = {};

    for (const name of CATEGORIES) {
      const rem = await plugin.rem.findByName([name], null);
      if (rem) {
        categoryIds[name.toLowerCase()] = rem._id;
      }
    }

    if (Object.keys(categoryIds).length > 0) {
      await plugin.storage.setSynced('categoryRemIds', categoryIds);
      console.log('Notes Processor: Configured category IDs', categoryIds);
    }
  }

  // Register the popup widget (main UI) - both as Popup and FloatingWidget
  await plugin.app.registerWidget('inbox_sync', WidgetLocation.Popup, {
    dimensions: { height: 500, width: 350 },
  });

  // Also register as FloatingWidget for sidebar use
  await plugin.app.registerWidget('inbox_sync', WidgetLocation.FloatingWidget, {
    dimensions: { height: 500, width: 350 },
  });

  // Register a left sidebar widget (compact view)
  await plugin.app.registerWidget('inbox_sidebar', WidgetLocation.LeftSidebar, {
    dimensions: { height: 'auto', width: '100%' },
    widgetTabIcon: 'https://cdn-icons-png.flaticon.com/512/126/126516.png',
    widgetTabTitle: 'Notes Processor',
  });

  // Register command to open Inbox Sync popup
  await plugin.app.registerCommand({
    id: 'open-inbox-sync',
    name: 'Inbox Sync',
    description: 'Import items from Google Sheets to Daily Doc',
    quickCode: 'inbox',
    action: async () => {
      await plugin.widget.openPopup('inbox_sync');
    },
  });

  // Register command to process notes
  await plugin.app.registerCommand({
    id: 'process-notes',
    name: 'Process Notes',
    description: 'Classify and tag items in today\'s Daily Doc',
    quickCode: 'pn',
    action: async () => {
      await processDailyNotes(plugin);
    },
  });

  await plugin.app.toast('Notes Processor ready!');
}

async function onDeactivate(_: ReactRNPlugin) {}

declareIndexPlugin(onActivate, onDeactivate);
