import loader from "@monaco-editor/loader";
import { useEffect } from "react";
import { ShowAutocompletion } from "./autoComplete";
import { AUTO_COMPLETE_SETTINGS, editorOptions } from "./constanst.editor";

export const CUSTOM_LANGUAGE_ID = "myCustomJson";

const initialContentDefault = "";

function loadMonaco(onChange, defaultValue) {
    loader.init().then((monaco) => {
        const wrapper = document.getElementById("custom-editor");
        wrapper && wrapper.setAttribute("class", "[&_.current-line]:!border-none !h-[50vh] py-4");

        ShowAutocompletion(AUTO_COMPLETE_SETTINGS, monaco, CUSTOM_LANGUAGE_ID);

        monaco.languages.register({ id: CUSTOM_LANGUAGE_ID });

        // Define the new language configurations
        monaco.languages.setLanguageConfiguration(CUSTOM_LANGUAGE_ID, {
            autoClosingPairs: [
                { open: "{", close: "}" },
                { open: "[", close: "]" },
            ],
        });

        monaco.languages.setMonarchTokensProvider(CUSTOM_LANGUAGE_ID, {
            tokenizer: {
                root: [
                    [/"/, { token: "string.quote", bracket: "@open", next: "@string" }],
                    [/{{.*}}/, "custom-token"],
                    [/null|undefined/, "null"],
                    [/[0-9]+/, "number"],
                    [/true|false/, "boolean"],
                    [/[a-z_][\w-]*/, "key"],
                    [/[{}[\]]/, "@brackets"],
                    [/[,]/, "delimiter.comma"],
                    [/[:]/, "delimiter.colon"],
                    [/\s/, "white"],
                ],

                string: [
                    [/[^"]+/, "string"],
                    [/"/, { token: "string.quote", bracket: "@close", next: "@pop" }],
                ],
            },
        });

        const initialContent = defaultValue || initialContentDefault;

        const model = monaco.editor.createModel(initialContent, CUSTOM_LANGUAGE_ID);
        const editor = monaco.editor.create(wrapper, { model: model, ...editorOptions });

        const validateJson = (content) => {
            let markers = [];
            let lines = content.split("\n");

            lines.forEach((line, lineNumber) => {
                line.replace(/{{(.*?)}}/g, function (match, matchContent) {
                    if (!matchContent.match(/^\$context\.\w+$|^\$input\.\w+$/)) {
                        markers.push({
                            severity: monaco.MarkerSeverity.Error,
                            message: `Invalid variable declaration - ${match}. Expect $context.someVarible or $input.someVarible`,
                            startLineNumber: lineNumber + 1,
                            startColumn: line.indexOf(match),
                            endLineNumber: lineNumber + 1,
                            endColumn: line.indexOf(match) + match.length,
                        });
                        return `"__customSyntax"`;
                    }
                });
            });

            content = content.replace(/{{.*?}}/g, ` "__customSyntax"`);

            try {
                JSON.parse(content);
            } catch (e) {
                markers.push({
                    severity: monaco.MarkerSeverity.Error,
                    message: e.message,
                    startLineNumber: 1,
                    startColumn: 1,
                    endLineNumber: 1,
                    endColumn: 1,
                });
            }

            lines.forEach((line, index) => {
                if (line.trim()[0] !== '"' && line.trim().includes(":")) {
                    markers.push({
                        severity: monaco.MarkerSeverity.Error,
                        message: "Property keys must be doublequoted",
                        startLineNumber: index + 1,
                        startColumn: 1,
                        endLineNumber: index + 2,
                        endColumn: 1,
                    });
                }
            });

            monaco.editor.setModelMarkers(editor.getModel(), "owner", markers);
        };

        // Validate on content change.
        model.onDidChangeContent((event) => {
            const content = model.getValue();
            validateJson(content);
            if (onChange && typeof onChange === "function") onChange(content);
        });

        // Validate initial content.
        validateJson(initialContent);
    });
}

export const CustomLanguajeEditor = ({ onChange, defaultValue }) => {
    useEffect(() => {
        loadMonaco(onChange, defaultValue);
    }, []);

    return <div id="custom-editor"></div>;
};
