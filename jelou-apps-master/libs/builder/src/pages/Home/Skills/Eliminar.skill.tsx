import { useState } from "react";

import { DeleteModalHeadless } from "@builder/common/Headless/Modal/DeleteModal.headlees";
import { TYPE_ERRORS, renderMessage } from "@builder/common/Toastify";
import { useQuerySkills } from "@builder/modules/skills/infrastructure/querySkills.hook";
import { SkillsRepository } from "@builder/modules/skills/infrastructure/skills.repository";
import { useModalsStatesContext } from "@builder/pages/Home/shared/ModalsStatesContext";

const skillRepository = new SkillsRepository();

export const DeleteSkillModal = () => {
    const { setShowDeleteModal, showDeleteModal } = useModalsStatesContext();
    const { id: skillId, isOpen } = showDeleteModal;
    const { invalidateSkills } = useQuerySkills();

    const [isLoadingDelete, setIsLoadingDelete] = useState(false);

    const onClose = () => {
        setShowDeleteModal({
            id: null,
            isOpen: false,
            type: null,
        });
    };

    const handleDeleteService = async () => {
        if (!skillId) return renderMessage("No se ha encontrado el id del skill", TYPE_ERRORS.ERROR);
        try {
            setIsLoadingDelete(true);
            await skillRepository.delete(skillId);
            invalidateSkills();
            renderMessage("Skill eliminado con éxito", TYPE_ERRORS.SUCCESS);
        } catch (error) {
            renderMessage("Error al eliminar el skill", TYPE_ERRORS.ERROR);
        }
        setIsLoadingDelete(false);
        onClose();
    };

    return (
        <DeleteModalHeadless isOpen={isOpen} onClose={onClose}>
            <DeleteModalHeadless.Header>Eliminar skill</DeleteModalHeadless.Header>
            <DeleteModalHeadless.Main actionVerbs="skill" description="Si eliminas esta skill no podras recuperar todo lo creado" />
            <DeleteModalHeadless.Footer loading={isLoadingDelete} onPrimaryClick={handleDeleteService} secondaryLabel="Cancelar" disabled={false}>
                Sí, eliminar
            </DeleteModalHeadless.Footer>
        </DeleteModalHeadless>
    );
};
