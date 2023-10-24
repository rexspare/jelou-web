import dayjs from "dayjs";
import _ from "lodash";

export const AUTO_COMPLETE_SETTINGS = {
    $input: {
        get: (variable: unknown, defaultValue: unknown) => null,
    },
    $output: {
        get: (variable: unknown, defaultValue: unknown) => null,
        set: (variable: unknown, value: unknown) => null,
    },
    $env: {
        get: (key: string, defaultValue?: string) => null,
    },
    $memory: {
        get: (prefix: string, socketId: string, key: string) => null,
        set: (prefix: string, socketId: string, key: string, value: string) => null,
    },
    $context: {
        get: (variable: unknown, defaultValue: unknown) => null,
        getHttpResponse: (variable: unknown) => null,
        set: (variable: unknown, value: unknown) => null,
    },
    $utils: {
        shlink: () => null,
        _,
        dayjs,
    },
};

export const EditorActions = {
    FormatDocument: "editor.action.formatDocument",
};

export const editorOptions = {
    autoClosingBrackets: "always",
    autoClosingQuotes: "always",
    "semanticHighlighting.enabled": true,
    acceptSuggestionOnEnter: "on",
    autoClosingDelete: "always",
    autoIndent: "full",
    lineHeight: 24,
    scrollbar: {
        horizontal: "hidden",
        vertical: "hidden",
    },
    minimap: {
        enabled: false,
    },
    fontSize: 14,
    fontFamily: 'JetBrains Mono, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Ubuntu, "Helvetica Neue", sans-serif',
    bracketPairColorization: {
        enabled: true,
    },
    autoSurround: "languageDefined",
    codeLens: true,
    wordWrap: "on",
    colorDecorators: true,
    contextmenu: true,
    cursorBlinking: "expand",
    autoDetectHighContrast: true,
    cursorSmoothCaretAnimation: "on",
    autoClosingOvertype: "always",
    fontLigatures: true,
    formatOnPaste: true,
    fontVariations: true,
    lineNumbers: "on",
    padding: {
        top: 8,
        bottom: 8,
    },
    tabCompletion: "on",
    inlayHints: {
        enabled: "on",
    },
};
