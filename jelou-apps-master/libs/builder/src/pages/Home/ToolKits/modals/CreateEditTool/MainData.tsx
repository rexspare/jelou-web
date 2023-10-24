import { useState } from "react";

import { TextAreaInput, TextInput } from "@builder/common/inputs";
import { useModalActions } from "../../hooks/useModalActions";
import { CREATE_EDIT_STEP, CreatedTool, TOOL_MODES } from "../../types.toolkits";
import { StepLayout } from "./StepLayout";

type MainDataFormProps = {
    isEditMode: boolean;
    editToolId?: string;
    toolMode: TOOL_MODES;
    createdTool: CreatedTool;
    handleCloseModal: () => void;
    handlePrimaryClick: (currentStep: CREATE_EDIT_STEP) => void;
    handleSecondaryClick: (currentStep: CREATE_EDIT_STEP) => void;
    handleAddData: (tool: Partial<CreatedTool>) => void;
};

export const MainDataForm = ({ isEditMode, toolMode, handlePrimaryClick, createdTool, handleAddData, handleCloseModal, editToolId, handleSecondaryClick }: MainDataFormProps) => {
    const { handleSaveEdit, isLoadingAction } = useModalActions({ createdTool, handleCloseModal });

    const isManualTool = toolMode === TOOL_MODES.MANUAL;
    const { name, description, toolkitId } = createdTool;

    const [toolName, setToolName] = useState(name ?? "");
    const [toolDescription, setToolDescription] = useState(description ?? "");

    const onPrimaryClick = isEditMode && editToolId ? () => handleSaveEdit({ editToolId, toolkitId }) : () => handlePrimaryClick(CREATE_EDIT_STEP.MAIN_DATA);

    const handleChangeName = (event: React.ChangeEvent<HTMLInputElement>): void => {
        setToolName(event.target.value);
        handleAddData({ name: event.target.value });
    };

    const handleChangeDescription = (event: React.ChangeEvent<HTMLTextAreaElement>): void => {
        setToolDescription(event.target.value);
        handleAddData({ description: event.target.value });
    };

    const isDisable = toolName === "" || toolDescription === "";
    const primaryLabel = isEditMode ? "Guardar" : "Siguiente";

    return (
        <StepLayout
            title="Datos principales"
            secondaryLabel="Atrás"
            isLoading={isLoadingAction}
            onSecondaryClick={() => handleSecondaryClick(CREATE_EDIT_STEP.MAIN_DATA)}
            subTitle="Escribe los datos de tu herramienta"
            primaryLabel={primaryLabel}
            disabled={isDisable}
            onPrimaryClick={onPrimaryClick}
        >
            <TextInput
                hasError=""
                name="name"
                defaultValue={name}
                onChange={handleChangeName}
                label="Nombre de la herramienta"
                labelClassName="block font-medium mb-2"
                placeholder="Escribe el nombre de la herramienta"
            />
            <TextAreaInput
                defaultValue={description}
                onChange={handleChangeDescription}
                labelClassName="block font-medium mb-2"
                name={isManualTool ? "description" : "prompt"}
                label={isManualTool ? "Descripción de la herramienta" : "Instrucciones"}
                className="h-52 rounded-10 border-1 border-gray-330 bg-white px-2"
                placeholder={isManualTool ? "Escribe una descripción" : "Escribe las instrucciones para la IA"}
            />
        </StepLayout>
    );
};
