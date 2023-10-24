import debounce from "lodash/debounce";
import { useCallback, useState } from "react";

import { SpinnerIcon } from "@builder/Icons";
import { EditorCode } from "@builder/common/code/Editor.code";
import { OutputExecution } from "@builder/pages/Home/ToolKits/types.toolkits";
import { KEY_NAME, TestInputRepository } from "./TestInputRepository";
import { useExecutationTool } from "./executationTool.hook";

type CodeExecutionToolsProps = {
    handleClearToolTest: () => void;
    setOutputExecuted: (output: OutputExecution | null) => void;
};

export function CodeExecutionTools({ handleClearToolTest, setOutputExecuted }: CodeExecutionToolsProps) {
    const [inputData, setInputData] = useState(() => TestInputRepository.get(KEY_NAME.INPUT, {} as Record<string, string>));
    const { execute, isLoadingOutput } = useExecutationTool({ setOutputExecuted });

    const handleChangeEditor = useCallback(
        debounce((value, event) => {
            try {
                const input = JSON.parse(value);
                setInputData(input);
            } catch (err) {
                // renderMessage("Tuvimos un error al recuperar la información de la última ejecución", TYPE_ERRORS.ERROR);
            }
        }, 1000),
        []
    );

    const handleExecuteTool = () => execute({ inputData });

    return (
        <div className="grid h-full w-full grid-rows-[max-content] gap-4 rounded-b-lg border-x-1 border-b-1 bg-white pt-2 text-gray-400 shadow">
            <span className="sr-only">code test tools</span>
            <EditorCode height="22rem" onChange={handleChangeEditor} defaultLanguage="json" defaultValue={JSON.stringify(inputData, null, 2)} />

            <footer className="flex justify-end gap-2 self-end pb-6 pr-6">
                <button type="button" onClick={handleClearToolTest} className="h-8 w-24 rounded-20 bg-primary-700 px-4 font-semibold text-gray-400 disabled:cursor-not-allowed disabled:opacity-40">
                    Limpiar
                </button>
                <button
                    onClick={handleExecuteTool}
                    type="submit"
                    className="flex h-8 w-24 items-center justify-center rounded-20 bg-primary-200 px-4 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40"
                >
                    {isLoadingOutput ? <SpinnerIcon /> : "Ejecutar"}
                </button>
            </footer>
        </div>
    );
}
