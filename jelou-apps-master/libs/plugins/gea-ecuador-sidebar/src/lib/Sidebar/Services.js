import { JelouApiPma } from "@apps/shared/modules";
import axios from "axios";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";

const assitanceRecordcredentantials = btoa("wNiW8G9429qFI5UhrYi1gfmP0GQ9Am3V" + ":" + "9k8FEJ0ImcE0fF7SaHDdTGWgHgY0t98fFCEZdn6OeZgdnaoe1OAwE7QxhZDFhBoq");

export const GEA_Service = axios.create({
    baseURL: "https://api.geainternacional.com/ec/v1/",
    headers: {
        "Content-Type": "application/json",
    },
});

export const GEA_Logs_API = axios.create({
    baseURL: "https://api.jelou.ai/v1/companies/",
    headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${assitanceRecordcredentantials}`,
    },
});

const UserException = function (message) {
    this.message = message;
    this.name = "UserException";
};

export const updateStoredParams = async (company, urlParams, storedParams) => {
    const { appId, senderId } = urlParams;
    const { clientId, clientSecret } = company;
    const auth = {
        username: clientId,
        password: clientSecret,
    };
    const params = {
        ...storedParams,
    };
    try {
        await JelouApiPma.post(`/v1/bots/${appId}/users/${senderId.replace("@c.us", "")}/storedParams/legacy`, params, {
            auth,
        });
    } catch (error) {
        console.log(error.response, "error");
    }
};

export const getToken = () => {
    const config = {
        client_id: 34,
        client_secret: "8Nxwtnhyj1IutqM11sru2zSwiGgtKGnu",
    };

    return GEA_Service.post("auth/token", config, {}).then(({ data: { data } }) => {
        const accessToken = get(data, "access_token", null);
        const expiration = get(data, "expires_in", null);

        const payload = {
            accessToken,
            expiration,
        };
        return payload;
    });
};

export const sendContactField = async (params) => {
    const id_asistencia = get(params, "id_asistencia", null);
    const id_respuesta = get(params, "id_respuesta_contacto", null);

    try {
        await GEA_Service.post(`chatbot/asistencia/${id_asistencia}/contacto`, {
            respuesta_usuario: id_respuesta.toString(), // Number, // 0: sin Respuesta 1: Si, 2: No
        });
    } catch (error) {
        if (error.response.status == 404 && !get(error.response, "data.noticias.mensaje", false)) {
            throw new UserException("clientError");
        } else {
            const messageError = get(error.response, "data.noticias.mensaje", "");
            throw new UserException(messageError);
        }
    }
};

export const sendTerminoField = async (params) => {
    const id_asistencia = get(params, "id_asistencia", null);
    const id_respuesta = get(params, "id_respuesta_termino", null);

    try {
        await GEA_Service.post(`chatbot/asistencia/${id_asistencia}/termino`, {
            respuesta_usuario: id_respuesta.toString(), // Number, // 0: sin Respuesta 1: Si, 2: No
        });
    } catch (error) {
        if (error.response.status == 404 && !error.response.noticias) {
            throw new UserException("clientError");
        } else {
            const messageError = get(error.response, "data.noticias.mensaje", "Ha ocurrido un error inesperado. Puede intentar nuevamente o comunicarse con el equipo de soporte.");
            throw new UserException(messageError);
        }
    }
};

export const updateAssitanceRecordContact = async (params) => {
    const id_asistencia = get(params, "id_asistencia", null);
    const id_expediente = get(params, "id_expediente", null);
    const id_respuesta = get(params, "id_respuesta_contacto", null);
    //get unix timestamp
    const fecha_unix = Math.floor(Date.now() / 1000);
    let messageError = "unknown error";
    await JelouApiPma.patch(
        `v1/companies/124/databases/76/rows/${id_asistencia}`,
        {
            recordId: id_expediente.toString(),
            supplierContact: id_respuesta.toString(),
            updatedAt: fecha_unix.toString(),
        },
        {
            headers: {
                Authorization: `Basic ${assitanceRecordcredentantials}`,
            },
        }
    ).catch((error) => {
        const { response } = error;
        const { data } = response;
        if (data == "Unauthorized") {
            messageError = "unauthorized";
            throw new UserException(messageError);
        } else {
            const { error } = data;
            messageError = get(error, "clientMessages.es", "Ha ocurrido un error inesperado");
            throw new UserException(messageError);
        }
    });
};
export const updateAssitanceRecordTermino = async (params) => {
    const id_asistencia = get(params, "id_asistencia", null);
    const id_expediente = get(params, "id_expediente", null);
    const id_respuesta = get(params, "id_respuesta_termino", null);
    //get unix timestamp
    const fecha_unix = Math.floor(Date.now() / 1000);
    let messageError = "unknown error";
    await JelouApiPma.patch(
        `v1/companies/124/databases/76/rows/${id_asistencia}`,
        {
            recordId: id_expediente.toString(),
            supplierEnd: id_respuesta.toString(),
            updatedAt: fecha_unix.toString(),
        },
        {
            headers: {
                Authorization: `Basic ${assitanceRecordcredentantials}`,
            },
        }
    )
        .then(({ data }) => {
            console.log("data", data);
        })
        .catch((error) => {
            const { response } = error;
            const { data } = response;
            if (data == "Unauthorized") {
                messageError = "unauthorized";
                throw new UserException(messageError);
            } else {
                const { error } = data;
                messageError = get(error, "clientMessages.es", "Ha ocurrido un error inesperado");
                throw new UserException(messageError);
            }
        });
};

export const updateCacheStoreParams = async (params) => {
    const appId = get(params, "appId", null);
    const senderId = get(params, "senderId", null);
    const paramToUpdate = get(params, "paramToUpdate", {});
    try {
        await JelouApiPma.post(`/v1/bots/${appId}/users/${senderId}/cache`, {
            params: paramToUpdate,
        });
    } catch (error) {
        console.log("error", error);
    }
};

export const getGeaLogs = async (params) => {
    const { id_asistencia, companyId } = params;
    let messageError = "unknown error";
    try {
        const data = await GEA_Logs_API.get(`/${companyId}/databases/76/rows/${id_asistencia}`);
        return data.data;
    } catch (error) {
        const { response } = error;
        const validationError = get(response, "data.validationError", {});
        const rowIdError = get(validationError, "rowId", []);
        if (!isEmpty(rowIdError)) {
            // id_asistencia is not registered in GEA logs (Bitacora)
            return {}; // We return an empty object to not block the flow
        }

        const { data } = response;
        if (data == "Unauthorized") {
            messageError = "unauthorized";
            throw new UserException(messageError);
        } else {
            const { error } = data;
            console.log("error line 255", error);
            messageError = get(error, "clientMessages.es", "Ha ocurrido un error inesperado");
            throw new UserException(messageError);
        }
    }
};

export const createAssistanceGEALogs = async (botId, companyId, params) => {
    const { assistanceId } = params;
    try {
        const response = await GEA_Logs_API.post(`/${companyId}/databases/76/rows?id=${assistanceId}`, {
            ...params,
            id: assistanceId,
            botId,
        });
        return response.data;
    } catch (error) {
        console.log("error", error);
    }
};
