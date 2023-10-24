import type { Node } from "reactflow";

import { nanoid } from "nanoid";

import { MESSAGE_LIST_NODES, SERVICES_LIST_NODES } from "@builder/ToolBar/constants.toolbar";
import { ToolsNodesInitialData } from "@builder/modules/Nodes/Tool/domain/tool.domain";
import { NODE_TYPES, NODE_TYPES_IDS, TITLE_NODES } from "@builder/modules/Nodes/domain/constants";
import { CreateServerNode } from "@builder/modules/Nodes/domain/nodes";
import { BLOCK_TYPES } from "@builder/modules/Nodes/message/domain/constants.message";
import { configByNodeType } from "./constants.utils-nodes";

const initConfigByNodeType = (nodeType: NODE_TYPES, initialData: BLOCK_TYPES | number | object, defaultId: string) => {
    if (nodeType === NODE_TYPES.MESSAGE && typeof initialData === "string") {
        const configMessage = configByNodeType[nodeType][initialData](defaultId);
        return configMessage ?? configByNodeType[nodeType][BLOCK_TYPES.TEXT](defaultId);
    }

    if (nodeType === NODE_TYPES.PMA) return configByNodeType[nodeType];
    if (nodeType === NODE_TYPES.IF_ERROR) return configByNodeType[nodeType];
    if (nodeType === NODE_TYPES.IF) return configByNodeType[nodeType];
    if (nodeType === NODE_TYPES.CONDITIONAL) return configByNodeType[nodeType];
    if (nodeType === NODE_TYPES.INPUT) return configByNodeType[nodeType];
    if (nodeType === NODE_TYPES.HTTP) return configByNodeType[nodeType];
    if (nodeType === NODE_TYPES.CODE) return configByNodeType[nodeType];
    if (nodeType === NODE_TYPES.NOTE) return configByNodeType[nodeType];
    if (nodeType === NODE_TYPES.TIMER) return configByNodeType[nodeType];
    if (nodeType === NODE_TYPES.EMPTY) return configByNodeType[nodeType];
    if (nodeType === NODE_TYPES.RANDOM) return configByNodeType[nodeType];
    if (nodeType === NODE_TYPES.MEMORY) return configByNodeType[nodeType];
    if (nodeType === NODE_TYPES.TOOL) {
        const defaultConfig = configByNodeType[nodeType];
        return {
            ...defaultConfig,
            toolData: initialData, // this is the extra data of the node tool
        };
    }
    if (nodeType === NODE_TYPES.END) {
        return {
            outputId: initialData as number, // this is the outputId of the node end
            title: TITLE_NODES[nodeType],
        };
    }

    return {};
};

type generatesNodesProps = {
    nodeType: NODE_TYPES;
    position: Node["position"];
    initialData?: BLOCK_TYPES | number;
};

function getTitleNode(nodeType: NODE_TYPES, initialData: BLOCK_TYPES | number | ToolsNodesInitialData) {
    if (nodeType === NODE_TYPES.MESSAGE && typeof initialData === "string") {
        const { text } = [...SERVICES_LIST_NODES, ...MESSAGE_LIST_NODES].find((message) => message.initialData === initialData) ?? {};
        return text ?? TITLE_NODES[nodeType];
    }

    if (nodeType === NODE_TYPES.TOOL) {
        const { toolName } = initialData as ToolsNodesInitialData;
        return toolName ?? TITLE_NODES[nodeType];
    }

    return TITLE_NODES[nodeType];
}

export function generatesNodes({ nodeType, initialData = -1, position }: generatesNodesProps) {
    const defautlConfiguration = initConfigByNodeType(nodeType, initialData, nanoid());
    const title = getTitleNode(nodeType, initialData);
    const id = nanoid();

    const createNode: CreateServerNode = {
        id,
        posX: String(position.x),
        posY: String(position.y),
        nodeTypeId: NODE_TYPES_IDS[nodeType],
        configuration: defautlConfiguration,
        title,
    };

    const nodeRF: Node = {
        id,
        position,
        type: nodeType,
        data: {
            configuration: {
                ...createNode.configuration,
                title,
            },
        },
    };

    return { createNode, nodeRF };
}
