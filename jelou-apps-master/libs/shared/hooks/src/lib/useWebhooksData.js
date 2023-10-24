import { JelouApiV1 } from "@apps/shared/modules";
import { useQuery } from "@tanstack/react-query";
import isNumber from "lodash/isNumber";
import isEmpty from "lodash/isEmpty";

// get webhook event's request to be subscribed
const webhooksEvents = async (companyId, entity) => {
    const { data } = await JelouApiV1.get(`/companies/${companyId}/webhooks/entities?`, {
        params: {
            entity,
        },
    });
    return data;
};

// Retrieve webhooks events in cache
export function useWebhookEvents({ companyId = "", entity = "DATUM" }) {
    return useQuery(["webhookEvents", companyId, entity], () => webhooksEvents(companyId, entity), {
        refetchOnWindowFocus: false,
        enabled: isNumber(companyId),
        select: (data) => {
            return data.data;
        },
    });
}

// request all webhooks of the company
const getWebhooks = async (companyId, search, entity) => {
    const { data } = await JelouApiV1.get(`/companies/${companyId}/webhooks`, {
        params: {
            entity,
            ...(!isEmpty(search) ? { name: search } : {}),
        },
    });
    return data;
};

// Retrieve logs statistics of a single operator
export function useWebhooks({ companyId = "", search = "", entity = "DATUM" }) {
    return useQuery(["getWebhooks", companyId, search, entity], () => getWebhooks(companyId, search, entity), {
        refetchOnWindowFocus: false,
        enabled: isNumber(companyId),
        select: (data) => {
            return data.data;
        },
    });
}
