import type { Code as CodeNodeType } from "@builder/modules/Nodes/domain/nodes";

import get from "lodash/get";
import { useState } from "react";
import { Node, useReactFlow } from "reactflow";

import { SpinnerIcon } from "@builder/Icons";
import { TYPE_ERRORS, renderMessage } from "@builder/common/Toastify";
import { PreviewCode } from "@builder/common/code/Preview.code";
import { TextAreaInput } from "@builder/common/inputs";
import { useCustomsNodes } from "@builder/hook/customNodes.hook";
import { CodeRepository } from "../codeRepository";
import { INPUTS_NAMES_CODE } from "../constants.code";

const codeRepository = new CodeRepository();

export function GenerateCodeView({ nodeId }: { nodeId: string }) {
    const { getNode } = useReactFlow();
    const currentNode = getNode(nodeId) as Node<CodeNodeType>;
    const { updateLocalNode } = useCustomsNodes();

    const { codeInstruction, instruction } = get(currentNode, "data.configuration") ?? {};
    const [isLoading, setIsLoading] = useState(false);
    const [code, setCode] = useState(codeInstruction);

    const updateData = (instrucciónData: string, codeData: string) => {
        const newConfiguration: CodeNodeType = {
            configuration: {
                ...currentNode.data.configuration,
                instruction: instrucciónData,
                codeInstruction: codeData,
            },
        };

        updateLocalNode(nodeId, newConfiguration);
    };

    const handleGenerateCode = (evt: React.FormEvent<HTMLFormElement>) => {
        evt.preventDefault();
        setIsLoading(true);

        const formData = new FormData(evt.currentTarget);
        const instruction = String(formData.get(INPUTS_NAMES_CODE.INSTRUCTION));

        codeRepository
            .generateCode(instruction)
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            .then(({ code }) => {
                setCode(code);
                updateData(instruction, code);
            })
            .catch((error) => {
                renderMessage(error.message, TYPE_ERRORS.ERROR);
            })
            .finally(() => setIsLoading(false));
    };

    return (
        <>
            <form onSubmit={handleGenerateCode}>
                <TextAreaInput
                    hasError=""
                    label="Instruncción"
                    className="h-64 rounded-10 border-1 border-gray-330 bg-white p-3"
                    name={INPUTS_NAMES_CODE.INSTRUCTION}
                    defaultValue={instruction}
                    placeholder="Escribe una instrucción"
                />
                <div className="my-6 flex w-full justify-end">
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="grid h-8 w-52 place-content-center rounded-lg bg-primary-200 px-3 py-1 font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {isLoading ? <SpinnerIcon /> : "Generar código"}
                    </button>
                </div>
            </form>
            <div className="w-[42rem]">{code && <PreviewCode content={code} highlight />}</div>
        </>
    );
}
