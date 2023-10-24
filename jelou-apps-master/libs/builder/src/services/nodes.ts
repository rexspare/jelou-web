import axios from "axios";

import { WorkflowAPI } from "@builder/libs/builder.http";
import { OUTPUT_TYPES } from "@builder/modules/OutputTools/domain/contants.output";

export type ExecuteHttpNodeResponse = {
    id: string;
    name: string;
    type: OUTPUT_TYPES;
    initialState: object;
    finalState: object;
};

export const executeHttpNode = async (workflowId: string, nodeId: string, execData: object) => {
    if (!WorkflowAPI) throw new Error("No se ha inicializado el servicio de WorkflowAPI");

    try {
        const { data, status } = await WorkflowAPI.post<{ data: ExecuteHttpNodeResponse }>(`workflows/${workflowId}/nodes/${nodeId}/execute`, execData);

        if (status === 201) return data.data;

        throw new Error("Tuvimos un error al ejecutar la petición, por favor intentelo de nuevo");
    } catch (reason) {
        if (axios.isAxiosError(reason)) throw reason.message;

        const error = reason as Error;
        throw error.message;
    }
};
