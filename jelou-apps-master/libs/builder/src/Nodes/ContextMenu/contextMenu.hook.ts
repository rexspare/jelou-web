import type { Edge, Node } from "reactflow";
import type { ContextMenuProps as ContextMenuPropsType } from "./types.context-menu";

import { nanoid } from "nanoid";
import { useCallback } from "react";
import { useParams } from "react-router-dom";
import { getConnectedEdges, useReactFlow } from "reactflow";

import { useWorkflowStore } from "@builder/Stores";
import { TYPE_ERRORS, renderMessage } from "@builder/common/Toastify";
import { useDisconnectEdge } from "@builder/hook/customConnection.hook";
import { generatesNodes } from "../utils/utils.nodes";

import { EdgeCreator } from "@builder/modules/Edges/application/create.edge";
import { EDGES_TYPES } from "@builder/modules/Edges/domain/constanst";
import { EdgeRepository } from "@builder/modules/Edges/infrastructure/edgeRepository";
import { ServerEdgeAdapter } from "@builder/modules/Edges/infrastructure/serverEdge.adapter";

import { useCustomsNodes } from "@builder/hook/customNodes.hook";
import { ServerNodeAdapter } from "@builder/modules/Nodes/Infrastructure/ServerNode.Adapter";
import { NodeRepository } from "@builder/modules/Nodes/Infrastructure/nodes.repository";
import { CreatorNode } from "@builder/modules/Nodes/application/createNode";
import { NODE_TYPES } from "@builder/modules/Nodes/domain/constants";
import { CreateServerNode } from "@builder/modules/Nodes/domain/nodes";
import { OptionsPayloadMessageNode } from "@builder/modules/Nodes/message/domain/actions.messages";
import { BLOCK_TYPES } from "@builder/modules/Nodes/message/domain/constants.message";
import { MessageNode } from "@builder/modules/Nodes/message/domain/message.domain";
import { isActionMessageNode } from "@builder/modules/Nodes/message/infrastructure/utils.message";
import { useValidatorSingleConnection } from "../hooks/validationConnections";

type ContextMenuProps = {
    nodeId: string;
    xPos: number;
    yPos: number;
    data: ContextMenuPropsType["data"];
};

type ClearOptionInMessageNodeAction = {
    nodeSource: Node;
    currentEdge: Edge;
    nodeRF: Node;
};

export function useCustomHook({ data, nodeId, xPos, yPos }: ContextMenuProps) {
    const { getEdges, deleteElements, addNodes, addEdges, getNode } = useReactFlow();
    const { id: workflowId } = useWorkflowStore((state) => state.currentWorkflow);

    const { serviceId: skillId } = useParams();
    const { updateServerNode, updateLocalNode } = useCustomsNodes();
    const validConnection = useValidatorSingleConnection();
    const { handleEdgeClick } = useDisconnectEdge();

    const creatorNode = new CreatorNode(new NodeRepository(String(workflowId)), new ServerNodeAdapter());
    const edgeCreator = new EdgeCreator(new EdgeRepository(String(workflowId)), new ServerEdgeAdapter());

    const createNodeAndEdge = useCallback(
        async (createNode: CreateServerNode, updatedEdge: Edge) => {
            creatorNode
                .create(createNode)
                .then(() => {
                    edgeCreator.create(updatedEdge).catch((error) => {
                        console.error("edge", { error });
                        renderMessage(error.message, TYPE_ERRORS.ERROR);
                    });
                })
                .catch((err) => {
                    console.error("node", { err });
                    renderMessage(err.message, TYPE_ERRORS.ERROR);
                });
        },
        [creatorNode, edgeCreator, renderMessage]
    );

    const deleteContextMenuNode = useCallback(() => {
        deleteElements({ nodes: [{ id: nodeId }] });
    }, [deleteElements, nodeId]);

    const addPayloadInMessageNodeAction = useCallback(
        ({ nodeSource, currentEdge, nodeRF }: ClearOptionInMessageNodeAction) => {
            const messageAction = isActionMessageNode(nodeSource);
            if (messageAction) {
                const optionId = currentEdge.sourceHandle;
                if (!optionId || !skillId) return renderMessage("No pudimos completar esta accion, por favor intente nuevamente recargando la página", TYPE_ERRORS.ERROR);

                const messageNode = getNode(nodeSource.id) as Node<MessageNode>;
                const optionsPayloadMessageNode = new OptionsPayloadMessageNode(messageNode, messageAction.id, optionId);
                const { configuration, optionMessageNode } = optionsPayloadMessageNode.update({ skillId, targetId: nodeRF.id });

                updateLocalNode(optionMessageNode.id, { configuration }).then(() => {
                    deleteContextMenuNode();
                    addNodes(nodeRF);
                });
                updateServerNode(optionMessageNode).catch((err) => console.error("error updating node ~ onConnetEdgeWithPayload", { err }));
            }
        },
        [addNodes, deleteContextMenuNode, getNode, renderMessage, skillId, updateLocalNode, updateServerNode]
    );

    const clearOnlyOneConnection = useCallback(
        (currentEdge: Edge) => {
            const sourceNode = getNode(currentEdge.source) as Node;
            const edges = getConnectedEdges([sourceNode], getEdges());
            const sourceEdges = edges.filter((edge) => edge.sourceHandle === currentEdge.sourceHandle && edge.id !== currentEdge.id);

            if (sourceEdges.length > 0) {
                for (const edge of sourceEdges) {
                    handleEdgeClick(edge.id);
                }
            }
        },
        [getConnectedEdges, getEdges, getNode, handleEdgeClick]
    );

    const handleCreateNode = useCallback(
        (nodeType: NODE_TYPES, initialData?: BLOCK_TYPES) => async (evt: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
            const position = { x: xPos, y: yPos };
            const { createNode, nodeRF } = generatesNodes({
                nodeType,
                position,
                initialData,
            });

            const currentEdge = getEdges().find((edges) => edges.target === nodeId) as Edge;

            deleteContextMenuNode();
            deleteElements({ edges: [currentEdge] });

            clearOnlyOneConnection(currentEdge);

            addNodes(nodeRF);
            const updatedEdge: Edge = {
                ...currentEdge,
                id: nanoid(),
                target: nodeRF.id,
                zIndex:1000,
                type: data?.edgeType ?? EDGES_TYPES.DEFAULT,
            };
            addEdges(updatedEdge);

            const nodeSource = getNode(currentEdge.source) as Node;
            addPayloadInMessageNodeAction({ currentEdge, nodeRF, nodeSource });
            createNodeAndEdge(createNode, updatedEdge);
        },
        [addEdges, addNodes, clearOnlyOneConnection, createNodeAndEdge, data?.edgeType, deleteContextMenuNode, deleteElements, getEdges, getNode, nodeId, xPos, yPos, addPayloadInMessageNodeAction]
    );

    return { handleCreateNode, deleteContextMenuNode };
}
