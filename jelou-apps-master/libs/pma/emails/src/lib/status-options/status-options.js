import get from "lodash/get";
import toUpper from "lodash/toUpper";
import React, { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { DownIcon, ElipseIcon } from "@apps/shared/icons";

const StatusOptions = (props) => {
    const { setOpenDeleteModal, setOpenResolvedModal, setType, setState, bot } = props;
    const { t } = useTranslation();
    const currentEmail = useSelector((state) => state.currentEmail);
    const disabled = get(currentEmail, "status", "") === "closed";

    const dinamycEventId = get(bot, "properties.eventOnCloseTicket", "");

    const RenderButton = ({ status }) => {
        const base =
            "relative rounded-[1.0313rem] border-[0.0938rem] border-[#A6B4D080] h-[2.0625rem] w-[8.4rem] text-[0.9375rem] font-bold flex items-center space-x-2 px-2 justify-between select-none";

        switch (toUpper(status)) {
            case "NEW":
                return (
                    <div className={`${base} cursor-pointer text-secondary-150`}>
                        <div className="flex items-center space-x-2">
                            <ElipseIcon width=".75rem" height=".75rem" className="h-full fill-current text-secondary-150" />
                            <span className="mx-2 capitalize">{t(`emailStatus.${status}`)}</span>
                        </div>
                        <DownIcon width="1rem" height="1rem" className="mt-[0.025rem] h-full fill-current text-gray-400/65" />
                    </div>
                );
            case "OPEN":
                return (
                    <div className={`${base} cursor-pointer text-[#42ADE2]`}>
                        <div className="flex items-center space-x-2">
                            <ElipseIcon width=".75rem" height=".75rem" className=" h-full fill-current text-[#42ADE2]" />
                            <span className="capitalize">{t(`emailStatus.${status}`)}</span>
                        </div>
                        <DownIcon width="1rem" height="1rem" className=" h-full fill-current text-gray-400/65" />
                    </div>
                );
            case "PENDING":
                return (
                    <div className={`${base} cursor-pointer text-[#B95C49]`}>
                        <div className="flex items-center space-x-2">
                            <ElipseIcon width=".75rem" height=".75rem" className=" h-full fill-current text-[#B95C49]" />
                            <span className="capitalize">{t(`emailStatus.${status}`)}</span>
                        </div>
                        <DownIcon width="1rem" height="1rem" className="h-full fill-current text-gray-400/65" />
                    </div>
                );
            case "RESOLVED":
                return (
                    <div className={`${base} cursor-pointer text-secondary-425`}>
                        <div className="flex items-center space-x-2">
                            <ElipseIcon width=".75rem" height=".75rem" className=" h-full fill-current text-secondary-425" />
                            <span className="capitalize">{t(`emailStatus.${status}`)}</span>
                        </div>
                        <DownIcon width="1rem" height="1rem" className="h-full fill-current text-gray-400/65" />
                    </div>
                );

            case "CLOSED":
                return (
                    <div className={`${base} cursor-pointer text-gray-400`}>
                        <div className="flex items-center space-x-2">
                            <ElipseIcon width=".75rem" height=".75rem" className="h-full fill-current text-gray-400" />
                            <span className="capitalize">{t(`emailStatus.${status}`)}</span>
                        </div>
                        <DownIcon width="1rem" height="1rem" className="h-full fill-current text-gray-400/65" />
                    </div>
                );
            default:
                return (
                    <div className={`${base} cursor-pointer text-secondary-150`}>
                        <div className="flex items-center space-x-2">
                            <ElipseIcon width=".75rem" height=".75rem" className="h-full fill-current text-secondary-150" />
                            <span className="capitalize">{t(`emailStatus.${status}`)}</span>
                        </div>
                        <DownIcon width="1rem" height="1rem" className="h-full fill-current text-gray-400/65" />
                    </div>
                );
        }
    };

    return (
        <Menu as="div" className="relative inline-block text-left">
            <Menu.Button disabled={disabled} className="disabled:cursor-not-allowed">
                <RenderButton status={get(currentEmail, "status", "open")} />
            </Menu.Button>

            <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95">
                <Menu.Items className="divide-y ring-opacity-5 ring-1 absolute left-0 z-20 mt-2 w-56 origin-top-left divide-gray-400/75 rounded-md bg-white shadow-lg ring-transparent focus:outline-none">
                    <div className="px-1 py-1 ">
                        <Menu.Item>
                            {({ active }) => (
                                <div
                                    onClick={() => setState("new")}
                                    className={`${
                                        active ? "bg-hover-conversation" : "bg-transparent"
                                    } group relative flex w-full cursor-pointer items-center rounded-md px-2 py-2 text-[0.9375rem] text-secondary-150 `}>
                                    <ElipseIcon
                                        width=".75rem"
                                        height=".75rem"
                                        className="absolute inset-0 ml-2 h-full fill-current text-secondary-150"
                                    />
                                    <span className="ml-5 font-bold capitalize">{t("emailStatus.new")}</span>
                                </div>
                            )}
                        </Menu.Item>
                        <Menu.Item>
                            {({ active }) => (
                                <div
                                    onClick={() => setState("open")}
                                    className={`${
                                        active ? "bg-hover-conversation" : "bg-transparent"
                                    } group relative flex w-full cursor-pointer items-center rounded-md px-2 py-2 text-[0.9375rem] text-[#42ADE2] `}>
                                    <ElipseIcon width=".75rem" height=".75rem" className="absolute inset-0 ml-2 h-full fill-current text-[#42ADE2]" />
                                    <span className="ml-5 font-bold capitalize">{t("emailStatus.open")}</span>
                                </div>
                            )}
                        </Menu.Item>

                        <Menu.Item>
                            {({ active }) => (
                                <div
                                    onClick={() => setState("pending")}
                                    className={`${
                                        active ? "bg-hover-conversation" : "bg-transparent"
                                    } group relative flex w-full cursor-pointer items-center rounded-md px-2 py-2 text-[0.9375rem] text-[#B95C49] `}>
                                    <ElipseIcon width=".75rem" height=".75rem" className="absolute inset-0 ml-2 h-full fill-current text-[#B95C49]" />
                                    <span className="ml-5 font-bold capitalize">{t("emailStatus.pending")}</span>
                                </div>
                            )}
                        </Menu.Item>

                        <Menu.Item>
                            {({ active }) => (
                                <div
                                    onClick={() => {
                                        setType({ label: "marcar como resuelto", id: "RESOLVED" });
                                        setOpenResolvedModal(true);
                                    }}
                                    className={`${
                                        active ? "bg-hover-conversation" : "bg-transparent"
                                    } group relative flex w-full cursor-pointer items-center rounded-md px-2 py-2 text-[0.9375rem] text-secondary-425 `}>
                                    <ElipseIcon
                                        width=".75rem"
                                        height=".75rem"
                                        className="absolute inset-0 ml-2 h-full fill-current text-secondary-425"
                                    />
                                    <span className="ml-5 font-bold capitalize">{t("emailStatus.resolved")}</span>
                                </div>
                            )}
                        </Menu.Item>

                        <Menu.Item>
                            {({ active }) => (
                                <div
                                    onClick={() => {
                                        setType({ label: "marcar como cerrado", id: "CLOSED", key: dinamycEventId });
                                        setOpenDeleteModal(true);
                                    }}
                                    className={`${
                                        active ? "bg-hover-conversation" : "bg-transparent"
                                    } group relative flex w-full cursor-pointer items-center rounded-md px-2 py-2 text-[0.9375rem] text-gray-400 `}>
                                    <ElipseIcon width=".75rem" height=".75rem" className="absolute inset-0 ml-2 h-full fill-current text-gray-400" />
                                    <span className="ml-5 font-bold capitalize">{t("emailStatus.closed")}</span>
                                </div>
                            )}
                        </Menu.Item>
                    </div>
                </Menu.Items>
            </Transition>
        </Menu>
    );
};

export default StatusOptions;
