import { useState } from "react";

import { ArrowIcon, SpinnerIcon } from "@builder/Icons";
import { useSearch } from "@builder/ToolBar/hook/search";
import { SearchTool } from "@builder/common/Headless/Search";
import { CHANNELS_ICONS } from "@builder/modules/Channels/domain/channels.constants";
import { Skill } from "@builder/modules/skills/domain/skills.domain";
import { useQuerySkills } from "@builder/modules/skills/infrastructure/querySkills.hook";

import { SkillsCard } from "../shared/Card";
import { ModalsStatesProvider, useModalsStatesContext } from "../shared/ModalsStatesContext";
import { CreateSkillModal } from "./Create.skill";
import { EditSkillModal } from "./Editar.skill";
import { DeleteSkillModal } from "./Eliminar.skill";
import { ChannelTypes } from "@builder/modules/Channels/domain/channels.domain";

export type ModalState = {
    isOpen: boolean;
    selection: number | null;
};

export const Skills = () => {
    const [isOpenCreateModal, setIsOpenCreateModal] = useState(false);

    const { data = [], isLoading } = useQuerySkills();
    const { search, searchResults: skills = [], handleSearch } = useSearch(data, ["name"]);

    if (isLoading) {
        return (
            <div className="grid h-screen w-screen place-content-center">
                <span className="text-primary-200">
                    <SpinnerIcon width={50} />
                </span>
            </div>
        );
    }

    return (
        <>
            <div className="p-12 text-gray-400">
                <header className="mb-4 flex items-center justify-between border-b-1 border-gray-300 pb-2">
                    <h2 className="text-line-hsm flex items-center gap-2 text-3xl font-bold">
                        <button className="block rotate-90 text-primary-200" onClick={() => window.history.back()}>
                            <ArrowIcon width={15} height={15} />
                        </button>
                        Mis skills
                    </h2>
                    <div className="flex items-center gap-4">
                        <SearchTool
                            search={search}
                            handleSearch={handleSearch}
                            formClassName=""
                            inputClassName="placeholder:text-grey-75 rounded-lg placeholder:text-opacity-75 focus:outline-none border-none h-7 focus-within:ring-transparent w-[19.5rem]"
                            labelClassName="flex items-center text-gray-400 rounded-lg h-9 pl-4 gap-2 border-opacity-50 text-opacity-75 bg-white"
                        />
                        <button onClick={() => setIsOpenCreateModal(true)} className="gradient h-9 rounded-xl px-4 font-bold text-white">
                            Crear
                        </button>
                    </div>
                </header>
            </div>
            <ModalsStatesProvider>
                <SkillList isOpenCreateModal={isOpenCreateModal} setIsOpenCreateModal={setIsOpenCreateModal} skills={skills} />
            </ModalsStatesProvider>
        </>
    );
};

type SkillListProps = {
    skills: Skill[];
    isOpenCreateModal: boolean;
    setIsOpenCreateModal: React.Dispatch<React.SetStateAction<boolean>>;
};

function SkillList({ skills, isOpenCreateModal, setIsOpenCreateModal }: SkillListProps) {
    const { setShowDeleteModal, setShowEditModal } = useModalsStatesContext();

    const handleDelete = (id: number) => {
        setShowDeleteModal({
            id,
            isOpen: true,
            type: null,
        });
    };

    const handleEdit = (id: number) => {
        setShowEditModal({
            id,
            isOpen: true,
            type: null,
        });
    };
    return (
        <>
            <main className="px-12 text-gray-400">
                <ul className="grid grid-flow-row grid-cols-[repeat(auto-fill,_minmax(18rem,_1fr))] gap-4">
                    {skills &&
                        skills.map(({ id, name, description, Channels }) => (
                            <SkillsCard key={id + name} linkToNav={String(id)}>
                                <SkillsCard.Title>{name}</SkillsCard.Title>
                                <SkillsCard.Description>{description}</SkillsCard.Description>
                                <SkillsCard.Actions handleDelete={() => handleDelete(id)} handleEdit={() => handleEdit(id)} />
                                <SkillsCard.Footer className="!justify-start !gap-0">
                                    {Channels
                                    .filter((channel) => channel.type === ChannelTypes.WHATSAPP)
                                    .map((channel) => {
                                        const { id, type } = channel;
                                        const ChannelIcon = CHANNELS_ICONS[type];
                                        return <ChannelIcon key={id + type} width={32} height={32} />;
                                    })}
                                </SkillsCard.Footer>
                            </SkillsCard>
                        ))}
                </ul>
            </main>

            <CreateSkillModal isOpenCreateModal={isOpenCreateModal} setIsOpenCreateModal={setIsOpenCreateModal} />
            <DeleteSkillModal />
            <EditSkillModal />
        </>
    );
}
