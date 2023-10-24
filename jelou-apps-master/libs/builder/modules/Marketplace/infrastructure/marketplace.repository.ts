import { WorkflowAPI } from "@builder/libs/builder.http";
import { Repository } from "@builder/shared/handleErrorRepositories";
import { IMarcketplaceToolsRepository, MarcketplaceTools } from "../domin/marketplace.domain";

type Response<T> = {
    status: string;
    message: string;
    data: T;
};

export class MarcketplaceToolsRepository extends Repository implements IMarcketplaceToolsRepository {
    public ERROR_MESSAGES = {
        GET_TOOLS: "Tuvimos un error al obtener los Tools de Marketplace, por favor refresque la página",
        IMPORT_TOOL: "Tuvimos un error al importar los Tools en el Toolkit, por favor refresque la página",
    };

    public async getTools() {
        if (WorkflowAPI === null) throw new Error("No se ha inicializado el API de Workflows");

        try {
            const { data, status } = await WorkflowAPI.get<Response<MarcketplaceTools[]>>("/marketplace/tools?privacy=public");

            if (status === this.STATUS_CODE.OK) return data.data;

            throw new Error(this.ERROR_MESSAGES.GET_TOOLS);
        } catch (error) {
            throw Error(this.getMessageError(error, this.ERROR_MESSAGES.GET_TOOLS));
        }
    }

    public async importTool(version: string, toolkitId: string) {
        if (WorkflowAPI === null) throw new Error("No se ha inicializado el API de Workflows");

        try {
            const { data, status } = await WorkflowAPI.post<Response<MarcketplaceTools>>(`/toolkits/${toolkitId}/tools/import`, { version });

            if (status === this.STATUS_CODE.CREATED) return data.data;

            throw new Error(this.ERROR_MESSAGES.IMPORT_TOOL);
        } catch (error) {
            throw Error(this.getMessageError(error, this.ERROR_MESSAGES.IMPORT_TOOL));
        }
    }
}
