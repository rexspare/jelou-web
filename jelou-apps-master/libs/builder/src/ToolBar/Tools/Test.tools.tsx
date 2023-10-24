import { useCallback, useState } from "react";

import { CloseIcon, TestToolSimpleIcon } from "@builder/Icons";
import { ModalHeadless } from "@builder/common/Headless/Modal";
import { useQueryTool } from "@builder/pages/Home/ToolKits/hooks/useQueryTools";
import { THUMBNAILS } from "@builder/pages/Home/ToolKits/modals/CreateEditTool/PickThumbnail/constants.thumbnail";

import { Switch } from "@builder/common/Headless/conditionalRendering";
import { ConfigurationTool, OutputExecution } from "@builder/pages/Home/ToolKits/types.toolkits";
import { INPUTS_NAME, defaultConfiguration } from "../constants.toolbar";
import { CodeExecutionTools } from "./CodeTest.tool";
import { FormExecutionTools } from "./FromTest.tools";
import { InitialOutput } from "./InitialOutput";
import { ResponseOutput } from "./ResponseOutput";
import { KEY_NAME, TestInputRepository } from "./TestInputRepository";

type TestToolProps = {
    isOpenTestTool: boolean;
    onClose: () => void;
};

const [activeStylesBtnView, desactiveStylesBtnView] = ["bg-primary-200/15 text-primary-200", "bg-[#CDD7E7]/15 text-gray-400"];

export const TestTool = ({ isOpenTestTool, onClose }: TestToolProps) => {
    const { tool } = useQueryTool();

    const { name, Inputs = [], configuration } = tool ?? {};

    const [outputExecuted, setOutputExecuted] = useState<OutputExecution | null>(null);
    const [inputView, setInputView] = useState(INPUTS_NAME.FORM);
    const [inputFormDataTest, setInputFormDataTest] = useState<Record<any, any>>({});

    const customOnClose = () => {
        // handleClearToolTest();
        onClose();
    };

    const handleClearToolTest = useCallback(() => {
        TestInputRepository.delete(KEY_NAME.INPUT);
        setOutputExecuted(null);
    }, []);

    const handleChangeInputView = (evt: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        const { name } = evt.currentTarget;
        setInputView(name as INPUTS_NAME);
    };

    return (
        <ModalHeadless showBtns={false} showClose={false} isDisable={false} closeModal={customOnClose} handleClick={() => null} isOpen={isOpenTestTool} className="w-[70rem]">
            <main className="rounder grid h-full w-full grid-rows-[max-content] overflow-hidden rounded-12">
                <header className="flex h-14 items-center justify-between bg-[#F2FBFC] px-6 text-primary-200">
                    <div className="flex items-center gap-3">
                        <TestToolSimpleIcon />
                        <h2 className="text-xl font-medium">Probar Tool</h2>
                    </div>
                    <button onClick={customOnClose} className="">
                        <CloseIcon color="#00B3C7" />
                    </button>
                </header>
                <div className="flex h-[40rem]">
                    <div className="grid h-full p-6">
                        <div className="flex items-center justify-between">
                            <h1 className="text-lg font-semibold text-primary-200">Input</h1>

                            <div className="space-x-3 text-sm font-medium">
                                <button
                                    onClick={handleChangeInputView}
                                    name={INPUTS_NAME.FORM}
                                    className={`rounded-lg px-3 py-1 ${inputView === INPUTS_NAME.FORM ? activeStylesBtnView : desactiveStylesBtnView}`}
                                >
                                    Formulario
                                </button>
                                <button
                                    onClick={handleChangeInputView}
                                    name={INPUTS_NAME.CODE}
                                    className={`rounded-lg px-3 py-1 ${inputView === INPUTS_NAME.CODE ? activeStylesBtnView : desactiveStylesBtnView}`}
                                >
                                    Código
                                </button>
                            </div>
                        </div>
                        <div className="z-10 flex h-full items-center justify-center">
                            <div className="flex h-[32rem] w-[24rem] flex-col">
                                <HeaderFormInput configuration={configuration} name={name} />
                                <Switch>
                                    <Switch.Case condition={inputView === INPUTS_NAME.FORM}>
                                        <FormExecutionTools
                                            handleClearToolTest={handleClearToolTest}
                                            inputs={Inputs}
                                            setOutputExecuted={setOutputExecuted}
                                            inputFormDataTest={inputFormDataTest}
                                            setInputFormDataTest={setInputFormDataTest}
                                        />
                                    </Switch.Case>
                                    <Switch.Default>
                                        <CodeExecutionTools setOutputExecuted={setOutputExecuted} handleClearToolTest={handleClearToolTest} />
                                    </Switch.Default>
                                </Switch>
                            </div>
                        </div>
                    </div>
                    <div className="h-full w-full">{outputExecuted === null ? <InitialOutput /> : <ResponseOutput outputExecuted={outputExecuted} />}</div>
                </div>
                {/* <ModalFooterBtns
          disabled
          onCancel={customOnClose}
          onSubmit={() => null}
          secondaryLabel="Salir"
          colors="bg-primary-200"
          className="rounded-b-1 bg-[#F2FBFC] p-4"
          primaryLabel="Publicar herramienta"
          classNameSecondary="text-gray-400 bg-[#EFF1F4]"
        /> */}
            </main>
        </ModalHeadless>
    );
};

type HeaderFormInputProps = {
    configuration?: ConfigurationTool;
    name?: string;
};

function HeaderFormInput({ configuration, name }: HeaderFormInputProps) {
    const { complementaryColor, principalColor, thumbnail: thumbnailId } = Object.assign({}, defaultConfiguration, configuration);

    return (
        <div className="flex w-full items-center justify-start gap-2 rounded-t-lg border-x-1 border-t-1 p-2 pl-6 shadow" style={{ backgroundColor: principalColor, color: complementaryColor }}>
            {typeof thumbnailId === "string" ? (
                <img src={thumbnailId} alt="thumbnail" className="h-6 w-6 object-cover" />
            ) : (
                THUMBNAILS.map((thumbnail) => {
                    const { id, Icon } = thumbnail;

                    if (id !== thumbnailId) {
                        return null;
                    }
                    return <Icon key={id} height={20} width={20} color={complementaryColor} />;
                })
            )}
            <p className="font-semibold">{name}</p>
        </div>
    );
}
