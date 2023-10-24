import get from "lodash/get";
import { useState } from "react";
import { Handle, Node, Position, useReactFlow, useStore } from "reactflow";

import { useConfigNodeId, useWorkflowStore } from "@builder/Stores";
import { StyleNode, getHandleTargetStyles, stylesForNode } from "@builder/helpers/utils";
import { useOnConnect } from "@builder/hook/customConnection.hook";
import { NODE_TYPES } from "@builder/modules/Nodes/domain/constants";

import { CollapsedNode } from "./CollapsedNode";
import { DefaultWrapperNode } from "./DefaultWrapperNode";
import { HandlesToolsNodes } from "./HandlesToolsNode";

export enum DragEventType {
    DragStart = "dragstart",
    Drag = "drag",
    DragEnd = "dragend",
}

export type WrapperProps = {
    Icon: React.FC<{
        width?: number;
        height?: number;
        color?: string;
    }>;
    title: string;
    children: React.ReactNode;
    nodeId: string;
    isActiveButtonsBlock: boolean;
    selected: boolean;
    showDefaultHandle?: boolean;
    showTargetHandle?: boolean;
    handleTargetId?: string;
    styleNode?: StyleNode;
};

const toolsNodeList = [NODE_TYPES.HTTP, NODE_TYPES.IF, NODE_TYPES.CODE];

export const WrapperNode = ({
    nodeId,
    children,
    selected,
    Icon,
    title,
    styleNode = {},
    handleTargetId = undefined,
    showDefaultHandle = true,
    showTargetHandle = true,
    isActiveButtonsBlock = false,
}: WrapperProps) => {
    const [targetHandleHover, setTargetHandleHover] = useState<boolean>(false);

    const { getNode } = useReactFlow();
    const onConnect = useOnConnect();

    const connectionNodeId = useStore((state) => state.connectionNodeId);
    const { id: workflowId } = useWorkflowStore((state) => state.currentWorkflow);

    const currentNode = getNode(nodeId) as Node;
    const nodeType = currentNode.type as NODE_TYPES;

    const isNodeCollapsed = get(currentNode, "data.configuration.collapsed") ?? false;

    const targetHandleStyle = getHandleTargetStyles(nodeId, connectionNodeId, targetHandleHover);
    const styles = stylesForNode(styleNode);

    const isToolNode = toolsNodeList.includes(nodeType);
    const isActiveDefaultHandle = !isActiveButtonsBlock && showDefaultHandle;

    const setNodeIdSelected = useConfigNodeId((state) => state.setNodeIdSelected);

    const selectConfigNode = () => {
        if (currentNode) setNodeIdSelected(nodeId);
    };

    return (
        <div className="relative" onClick={selectConfigNode}>
            {showTargetHandle && (
                <Handle
                    type="target"
                    position={Position.Left}
                    style={targetHandleStyle}
                    id={handleTargetId ?? nodeId}
                    className="absolute top-0 left-0 h-40 w-40"
                    onMouseEnter={() => setTargetHandleHover(true)}
                    onMouseLeave={() => setTargetHandleHover(false)}
                />
            )}

            {!isNodeCollapsed && (
                <DefaultWrapperNode styles={styles} selected={selected} Icon={Icon} nodeId={nodeId} title={title} nodeType={nodeType} workflowId={workflowId}>
                    {children}
                </DefaultWrapperNode>
            )}

            {isNodeCollapsed && <CollapsedNode styles={styles} Icon={Icon} isNodeCollapsed={isNodeCollapsed} nodeId={nodeId} title={title} workflowId={workflowId} />}

            {isToolNode && <HandlesToolsNodes nodeId={nodeId} isNodeCollapsed={isNodeCollapsed} />}

            {isActiveDefaultHandle && <Handle id={nodeId} type="source" position={Position.Right} className="targetsHandles !-right-[0.5rem]" onConnect={onConnect({})} />}
        </div>
    );
};
