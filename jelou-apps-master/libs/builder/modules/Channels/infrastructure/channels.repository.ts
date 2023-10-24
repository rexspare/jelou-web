import { WorkflowAPI } from "@builder/libs/builder.http";
import { Repository } from "@builder/shared/handleErrorRepositories";
import { Channel, IChannelRepository } from "../domain/channels.domain";

type Respoponse<T> = {
    status: string;
    message: string;
    data: T;
};

const MESSAGE_ERRORS = {
    GET_ALL_CHANNELS: "Tuvimos un error al obtener la lista de los channels, por favor refresque la página e intente nuevamente",
    GET_ONE_CHANNEL: "Tuvimos un error al obtener el channel, por favor refresque la página",
    CREATE_CHANNEL: "Tuvimos un error al crear el channel, por favor refresque la página",
    EDIT_CHANNEL: "Tuvimos un error al editar el channel, por favor refresque la página",
    DELETE_CHANNEL: "Tuvimos un error al eliminar el channel, por favor refresque la página",
};

export class ChannelRepository extends Repository implements IChannelRepository {
    async createChannel(id: number, channel: string) {
        if (WorkflowAPI === null) throw new Error("No se ha inicializado el API de Workflows");

        try {
            const { data, status } = await WorkflowAPI.post<Respoponse<Channel>>(`/skills/${id}/channels`, {
                type: channel,
            });

            if (status === this.STATUS_CODE.CREATED) return data.data;

            throw new Error(MESSAGE_ERRORS.CREATE_CHANNEL);
        } catch (error) {
            throw new Error(this.getMessageError(error, MESSAGE_ERRORS.CREATE_CHANNEL));
        }
    }
}
