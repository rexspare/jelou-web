import { useState } from "react";

import { HomeServiceIcon } from "@builder/Icons";
import { HeaderModalBtns } from "@builder/common/Headless/HeaderModalBtns";
import { ModalHeadless } from "@builder/common/Headless/Modal";
import { TYPE_ERRORS, renderMessage } from "@builder/common/Toastify";
import { TextAreaInput, TextInput } from "@builder/common/inputs";
import { useQuerySkills } from "@builder/modules/skills/infrastructure/querySkills.hook";
import { SkillsRepository } from "@builder/modules/skills/infrastructure/skills.repository";
import { useModalsStatesContext } from "@builder/pages/Home/shared/ModalsStatesContext";
import { ModalFooterBtns } from "../shared/Layouts/ModalFooterBtns";

enum INPUTS_NAMES {
    NAME = "name",
    DESCRIPTION = "description",
}

const skillRepository = new SkillsRepository();

export const EditSkillModal = () => {
    const { setShowEditModal, showEditModal } = useModalsStatesContext();
    const { id: skillId, isOpen } = showEditModal;
    const { invalidateSkills, data: skills = [] } = useQuerySkills();

    const skillToEdit = skills.find((skill) => skill.id === skillId);
    const { name, description } = skillToEdit || { name: "", description: "" };

    const [isLoadingEdit, setIsLoadingEdit] = useState(false);

    const onClose = () => {
        setShowEditModal({
            id: null,
            isOpen: false,
            type: null,
        });
    };

    const handleEditService = async (evt: React.FormEvent<HTMLFormElement>) => {
        evt.preventDefault();
        setIsLoadingEdit(true);

        if (!skillId) {
            renderMessage("Error al editar el servicio", TYPE_ERRORS.ERROR);
            return setIsLoadingEdit(false);
        }

        const formData = new FormData(evt.currentTarget);
        const name = formData.get(INPUTS_NAMES.NAME) as string;
        const description = formData.get(INPUTS_NAMES.DESCRIPTION) as string;

        if (!name || !description) return renderMessage("Debes llenar todos los campos", TYPE_ERRORS.WARNING);

        const updateSkill = {
            name,
            description,
            configuration: {},
        };

        try {
            await skillRepository.update(skillId, updateSkill);
            invalidateSkills();
            renderMessage("Skill editado con éxito", TYPE_ERRORS.SUCCESS);
        } catch (error) {
            let message = "Error al editar el Skill";
            if (error instanceof Error) message = error.message;
            renderMessage(message, TYPE_ERRORS.ERROR);
        }

        setIsLoadingEdit(false);
        onClose();
    };

    return (
        <ModalHeadless showBtns={false} className="w-78" showClose={false} isDisable={false} isOpen={isOpen}>
            <HeaderModalBtns Icon={HomeServiceIcon} title="Editar skill" colors="bg-[#F2FBFC] text-primary-200" onClose={onClose} />
            <main className="px-10 py-2 text-gray-400">
                <form onSubmit={handleEditService} className="mt-4 flex flex-col gap-4">
                    <TextInput defaultValue={name} name={INPUTS_NAMES.NAME} label="Nombre del skill" placeholder="Escribe el nombre de tu skill" />
                    <TextAreaInput defaultValue={description} label="Descripción" name={INPUTS_NAMES.DESCRIPTION} placeholder="Escribe una descripción de tu skill" />

                    <ModalFooterBtns colors="bg-primary-200" secondaryLabel="Cancelar" isLoading={isLoadingEdit} primaryLabel="Editar skill" onSubmit={() => null} onCancel={onClose} />
                </form>
            </main>
        </ModalHeadless>
    );
};
