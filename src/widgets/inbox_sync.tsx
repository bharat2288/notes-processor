import { renderWidget, usePlugin, useSyncedStorageState, Rem } from '@remnote/plugin-sdk';
import { useEffect, useState, useCallback } from 'react';

const SERVER_URL = 'http://localhost:5050';

interface InboxItem {
  row_number: number;
  timestamp: string;
  raw_input: string;
  classification: string;
  target_folder: string;
  confidence: number;
  notes: string;
}

interface ProcessResult {
  remId: string;
  text: string;
  classification: string;
  targetFolder: string;
  confidence: number;
  status: 'pending' | 'processing' | 'done' | 'error';
  error?: string;
}

export const InboxSyncWidget = () => {
  const plugin = usePlugin();
  const [items, setItems] = useState<InboxItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [importing, setImporting] = useState<number | null>(null);

  // Process Notes state
  const [processing, setProcessing] = useState(false);
  const [processResults, setProcessResults] = useState<ProcessResult[]>([]);
  const [activePageName, setActivePageName] = useState<string | null>(null);

  // Get stored category IDs (auto-configured on plugin load)
  const [categoryIds] = useSyncedStorageState<Record<string, string>>('categoryRemIds', {});

  const fetchItems = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${SERVER_URL}/unprocessed`);
      if (!response.ok) throw new Error(`Server error: ${response.status}`);
      const data = await response.json();
      setItems(data.items || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch items');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchItems();
    const interval = setInterval(fetchItems, 600000); // 10 minutes
    return () => clearInterval(interval);
  }, [fetchItems]);

  const importItem = async (item: InboxItem) => {
    setImporting(item.row_number);
    try {
      const classification = item.classification.toLowerCase();
      const folderName = item.target_folder || 'Inbox';
      const folderKey = folderName.toLowerCase(); // "Tasks" -> "tasks"

      console.log('Import:', { classification, folderName, folderKey, categoryIds });

      // Get today's Daily Doc (where items will be created)
      const dailyDoc = await plugin.date.getTodaysDoc();
      if (!dailyDoc) {
        throw new Error('No Daily Doc found for today');
      }

      // Find the category Rem to use as a tag
      let tagRem = null;
      const storedId = categoryIds?.[folderKey] || categoryIds?.['inbox'];

      console.log('Looking up storedId for', folderKey, ':', storedId);

      if (storedId) {
        tagRem = await plugin.rem.findOne(storedId);
        console.log('Found by storedId:', tagRem?._id);
      }

      if (!tagRem) {
        console.log('Trying findByName:', folderName);
        tagRem = await plugin.rem.findByName([folderName], null);
        console.log('Found by name:', tagRem?._id);
      }

      if (!tagRem) {
        throw new Error(`Category not found: ${folderName}`);
      }

      console.log('Creating Rem in Daily Doc, tagging with:', tagRem._id);

      // Create Rem in Daily Doc and tag with category
      const newRem = await plugin.rem.createRem();
      if (!newRem) throw new Error('Failed to create Rem');

      await newRem.setText([item.raw_input]);
      await newRem.setParent(dailyDoc);
      await newRem.addTag(tagRem);

      if (classification === 'task' || classification === 'tasks') {
        await newRem.setIsTodo(true);
      }

      await markProcessed(item.row_number, newRem._id);
      setItems(prev => prev.filter(i => i.row_number !== item.row_number));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to import item');
    } finally {
      setImporting(null);
    }
  };

  const markProcessed = async (rowNumber: number, remId?: string) => {
    const response = await fetch(`${SERVER_URL}/mark-processed`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        row_number: rowNumber,
        rem_id: remId || 'skipped',
      }),
    });
    if (!response.ok) throw new Error('Failed to mark as processed');
  };

  const skipItem = async (item: InboxItem) => {
    try {
      await markProcessed(item.row_number, 'skipped');
      setItems(prev => prev.filter(i => i.row_number !== item.row_number));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to skip item');
    }
  };

  const importAll = async () => {
    for (const item of items) {
      await importItem(item);
    }
  };

  // Helper to get plain text from a Rem
  const getRemText = async (rem: Rem): Promise<string> => {
    const textContent = await rem.text;
    if (!textContent) return '';
    // Convert RichTextInterface to plain string
    return textContent.map((part: unknown) => {
      if (typeof part === 'string') return part;
      if (part && typeof part === 'object' && 'text' in part) return (part as { text: string }).text;
      return '';
    }).join('');
  };

  // Process Notes: classify and tag children of today's Daily Doc
  const processDailyNotes = async () => {
    setProcessing(true);
    setProcessResults([]);
    setError(null);

    try {
      // Get today's Daily Doc - this is the working logic
      const dailyDoc = await plugin.date.getTodaysDoc();
      if (!dailyDoc) {
        throw new Error('No Daily Doc found for today');
      }

      const pageName = await getRemText(dailyDoc);
      setActivePageName(pageName || 'Today\'s Daily Doc');

      // Get top-level children of the Daily Doc
      const children = await dailyDoc.getChildrenRem();
      if (!children || children.length === 0) {
        throw new Error('No items in today\'s Daily Doc');
      }

      console.log(`Processing ${children.length} children from "${pageName}"`);

      // Initialize results
      const initialResults: ProcessResult[] = await Promise.all(
        children.map(async (child) => ({
          remId: child._id,
          text: await getRemText(child),
          classification: '',
          targetFolder: '',
          confidence: 0,
          status: 'pending' as const,
        }))
      );
      setProcessResults(initialResults);

      // Process each child
      for (let i = 0; i < children.length; i++) {
        const child = children[i];
        const text = initialResults[i].text;

        if (!text.trim()) {
          setProcessResults(prev => prev.map((r, idx) =>
            idx === i ? { ...r, status: 'done', classification: 'empty', targetFolder: 'skip' } : r
          ));
          continue;
        }

        // Check if already has a category tag (skip if already processed)
        const categoryIdSet = new Set(Object.values(categoryIds));
        const existingTags = await child.getTagRems();
        const hasCategory = existingTags.some(t => categoryIdSet.has(t._id));

        if (hasCategory) {
          setProcessResults(prev => prev.map((r, idx) =>
            idx === i ? { ...r, status: 'done', classification: 'already tagged', targetFolder: 'skip' } : r
          ));
          continue;
        }

        // Update status to processing
        setProcessResults(prev => prev.map((r, idx) =>
          idx === i ? { ...r, status: 'processing' } : r
        ));

        try {
          // Call server to classify (and log to Google Sheets)
          const response = await fetch(`${SERVER_URL}/classify-and-log`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text }),
          });

          if (!response.ok) {
            throw new Error(`Server error: ${response.status}`);
          }

          const result = await response.json();
          const { categories, folders, confidence, is_task } = result;

          // Add all applicable tags
          for (const folder of folders || []) {
            const folderKey = folder.toLowerCase();
            const storedId = categoryIds?.[folderKey];

            let tagRem = null;
            if (storedId) {
              tagRem = await plugin.rem.findOne(storedId);
            }
            if (!tagRem) {
              tagRem = await plugin.rem.findByName([folder], null);
            }

            if (tagRem) {
              await child.addTag(tagRem);
            }
          }

          // Set as todo if task is in categories
          if (is_task) {
            await child.setIsTodo(true);
          }

          setProcessResults(prev => prev.map((r, idx) =>
            idx === i ? { ...r, status: 'done', classification: categories.join(', '), targetFolder: folders.join(', '), confidence } : r
          ));

        } catch (err) {
          setProcessResults(prev => prev.map((r, idx) =>
            idx === i ? { ...r, status: 'error', error: err instanceof Error ? err.message : 'Unknown error' } : r
          ));
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process notes');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="p-4 rn-clr-background-primary">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <span className="rn-text-heading-small rn-clr-content-primary">Notes Processor</span>
          {items.length > 0 && (
            <span className="px-2 py-0.5 rounded-full text-xs rn-clr-background-accent rn-clr-content-accent">
              {items.length}
            </span>
          )}
        </div>
        <button
          onClick={fetchItems}
          disabled={loading}
          className="p-2 rounded rn-clr-background-elevation-10 hover:rn-clr-background-elevation-20 rn-clr-content-secondary"
        >
          {loading ? '...' : '↻'}
        </button>
      </div>

      {/* Process Daily Notes Button */}
      <button
        onClick={processDailyNotes}
        disabled={processing}
        className="w-full mb-4 py-2 px-4 rounded font-medium bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
      >
        {processing ? 'Processing...' : 'Process Daily Notes'}
      </button>

      {/* Process Results */}
      {processResults.length > 0 && (
        <div className="mb-4 p-3 rounded-lg rn-clr-background-elevation-10">
          <div className="text-xs rn-clr-content-secondary mb-2">
            Processing: {activePageName}
          </div>
          <div className="space-y-1">
            {processResults.map((result) => (
              <div key={result.remId} className="flex items-center gap-2 text-xs">
                <span className={`w-4 ${
                  result.status === 'done' ? 'text-green-500' :
                  result.status === 'processing' ? 'text-yellow-500' :
                  result.status === 'error' ? 'text-red-500' :
                  'text-gray-400'
                }`}>
                  {result.status === 'done' ? '✓' :
                   result.status === 'processing' ? '⟳' :
                   result.status === 'error' ? '✗' : '○'}
                </span>
                <span className="flex-1 truncate rn-clr-content-primary">
                  {result.text.substring(0, 40)}{result.text.length > 40 ? '...' : ''}
                </span>
                {result.status === 'done' && result.targetFolder !== 'skip' && (
                  <span className="text-xs rn-clr-content-secondary">
                    → {result.targetFolder}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="p-3 mb-4 rounded rn-clr-background-negative rn-clr-content-negative text-sm">
          {error}
        </div>
      )}

      {/* Divider */}
      <div className="border-t rn-clr-border-faint my-4"></div>
      <div className="text-xs rn-clr-content-secondary mb-2">Import from Google Sheets</div>

      {/* Empty state */}
      {items.length === 0 && !loading && (
        <div className="text-center py-4 rn-clr-content-secondary text-sm">
          No pending items in queue
        </div>
      )}

      {/* Import All button */}
      {items.length > 0 && (
        <button
          onClick={importAll}
          disabled={importing !== null}
          className="w-full mb-4 py-2 px-4 rounded font-medium rn-clr-background-accent text-white hover:opacity-90"
        >
          Import All ({items.length})
        </button>
      )}

      {/* Item cards */}
      <div className="space-y-3">
        {items.map(item => (
          <div
            key={item.row_number}
            className="p-3 rounded-lg rn-clr-background-elevation-10 rn-clr-border-faint border"
          >
            <p className="mb-2 rn-clr-content-primary rn-text-paragraph-small">
              {item.raw_input}
            </p>
            <div className="flex items-center gap-2 mb-3 text-xs rn-clr-content-secondary">
              <span className={`px-2 py-0.5 rounded ${
                item.classification === 'task'
                  ? 'rn-clr-background-warning rn-clr-content-warning'
                  : 'rn-clr-background-positive rn-clr-content-positive'
              }`}>
                {item.classification}
              </span>
              <span>→ {item.target_folder}</span>
              <span>{Math.round(item.confidence * 100)}%</span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => importItem(item)}
                disabled={importing === item.row_number}
                className="flex-1 py-1.5 px-3 rounded text-sm font-medium rn-clr-background-accent text-white hover:opacity-90"
              >
                {importing === item.row_number ? 'Importing...' : 'Import'}
              </button>
              <button
                onClick={() => skipItem(item)}
                className="py-1.5 px-3 rounded text-sm rn-clr-background-elevation-20 rn-clr-content-secondary hover:rn-clr-background-elevation-30"
              >
                Skip
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

renderWidget(InboxSyncWidget);
