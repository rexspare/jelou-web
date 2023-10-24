import { useCallback, useState } from "react";

import { GridAdd } from "@builder/Icons";
import { HeaderModalBtns } from "@builder/common/Headless/HeaderModalBtns";
import { ModalHeadless } from "@builder/common/Headless/Modal";
import { TYPE_ERRORS, renderMessage } from "@builder/common/Toastify";
import { TextAreaInput, TextInput } from "@builder/common/inputs";
import { useQuerySkills } from "@builder/modules/skills/infrastructure/querySkills.hook";
import { SkillsRepository } from "@builder/modules/skills/infrastructure/skills.repository";
import { ModalFooterBtns } from "../shared/Layouts/ModalFooterBtns";

enum INPUTS_NAMES {
    NAME = "name",
    DESCRIPTION = "description",
}

const skillRepository = new SkillsRepository();

type CreateSkillModalProps = {
    isOpenCreateModal: boolean;
    setIsOpenCreateModal: React.Dispatch<React.SetStateAction<boolean>>;
};

export const CreateSkillModal = ({ isOpenCreateModal, setIsOpenCreateModal }: CreateSkillModalProps) => {
    const { invalidateSkills } = useQuerySkills();

    const [isLoadingCreate, setIsLoadingCreate] = useState<boolean>(false);

    const handleCreateService = useCallback(
        async (evt: React.FormEvent<HTMLFormElement>) => {
            evt.preventDefault();
            setIsLoadingCreate(true);

            const formData = new FormData(evt.currentTarget);
            const name = formData.get(INPUTS_NAMES.NAME) as string;
            const description = formData.get(INPUTS_NAMES.DESCRIPTION) as string;

            if (!name || !description) {
                setIsLoadingCreate(false);
                return renderMessage("Debes llenar todos los campos", TYPE_ERRORS.WARNING);
            }

            const skill = {
                name,
                description,
                configuration: {},
            };

            try {
                await skillRepository.create(skill);
                invalidateSkills();
                renderMessage("Skill creado con éxito", TYPE_ERRORS.SUCCESS);
            } catch (error) {
                if (error instanceof Error) renderMessage(error.message, TYPE_ERRORS.ERROR);
                renderMessage("Error al crear el skill", TYPE_ERRORS.ERROR);
            }

            setIsLoadingCreate(false);
            setIsOpenCreateModal(false);
        },
        [invalidateSkills, setIsOpenCreateModal]
    );

    return (
        <ModalHeadless className="w-78" showBtns={false} showClose={false} isDisable={false} isOpen={isOpenCreateModal}>
            <HeaderModalBtns Icon={GridAdd} title="Crea tu skill" colors="bg-[#F2FBFC] text-primary-200" onClose={() => setIsOpenCreateModal(false)} />
            <main className="px-10 py-2 text-gray-400">
                <form onSubmit={handleCreateService} className="mt-4 flex flex-col gap-4">
                    <TextInput name={INPUTS_NAMES.NAME} label="Nombre del skill" placeholder="Escribe el nombre de tu skill" />
                    <TextAreaInput label="Descripción" name={INPUTS_NAMES.DESCRIPTION} placeholder="Escribe una descripción de tu skill" />

                    <ModalFooterBtns
                        colors="bg-primary-200"
                        secondaryLabel="Cancelar"
                        isLoading={isLoadingCreate}
                        disabled={isLoadingCreate}
                        primaryLabel="Crear skill"
                        onSubmit={() => null}
                        onCancel={() => setIsOpenCreateModal(false)}
                    />
                </form>
            </main>
        </ModalHeadless>
    );
};
