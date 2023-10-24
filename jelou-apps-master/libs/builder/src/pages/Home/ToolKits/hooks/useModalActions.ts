import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { TYPE_ERRORS, renderMessage } from "@builder/common/Toastify";
import { createIATool, createTool, editTool, generateToolFromIA } from "@builder/services/tools";
import { CreatedTool, IAWorkflow, Tool } from "../types.toolkits";
import { useQueryToolkits } from "./useQueryToolkits";

type UseModalActions = {
    isLoadingAction: boolean;
    isLoadingAITool: boolean;
    handleCloseModal: () => void;
    handleSaveEdit: (handleEditTool: HandleEditTool) => Promise<void>;
    handleCreateManualTool: (toolkitId: string) => Promise<void>;
    handleCreateIATool: (toolkitId: string) => Promise<void>;
};

type Props = {
    createdTool: CreatedTool;
    handleCloseModal: () => void;
};

type HandleEditTool = { editToolId: string; toolkitId: string };

export const useModalActions = ({ createdTool, handleCloseModal }: Props): UseModalActions => {
    const navigation = useNavigate();
    const { refreshToolkitsList } = useQueryToolkits();

    const [isLoadingAction, setIsLoadingAction] = useState(false);
    const [isLoadingAITool, setIsLoadingAITool] = useState(false);

    const handleSaveEdit = async ({ editToolId, toolkitId }: HandleEditTool) => {
        if (!toolkitId) {
            renderMessage("Tenemos un error con el identificador del toolkit, por favor intente nuevamente recargando la página", TYPE_ERRORS.ERROR);
            return;
        }

        setIsLoadingAction(true);
        const editedTool = {
            name: createdTool?.name,
            description: createdTool?.description,
            configuration: {
                principalColor: createdTool?.principalColor,
                complementaryColor: createdTool?.complementaryColor,
                thumbnail: createdTool?.thumbnail,
            },
        };

        try {
            await editTool(toolkitId, editToolId, editedTool);
            refreshToolkitsList();
            renderMessage("Tool editado con éxito", TYPE_ERRORS.SUCCESS);
        } catch (error) {
            renderMessage("Error al editar el Tool", TYPE_ERRORS.ERROR);
        }

        setIsLoadingAction(false);
        handleCloseModal();
    };

    const handleCreateManualTool = async (toolkitId: string) => {
        if (!toolkitId) {
            renderMessage("Tenemos un error con el identificador del toolkit, por favor intente nuevamente recargando la página", TYPE_ERRORS.ERROR);
            return;
        }

        setIsLoadingAction(true);

        const tool: Partial<Tool> = {
            name: createdTool?.name,
            description: createdTool?.description,
            configuration: {
                principalColor: createdTool?.principalColor ?? "#E6F6F9",
                complementaryColor: createdTool?.complementaryColor ?? "#00B3C7",
                thumbnail: createdTool?.thumbnail,
            },
        };

        try {
            const toolCreated = await createTool(toolkitId, tool);
            refreshToolkitsList();
            renderMessage("Tool manual creado con éxito", TYPE_ERRORS.SUCCESS);
            navigation(`${toolkitId}/${toolCreated.id}`);
        } catch (error) {
            renderMessage("Error al crear el Tool manual", TYPE_ERRORS.ERROR);
        }

        setIsLoadingAction(false);
        handleCloseModal();
    };

    const handleCreateIATool = async (toolkitId: string) => {
        if (!toolkitId) {
            renderMessage("Tenemos un error con el identificador del toolkit, por favor intente nuevamente recargando la página", TYPE_ERRORS.ERROR);
            return;
        }
        setIsLoadingAction(true);
        setIsLoadingAITool(true);

        const IATool = {
            name: createdTool?.name,
            prompt: createdTool?.description,
        };

        try {
            const workflowCreated: IAWorkflow = await createIATool(IATool);

            const tool = {
                name: createdTool?.name,
                description: createdTool?.description,
                configuration: {
                    principalColor: createdTool?.principalColor ?? "#E6F6F9",
                    complementaryColor: createdTool?.complementaryColor ?? "#00B3C7",
                    thumbnail: createdTool?.thumbnail,
                },
                workflow: {
                    name: workflowCreated.name,
                    description: createdTool.description,
                    edges: workflowCreated.edges,
                    nodes: workflowCreated.nodes,
                },
                inputs: workflowCreated.inputs,
                outputs: workflowCreated.outputs,
            };

            const toolCreated = await generateToolFromIA(toolkitId, tool);

            refreshToolkitsList();
            renderMessage("Tool con IA creado con éxito", TYPE_ERRORS.SUCCESS);
            navigation(`${toolkitId}/${toolCreated.id}`);
        } catch (error) {
            renderMessage("Error al crear el Tool con IA", TYPE_ERRORS.ERROR);
        }
        setIsLoadingAITool(false);
        setIsLoadingAction(false);
        handleCloseModal();
    };

    return {
        isLoadingAITool,
        isLoadingAction,
        handleSaveEdit,
        handleCloseModal,
        handleCreateManualTool,
        handleCreateIATool,
    };
};
