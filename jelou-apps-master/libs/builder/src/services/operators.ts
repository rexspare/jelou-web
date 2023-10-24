import { JelouApiV1 } from "@apps/shared/modules";
import type { Operator } from "./types.services";

import axios from "axios";

const ERROR_MESSAGES = "Tuvimos un error al obtener la lista de los equipos, por favor refresque la página";

export const getAllOperatorsForCompany = async (companyId: string | number): Promise<Operator[]> => {
    try {
        const { data, status } = await JelouApiV1.get(`/companies/${companyId}/operators`);

        if (status === 200) return data;

        throw new Error(ERROR_MESSAGES);
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const messageError = error?.response?.data?.message || ERROR_MESSAGES;
            throw new Error(messageError);
        }
        throw error;
    }
};
