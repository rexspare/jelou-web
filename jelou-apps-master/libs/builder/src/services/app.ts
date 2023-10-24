import axios from "axios";

import { JelouApiV1 } from "@apps/shared/modules";
import { WorkflowAPI } from "../libs/builder.http";
import { Company, CompanySettings, Media } from "./types.services";

export const bootstrapApp = async (company: Partial<Company>): Promise<Company> => {
    if (WorkflowAPI === null) throw new Error("No se ha inicializado el API de Workflows");

    try {
        const { data, status } = await WorkflowAPI.post("/bootstrap", company);

        if (status === 201) return data.data;

        throw new Error("Tuvimos un error al crear la app para la compañia, por favor intente nuevamente refrescando la página");
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error("Tuvimos un error al crear la app para la compañia, por favor intente nuevamente refrescando la página");
        }
        throw error;
    }
};

export const saveCompanySettings = async (companySettings: CompanySettings): Promise<Company> => {
    try {
        const { data, status } = await JelouApiV1.post("/settings", companySettings);

        if (status === 200) return data.data;

        throw new Error("Tuvimos un error al crear la app para la compañia, por favor intente nuevamente refrescando la página");
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error("Tuvimos un error al crear la app para la compañia, por favor intente nuevamente refrescando la página");
        }
        throw error;
    }
};

export const deleteMediaToApp = async (mediaId: number): Promise<void> => {
    if (WorkflowAPI === null) throw new Error("No se ha inicializado el API de Workflows");

    try {
        const { data } = await WorkflowAPI.delete(`/media/${mediaId}`);
        return data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error("Tuvimos un error al asociar este archivo de media con la compañía, por favor intente nuevamente refrescando la página");
        }
        throw error;
    }
};

export const attachMediaToApp = async (media: Media): Promise<void> => {
    if (WorkflowAPI === null) throw new Error("No se ha inicializado el API de Workflows");

    try {
        const { data } = await WorkflowAPI.post("/media", media);

        return data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error("Tuvimos un error al asociar este archivo de media con la compañía, por favor intente nuevamente refrescando la página");
        }
        throw error;
    }
};

export const getMediaFromApp = async (modelId: string, modelType: string): Promise<Media[]> => {
    if (WorkflowAPI === null) throw new Error("No se ha inicializado el API de Workflows");

    try {
        const { data, status } = await WorkflowAPI.get(`/media?modelId=${modelId}&modelType=${modelType}`);

        if (status === 200) return data.data;

        throw new Error("Tuvimos un error al obtener los archivos de media de la compañía, por favor intente nuevamente refrescando la página");
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error("Tuvimos un error al obtener los archivos de media de la compañía, por favor intente nuevamente refrescando la página");
        }
        throw error;
    }
};
