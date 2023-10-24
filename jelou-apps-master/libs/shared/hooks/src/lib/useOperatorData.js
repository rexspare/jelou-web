import { DashboardServer, JelouApiV1 } from "@apps/shared/modules";
import { useQuery } from "@tanstack/react-query";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import isNumber from "lodash/isNumber";

// Obtain info of all operators
const getOperators = async (company, dataConfig, kia, signal) => {
    const companyId = get(company, "id", "");
    const teamScopes = get(dataConfig, "teamScopes", "");
    const teams = get(dataConfig, "team.id", []);
    const query = get(dataConfig, "query", "");
    const active = get(dataConfig, "status.id", get(dataConfig, "status", ""));
    const limit = get(dataConfig, "limit");
    const page = get(dataConfig, "page");
    const shouldPaginate = get(dataConfig, "shouldPaginate", true);

    // KIA
    const ifKia = get(kia, "ifKia", false);
    const category = get(kia, "filteredCategory", "");
    const agency = get(kia, "filteredAgencies", "");
    const group = get(kia, "filteredGroups", "");
    const city = get(kia, "filteredCities", "");

    const { data } = await DashboardServer.get(`/companies/${companyId}/users`, {
        params: {
            ...(!isEmpty(teamScopes) ? { teams: [teamScopes] } : {}),
            ...(!isEmpty(query) ? { query } : {}),
            ...(isNumber(teams) ? { teams: [teams] } : {}),
            ...(!isEmpty(active) ? { active } : {}),

            ...(shouldPaginate && { shouldPaginate: true }),
            ...(isNumber(page) ? { page } : {}),
            ...(isNumber(limit) ? { limit } : {}),

            isOperator: true,
            getStats: true,
            state: true,
            ...(ifKia
                ? {
                      storedParams: {
                          ...(!isEmpty(category) ? { category: category.name } : {}),
                          ...(!isEmpty(agency) ? { agency: agency.name } : {}),
                          ...(!isEmpty(group) ? { group: group.name } : {}),
                          ...(!isEmpty(city) ? { city: city.name } : {}),
                      },
                  }
                : {}),
        },
        signal,
    });

    return data;
};

// get info of a Operator
const getOperator = async (company, user, dataConfig) => {
    const companyId = get(company, "id", "");
    const date = get(dataConfig, "date");
    const [startAt, endAt] = date;
    const userId = get(user, "id");
    const { data } = await DashboardServer.get(`/companies/${companyId}/users/${userId}/stats/chats`, {
        params: {
            startAt,
            endAt,
        },
    });
    const results = get(data, "data", {});
    return results;
};

// get Operator logs
const logs = async (operator, filter, signal) => {
    const { id } = operator;
    const page = get(filter, "page", 1);
    const limit = get(filter, "limit", 10);
    const date = get(filter, "date");
    const [startAt, endAt] = date;

    const { data } = await JelouApiV1.get(`/operators/${id}/logs`, {
        params: {
            page,
            limit,
            startAt,
            endAt,
        },
        signal,
    });
    return data;
};

// get Operator log trends
const logTrend = async (operator, filter) => {
    const { id } = operator;
    const date = get(filter, "date");
    const [startAt, endAt] = date;
    const { data } = await JelouApiV1.post(`/operators/${id}/trend`, {
        startAt,
        endAt,
    });
    return data;
};

// Retrieve Operator results array
export function useOperatorData(company, dataConfig, kia) {
    return useQuery(["getOperators", company, dataConfig, kia], ({ signal }) => getOperators(company, dataConfig, kia, signal), {
        staleTime: 10 * 60 * 1000, //10min the expiring the validity of query
        refetchOnWindowFocus: false,
        enabled: !isEmpty(company),
        select: (data) => {
            const operators = get(data, "data", []);
            return operators;
        },
    });
}

// Retrieve Operator with pagination
export function useOperatorDataTable(company, dataConfig, kia) {
    return useQuery(["getOperatorsTable", company, dataConfig, kia], ({ signal }) => getOperators(company, dataConfig, kia, signal), {
        // staleTime: 10 * 60 * 1000,
        refetchOnWindowFocus: false,
        enabled: !isEmpty(company),
        select: (data) => {
            return data;
        },
    });
}

// Retrieve statistics of a single operator
export function useOperatorStats(company, user, dataConfig) {
    return useQuery(["getOperatorStats", company, user, dataConfig], ({ signal }) => getOperator(company, user, dataConfig, signal), {
        staleTime: 10 * 60 * 1000,
        refetchOnWindowFocus: false,
        enabled: !isEmpty(company) && !isEmpty(user),
    });
}

// Retrieve logs with pagination of a single operator
export function useOperatorLogs(operator, filter) {
    return useQuery(["logs", operator, filter], ({ signal }) => logs(operator, filter, signal), {
        staleTime: 10 * 60 * 1000,
        refetchOnWindowFocus: false,
        enabled: !isEmpty(operator),
        select: (data) => {
            return data;
        },
    });
}

// Retrieve logs statistics of a single operator
export function useOperatorLogTrends(operator, filter) {
    return useQuery(["logTrend", operator, filter], () => logTrend(operator, filter), {
        staleTime: 10 * 60 * 1000,
        refetchOnWindowFocus: false,
        enabled: !isEmpty(operator),
        select: (data) => {
            return data.data;
        },
    });
}
