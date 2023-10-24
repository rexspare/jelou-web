import { useCallback } from "react";
import { Connection, Edge, Instance, Node, getConnectedEdges, useReactFlow } from "reactflow";

import { PREFIX_SOURCE_IF_ERROR_NODE, PREFIX_SOURCE_SUCCESS, START_PREFIX } from "@builder/constants.local";
import { useDisconnectEdge } from "@builder/hook/customConnection.hook";
import { EDGES_TYPES } from "@builder/modules/Edges/domain/constanst";
import { NODE_TYPES } from "@builder/modules/Nodes/domain/constants";

export const useValidatorSingleConnection = () => {
    const { getNode, getEdges, deleteElements } = useReactFlow();
    const { handleEdgeClick } = useDisconnectEdge();

    return useCallback(
        ({ source, target, sourceHandle }: Connection) => {
            if (source === null || target === null || sourceHandle === null) return false;

            // This avoid self connection
            if (source === target) return false;

            if (sourceHandle.startsWith(START_PREFIX)) {
                startEdgeConnection({ getEdges, getNode, handleEdgeClick, source });
                return true;
            }

            const nodeTarget = getNode(target) as Node;
            const nodeSource = getNode(source) as Node;

            const edges = getConnectedEdges([nodeSource, nodeTarget], getEdges());

            if (sourceHandle.startsWith(PREFIX_SOURCE_IF_ERROR_NODE)) {
                errorsEdgesConnection({ edges, sourceHandle, handleEdgeClick }, nodeSource.id);
                return true;
            }

            if (sourceHandle.startsWith(PREFIX_SOURCE_SUCCESS)) {
                successEdgesConnection({ edges, sourceHandle, handleEdgeClick }, nodeSource.id);
                return true;
            }

            // this is for default edges
            const edgeConnectedInSourceNode = edges.find((edge) => edge.sourceHandle === sourceHandle);
            if (edgeConnectedInSourceNode) {
                handleEdgeClick(edgeConnectedInSourceNode.id).then(() => {
                    deleteElements({ edges: [edgeConnectedInSourceNode] });
                });
            }

            return true;
        },
        [deleteElements, getEdges, getNode, handleEdgeClick]
    );
};

type EdgesConnection = {
    sourceHandle: string;
    edges: Edge[];
    handleEdgeClick: (edgeId: string) => void;
};

type StartEdgeConnection = {
    getNode: Instance.GetNode<unknown>;
    source: string;
    getEdges: Instance.GetEdges<unknown>;
    handleEdgeClick: (edgeId: string) => void;
};

export function startEdgeConnection({ getEdges, getNode, handleEdgeClick, source }: StartEdgeConnection) {
    const startNode = getNode(source) as Node<NODE_TYPES.START>;
    const startEdges = getConnectedEdges([startNode], getEdges());

    // const sourceHanldeExist = startEdges.find((edge) => edge.source === source);
    // const sourceHanldeExist = startEdges.filter((edge) => edge.source === source);

    // console.log({ sourceHanldeExist, startEdges });
    if (startEdges.length > 0) {
        for (const edge of startEdges) {
            handleEdgeClick(edge.id);
        }
    }
    // if (startEdges.length >= 1 && sourceHanldeExist) {
    //     console.log("dentro del if start", { sourceHanldeExist });
    //     handleEdgeClick(sourceHanldeExist.id);
    // }
}

export function successEdgesConnection({ edges, handleEdgeClick, sourceHandle }: EdgesConnection, currentNodeId: string) {
    const successEdges = edges.filter((edge) => edge.type === EDGES_TYPES.SUCCESS);
    // const sourceHandleIdExist = successEdges.find((edge) => edge.sourceHandle === sourceHandle);
    const sourceHandleIdExist = successEdges.filter((edge) => edge.sourceHandle === sourceHandle);

    // if (successEdges.length >= 1 && sourceHandleIdExist) {
    //     handleEdgeClick(sourceHandleIdExist.id);
    // }
    if (sourceHandleIdExist.length > 0) {
        for (const edge of sourceHandleIdExist) {
            handleEdgeClick(edge.id);
        }
    }
}

export function errorsEdgesConnection({ edges, handleEdgeClick, sourceHandle }: EdgesConnection, currentNodeId: string) {
    const errorEdges = edges.filter((edge) => edge.type === EDGES_TYPES.ERROR);
    // const sourceHandleIdExist = errorEdges.find((edge) => edge.sourceHandle === sourceHandle);
    const sourceHandleIdExist = errorEdges.filter((edge) => edge.sourceHandle === sourceHandle);

    // if (errorEdges.length >= 1 && sourceHandleIdExist) {
    //     handleEdgeClick(sourceHandleIdExist.id);
    // }
    if (sourceHandleIdExist.length > 0) {
        for (const edge of sourceHandleIdExist) {
            handleEdgeClick(edge.id);
        }
    }
}
