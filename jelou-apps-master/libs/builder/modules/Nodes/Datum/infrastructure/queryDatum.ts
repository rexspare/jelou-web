import { useQuery, useQueryClient } from "@tanstack/react-query";

import { DatumRepository } from "./datum.repository";

const QUERY_KEY = "databases-datum-node";

const datumRepository = new DatumRepository();

export function useQueryDatumDatabases() {
    const queryClient = useQueryClient();

    const {
        data = [],
        isLoading,
        isFetching,
        isError,
    } = useQuery([QUERY_KEY], () => datumRepository.getAll(), {
        refetchOnWindowFocus: false,
    });

    const invalidateDatum = () => {
        queryClient.invalidateQueries([QUERY_KEY]);
    };

    return {
        isFetching,
        data,
        isLoading,
        invalidateDatum,
        isError,
    };
}

export function useQueryDatumOneDatabase(databaseId?: number) {
    const queryClient = useQueryClient();

    const {
        data,
        isLoading,
        isFetching,
        isError,
    } = useQuery([QUERY_KEY, databaseId], () => datumRepository.getOne(Number(databaseId)), {
        refetchOnWindowFocus: false,
        enabled: Boolean(databaseId),
    });

    const invalidateDatum = () => {
        queryClient.invalidateQueries([QUERY_KEY, databaseId]);
    };

    return {
        isFetching,
        data,
        isLoading,
        invalidateDatum,
        isError,
    };
}
