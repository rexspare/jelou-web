import type { Code as CodeNodeType } from "@builder/modules/Nodes/domain/nodes";

import { get } from "lodash";
import { useState } from "react";
import { Node, useReactFlow } from "reactflow";

import { CloseIcon, DocAIIcon, EmptyDocs, SpinnerIcon } from "@builder/Icons";
import { ModalHeadless } from "@builder/common/Headless/Modal";
import { Switch } from "@builder/common/Headless/conditionalRendering";
import { TYPE_ERRORS, renderMessage } from "@builder/common/Toastify";
import { PreviewCode } from "@builder/common/code/Preview.code";
import { useCustomsNodes } from "@builder/hook/customNodes.hook";
import { CodeRepository } from "../codeRepository";

const codeRepository = new CodeRepository();

type DocumentationAIModalProps = {
    isOpen: boolean;
    onClose: () => void;
    nodeId: string;
};

export const DocumentationAIModal = ({ isOpen, onClose, nodeId }: DocumentationAIModalProps) => {
    const { getNode } = useReactFlow();

    const currentNode = getNode(nodeId) as Node<CodeNodeType>;
    const { content, description } = get(currentNode, "data.configuration") ?? {};

    const [isLoadingGenerateDocs, setIsLoadingGenerateDocs] = useState(false);
    const [showGenerateDocs, setShowGenerateDocs] = useState(Boolean(description));
    const [htmlText, setHtmlText] = useState(description ?? "");

    const { updateLocalNode } = useCustomsNodes();

    const saveHtmlText = (html: string) => {
        const currentNode = getNode(nodeId) as Node<CodeNodeType>;

        const newConfiguration = {
            configuration: {
                ...currentNode.data.configuration,
                description: html,
            },
        };

        updateLocalNode(nodeId, newConfiguration);
    };

    const handleGenerateDocumentationClick = async () => {
        setIsLoadingGenerateDocs(true);
        setHtmlText("");

        try {
            const response = await codeRepository.documentation(content);
            if (!response.body) {
                renderMessage("Tuvimos un problema generando esta documentación, por favor intente neuvamente recargando la página. Si persiste comuniquese con un operador", TYPE_ERRORS.ERROR);
                setIsLoadingGenerateDocs(false);
                return;
            }

            setShowGenerateDocs(true);
            const html = await codeRepository.readStream(response, setHtmlText);
            saveHtmlText(html);
        } catch (error) {
            renderMessage("Tuvimos un problema generando esta documentación, por favor intente neuvamente recargando la página. Si persiste comuniquese con un operador", TYPE_ERRORS.ERROR);
        } finally {
            setIsLoadingGenerateDocs(false);
        }
    };

    return (
        <ModalHeadless isOpen={isOpen} closeModal={onClose} showBtns={false} showClose={false} className="h-[80vh] w-[85vw]">
            <header className="flex h-12 justify-between rounded-t-[14px] bg-[#D7B8FF] px-7 text-[#36055C]">
                <div className="flex items-center gap-3">
                    <DocAIIcon />
                    <h3 className="text-lg font-medium">Generar Documentación con IA</h3>
                </div>
                <button onClick={onClose}>
                    <CloseIcon />
                </button>
            </header>

            <main className="grid h-[calc(100%-60px)] grid-cols-2 overflow-scroll text-[#36055C]">
                <div>
                    <h4 className="my-4 ml-7 font-medium">Código</h4>
                    <div className="mx-7 h-[calc(100%-100px)]">
                        <PreviewCode highlight classNameWrapp="h-full" className="h-full" content={content} />
                    </div>
                </div>

                <div className="mr-7">
                    <h4 className="my-4 flex items-center gap-2 font-medium">
                        Documentación
                        {isLoadingGenerateDocs && <SpinnerIcon width={15} />}
                    </h4>
                    <Switch>
                        <Switch.Case condition={showGenerateDocs}>
                            <>
                                <div
                                    dangerouslySetInnerHTML={{ __html: htmlText }}
                                    className="h-[calc(100%-100px)] space-y-3 overflow-y-scroll break-words rounded-12 border-1 border-gray-330 p-3 [&_li]:my-2 [&_code]:rounded-md [&_code]:bg-gray-330 [&_code]:p-1 [&_h3]:font-semibold [&_ol]:ml-6 [&_ol]:!list-decimal [&_ul]:ml-6 [&_ul]:!list-disc"
                                />
                                <div className="mt-2 flex w-full justify-end">
                                    <button
                                        disabled={isLoadingGenerateDocs}
                                        onClick={handleGenerateDocumentationClick}
                                        className="grid h-8 w-40 place-content-center rounded-lg bg-[#D7B8FF] font-medium disabled:cursor-not-allowed disabled:opacity-60"
                                    >
                                        {isLoadingGenerateDocs ? <SpinnerIcon /> : "Volver a generar"}
                                    </button>
                                </div>
                            </>
                        </Switch.Case>
                        <Switch.Default>
                            <div className="grid h-[calc(100%-100px)] w-full place-content-center gap-4 rounded-12 border-1 border-gray-330">
                                <div className="grid w-full place-content-center">
                                    <EmptyDocs />
                                </div>
                                <p>
                                    <span className="font-medium">Documenta</span> tu código, con la ayuda de AI
                                </p>
                                <button
                                    disabled={isLoadingGenerateDocs}
                                    onClick={handleGenerateDocumentationClick}
                                    className="grid h-8 place-content-center rounded-lg bg-[#D7B8FF] font-medium disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {isLoadingGenerateDocs ? <SpinnerIcon /> : "Generar"}
                                </button>
                            </div>
                        </Switch.Default>
                    </Switch>
                </div>
            </main>
        </ModalHeadless>
    );
};
