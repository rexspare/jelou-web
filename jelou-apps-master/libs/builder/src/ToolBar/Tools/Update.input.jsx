import { useState } from "react";
import { useParams } from "react-router-dom";

import { TYPE_ERRORS, renderMessage } from "../../common/Toastify";
import { useQueryTool } from "../../pages/Home/ToolKits/hooks/useQueryTools";
import { InputsRepository } from "../../services/inputs";
import { validateInputsOutputsError } from "../utils.toolbar";
import { ModalCreateUpdateInput } from "./ModalCreate.input";

/**
 * @param {{
 * inputToUpdate: Input;
 * isOpenUpdateInput: boolean;
 * onClose: () => void;
 * }} props
 */
export const UpdateInput = ({ isOpenUpdateInput, onClose, inputToUpdate }) => {
    const [inputsErrors, setInputsErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const { toolkitId, toolId } = useParams();

    const { revalidateTool } = useQueryTool();

    const handleCreateInputClick = (updatedInput, afterCreateUpdate) => {
        validateInputsOutputsError(updatedInput)
            .then(() => {
                setIsLoading(true);
                InputsRepository.update(updatedInput, toolkitId, toolId, String(inputToUpdate.id))
                    .then(() => {
                        revalidateTool();
                        onClose();
                        renderMessage("Input actualizado correctamente", TYPE_ERRORS.SUCCESS);
                        afterCreateUpdate();
                    })
                    .catch(() => {
                        renderMessage("Error al actualizar este input, por favor intente nuevamente o comuníquese con un asesor", TYPE_ERRORS.ERROR);
                    })
                    .finally(() => setIsLoading(false));
            })
            .catch((error) => setInputsErrors(error));
    };

    return (
        <ModalCreateUpdateInput input={inputToUpdate} isOpen={isOpenUpdateInput} onClose={onClose} handleCreateInputClick={handleCreateInputClick} inputsErrors={inputsErrors} isLoading={isLoading} />
    );
};
