import { z } from 'zod';
import { AppEvent, AppEventListerKey } from './events';
import { PluginAccessDescendantsOfIdScopeSig, PluginAccessDescendantsOfNameScopeSig, PluginAccessFocusedSubtreeSig, PluginAccessFullKbScopeSig, PluginAccessPowerupScopeSig, PluginAccessScopeSig, PluginManifestV1Sig, VersionSig } from './validation';
export declare enum SelectionType {
    Rem = "Rem",
    Text = "Text"
}
export declare type EditorRange = {
    start: number;
    end: number;
};
export interface RemSelection {
    type: SelectionType.Rem;
    remIds: RemId[];
}
export interface TextSelection {
    type: SelectionType.Text;
    remId: RemId;
    richText: RichTextInterface;
    isReverse: boolean;
    range: EditorRange;
}
export declare const richTextFormatNameCodeMap: {
    quote: string;
    underline: string;
    bold: string;
    italic: string;
};
export declare enum RemColor {
    Red = 1,
    Orange = 2,
    Yellow = 3,
    Green = 4,
    Blue = 6,
    Purple = 5,
    undefined = 0
}
export declare type RichTextFormatName = keyof typeof richTextFormatNameCodeMap | keyof Omit<typeof RemColor, 'undefined'> | 'cloze';
export declare type PluginId = string;
export declare type CallbackFn = (context: Record<string, any>) => void;
export declare type EventCallbackFn = (event: any) => void;
export declare type Version = z.TypeOf<typeof VersionSig>;
/**
 * @ignore
 */
export declare enum PluginActionPermissionLevel {
    Read = "Read",
    ReadCreate = "ReadCreate",
    ReadCreateModify = "ReadCreateModify",
    ReadCreateModifyDelete = "ReadCreateModifyDelete"
}
/**
 * @ignore
 */
export declare enum PluginAccessScopeType {
    All = "All",
    DescendantsOfName = "DescendantsOfName",
    DescendantsOfId = "DescendantsOfId",
    Powerup = "Powerup",
    FocusedSubtree = "FocusedSubtree"
}
/**
 * @ignore
 */
export declare type PluginAccessScope = z.TypeOf<typeof PluginAccessScopeSig>;
/**
 * @ignore
 */
export declare type PluginAccessFullKbScope = z.TypeOf<typeof PluginAccessFullKbScopeSig>;
/**
 * @ignore
 */
export declare type PluginAccessDescendantsOfNameScope = z.TypeOf<typeof PluginAccessDescendantsOfNameScopeSig>;
/**
 * @ignore
 */
export declare type PluginAccessDescendantsOfIdScope = z.TypeOf<typeof PluginAccessDescendantsOfIdScopeSig>;
/**
 * @ignore
 */
export declare type PluginAccessPowerupScope = z.TypeOf<typeof PluginAccessPowerupScopeSig>;
/**
 * @ignore
 */
export declare type PluginAccessFocusedSubtree = z.TypeOf<typeof PluginAccessFocusedSubtreeSig>;
export declare type PluginManifest = z.TypeOf<typeof PluginManifestV1Sig>;
/** @hidden */
export declare type PluginMethodName = string;
/** @hidden */
export declare type PluginMessageId = number;
/** @hidden */
export declare type APIEventMessage = {
    eventId: AppEvent;
    listenerKey: AppEventListerKey;
    args: Record<string, any>;
};
/** @hidden */
export declare type APICallMessage = {
    callbackId: string;
    args: Record<string, any>;
};
/** @hidden */
export declare type APIErrorResponse = {
    messageId: PluginMessageId;
    error: string;
};
/** @hidden */
export declare type APIResponsePayload = any;
/** @hidden */
export declare type APIResponse = {
    messageId: PluginMessageId;
    response: APIResponsePayload;
} | APIErrorResponse;
/** @hidden */
export declare type APIMessage = APIEventMessage | APICallMessage | APIResponse;
/** @hidden */
export declare type WidgetFileName = string;
export interface WidgetOptions {
    powerupFilter?: PowerupCode;
    dimensions?: {
        height?: number | 'auto';
        width?: number | string | 'auto';
    };
    widgetTabTitle?: string;
    widgetTabIcon?: string;
    dontOpenByDefaultInTabLocation?: boolean;
}
export declare type PowerupCode = string;
export declare type PowerupSlotCode = string;
export declare type RegisterPowerupOptions = {
    slots: {
        code: string;
        name: string;
        onlyProgrammaticModifying?: boolean;
        hidden?: boolean;
    }[];
};
/**
 * `WidgetLocation` contains all locations where you could place your custom widget.
 *
 * Use it when registering your widget.
 */
