import { WorkflowAPI } from "@builder/libs/builder.http";
import { Repository } from "@builder/shared/handleErrorRepositories";
import { INodeRepository } from "../domain/node.respository";
import { CreateServerNode, ServerNode } from "../domain/nodes";

export class NodeRepository extends Repository implements INodeRepository {
    public ERROR_MESSAGES = {
        CREATE: "Tuvimos un error al intentar crear el nodo, por favor intente nuevamente refrescando la página. Si el error persiste, por favor contacte a soporte",
        GET_ALL: "Tuvimos un error al intentar obtener todos los nodos, por favor intente nuevamente recargando la página. Si el error persiste, por favor contacte a soporte",
        DELETE: "Tuviemos un error al intentar eliminar el nodo, por favor intente nuevamente recargando la página. Si el error persiste, por favor contacte a soporte",
    };

    constructor(private readonly workflowId: string) {
        super();
    }

    public async getAll(): Promise<ServerNode[]> {
        if (WorkflowAPI === null) throw new Error("No se ha inicializado el API de Workflows");

        try {
            const { data, status } = await WorkflowAPI.get<{ data: ServerNode[] }>(`/workflows/${this.workflowId}/nodes`);

            if (status === this.STATUS_CODE.OK) return data.data;

            throw new Error(this.ERROR_MESSAGES.GET_ALL);
        } catch (error) {
            throw new Error(this.getMessageError(error, this.ERROR_MESSAGES.GET_ALL));
        }
    }

    public async create(node: CreateServerNode): Promise<ServerNode> {
        if (WorkflowAPI === null) throw new Error("No se ha inicializado el API de Workflows");

        try {
            const { data, status } = await WorkflowAPI.post<{ data: ServerNode }>(`/workflows/${this.workflowId}/nodes`, node);

            if (status === this.STATUS_CODE.CREATED) return data.data;

            throw new Error(this.ERROR_MESSAGES.CREATE);
        } catch (error) {
            throw new Error(this.getMessageError(error, this.ERROR_MESSAGES.CREATE));
        }
    }

    public async delete(nodeId: string): Promise<string> {
        if (WorkflowAPI === null) throw new Error("No se ha inicializado el API de Workflows");

        try {
            const { status } = await WorkflowAPI.delete(`/workflows/${this.workflowId}/nodes/${nodeId}`, {
                params: { includeEdges: true },
            });

            if (status === this.STATUS_CODE.OK) return nodeId;

            throw new Error(this.ERROR_MESSAGES.DELETE);
        } catch (error) {
            throw new Error(this.getMessageError(error, this.ERROR_MESSAGES.DELETE));
        }
    }

    public async update(node: Partial<CreateServerNode>, nodeId: string): Promise<ServerNode> {
        if (WorkflowAPI === null) throw new Error("No se ha inicializado el API de Workflows");

        try {
            const { data, status } = await WorkflowAPI.patch<{ data: ServerNode }>(`/workflows/${this.workflowId}/nodes/${nodeId}`, node);

            if (status === this.STATUS_CODE.OK) return data.data;

            throw new Error(this.ERROR_MESSAGES.CREATE);
        } catch (error) {
            throw new Error(this.getMessageError(error, this.ERROR_MESSAGES.CREATE));
        }
    }
}
