import { DashboardServer, JelouApiV1 } from "@apps/shared/modules";
import axios from "axios";
import get from "lodash/get";
import { renderMessage as renderToastMessage } from "@apps/shared/common";
import isEmpty from "lodash/isEmpty";

export async function getMsgArchive({ comany_id, startAt, endAt, botId, setLoadingData, setErroData, keyWord, numPage, chooseAsgmtType }) {
    if (!comany_id) {
        console.error("error al optener las ordenes - tokens", { comany_id });
        Promise.reject("Hubo un error con las credenciales, por favor refesque la página e intente nuevamente");
    }

    try {
        setLoadingData(true);
        const { data, status } = await DashboardServer.get(`/companies/${comany_id}/replies?status=${chooseAsgmtType}`, {
            params: {
                startAt,
                endAt,
                botId,
                page: numPage,
                ...(!isEmpty(keyWord) ? { searchBy: "bubble.text", search: keyWord } : {}),
            },
        });

        if (status === 200) {
            setLoadingData(false);
            return data;
        }

        Promise.reject("Tuvimos un error al recuperar las órdenes, por favor intente nuevamente");
    } catch (error) {
        setLoadingData(false);
        const errorResponse = get(error, "response.data.error.clientMessages", null);
        console.log(errorResponse);
        renderToastMessage(errorResponse, "ERROR");
        setErroData(errorResponse);
    }
}

export async function PostMsgArchive({ botId, parentId, setLoadingArchivar, setErrorArchivar, userSession, wordKey }) {
    const { lang } = userSession;
    const dataIn = {
        ...(isEmpty(wordKey) ? { parentId } : { wordKey }),
    };

    try {
        setLoadingArchivar(true);
        const { data, status } = await JelouApiV1.post(`/bots/${botId}/replies/archive_bulk `, dataIn);
        if (status === 200) {
            setLoadingArchivar(false);
            return data;
        }

        Promise.reject("Tuvimos un error al recuperar las órdenes, por favor intente nuevamente");
    } catch (error) {
        setErrorArchivar(error);
        setLoadingArchivar(false);
        if (axios.isAxiosError(error)) {
            const errorMessage = error?.response?.data;
            throw errorMessage;
        }
        throw String(error?.message || error);
    }
}
