import { useMemo, useRef, useState } from "react";

import { CloseIcon, ShoppingBagMarketplace } from "@builder/Icons";
import { ListBoxElement, ListBoxHeadless } from "@builder/common/Headless/Listbox";
import { ModalHeadless } from "@builder/common/Headless/Modal";
import { TYPE_ERRORS, renderMessage } from "@builder/common/Toastify";
import { TextAreaInput, TextInput } from "@builder/common/inputs";
import { MarcketplaceToolsRepository } from "@builder/modules/Marketplace/infrastructure/marketplace.repository";
import { useQueryToolkits } from "@builder/pages/Home/ToolKits/hooks/useQueryToolkits";
import { CreateNewToolkitInWay } from "@builder/pages/Home/ToolKits/modals/CreateEditTool/ToolkitData/toolkitData.hook";
import { Toolkits } from "@builder/pages/Home/ToolKits/types.toolkits";
import { CREATE_TOOLKIT_OPTION, TOOLKIT_NAMES_INPUTS } from "@builder/pages/constants.home";

export type ImportModalState = {
    isOpen: boolean;
    versionTool: string;
    toolName: string;
};

function getToolkitsOptions(toolkits: Toolkits) {
    const toolkitsOptions: ListBoxElement[] = toolkits.map((toolkit) => ({
        id: toolkit.id,
        value: toolkit.id.toString(),
        name: toolkit.name,
        description: toolkit.description,
        separator: true,
    }));

    return [CREATE_TOOLKIT_OPTION, ...toolkitsOptions];
}

function showErrorMessage(error: string | Error, defaultMessage: string) {
    if (error instanceof Error) return renderMessage(error.message, TYPE_ERRORS.ERROR);
    if (typeof error === "string") return renderMessage(error, TYPE_ERRORS.ERROR);
    renderMessage(defaultMessage, TYPE_ERRORS.ERROR);
}

type ImportToolModalProps = ImportModalState & {
    onClose: () => void;
};

type ImportTool = {
    toolkitId: string;
    versionTool: string;
};

const marketplaceRepository = new MarcketplaceToolsRepository();

export function ImportToolModal({ isOpen, onClose, versionTool, toolName }: ImportToolModalProps) {
    const { data: toolkits, isLoading, refreshToolkitsList } = useQueryToolkits();
    const formRef = useRef<HTMLFormElement | null>(null);

    const [toolkitSelected, setToolkitSelected] = useState<ListBoxElement>({} as ListBoxElement);
    const [isLoadingCreateToolkit, setIsLoadingCreateToolkit] = useState(false);

    const handleSelectToolkit = (optionSelected: ListBoxElement) => {
        setToolkitSelected(optionSelected);
    };

    const toolkitsOptions: ListBoxElement[] = useMemo(() => getToolkitsOptions(toolkits), [toolkits]);

    const importTool = ({ toolkitId, versionTool }: ImportTool) => {
        marketplaceRepository
            .importTool(versionTool, toolkitId)
            .then(() => {
                refreshToolkitsList();
                onClose();
            })
            .catch((error) => {
                showErrorMessage(error, "Error al intentar importar este tool. Por favor intente nuevamente");
                setIsLoadingCreateToolkit(false);
            });
    };

    const handleClick = () => {
        if (!toolkitSelected) {
            return renderMessage("Primero debes seleccionar o crear un toolkit", TYPE_ERRORS.WARNING);
        }
        setIsLoadingCreateToolkit(true);

        if (toolkitSelected.id === CREATE_TOOLKIT_OPTION.id) {
            CreateNewToolkitInWay({ formRef })
                .then((createdToolkit) => {
                    importTool({ toolkitId: String(createdToolkit.id), versionTool });
                })
                .catch((error) => {
                    showErrorMessage(error, "Tuvimos un error al intentar crear este toolkit. Por favor intente nuevamente");
                    setIsLoadingCreateToolkit(false);
                });
            return;
        }

        importTool({ toolkitId: String(toolkitSelected.id), versionTool });
    };

    return (
        <ModalHeadless
            isDisable={false}
            primaryBtnLabel="Importar"
            secondaryBtnLabel="Cancelar"
            loading={isLoadingCreateToolkit}
            handleClick={handleClick}
            className="w-[23.5rem]"
            showClose={false}
            closeModal={onClose}
            isOpen={isOpen}
        >
            <header className="grid h-14 grid-cols-[1.5rem_1fr_1.5rem] items-center gap-3 rounded-t-1 bg-teal-5 pl-7 pr-5 text-primary-200">
                <ShoppingBagMarketplace />
                <h3 className="text-base font-semibold">Obteniendo Tool</h3>
                <button onClick={onClose}>
                    <CloseIcon />
                </button>
            </header>
            <main className="space-y-4 p-7">
                <p className="text-gray-610 line-clamp-2">
                    Estás importando el tool <span className="font-semibold">{toolName}</span>
                </p>

                <ListBoxHeadless
                    isLoading={isLoading}
                    label="Selecciona un toolkit para importar el tool"
                    list={toolkitsOptions}
                    placeholder="Selecciona un toolkit"
                    setValue={handleSelectToolkit}
                    value={toolkitSelected}
                    slideover
                />

                {toolkitSelected?.id === CREATE_TOOLKIT_OPTION.id && (
                    <form ref={formRef} className="mt-4 grid gap-1">
                        <TextInput hasError="" name={TOOLKIT_NAMES_INPUTS.NAME} label="Nombre del toolkit" placeholder="Escribe el nombre de la herramienta" />
                        <TextAreaInput name={TOOLKIT_NAMES_INPUTS.DESCRIPTION} label="Descripción del toolkit" placeholder="Escribe una descripción" />
                    </form>
                )}
            </main>
        </ModalHeadless>
    );
}
