import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";

import { ChevronDown } from "@builder/Icons";

type Props = {
    children: React.ReactNode;
    buttonStyle?: string;
    ActionIcon?: React.FC<{
        width: number;
        height: number;
        strokeWidth: number;
    }>;
    listStyle?: string;
    buttonLabel?: string;
    menuStyle?: string;
};

export const ActionsMenuLayout = ({
    ActionIcon = ChevronDown,
    buttonLabel,
    buttonStyle = "h-10 w-10 grid place-content-center text-primary-200",
    listStyle = "absolute top-4 right-0 z-120 w-36 overflow-hidden rounded-10 bg-white shadow-menu",
    children,
    menuStyle = "grid justify-end",
}: Props) => {
    return (
        <Menu as="div" className={`relative ${menuStyle}`}>
            <Menu.Button as="button">
                <span className="sr-only">menuHeadlessBtn</span>
                <div className={buttonStyle}>
                    {buttonLabel && <span className="break-words font-semibold text-primary-200">{buttonLabel}</span>}
                    <ActionIcon strokeWidth={2.5} width={20} height={20} />
                </div>
            </Menu.Button>
            <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
            >
                <Menu.Items static as="ul" className={listStyle}>
                    {children}
                </Menu.Items>
            </Transition>
        </Menu>
    );
};
