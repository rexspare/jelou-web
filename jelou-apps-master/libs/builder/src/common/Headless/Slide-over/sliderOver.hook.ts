import type { ToolsNodesInitialData } from "@builder/modules/Nodes/Tool/domain/tool.domain";
import type { End } from "@builder/modules/Nodes/domain/nodes";
import type { Node } from "reactflow";

import get from "lodash/get";
import { useReactFlow } from "reactflow";

import { ACTIONS_DATUM, IDatum } from "@builder/modules/Nodes/Datum/domain/datum.domain";
import { NODE_TYPES } from "@builder/modules/Nodes/domain/constants";
import { DEFAULT_STYLE, STYLE_HEADER_CONFIG } from "@builder/modules/SlideOver-Configuration/titleNode/constants.titleNode";
import { useQueryTool } from "@builder/pages/Home/ToolKits/hooks/useQueryTools";

export function useSliderOver({ nodeId }: { nodeId: string }) {
    const { getNode } = useReactFlow();
    const nodeSelected = getNode(nodeId);
    const typeNode = nodeSelected?.type || null;
    let endNodeType = undefined;

    const { tool } = useQueryTool();
    const { Outputs = [] } = tool || {};

    if (typeNode === NODE_TYPES.END) {
        const endNode = nodeSelected as Node<End>;
        const outputId = get(endNode, "data.configuration.outputId");
        const selectedOutput = Outputs.find((output) => output.id === outputId);
        endNodeType = selectedOutput?.type;
    }

    if (typeNode === NODE_TYPES.TOOL) {
        const { complementaryColor, principalColor } = get(nodeSelected, "data.configuration.toolData") as ToolsNodesInitialData;

        return {
            bgColor: principalColor,
            textColor: complementaryColor,
            maxWidth: "28rem",
        };
    }

    if (typeNode === NODE_TYPES.DATUM) {
        const datumNode = nodeSelected as Node<IDatum>;
        const actionType = get(datumNode, "data.configuration.action");
        const isSearchAction = actionType === ACTIONS_DATUM.SEARCH;

        return {
            bgColor: "#fff",
            textColor: "#727C94",
            maxWidth: isSearchAction ? "50.875rem" : "28rem",
        };
    }

    const selectedNodeType = endNodeType ?? typeNode ?? "";
    const { bgColor, textColor, maxWidth = "28rem" } = STYLE_HEADER_CONFIG[selectedNodeType] ?? DEFAULT_STYLE;

    return {
        bgColor,
        textColor,
        maxWidth,
    };
}
