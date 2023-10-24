import { JelouApiV1 } from "@apps/shared/modules";
import type { Team } from "./types.services";

import axios from "axios";

const ERROR_MESSAGES = "Tuvimos un error al obtener la lista de los equipos, por favor refresque la página";

export const getAllTeamForCompany = async (companyId: string | number): Promise<Team[]> => {
    try {
        const { data, status } = await JelouApiV1.get(`/companies/${companyId}/teams`, {
            params: {
                limit: 200,
            },
        });

        if (status === 200) return data.results || [];

        throw new Error(ERROR_MESSAGES);
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const messageError = error?.response?.data?.message || ERROR_MESSAGES;
            throw new Error(messageError);
        }
        throw error;
    }
};
