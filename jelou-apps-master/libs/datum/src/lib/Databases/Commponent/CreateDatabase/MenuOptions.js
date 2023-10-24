import { Fragment, useState } from "react";
import { Listbox, Menu, Transition } from "@headlessui/react";
import { useTranslation } from "react-i18next";

import { DownIcon, MoreOptionsIcon } from "@apps/shared/icons";
import { FILTERS_INPUTS } from "../../../constants";

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
                <Menu.Items as="ul" className="absolute right-0 overflow-hidden bg-white z-120 w-36 rounded-10 shadow-menu">
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
                            className="w-full px-4 py-2 font-bold text-left text-gray-400 text-13 hover:bg-primary-200 hover:bg-opacity-10 hover:text-primary-200 focus:outline-none">
                            {t("buttons.delete")}
                        </button>
                    </Menu.Item>
                </Menu.Items>
            </Transition>
        </Menu>
    );
};

export default MenuOptions;

export function SelectOptions({ setTypeColumn, hasError }) {
    const { t } = useTranslation();
    const [selected, setSelected] = useState(null);

    const handleChange = (option) => {
        setSelected(option);
        setTypeColumn(option.value);
    };

    return (
        <Listbox as="div" name="columnTypes" value={selected} onChange={handleChange}>
            <div className="relative mt-1">
                <Listbox.Button
                    as="button"
                    className={`flex w-full items-center justify-between rounded-10  py-2 pl-3 text-left font-medium text-gray-375 focus:outline-none focus-visible:ring-transparent ${
                        hasError
                            ? "border-2 border-red-950 bg-red-1010 bg-opacity-10 focus:border-red-950"
                            : "border-none bg-primary-700 focus:border-transparent"
                    }`}>
                    {selected ? <span className="block truncate">{selected.name}</span> : <span>{t("datum.chooseAType")}</span>}
                    <span className="flex items-center pr-2 pointer-events-none">
                        <DownIcon width="0.938rem" fill="#707C95" />
                    </span>
                </Listbox.Button>

                <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
                    <Listbox.Options
                        as="ul"
                        className="absolute w-full py-1 mt-1 overflow-auto text-base bg-white rounded-md shadow-lg max-h-60 text-gray-375 focus:outline-none">
                        {FILTERS_INPUTS.map((option, optionIdx) => (
                            <Listbox.Option
                                as="li"
                                key={optionIdx}
                                className={({ active }) => `relative cursor-pointer select-none py-2 pl-10 pr-4 ${active ? "bg-primary-700" : ""}`}
                                value={option}>
                                {({ selected }) => (
                                    <span className={`block truncate ${selected ? "font-medium" : "font-normal"}`}>{option.name}</span>
                                )}
                            </Listbox.Option>
                        ))}
                    </Listbox.Options>
                </Transition>
            </div>
        </Listbox>
    );
}