export declare enum WidgetLocation {
    FloatingWidget = "FloatingWidget",
    PaneHeader = "PaneHeader",
    Index = "Index",
    TopBar = "TopBar",
    QueueToolbar = "QueueToolbar",
    DocumentAboveToolbar = "AboveDocumentToolbar",
    DocumentBelowToolbar = "DocumentBelowToolbar",
    DocumentBelowEditor = "DocumentBelowEditor",
    DocumentBelowTitle = "DocumentBelowTitle",
    SidebarEnd = "SidebarEnd",
    RemReferencePopupStart = "RemReferencePopupStart",
    RemReferencePopupRight = "RemReferencePopupRight",
    Pane = "Pane",
    FlashcardAnswer = "FlashcardAnswer",
    Flashcard = "Flashcard",
    FlashcardExtraDetail = "FlashcardExtraDetail",
    RightSidebar = "RightSidebar",
    LeftSidebar = "LeftSidebar",
    Popup = "Popup",
    UnderRemEditor = "UnderRemEditor",
    RightSideOfEditor = "RightSideOfEditor",
    SelectedTextMenu = "SelectedTextMenu"
}
/**
 * RemNote provides various built in powerups
 */
export declare enum BuiltInPowerupCodes {
    Aliases = "l",
    AutoSort = "a",
    AutoTemplate = "m",
    CustomCSS = "c",
    DailyDocument = "d",
    DisableCards = "u",
    Document = "o",
    DocumentSidebar = "s",
    EditLater = "e",
    Emoji = "j",
    ExtraCardDetail = "x",
    Header = "r",
    Highlight = "h",
    Link = "b",
    List = "i",
    MultiLineCard = "w",
    PDFHighlight = "n",
    QuickAdd = "q",
    Slot = "y",
    Sources = "os",
    SuperPrivate = "k",
    Tag = "g",
    Todo = "t",
    UploadedFile = "f",
    WebHighlight = "p",
    Website = "z"
}
export declare const PowerupSlotCodeMap: {
    l: {
        Aliases: string;
    };
    a: {
        SortDirection: string;
    };
    m: {};
    c: {};
    d: {
        Timestamp: string;
        Date: string;
    };
    u: {};
    o: {
        Status: string;
        DeprecatedSource: string;
    };
    s: {};
    e: {
        Message: string;
    };
    j: {};
    x: {};
    r: {
        Size: string;
    };
    h: {
        Color: string;
    };
    b: {
        URL: string;
        Title: string;
    };
    i: {};
    w: {};
    n: {
        Data: string;
        PdfId: string;
    };
    q: {};
    y: {};
    os: {
        Sources: string;
    };
    k: {};
    g: {};
    t: {
        Status: string;
    };
    f: {
        Type: string;
        URL: string;
        Name: string;
        Authors: string;
        Keywords: string;
        Title: string;
        ViewerData: string;
    };
    p: {
        Data: string;
        Url: string;
    };
    z: {
        Hostname: string;
    };
};
interface SettingsDropdownOption {
    key: string;
    label: string;
    value: string;
}
export declare type PowerupSlotCodeMap = typeof PowerupSlotCodeMap;
export declare type SlotCodesForPowerup<PowerupCode extends BuiltInPowerupCodes> = keyof PowerupSlotCodeMap[PowerupCode];
export declare type RemId = string;
export declare type KnowledgeBaseId = string | null;
export declare enum SetRemType {
    DEFAULT_TYPE,
    CONCEPT = 1,
    DESCRIPTOR = 2
}
export declare enum RemType {
    DEFAULT_TYPE,
    CONCEPT = 1,
    DESCRIPTOR = 2,
    PORTAL = 6
}
export { Card } from './name_spaces/card';
export { Rem } from './name_spaces/rem';
export declare type WindowFocusId = string[];
export declare type ComponentFocusId = ComponentFocusableItem[];
export interface ComponentFocusableItem {
    type: ComponentFocusableItemType;
    key?: string;
}
export declare enum ComponentFocusableItemType {
    MultipleWindows = "multipleWindows",
    MultipleWindowsPanel = "multipleWindowsPanel",
    FloatingDiscussion = "floatingDiscussion",
    WindowManager = "windowManager",
    WindowPane = "windowPane",
    Document = "document",
    NotificationPanel = "notificationPanel",
    HierarchyEditorTree = "hierarchyEditorTree",
    HierarchyEditorTreePortal = "hierarchyEditorTreePortal",
    HierarchyEditorTreeRem = "hierarchyEditorTreeRem",
    RichTextEditor = "richTextEditor",
    RichTextEditorItem = "richTextEditorItem",
    RichTextEditorAliasPopup = "richTextEditorAliasPopup",
    Popup = "popup",
    Omnibar = "omnibar",
    QuickAdd = "quickAdd",
    Date = "date",
    Queue = "queue",
    QueryBuilder = "queryBuilder",
    PublishedKnowledgeBase = "publishedKnowledgeBase",
    ArticleViewer = "articleViewer",
    Article = "article",
    FullPageSearch = "fullPageSearch",
    ExtraDate = "extraDate",
    DropToOpenAsDocument = "dropToOpenAsDocument",
    PDF = "pdf",
    PdfPageNumber = "pdfPageNumber",
    RemSearchPopup = "remSearchPopup",
    Debugger = "debugger",
    SelectRem = "selectRem",
    HiddenChildren = "hiddenChildren",
    TableTitle = "tableTitle",
    TableColumnTitle = "tableColumnTitle",
    Toolbar = "toolbar",
    Title = "title",
    PDFUploader = "pdfUploader",
    UserDocument = "userDocument",
    ArticleQueue = "articleQueue",
    DocumentSidebar = "documentSidebar",
    PluginSidebar = "pluginSidebar",
    Documents = "documents",
    AudioVideo = "audioVideo",
    ImageNode = "imageNode",
    QueryNodeEditor = "queryNodeEditor",
    LinkBox = "linkBox",
    SelectedTextMenu = "selectedTextMenu",
    RemReferenceNode = "remReferenceNode",
    DocSources = "docSources",
    AddSources = "addSources",
    InlineLink = "inlineLink",
    ImageSelector = "imageSelector",
    Latex = "latex",
    Image = "image",
    Cloze = "cloze",
    Alias = "alias",
    QueueFolderDropdownSelector = "queueFolderDropdownSelector",
    CustomEditLaterMessage = "customEditLaterMessage",
    DocumentParents = "documentParents",
    AreaHighlight = "areaHighlight",
    WindowOne = "windowOne",
    WindowTwo = "windowTwo",
    Replace = "replace",
    Find = "find",
    Tag = "tag",
    TagBar = "tagBar",
    Menu = "menu",
    Screenshot = "screenshot",
    HelpMessage = "helpMessage",
    AddNode = "addNode",
    EditEdge = "editEdge",
    Controls = "controls",
    DocumentSource = "documentSource",
    Merge = "merge",
    HierarchyEditorTemplateFields = "hierarchyEditorTemplateFields",
    SearchExistingTable = "searchExistingTable",
    PluginRemRichTextEditor = "pluginRemRichTextEditor",
    PluginRichTextViewer = "pluginRichTextViewer",
    RemHierarchyEditorTree = "remHierarchyEditorTree",
    PluginQueue = "pluginQueue",
    RichTextEditorFakeEmbed = "richTextEditorFakeEmbed",
    DocumentHeader = "documentHeader",
    Key = "key",
    Value = "value",
    CtrlF = "ctrlF",
    CtrlFFind = "ctrlFind",
    CtrlFReplace = "ctrlReplace",
    CtrlFFilter = "ctrlFilter",
    SearchResult = "searchResult",
    SearchResultItem = "searchResultItem",
    FocusableInput = "focusableInput"
}
export declare enum FocusPropsType {
    Text = "text",
    SelectedRange = "selectedRange"
}
export declare type FocusElementProps = Partial<FocusPropsTextType> | Partial<FocusPropsSelectRangeType> | undefined;
export interface FocusPropsTextType {
    type: FocusPropsType.Text;
    anchor: number | null;
    focus: number | null;
    prevAnchor: number | null;
    prevFocus: number | null;
}
export interface FocusPropsSelectRangeType {
    type: FocusPropsType.SelectedRange;
    selectedRangePortal: RemId | null;
    selectedRange: RemId[];
    selectedDeepRemHighestLevelIds: RemId[];
    selectedDeepRemAllIds: {
        remId: RemId;
        portalId: RemId;
    }[];
    selectedRangeReversed: boolean;
    selectedRangeFullDepth: number;
    selectedRangeStart: RemId | null;
    selectedRangeEnd: RemId | null;
    prevTextFocusId: ComponentFocusId;
    prevTextFocusProps: Partial<FocusPropsTextType>;
    draggingSelectedRange?: boolean;
    dropPortal?: boolean;
    selectedColumns?: RemId[];
    isTableSelection: boolean;
    tablePortal?: RemId;
    tableParent?: RemId;
    topLeft?: {
        colIdx: number;
        rowIdx: number;
    };
    bottomRight?: {
        colIdx: number;
        rowIdx: number;
    };
}
export declare type MosaicNode<T> = MosaicParent<T> | T;
export declare type MosaicDirection = 'row' | 'column';
export interface MosaicParent<T> {
    direction: MosaicDirection;
    first: MosaicNode<T>;
    second: MosaicNode<T>;
    splitPercentage?: number;
}
export declare type PaneTree = MosaicParent<string>;
export declare type PaneIdWindowTree = MosaicNode<string>;
export declare type RemIdWindowTree = MosaicNode<string>;
export declare type PaneRem = {
    remId: string;
    paneId: string;
};
export declare type PaneRemWindowTree = PaneRem | MosaicParent<PaneRem>;
/**
 * The context in which a command was triggered.
 */
