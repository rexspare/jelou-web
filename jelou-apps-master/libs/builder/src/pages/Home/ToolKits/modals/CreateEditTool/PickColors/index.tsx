import { useModalActions } from "../../../hooks/useModalActions";
import { CREATE_EDIT_STEP, CreatedTool, TOOL_MODES } from "../../../types.toolkits";
import { THUMBNAILS } from "../PickThumbnail/constants.thumbnail";
import { StepLayout } from "../StepLayout";
import { InputColor } from "./InputColor";
import { useColors } from "./useColors";

type Props = {
    createdTool: CreatedTool;
    isEditMode: boolean;
    editToolId?: string;
    toolMode: TOOL_MODES;
    handleAddData: (tool: Partial<CreatedTool>) => void;
    handleCloseModal: () => void;
    handlePrimaryClick: (currentStep: CREATE_EDIT_STEP) => void;
    handleSecondaryClick: (currentStep: CREATE_EDIT_STEP) => void;
};

export const PickColors = ({ createdTool, handleCloseModal, handleAddData, isEditMode, editToolId, toolMode, handleSecondaryClick }: Props) => {
    const { handleSaveEdit, isLoadingAction, handleCreateIATool, handleCreateManualTool } = useModalActions({ createdTool, handleCloseModal });

    const { display, colors, handlers, errors } = useColors({ createdTool, handleAddData });
    const { principalColor, complementaryColor } = colors;
    const { principalColorError, complementaryColorError } = errors;
    const { displayPrincipalPicker, displayComplementaryPicker } = display;
    const { handlePrincipalClick, handlePrincipalClose, handleComplementaryClose, handleComplementaryClick, handleChangePrincipalColor, handleChangeComplementaryColor } = handlers;

    const { toolkitId } = createdTool;

    const getOnPrimaryClick = () => {
        if (isEditMode && editToolId) {
            return () => handleSaveEdit({ editToolId, toolkitId: createdTool.toolkitId });
        }

        if (toolMode === TOOL_MODES.IA) {
            return () => handleCreateIATool(toolkitId);
        }

        return () => handleCreateManualTool(toolkitId);
    };

    const onPrimaryClick = getOnPrimaryClick();

    return (
        <StepLayout
            title="Escoge los colores"
            isLoading={isLoadingAction}
            primaryLabel={isEditMode ? "Guardar" : "Crear"}
            subTitle="Escoge los colores para tu herramienta"
            secondaryLabel={isEditMode ? "Cancelar" : "Atrás"}
            disabled={principalColorError || complementaryColorError || isLoadingAction}
            onPrimaryClick={onPrimaryClick}
            onSecondaryClick={isEditMode ? handleCloseModal : () => handleSecondaryClick(CREATE_EDIT_STEP.COLORS)}
        >
            <div className="flex flex-col gap-4">
                <InputColor
                    title="Principal"
                    color={principalColor}
                    hasError={principalColorError}
                    onClick={handlePrincipalClick}
                    onClose={handlePrincipalClose}
                    showPicker={displayPrincipalPicker}
                    onChange={handleChangePrincipalColor}
                />
                <InputColor
                    title="Complementario"
                    color={complementaryColor}
                    hasError={complementaryColorError}
                    onClick={handleComplementaryClick}
                    onClose={handleComplementaryClose}
                    showPicker={displayComplementaryPicker}
                    onChange={handleChangeComplementaryColor}
                />
            </div>
            <div className="relative mt-6 h-[14rem] w-[23rem] rounded-10 bg-gray-230">
                <div className="absolute inset-0 z-10 flex items-center justify-center">
                    <div className="flex h-[12rem] w-[14rem] flex-col">
                        <div
                            className="flex w-full items-center justify-start gap-2 rounded-t-lg border-x-1 border-t-1 p-2 shadow"
                            style={{ backgroundColor: principalColor, color: complementaryColor }}
                        >
                            {typeof createdTool?.thumbnail === "string" ? (
                                <img src={createdTool?.thumbnail} alt="thumbnail" className="h-6 w-6 object-cover" />
                            ) : (
                                THUMBNAILS.map((thumbnail) => {
                                    const { id, Icon } = thumbnail;

                                    if (id !== createdTool?.thumbnail) return null;
                                    return <Icon key={id} height={20} width={20} color={complementaryColor} />;
                                })
                            )}
                            <p className="font-semibold">{createdTool?.name}</p>
                        </div>
                        <div className="h-full w-full rounded-b-lg border-x-1 border-b-1 bg-white shadow" />
                    </div>
                </div>
            </div>
        </StepLayout>
    );
};
