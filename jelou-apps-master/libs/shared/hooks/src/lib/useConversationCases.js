import { JelouApiV1 } from "@apps/shared/modules";
import { useQuery } from "@tanstack/react-query";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import dayjs from "dayjs";

const TODAY = [dayjs().startOf("day").format(), dayjs().endOf("day").format()];

const stopEvents = (date) => {
    const initialDate = date[0];
    const finalDate = date[1];
    const todayInitial = TODAY[0];
    const todayFinal = TODAY[1];
    const isEqual = initialDate === todayInitial && finalDate === todayFinal;
    if (!isEqual) {
        return true;
    }
    return false;
};

const conversationCases = async (company, operator, dataConfig) => {
    try {
        const { id } = company;
        const operatorId = get(operator, "id");
        const page = get(dataConfig, "page");
        const date = get(dataConfig, "date", []);
        const [startAt, endAt] = date;
        const limit = get(dataConfig, "limit");
        const stop = stopEvents(date);

        const { data } = await JelouApiV1.get(`/company/${id}/conversations`, {
            params: {
                page,
                limit,
                operatorId,
                startAt,
                endAt,
                ...(stop ? {} : { event: "active" }),
            },
        });
        return data;
    } catch (error) {
        console.log("error ", error);
    }
};

export function useConversationCases(company, operatorId, dataConfig) {
    return useQuery(["conversationCases", company, operatorId, dataConfig], () => conversationCases(company, operatorId, dataConfig), {
        staleTime: 10 * 60 * 1000,
        enabled: !isEmpty(company) && !isEmpty(operatorId),
        refetchOnWindowFocus: false,
        select: (data) => {
            const { results, pagination } = data;
            const date = get(dataConfig, "date", []);
            const initialDate = date[0];
            const todayInitial = TODAY[0];
            const stop = stopEvents(date);

            let filteredConversation =
                initialDate === todayInitial ? results : stop ? results : results.filter((convesations) => convesations.status === "ACTIVE");

            if (!isEmpty(filteredConversation)) {
                filteredConversation.map((conv) => {
                    return (conv.id = conv._id);
                });
            }

            return { results: filteredConversation, pagination };
        },
    });
}
