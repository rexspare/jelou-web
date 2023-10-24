import { DashboardServer } from "@apps/shared/modules";
import { useQuery } from "@tanstack/react-query";
import isNumber from "lodash/isNumber";
import toLower from "lodash/toLower";

const getPostTable = async (companyId, dataConfig, signal) => {
    const { limit, page, startAt, endAt, channel, status, teams, bot, id } = dataConfig;
    console.log(`teams`, teams);
    switch (toLower(status)) {
        case "in_queue": {
            const { data: resp } = await DashboardServer.get(`/companies/${companyId}/replies/tickets`, {
                params: {
                    limit,
                    ...(page && { page }),
                    ...(startAt && { startAt }),
                    ...(endAt && { endAt }),
                    ...(channel && { channel }),
                    ...(status && { state: status }),
                    ...(teams && { teams }),
                    ...(bot && { bot }),
                    ...(id && { id }),
                    sort: "DESC",
                },
                signal,
            });
            return resp;
        }
        default: {
            const { data } = await DashboardServer.get(`/companies/${companyId}/replies`, {
                params: {
                    limit,
                    ...(page && { page }),
                    ...(startAt && { startAt }),
                    ...(endAt && { endAt }),
                    ...(channel && { channel }),
                    ...(status && { status }),
                    ...(teams && { teams }),
                    sort: "DESC",
                },
                signal,
            });
            return data;
        }
    }
};

// Retrieve post totals info
const getPostsTotals = async (companyId, dataConfig, signal) => {
    const { startAt, endAt, teams } = dataConfig;
    const { data } = await DashboardServer.get(`/companies/${companyId}/replies/totals`, {
        params: {
            ...(startAt && { startAt }),
            ...(endAt && { endAt }),
            ...(teams && { teams }),
        },
        signal,
    });
    return data?.data;
};

// Retrieve post data table
export function usePostTable(companyId, dataConfig) {
    return useQuery(["getPostTable", companyId, dataConfig], ({ signal }) => getPostTable(companyId, dataConfig, signal), {
        // staleTime: 10 * 60 * 1000,
        refetchOnWindowFocus: false,
        enabled: isNumber(companyId),
        select: (data) => {
            return data;
        },
    });
}

// Retrieve post averages performance data
export function usePostTotals(companyId, dataConfig) {
    return useQuery(["getPostsTotals", companyId], ({ signal }) => getPostsTotals(companyId, dataConfig, signal), {
        staleTime: 0,
        refetchOnWindowFocus: false,
        enabled: isNumber(companyId),
    });
}
