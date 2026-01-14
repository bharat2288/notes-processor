# Changelog

## 0.0.11..0.0.13 - 2022-09-22

Skipped.

## 0.0.10 - 2022-09-20

This version we focused on tooling around plugin creation.

### Added

- `npx` scripts to initialise and validate a plugin before upload.
  - `npx remnote-plugin init` command to generate the manifest.json file with an interactive prompt.
  - `npx remnote-plugin validate` to validate the plugin before uploading.
- Support plugin template npm scripts on Windows.
- Json schema and linting for `manifest.json`.
- `richText.indexOfElementAt` function to convert a string index to a rich text element array index.

### Fixes and Improvements

- Fix `getSelectedRem` and `getSelectedText` reactivity.
- Removed stealKeys and releaseKeys methods from the editor namespace. They have already been moved into the app namespace.

### Theming and CSS

- Added `data-rem-property` and `data-rem-container-property` data attribute to [target slot instances like `[[Aliases]]`](https://forum.remnote.io/t/declutter-aliases-show-them-only-when-needed-snippet-for-version-1-8-is-in-post-16/2854/35?u=hannesfrank).

## 0.0.9 - 2022-08-31

### Fixed

- Fix `window.stealKeys`, `window.releaseKeys` and `app.unregisterWidget` calling wrong endpoints.

## 0.0.8 - 2022-08-31

### Changed

- Manifest: `repoUrl` is required for now.
- Manifest: `enabledOnMobile` (boolean) must be set if the plugin should run on mobile. Make sure the plugin does require any features not supported on mobile yet, like the right sidebar.
- - ✨ Completely refactored the [`editor`](https://plugins.remnote.com/api/classes/EditorNamespace) namespace.
  - This makes it more suitable for programmatically modifying content. We plan to reintroduce methods to simulate user actions.
- [`Rem` class](https://plugins.remnote.com/api/classes/Rem)
  - Renamed `Rem.tagAncestorRem` to `Rem.ancestorTagRem` and `Rem.tagDescendantRem` to `Rem.descendantTagRem`.
  - Renamed `Rem.u` to `Rem.updatedAt` and `Rem.o` to `Rem.localUpdatedAt`.
  - Renamed `(set)isCollapsedPortal` to `(set)isCollapsed`.
- `RichTextBuilder` normalizes rich text now. This turns `value()` into an `async` method.
- Changed `getFocusedPortalId(): RemId ` to `getFocusedPortal(): Rem`.
- Removed `getDescendantIds(): RemId[]` in favor of `getDescendants() : Rem[]`.
- Moved `stealKeys`/`releaseKeys` into the `app` namespace.
- Moved `getWidgetContext` into the `widget` namespace.
- Flattened context data for `WidgetLocation.Popup` (`context.openContext.focusedRemId` -> `context.focusedRemId`)

### Added

- ✨ Added 18 new methods to the [`richText`](https://plugins.remnote.com/api/classes/RichTextNamespace#methods) namespace
  - General: `empty`, `indexOf`, `length`
  - Modification: `replaceAllRichText`, `split`, `splitRichText`, `trim`, `trimStart`, `trimEnd`
  - Formatting: `removeTextFormatFromRange`, `applyTextFormatFromRange`, `applyTextFormatFromRange`
  - Conversion: `toHTML`
  - Linking: `getRemIdsFromRichText`, `deepGetRemIdsFromRichText`, `getRemAndAliasIdsFromRichText`, `deepGetRemAndAliasIdsFromRichText`, `findAllExternalURLs`
- ✨ Added experimental [`rem.getAll()`](https://plugins.remnote.com/api/classes/RemNamespace#getall) and [`card.getAll()`](https://plugins.remnote.com/api/classes/CardNamespace#getall) methods to get all rem or cards respectively. Use with care on large KBs😄.
- ✨ Added experimental shotcut capturing system to implement custom keyboard controls, like a VIM mode.
- Support reactivity in the index widget. Wrap your API calls in `plugin.track()` and they rerun automatically when something has changed.
- Make `focus.focusedRem()` and `focus.getFocusedPortal()` reactive and add `AppEvents.FocusedRemChange` and `AppEvents.FocusedPortalChange` events for manual tracking.
- Add `AppEvent.PowerupSlotChanged` event to watch for powerup changes, like todo status or highlight color.
- Added `date.getDailyDoc(date: Date)`.
- Added `Rem.removeTag(tagId: RemId, removeProperties = false)`. If `removeProperties` is specified all slots of the tag will be removed as well.
- Added `Rem.removePowerup(powerupCode)`. It will always remove all powerup slots.
- Added `onlyProgrammaticModifying: boolean` and `hidden: boolean` [powerup slot options](https://plugins.remnote.com/advanced/powerups#registering-custom-powerups). Set these to ensure data consistency.
- Added `widget.closeAllFloatingWidgets()`.

### Fixes and Improvements

- Many methods accept `Rem` as parameter in addition to `RemId`. `Rem` wrapper objects are the preferred way to work with rem and we want to abstract away `RemId`s as best as possible.
- Fix `AppEvents.QueueCompleteCard` event being triggered too often.
- Fix `RichTextBuilder` duplicating references.
- Make `searchContextRemId` optional in [`search.search()`](https://plugins.remnote.com/advanced/search#global-rem-text-search). If you omit the context rem searches globally.
- Typings: Add return type for all methods that were still returning `Promise<any>`.
- Typings: Type `Rem.setHighlightColor` with the available highlight colors.
- Typings: Add `RepetitionStatus` type.

### Theming and CSS

- Added `data-cloze-id` data attribute to Fill-In-The-Blank elements.
- Added `rn-plugin-root` class to the plugin `iframe` (sandboxed) or `div` (native) node.

### Other

- Add _Repository_ and _Report bugs_ links to the marketplace details page.
- Manifests are now validated on build.

## 0.0.7 - 2022-08-01

### Changed

- Change `getFocusedRemId(): RemId` to `getFocusedRem(): Rem`.

### Added

- Added `Rem.addPowerup(powerupCode: BuildInPowerupCodes)`.
- Added `widget.getDimensions(widgetInstanceId: number)`. You can get the `widgetInstanceId` from the `getWidgetContext()`.
- Added `remId` to the widget context of [`WidgetLocation.UnderRemEditor`](https://plugins.remnote.com/api/interfaces/WidgetLocationContextDataMap#underremeditor).

### Fixes and Improvements

- Some `Rem` methods had the wrong permission levels.

### Other

- Added documentation for the [`search`](https://plugins.remnote.com/advanced/search) namespace.
- Added documentation for the [`richText`](https://plugins.remnote.com/advanced/rich_text) namespace.
- Added documentation for [Floating Widgets](https://plugins.remnote.com/advanced/widgets#floating-widgets) and [Popup Widgets](https://plugins.remnote.com/advanced/widgets#popup-widgets) and [Pane Widgets](https://plugins.remnote.com/advanced/widgets#pane-widgets).

## 0.0.6 - 2022-07-14

### Changed

- Make `settings.getSetting` generic, e.g. `plugin.settings.getSetting<string>('my-string-setting');`

## 0.0.5 - 2022-07-14

## 0.0.4 - 2022-07-14

### Changed

- Move `addListener` and `removeListener` into new `event` namespace.
- Move `register*` and `toast` into new `app` namespace.
- Move `unregisterWidget` and `getWidgetContext` to the `widget` namespace.

## 0.0.3 - 2022-07-14

### Changed

- Refactored `useReactiveAPI` to `useTracker` replacing individual hooks.

## 0.0.2 - 2022-07-11

### Added

- `useReactiveAPI` hook.

## 0.0.1 - 2022-07-09

Initial release 🎉.
