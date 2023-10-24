import { useRef, useState } from "react";

import { ListBoxElement } from "@builder/common/Headless/Listbox";
import { TYPE_ERRORS, renderMessage } from "@builder/common/Toastify";
import { CREATE_TOOLKIT_OPTION, TOOLKIT_NAMES_INPUTS } from "@builder/pages/constants.home";
import { createToolkit } from "@builder/services/toolkits";
import { useQueryToolkits } from "../../../hooks/useQueryToolkits";
import { CREATE_EDIT_STEP, CreatedTool } from "../../../types.toolkits";

type CreateNewToolkitInWayProps = {
    formRef: React.RefObject<HTMLFormElement>;
};

type UseToolkitDataProps = {
    createdTool: CreatedTool;
    onPrimaryClick: (currentStep: CREATE_EDIT_STEP) => void;
    handleAddData: (tool: Partial<CreatedTool>) => void;
};

export const useToolkitData = ({ createdTool, handleAddData, onPrimaryClick }: UseToolkitDataProps) => {
    const { data, refreshToolkitsList } = useQueryToolkits();
    const formRef = useRef<HTMLFormElement | null>(null);

    const toolkitsOptionsList = data?.map(({ id, name, description }) => ({ id: id.toString(), name, value: id.toString(), description, separator: true })) ?? [];
    const toolkitsOptions = [CREATE_TOOLKIT_OPTION, ...toolkitsOptionsList];

    const defaultSelectedToolkit = toolkitsOptions.find((toolkit) => String(toolkit.id) === createdTool.toolkitId);

    const [toolkitSelected, setToolkitSelected] = useState<ListBoxElement | undefined>(defaultSelectedToolkit ?? undefined);
    const [isLoadingCreateToolkit, setIsLoadingCreateToolkit] = useState(false);

    const isDisable = !toolkitSelected;

    const handlePrimaryClick = () => {
        if (!toolkitSelected) {
            renderMessage("Selecciona un toolkit", TYPE_ERRORS.WARNING);
            return;
        }

        if (toolkitSelected.id === CREATE_TOOLKIT_OPTION.id) {
            setIsLoadingCreateToolkit(true);
            CreateNewToolkitInWay({ formRef })
                .then((newToolkit) => {
                    handleAddData({ toolkitId: String(newToolkit.id) });
                    refreshToolkitsList();
                    onPrimaryClick(CREATE_EDIT_STEP.TOOLKIT);
                })
                .catch((error) => {
                    if (error instanceof Error) renderMessage(error.message, TYPE_ERRORS.ERROR);
                    if (typeof error === "string") renderMessage(error, TYPE_ERRORS.ERROR);
                    renderMessage("Error al crear el toolkit", TYPE_ERRORS.ERROR);
                })
                .finally(() => setIsLoadingCreateToolkit(false));
            return;
        }

        handleAddData({ toolkitId: String(toolkitSelected.id) });
        onPrimaryClick(CREATE_EDIT_STEP.TOOLKIT);
    };

    return { formRef, toolkitSelected, toolkitsOptions, isLoadingCreateToolkit, isDisable, setToolkitSelected, handlePrimaryClick };
};

export async function CreateNewToolkitInWay({ formRef }: CreateNewToolkitInWayProps) {
    const form = formRef.current;
    if (!form) throw new Error("Error al crear el toolkit, por favor intenta nuevamente");

    const formData = new FormData(form);
    const name = formData.get(TOOLKIT_NAMES_INPUTS.NAME) as string;
    const description = formData.get(TOOLKIT_NAMES_INPUTS.DESCRIPTION) as string;

    if (!name || !description) {
        throw new Error("Debes completa los datos del toolkit para crearlo");
    }

    const toolkit = {
        name,
        description,
    };

    return createToolkit(toolkit).then((newToolkit) => {
        renderMessage("Toolkit creado con éxito", TYPE_ERRORS.SUCCESS);
        return newToolkit;
    });
}
