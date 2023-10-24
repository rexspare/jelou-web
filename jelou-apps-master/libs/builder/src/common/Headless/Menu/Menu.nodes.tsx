export enum ItemMenuId {
    Collapse = 1,
    Duplicate = 2,
    Delete = 3,
    ConfigHttpNode = "config-http-node",
    ExecuteHttpNode = "config-http-execute",
}

export type ItemsMenu = {
    id: ItemMenuId;
    label: string;
    onClick: () => void;
    separator: boolean;
    Icon: React.FC<{
        width?: number;
        height?: number;
        fill?: string;
    }>;
    disabled: boolean;
};

type MenuHeadlessConfNodeProps = {
    itemsList: ItemsMenu[];
    labelButton?: string;
    IconMenu?: React.FC;
    refMenuButon?: React.MutableRefObject<HTMLButtonElement>;
    distance?: string;
    onOptionSelected?: () => void;
};

export function MenuHeadlessConfNode({ itemsList = [], distance = "-right-[9rem] -top-[0.15rem]", onOptionSelected = () => null }: MenuHeadlessConfNodeProps) {
    const handleOnClick = (callback?: () => void) => (evt: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
        evt.stopPropagation();
        callback && callback();
        onOptionSelected();
    };

    return (
        <ul
            className={`absolute w-60 overflow-hidden rounded-12 bg-white py-2 ${distance}`}
            style={{
                boxShadow: "0px 3px 6px -3px rgba(0, 0, 0, 0.12), 0px 6px 12px 0px rgba(0, 0, 0, 0.08), 0px 9px 24px 8px rgba(0, 0, 0, 0.05)",
            }}
        >
            {itemsList.map((item, index) => {
                const { id, label, onClick, separator, Icon, disabled } = item;

                const isDeleteOption = id === ItemMenuId.Delete;
                const disableStyle = disabled
                    ? "text-gray-400 text-opacity-30 cursor-not-allowed"
                    : !isDeleteOption
                    ? "hover:bg-primary-200 hover:bg-opacity-10 hover:text-primary-200 text-gray-400"
                    : "";
                const separatorStyle = separator ? "border-grey-75 border-b-0.5 border-opacity-25" : "";
                const deleteStyle = isDeleteOption ? "text-[#F12B2C] hover:bg-[#F12B2C]/25" : "";

                return (
                    <li
                        key={id ?? index}
                        onClick={disabled ? () => null : handleOnClick(onClick)}
                        className="focus:outline-none focus:ring-transparent focus-visible:outline-none focus-visible:ring-transparent"
                    >
                        <button
                            name={label}
                            id={`menuBlockItem-${id}`}
                            disabled={disabled}
                            className={`flex w-full items-center justify-start gap-2 px-4 py-2 text-base transition-all duration-300 ease-out ${disableStyle} ${separatorStyle} ${deleteStyle}`}
                        >
                            <div className="flex w-6 items-center justify-center">{Icon && <Icon fill="currentColor" />}</div>
                            {label && <span className="ml-1 text-left font-normal">{label}</span>}
                        </button>
                    </li>
                );
            })}
        </ul>
    );
}
