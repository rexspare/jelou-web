import { useContext, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { TrashIcon2 } from "@apps/shared/icons";
import { ConfigIcon, DuplicateBlockIcon, EditPencil, EndIcon, VersioningIcon } from "@builder/Icons";
import { inputsOutputsPanelsStore } from "@builder/Stores/inputsOutputsPanels";
import { useQueryOneSkill } from "@builder/modules/skills/infrastructure/querySkills.hook";
import { useQueryToolkits } from "@builder/pages/Home/ToolKits/hooks/useQueryToolkits";
import { ActionMenuItem } from "@builder/pages/Home/shared/Layouts/ActionMenuItem";
import { ActionsMenuLayout } from "@builder/pages/Home/shared/Layouts/ActionsMenuLayout";
import { FromPageContext } from "@builder/pages/Workflow";
import { FROM_PAGE } from "@builder/pages/constants.home";
import { VersioningModal } from "../modals/VersioningModal";

export function Breadcrumb() {
    const fromPage = useContext(FromPageContext);
    const isToolView = fromPage === FROM_PAGE.TOOL;

    return isToolView ? <ToolkitBreadCrum /> : <SkillsBreadCrum />;
}

function SkillsBreadCrum() {
    const { data: skill } = useQueryOneSkill();
    const { name } = skill ?? { name: null };

    return (
        <h1 className="relative flex items-center text-lg text-gray-400">
            <button className="underline" onClick={() => window.history.back()}>
                Skills
            </button>
            <span className="mx-1">/</span>
            {name && <span className="font-semibold text-primary-200">{name}</span>}
        </h1>
    );
}

function ToolkitBreadCrum() {
    const { toolkitId, toolId } = useParams();
    const navigate = useNavigate();
    const isOnVariablesPage = new RegExp(/.*variables$/g).test(window.location.pathname);

    const { data: toolkitsChache = [] } = useQueryToolkits();
    const { name: toolkitName, Tools = [] } = toolkitsChache.find((toolkit) => String(toolkit.id) === toolkitId) ?? { name: null };

    const { name: toolNameCache } = Tools.find((tool) => tool.id.toString() === toolId) ?? { name: undefined };

    const gotoBackPage = () => window.history.back();

    const { setOutputAdminModal } = inputsOutputsPanelsStore((state) => ({ setOutputAdminModal: state.setOutputAdminModal }));

    const setShowOutputAdmin = () => setOutputAdminModal(true);

    const actionsList = [
        {
            id: 1,
            Icon: VersioningIcon,
            title: "Historial de versiones",
            onClick: () => setIsOpenVersioningModal(true),
        },
        {
            id: 2,
            Icon: EndIcon,
            title: "Administrador de outputs",
            onClick: setShowOutputAdmin,
        },
        {
            id: 3,
            Icon: ConfigIcon,
            title: "Configuración de variables",
            onClick: () => navigate("variables"),
            disabled: isOnVariablesPage,
        },
        {
            id: 4,
            Icon: EditPencil,
            title: "Cambiar nombre",
            onClick: () => null,
            disabled: true,
        },
        {
            id: 5,
            Icon: DuplicateBlockIcon,
            title: "Duplicar",
            onClick: () => null,
            disabled: true,
        },
        {
            id: 6,
            Icon: TrashIcon2,
            title: "Archivar",
            onClick: () => null,
            disabled: true,
        },
    ];

    const [isOpenVersioningModal, setIsOpenVersioningModal] = useState(false);

    return (
        <>
            <h1 className="relative flex items-center text-lg text-gray-400">
                <button className="underline" onClick={() => window.history.back()}>
                    Toolkits
                </button>
                <span className="mx-1">/</span>
                {toolkitName && (
                    <button className="underline" onClick={gotoBackPage}>
                        {toolkitName}
                    </button>
                )}
                <span className="mx-1">/</span>
                <div className="flex items-center">
                    {toolId && !isOnVariablesPage && (
                        <ActionsMenuLayout
                            buttonLabel={toolNameCache}
                            buttonStyle="text-primary-200 flex items-center gap-2"
                            listStyle="absolute mt-3 top-4.5 left-0 overflow-hidden z-120 w-70 overflow-hidden rounded-10 bg-white shadow-menu"
                        >
                            {actionsList.map(({ id, Icon, title, onClick, disabled }) => (
                                <ActionMenuItem key={id} Icon={Icon} title={title} onClick={onClick} disabled={disabled} />
                            ))}
                        </ActionsMenuLayout>
                    )}
                    {toolId && isOnVariablesPage && (
                        <>
                            <button className="underline" onClick={gotoBackPage}>
                                {toolNameCache ?? undefined}
                            </button>
                            <span className="mx-1">/</span>
                            <p className="border-[#E1E1E1] pr-2 font-semibold text-primary-200">Configuración de variables</p>
                        </>
                    )}
                </div>
            </h1>
            <VersioningModal isOpen={isOpenVersioningModal} handleClose={() => setIsOpenVersioningModal(false)} />
        </>
    );
}
