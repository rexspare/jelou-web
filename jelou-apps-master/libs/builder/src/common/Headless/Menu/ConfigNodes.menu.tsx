import get from "lodash/get";
import { useReactFlow, type Node } from "reactflow";

import { renderMessage, TYPE_ERRORS } from "@builder/common/Toastify";
import { useCustomsNodes } from "@builder/hook/customNodes.hook";
import { CollapseIcon, DeleteBlockIcon, DuplicateBlockIcon, ExpandIcon, MenuDotIcon, PlayIcon } from "@builder/Icons";
import { CopyClicboardIcon } from "@builder/Icons/CopyClicboard.Icon";
import { configHttp, objectToCurl } from "@builder/libs/cruls/parse";
import { NODE_TYPES } from "@builder/modules/Nodes/domain/constants";
import { BaseConfiguration } from "@builder/modules/Nodes/domain/nodes";
import { Http } from "@builder/modules/Nodes/Http/http.domain";
import { deleteNodeModalStore } from "@builder/Stores/deleteNodeModal";
import { useExecuteNodeStore } from "@builder/Stores/nodeConfigStore";
import { useCallback } from "react";
import { useNodeActions } from "./hooks/useNodeActions";
import { ItemMenuId, MenuHeadlessConfNode, type ItemsMenu } from "./Menu.nodes";
import { isActionMessageNode } from "@builder/modules/Nodes/message/infrastructure/utils.message";

type MenuConfigNodeProps = {
    nodeId: string;
    workflowId: string;
    isNodeCollapsed?: boolean;
    setIsNodeCollapsed?: React.Dispatch<React.SetStateAction<boolean>>;
    onOptionSelected?: () => void;
};

const DISABLED_COLLAPSE_NODES = [NODE_TYPES.END, NODE_TYPES.CONDITIONAL, NODE_TYPES.TOOL, NODE_TYPES.PMA, NODE_TYPES.EMPTY, NODE_TYPES.RANDOM, NODE_TYPES.NOTE];

export const MenuConfigNode = ({ nodeId, isNodeCollapsed = false, setIsNodeCollapsed = () => null, workflowId, onOptionSelected = () => null }: MenuConfigNodeProps) => {
    const { setNodeIdToDelete } = deleteNodeModalStore((state) => ({ setNodeIdToDelete: state.setNodeIdToDelete }));

    const { setSelectedNodeId, setIsExecuteHttpNodeModalOpen } = useExecuteNodeStore();
    const { updateLocalNode, updateServerNode } = useCustomsNodes();
    const { getNode } = useReactFlow();

    const currentSelectedNode = getNode(nodeId) as Node<{ configuration: BaseConfiguration }>;
    const isCurrentSelectedNodeCollapsed = get(currentSelectedNode, "data.configuration.collapsed", false);

    const { type, handleDuplicateNode } = useNodeActions({
        nodeId,
        isNodeCollapsed,
        setIsNodeCollapsed,
        workflowId,
    });

    const handleExecuteNode = () => {
        if (nodeId) {
            setSelectedNodeId(nodeId);
            setIsExecuteHttpNodeModalOpen(true);
        }
    };

    const handleOpenDeleteNodeModal = () => setNodeIdToDelete(nodeId);

    const handleObjectToCurl = () => {
        const currentNodeSelected = getNode(nodeId) as Node<Http>;
        // TODO: missing authentification
        const { body, headers, parameters, method, url } = get(currentNodeSelected, "data.configuration");

        const { data, header, url: parseURL } = configHttp({ data: body, header: headers, url, queryParams: parameters });

        const curl = objectToCurl({ data, header, method, url: parseURL });

        navigator.clipboard.writeText(curl).then(() => {
            renderMessage("CURL copiado al portapapeles", TYPE_ERRORS.SUCCESS);
        });
    };

    const handleCollapseNode = useCallback(() => {
        const newConfiguration: { configuration: BaseConfiguration } = {
            configuration: {
                ...currentSelectedNode.data.configuration,
                collapsed: !get(currentSelectedNode, "data.configuration.collapsed", false),
            },
        };

        const updetedNode: Node = {
            ...currentSelectedNode,
            data: newConfiguration,
        };

        updateLocalNode(nodeId, newConfiguration);
        updateServerNode(updetedNode).catch((error: Error) => {
            console.error("MenuConfigNode - handleCollapseNode", { error });
            renderMessage(error.message, TYPE_ERRORS.ERROR);
        });
    }, [currentSelectedNode]);

    const HTTP_COPY_CONFIG = {
        id: ItemMenuId.ConfigHttpNode,
        Icon: () => <CopyClicboardIcon width={16} height={16} />,
        label: "Copiar como cURL",
        onClick: handleObjectToCurl,
        disabled: false,
        separator: false,
    };

    const HTTP_EXECUTE_CONFIG = {
        id: ItemMenuId.ExecuteHttpNode,
        Icon: () => <PlayIcon width={16} height={16} />,
        label: "Ejecutar",
        onClick: handleExecuteNode,
        disabled: false,
        separator: false,
    };

    let itemsMenu: ItemsMenu[] = [
        {
            id: ItemMenuId.Collapse,
            Icon: isCurrentSelectedNodeCollapsed ? ExpandIcon : CollapseIcon,
            label: isCurrentSelectedNodeCollapsed ? "Expandir" : "Contraer",
            onClick: handleCollapseNode,
            disabled: DISABLED_COLLAPSE_NODES.includes(type as NODE_TYPES) || Boolean(isActionMessageNode(currentSelectedNode)),
            separator: false,
        },
        {
            id: ItemMenuId.Duplicate,
            Icon: DuplicateBlockIcon,
            label: "Duplicar",
            onClick: handleDuplicateNode,
            disabled: type === NODE_TYPES.END,
            separator: false,
        },
        {
            id: ItemMenuId.Delete,
            Icon: DeleteBlockIcon,
            label: "Eliminar",
            onClick: handleOpenDeleteNodeModal,
            disabled: false,
            separator: false,
        },
    ];

    if (type === NODE_TYPES.HTTP) {
        itemsMenu = [HTTP_COPY_CONFIG, HTTP_EXECUTE_CONFIG, ...itemsMenu];
    }

    return <MenuHeadlessConfNode IconMenu={MenuDotIcon} itemsList={itemsMenu} onOptionSelected={onOptionSelected} distance="" />;
};
