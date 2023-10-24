import { useState } from "react";

import { ArrowIcon, EditPencil, SpinnerIcon } from "@builder/Icons";
import { useSearch } from "@builder/ToolBar/hook/search";
import { SearchTool } from "@builder/common/Headless/Search";

import { TrashIcon2 } from "@apps/shared/icons";
import { SkillsCard } from "../shared/Card";
import { ActionMenuItem } from "../shared/Layouts/ActionMenuItem";
import { ActionsMenuLayout } from "../shared/Layouts/ActionsMenuLayout";
import { ModalsStatesProvider, TYPE_MODAL, useModalsStatesContext } from "../shared/ModalsStatesContext";
import { useQueryToolkits } from "./hooks/useQueryToolkits";
import { CreateEditToolModal } from "./modals/CreateEditTool";
import { EditToolkitModal } from "./modals/Edit";
import { DeleteModal } from "./modals/Eliminar";
import type { Toolkits, Tools as ToolsTypes } from "./types.toolkits";

export const ToolKits = () => {
    const { data, isLoading } = useQueryToolkits();
    const { search, searchResults, handleSearch } = useSearch(data ?? [], ["name"]);

    const [showCreateToolModal, setShowCreateToolModal] = useState(false);

    return (
        <div className="p-12 text-gray-400">
            <header className="mb-4 flex items-center justify-between border-b-1 border-gray-300 pb-2">
                <h2 className="text-line-hsm flex items-center gap-2 text-3xl font-bold">
                    <button className="block rotate-90 text-primary-200" onClick={() => window.history.back()}>
                        <ArrowIcon width={15} height={15} />
                    </button>
                    Mis tools
                </h2>
                <div className="flex items-center gap-4">
                    <SearchTool
                        search={search}
                        handleSearch={handleSearch}
                        formClassName=""
                        inputClassName="placeholder:text-grey-75 rounded-lg placeholder:text-opacity-75 focus:outline-none border-none h-7 focus-within:ring-transparent w-[19.5rem]"
                        labelClassName="flex items-center text-gray-400 rounded-lg h-9 pl-4 gap-2 border-opacity-50 text-opacity-75 bg-white"
                    />
                    <button onClick={() => setShowCreateToolModal(true)} className="gradient h-9 rounded-xl px-4 font-bold text-white">
                        Crear
                    </button>
                </div>
            </header>
            <ModalsStatesProvider>
                <ToolkitList isLoading={isLoading} toolkits={searchResults} />
                <CreateEditToolModal isEditMode={false} isOpen={showCreateToolModal} onCloseModal={() => setShowCreateToolModal(false)} />

                <EditToolkitModal />
                <DeleteModal />
            </ModalsStatesProvider>
        </div>
    );
};

type ToolkitListProps = {
    toolkits: Toolkits;
    isLoading: boolean;
};

function ToolkitList({ isLoading, toolkits }: ToolkitListProps) {
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
        <main>
            {toolkits &&
                toolkits.map((toolkit) => {
                    const { id: toolkitId, name, Tools } = toolkit;

                    return <ToolList key={toolkitId} tools={Tools} toolkitId={toolkitId} name={name} />;
                })}
        </main>
    );
}

type ToolListProps = {
    tools: ToolsTypes;
    toolkitId: number;
    name: string;
};

function ToolList({ tools, toolkitId, name }: ToolListProps) {
    const { setShowEditModal, setShowDeleteModal } = useModalsStatesContext();
    const handleEditToolkit = () => {
        setShowEditModal({
            id: toolkitId,
            isOpen: true,
            type: TYPE_MODAL.TOOLKIT,
        });
    };

    const handleDeleteToolkit = () => {
        setShowDeleteModal({
            id: toolkitId,
            isOpen: true,
            type: TYPE_MODAL.TOOLKIT,
        });
    };

    const handleEditTool = (toolId: number) => () => {
        setShowEditModal({
            id: toolId,
            isOpen: true,
            type: TYPE_MODAL.TOOL,
        });
    };

    const handleDeleteTool = (toolId: number) => () => {
        setShowDeleteModal({
            id: toolId,
            isOpen: true,
            type: TYPE_MODAL.TOOL,
        });
    };

    return (
        <>
            <ActionsMenuLayout
                listStyle="absolute top-4 left-1 z-120 w-36 overflow-hidden rounded-10 bg-white shadow-menu"
                buttonStyle="h-10 text-xl font-medium text-primary-200 flex items-center gap-2"
                buttonLabel={name}
                menuStyle=""
            >
                <ActionMenuItem title="Editar" Icon={EditPencil} onClick={handleEditToolkit} />
                <ActionMenuItem title="Eliminar" Icon={TrashIcon2} onClick={handleDeleteToolkit} />
            </ActionsMenuLayout>
            <ul className="mb-4 flex w-[calc(100vw-10rem)] flex-wrap gap-4 pb-3 [&_li]:w-72 [&_li]:min-w-[20rem]">
                {tools &&
                    tools.map((tool) => {
                        const { id, name, description, updatedAt } = tool;

                        return (
                            <SkillsCard key={id} linkToNav={`${toolkitId}/${id}`}>
                                <SkillsCard.Title>{name}</SkillsCard.Title>
                                <SkillsCard.Description>{description}</SkillsCard.Description>
                                <SkillsCard.Actions handleDelete={handleDeleteTool(id)} handleEdit={handleEditTool(id)} />
                                <SkillsCard.Footer className="!justify-start !gap-0">
                                    <p className="text-sm text-gray-340">Actualizado hace {getHoursDiff(new Date(), new Date(updatedAt))}</p>
                                </SkillsCard.Footer>
                            </SkillsCard>
                        );
                    })}
            </ul>
        </>
    );
}

function getHoursDiff(dt2: Date, dt1: Date) {
    let diff = (dt2.getTime() - dt1.getTime()) / 1000;
    diff /= 60 * 60;
    const hours = Math.abs(Math.round(diff));

    if (hours < 24) {
        return `${hours} horas`;
    }
    return `${Math.round(hours / 24)} días`;
}
