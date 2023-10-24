import { useAutoAnimate } from "@formkit/auto-animate/react";
import { Suspense, useState } from "react";

import { EditPencil, MenuDotIcon, TrashDelete } from "@builder/Icons";
import { inputsOutputsPanelsStore } from "@builder/Stores/inputsOutputsPanels";
import { useQueryTool } from "@builder/pages/Home/ToolKits/hooks/useQueryTools";
import { Input as InputType } from "@builder/pages/Home/ToolKits/types.toolkits";
import { ActionMenuItem } from "@builder/pages/Home/shared/Layouts/ActionMenuItem";
import { ActionsMenuLayout } from "@builder/pages/Home/shared/Layouts/ActionsMenuLayout";

import { INPUTS_TYPES_LABELS } from "../constants.toolbar";
import { DeleteInput } from "./Delete.input";
import { UpdateInput } from "./Update.input";

export const InputsTools = () => {
    const [isOpenUpdateInput, setIsOpenUpdateInput] = useState(false);
    const [isOpenDeleteInput, setIsOpenDeleteInput] = useState(false);
    const [inputSelected, setInputSelected] = useState<InputType>({} as InputType);

    const { setCreateInputOpen } = inputsOutputsPanelsStore((state) => ({
        setCreateInputOpen: state.setCreateInputModal,
    }));

    const openCreateInputModal = () => {
        setCreateInputOpen(true);
    };

    const handleOpenUpdateInputModal = (input: InputType) => {
        setInputSelected(input);
        setIsOpenUpdateInput(true);
    };

    const handleOpenDeleteInputModal = (input: InputType) => {
        setInputSelected(input);
        setIsOpenDeleteInput(true);
    };

    const { tool } = useQueryTool();
    const { Inputs = [] } = tool || {};

    return (
        <>
            <section className="w-full flex-col">
                <main className="mx-5">
                    <ul className="space-y-3 text-[#374361]">
                        {Inputs &&
                            Inputs.map((input) => (
                                <Input key={input.id} input={input} handleOpenUpdateInputModal={handleOpenUpdateInputModal} handleOpenDeleteInputModal={handleOpenDeleteInputModal} />
                            ))}
                    </ul>
                </main>
                <footer className="mt-1 flex items-center justify-center px-6 py-3">
                    <button onClick={openCreateInputModal} className="h-8 w-full rounded-full border-1 border-primary-200 bg-primary-200 text-sm font-medium text-white">
                        + Añadir input
                    </button>
                </footer>
            </section>
            <Suspense fallback={null}>
                {isOpenUpdateInput && <UpdateInput inputToUpdate={inputSelected} isOpenUpdateInput={isOpenUpdateInput} onClose={() => setIsOpenUpdateInput(false)} />}
                {isOpenDeleteInput && <DeleteInput inputToDelete={inputSelected} isOpenUpdateInput={isOpenDeleteInput} onClose={() => setIsOpenDeleteInput(false)} />}
            </Suspense>
        </>
    );
};

type InputProps = {
    input: InputType;
    handleOpenUpdateInputModal: (input: InputType) => void;
    handleOpenDeleteInputModal: (input: InputType) => void;
};

export function Input({ input, handleOpenUpdateInputModal, handleOpenDeleteInputModal }: InputProps) {
    const { displayName = "", type, description = "", name = "" } = input || {};
    const [showAll, setShowAll] = useState(false);
    const typeLabel = INPUTS_TYPES_LABELS[type];
    const [ref] = useAutoAnimate();

    const handleToggleShowInfo = () => {
        setShowAll((preState) => !preState);
    };

    const menuItemsList = [
        {
            id: 1,
            Icon: TrashDelete,
            label: "Eliminar",
            onClick: () => handleOpenDeleteInputModal(input),
            disabled: false,
        },
        {
            id: 2,
            Icon: EditPencil,
            label: "Editar",
            onClick: () => handleOpenUpdateInputModal(input),
            disabled: false,
        },
    ];

    return (
        <div className="grid grid-cols-[auto_1rem] gap-3 rounded-12 bg-white">
            <li onClick={handleToggleShowInfo} className="cursor-pointer p-3 transition-all duration-300 ease-out">
                <div className="flex flex-col items-start space-y-2" ref={ref}>
                    <div className="flex">
                        <p className="text-xs font-bold leading-4 text-primary-200">
                            Nombre: <span className="text-xs font-normal leading-4 text-gray-610">{displayName}</span>
                        </p>
                    </div>
                    {showAll && (
                        <>
                            <div className="flex">
                                <p className="text-xs font-bold leading-4 text-primary-200">
                                    Tipo: <span className="text-xs font-normal leading-4 text-gray-610">{typeLabel}</span>
                                </p>
                            </div>
                            <div className="flex">
                                <p className="text-xs font-bold leading-4 text-primary-200">
                                    Variable: <span className="text-xs font-normal leading-4 text-gray-610">{name}</span>
                                </p>
                            </div>
                            <div className="flex">
                                <p className="text-xs font-bold leading-4 text-primary-200">
                                    Descripción: <span className="text-xs font-normal leading-4 text-gray-610">{description}</span>
                                </p>
                            </div>
                        </>
                    )}
                </div>
            </li>
            <ActionsMenuLayout ActionIcon={MenuDotIcon}>
                {menuItemsList.map(({ id, Icon, label, onClick, disabled }) => (
                    <ActionMenuItem key={id} Icon={Icon} title={label} onClick={onClick} disabled={disabled} />
                ))}
            </ActionsMenuLayout>
        </div>
    );
}
