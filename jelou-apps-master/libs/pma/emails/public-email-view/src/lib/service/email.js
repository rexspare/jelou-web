import { JelouApiV1 } from "@apps/shared/modules";
import ow from "ow";

export async function getEmail({ botId, emailId }) {
    try {
        ow(botId, ow.string.nonEmpty);
        ow(emailId, ow.string.nonEmpty);
    } catch (error) {
        console.warn("no tiene las keys", { error });
        throw error;
    }

    try {
        const {
            data: { results },
        } = await JelouApiV1.get(`/bots/${botId}/emails`, {
            params: { sort: "ASC", supportTicketId: emailId },
        });
        return results;
    } catch (error) {
        console.warn("error al obtener el email", { error });
        throw error;
    }
}

export async function getTableRowEmail({ emailId }) {
    try {
        ow(emailId, ow.string.nonEmpty);
    } catch (error) {
        console.warn("no el emailID", { error });
        throw error;
    }

    try {
        const { data } = await JelouApiV1.get(`/support-tickets/${emailId}`);
        return data.data;
    } catch (error) {
        console.warn("error al obtener el email", { error });
        throw error;
    }
}
