import axios from "axios";

import { WorkflowAPI } from "@builder/libs/builder.http";
import { CreateNewVariableParams, Variable, VariableType } from "../pages/Variables/models/variables";

export const getAllVariables = async (workflowId: string) => {
    if (!WorkflowAPI) throw new Error("No se ha especificado el id del flujo de trabajo");
    try {
        const { data, status } = await WorkflowAPI.get<{ data: Variable[] }>(`/workflows/${workflowId}/variables`);

        if (status === 200) return data.data;

        throw new Error("Tuvimos un error al obtener las variables, por favor intente de nuevo refrescando la página");
    } catch (error) {
        if (axios.isAxiosError(error)) throw new Error("Tuvimos un error al obtener las variables, por favor intente de nuevo refrescando la página");

        throw error;
    }
};

const generateQueryParams = (types: VariableType[]) =>
    types.reduce<string>((acc, value, index) => {
        const currentParamSign = index === 0 ? "?" : "&";
        return acc.concat(`${currentParamSign}types[]=${value}`);
    }, "");

export const getVariablesByTypes = async (workflowId: string, types: VariableType[]) => {
    if (!WorkflowAPI) throw new Error("No se ha especificado el id del flujo de trabajo");
    try {
        const { data, status } = await WorkflowAPI.get<{ data: Variable[] }>(`/workflows/${workflowId}/variables${generateQueryParams(types)}`);

        if (status === 200) return data.data;

        throw new Error("Tuvimos un error al obtener las variables, por favor intente de nuevo refrescando la página");
    } catch (error) {
        if (axios.isAxiosError(error)) throw new Error("Tuvimos un error al obtener las variables, por favor intente de nuevo refrescando la página");

        throw error;
    }
};

export const createNewVariable = async (workflowId: string, params: CreateNewVariableParams) => {
    if (!WorkflowAPI) throw new Error("No se ha especificado el id del flujo de trabajo");

    try {
        const { data, status } = await WorkflowAPI.post<{ data: Variable }>(`/workflows/${workflowId}/variables`, {
            ...params,
        });

        if (status === 201) return data.data;

        throw new Error("Tuvimos un error al crear la variable, por favor intente nuevamente refrescando la página");
    } catch (error) {
        if (axios.isAxiosError(error)) throw new Error("Tuvimos un error al crear la variable, por favor intente nuevamente refrescando la página");

        throw error;
    }
};

export const deleteVariable = async (workflowId: string, variableId: string) => {
    if (!WorkflowAPI) throw new Error("No se ha especificado el id del flujo de trabajo");

    try {
        const { data, status } = await WorkflowAPI.delete(`/workflows/${workflowId}/secrets/${variableId}`);

        if (status === 200) return data;

        throw new Error("Tuvimos un error el eliminar la variable, por favor intente de nuevo refrecanso la página");
    } catch (error) {
        if (axios.isAxiosError(error)) throw new Error("Tuvimos un error el eliminar la variable, por favor intente de nuevo refrecanso la página");

        throw error;
    }
};
