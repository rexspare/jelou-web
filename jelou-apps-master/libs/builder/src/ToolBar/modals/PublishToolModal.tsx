import jwtDecode from "jwt-decode";
import { get } from "lodash";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import { Store } from "@apps/redux/store";
import { PublishIcon } from "@builder/Icons";
import { HeaderModalBtns } from "@builder/common/Headless/HeaderModalBtns";
import { ListBoxElement, ListBoxHeadless } from "@builder/common/Headless/Listbox";
import { ModalHeadless } from "@builder/common/Headless/Modal";
import { TYPE_ERRORS, renderMessage } from "@builder/common/Toastify";
import { TextInput } from "@builder/common/inputs";
import { Version } from "@builder/modules/ToolsVersions/domain/versions.domain";
import { useQueryVersion } from "@builder/modules/ToolsVersions/infrastructure/queryVersion";
import { publishVersion } from "@builder/modules/ToolsVersions/infrastructure/repository";
import { useQueryTool } from "@builder/pages/Home/ToolKits/hooks/useQueryTools";
import { ModalFooterBtns } from "@builder/pages/Home/shared/Layouts/ModalFooterBtns";
import {
    PIVACY_TYPES,
    // EDIT_PERMISSIONS_OPTIONS,
    PRIVACY_OPTIONS,
} from "../constants.toolbar";

type PublishToolModalProps = {
    isOpen: boolean;
    handleClose: () => void;
};

type UserInfo = {
    id: number;
    names: string;
    email: string;
    companyId: number;
};

function getUserInfo(): UserInfo | null {
    const jwtMaster = localStorage.getItem("jwt-master");
    const jwt = localStorage.getItem("jwt");
    const jwtToDecode = jwtMaster || jwt;

    return jwtToDecode ? jwtDecode(jwtToDecode) : null;
}

export const PublishToolModal = ({ isOpen, handleClose }: PublishToolModalProps): JSX.Element => {
    const { toolkitId, toolId } = useParams();
    const { invalidateVersions } = useQueryVersion({ toolId, toolkitId });

    const [versionName, setVersionName] = useState<string>("");
    const [isLoadingPublish, setIsLoadingPublish] = useState<boolean>(false);
    const [privacyMode, setPrivacyMode] = useState<ListBoxElement>(PRIVACY_OPTIONS[0]);

    const userSession = useSelector((state: ReturnType<typeof Store.getState>) => state.userSession);
    const { tool } = useQueryTool();
    const ownerId = get(tool, "ownerId", null);
    const bulderAppId = get(userSession, "Company.properties.builder.app_id", null);

    const isOwner = bulderAppId === ownerId;

    const privacyOptions = isOwner ? PRIVACY_OPTIONS : PRIVACY_OPTIONS.map((option) => (option.value === PIVACY_TYPES.PUBLIC ? { ...option, disabled: true } : option));

    const handlePublishVersion = async (): Promise<void> => {
        try {
            setIsLoadingPublish(true);
            const userInfo = getUserInfo();

            if (!userInfo) {
                return renderMessage("Tuvimos un error al intentar recuperar tu usuario", TYPE_ERRORS.ERROR);
            }

            const versionData: Partial<Version> = {
                version: versionName,
                author: {
                    id: userInfo.id,
                    name: userInfo.names,
                    email: userInfo.email,
                    company: {
                        id: userInfo.companyId,
                    },
                },
                privacy: privacyMode?.value,
                type: "TOOL",
            };
            await publishVersion(String(toolkitId), String(toolId), versionData);
            renderMessage("Versión creada con éxito", TYPE_ERRORS.SUCCESS);
            invalidateVersions();
        } catch (error) {
            renderMessage("Hubo un error al publicar la versión", TYPE_ERRORS.ERROR);
        }
        setIsLoadingPublish(false);
        handleClose();
    };

    return (
        <ModalHeadless showBtns={false} className="w-76" isDisable={false} showClose={false} isOpen={isOpen} closeModal={handleClose}>
            <HeaderModalBtns Icon={PublishIcon} onClose={handleClose} title="Publicar para producción" colors="bg-[#F2FBFC] text-primary-200" />
            <main className="flex flex-col gap-4 px-8 pb-2 pt-6 text-gray-400">
                <p className="text-sm">Publica esta versión para producción y utiliza libremente esta herramienta</p>
                <TextInput
                    hasError=""
                    name="name"
                    value={versionName}
                    label="Nombre de versión"
                    placeholder="Escribe el nombre de la versión"
                    onChange={(event) => setVersionName(event.target.value)}
                />
                <ListBoxHeadless label="Privacidad" value={privacyMode} list={privacyOptions} setValue={setPrivacyMode} />
                {/* <ListBoxHeadless value={editPermissions} label="Permisos de Edición" setValue={setEditPermissions} list={EDIT_PERMISSIONS_OPTIONS} /> */}
                <ModalFooterBtns
                    colors="bg-primary-200"
                    primaryLabel="Publicar"
                    onCancel={handleClose}
                    secondaryLabel="Cancelar"
                    isLoading={isLoadingPublish}
                    disabled={versionName === ""}
                    onSubmit={handlePublishVersion}
                />
            </main>
        </ModalHeadless>
    );
};
