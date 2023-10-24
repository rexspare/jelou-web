// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import ow from "ow";

import { WorkflowAPI } from "@builder/libs/builder.http";
import { IOutputsRepository, Output } from "@builder/modules/OutputTools/domain/outputs.domain";
import { Repository } from "@builder/shared/handleErrorRepositories";

export class OutputsRepository extends Repository implements IOutputsRepository {
    public ERROR_MESSAGES = {
        CREATE: "Tuvimos un error al intentar crear el output, por favor intente nuevamente refrescando la página",
        UPDATE: "Tuvimos un error al intentar actualizar el output, por favor intente nuevamente refrescando la página",
        DELETE: "Tuviemos un error al intentar eliminar el output, por favor intente nuevamente recargando la página",
    };

    public constructor(private readonly toolkitId: string, private readonly toolId: string) {
        super();
    }

    public async create(output: Partial<Output>): Promise<Output> {
        if (WorkflowAPI === null) throw new Error("No se ha inicializado el API de Workflows");

        ow(output, ow.object.nonEmpty.message("El output es requerido"));

        try {
            const { data, status } = await WorkflowAPI.post(`/toolkits/${this.toolkitId}/tools/${this.toolId}/outputs`, output);

            if (status === this.STATUS_CODE.CREATED) return data.data;

            throw new Error(this.ERROR_MESSAGES.CREATE);
        } catch (error) {
            throw new Error(this.getMessageError(error, this.ERROR_MESSAGES.CREATE));
        }
    }

    public async update(outputId: string, output: Partial<Output>): Promise<Output> {
        if (WorkflowAPI === null) throw new Error("No se ha inicializado el API de Workflows");

        ow(output, ow.object.nonEmpty.message("El toolkit es requerido"));
        ow(outputId, ow.string.nonEmpty.message("El output ID es requerido"));

        try {
            const { data, status } = await WorkflowAPI.patch(`/toolkits/${this.toolkitId}/tools/${this.toolId}/outputs/${outputId}`, output);

            if (status === this.STATUS_CODE.OK) return data.data;

            throw new Error(this.ERROR_MESSAGES.UPDATE);
        } catch (error) {
            throw new Error(this.getMessageError(error, this.ERROR_MESSAGES.UPDATE));
        }
    }

    public async delete(outputId: string) {
        if (WorkflowAPI === null) throw new Error("No se ha inicializado el API de Workflows");

        ow(outputId, ow.string.nonEmpty.message("El output ID es requerido"));

        try {
            const { status } = await WorkflowAPI.delete(`/toolkits/${this.toolkitId}/tools/${this.toolId}/outputs/${outputId}`);

            if (status === this.STATUS_CODE.OK) return outputId;

            throw new Error(this.ERROR_MESSAGES.DELETE);
        } catch (error) {
            throw new Error(this.getMessageError(error, this.ERROR_MESSAGES.DELETE));
        }
    }
}
