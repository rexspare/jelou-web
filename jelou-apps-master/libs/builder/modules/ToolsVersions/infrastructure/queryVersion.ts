import { useQuery, useQueryClient } from "@tanstack/react-query";

import { VERSIONS_KEY } from "../domain/constants.version";
import { getAllVersions } from "./repository";

type QueryVersionProps = {
    toolkitId?: number | string;
    toolId?: number | string;
};

export const useQueryVersion = ({ toolId, toolkitId }: QueryVersionProps) => {
    const queryClient = useQueryClient();

    const { data: versions = [], isLoading } = useQuery([VERSIONS_KEY, toolkitId, toolId], () => getAllVersions(String(toolkitId), String(toolId)), {
        refetchInterval: Infinity,
        refetchOnWindowFocus: false,
        enabled: Boolean(toolkitId) && Boolean(toolId),
    });

    const invalidateVersions = () => {
        queryClient.invalidateQueries([VERSIONS_KEY, toolkitId, toolId]);
    };

    return {
        versions,
        isLoading,
        invalidateVersions,
    };
};