declare enum CommandContext {
    /**
     * The command is always available.
     */
    Global = "global",
    /**
     * The cursor is in a rem for editing.
     */
    RemFocused = "rem-focused",
    /**
     * One or more rems are selected.
     */
    RemSelected = "rem-selected"
}
export interface CommandArgs {
    titleRem?: RemId;
    focusedRem?: RemId;
    selectedRem?: RemId[];
    context: CommandContext;
}
declare type CommandFn = () => void | Promise<void>;
declare type CommandId = string;
export interface SimpleCommand {
    id: CommandId;
    action: CommandFn;
}
/** You can register commands in RemNote, which can be executed in the Omnibar.
 *  Commands can do many things and they're an easy way to execute an action.
 *  Make sure to add `keywords`, an `icon` and a `description` to make it user-friendly! */
export interface Command extends Omit<SimpleCommand, 'action'> {
    name: string;
    description?: string;
    keywords?: string;
    icon?: any;
    action: CommandFn | string;
    keyboardShortcut?: string;
    quickCode?: string;
}
export interface PluginSetting<T extends string | boolean | number> {
    id: string;
    title: string;
    description?: string;
    defaultValue?: T;
}
export interface PluginDropdownSetting extends PluginSetting<string> {
    options: SettingsDropdownOption[];
}
export interface PluginStringSetting extends PluginSetting<string> {
    multiline?: boolean;
}
export interface SlashCommand extends Command {
    quickCode?: string;
}
export declare enum QueueInteractionScore {
    TOO_EARLY = 0.01,
    AGAIN = 0,
    HARD = 0.5,
    GOOD = 1,
    EASY = 1.5
}
export interface CardData {
    _id: RemId;
    owner: KnowledgeBaseId;
    remId: string;
    cardType: 'f' | 'b' | string;
    createdAt: number;
    history?: RepetitionStatus[];
    nextTime: number;
    activeNextTime?: number;
    timesWrongInRow?: number;
    lastRepetitionTime?: number;
    doesntRequireInternetActiveNextTime?: number;
}
export interface RemData {
    _id: RemId;
    owner: KnowledgeBaseId;
    parent: RemId | null;
    children: RemId[];
    type: RemType;
    text: RichTextInterface;
    backText?: RichTextInterface;
    u: number;
    o: number;
}
export declare type CardType = 'forward' | 'backward' | {
    clozeId: string;
};
export declare function makeNamespacedCall(call: (methodName: string, args: Record<string, any>, namespace?: string | string[]) => Promise<any>, namespace: string): (methodName: string, args: Record<string, any>) => Promise<any>;
export declare enum EmbedComponentType {
    Queue = "Queue",
    PreviewRemCards = "ViewAsCard",
    LoadingSpinner = "LoadingSpinner",
    RichTextEditor = "RichTextEditor",
    RichText = "RichTextViewer",
    RemRichTextEditor = "RemRichTextEditor",
    RemViewer = "RemViewer",
    RemHierarchyEditorTree = "RemHierarchyEditorTree"
}
export declare const RICH_TEXT_ELEMENT_TYPE: {
    readonly REM: "q";
    readonly IMAGE: "i";
    readonly AUDIO: "a";
    readonly PLUGIN: "p";
    readonly DRAWING: "r";
    readonly GLOBAL_NAME: "g";
    readonly DEPRECATED_CODE: "o";
    readonly ANNOTATION: "n";
    readonly TEXT: "m";
    readonly LATEX: "x";
    readonly CARD_DELIMITER: "s";
};
export declare const RICH_TEXT_FORMATTING: {
    readonly CLOZE: "cId";
    readonly UNDERLINE: "u";
    readonly BOLD: "b";
    readonly ITALIC: "l";
    readonly INLINE_LINK: "qId";
    readonly QUOTE: "q";
    readonly HIDDEN_CLOZE: "hiddenCloze";
    readonly REVEALED_CLOZE: "revealedCloze";
    readonly HIGHLIGHT: "h";
    readonly DEPRECATED_LINK: "url";
    readonly CODE: "code";
    readonly CODE_LANGUAGE: "language";
    readonly COMMENT_ID: "c";
};
export declare type RICH_TEXT_FORMATTING_KEYS = keyof typeof RICH_TEXT_FORMATTING;
export declare type RICH_TEXT_FORMATTING_VALUES = typeof RICH_TEXT_FORMATTING[RICH_TEXT_FORMATTING_KEYS];
export declare type RichTextFormattingTypeInterface = 'cId' | 'u' | 'b' | 'l' | 'qId' | 'q' | 'hiddenCloze' | 'revealedCloze' | 'h' | 'url' | 'code' | 'c' | 'language';
export declare const DEPRECATED_RICH_TEXT_ELEMENT_TYPES: {
    UNDERLINE: string;
    BOLD: string;
    ITALIC: string;
    QUOTE: string;
    CLOZE: string;
    HIDDEN_CLOZE: string;
    LINK: string;
    HIGHLIGHT: string;
    DATE: string;
};
export declare type RichTextStoreHighlightColor = string;
export declare const DEPRECATED_RICH_TEXT_FORMATTING_TYPES: {
    LATEX: string;
};
export declare const DEPRECATED_RICH_TEXT_ELEMENT_TYPES_TO_NEW_FORMATTING: {
    [x: string]: boolean | "url" | "b" | "q" | "u" | "cId" | "l" | "hiddenCloze" | "h";
};
export declare type RichTextImageClozeBlockInterface = {
    x: number;
    y: number;
    width: number;
    height: number;
    cId: string;
};
export declare type RichTextElementRemInterface = {
    i: 'q';
    _id: RemId;
    aliasId?: RemId | undefined;
    pin?: boolean;
    content?: boolean;
    showFullName?: boolean;
    textOfDeletedRem?: RichTextInterface;
};
export declare type RichTextElementTextInterface = {
    i: 'm';
    text: string;
    workInProgressTag?: boolean;
    workInProgressRem?: boolean;
    workInProgressPortal?: boolean;
    [RICH_TEXT_FORMATTING.CLOZE]?: string;
    [RICH_TEXT_FORMATTING.UNDERLINE]?: boolean;
    [RICH_TEXT_FORMATTING.BOLD]?: boolean;
    [RICH_TEXT_FORMATTING.ITALIC]?: boolean;
    [RICH_TEXT_FORMATTING.QUOTE]?: boolean;
    [RICH_TEXT_FORMATTING.CODE]?: boolean;
    [RICH_TEXT_FORMATTING.REVEALED_CLOZE]?: boolean;
    [RICH_TEXT_FORMATTING.HIDDEN_CLOZE]?: boolean;
    block?: boolean;
    [RICH_TEXT_FORMATTING.HIGHLIGHT]?: number;
    [RICH_TEXT_FORMATTING.DEPRECATED_LINK]?: string;
    [RICH_TEXT_FORMATTING.CODE_LANGUAGE]?: string;
    title?: string;
    [RICH_TEXT_FORMATTING.INLINE_LINK]?: string;
};
export declare type RichTextImageInterface = {
    i: 'i';
    url: string;
    blocks?: RichTextImageClozeBlockInterface[];
    width?: number;
    height?: number;
    percent?: 25 | 50 | 100 | undefined;
    loading?: boolean;
    title?: string;
};
export declare type RichTextAudioInterface = {
    i: 'a';
    url: string;
    onlyAudio: boolean;
    width?: number;
    height?: number;
    percent?: 25 | 50 | 100 | undefined;
};
export declare type RichTextPluginInterface = {
    i: 'p';
    url: string;
    pluginName?: string;
};
export declare type RichTextLatexInterface = {
    i: 'x';
    text: string;
    block?: boolean;
};
export declare type RichTextGlobalNameInterface = {
    i: 'g';
    _id: string | null;
};
export declare type RichTextCardDelimiterInterface = {
    i: 's';
    delimiterCharacterForSerialization?: string;
};
export declare type RichTextAnnotationInterface = {
    i: 'n';
    url: string;
    text: string;
    highlighterSerialization: {
        text: string;
    };
};
export declare type RichTextElementItemInterface = RichTextElementTextInterface | RichTextElementRemInterface | RichTextImageInterface | RichTextAudioInterface | RichTextPluginInterface | RichTextGlobalNameInterface | RichTextLatexInterface | RichTextCardDelimiterInterface | RichTextAnnotationInterface;
export declare type RichTextElementInterface = RichTextElementItemInterface | (string & {
    i?: undefined;
});
export declare type RichTextInterface = RichTextElementInterface[];
export declare enum REM_TYPE {
    DEFAULT_TYPE,
    CONCEPT = 1,
    DESCRIPTOR = 2,
    DEPRECATED_BASIC_CARD = 4,
    PORTAL = 6,
    DEPRECATED_SLOT = 3,
    DEPRECATED_PATTERN = 5,
    DEPRECATED_COLLECTION = 7,
    DEPRECATED_TEXT = 8
}
export declare enum PORTAL_TYPE {
    PORTAL,
    EMBEDDED_QUEUE = 2,
    SCAFFOLD = 3,
    SEARCH_PORTAL = 4
}
export interface RepetitionStatus {
    date: Date | number;
    score: QueueInteractionScore;
    responseTime: number;
}
export interface WidgetLocationContextDataMap {
    [WidgetLocation.LeftSidebar]: undefined;
    [WidgetLocation.RightSidebar]: undefined;
    [WidgetLocation.FloatingWidget]: {
        floatingWidgetId: string;
    };
    [WidgetLocation.PaneHeader]: {
        paneId: string;
    };
    [WidgetLocation.Index]: undefined;
    [WidgetLocation.TopBar]: undefined;
    [WidgetLocation.QueueToolbar]: {
        cardId: string;
        remId: string;
    };
    [WidgetLocation.DocumentAboveToolbar]: {
        documentId: string;
    };
    [WidgetLocation.DocumentBelowToolbar]: {
        documentId: string;
    };
    [WidgetLocation.DocumentBelowEditor]: {
        documentId: string;
    };
    [WidgetLocation.DocumentBelowTitle]: {
        documentId: string;
    };
    [WidgetLocation.SidebarEnd]: undefined;
    [WidgetLocation.RemReferencePopupStart]: {
        remId: string;
    };
    [WidgetLocation.RemReferencePopupRight]: {
        remId: string;
    };
    [WidgetLocation.Pane]: {
        paneId: string;
        contextData: any;
    };
    [WidgetLocation.Flashcard]: {
        remId: string;
        cardId: string;
        revealed: boolean;
    };
    [WidgetLocation.FlashcardAnswer]: {
        remId: string;
        cardId: string;
        revealed: boolean;
    };
    [WidgetLocation.FlashcardExtraDetail]: {
        remId: string;
        cardId: string;
        revealed: boolean;
    };
    [WidgetLocation.Popup]: {
        focusedRemId?: string;
        focusedPortalId?: string;
        contextData: any;
    };
    [WidgetLocation.UnderRemEditor]: {
        remId: string;
    };
    [WidgetLocation.RightSideOfEditor]: {
        remId: string;
    };
    [WidgetLocation.SelectedTextMenu]: undefined;
}
export declare enum MoveUnit {
    OFFSET = 0,
    UNIT = 1,
    CHARACTER = 2,
    WORD = 3,
    WORD_START = 4,
    WORD_END = 5,
    LINE = 6
}
