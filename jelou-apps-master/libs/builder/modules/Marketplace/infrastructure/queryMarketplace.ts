import { useQuery, useQueryClient } from "@tanstack/react-query";

import { renderMessage, TYPE_ERRORS } from "@builder/common/Toastify";
import { MARKETPLACE_QUERY_KEY } from "../domin/constants.marketplace";
import { MarcketplaceToolsRepository } from "./marketplace.repository";

const marketplaceRepository = new MarcketplaceToolsRepository();

export function useQueryMarketplace() {
    const QUERY_KEY = [MARKETPLACE_QUERY_KEY];

    const queryClient = useQueryClient();

    const invalidateMarketplace = () => {
        queryClient.invalidateQueries(QUERY_KEY);
    };

    const { data = [], isLoading } = useQuery(QUERY_KEY, () => marketplaceRepository.getTools(), {
        onError: (error) => {
            let message = "Tuvimos un error al obtener los tools, por favor intenta nuevamente";
            if (error instanceof Error) message = error.message;
            renderMessage(message, TYPE_ERRORS.ERROR);
        },
        refetchOnWindowFocus: false,
    });

    return {
        data,
        isLoading,
        invalidateMarketplace,
    };
}
