import { nanoid } from "nanoid";
import { XYPosition, useReactFlow } from "reactflow";

import { generatesNodes } from "@builder/Nodes/utils/utils.nodes";
import { useWorkflowStore } from "@builder/Stores";
import { TYPE_ERRORS, renderMessage } from "@builder/common/Toastify";
import { EdgeCreator } from "@builder/modules/Edges/application/create.edge";
import { EDGES_TYPES } from "@builder/modules/Edges/domain/constanst";
import { EdgeRepository } from "@builder/modules/Edges/infrastructure/edgeRepository";
import { ServerEdgeAdapter } from "@builder/modules/Edges/infrastructure/serverEdge.adapter";

import { ServerNodeAdapter } from "../Infrastructure/ServerNode.Adapter";
import { NodeRepository } from "../Infrastructure/nodes.repository";
import { NODE_TYPES } from "../domain/constants";
import { CreatorNode } from "./createNode";

type Props = {
    position: XYPosition;
    source: string;
    sourceHandle: string;
};
export function useIfErrorNodeAndEdgeCreator() {
    const { addNodes, addEdges } = useReactFlow();
    const { id: workflowId } = useWorkflowStore((state) => state.currentWorkflow);

    const nodeCreator = new CreatorNode(new NodeRepository(String(workflowId)), new ServerNodeAdapter());
    const edgeCreator = new EdgeCreator(new EdgeRepository(String(workflowId)), new ServerEdgeAdapter());

    return ({ position, source, sourceHandle }: Props) => {
        const { createNode, nodeRF } = generatesNodes({
            nodeType: NODE_TYPES.IF_ERROR,
            position,
            initialData: undefined,
        });

        const newEdge = {
            id: nanoid(),
            source,
            sourceHandle,
            target: createNode.id,
            type: EDGES_TYPES.ERROR,
        };

        addNodes(nodeRF);
        addEdges(newEdge);
        nodeCreator
            .create(createNode)
            .then(() => {
                edgeCreator.create(newEdge).catch((error) => {
                    renderMessage(error.message, TYPE_ERRORS.ERROR);
                });
            })
            .catch((error) => {
                renderMessage(error.message, TYPE_ERRORS.ERROR);
            });
    };
}
