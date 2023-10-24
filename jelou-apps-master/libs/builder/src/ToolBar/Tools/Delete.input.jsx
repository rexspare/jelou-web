import { useState } from "react";
import { useParams } from "react-router-dom";

import { DeleteModalHeadless } from "@builder/common/Headless/Modal/DeleteModal.headlees";
import { CloseIcon, SpinnerIcon, TrashDelete } from "../../Icons";
import { ModalHeadless } from "../../common/Headless/Modal";
import { TYPE_ERRORS, renderMessage } from "../../common/Toastify";
import { useQueryTool } from "../../pages/Home/ToolKits/hooks/useQueryTools";
import { InputsRepository } from "../../services/inputs";

/**
 * @param {{
 * isOpenUpdateInput: boolean;
 * onClose: () => void;
 * inputToDelete: import("../../pages/Home/ToolKits/types.toolkits").Input;
 * }} props
 */
export const DeleteInput = ({ inputToDelete, isOpenUpdateInput, onClose }) => {
    const [isLoading, setIsLoading] = useState(false);
    const { toolkitId, toolId } = useParams();
    const { revalidateTool } = useQueryTool();

    const handleDeleteInputClick = () => {
        setIsLoading(true);
        InputsRepository.delete(toolkitId, toolId, String(inputToDelete.id))
            .then(() => {
                revalidateTool();
                renderMessage("Input eliminado correctamente", TYPE_ERRORS.SUCCESS);
                onClose();
            })
            .catch(() => {
                renderMessage("Error al eliminar este input, por favor intente nuevamente o comuniquese con un asesor", TYPE_ERRORS.ERROR);
            })
            .finally(() => setIsLoading(false));
    };

    return (
        <DeleteModalHeadless isOpen={isOpenUpdateInput} onClose={onClose}>
            <DeleteModalHeadless.Header>Eliminar input</DeleteModalHeadless.Header>
            <DeleteModalHeadless.Main
                actionVerbs="input"
                description="Si eliminas este input, no vas a poder recuperarlo. Recuerda que si eliminas este input vas a tener que crear otro para poder obterner la misma información"
            />
            <DeleteModalHeadless.Footer loading={isLoading} onPrimaryClick={handleDeleteInputClick} secondaryLabel="Cancelar" disabled={false}>
                Sí, eliminar input
            </DeleteModalHeadless.Footer>
        </DeleteModalHeadless>
    );
};
