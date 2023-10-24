import { useEffect } from "react";

import { CloseIcon, FailedIcon, SuccessIcon, TestToolSimpleIcon } from "@builder/Icons";
import { PuzzleIcon } from "@builder/Icons/thumbnails";
import { InitialOutput } from "@builder/ToolBar/Tools/InitialOutput";
import { DiclosureHeadless } from "@builder/common/Headless/Disclosure";
import { ModalHeadless } from "@builder/common/Headless/Modal";
import { JsonPreview } from "@builder/common/code/JsonPreview.code";
import { InputsForm } from "@builder/common/inputs.form";
import { OUTPUT_TYPES } from "@builder/modules/OutputTools/domain/contants.output";
import { ExecuteHttpNodeResponse } from "@builder/services/nodes";
import useExecuteNode from "../../hooks/useExecuteNode";

type Props = {
    isOpen: boolean;
    onClose?: () => void;
};

export const ExecuteHttpNodeModal = ({ isOpen, onClose = () => null }: Props) => {
    const { outputExecuted, setOutputExecuted, isLoadingExecution, setIsLoadingExecution, mandatoryInputs, executeHttpNode } = useExecuteNode();
    const areThereMandatoryInputs = mandatoryInputs.length > 0;

    const handleExecuteNode = (inputs: Record<string, any>) => {
        setOutputExecuted(null);
        setIsLoadingExecution(true);

        executeHttpNode(inputs);
    };

    const handleClearExecutedNode = () => {
        setOutputExecuted(null);
    };

    useEffect(() => {
        if (!areThereMandatoryInputs) handleExecuteNode({});
    }, []);

    return (
        <ModalHeadless showBtns={false} showClose={false} isDisable={false} closeModal={onClose} handleClick={() => null} isOpen={isOpen} className="w-[70rem]">
            <main className="grid h-full w-full grid-rows-[max-content] overflow-hidden rounded-12">
                <header className="flex h-14 items-center justify-between bg-[#F2FBFC] px-6 text-primary-200">
                    <div className="flex items-center gap-3">
                        <TestToolSimpleIcon />
                        <h2 className="text-xl font-medium">Probar Nodo</h2>
                    </div>
                    <button onClick={onClose}>
                        <CloseIcon color="#00B3C7" />
                    </button>
                </header>
                <div className="flex h-[40rem]">
                    {areThereMandatoryInputs && (
                        <div className="grid h-full gap-6 p-6">
                            <div className="flex items-center justify-between">
                                <h1 className="text-line-hsm text-lg font-semibold text-gray-400">Input</h1>
                                <p className="space-x-3 rounded-lg bg-primary-200/15 px-3 py-1 text-sm font-medium text-primary-200">Formulario</p>
                            </div>
                            <div className="z-10 flex h-full items-center justify-center">
                                <div className="flex h-[32rem] w-[24rem] flex-col rounded-t-lg">
                                    <HeaderFormInput name="Probar Nodo" />
                                    <InputsForm
                                        inputs={mandatoryInputs}
                                        primaryActionLabel="Ejecutar"
                                        secondaryActionLabel="Limpiar"
                                        primaryAction={handleExecuteNode}
                                        secondaryAction={handleClearExecutedNode}
                                        isLoadingPrimaryAction={isLoadingExecution}
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                    <div className={`h-[calc(100%_-_32px)] w-full overflow-y-auto py-6 ${!areThereMandatoryInputs ? "px-6" : ""}`}>
                        {outputExecuted === null ? <InitialOutput /> : <DisplayExecutedOutput {...outputExecuted} />}
                    </div>
                </div>
            </main>
        </ModalHeadless>
    );
};

function HeaderFormInput({ name }: { name: string }) {
    return (
        <div className="flex w-full items-center justify-start gap-2 rounded-t-lg border-x-1 border-t-1 bg-primary-350 p-2 pl-6 text-primary-200 shadow">
            <PuzzleIcon width={16} height={16} color="currentColor" />
            <p className="font-semibold">{name}</p>
        </div>
    );
}

function DisplayExecutedOutput({ initialState, finalState, type, name, id }: ExecuteHttpNodeResponse) {
    const color = type === OUTPUT_TYPES.SUCCESS ? "text-green-960" : "text-[#F12B2C]";

    return (
        <>
            <h1 className="text-line-hsm pb-4 text-lg font-semibold text-gray-400">Output</h1>

            <DiclosureHeadless
                idButton={id}
                defaultOpen={false}
                classNameButton={color}
                classNamePanel="pl-4 space-y-2"
                LabelButton={() => (
                    <div className={`flex items-center gap-2 ${color}`}>
                        {type === OUTPUT_TYPES.SUCCESS ? <SuccessIcon width={20} height={20} /> : <FailedIcon width={20} height={20} />}
                        <h4>{name}</h4>
                    </div>
                )}
            >
                <div className="ml-[0.90rem] mt-1 flex flex-col gap-2 text-gray-400">
                    {initialState && (
                        <DiclosureHeadless LabelButton="Estado Inicial" idButton="initialState" defaultOpen={false}>
                            <JsonPreview src={initialState} />
                        </DiclosureHeadless>
                    )}
                    {finalState && (
                        <DiclosureHeadless LabelButton="Estado Final" idButton="finalState" defaultOpen={false}>
                            <JsonPreview src={finalState} />
                        </DiclosureHeadless>
                    )}
                </div>
            </DiclosureHeadless>
        </>
    );
}
