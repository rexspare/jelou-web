import { DashboardServer } from "@apps/shared/modules";
import { useQuery } from "@tanstack/react-query";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import first from "lodash/first";

const getEmails = async (company, operator, dataConfig) => {
    const companyId = get(company, "id", "");
    const { id } = operator;
    const limit = get(dataConfig, "limit");
    const page = get(dataConfig, "page");
    const status = get(dataConfig, "status");

    const date = get(dataConfig, "date");
    const [startAt, endAt] = date;

    const { data } = await DashboardServer.get(`/companies/${companyId}/tickets/getTickets`, {
        params: {
            operatorId: id,
            page,
            limit,
            startAt,
            endAt,
            ...(status ? { status } : {}),
            sort: "DESC",
        },
    });
    return data;
};

const getEmailTotals = async (company, operator, dataConfig) => {
    try {
        const companyId = get(company, "id", "");
        const { id } = operator;
        const date = get(dataConfig, "date");
        const [startAt, endAt] = date;
        const {
            data: { data },
        } = await DashboardServer.get(`/companies/${companyId}/tickets/totals`, {
            params: {
                startAt,
                endAt,
                operatorId: id,
            },
        });
        return data;
    } catch (error) {
        console.log(error);
    }
};

const getEmailStats = async (company, operator, dataConfig) => {
    try {
        const companyId = get(company, "id", "");
        const { id } = operator;
        const date = get(dataConfig, "date");
        const [startAt, endAt] = date;
        const {
            data: { data },
        } = await DashboardServer.get(`/companies/${companyId}/tickets/Stats`, {
            params: {
                startAt,
                endAt,
                operatorId: id,
            },
        });
        return data;
    } catch (error) {
        console.log(error);
    }
};

// Retrieve mail of a single operator
export function useOperatorEmails(company, operator, dataConfig) {
    return useQuery(["emailsCases", company, operator, dataConfig], () => getEmails(company, operator, dataConfig), {
        staleTime: 10 * 60 * 1000,
        refetchOnWindowFocus: false,
        enabled: !isEmpty(company) && !isEmpty(operator),
    });
}

// Retrieve email total statistics of a single operator
export function useOperatorEmailAttentionTotals(company, operator, dataConfig) {
    return useQuery(["getEmailTotals", company, operator, dataConfig], () => getEmailTotals(company, operator, dataConfig), {
        staleTime: 10 * 60 * 1000,
        refetchOnWindowFocus: false,
        enabled: !isEmpty(operator) && !isEmpty(company),
        select: (data) => {
            const { totals } = data;
            return first(totals);
        },
    });
}

// Retrieve email statistics of a single operator
export function useOperatorEmailStats(company, operator, dataConfig) {
    return useQuery(["getEmailStats", company, operator, dataConfig], () => getEmailStats(company, operator, dataConfig), {
        staleTime: 10 * 60 * 1000,
        refetchOnWindowFocus: false,
        enabled: !isEmpty(operator) && !isEmpty(company),
        select: (data) => {
            const { stats } = data;
            return first(stats);
        },
    });
}
