import { useState } from "react";
import { useReactFlow } from "reactflow";
import { z } from "zod";

import { useConfigNodeId, useWorkflowStore } from "@builder/Stores";
import { deleteNodeModalStore } from "@builder/Stores/deleteNodeModal";
import { TYPE_ERRORS, renderMessage } from "@builder/common/Toastify";
import { NodeRepository } from "@builder/modules/Nodes/Infrastructure/nodes.repository";
import { DeleteNode } from "@builder/modules/Nodes/application/deleteNode";
import { DeleteModalHeadless } from "./DeleteModal.headlees";

export const DeleteNodeModal = () => {
    const [loading, setLoading] = useState(false);
    const { deleteElements } = useReactFlow();

    const { clearNodeIdSelected, nodeIdSelected } = useConfigNodeId();
    const { id: workflowId } = useWorkflowStore((state) => state.currentWorkflow);

    const { nodeIdToDelete, setNodeIdToDelete } = deleteNodeModalStore((state) => ({ nodeIdToDelete: state.nodeIdToDelete, setNodeIdToDelete: state.setNodeIdToDelete }));

    const closeModal = () => setNodeIdToDelete(null);

    const handleDeleteNode = () => {
        if (!nodeIdToDelete || !validateNodeId(nodeIdToDelete)) {
            console.error("error al eliminar el nodo, no se encontro el node id  para eliminar", { nodeIdToDelete });

            return;
        }

        const deleteNode = new DeleteNode(new NodeRepository(String(workflowId)));
        setLoading(true);

        deleteNode
            .delete(nodeIdToDelete)
            .then(() => {
                deleteElements({ nodes: [{ id: nodeIdToDelete }] });
                if (nodeIdToDelete === nodeIdSelected) clearNodeIdSelected();
                closeModal();
            })
            .catch((error) => renderMessage(error?.message, TYPE_ERRORS.ERROR))
            .finally(() => setLoading(false));
    };

    return (
        <DeleteModalHeadless isOpen={Boolean(nodeIdToDelete)} onClose={closeModal}>
            <DeleteModalHeadless.Header>Eliminar paso</DeleteModalHeadless.Header>
            <DeleteModalHeadless.Main actionVerbs="paso" description="Si eliminas este paso no podras recuperarlo. Esta acción dejará sin ejecución sus próximos pasos" />
            <DeleteModalHeadless.Footer loading={loading} onPrimaryClick={handleDeleteNode} secondaryLabel="Cancelar" disabled={false}>
                Sí, eliminar
            </DeleteModalHeadless.Footer>
        </DeleteModalHeadless>
    );
};

function validateNodeId(nodeId: string) {
    const nodeIdSchema = z.string({
        invalid_type_error: "El id del nodo debe ser un string",
        required_error: "El id del nodo es requerido",
    });
    try {
        nodeIdSchema.parse(nodeId);
    } catch (error) {
        let message = "Error al validar el id del nodo";
        if (error instanceof z.ZodError) {
            message = error.message;
        }
        renderMessage(message, TYPE_ERRORS.ERROR);
        return false;
    }

    return true;
}
