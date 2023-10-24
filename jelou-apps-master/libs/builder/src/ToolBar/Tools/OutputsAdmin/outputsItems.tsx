import { memo } from "react";

import type { Output as OutputTypes } from "@builder/modules/OutputTools/domain/outputs.domain";

import { EditPencil, ErrorIcon, MenuDotIcon, SuccessIcon, TrashDelete } from "@builder/Icons";

import { OUTPUT_TYPES } from "@builder/modules/OutputTools/domain/contants.output";
import { ActionMenuItem } from "@builder/pages/Home/shared/Layouts/ActionMenuItem";
import { ActionsMenuLayout } from "@builder/pages/Home/shared/Layouts/ActionsMenuLayout";

const COLORS = {
    [OUTPUT_TYPES.SUCCESS]: "border-teal-952 text-green-960 hover:border-[#004137]/50 bg-[#E9F5F3]",
    [OUTPUT_TYPES.FAILED]: "border-[#FFD0CB] text-red-1050 hover:border-[#952F23]/50 bg-red-5",
};

type OutputProps = {
    output: OutputTypes;
    handleOpenUpdateOutputModal: (output: OutputTypes) => void;
    handleOpenDeleteOutputModal: (output: OutputTypes) => void;
};

const OutputItem = ({ output, handleOpenDeleteOutputModal, handleOpenUpdateOutputModal }: OutputProps) => {
    const { type, displayName, description, name } = output;
    const isSuccessOutput = type === OUTPUT_TYPES.SUCCESS;

    const color = COLORS[type];
    const menuColor = isSuccessOutput ? "text-green-960" : "text-red-1050";

    const Icon = isSuccessOutput ? SuccessIcon : ErrorIcon;

    const menuItemsList = [
        {
            id: 1,
            Icon: TrashDelete,
            label: "Eliminar",
            onClick: () => handleOpenDeleteOutputModal(output),
            disable: false,
        },
        {
            id: 2,
            Icon: EditPencil,
            label: "Editar",
            onClick: () => handleOpenUpdateOutputModal(output),
            disable: false,
        },
    ];

    return (
        <div className="relative grid grid-cols-[auto_1rem] gap-2 rounded-12">
            <li className={`space-y-1 rounded-12 border-2 p-3 transition-all duration-300 ease-out ${color}`}>
                <div className="mb-1 flex items-center gap-3">
                    <Icon width={17} height={17} color="currentColor" />
                    <h5 className="text-sm font-semibold">{displayName}</h5>
                </div>
                <p className="text-border-teal-953 text-xs">
                    <span className="font-medium">Variable:</span> {name}
                </p>
                <p className="text-border-teal-953 text-xs">
                    <span className="font-medium">Descripción: </span> {description}
                </p>
            </li>
            <ActionsMenuLayout
                ActionIcon={() => <MenuDotIcon width={16} />}
                buttonStyle={`absolute top-1 right-0 ${menuColor}`}
                listStyle="absolute top-4 right-1 overflow-hidden z-120 w-40 rounded-10 bg-white shadow-[0px_0px_10px_rgba(127,_128,_156,_0.25)]"
            >
                {menuItemsList.map(({ id, Icon, label, onClick, disable }) => (
                    <ActionMenuItem key={id} Icon={Icon} title={label} onClick={onClick} disabled={disable} />
                ))}
            </ActionsMenuLayout>
        </div>
    );
};

export default memo(OutputItem, (prevProps, nextProps) => prevProps.output.id === nextProps.output.id);
