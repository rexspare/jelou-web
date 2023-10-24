import { useState } from "react";

import { HeaderModalBtns } from "@builder/common/Headless/HeaderModalBtns";
import { ModalHeadless } from "@builder/common/Headless/Modal";
import { CloseIcon, IAToolIcon, ManualToolIcon, ToolsIcon } from "@builder/Icons";

import { CREATE_EDIT_STEP, CREATE_EDIT_STEPS, CreatedTool, DEFAULT_TOOL, TOOL_MODES } from "../../types.toolkits";
import { isStepCompleted } from "../../utils.tools";
import { MainDataForm } from "./MainData";
import { SidebarModal } from "./ModalSidebar";
import { PickColors } from "./PickColors";
import { PickThumbnail } from "./PickThumbnail";
import { ToolkitData } from "./ToolkitData";

type Props = {
    isOpen: boolean;
    onCloseModal: () => void;
    isEditMode: boolean;
    defaultTool?: CreatedTool;
    editToolId?: string;
};

export const CreateEditToolModal = ({ onCloseModal, isOpen, isEditMode, defaultTool = DEFAULT_TOOL as CreatedTool, editToolId }: Props) => {
    const [step, setStep] = useState<CREATE_EDIT_STEP>(CREATE_EDIT_STEP.TOOLKIT);
    const [toolMode, setToolMode] = useState<TOOL_MODES>("" as TOOL_MODES);
    const [createdTool, setCreatedTool] = useState<CreatedTool>(defaultTool);

    const handleChangeStep = (step: CREATE_EDIT_STEP) => setStep(step);
    const handleCloseModal = () => {
        setToolMode("" as TOOL_MODES);
        setCreatedTool(defaultTool);
        onCloseModal();
        setStep(CREATE_EDIT_STEP.TOOLKIT);
    };

    const handleAddData = (tool: Partial<CreatedTool>) => {
        setCreatedTool((prevState) => ({ ...prevState, ...tool }));
    };

    const handlePrimaryClick = (currentStep: CREATE_EDIT_STEP): void => {
        switch (currentStep) {
            case CREATE_EDIT_STEP.TOOLKIT:
                handleChangeStep(CREATE_EDIT_STEP.MAIN_DATA);
                break;
            case CREATE_EDIT_STEP.MAIN_DATA:
                handleChangeStep(CREATE_EDIT_STEP.THUMBNAIL);
                break;
            case CREATE_EDIT_STEP.THUMBNAIL:
                handleChangeStep(CREATE_EDIT_STEP.COLORS);
                break;
            default:
                return;
        }
    };

    const handleSecondaryClick = (currentStep: CREATE_EDIT_STEP): void => {
        switch (currentStep) {
            case CREATE_EDIT_STEP.MAIN_DATA:
                handleChangeStep(CREATE_EDIT_STEP.TOOLKIT);
                break;
            case CREATE_EDIT_STEP.THUMBNAIL:
                handleChangeStep(CREATE_EDIT_STEP.MAIN_DATA);
                break;
            case CREATE_EDIT_STEP.COLORS:
                handleChangeStep(CREATE_EDIT_STEP.THUMBNAIL);
                break;
            default:
                return;
        }
    };

    const STEP = {
        [CREATE_EDIT_STEP.TOOLKIT]: <ToolkitData createdTool={createdTool} handleAddData={handleAddData} handlePrimaryClick={handlePrimaryClick} onClose={handleCloseModal} />,
        [CREATE_EDIT_STEP.MAIN_DATA]: (
            <MainDataForm
                createdTool={createdTool}
                handleAddData={handleAddData}
                handleCloseModal={handleCloseModal}
                handlePrimaryClick={handlePrimaryClick}
                handleSecondaryClick={handleSecondaryClick}
                toolMode={toolMode}
                isEditMode={isEditMode}
                editToolId={editToolId}
            />
        ),
        [CREATE_EDIT_STEP.THUMBNAIL]: (
            <PickThumbnail
                createdTool={createdTool}
                handleAddData={handleAddData}
                handleCloseModal={handleCloseModal}
                handlePrimaryClick={handlePrimaryClick}
                handleSecondaryClick={handleSecondaryClick}
                isEditMode={isEditMode}
                editToolId={editToolId}
            />
        ),
        [CREATE_EDIT_STEP.COLORS]: (
            <PickColors
                createdTool={createdTool}
                handleAddData={handleAddData}
                handleCloseModal={handleCloseModal}
                handlePrimaryClick={handlePrimaryClick}
                handleSecondaryClick={handleSecondaryClick}
                isEditMode={isEditMode}
                toolMode={toolMode}
                editToolId={editToolId}
            />
        ),
    };

    const isManualTool = toolMode === TOOL_MODES.MANUAL;

    return (
        <ModalHeadless showBtns={false} isDisable={false} showClose={false} isOpen={isOpen} className="h-[36rem] w-[46rem]">
            {toolMode || isEditMode ? (
                <div className="flex h-full w-full">
                    <SidebarModal isEdit={isEditMode}>
                        <SidebarModal.Title title={isEditMode ? "Editar herramienta" : isManualTool ? "Crear una herramienta manualmente" : "Crear una herramienta con IA"} />
                        <SidebarModal.List>
                            {CREATE_EDIT_STEPS.map(({ id, number, title, hasLine }) => {
                                const isComplete = isStepCompleted(id, step, CREATE_EDIT_STEPS);

                                return <SidebarModal.ItemList hasLine={hasLine} isActive={step === id} id={id} name={title} onClick={handleChangeStep} number={number} isComplete={isComplete} />;
                            })}
                        </SidebarModal.List>
                    </SidebarModal>
                    <div className="flex h-full w-full flex-col">
                        <button onClick={handleCloseModal} className="absolute right-3 top-3 scale-125 text-gray-400/60">
                            <CloseIcon color="#00B3C7" />
                        </button>
                        {STEP[step]}
                    </div>
                </div>
            ) : (
                <>
                    <HeaderModalBtns Icon={ToolsIcon} onClose={handleCloseModal} title="Crear una herramienta" colors="bg-[#F2FBFC] text-primary-200" />
                    <div className="flex h-[32.5rem] items-center justify-center gap-8">
                        <button
                            onClick={() => setToolMode(TOOL_MODES.MANUAL)}
                            className="flex h-78 w-72 flex-col gap-4 rounded-xl border-1 p-8 text-center transition-all duration-500 ease-out hover:scale-105 hover:border-primary-200 hover:bg-[#F2FBFC]"
                        >
                            <div className="flex self-center">
                                <ManualToolIcon width={200} height={170} />
                            </div>
                            <p className="text-gray-400">Crea y configura Tools desde cero de acuerdo a tus necesidades en nuestro creador de herramientas</p>
                            <div className="gradient grid h-9 w-[12rem] place-content-center self-center rounded-xl px-4 font-bold text-white">Crear manualmente</div>
                        </button>
                        <button
                            onClick={() => setToolMode(TOOL_MODES.IA)}
                            className="flex h-78 w-72 flex-col gap-4 rounded-xl border-1 p-8 text-center transition-all duration-500 ease-out hover:scale-105 hover:border-primary-200 hover:bg-[#F2FBFC]"
                        >
                            <div className="flex self-center">
                                <IAToolIcon width={200} height={170} />
                            </div>
                            <p className="text-gray-400">Crea y configura Tools con ayuda de nuestra inteligencia artificial en nuestro creador de herramientas</p>
                            <div className="gradient grid h-9 w-[10rem] place-content-center self-center rounded-xl px-4 font-bold text-white">Crear con IA </div>
                        </button>
                    </div>
                </>
            )}
        </ModalHeadless>
    );
};
