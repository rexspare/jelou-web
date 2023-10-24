import { useQuery, useQueryClient } from "@tanstack/react-query";

import { TOOLKITS_KEY_RQ } from "@builder/constants.local";
import { getAllToolkits } from "@builder/services/toolkits";

export const useQueryToolkits = () => {
    const queryClient = useQueryClient();

    const {
        data = [],
        isLoading,
        isError,
        error,
    } = useQuery([TOOLKITS_KEY_RQ], getAllToolkits, {
        refetchInterval: Infinity,
        refetchOnWindowFocus: false,
    });

    const refreshToolkitsList = (): void => {
        queryClient.invalidateQueries(TOOLKITS_KEY_RQ);
    };

    return {
        data,
        error,
        isError,
        isLoading,
        refreshToolkitsList,
    };
};
