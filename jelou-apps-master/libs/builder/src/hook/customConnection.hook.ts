import type { Edge, Node, OnConnect, OnConnectEnd, OnConnectStart } from "reactflow";

import { nanoid } from "nanoid";
import { useCallback, useRef } from "react";
import { useReactFlow } from "reactflow";

import { ServerNodeAdapter } from "@builder/modules/Nodes/Infrastructure/ServerNode.Adapter";
import { NodeRepository } from "@builder/modules/Nodes/Infrastructure/nodes.repository";
import { CreatorNode } from "@builder/modules/Nodes/application/createNode";

import { EdgeCreator } from "@builder/modules/Edges/application/create.edge";
import { EdgeRepository } from "@builder/modules/Edges/infrastructure/edgeRepository";
import { ServerEdgeAdapter } from "@builder/modules/Edges/infrastructure/serverEdge.adapter";

import { OptionsPayloadMessageNode } from "@builder/modules/Nodes/message/domain/actions.messages";
import { isActionMessageNode } from "@builder/modules/Nodes/message/infrastructure/utils.message";

import { useContextMenuCreator } from "@builder/modules/Nodes/application/contextMenu.creator";
import { useIfErrorNodeAndEdgeCreator } from "@builder/modules/Nodes/application/ifError.creator";

import { useValidatorSingleConnection } from "@builder/Nodes/hooks/validationConnections";
import { useWorkflowStore } from "../Stores";
import { TYPE_ERRORS, renderMessage } from "../common/Toastify";
import { PREFIX_TARGET_IF_ERROR_NODE } from "../constants.local";
import { useCustomsNodes } from "./customNodes.hook";

export function useCustomConnection() {
    const { project, addNodes, addEdges } = useReactFlow();
    const reactFlowWrapper = useRef(null);
    const { id: workflowId } = useWorkflowStore((state) => state.currentWorkflow);

    const connectingHandleId = useRef("");
    const connectingNodeId = useRef("");

    const nodeCreator = new CreatorNode(new NodeRepository(String(workflowId)), new ServerNodeAdapter());
    const edgeCreator = new EdgeCreator(new EdgeRepository(String(workflowId)), new ServerEdgeAdapter());

    const onConnectStart: OnConnectStart = useCallback((event, { handleId, nodeId }) => {
        connectingHandleId.current = handleId as string;
        connectingNodeId.current = nodeId as string;
    }, []);

    const ifErrorNodeAndEdgeCreator = useIfErrorNodeAndEdgeCreator();
    const contextMenuNodeAndEdgeCreator = useContextMenuCreator();

    const onConnectEnd: OnConnectEnd = useCallback(
        (event) => {
            if (event === null || event.target === null) return;
            const element = event.target as HTMLElement;

            const targetIsPane = element.classList.contains("react-flow__pane");
            if (!targetIsPane) return;

            const mouseEvt = event as MouseEvent;
            const { top, left } = element.getBoundingClientRect();

            const position = project({ x: mouseEvt.clientX - left, y: mouseEvt.clientY - top });

            const source = connectingNodeId.current;
            const sourceHandle = connectingHandleId.current;

            if (sourceHandle?.startsWith(PREFIX_TARGET_IF_ERROR_NODE)) {
                ifErrorNodeAndEdgeCreator({ position, source, sourceHandle });
                return;
            }

            contextMenuNodeAndEdgeCreator({ position, source, sourceHandle });
        },
        [project, workflowId, connectingNodeId, connectingHandleId, addNodes, addEdges, nodeCreator, edgeCreator]
    );

    return { onConnectStart, onConnectEnd, reactFlowWrapper };
}

export function useOnConnect() {
    const { addEdges } = useReactFlow();
    const { id: workflowId } = useWorkflowStore((state) => state.currentWorkflow);
    const validationConnectionHandler = useValidatorSingleConnection();

    return (custom = {}): OnConnect =>
        (params) => {
            const validConnection = validationConnectionHandler(params);
            if (!validConnection) return;

            const newEdge = { ...params, ...custom, id: nanoid() };
            addEdges(newEdge as Edge);
            const edgeCreator = new EdgeCreator(new EdgeRepository(String(workflowId)), new ServerEdgeAdapter());

            edgeCreator.create(newEdge as Edge).catch((err) => {
                renderMessage(err.message, TYPE_ERRORS.ERROR);
            });
        };
}

export function useDisconnectEdge() {
    const { deleteElements, getEdge, getNode } = useReactFlow();
    const { id: workflowId } = useWorkflowStore((state) => state.currentWorkflow);

    const { updateServerNode, updateLocalNode } = useCustomsNodes();

    const handleEdgeClick = async (edgeId: string) => {
        const edge = getEdge(edgeId) as Edge;
        const nodeSource = getNode(edge.source) as Node;

        const messageAction = isActionMessageNode(nodeSource);
        const optionId = edge.sourceHandle;
        if (messageAction && optionId) {
            const optionsPayloadMessageNode = new OptionsPayloadMessageNode(nodeSource, messageAction.id, optionId);
            const { configuration, optionMessageNode } = optionsPayloadMessageNode.clear();

            updateLocalNode(nodeSource.id, { configuration });
            updateServerNode(optionMessageNode).catch((err) => console.error("error updating node ~ useDisconnectEdge", { err }));
        }

        deleteElements({ edges: [edge] });
        new EdgeRepository(String(workflowId)).delete(edgeId).catch((err) => {
            // renderMessage(err.message, TYPE_ERRORS.ERROR);
            console.error("error deleting edge ~ useDisconnectEdge", { err });
        });
    };

    return { handleEdgeClick };
}
