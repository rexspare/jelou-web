import { OneWorkflow, Workflow, Workflows } from "@builder/modules/workflow/doamin/workflow.domain";
import axios from "axios";
import { WorkflowAPI } from "../libs/builder.http";

const MESSAGE_ERRORS = {
    GET_ALL_WORKFLOWS: "Tuvimos un error al obtener la lista de los workflows, por favor refresque la página",
    GET_ONE_WORKFLOW: "Tuvimos un error al obtener el workflow, por favor refresque la página",
    CREATE_WORKFLOW: "Tuvimos un error al crear el workflow, por favor refresque la página",
    EDIT_WORKFLOW: "Tuvimos un error al editar el workflow, por favor refresque la página",
    DELETE_WORKFLOW: "Tuvimos un error al eliminar el workflow, por favor refresque la página",
};

export const getAllWorkflows = async (isActive: boolean): Promise<Workflows> => {
    if (WorkflowAPI === null) throw new Error("No se ha inicializado el API de Workflows");
    try {
        const { data, status } = await WorkflowAPI.get(`/workflows?types%5B%5D=CHATBOT&types%5B%5D=RPA&state=${isActive}`);

        if (status === 200) return data.data;

        throw new Error(MESSAGE_ERRORS.GET_ALL_WORKFLOWS);
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const errorMessage = error?.response?.data?.message;
            throw new Error(errorMessage || MESSAGE_ERRORS.GET_ALL_WORKFLOWS);
        }
        throw error;
    }
};

type GetOneWorkflowOptions = { includeNodes: boolean; includeEdges: boolean };

export const getOneWorkflow = async (id: string, options?: GetOneWorkflowOptions): Promise<OneWorkflow> => {
    if (WorkflowAPI === null) throw new Error("No se ha inicializado el API de Workflows");

    const { includeNodes = false, includeEdges = false } = options || {};

    try {
        const { data, status } = await WorkflowAPI.get(`/workflows/${id}`, {
            params: {
                includeNodes,
                includeEdges,
            },
        });

        if (status === 200) return data.data;

        throw new Error(MESSAGE_ERRORS.GET_ONE_WORKFLOW);
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const errorMessage = error?.response?.data?.message;
            throw new Error(errorMessage || MESSAGE_ERRORS.GET_ONE_WORKFLOW);
        }
        throw error;
    }
};

export const createWorkflow = async (workflow: Partial<Workflow>): Promise<OneWorkflow> => {
    if (WorkflowAPI === null) throw new Error("No se ha inicializado el API de Workflows");

    try {
        const { data, status } = await WorkflowAPI.post("/workflows", workflow);

        if (status === 201) return data.data;

        throw new Error(MESSAGE_ERRORS.CREATE_WORKFLOW);
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const errorMessage = error?.response?.data?.message;
            throw new Error(errorMessage || MESSAGE_ERRORS.CREATE_WORKFLOW);
        }
        throw error;
    }
};

export const editWorkflow = async (workflowId: number, workflowData: Partial<Workflow>): Promise<OneWorkflow> => {
    if (WorkflowAPI === null) throw new Error("No se ha inicializado el API de Workflows");

    try {
        const { data, status } = await WorkflowAPI.patch(`/workflows/${workflowId}`, workflowData);

        if (status === 200) return data;

        throw new Error(MESSAGE_ERRORS.EDIT_WORKFLOW);
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const errorMessage = error?.response?.data?.message;
            throw new Error(errorMessage || MESSAGE_ERRORS.EDIT_WORKFLOW);
        }
        throw error;
    }
};

export const deleteWorflow = async (workflowId: number): Promise<OneWorkflow> => {
    if (WorkflowAPI === null) throw new Error("No se ha inicializado el API de Workflows");

    try {
        const { data, status } = await WorkflowAPI.delete(`/workflows/${workflowId}`);

        if (status === 200) return data;

        throw new Error(MESSAGE_ERRORS.DELETE_WORKFLOW);
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const errorMessage = error?.response?.data?.message;
            throw new Error(errorMessage || MESSAGE_ERRORS.DELETE_WORKFLOW);
        }
        throw error;
    }
};
