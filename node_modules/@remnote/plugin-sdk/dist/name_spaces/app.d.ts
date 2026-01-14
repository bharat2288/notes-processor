import { CallbackFn, Command, PowerupCode, RegisterPowerupOptions, WidgetLocation, WidgetOptions } from '../interfaces';
import { RNPlugin } from '../plugin_base';
import { InternalCallMethod, NamespaceBase } from './base';
/**
 * # Rem Namespace
 *
 * The API Rem namespace. Call with `plugin.rem.apiMethodName()`.
 */
export declare class AppNamespace extends NamespaceBase {
    private plugin;
    /** @hidden */
    constructor(_call: InternalCallMethod, plugin: RNPlugin);
    registerPowerup: (name: string, code: PowerupCode, description: string, options: RegisterPowerupOptions) => Promise<void>;
    /**
     *  Register a ***Widget***, which is a custom UI element that you can place into RemNote.
     */
    registerWidget: (fileName: string, location: WidgetLocation, options: WidgetOptions) => Promise<void>;
    /**
     *  Unregister a ***Widget***.
     */
    unregisterWidget: (fileName: string, location: WidgetLocation) => Promise<void>;
    /** Register a command in RemNote that triggers your custom logic.
     *
     *  **Example:**
     *
     *  ```typescript
     *  plugin.app.registerCommand({
     *    id: `${this.id}.reminder`,
     *    name: `Remind me in 25min`,
     *    action: () => {
     *      setTimeout(() => this.toast('Reminder is up!'), 2000);
     *    },
     *  });
     *  ```
     */
    registerCommand: (command: Command) => Promise<void>;
    /** @hidden */
    registerSidebarButton: (command: Command) => Promise<void>;
    registerRemMenuItem: (command: Command) => Promise<void>;
    /**
     * Steal keys from the editor. Please see https://github.com/ianstormtaylor/is-hotkey for the syntax for expressing hotkeys.
     *
     * NOTE: You must remember to release the stolen keys by calling the `releaseKeys` method.
     */
    stealKeys: (keys: string[]) => Promise<void>;
    /**
     * Release stolen keys back to the editor. Please see https://github.com/ianstormtaylor/is-hotkey for the syntax for expressing hotkeys.
     */
    releaseKeys: (keys: string[]) => Promise<void>;
    /**
     * Register Custom CSS.
     *
     * **Example:**
     *
     * ```typescript
     * const color = ['red', 'green', 'blue'][Math.floor(Math.random() * 3)];
     * plugin.app.registerCSS("background", `.rem-text { color: ${color};`);
     * ```
     */
    registerCSS: (id: string, css: string) => Promise<void>;
    /**
     * Register a status bar item showing infos on the bottom of the screen.
     *
     * @hidden
     */
    registerStatusBarItem: (id: string, html: string) => Promise<void>;
    /**
     * Register a function that can be called from within RemNote later
     * @hidden
     */
    registerCallback: (callbackId: string, callback: CallbackFn) => Promise<void>;
    /** Show a toast notification in the top right corner. */
    toast: (message: string) => Promise<void>;
}
