import { nanoid } from "nanoid";
import { XYPosition, useReactFlow } from "reactflow";

import { PREFIX_SOURCE_IF_ERROR_NODE, PREFIX_SOURCE_SUCCESS } from "@builder/constants.local";
import { EDGES_TYPES } from "@builder/modules/Edges/domain/constanst";
import { NODE_TYPES } from "../domain/constants";

type Props = {
    position: XYPosition;
    source: string;
    sourceHandle: string;
};

export function useContextMenuCreator() {
    const { addNodes, addEdges } = useReactFlow();

    return ({ position, source, sourceHandle }: Props) => {
        const contextConfig = {
            edgeType: EDGES_TYPES.DEFAULT,
        };

        if (sourceHandle?.startsWith(PREFIX_SOURCE_IF_ERROR_NODE)) {
            contextConfig.edgeType = EDGES_TYPES.ERROR;
        }

        if (sourceHandle?.startsWith(PREFIX_SOURCE_SUCCESS)) {
            contextConfig.edgeType = EDGES_TYPES.SUCCESS;
        }

        const contextMenuNode = {
            id: nanoid(),
            type: NODE_TYPES.CONTEXT_MENU,
            position,
            data: {
                ...contextConfig,
            },
        };

        const contextMenuEdge = { id: nanoid(), source, sourceHandle, target: contextMenuNode.id, type: EDGES_TYPES.DEFAULT };

        addNodes(contextMenuNode);
        addEdges(contextMenuEdge);
    };
}
