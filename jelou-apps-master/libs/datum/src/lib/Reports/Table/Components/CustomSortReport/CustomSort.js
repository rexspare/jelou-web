import { Menu, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";

import { CleanIcon, LeftArrow, SortIcon } from "@apps/shared/icons";
import { useTranslation } from "react-i18next";

const sortKey = "sortOrder";

const BUTTONS_NAME = {
    ASC: "asc",
    DESC: "desc",
    CLEAR: "clear",
};

export default function CustomSort({ setRequestParams }) {
    const [sortSelected, setSortSelected] = useState(null);
    const { t } = useTranslation();

    const handleSortClick = (name) => {
        if (name === BUTTONS_NAME.CLEAR) {
            setSortSelected(null);
            setRequestParams((prev) => {
                const { [sortKey]: _, ...rest } = prev;
                return rest;
            });
            return;
        }

        setSortSelected(name);
        setRequestParams((preState) => ({ ...preState, [sortKey]: name }));
    };

    return (
        <Menu as="div" className="relative inline-block text-left">
            <div>
                <Menu.Button className="text-gray-400 text-opacity-50 hover:text-primary-200">
                    <SortIcon className="fill-current" width="20" height="15" />
                </Menu.Button>
            </div>

            <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95">
                <Menu.Items className="divide-y ring-1 ring-opacity-5 absolute right-0 z-10 mt-2 w-36 origin-top-right divide-gray-400/75 overflow-hidden rounded-md bg-white shadow-lg ring-black focus:outline-none">
                    <Menu.Item>
                        {({ active }) => (
                            <button
                                name={BUTTONS_NAME.ASC}
                                onClick={() => handleSortClick(BUTTONS_NAME.ASC)}
                                className={`${
                                    active || sortSelected === BUTTONS_NAME.ASC ? "text-primary-200" : "text-gray-500"
                                } flex w-full items-center justify-center gap-1 px-2 py-2 text-sm hover:bg-primary-600`}>
                                <span className="w-24">{t("dataReport.asc")}</span>
                                <LeftArrow
                                    fill={active || sortSelected === BUTTONS_NAME.ASC ? "text-primary-200" : "text-gray-500"}
                                    className="-rotate-90 fill-current"
                                    width="0.4375rem"
                                    height="0.4375rem"
                                />
                            </button>
                        )}
                    </Menu.Item>
                    <Menu.Item>
                        {({ active }) => (
                            <button
                                name={BUTTONS_NAME.DESC}
                                onClick={() => handleSortClick(BUTTONS_NAME.DESC)}
                                className={`${
                                    active || sortSelected === BUTTONS_NAME.DESC ? "text-primary-200" : "text-gray-500"
                                } flex w-full items-center justify-center gap-1 px-2 py-2 text-sm hover:bg-primary-600`}>
                                <span className="w-24">{t("dataReport.desc")}</span>
                                <LeftArrow
                                    fill={active || sortSelected === BUTTONS_NAME.DESC ? "text-primary-200" : "text-gray-500"}
                                    className="rotate-90 fill-current"
                                    width="0.4375rem"
                                    height="0.4375rem"
                                />
                            </button>
                        )}
                    </Menu.Item>
                    <Menu.Item>
                        {({ active }) => (
                            <button
                                onClick={() => handleSortClick(BUTTONS_NAME.CLEAR)}
                                name={BUTTONS_NAME.CLEAR}
                                className={`${
                                    active ? "text-primary-200" : "text-gray-500"
                                } flex w-full items-center justify-center gap-1 px-2 py-2 text-sm hover:bg-primary-600`}>
                                <span className="w-24">{t("clients.clean")}</span>
                                <CleanIcon className="fill-current" width="0.844rem" height="1.178rem" />
                            </button>
                        )}
                    </Menu.Item>
                </Menu.Items>
            </Transition>
        </Menu>
    );
}
