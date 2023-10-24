import { Fragment, useState } from "react";
import { Listbox, Menu, Transition } from "@headlessui/react";
import { useTranslation } from "react-i18next";

import { DownIcon, MoreOptionsIcon } from "@apps/shared/icons";

const MenuOptions = ({ hanldeDeleteColum, idColum }) => {
    const { t } = useTranslation();
    return (
        <Menu as="div">
            <Menu.Button
                onClick={(evt) => {
                    evt.stopPropagation();
                }}
                as="button"
                className="h-9 w-7">
                <MoreOptionsIcon width="12" height="4" className="rotate-90 fill-current" />
            </Menu.Button>
            <Transition
                as="section"
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95">
                <Menu.Items as="ul" className="absolute right-0 z-120 w-36 overflow-hidden rounded-10 bg-white shadow-menu">
                    {/* <Menu.Item as="li">
                        <button
                            className="w-full px-4 py-2 font-bold text-left text-gray-400 text-13 hover:bg-primary-200 hover:bg-opacity-10 hover:text-primary-200 focus:outline-none"
                            // onClick={() => setShowDeleteModal(true)}
                        >
                            Duplicar parametro
                        </button>
                    </Menu.Item> */}
                    <Menu.Item as="li">
                        <button
                            onClick={(evt) => {
                                evt.stopPropagation();
                                hanldeDeleteColum({ idColum });
                            }}
                            className="w-full px-4 py-2 text-left text-13 font-bold text-gray-400 hover:bg-primary-200 hover:bg-opacity-10 hover:text-primary-200 focus:outline-none">
                            {t("buttons.delete")}
                        </button>
                    </Menu.Item>
                </Menu.Items>
            </Transition>
        </Menu>
    );
};

export default MenuOptions;
