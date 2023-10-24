import type { Code as CodeNodeType } from "@builder/modules/Nodes/domain/nodes";

import { useMonaco } from "@monaco-editor/react";
import { debounce, get } from "lodash";
import { Suspense, useCallback, useState } from "react";
import { useReactFlow, type Node } from "reactflow";

import { DocAIIcon, GenerateCodeAI } from "@builder/Icons";
import { TippyWrapper } from "@builder/common/Tippy.custom";
import { EditorCode } from "@builder/common/code/Editor.code";
import { EditorActions } from "@builder/common/code/constanst.editor";
import { useCustomsNodes } from "@builder/hook/customNodes.hook";

import { CodeAIModal } from "./component/CodeAI.modal";
import { DocumentationAIModal } from "./component/DocumentationAI.modal";
import { INPUTS_NAMES_CODE } from "./constants.code";

export const CodeConfigPanel = ({ nodeId }: { nodeId: string }) => {
    const { getNode } = useReactFlow();
    const currentNode = getNode(nodeId) as Node<CodeNodeType>;
    const { content } = get(currentNode, "data.configuration") ?? {};

    const [isOpenDocsModal, setIsOpenDocsModal] = useState(false);
    const [isOpenCodeModal, setIsOpenCodeModal] = useState(false);

    const { updateLocalNode } = useCustomsNodes();
    const monaco = useMonaco();

    const updateData = useCallback(
        (name: string, value: string) => {
            const currentNode = getNode(nodeId) as Node<CodeNodeType>;

            const newConfiguration = {
                configuration: {
                    ...currentNode.data.configuration,
                    [name]: value,
                },
            };

            updateLocalNode(nodeId, newConfiguration);
        },
        [getNode, nodeId, updateLocalNode]
    );

    const handleChangeEditor = debounce((value) => updateData(INPUTS_NAMES_CODE.CONTENT, value), 500);

    const handleFormatEditor = useCallback(() => {
        if (!monaco) return;

        const editors = monaco.editor.getEditors();
        const editor = editors[editors.length - 1];
        editor?.getAction(EditorActions.FormatDocument)?.run();
    }, [monaco]);

    return (
        <main className="h-[80vh] p-6 text-gray-400">
            <header className="mb-6 flex w-full justify-end gap-6 text-[#814FEC]">
                <button onClick={() => handleFormatEditor()}>Formatear</button>

                <TippyWrapper content="Generar Documentación con AI">
                    <button onClick={() => setIsOpenDocsModal(true)}>
                        <DocAIIcon />
                    </button>
                </TippyWrapper>

                <TippyWrapper content="Asistente de código con AI">
                    <button onClick={() => setIsOpenCodeModal(true)}>
                        <GenerateCodeAI />
                    </button>
                </TippyWrapper>
            </header>
            <div className="h-full overflow-hidden rounded-10 border-1 border-gray-330">
                <EditorCode height="75vh" defaultValue={content} onChange={handleChangeEditor} />
            </div>

            <Suspense fallback={null}>
                {isOpenDocsModal && <DocumentationAIModal isOpen={isOpenDocsModal} onClose={() => setIsOpenDocsModal(false)} nodeId={nodeId} />}

                {isOpenCodeModal && <CodeAIModal isOpen={isOpenCodeModal} onClose={() => setIsOpenCodeModal(false)} nodeId={nodeId} />}
            </Suspense>
        </main>
    );
};
