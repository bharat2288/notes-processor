import { PluginAccessScopeType, PluginActionPermissionLevel } from './interfaces';
import { z } from 'zod';
export declare const PluginActionPermissionLevelSig: z.ZodNativeEnum<typeof PluginActionPermissionLevel>;
export declare const PluginAccessScopeTypeSig: z.ZodNativeEnum<typeof PluginAccessScopeType>;
export declare const PluginAccessFullKbScopeSig: z.ZodObject<z.extendShape<{
    type: z.ZodLiteral<PluginAccessScopeType.All>;
}, {
    level: z.ZodNativeEnum<typeof PluginActionPermissionLevel>;
}>, "strip", z.ZodTypeAny, {
    type: PluginAccessScopeType.All;
    level: PluginActionPermissionLevel;
}, {
    type: PluginAccessScopeType.All;
    level: PluginActionPermissionLevel;
}>;
export declare const PluginAccessDescendantsOfNameScopeSig: z.ZodObject<z.extendShape<{
    type: z.ZodLiteral<PluginAccessScopeType.DescendantsOfName>;
    remName: z.ZodString;
}, {
    level: z.ZodNativeEnum<typeof PluginActionPermissionLevel>;
}>, "strip", z.ZodTypeAny, {
    type: PluginAccessScopeType.DescendantsOfName;
    level: PluginActionPermissionLevel;
    remName: string;
}, {
    type: PluginAccessScopeType.DescendantsOfName;
    level: PluginActionPermissionLevel;
    remName: string;
}>;
export declare const PluginAccessDescendantsOfIdScopeSig: z.ZodObject<z.extendShape<{
    type: z.ZodLiteral<PluginAccessScopeType.DescendantsOfId>;
    remId: z.ZodString;
}, {
    level: z.ZodNativeEnum<typeof PluginActionPermissionLevel>;
}>, "strip", z.ZodTypeAny, {
    type: PluginAccessScopeType.DescendantsOfId;
    remId: string;
    level: PluginActionPermissionLevel;
}, {
    type: PluginAccessScopeType.DescendantsOfId;
    remId: string;
    level: PluginActionPermissionLevel;
}>;
export declare const PluginAccessPowerupScopeSig: z.ZodObject<z.extendShape<{
    type: z.ZodLiteral<PluginAccessScopeType.Powerup>;
    powerupCode: z.ZodString;
}, {
    level: z.ZodNativeEnum<typeof PluginActionPermissionLevel>;
}>, "strip", z.ZodTypeAny, {
    type: PluginAccessScopeType.Powerup;
    powerupCode: string;
    level: PluginActionPermissionLevel;
}, {
    type: PluginAccessScopeType.Powerup;
    powerupCode: string;
    level: PluginActionPermissionLevel;
}>;
export declare const PluginAccessFocusedSubtreeSig: z.ZodObject<z.extendShape<{
    type: z.ZodLiteral<PluginAccessScopeType.FocusedSubtree>;
}, {
    level: z.ZodNativeEnum<typeof PluginActionPermissionLevel>;
}>, "strip", z.ZodTypeAny, {
    type: PluginAccessScopeType.FocusedSubtree;
    level: PluginActionPermissionLevel;
}, {
    type: PluginAccessScopeType.FocusedSubtree;
    level: PluginActionPermissionLevel;
}>;
export declare const PluginAccessScopeSig: z.ZodUnion<[z.ZodObject<z.extendShape<{
    type: z.ZodLiteral<PluginAccessScopeType.All>;
}, {
    level: z.ZodNativeEnum<typeof PluginActionPermissionLevel>;
}>, "strip", z.ZodTypeAny, {
    type: PluginAccessScopeType.All;
    level: PluginActionPermissionLevel;
}, {
    type: PluginAccessScopeType.All;
    level: PluginActionPermissionLevel;
}>, z.ZodObject<z.extendShape<{
    type: z.ZodLiteral<PluginAccessScopeType.DescendantsOfName>;
    remName: z.ZodString;
}, {
    level: z.ZodNativeEnum<typeof PluginActionPermissionLevel>;
}>, "strip", z.ZodTypeAny, {
    type: PluginAccessScopeType.DescendantsOfName;
    level: PluginActionPermissionLevel;
    remName: string;
}, {
    type: PluginAccessScopeType.DescendantsOfName;
    level: PluginActionPermissionLevel;
    remName: string;
}>, z.ZodObject<z.extendShape<{
    type: z.ZodLiteral<PluginAccessScopeType.DescendantsOfId>;
    remId: z.ZodString;
}, {
    level: z.ZodNativeEnum<typeof PluginActionPermissionLevel>;
}>, "strip", z.ZodTypeAny, {
    type: PluginAccessScopeType.DescendantsOfId;
    remId: string;
    level: PluginActionPermissionLevel;
}, {
    type: PluginAccessScopeType.DescendantsOfId;
    remId: string;
    level: PluginActionPermissionLevel;
}>, z.ZodObject<z.extendShape<{
    type: z.ZodLiteral<PluginAccessScopeType.Powerup>;
    powerupCode: z.ZodString;
}, {
    level: z.ZodNativeEnum<typeof PluginActionPermissionLevel>;
}>, "strip", z.ZodTypeAny, {
    type: PluginAccessScopeType.Powerup;
    powerupCode: string;
    level: PluginActionPermissionLevel;
}, {
    type: PluginAccessScopeType.Powerup;
    powerupCode: string;
    level: PluginActionPermissionLevel;
}>, z.ZodObject<z.extendShape<{
    type: z.ZodLiteral<PluginAccessScopeType.FocusedSubtree>;
}, {
    level: z.ZodNativeEnum<typeof PluginActionPermissionLevel>;
}>, "strip", z.ZodTypeAny, {
    type: PluginAccessScopeType.FocusedSubtree;
    level: PluginActionPermissionLevel;
}, {
    type: PluginAccessScopeType.FocusedSubtree;
    level: PluginActionPermissionLevel;
}>]>;
export declare const VersionSig: z.ZodObject<{
    major: z.ZodNumber;
    minor: z.ZodNumber;
    patch: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    major: number;
    minor: number;
    patch: number;
}, {
    major: number;
    minor: number;
    patch: number;
}>;
export declare const PluginManifestV1Sig: z.ZodObject<{
    id: z.ZodEffects<z.ZodString, string, string>;
    name: z.ZodString;
    version: z.ZodObject<{
        major: z.ZodNumber;
        minor: z.ZodNumber;
        patch: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        major: number;
        minor: number;
        patch: number;
    }, {
        major: number;
        minor: number;
        patch: number;
    }>;
    manifestVersion: z.ZodLiteral<1>;
    requestNative: z.ZodBoolean;
    requiredScopes: z.ZodArray<z.ZodUnion<[z.ZodObject<z.extendShape<{
        type: z.ZodLiteral<PluginAccessScopeType.All>;
    }, {
        level: z.ZodNativeEnum<typeof PluginActionPermissionLevel>;
    }>, "strip", z.ZodTypeAny, {
        type: PluginAccessScopeType.All;
        level: PluginActionPermissionLevel;
    }, {
        type: PluginAccessScopeType.All;
        level: PluginActionPermissionLevel;
    }>, z.ZodObject<z.extendShape<{
        type: z.ZodLiteral<PluginAccessScopeType.DescendantsOfName>;
        remName: z.ZodString;
    }, {
        level: z.ZodNativeEnum<typeof PluginActionPermissionLevel>;
    }>, "strip", z.ZodTypeAny, {
        type: PluginAccessScopeType.DescendantsOfName;
        level: PluginActionPermissionLevel;
        remName: string;
    }, {
        type: PluginAccessScopeType.DescendantsOfName;
        level: PluginActionPermissionLevel;
        remName: string;
    }>, z.ZodObject<z.extendShape<{
        type: z.ZodLiteral<PluginAccessScopeType.DescendantsOfId>;
        remId: z.ZodString;
    }, {
        level: z.ZodNativeEnum<typeof PluginActionPermissionLevel>;
    }>, "strip", z.ZodTypeAny, {
        type: PluginAccessScopeType.DescendantsOfId;
        remId: string;
        level: PluginActionPermissionLevel;
    }, {
        type: PluginAccessScopeType.DescendantsOfId;
        remId: string;
        level: PluginActionPermissionLevel;
    }>, z.ZodObject<z.extendShape<{
        type: z.ZodLiteral<PluginAccessScopeType.Powerup>;
        powerupCode: z.ZodString;
    }, {
        level: z.ZodNativeEnum<typeof PluginActionPermissionLevel>;
    }>, "strip", z.ZodTypeAny, {
        type: PluginAccessScopeType.Powerup;
        powerupCode: string;
        level: PluginActionPermissionLevel;
    }, {
        type: PluginAccessScopeType.Powerup;
        powerupCode: string;
        level: PluginActionPermissionLevel;
    }>, z.ZodObject<z.extendShape<{
        type: z.ZodLiteral<PluginAccessScopeType.FocusedSubtree>;
    }, {
        level: z.ZodNativeEnum<typeof PluginActionPermissionLevel>;
    }>, "strip", z.ZodTypeAny, {
        type: PluginAccessScopeType.FocusedSubtree;
        level: PluginActionPermissionLevel;
    }, {
        type: PluginAccessScopeType.FocusedSubtree;
        level: PluginActionPermissionLevel;
    }>]>, "atleastone">;
    repoUrl: z.ZodString;
    author: z.ZodString;
    enableOnMobile: z.ZodBoolean;
    minimumRemNoteVersion: z.ZodOptional<z.ZodObject<{
        major: z.ZodNumber;
        minor: z.ZodNumber;
        patch: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        major: number;
        minor: number;
        patch: number;
    }, {
        major: number;
        minor: number;
        patch: number;
    }>>;
    description: z.ZodOptional<z.ZodString>;
    projectUrl: z.ZodOptional<z.ZodString>;
    supportUrl: z.ZodOptional<z.ZodString>;
    changelogUrl: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    description?: string | undefined;
    minimumRemNoteVersion?: {
        major: number;
        minor: number;
        patch: number;
    } | undefined;
    projectUrl?: string | undefined;
    supportUrl?: string | undefined;
    changelogUrl?: string | undefined;
    id: string;
    name: string;
    version: {
        major: number;
        minor: number;
        patch: number;
    };
    manifestVersion: 1;
    requestNative: boolean;
    requiredScopes: [{
        type: PluginAccessScopeType.All;
        level: PluginActionPermissionLevel;
    } | {
        type: PluginAccessScopeType.DescendantsOfName;
        level: PluginActionPermissionLevel;
        remName: string;
    } | {
        type: PluginAccessScopeType.DescendantsOfId;
        remId: string;
        level: PluginActionPermissionLevel;
    } | {
        type: PluginAccessScopeType.Powerup;
        powerupCode: string;
        level: PluginActionPermissionLevel;
    } | {
        type: PluginAccessScopeType.FocusedSubtree;
        level: PluginActionPermissionLevel;
    }, ...({
        type: PluginAccessScopeType.All;
        level: PluginActionPermissionLevel;
    } | {
        type: PluginAccessScopeType.DescendantsOfName;
        level: PluginActionPermissionLevel;
        remName: string;
    } | {
        type: PluginAccessScopeType.DescendantsOfId;
        remId: string;
        level: PluginActionPermissionLevel;
    } | {
        type: PluginAccessScopeType.Powerup;
        powerupCode: string;
        level: PluginActionPermissionLevel;
    } | {
        type: PluginAccessScopeType.FocusedSubtree;
        level: PluginActionPermissionLevel;
    })[]];
    repoUrl: string;
    author: string;
    enableOnMobile: boolean;
}, {
    description?: string | undefined;
    minimumRemNoteVersion?: {
        major: number;
        minor: number;
        patch: number;
    } | undefined;
    projectUrl?: string | undefined;
    supportUrl?: string | undefined;
    changelogUrl?: string | undefined;
    id: string;
    name: string;
    version: {
        major: number;
        minor: number;
        patch: number;
    };
    manifestVersion: 1;
    requestNative: boolean;
    requiredScopes: [{
        type: PluginAccessScopeType.All;
        level: PluginActionPermissionLevel;
    } | {
        type: PluginAccessScopeType.DescendantsOfName;
        level: PluginActionPermissionLevel;
        remName: string;
    } | {
        type: PluginAccessScopeType.DescendantsOfId;
        remId: string;
        level: PluginActionPermissionLevel;
    } | {
        type: PluginAccessScopeType.Powerup;
        powerupCode: string;
        level: PluginActionPermissionLevel;
    } | {
        type: PluginAccessScopeType.FocusedSubtree;
        level: PluginActionPermissionLevel;
    }, ...({
        type: PluginAccessScopeType.All;
        level: PluginActionPermissionLevel;
    } | {
        type: PluginAccessScopeType.DescendantsOfName;
        level: PluginActionPermissionLevel;
        remName: string;
    } | {
        type: PluginAccessScopeType.DescendantsOfId;
        remId: string;
        level: PluginActionPermissionLevel;
    } | {
        type: PluginAccessScopeType.Powerup;
        powerupCode: string;
        level: PluginActionPermissionLevel;
    } | {
        type: PluginAccessScopeType.FocusedSubtree;
        level: PluginActionPermissionLevel;
    })[]];
    repoUrl: string;
    author: string;
    enableOnMobile: boolean;
}>;
export declare type PluginManifestV1 = z.TypeOf<typeof PluginManifestV1Sig>;
interface ValidationError {
    field: string;
    message: string;
    expected?: string;
    received?: string;
}
export declare const formatValidationError: (e: ValidationError) => string;
declare type Success<T> = {
    success: true;
    data: T;
};
declare type Fail<T> = {
    success: false;
    errors: T;
};
declare type Either<E, A> = Fail<E> | Success<A>;
export declare const parseManifest: (m: any) => Either<ValidationError[], PluginManifestV1>;
export {};
