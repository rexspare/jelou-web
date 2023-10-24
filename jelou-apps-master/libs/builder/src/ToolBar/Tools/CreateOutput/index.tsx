import { useState } from "react";

import { CloseIcon1 } from "@apps/shared/icons";
import { ModalHeadless } from "@builder/common/Headless/Modal";
import { CREATE_OUTPUT_STEP, OUTPUTS_STEPS } from "@builder/modules/OutputTools/domain/contants.output";
import { Output } from "@builder/modules/OutputTools/domain/outputs.domain";
import { SidebarModal } from "@builder/pages/Home/ToolKits/modals/CreateEditTool/ModalSidebar";
import { isStepCompleted } from "@builder/pages/Home/ToolKits/utils.tools";

import { MainData } from "./data";
import { Schema } from "./schema";

type Props = {
    defaultOutput?: Partial<Output>;
    isCreateOutputModal: boolean;
    onClose: () => void;
};

export const CreateUpdateOutput = ({ defaultOutput, isCreateOutputModal, onClose }: Props) => {
    const [step, setStep] = useState<CREATE_OUTPUT_STEP>(CREATE_OUTPUT_STEP.DATA);
    const [outputData, setOutputData] = useState<Partial<Output>>(defaultOutput || {});

    const nextStep = (nextStep: CREATE_OUTPUT_STEP, data: Partial<Output>) => {
        setStep(nextStep);
        setOutputData(data);
    };

    const handleStateChange = (step: CREATE_OUTPUT_STEP) => setStep(step);

    const VIEW_STEPS = {
        [CREATE_OUTPUT_STEP.DATA]: <MainData nextStep={nextStep} defaultOutput={outputData} onClose={onClose} />,
        [CREATE_OUTPUT_STEP.SCHEMA]: <Schema outputIdToUpdate={defaultOutput?.id} onClose={onClose} outputData={outputData} goBack={() => setStep(CREATE_OUTPUT_STEP.DATA)} />,
    };

    return (
        <ModalHeadless showBtns={false} isDisable={false} showClose={false} isOpen={isCreateOutputModal} className="h-[42rem] w-[54rem]">
            <div className="flex h-full w-full">
                <SidebarModal isEdit={false} className="!w-72">
                    <SidebarModal.Title title="Nuevo output" />
                    <SidebarModal.List>
                        {OUTPUTS_STEPS.map(({ id, number, title, hasLine }) => {
                            const isComplete = isStepCompleted(id, step, OUTPUTS_STEPS);

                            return <SidebarModal.ItemList key={id} hasLine={hasLine} isActive={step === id} id={id} name={title} onClick={handleStateChange} number={number} isComplete={isComplete} />;
                        })}
                    </SidebarModal.List>
                </SidebarModal>
                <div className="h-full w-full">
                    <div className="mt-4 mr-8 flex justify-end">
                        <button onClick={onClose} className="text-gray-400/60">
                            <CloseIcon1 width="12px" height="12px" fill="currentColor" />
                        </button>
                    </div>
                    {VIEW_STEPS[step]}
                </div>
            </div>
        </ModalHeadless>
    );
};
