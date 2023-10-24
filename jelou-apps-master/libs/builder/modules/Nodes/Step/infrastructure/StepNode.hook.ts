import { useRef, useState } from "react";
import { Node, getConnectedEdges, useReactFlow, useStore, useUpdateNodeInternals } from "reactflow";

import { useConfigNodeId, useWorkflowStore } from "@builder/Stores";
import { TYPE_ERRORS, renderMessage } from "@builder/common/Toastify";
import { getHandleTargetStyles } from "@builder/helpers/utils";
import { useDragAndDropEvents } from "@builder/hook/events.hook";

import { useDisconnectEdge } from "@builder/hook/customConnection.hook";
import { ServerNodeAdapter } from "../../Infrastructure/ServerNode.Adapter";
import { NodeRepository } from "../../Infrastructure/nodes.repository";
import { UpdaterNode } from "../../application/updateNode";
import { CreateServerNode } from "../../domain/nodes";
import { IStepNode } from "../domain/step.domain";

export const useStepNode = ({ nodeId }: { nodeId: string }) => {
    const [targetHandleHover, setTargetHandleHover] = useState<boolean>(false);

    const [isNodeCollapsed, setIsNodeCollapsed] = useState<boolean>(false);
    const { id: workflowId } = useWorkflowStore((state) => state.currentWorkflow);
    const nodeRef = useRef<HTMLDivElement>(null);

    const { getDroppedNode } = useDragAndDropEvents();
    const { setNodes, getEdges } = useReactFlow();
    const updateNodeInternals = useUpdateNodeInternals();
    const { handleEdgeClick } = useDisconnectEdge();

    const { getNode } = useReactFlow();
    const connectionNodeId = useStore((state) => state.connectionNodeId);

    const currentNode = getNode(nodeId) as Node<IStepNode>;
    const setNodeIdSelected = useConfigNodeId((state) => state.setNodeIdSelected);

    const selectConfigNode = () => {
        if (currentNode) setNodeIdSelected(nodeId);
    };

    const targetHandleStyle = getHandleTargetStyles(nodeId, connectionNodeId, targetHandleHover);

    const handleOnDropNode = (event: React.DragEvent<HTMLElement>) => {
        let dropped: Node | null = null;
        let server: CreateServerNode | null = null;

        try {
            const { droppedNode, serverNode } = getDroppedNode(event);
            dropped = droppedNode;
            server = serverNode;
        } catch (error) {
            console.error({ error });
        }

        if (!dropped || !server) {
            renderMessage("No se puedo reemplazar el nodo correctamente, por favor intente refresacando la página", TYPE_ERRORS.ERROR);
            return;
        }

        /**
         * Delete the source handle if exists.
         */
        const connectedEdges = getConnectedEdges([currentNode], getEdges());
        const sourceConnected = connectedEdges.find((edge) => edge.source === nodeId);
        if (sourceConnected) handleEdgeClick(sourceConnected.id);

        const updater = new UpdaterNode(new NodeRepository(String(workflowId)), new ServerNodeAdapter());
        updater.updateNodeTypeId(nodeId, server.nodeTypeId);

        setNodes((nodes) => nodes.map((node) => (node.id === nodeId ? { ...node, data: dropped?.data, type: dropped?.type } : node)));
        updateNodeInternals(nodeId);
    };

    const handleOnDragOverNode = (event: React.DragEvent<HTMLElement>) => {
        event?.preventDefault();
        nodeRef.current?.classList.add("dropzone");
    };

    const handleOnDragExitNode = (event: React.DragEvent<HTMLElement>) => {
        event.preventDefault();
        nodeRef.current?.classList.remove("dropzone");
    };

    return {
        isNodeCollapsed,
        nodeRef,
        targetHandleStyle,
        targetHandleHover,
        selectConfigNode,
        setIsNodeCollapsed,
        setTargetHandleHover,
        handleOnDragOverNode,
        handleOnDragExitNode,
        handleOnDropNode,
    };
};
