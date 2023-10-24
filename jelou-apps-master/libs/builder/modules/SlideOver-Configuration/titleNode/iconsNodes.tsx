import { get } from "lodash";
import { type Node } from "reactflow";

import { MESSAGE_LIST_NODES, SERVICES_LIST_NODES } from "@builder/ToolBar/constants.toolbar";
import { ToolsNodesInitialData } from "@builder/modules/Nodes/Tool/domain/tool.domain";
import { NODE_TYPES } from "@builder/modules/Nodes/domain/constants";
import { MessageNode } from "@builder/modules/Nodes/message/domain/message.domain";
import { getThumbnailsIcon } from "@builder/shared/utils";
import { ICONS_BY_NODE_TYPE } from "./constants.titleNode";

const IconNotFount: React.FC<{
    width?: number | undefined;
    height?: number | undefined;
    color?: string | undefined;
}> = () => <span>Icon not found xd</span>;

export class IconsNodesConfig {
    private Icon: React.FC<{
        width?: number | undefined;
        height?: number | undefined;
        color?: string | undefined;
    }> | null = null;

    getIcon(node: Node) {
        const nodeType = node?.type;
        if (nodeType && nodeType === NODE_TYPES.MESSAGE) this.messageNode(node);
        if (nodeType && nodeType === NODE_TYPES.TOOL) this.toolNode(node);

        return this.Icon ?? ICONS_BY_NODE_TYPE[nodeType as NODE_TYPES] ?? IconNotFount;
    }

    private toolNode(node: Node) {
        const { thumbnail } = get(node, "data.configuration.toolData") as ToolsNodesInitialData;
        this.Icon = getThumbnailsIcon(thumbnail);
    }

    private messageNode(node: Node) {
        const { messages = [] } = (node.data.configuration as MessageNode["configuration"]) ?? {};
        const [firstMessage] = messages;
        const { Icon: IconMessageByType } = [...SERVICES_LIST_NODES, ...MESSAGE_LIST_NODES].find((item) => item.initialData === firstMessage?.type) ?? {};

        // this is null by default because the icon for message is it defined in ICONS_BY_NODE_TYPE
        this.Icon = IconMessageByType ?? null;
    }
}
