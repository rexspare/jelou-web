import { Menu } from "@headlessui/react";

type ActionMenuItemProps = {
    Icon?: React.FC<{
        color: string;
        width: number;
        height: number;
    }>;
    onClick: () => void;
    title: string;
    disabled?: boolean;
};

export const ActionMenuItem = (props: ActionMenuItemProps) => {
    const { Icon, onClick, title, disabled } = props;
    return (
        <Menu.Item as="li">
            <button
                onClick={onClick}
                disabled={disabled}
                className="flex w-full items-center gap-2 border-b-1 border-gray-230 px-4 py-2 text-left text-13 font-bold text-gray-400 transition-all duration-300 ease-out hover:bg-primary-200 hover:bg-opacity-10 hover:text-primary-200 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            >
                {Icon && <Icon color="currentColor" width={20} height={20} />}
                {title}
            </button>
        </Menu.Item>
    );
};
