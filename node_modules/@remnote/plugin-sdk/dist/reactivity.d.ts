import { Rem, RNPlugin } from '.';
import { AppEvent } from './events';
export declare const apiNamespaces: readonly ["card", "editor", "focus", "messaging", "powerup", "rem", "richText", "settings", "storage", "widget", "window", "search"];
export declare type NamespaceNames = typeof apiNamespaces[number];
export declare type NamespaceObjects = RNPlugin[typeof apiNamespaces[number]];
export declare type Awaited<T> = T extends PromiseLike<infer U> ? U : T;
export declare type PluginReactiveDep = {
    event: AppEvent;
    key: string | undefined;
};
export declare type ReactiveInfo<Method extends (...args: any) => any> = {
    thisDeps?: (rem: Rem) => PluginReactiveDep[];
    argsDeps?: (args: Parameters<Method>) => PluginReactiveDep[];
    resultDeps?: (retVal: Awaited<ReturnType<Method>>) => PluginReactiveDep[];
};
export declare type NamespaceMethodReactiveInfoMap = {
    [Namespace in NamespaceNames & keyof RNPlugin]?: {
        [Method in keyof RNPlugin[Namespace]]?: RNPlugin[Namespace][Method] extends (...args: any) => any ? ReactiveInfo<RNPlugin[Namespace][Method]> : never;
    };
};
export declare type RemObjectReactiveInfoMap = {
    [Method in keyof Rem]?: Rem[Method] extends (...args: any) => any ? ReactiveInfo<Rem[Method]> : never;
};
export declare const remObjectReactiveInfoMap: RemObjectReactiveInfoMap;
export declare const methodNameReactiveInfoMap: NamespaceMethodReactiveInfoMap;
