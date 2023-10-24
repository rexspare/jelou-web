import { WorkflowAPI } from "@builder/libs/builder.http";
import { Repository } from "@builder/shared/handleErrorRepositories";
import { ISkillsRepository, Skill, SkillCreate } from "../domain/skills.domain";

type Respoponse<T> = {
    status: string;
    message: string;
    data: T;
};

const MESSAGE_ERRORS = {
    GET_ALL_WORKFLOWS: "Tuvimos un error al obtener la lista de los skills, por favor refresque la página e intente nuevamente",
    GET_ONE_WORKFLOW: "Tuvimos un error al obtener el workflow, por favor refresque la página",
    CREATE_WORKFLOW: "Tuvimos un error al crear el workflow, por favor refresque la página",
    EDIT_WORKFLOW: "Tuvimos un error al editar el workflow, por favor refresque la página",
    DELETE_WORKFLOW: "Tuvimos un error al eliminar el workflow, por favor refresque la página",
};

export class SkillsRepository extends Repository implements ISkillsRepository {
    async getAll() {
        if (WorkflowAPI === null) throw new Error("No se ha inicializado el API de Workflows");

        try {
            const { data, status } = await WorkflowAPI.get<Respoponse<Skill[]>>("/skills?disablePagination=true");

            if (status === this.STATUS_CODE.OK) return data.data;

            throw new Error(MESSAGE_ERRORS.GET_ALL_WORKFLOWS);
        } catch (error) {
            throw new Error(this.getMessageError(error, MESSAGE_ERRORS.GET_ALL_WORKFLOWS));
        }
    }

    async getOne(id: number) {
        if (WorkflowAPI === null) throw new Error("No se ha inicializado el API de Workflows");

        try {
            const { data, status } = await WorkflowAPI.get<Respoponse<Skill>>(`/skills/${id}`);

            if (status === this.STATUS_CODE.OK) return data.data;

            throw new Error(MESSAGE_ERRORS.GET_ONE_WORKFLOW);
        } catch (error) {
            throw new Error(this.getMessageError(error, MESSAGE_ERRORS.GET_ONE_WORKFLOW));
        }
    }

    async create(skill: SkillCreate) {
        if (WorkflowAPI === null) throw new Error("No se ha inicializado el API de Workflows");

        try {
            const { data, status } = await WorkflowAPI.post<Respoponse<Skill>>("/skills", skill);

            if (status === this.STATUS_CODE.CREATED) return data.data;

            throw new Error(MESSAGE_ERRORS.CREATE_WORKFLOW);
        } catch (error) {
            throw new Error(this.getMessageError(error, MESSAGE_ERRORS.CREATE_WORKFLOW));
        }
    }

    async update(id: number, skill: Partial<SkillCreate>) {
        if (WorkflowAPI === null) throw new Error("No se ha inicializado el API de Workflows");

        try {
            const { data, status } = await WorkflowAPI.patch<Respoponse<Skill>>(`/skills/${id}`, skill);

            if (status === this.STATUS_CODE.OK) return data.data;

            throw new Error(MESSAGE_ERRORS.EDIT_WORKFLOW);
        } catch (error) {
            throw new Error(this.getMessageError(error, MESSAGE_ERRORS.EDIT_WORKFLOW));
        }
    }

    async delete(id: number) {
        if (WorkflowAPI === null) throw new Error("No se ha inicializado el API de Workflows");

        try {
            const { status } = await WorkflowAPI.delete<Respoponse<Skill>>(`/skills/${id}`);

            if (status === this.STATUS_CODE.OK) return id;

            throw new Error(MESSAGE_ERRORS.DELETE_WORKFLOW);
        } catch (error) {
            throw new Error(this.getMessageError(error, MESSAGE_ERRORS.DELETE_WORKFLOW));
        }
    }
}
