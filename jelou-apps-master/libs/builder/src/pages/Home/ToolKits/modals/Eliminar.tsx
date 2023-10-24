import { useCallback, useState } from "react";

import { TYPE_ERRORS, renderMessage } from "@builder/common/Toastify";
import { deleteToolkit } from "@builder/services/toolkits";
import { deleteTool } from "@builder/services/tools";

import { DeleteModalHeadless } from "@builder/common/Headless/Modal/DeleteModal.headlees";
import { TYPE_MODAL, useModalsStatesContext } from "../../shared/ModalsStatesContext";
import { useQueryToolkits } from "../hooks/useQueryToolkits";
import { Toolkits } from "../types.toolkits";

export const DeleteModal = () => {
    const [isLoadingDelete, setIsLoadingDelete] = useState(false);

    const { setShowDeleteModal, showDeleteModal } = useModalsStatesContext();
    const { id: selectedId, isOpen: isOpenDeleteModal, type } = showDeleteModal;

    const { refreshToolkitsList, data = [] } = useQueryToolkits();
    const { toolId, toolkitId } = getDeleteId(type, data, selectedId);

    const isToolkitType = type === TYPE_MODAL.TOOLKIT;
    const typeLabel = isToolkitType ? "toolkit" : "tool";

    const isDisable = isToolkitType ? getIsDisable(data, selectedId) : false;

    const onClose = () => {
        setShowDeleteModal({
            id: null,
            isOpen: false,
            type: null,
        });
    };

    const handleDeleteToolkit = useCallback(async () => {
        if (!toolkitId) {
            renderMessage("Error al recuperar el toolkit. Por favor refresque la página e intente nuevamente", TYPE_ERRORS.ERROR);
            return;
        }
        setIsLoadingDelete(true);

        if (type === TYPE_MODAL.TOOLKIT) {
            try {
                await deleteToolkit(toolkitId);
                refreshToolkitsList();
                renderMessage("Toolkit eliminado con éxito", TYPE_ERRORS.SUCCESS);
            } catch (error) {
                renderMessage("Error al eliminar el toolkit. Por favor refresque la página e intente nuevamente", TYPE_ERRORS.ERROR);
            }
            setIsLoadingDelete(false);
            onClose();
            return;
        }

        if (!toolId) {
            renderMessage("Error al recuperar el tool. Por favor refresque la página e intente nuevamente", TYPE_ERRORS.ERROR);
            return;
        }

        try {
            await deleteTool(toolkitId.toString(), toolId.toString());
            refreshToolkitsList();
            renderMessage("Tool eliminado con éxito", TYPE_ERRORS.SUCCESS);
        } catch (error) {
            renderMessage("Error al eliminar el tool. Por favor refresque la página e intente nuevamente", TYPE_ERRORS.ERROR);
        }
        setIsLoadingDelete(false);
        onClose();
    }, [toolkitId, type, toolId, refreshToolkitsList, renderMessage, setIsLoadingDelete, onClose]);

    return (
        <DeleteModalHeadless isOpen={isOpenDeleteModal} onClose={onClose}>
            <DeleteModalHeadless.Header>{`Eliminar ${typeLabel}`}</DeleteModalHeadless.Header>
            <DeleteModalHeadless.Main actionVerbs={typeLabel} description="No puedes eliminar un toolkit que contenga tools" />
            <DeleteModalHeadless.Footer loading={isLoadingDelete} onPrimaryClick={handleDeleteToolkit} secondaryLabel="Cancelar" disabled={isDisable}>
                {`Sí, eliminar este ${typeLabel}`}
            </DeleteModalHeadless.Footer>
        </DeleteModalHeadless>
    );
};

function getIsDisable(toolkits: Toolkits, selectedId: number | null) {
    const currentToolkit = toolkits.find((toolkit) => toolkit.id === selectedId);
    const { Tools } = currentToolkit ?? { Tools: [] };
    return Tools.length >= 1;
}

function getDeleteId(type: TYPE_MODAL | null, toolkits: Toolkits, selectedId: number | null) {
    if (type === TYPE_MODAL.TOOLKIT) return { toolkitId: selectedId, toolId: null };

    const tools = toolkits.flatMap((toolkit) => toolkit.Tools);
    const { id, toolkitId } = tools.find((tool) => tool.id === selectedId) ?? { toolkitId: null, id: null };

    return { toolkitId: toolkitId, toolId: id };
}
