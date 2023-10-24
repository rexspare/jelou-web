import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import { Node, useReactFlow } from "reactflow";

import { NODE_TYPES } from "@builder/modules/Nodes/domain/constants";
import { ServerNodeAdapter } from "../../../../../modules/Nodes/Infrastructure/ServerNode.Adapter";
import { NodeRepository } from "../../../../../modules/Nodes/Infrastructure/nodes.repository";
import { CreatorNode } from "../../../../../modules/Nodes/application/createNode";
import { generatesNodes } from "../../../../Nodes/utils/utils.nodes";
import { useCustomsNodes } from "../../../../hook/customNodes.hook";

type NodeActionsType = {
    nodeId: string;
    workflowId: string;
    isNodeCollapsed: boolean;
    setIsNodeCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
};

type GenerigNode = {
    configuration: {
        collapsed: boolean;
        title: string;
    };
};

export const useNodeActions = ({ nodeId, workflowId, isNodeCollapsed, setIsNodeCollapsed }: NodeActionsType) => {
    const { getNode, addNodes } = useReactFlow();

    const { updateLocalNode } = useCustomsNodes();
    const currentNodeSelected = getNode(nodeId) as Node<GenerigNode>;

    const type = get(currentNodeSelected, "type", "");

    const nodeCreator = new CreatorNode(new NodeRepository(workflowId), new ServerNodeAdapter());

    /**
     * Function that handles the collapse and expansion of the node
     * @returns {void}
     */
    const handleCollapseNode = () => {
        const dataUpdated = {
            ...currentNodeSelected.data.configuration,
            collapsed: !isNodeCollapsed,
        };

        setIsNodeCollapsed((preState) => !preState);
        updateLocalNode(currentNodeSelected.id, { configuration: dataUpdated });
    };

    /**
     * Function that handles the duplication of the node
     */
    const handleDuplicateNode = () => {
        if (isEmpty(currentNodeSelected) || isEmpty(currentNodeSelected.type)) return;

        const position = { x: currentNodeSelected.position.x + 275, y: currentNodeSelected.position.y };
        const { createNode, nodeRF } = generatesNodes({
            nodeType: currentNodeSelected.type as NODE_TYPES,
            position,
            initialData: undefined,
        });

        const updatedCreateNode = {
            ...createNode,
            configuration: currentNodeSelected.data.configuration,
        };

        const updatedCreateRFNode = {
            ...nodeRF,
            data: {
                ...nodeRF.data,
                configuration: currentNodeSelected.data.configuration,
            },
        };

        addNodes(updatedCreateRFNode);
        nodeCreator.create({ ...updatedCreateNode }).catch((err) => console.error("ContextMenuNode - handleCreateNode", { err }));
    };

    return {
        type,
        handleCollapseNode,
        handleDuplicateNode,
    };
};
