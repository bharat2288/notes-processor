import { renderWidget, usePlugin, useSyncedStorageState } from '@remnote/plugin-sdk';
import { useEffect, useState, useCallback } from 'react';

const SERVER_URL = 'http://localhost:5050';

export const InboxSidebarWidget = () => {
  const plugin = usePlugin();
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [serverOnline, setServerOnline] = useState<boolean | null>(null);
  const [categoryIds] = useSyncedStorageState<Record<string, string>>('categoryRemIds', {});

  const fetchCount = useCallback(async () => {
    setLoading(true);
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);

      const response = await fetch(`${SERVER_URL}/unprocessed`, {
        signal: controller.signal
      }).catch(() => null);

      clearTimeout(timeoutId);

      if (response?.ok) {
        const data = await response.json().catch(() => ({}));
        setCount(data.count || 0);
        setServerOnline(true);
      } else {
        setServerOnline(false);
      }
    } catch {
      setServerOnline(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCount();
    const interval = setInterval(fetchCount, 600000); // 10 minutes
    return () => clearInterval(interval);
  }, [fetchCount]);

  const openPopup = async () => {
    try {
      await plugin.window.openFloatingWidget('inbox_sync', {
        top: 100,
        left: 300,
      });
    } catch (err) {
      try {
        await plugin.widget.openPopup('inbox_sync');
      } catch (err2) {
        console.error('Failed to open popup', err2);
      }
    }
  };

  const processDailyNotes = async () => {
    setProcessing(true);
    await plugin.app.toast('Processing Daily Notes...');

    try {
      // Get today's Daily Doc - this is the working logic
      const dailyDoc = await plugin.date.getTodaysDoc();
      if (!dailyDoc) {
        await plugin.app.toast('No Daily Doc found for today');
        setProcessing(false);
        return;
      }

      const children = await dailyDoc.getChildrenRem();
      if (!children || children.length === 0) {
        await plugin.app.toast('No items in today\'s Daily Doc');
        setProcessing(false);
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
        const response = await fetch(`${SERVER_URL}/classify-and-log`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text }),
        });

        if (!response.ok) continue;

        const result = await response.json();
        const folderKey = result.target_folder.toLowerCase();
        const targetId = categoryIds[folderKey];

        if (targetId) {
          const targetRem = await plugin.rem.findOne(targetId);
          if (targetRem) {
            // Add tag (item stays in place)
            await child.addTag(targetRem);
            if (result.classification === 'task') {
              await child.setIsTodo(true);
            }
            processed++;
          }
        }
      }

      await plugin.app.toast(`Done! Processed: ${processed}, Skipped: ${skipped}`);
    } catch (err) {
      console.error('Error processing daily notes:', err);
      await plugin.app.toast('Error processing daily notes');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="flex flex-col gap-0">
      {/* Inbox Sync button */}
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          openPopup();
        }}
        className="w-full flex items-center gap-2 px-3 py-1.5 cursor-pointer hover:rn-clr-background-elevation-10 rounded transition-colors text-left border-none bg-transparent"
        title={serverOnline === false ? 'Server offline' : 'Open Inbox Sync panel'}
      >
        <span className="text-base">📥</span>
        <span className="flex-1 text-sm font-medium rn-clr-content-primary">Inbox Sync</span>
        {serverOnline === false && (
          <span className="px-1.5 py-0.5 rounded text-xs bg-red-100 text-red-600">offline</span>
        )}
        {serverOnline && count > 0 && (
          <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-500 text-white">
            {count}
          </span>
        )}
        {loading && <span className="text-xs rn-clr-content-secondary">...</span>}
      </button>

      {/* Process Daily Notes button */}
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          processDailyNotes();
        }}
        disabled={processing}
        className="w-full flex items-center gap-2 px-3 py-1.5 cursor-pointer hover:rn-clr-background-elevation-10 rounded transition-colors text-left border-none bg-transparent disabled:opacity-50"
        title="Classify and tag notes in today's Daily Doc"
      >
        <span className="text-base">📋</span>
        <span className="flex-1 text-sm font-medium rn-clr-content-primary">
          {processing ? 'Processing...' : 'Process Daily Notes'}
        </span>
      </button>
    </div>
  );
};

renderWidget(InboxSidebarWidget);
