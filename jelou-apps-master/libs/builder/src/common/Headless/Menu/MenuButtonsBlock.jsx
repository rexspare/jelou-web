import { CollapseBlockIcon, DeleteBlockIcon, DuplicateBlockIcon } from "@builder/Icons";
import { MenuHeadless } from "./MenuHeadless";

export const ButtonsBlockConfMenu = ({ handleDeleteBlock }) => {
    const menuItemsList = [
        {
            id: 1,
            Icon: DuplicateBlockIcon,
            label: "Duplicar",
            onClick: () => null,
            separator: true,
            disable: true,
        },
        {
            id: 2,
            Icon: CollapseBlockIcon,
            label: "Colapsar",
            onClick: () => null,
            separator: true,
            disable: true,
        },
        {
            id: 3,
            Icon: DeleteBlockIcon,
            label: "Eliminar",
            onClick: handleDeleteBlock,
            separator: false,
            disable: false,
        },
    ];

    return <MenuHeadless IconMenu={MenuContextInput} menuItemsList={menuItemsList} positionMenu="shadow-[0px_0px_10px_rgba(127,_128,_156,_0.25)] z-10" />;
};

function MenuContextInput({ width = 9, height = 14, fill = "currentColor" } = {}) {
    return (
        <svg width={width} height={height} fill="none">
            <circle cx={1.333} cy={1.333} r={1.333} fill={fill} />
            <circle cx={7} cy={1.333} r={1.333} fill={fill} />
            <circle cx={7.167} cy={6.667} r={1.333} fill={fill} />
            <circle cx={1.333} cy={6.667} r={1.333} fill={fill} />
            <circle cx={1.333} cy={12.667} r={1.333} fill={fill} />
            <circle cx={7.167} cy={12.5} r={1.333} fill={fill} />
        </svg>
    );
}
