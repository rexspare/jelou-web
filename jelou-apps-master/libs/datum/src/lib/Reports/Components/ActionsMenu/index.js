import React, { Fragment } from "react";
import { Arrow } from "../../../../Icons/Arrow";
import { Transition, Menu } from "@headlessui/react";
import { useTranslation } from "react-i18next";

export function ActionsMenu() {
    const { t } = useTranslation();
    return (
        <Menu as="div" className="relative z-10 flex flex-col items-start">
            <Menu.Button className="ml-2 cursor-pointer">
                <Arrow color="#00B3C7" />
            </Menu.Button>

            <Transition
                as={Fragment}
                enter="transition-opacity ease-out duration-100"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="transition-opacity ease-in duration-150"
                leaveFrom="opacity-100"
                leaveTo="opacity-0">
                <Menu.Items as="section" className="absolute top-[0.9375rem] w-48 rounded-xl bg-white shadow-lg outline-none">
                    <Menu.Item as="div" className="border-b border-gray-400 border-opacity-10">
                        <button className="w-32 py-4 ml-5 text-sm text-left text-gray-400">{t("common.showHistory")}</button>
                    </Menu.Item>
                    <Menu.Item as="div" className="border-b border-gray-400 border-opacity-10">
                        <button className="py-4 mx-5 text-sm text-left text-gray-400 w-36">{t("common.editDatabase")}</button>
                    </Menu.Item>
                    <Menu.Item as="div" className="border-b border-gray-400 border-opacity-10">
                        <button className="w-32 py-4 ml-5 text-sm text-left text-gray-400">{t("common.changeName")}</button>
                    </Menu.Item>
                    <Menu.Item as="div" className="border-b border-gray-400 border-opacity-10">
                        <button className="w-32 py-4 ml-5 text-sm text-left text-gray-400">{t("common.duplicate")}</button>
                    </Menu.Item>
                    <Menu.Item as="button" className="w-32 py-4 ml-5 text-sm text-left text-gray-400">
                    {t("common.delete")}
                    </Menu.Item>
                </Menu.Items>
            </Transition>
        </Menu>
    );
}
