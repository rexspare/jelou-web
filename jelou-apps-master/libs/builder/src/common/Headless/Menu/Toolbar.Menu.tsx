import { Popover, Transition } from "@headlessui/react";
import React, { Children, Fragment, useState } from "react";

import { useSearch } from "@builder/ToolBar/hook/search";
import { SearchTool } from "../Search";

type Icons = React.FC<{
    width?: number;
    height?: number;
}>;

export type ListItems<T = unknown> = { id: string | number; Icon: Icons; text: string; nodeType: string; initialData: T };

type ButtonProps = { IconMenu?: Icons; className: string; size: number; label?: string; isOpen?: boolean; setIsOpen?: React.Dispatch<React.SetStateAction<boolean>> };

export function Button({ IconMenu, className, size, label = "", isOpen = false, setIsOpen = () => null }: ButtonProps) {
    const openStyles = isOpen ? "bg-[#E6F6FA] text-primary-200" : "text-gray-400 hover:bg-[#f1f6f7]";

    return (
        <button className={`${openStyles} ${className}`}>
            {IconMenu && <IconMenu width={size} height={size} />}
            {label && label}
        </button>
    );
}

function Header({ IconMenu, className, size, title }: { IconMenu: Icons; className: string; size: number; title: string }) {
    return (
        <h3 className={`flex h-10 items-center gap-2 pl-4 font-semibold ${className}`}>
            <IconMenu width={size} height={size} />
            {title}
        </h3>
    );
}

function List({ size, list, className }: { size: number; list: Array<ListItems>; className?: string }) {
    const { handleSearch, search, searchResults } = useSearch(list);

    return (
        <>
            <SearchTool
                handleSearch={handleSearch}
                search={search}
                labelClassName="flex items-center text-grey-75 border-1.5 border-grey-75 rounded-lg h-9 pl-4 gap-2 border-opacity-50 text-opacity-75 text-gray-400"
            />
            <ul className={`mb-2 max-h-[26rem] grow overflow-y-scroll border-t-1 border-gray-330 ${className}`}>
                {searchResults.map((item) => {
                    const { id, text, Icon, nodeType, initialData } = item;

                    return (
                        <li
                            draggable
                            key={id}
                            className="flex min-h-[46px] cursor-[grab] items-center gap-3 py-2 pl-4 pr-1 text-15 font-medium text-gray-400"
                            onDragStart={handleDragStart(initialData, nodeType)}
                        >
                            {Icon && <Icon width={size} height={size} />}
                            <span className="line-clamp-2">{text}</span>
                        </li>
                    );
                })}
            </ul>
        </>
    );
}

type FooterProps = {
    className: string;
    children: React.ReactNode;
    onClick: (evt: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
};

function Footer({ className, children, onClick }: FooterProps) {
    return (
        <footer className="flex items-center justify-center px-4">
            <button onClick={onClick} className={className}>
                {children}
            </button>
        </footer>
    );
}

function CustomList({ children }: { children: React.ReactNode[] | React.ReactNode }) {
    return <div>{children}</div>;
}

export function ToolbarMenu({ className, children }: { className: string; children: React.ReactElement[] }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <Popover className="relative inline-block w-full text-left" onMouseLeave={() => {setIsOpen(false)}}  onMouseOver={() => {setIsOpen(true)}}>
            {Children.map(children, (child) => {
                if (child.type === Button) return React.cloneElement(child, { isOpen, setIsOpen });
                return null;
            })}
            <Transition
                show={isOpen}
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
            >
                <Popover.Panel >
                    <div className={`absolute flex h-fit w-[20.3125rem] flex-col overflow-hidden rounded-lg bg-white pl-[6px] shadow-[4px_4px_5px_0px_rgba(184,_189,_201,_0.25)] ${className}`}>
                        {Children.map(children, (child) => {
                            if (child.type === Header) return child;
                            if (child.type === List) return child;
                            if (child.type === Footer) return child;
                            return null;
                        })}
                        {Children.map(children, (child) => {
                            if (child.type === CustomList) return child;
                            return null;
                        })}
                    </div>
                </Popover.Panel>
            </Transition>
        </Popover>
    );
}

ToolbarMenu.Button = Button;
ToolbarMenu.Header = Header;
ToolbarMenu.List = List;
ToolbarMenu.Footer = Footer;
ToolbarMenu.CustomList = CustomList;

const handleDragStart =
    <T,>(initialData: T, nodeType: string) =>
    (evt: React.DragEvent<HTMLLIElement>) => {
        const data = JSON.stringify({ initialData, nodeType });
        evt.dataTransfer.setData("text/plain", data);
        evt.dataTransfer.effectAllowed = "move";
    };
