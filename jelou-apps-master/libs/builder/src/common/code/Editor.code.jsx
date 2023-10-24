import Editor, { useMonaco } from "@monaco-editor/react";
import { useEffect } from "react";

import { CUSTOM_LANGUAGE_ID, CustomLanguajeEditor } from "./CustomLanguaje.Editor";
import { ShowAutocompletion } from "./autoComplete";
import { AUTO_COMPLETE_SETTINGS, editorOptions } from "./constanst.editor";

export const defaultValueEditor = `
// code here
`;

let isCreated = false;

/**
 * @param {{
 * onChange?: (value: string, event: any) => void,
 * defaultValue?: string,
 * height?: string,
 * defaultLanguage?: string
 * }} props
 */
export const EditorCode = ({ onChange = () => null, defaultValue = defaultValueEditor, height = "35rem", defaultLanguage = "javascript" }) => {
    const monaco = useMonaco();

    useEffect(() => {
        if (isCreated || monaco === null) return;
        isCreated = true;
        ShowAutocompletion(AUTO_COMPLETE_SETTINGS, monaco);
    }, [monaco]);

    if (defaultLanguage === CUSTOM_LANGUAGE_ID) {
        return <CustomLanguajeEditor onChange={onChange} defaultValue={defaultValue} />;
    }

    return (
        <Editor
            className="[&_.current-line]:!border-none"
            keepCurrentModel
            options={editorOptions}
            // theme='vs-dark'
            onChange={onChange}
            height={height}
            language={defaultLanguage}
            defaultValue={defaultValue}
        />
    );
};
