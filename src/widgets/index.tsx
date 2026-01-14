import {
  declareIndexPlugin,
  ReactRNPlugin,
  WidgetLocation,
} from '@remnote/plugin-sdk';

async function onActivate(plugin: ReactRNPlugin) {
  // Register the popup widget
  await plugin.app.registerWidget('inbox_sync', WidgetLocation.Popup, {
    dimensions: { width: 350, height: 500 },
  });

  // Register the slash command
  await plugin.app.registerCommand({
    id: 'inbox-sync',
    name: 'Inbox Sync',
    description: 'Open the Inbox Sync panel',
    quickCode: 'inbox',
    action: async () => {
      await plugin.widget.openPopup('inbox_sync');
    },
  });

  await plugin.app.toast('Inbox Sync plugin loaded!');
}

async function onDeactivate(_plugin: ReactRNPlugin) {}

declareIndexPlugin(onActivate, onDeactivate);
