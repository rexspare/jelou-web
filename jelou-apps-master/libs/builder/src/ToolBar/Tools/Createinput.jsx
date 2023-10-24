import { useState } from "react";
import { useParams } from "react-router-dom";

import { inputsOutputsPanelsStore } from "@builder/Stores/inputsOutputsPanels";
import { TYPE_ERRORS, renderMessage } from "@builder/common/Toastify";
import { useQueryTool } from "@builder/pages/Home/ToolKits/hooks/useQueryTools";
import { InputsRepository } from "@builder/services/inputs";
import { validateInputsOutputsError } from "../utils.toolbar";
import { ModalCreateUpdateInput } from "./ModalCreate.input";

export const CreateInput = () => {
    const [inputsErrors, setInputsErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const { toolkitId, toolId } = useParams();
    const { revalidateTool } = useQueryTool();

    const { isCreateInputModal, setCreateInputModal } = inputsOutputsPanelsStore((state) => ({
        isCreateInputModal: state.isCreateInputModal,
        setCreateInputModal: state.setCreateInputModal,
    }));

    const closeInputModal = () => setCreateInputModal(false);

    const handleCreateInputClick = (input, afterCreateUpdate) => {
        validateInputsOutputsError(input)
            .then(() => {
                setIsLoading(true);
                InputsRepository.create(input, toolkitId, toolId)
                    .then(() => {
                        revalidateTool();
                        renderMessage("Input creado correctamente", TYPE_ERRORS.SUCCESS);
                        closeInputModal();
                        afterCreateUpdate();
                    })
                    .catch((error) => {
                        renderMessage(error.message, TYPE_ERRORS.ERROR);
                    })
                    .finally(() => {
                        setIsLoading(false);
                    });
            })
            .catch((error) => setInputsErrors(error));
    };

    return <ModalCreateUpdateInput isOpen={isCreateInputModal} onClose={closeInputModal} handleCreateInputClick={handleCreateInputClick} inputsErrors={inputsErrors} isLoading={isLoading} />;
};
