import type { EdgeRepository as IEdgeRepository } from "../domain/edgeRepository";

import { WorkflowAPI } from "@builder/libs/builder.http";
import { Repository } from "@builder/shared/handleErrorRepositories";
import { CreateEdge, EdgesServer } from "../domain/edge";

export class EdgeRepository extends Repository implements IEdgeRepository {
    public ERROR_MESSAGES = {
        CREATE: "Tuvimos un error al intentar crear el edge, por favor intente nuevamente refrescando la página",
        GET_ALL: "Tuvimos un error al intentar obtener todos las edges, por favor intente nuevamente recargando la página",
        DELETE: "Tuviemos un error al intentar eliminar el edge, por favor intente nuevamente recargando la página",
    };

    constructor(private readonly workflowId: string) {
        super();
    }

    async create(edge: CreateEdge): Promise<EdgesServer> {
        if (WorkflowAPI === null) throw new Error("No se ha inicializado el API de Workflows");

        try {
            const { data, status } = await WorkflowAPI.post(`/workflows/${this.workflowId}/edges`, edge);

            if (status === this.STATUS_CODE.CREATED) return data.data;

            throw new Error(this.ERROR_MESSAGES.CREATE);
        } catch (error) {
            throw new Error(this.getMessageError(error, this.ERROR_MESSAGES.CREATE));
        }
    }

    async getAll(): Promise<EdgesServer[]> {
        if (WorkflowAPI === null) throw new Error("No se ha inicializado el API de Workflows");

        try {
            const { data, status } = await WorkflowAPI.get(`/workflows/${this.workflowId}/edges`);

            if (status === this.STATUS_CODE.OK) return data.data;

            throw new Error(this.ERROR_MESSAGES.GET_ALL);
        } catch (error) {
            throw new Error(this.getMessageError(error, this.ERROR_MESSAGES.GET_ALL));
        }
    }

    async delete(edgeId: string): Promise<string> {
        if (WorkflowAPI === null) throw new Error("No se ha inicializado el API de Workflows");

        try {
            const { status } = await WorkflowAPI.delete(`/workflows/${this.workflowId}/edges/${edgeId}`);

            if (status === this.STATUS_CODE.OK) return edgeId;

            throw new Error(this.ERROR_MESSAGES.DELETE);
        } catch (error) {
            throw new Error(this.getMessageError(error, this.ERROR_MESSAGES.DELETE));
        }
    }
}
