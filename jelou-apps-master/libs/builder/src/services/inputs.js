import ow from "ow";

import { isAxiosError } from "axios";
import { WorkflowAPI } from "../libs/builder.http";

export class InputsRepository {
    /**
     * Create a new input
     * @param {Partial<Input>} input
     * @param {string} toolkitId - id of toolkit
     * @param {string} toolId - id od tool
     * @returns {Promise<Input>} created input
     */
    static async create(input, toolkitId, toolId) {
        ow(input, ow.object.nonEmpty.message("El toolkit es requerido"));
        ow(toolkitId, ow.string.nonEmpty.message("El toolkit ID es requerido"));
        ow(toolId, ow.string.nonEmpty.message("El tool ID es requerido"));

        try {
            const { data, status } = await WorkflowAPI.post(`/toolkits/${toolkitId}/tools/${toolId}/inputs`, input);

            if (status === 201) return data.data;
        } catch (error) {
            if (isAxiosError(error)) {
                throw new Error("Tuvimos un error al crear este input, por favor intente nuevamente resfrescando la página o comuníquese con un asesor");
            }
            throw error;
        }
    }

    /**
     * Update a input
     * @param {Partial<Input>} input - input to update
     * @param {string} toolkitId - id of toolkit
     * @param {string} toolId - id of tool
     * @param {string} inputId - id of input
     * @returns {Promise<void>} updated input
     */
    static async update(input, toolkitId, toolId, inputId) {
        ow(input, ow.object.nonEmpty.message("El toolkit es requerido"));
        ow(toolkitId, ow.string.nonEmpty.message("El toolkit ID es requerido"));
        ow(toolId, ow.string.nonEmpty.message("El tool ID es requerido"));
        ow(inputId, ow.string.nonEmpty.message("El input ID es requerido"));

        try {
            const { data, status } = await WorkflowAPI.patch(`/toolkits/${toolkitId}/tools/${toolId}/inputs/${inputId}`, input);

            if (status === 200) return data.data;
        } catch (error) {
            if (isAxiosError(error)) {
                throw new Error("Tuvimos un error al actualizar este input, por favor intente nuevamente resfrescando la página o comuníquese con un asesor");
            }
            throw error;
        }
    }

    static async delete(toolkitId, toolId, inputId) {
        ow(toolkitId, ow.string.nonEmpty.message("El toolkit ID es requerido"));
        ow(toolId, ow.string.nonEmpty.message("El tool ID es requerido"));
        ow(inputId, ow.string.nonEmpty.message("El input ID es requerido"));

        try {
            const { status } = await WorkflowAPI.delete(`/toolkits/${toolkitId}/tools/${toolId}/inputs/${inputId}`);

            if (status === 200) return true;
        } catch (error) {
            if (isAxiosError(error)) {
                throw new Error("Tuvimos un error al eliminar este input, por favor intente nuevamente resfrescando la página o comuníquese con un asesor");
            }
            throw error;
        }
    }
}
