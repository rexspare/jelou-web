import axios from "axios";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import ow from "ow";

import { IA_API, WorkflowAPI } from "../libs/builder.http";

/**
 * Function to get all tools by toolkit
 * @param {string} id - toolkit id
 * @returns {Promise<Tools>} - all tools by toolkit
 */

export const getAllToolsByToolkit = async (id) => {
    try {
        const { data, status } = await WorkflowAPI.get(`/toolkits/${id}/tools`);

        if (status === 200) return data.data;

        throw new Error("Tuvimos un error al obtener la lista de los tools, por favor refresque la página").message;
    } catch (error) {
        console.error("error al obtener los tools", { error });
        if (axios.isAxiosError(error)) throw error.message;
        throw error?.message || String(error?.name);
    }
};

/**
 * Function to create one tool
 * @param {string} toolkitId - toolkit id
 * @param {Tool} tool - tool data to create
 * @returns {Promise<Tool>} - tool created
 */

export const createTool = async (toolkitId, tool) => {
    try {
        const { data, status } = await WorkflowAPI.post(`/toolkits/${toolkitId}/tools`, tool);

        if (status === 201) return data.data;

        throw new Error("Tuvimos un error al crear el tool, por favor refresque la página").message;
    } catch (error) {
        console.error("error al crear el tool", { error });
        if (axios.isAxiosError(error)) throw error.message;
        throw error?.message || String(error?.name);
    }
};

/**
 * Function to create one tool
 * @param {Tool} tool - tool data to create
 * @returns {Promise<import("../pages/Home/Tools/types.tools").IAWorkflow>} - tool created
 */

export const createIATool = async (tool) => {
    try {
        const { data } = await IA_API.post("/create-tool", tool);

        return data;
    } catch (error) {
        console.error("error al crear el tool con IA", { error });
        if (axios.isAxiosError(error)) throw error.message;
        throw error?.message || String(error?.name);
    }
};

/**
 * Function to create one tool
 * @param {string} toolkitId - toolkit id
 * @param {Tool} tool - tool data to create
 * @returns {Promise<Tool>} - tool created
 */

export const generateToolFromIA = async (toolkitId, tool) => {
    try {
        const { data, status } = await WorkflowAPI.post(`/toolkits/${toolkitId}/tools/generate`, tool);

        if (status === 201) return data.data;

        throw new Error("Tuvimos un error al generar el tool con IA, por favor refresque la página").message;
    } catch (error) {
        console.error("error al generar el tool con IA", { error });
        if (axios.isAxiosError(error)) throw error.message;
        throw error?.message || String(error?.name);
    }
};

/**
 * Function to edit one tool
 * @param {string} toolkitId - toolkit id
 * @param {string} toolId - tool id
 * @param {Tool} tool - tool data to edit
 * @returns {Promise<Tool>} - tool edited
 */

export const editTool = async (toolkitId, toolId, tool) => {
    try {
        const { data } = await WorkflowAPI.patch(`/toolkits/${toolkitId}/tools/${toolId}`, tool);

        return data.data;

        // throw new Error("Tuvimos un error al editar el tool, por favor refresque la página").message;
    } catch (error) {
        console.error("error al editar el tool", { error });
        if (axios.isAxiosError(error)) throw error.message;
        throw error?.message || String(error?.name);
    }
};

/**
 * Function to delete one tool
 * @param {string} toolkitId - toolkit id
 * @param {string} toolId - tool data to delete
 * @returns {Promise<Tool>} - tool deleted
 */

export const deleteTool = async (toolkitId, toolId) => {
    try {
        const { data, status } = await WorkflowAPI.delete(`/toolkits/${toolkitId}/tools/${toolId}`);

        if (status === 200) return data.data;

        throw new Error("Tuvimos un error al eliminar el tool, por favor refresque la página").message;
    } catch (error) {
        console.error("error al eliminar el tool", { error });
        if (axios.isAxiosError(error)) throw error.message;
        throw error?.message || String(error?.name);
    }
};

export class ToolExecutionRepository {
    static async execute(toolkitId, toolId, execData) {
        ow(toolkitId, ow.string.nonEmpty.message("El id del toolkit no puede estar vacío"));
        ow(toolId, ow.string.nonEmpty.message("El id del tool no puede estar vacío"));

        try {
            const { data, status } = await WorkflowAPI.post(`/toolkits/${toolkitId}/tools/${toolId}/execute`, execData, {
                params: {
                    debug: true,
                },
            });

            if (status === 201) return data.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const erroMessage = error?.response?.data?.message || "Tuvimos un error al ejecutar este tool, por favor refresque la página e intente nuevamente";

                const status = error?.response?.status;

                if (status === 422) {
                    throw new Error("El tool no tiene los datos necesarios para ejecutarse. Por favor verifique los datos ingresados");
                }
                throw new Error(erroMessage);
            }

            throw error;
        }
    }

    static async getLogs(id) {
        ow(id, ow.string);
        ow(id, ow.string.nonEmpty.message("El id del toolkit no puede estar vacío"));

        try {
            const { data, status } = await WorkflowAPI.get(`/executions/${id}/nodes`);

            if (status === 200) return data.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const erroMessage = "Tuvimos un error al recuperar los logs de ejecución, por favor refresque la página e intente nuevamente";
                throw new Error(erroMessage);
            }
            throw error;
        }
    }
}
