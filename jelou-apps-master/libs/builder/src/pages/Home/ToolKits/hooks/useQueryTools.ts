import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

import { TOOLS_KEY_RQ } from "@builder/constants.local";
import { getAllMyToolsPublished, getAllToolsByToolkit, getToolkitById } from "@builder/services/toolkits";

export const useQueryTools = () => {
    const { toolkitId } = useParams();
    const queryClient = useQueryClient();

    const {
        data = [],
        isLoading,
        isError,
        error,
    } = useQuery([TOOLS_KEY_RQ, toolkitId], () => getAllToolsByToolkit(String(toolkitId)), {
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        enabled: Boolean(toolkitId),
    });

    const refreshToolsList = () => {
        queryClient.invalidateQueries(TOOLS_KEY_RQ);
    };

    return {
        data,
        error,
        isError,
        isLoading,
        refreshToolsList,
    };
};

export function useQueryTool() {
    const { toolkitId, toolId } = useParams();
    const queryClient = useQueryClient();

    const {
        data: tool,
        isLoading: isLoadingTools,
        error,
    } = useQuery([TOOLS_KEY_RQ, toolkitId, toolId], () => getToolkitById(String(toolkitId), String(toolId)), {
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        enabled: Boolean(toolkitId && toolId),
    });

    const revalidateTool = (): void => {
        queryClient.invalidateQueries([TOOLS_KEY_RQ, toolkitId, toolId]);
    };

    return {
        tool,
        isLoadingTools,
        error,
        revalidateTool,
    };
}

const PUBLISHED_TOOLS_KEY_RQ = [TOOLS_KEY_RQ + "published-tools"];
export function useQueryMyPublishedTools() {
    const { data = [], isLoading } = useQuery(PUBLISHED_TOOLS_KEY_RQ, getAllMyToolsPublished, {
        refetchOnWindowFocus: false,
    });

    return {
        data,
        isLoading,
    };
}
