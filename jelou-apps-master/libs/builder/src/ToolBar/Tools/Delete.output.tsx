import type { End } from "@builder/modules/Nodes/domain/nodes";

import type { Node } from "reactflow";

import { useState } from "react";
import { useParams } from "react-router-dom";
import { useReactFlow } from "reactflow";

import { useWorkflowStore } from "@builder/Stores";
import { DeleteModalHeadless } from "@builder/common/Headless/Modal/DeleteModal.headlees";
import { TYPE_ERRORS, renderMessage } from "@builder/common/Toastify";
import { NodeRepository } from "@builder/modules/Nodes/Infrastructure/nodes.repository";
import { DeleteNode } from "@builder/modules/Nodes/application/deleteNode";
import { NODE_TYPES } from "@builder/modules/Nodes/domain/constants";
import { OutputsRepository } from "@builder/modules/OutputTools/Infrastructure/outputs";
import { Output } from "@builder/modules/OutputTools/domain/outputs.domain";
import { useQueryTool } from "@builder/pages/Home/ToolKits/hooks/useQueryTools";

type DeleteOutputProps = {
    isOpenDeleteOutput: boolean;
    onClose: () => void;
    outputToDelete: Output;
};

export const DeleteOutput = (props: DeleteOutputProps) => {
    const { outputToDelete, isOpenDeleteOutput, onClose } = props;

    const [isLoading, setIsLoading] = useState(false);
    const { toolkitId, toolId } = useParams();
    const { revalidateTool } = useQueryTool();
    const { id: workflowId } = useWorkflowStore((state) => state.currentWorkflow);

    const { getNodes, deleteElements } = useReactFlow();

    const handleDeleteOutputClick = () => {
        setIsLoading(true);
        const deleteNode = new DeleteNode(new NodeRepository(String(workflowId)));

        // TODO: extract this logic to a domain
        const endNodes: Node<End>[] = getNodes().filter((node) => node.type === NODE_TYPES.END);

        const endNodesToDelete = endNodes.filter((node) => node.data.configuration.outputId === outputToDelete.id);

        const deleteList = endNodesToDelete.map((node) => deleteNode.delete(node.id));

        const outputRepository = new OutputsRepository(String(toolkitId), String(toolId));
        deleteList.push(outputRepository.delete(String(outputToDelete.id)));

        Promise.allSettled(deleteList)
            .then((results) => {
                const rejected = results.filter((result) => result.status === "rejected");
                if (rejected.length > 0) {
                    renderMessage("Tuvimos un error al eliminar este output, por favor intente nuevamente resfrescando la página o comuníquese con un asesor", TYPE_ERRORS.ERROR);
                    return;
                }
                deleteElements({ nodes: endNodesToDelete });
                revalidateTool();
                renderMessage("Output eliminado correctamente", TYPE_ERRORS.SUCCESS);
                onClose();
            })
            .catch((error) => {
                renderMessage(error.message, TYPE_ERRORS.ERROR);
            })
            .finally(() => setIsLoading(false));
    };

    return (
        <DeleteModalHeadless isOpen={isOpenDeleteOutput} onClose={onClose}>
            <DeleteModalHeadless.Header>Eliminar output</DeleteModalHeadless.Header>
            <DeleteModalHeadless.Main
                actionVerbs="output"
                description="Si eliminas este output, no vas a poder recuperarlo. Recuerda que si eliminas este output vas a tener que crear otro para poder obterner la misma información"
            />
            <DeleteModalHeadless.Footer loading={isLoading} onPrimaryClick={handleDeleteOutputClick} secondaryLabel="Cancelar" disabled={false}>
                Sí, eliminar output
            </DeleteModalHeadless.Footer>
        </DeleteModalHeadless>
    );
};
