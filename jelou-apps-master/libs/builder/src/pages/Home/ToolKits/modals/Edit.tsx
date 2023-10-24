import { useCallback, useState } from "react";

import { ToolKitIcon } from "@builder/Icons";
import { HeaderModalBtns } from "@builder/common/Headless/HeaderModalBtns";
import { ModalHeadless } from "@builder/common/Headless/Modal";
import { TYPE_ERRORS, renderMessage } from "@builder/common/Toastify";
import { TextAreaInput, TextInput } from "@builder/common/inputs";
import { ModalFooterBtns } from "@builder/pages/Home/shared/Layouts/ModalFooterBtns";
import { editToolkit } from "@builder/services/toolkits";
import { editTool } from "@builder/services/tools";

import { TYPE_MODAL, useModalsStatesContext } from "../../shared/ModalsStatesContext";
import { useQueryToolkits } from "../hooks/useQueryToolkits";
import { Toolkits } from "../types.toolkits";

const INPUTS_NAMES = {
    NAME: "name",
    DESCRIPTION: "description",
};

export const EditToolkitModal = () => {
    const { showEditModal, setShowEditModal } = useModalsStatesContext();
    const { isOpen: isOpenEditModal, id: selectedId, type } = showEditModal;

    const { data: toolkits = [], refreshToolkitsList } = useQueryToolkits();
    const { defaultName, defaultDescription, toolkitId } = getDefaultValues(type, toolkits, selectedId);

    const [toolkitName, setToolkitName] = useState(defaultName);
    const [toolkitDescription, setToolkitDescription] = useState(defaultDescription);
    const [isLoadingEdit, setIsLoadingEdit] = useState(false);

    const isToolkitType = type === TYPE_MODAL.TOOLKIT;
    const typeLabel = isToolkitType ? "toolkit" : "tool";

    const onClose = () => {
        setShowEditModal({ isOpen: false, id: null, type: null });
    };

    const onChange = (e: React.ChangeEvent<HTMLTextAreaElement> | React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (name === INPUTS_NAMES.NAME) {
            setToolkitName(value);
        } else if (name === INPUTS_NAMES.DESCRIPTION) {
            setToolkitDescription(value);
        }
    };

    const handleEditToolkit = useCallback(async () => {
        if (!selectedId) {
            renderMessage(`Error al recuperar el ${typeLabel}. Por favor refresque la página e intentenuevamente.`, TYPE_ERRORS.ERROR);
            return;
        }

        setIsLoadingEdit(true);
        const updatedData = {
            name: toolkitName ?? defaultName,
            description: toolkitDescription ?? defaultDescription,
        };

        if (type === TYPE_MODAL.TOOLKIT) {
            try {
                await editToolkit(selectedId, updatedData);
                renderMessage(`${typeLabel} editado con éxito`, TYPE_ERRORS.SUCCESS);
                refreshToolkitsList();
            } catch (error) {
                renderMessage(`Error al editar el ${typeLabel}`, TYPE_ERRORS.ERROR);
            }
            setIsLoadingEdit(false);
            onClose();
            return;
        }

        if (!toolkitId) {
            renderMessage(`Error al recuperar el ${typeLabel}. Por favor refresque la página e intentenuevamente.`, TYPE_ERRORS.ERROR);
            return;
        }

        try {
            await editTool(toolkitId.toString(), selectedId.toString(), updatedData);
            renderMessage("Tool editado con éxito", TYPE_ERRORS.SUCCESS);
            refreshToolkitsList();
        } catch (error) {
            renderMessage("Error al editar el tool", TYPE_ERRORS.ERROR);
        }
        setIsLoadingEdit(false);
        onClose();
    }, [defaultDescription, defaultName, onClose, refreshToolkitsList, selectedId, setIsLoadingEdit, toolkitDescription, toolkitId, toolkitName, type, typeLabel]);

    return (
        <ModalHeadless className="w-78" showBtns={false} showClose={false} isDisable={false} isOpen={isOpenEditModal}>
            <HeaderModalBtns Icon={ToolKitIcon} title={`Editar un ${typeLabel}`} colors="bg-[#F2FBFC] text-primary-200" onClose={onClose} />
            <main className="px-10 py-2 text-gray-400">
                <div className="mt-4 flex flex-col gap-4">
                    <TextInput name={INPUTS_NAMES.NAME} label={`Nombre del ${typeLabel}`} defaultValue={defaultName} onChange={onChange} placeholder="Escribe el nombre de la herramienta" />

                    <TextAreaInput name={INPUTS_NAMES.DESCRIPTION} label={`Descripción del toolkit`} defaultValue={defaultDescription} placeholder="Escribe una descripción" onChange={onChange} />

                    <ModalFooterBtns
                        primaryLabel="Guardar"
                        colors="bg-primary-200"
                        secondaryLabel="Cancelar"
                        isLoading={isLoadingEdit}
                        onSubmit={handleEditToolkit}
                        onCancel={onClose}
                        disabled={false}
                    />
                </div>
            </main>
        </ModalHeadless>
    );
};

function getDefaultValues(type: TYPE_MODAL | null, toolkits: Toolkits, selectedId: number | null) {
    if (!selectedId || !type) return { defaultName: undefined, defaultDescription: undefined };

    if (type === TYPE_MODAL.TOOLKIT) {
        const toolkit = toolkits.find((toolkit) => toolkit.id === selectedId);
        const { name = "", description = "" } = toolkit ?? {};
        return { defaultName: name, defaultDescription: description };
    }

    const tools = toolkits.flatMap((toolkit) => toolkit.Tools);
    const tool = tools.find((tool) => tool.id === selectedId);

    const { name = "", description = "", toolkitId } = tool ?? {};
    return { defaultName: name, defaultDescription: description, toolkitId };
}
