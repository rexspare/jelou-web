import debounce from "lodash/debounce";
import { useRef } from "react";
import { useReactFlow, type Node, type Project } from "reactflow";

import { generatesNodes } from "@builder/Nodes/utils/utils.nodes";
import { useWorkflowStore } from "@builder/Stores";
import { ServerNodeAdapter } from "@builder/modules/Nodes/Infrastructure/ServerNode.Adapter";
import { NodeRepository } from "@builder/modules/Nodes/Infrastructure/nodes.repository";
import { CreatorNode } from "@builder/modules/Nodes/application/createNode";

import { TYPE_ERRORS, renderMessage } from "../common/Toastify";
import { useCustomsNodes } from "./customNodes.hook";

class DragAndDropEvents {
    evt: React.DragEvent<HTMLDivElement | HTMLElement>;
    element: HTMLElement;

    constructor(evt: React.DragEvent<HTMLDivElement | HTMLElement>) {
        this.evt = evt;
        this.element = evt.target as HTMLElement;
    }

    public targetIsPane = () => this.element.classList.contains("react-flow__pane");

    private getDataTransfer = () => JSON.parse(this.evt.dataTransfer.getData("text/plain"));

    private getBoundingClient() {
        const { top, left } = this.element.getBoundingClientRect();
        const { clientX, clientY } = this.evt;
        return { top, left, clientX, clientY };
    }

    public getNodes(project: Project) {
        const { nodeType, initialData } = this.getDataTransfer();
        if (nodeType === null) throw new Error("No se pudo obtener el tipo de nodo");

        const { top, left, clientX, clientY } = this.getBoundingClient();

        const position = project({ x: clientX - left - 75, y: clientY - top - 75 });
        const { nodeRF, createNode } = generatesNodes({ nodeType, position, initialData });

        return { nodeRF, createNode };
    }
}

export function useDragAndDropEvents() {
    const { project, addNodes } = useReactFlow();
    const { id: workflowId } = useWorkflowStore((state) => state.currentWorkflow);
    const nodeDragged = useRef<Node | null>(null);
    const { updateServerNode } = useCustomsNodes();
    const nodeCreator = new CreatorNode(new NodeRepository(String(workflowId)), new ServerNodeAdapter());

    const handleDrop = (evt: React.DragEvent<HTMLDivElement>) => {
        evt.preventDefault();
        const dragAndDropEvents = new DragAndDropEvents(evt);
        if (!dragAndDropEvents.targetIsPane()) return;

        const { nodeRF, createNode } = dragAndDropEvents.getNodes(project);

        addNodes(nodeRF);
        nodeCreator.create(createNode).catch((err) => {
            renderMessage(err.message, TYPE_ERRORS.ERROR);
            console.error("error create node", { err });
        });
    };

    const getDroppedNode = (event: React.DragEvent<HTMLElement>) => {
        event.preventDefault();
        const dragAndDropEvents = new DragAndDropEvents(event);

        if (dragAndDropEvents.targetIsPane()) {
            throw new Error("Se solto el elemento en el panel de trabajo");
        }

        const { createNode, nodeRF } = dragAndDropEvents.getNodes(project);

        return { droppedNode: nodeRF, serverNode: createNode };
    };

    const handleDragOver = (evt: React.DragEvent<HTMLDivElement>) => evt.preventDefault();

    const handleDragStart = (event: React.MouseEvent<Element, MouseEvent>, node: Node) => {
        nodeDragged.current = node;
    };

    const handleDragStop = debounce((event: React.MouseEvent<Element, MouseEvent>, node: Node) => {
        const sameXPosition = nodeDragged.current?.position.x === node.position.x;
        const sameYPosition = nodeDragged.current?.position.y === node.position.y;
        if (sameXPosition && sameYPosition) return;

        updateServerNode(node).catch((err) => console.error("error updating node ~ handleDragStop", { err }));
    }, 1000);

    return { handleDrop, handleDragOver, getDroppedNode, handleDragStop, handleDragStart };
}
