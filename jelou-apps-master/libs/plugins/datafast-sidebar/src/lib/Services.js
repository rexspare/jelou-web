import axios from "axios";
import get from "lodash/get";

const FUNCTION_NAME = "ChatBot_RegistrarCaso";
const DF_URL = "https://wsemisores.datafast.com.ec:8083/Servicio.svc?wsdl";

const header = { "content-type": "application/json" };

export const JelouApiV1 = axios.create({
    baseURL: "https://api.jelou.ai",
});

export const getCaseNumber = (data) => {
    const parsed = parseData(data);
    return axios
        .post(
            `https://functions.jelou.ai/datafast/soap`,
            {
                url: DF_URL,
                functionName: FUNCTION_NAME,
                data: parsed,
                // mockResponse: mockResponse
            },
            {
                header,
            }
        )
        .then(({ data }) => {
            const Ticket = get(data, "ChatBot_RegistrarCasoResult.Ticket");
            if (!Ticket) {
                const trace = get(data, "ChatBot_RegistrarCasoResult.Trace", "Error");
                return Promise.reject(trace);
            }
            return Ticket;
        });
};

const parseData = (data) => {
    return {
        RUC: data.RUC,
        Nombre: data.Nombre,
        Apellido: data.Apellido,
        RazonSocial: data.RazonSocial,
        Contacto: data.Contacto,
        Telefono: data.Telefono,
        Celular: data.Celular,
        Direccion: data.Direccion,
        Correo: data.Correo,
        RucEnMora: data.RucEnMora,
        Segmento: data.Segmento,
        MID: data.MID,
        TID: data.TID,
        Horario: data.Horario,
        Descripcion: data.Descripcion,
        CategoriaCRM: data.CategoriaCRM,
        Producto: data.Producto,
        CreaProspecto: data.CreaProspecto,
        Origen: data.Origen,
    };
};
