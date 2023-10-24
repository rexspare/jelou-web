import { useState } from "react";

import { CheckIcon, CloseIcon } from "@builder/Icons";
import { InputIcon } from "@builder/Icons/Input.Icon";
import { ModalHeadless } from "@builder/common/Headless/Modal";
import { Input, MainDataInput } from "@builder/pages/Home/ToolKits/types.toolkits";
import { getDIVStyle, getLINEStyle, getLIStyle, isStepCompleted } from "@builder/pages/Home/ToolKits/utils.tools";

import { CREATE_INPUT_STEP, CREATE_INPUT_STEPS, INPUT_MAIN_DATA } from "../constants.toolbar";
import InputTypeForm from "./InputTypeForm";
import MainDataForm from "./MainDataForm";

type ModalCreateInputProps = {
    input?: Input;
    isOpen: boolean;
    onClose: () => void;
    handleCreateInputClick: (input: Input | MainDataInput, afterCreateUpdate: any) => void;
    inputsErrors: Record<string, string>;
    isLoading: boolean;
};

export const ModalCreateUpdateInput = ({ input, isOpen, onClose, handleCreateInputClick, inputsErrors, isLoading }: ModalCreateInputProps): JSX.Element => {
    const [createStep, setCreateStep] = useState<CREATE_INPUT_STEP>(CREATE_INPUT_STEP.MAIN_DATA);
    const [createMainDataInput, setMainDataInput] = useState<MainDataInput>(() => input ?? INPUT_MAIN_DATA);

    const isUpdate = Boolean(input);

    const afterCreateUpdate = (): void => {
        setMainDataInput(INPUT_MAIN_DATA);
        setCreateStep(CREATE_INPUT_STEP.MAIN_DATA);
    };

    const handlePrimaryClick = (step: string): void => {
        switch (step) {
            case CREATE_INPUT_STEP.MAIN_DATA:
                setCreateStep(CREATE_INPUT_STEP.INPUT_TYPE);
                break;
            default:
                handleCreateInputClick(createMainDataInput, afterCreateUpdate);
                return;
        }
    };

    const handleSecondaryClick = (step: string): void => {
        switch (step) {
            case CREATE_INPUT_STEP.INPUT_TYPE:
                setCreateStep(CREATE_INPUT_STEP.MAIN_DATA);
                break;
            default:
                onClose();
                afterCreateUpdate();
                return;
        }
    };

    const STEP = {
        [CREATE_INPUT_STEP.MAIN_DATA]: (
            <MainDataForm
                handlePrimaryClick={handlePrimaryClick}
                inputsErrors={inputsErrors}
                input={createMainDataInput}
                handleSecondaryClick={handleSecondaryClick}
                setInputConfig={setMainDataInput}
            />
        ),
        [CREATE_INPUT_STEP.INPUT_TYPE]: (
            <InputTypeForm
                handlePrimaryClick={handlePrimaryClick}
                handleSecondaryClick={handleSecondaryClick}
                input={createMainDataInput}
                inputsErrors={inputsErrors}
                setInputConfig={setMainDataInput}
                isUpdate={isUpdate}
                isLoading={isLoading}
            />
        ),
    };

    return (
        <ModalHeadless showBtns={false} isDisable={false} showClose={false} isOpen={isOpen} className="h-[42rem] w-[48rem] overflow-y-auto">
            {
                <div className="flex h-full w-full">
                    <div className={`flex h-full w-64 flex-col gap-4 rounded-l-1 bg-[#F3FBFC] p-10`}>
                        <h1 className={`flex w-40 justify-between pb-4 text-xl font-semibold text-primary-200`}>
                            <InputIcon width={26} height={26} />
                            Nuevo input
                        </h1>
                        <ul className={`flex flex-col justify-center gap-12`}>
                            {CREATE_INPUT_STEPS.map((step) => {
                                const { id, number, title, hasLine } = step;

                                const isActive = createStep === id;
                                const isComplete = isStepCompleted(id, createStep, CREATE_INPUT_STEPS);

                                const styleLI = getLIStyle(isActive, isComplete);
                                const styleDIV = getDIVStyle(isActive, isComplete);
                                const styleLine = getLINEStyle(hasLine);

                                return (
                                    <li key={id} className={`flex gap-2 text-primary-200 ${styleLI} transition-all duration-300 ease-in`}>
                                        <div className={`relative grid h-6 w-6 place-content-center rounded-full text-base text-white ${styleLine} ${styleDIV} transition-all duration-300 ease-in`}>
                                            {isComplete && <CheckIcon />}
                                            {!isComplete && <span>{number}</span>}
                                        </div>
                                        <p className={`font-semibold ${styleLI} transition-all duration-300 ease-in`}>{title}</p>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                    <div className="flex h-full flex-1 flex-col">
                        <button onClick={() => handleSecondaryClick("close")} className="absolute right-3 top-3 scale-125 text-gray-400/60">
                            <CloseIcon color="#00B3C7" />
                        </button>
                        {STEP[createStep]}
                    </div>
                </div>
            }
        </ModalHeadless>
    );
};
