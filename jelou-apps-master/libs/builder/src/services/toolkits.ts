import type { Tool, Toolkit, Toolkits, Tools } from "../pages/Home/ToolKits/types.toolkits";

import axios from "axios";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import ow from "ow";

import { WorkflowAPI } from "../libs/builder.http";

export const getAllToolkits = async (): Promise<Toolkits> => {
    if (WorkflowAPI === null) throw new Error("No se ha inicializado el API de Workflows");

    try {
        const { data, status } = await WorkflowAPI.get("/toolkits");

        if (status === 200) return data.data;

        throw new Error("Tuvimos un error al obtener la lista de los toolkits, por favor refresque la página");
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error("Tuvimos un error al obtener la lista de los toolkits, por favor refresque la página");
        }
        throw error;
    }
};

export const getAllToolsByToolkit = async (id: string): Promise<Tools> => {
    if (WorkflowAPI === null) throw new Error("No se ha inicializado el API de Workflows");

    ow(id, ow.string.nonEmpty.message("El id del toolkit es requerido"));

    try {
        const { data, status } = await WorkflowAPI.get(`/toolkits/${id}/tools`);

        if (status === 200) return data.data;

        throw new Error("Tuvimos un error al obtener la lista de los tools, por favor refresque la página");
    } catch (error) {
        console.error("error al obtener los tools", { error });
        if (axios.isAxiosError(error)) {
            throw new Error("Tuvimos un error al obtener la lista de los tools, por favor refresque la página");
        }
        throw error;
    }
};

export const getAllMyToolsPublished = async (): Promise<Tools> => {
    if (WorkflowAPI === null) throw new Error("No se ha inicializado el API de Workflows");

    try {
        const { data, status } = await WorkflowAPI.get(`/tools?privacy=private`);

        if (status === 200) return data.data;

        throw new Error("Tuvimos un error al obtener la lista de los tools, por favor refresque la página");
    } catch (error) {
        console.error("error al obtener los tools", { error });
        if (axios.isAxiosError(error)) {
            throw new Error("Tuvimos un error al obtener la lista de los tools, por favor refresque la página");
        }
        throw error;
    }
};

export const getToolkitById = async (toolkitId: string, toolId: string): Promise<Tool> => {
    if (WorkflowAPI === null) throw new Error("No se ha inicializado el API de Workflows");

    ow(toolkitId, ow.string.nonEmpty.message("El id del toolkit es requerido"));
    ow(toolId, ow.string.nonEmpty.message("El id del tool es requerido"));

    try {
        const { data, status } = await WorkflowAPI.get(`/toolkits/${toolkitId}/tools/${toolId}`);

        if (status === 200) return data.data;

        throw new Error("Tuvimos un error al obtener la lista de los tools, por favor intente nuevamente refrescando la página");
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error("Tuvimos un error al obtener la lista de los tools, por favor intente nuevamente refrescando la página");
        }
        throw error;
    }
};

export const createToolkit = async (toolkit: Partial<Toolkit>): Promise<Toolkit> => {
    if (WorkflowAPI === null) throw new Error("No se ha inicializado el API de Workflows");

    ow(toolkit, ow.object.nonEmpty.message("El toolkit es requerido"));

    try {
        const { data, status } = await WorkflowAPI.post("/toolkits", toolkit);

        if (status === 201) return data.data;

        throw new Error("Tuvimos un error al crear el toolkit, por favor intente nuevamente refrescando la página");
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error("Tuvimos un error al crear el toolkit, por favor intente nuevamente refrescando la página");
        }
        throw error;
    }
};

export const editToolkit = async (toolkitId: number, toolkitData: Partial<Toolkit>): Promise<Toolkit> => {
    if (WorkflowAPI === null) throw new Error("No se ha inicializado el API de Workflows");

    ow(toolkitId, ow.number.message("El id del toolkit es requerido"));
    ow(toolkitData, ow.object.nonEmpty.message("El toolkit es requerido"));

    try {
        const { data, status } = await WorkflowAPI.patch(`/toolkits/${toolkitId}`, toolkitData);

        if (status === 200) return data;

        throw new Error("Tuvimos un error al editar el toolkit, por favor intente nuevamente refrescando la página");
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error("Tuvimos un error al editar el toolkit, por favor intente nuevamente refrescando la página");
        }
        throw error;
    }
};

export const deleteToolkit = async (toolkitId: number): Promise<Toolkit> => {
    if (WorkflowAPI === null) throw new Error("No se ha inicializado el API de Workflows");

    ow(toolkitId, ow.number.message("El id del toolkit es requerido"));

    try {
        const { data, status } = await WorkflowAPI.delete(`/toolkits/${toolkitId}`);

        if (status === 200) return data;

        throw new Error("Tuvimos un error al eliminar el toolkit, por favor intente nuevamente refrescando la página");
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error("Tuvimos un error al eliminar el toolkit, por favor intente nuevamente refrescando la página");
        }
        throw error;
    }
};
