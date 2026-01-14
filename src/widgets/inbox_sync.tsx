import React, { useEffect, useState, useCallback } from 'react';
import { renderWidget, usePlugin } from '@remnote/plugin-sdk';

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

function InboxSyncWidget() {
  const plugin = usePlugin();
  const [items, setItems] = useState<InboxItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [importing, setImporting] = useState<number | null>(null);

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
    const interval = setInterval(fetchItems, 30000);
    return () => clearInterval(interval);
  }, [fetchItems]);

  const importItem = async (item: InboxItem) => {
    setImporting(item.row_number);
    try {
      let parentRem = await plugin.rem.findByName([item.target_folder], null);

      if (!parentRem) {
        parentRem = await plugin.rem.createRem();
        if (parentRem) {
          await parentRem.setText([item.target_folder]);
        }
      }

      const newRem = await plugin.rem.createRem();
      if (!newRem) throw new Error('Failed to create Rem');

      await newRem.setText([item.raw_input]);

      if (parentRem) {
        await newRem.setParent(parentRem);
      }

      if (item.classification === 'task') {
        await newRem.setIsTodo(true);
      }

      const markResponse = await fetch(`${SERVER_URL}/mark-processed`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          row_number: item.row_number,
          rem_id: newRem._id,
        }),
      });

      if (!markResponse.ok) {
        throw new Error('Failed to mark as processed');
      }

      setItems(prev => prev.filter(i => i.row_number !== item.row_number));

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to import item');
    } finally {
      setImporting(null);
    }
  };

  const importAll = async () => {
    for (const item of items) {
      await importItem(item);
    }
  };

  const styles = {
    container: {
      padding: '12px',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      fontSize: '14px',
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '12px',
    },
    title: {
      margin: 0,
      fontSize: '16px',
      fontWeight: 600,
    },
    badge: {
      background: '#3b82f6',
      color: 'white',
      borderRadius: '12px',
      padding: '2px 8px',
      fontSize: '12px',
    },
    button: {
      padding: '6px 12px',
      borderRadius: '6px',
      border: 'none',
      cursor: 'pointer',
      fontSize: '13px',
      fontWeight: 500,
    },
    primaryButton: {
      background: '#3b82f6',
      color: 'white',
    },
    secondaryButton: {
      background: '#e5e7eb',
      color: '#374151',
    },
    itemCard: {
      background: '#f9fafb',
      borderRadius: '8px',
      padding: '10px',
      marginBottom: '8px',
      border: '1px solid #e5e7eb',
    },
    itemText: {
      margin: '0 0 8px 0',
      lineHeight: 1.4,
    },
    itemMeta: {
      display: 'flex',
      gap: '8px',
      fontSize: '11px',
      color: '#6b7280',
      marginBottom: '8px',
    },
    tag: {
      background: '#dbeafe',
      color: '#1d4ed8',
      padding: '2px 6px',
      borderRadius: '4px',
      fontSize: '11px',
    },
    taskTag: {
      background: '#fef3c7',
      color: '#92400e',
    },
    error: {
      color: '#dc2626',
      background: '#fef2f2',
      padding: '8px',
      borderRadius: '6px',
      marginBottom: '12px',
      fontSize: '13px',
    },
    empty: {
      textAlign: 'center' as const,
      color: '#6b7280',
      padding: '20px',
    },
    buttonRow: {
      display: 'flex',
      gap: '6px',
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <h3 style={styles.title}>Inbox Sync</h3>
          {items.length > 0 && <span style={styles.badge}>{items.length}</span>}
        </div>
        <button
          style={{ ...styles.button, ...styles.secondaryButton }}
          onClick={fetchItems}
          disabled={loading}
        >
          {loading ? '...' : '↻'}
        </button>
      </div>

      {error && <div style={styles.error}>{error}</div>}

      {items.length === 0 && !loading && (
        <div style={styles.empty}>No pending items</div>
      )}

      {items.length > 0 && (
        <div style={{ marginBottom: '12px' }}>
          <button
            style={{ ...styles.button, ...styles.primaryButton, width: '100%' }}
            onClick={importAll}
            disabled={importing !== null}
          >
            Import All ({items.length})
          </button>
        </div>
      )}

      {items.map(item => (
        <div key={item.row_number} style={styles.itemCard}>
          <p style={styles.itemText}>{item.raw_input}</p>
          <div style={styles.itemMeta}>
            <span
              style={{
                ...styles.tag,
                ...(item.classification === 'task' ? styles.taskTag : {}),
              }}
            >
              {item.classification}
            </span>
            <span>→ {item.target_folder}</span>
            <span>{Math.round(item.confidence * 100)}%</span>
          </div>
          <div style={styles.buttonRow}>
            <button
              style={{ ...styles.button, ...styles.primaryButton, flex: 1 }}
              onClick={() => importItem(item)}
              disabled={importing === item.row_number}
            >
              {importing === item.row_number ? 'Importing...' : 'Import'}
            </button>
            <button
              style={{ ...styles.button, ...styles.secondaryButton }}
              onClick={() => setItems(prev => prev.filter(i => i.row_number !== item.row_number))}
            >
              Skip
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

renderWidget(InboxSyncWidget);
