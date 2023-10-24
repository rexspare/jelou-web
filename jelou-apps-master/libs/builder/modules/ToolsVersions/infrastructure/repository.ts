import type { Version } from "../domain/versions.domain";

import axios from "axios";

import { WorkflowAPI } from "@builder/libs/builder.http";

export const getAllVersions = async (toolkitId: string, toolId: string): Promise<Version[]> => {
    if (WorkflowAPI === null) throw new Error("No se ha inicializado el API de Workflows");

    try {
        const { data, status } = await WorkflowAPI.get(`/toolkits/${toolkitId}/tools/${toolId}/versions?privacy=private`);

        if (status === 200) return data.data;

        throw new Error("Tuvimos un error al obtener el listado de versiones, por favor refresque la página");
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error("Tuvimos un error al obtener el listado de versiones, por favor refresque la página");
        }
        throw error;
    }
};

export const publishVersion = async (toolkitId: string, toolId: string, versionData: Partial<Version>): Promise<Version> => {
    if (WorkflowAPI === null) throw new Error("No se ha inicializado el API de Workflows");

    try {
        const { data, status } = await WorkflowAPI.post(`/toolkits/${toolkitId}/tools/${toolId}/publish`, versionData);

        if (status === 201) return data.data;

        throw new Error("Tuvimos un error al obtener el listado de versiones, por favor refresque la página");
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error("Tuvimos un error al obtener el listado de versiones, por favor refresque la página");
        }
        throw error;
    }
};
