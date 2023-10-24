import get from "lodash/get";
import { createContext, useCallback, useEffect, useRef, useState } from "react";
import type { Edge, Node } from "reactflow";
import ReactFlow, { Background, useEdgesState, useNodesState, useReactFlow } from "reactflow";
import "reactflow/dist/style.css";
import "tippy.js/dist/tippy.css";

import { ConnectionLine } from "@builder/Edges";
import { useConfigNodeId, useWorkflowStore } from "@builder/Stores";
import ToolBar from "@builder/ToolBar";
import { MenuConfigNode } from "@builder/common/Headless/Menu";
import { useCustomConnection } from "@builder/hook/customConnection.hook";
import { useDragAndDropEvents } from "@builder/hook/events.hook";

import { NODE_TYPES } from "@builder/modules/Nodes/domain/constants";
import { defaultEdgeOptions, edgeType, nodeTypes, rfStyle } from "@builder/reactFlow.config";
import { FROM_PAGE, FROM_PAGE_TYPE } from "../constants.home";

export const FromPageContext = createContext<FROM_PAGE_TYPE>(FROM_PAGE.TOOL);

type WorkFlowProps = {
    initialsNodes: Node[];
    initialsEdges: Edge[];
    fromPage: FROM_PAGE_TYPE;
};

const WorkFlow = ({ initialsNodes, initialsEdges, fromPage }: WorkFlowProps) => {
    const [menu, setMenu] = useState<{ id: string; top: number | boolean; left: number | boolean; right: number | boolean; bottom: number | boolean } | null>(null);
    const paneRef = useRef<HTMLDivElement>(null);

    const { id: workflowId } = useWorkflowStore((state) => state.currentWorkflow);

    const [nodes, setNodes , onNodesChange] = useNodesState(initialsNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialsEdges);
    const { nodeIdSelected } = useConfigNodeId();

    const { handleDragOver, handleDrop, handleDragStop, handleDragStart } = useDragAndDropEvents();
    const { onConnectEnd, onConnectStart } = useCustomConnection();
    const { getNodes, setCenter, getNode } = useReactFlow();

    const onNodeContextMenu = useCallback(
        (event: React.MouseEvent<Element, MouseEvent>, node: Node) => {
            if (node.type === NODE_TYPES.START || node.type === NODE_TYPES.CONTEXT_MENU) {
                return;
            }

            event.preventDefault();

            const currentNodeType = get(getNode(node.id), "type");

            if (currentNodeType === NODE_TYPES.START || currentNodeType === NODE_TYPES.CONTEXT_MENU) return;

            const pane = paneRef.current?.getBoundingClientRect() as DOMRect;
            const updatedNodes = nodes.map((n) => {
              return {
                  ...n,
                  selected: n.id === node.id, // Set selected to true for the clicked node, false for others
              };
          });

          setNodes(updatedNodes);
            setMenu({
                id: node.id,
                top: event.clientY < pane.height && event.clientY,
                left: event.clientX < pane.width && event.clientX - 80,
                right: event.clientX >= pane.width && pane.width - event.clientX,
                bottom: event.clientY >= pane.height && pane.height - event.clientY,
            });
        },
        [setMenu, nodes]
    );

    useEffect(() => {
        if (nodeIdSelected) {
            const updatedEdges = edges.map((edge) => {
                if (edge.target === nodeIdSelected) {
                    return {
                        ...edge,
                        animated: true,
                        style: { stroke: "#FFC107" },
                    };
                } else {
                    return {
                        ...edge,
                        animated: false,
                    };
                }
            });

            setEdges(updatedEdges);
        } else {
            const updatedEdges = edges.map((edge) => ({
                ...edge,
                animated: false,
            }));

            setEdges(updatedEdges);
        }
    }, [nodeIdSelected]);

    useEffect(() => {
        const nodes = getNodes();
        const startNode = nodes.find((node) => node.type === NODE_TYPES.START);
        if (startNode && setCenter.name === "setCenter") {
            const { x, y } = startNode.position;
            const posX = Math.ceil(x) + 600;
            const posY = Math.ceil(y) + 300;

            setCenter(posX, posY, { duration: 800, zoom: 0.7 });
        }
    }, [setCenter]);

    return (
        <main className="relative flex h-screen overflow-hidden">
            <FromPageContext.Provider value={fromPage}>
                <ReactFlow
                    ref={paneRef}
                    id="skills-workflow"
                    defaultEdgeOptions={defaultEdgeOptions}
                    edges={edges}
                    nodes={nodes}
                    nodeTypes={nodeTypes}
                    edgeTypes={edgeType}
                    proOptions={{
                        hideAttribution: true,
                    }}
                    onConnectEnd={onConnectEnd}
                    onConnectStart={onConnectStart}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    onEdgesChange={onEdgesChange}
                    onNodesChange={onNodesChange}
                    style={rfStyle}
                    onNodeDragStop={handleDragStop}
                    onNodeDragStart={handleDragStart}
                    onNodeContextMenu={onNodeContextMenu}
                    connectionLineComponent={ConnectionLine}
                    deleteKeyCode={null}
                    onClick={() => {
                        setMenu(null);
                    }}
                    onMove={() => {
                        setMenu(null);
                    }}
                >
                    <Background />
                    <div style={{ top: `${menu?.top}px`, left: `${menu?.left}px`, right: `${menu?.right}px`, bottom: `${menu?.bottom}px` }} className={`absolute z-10 ${menu ? "" : "hidden"}`}>
                        {menu && <MenuConfigNode nodeId={menu.id} workflowId={String(workflowId)} onOptionSelected={() => setMenu(null)} />}
                    </div>
                </ReactFlow>
                <ToolBar />
            </FromPageContext.Provider>
        </main>
    );
};
export default WorkFlow;
