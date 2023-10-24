import get from "lodash/get";
import Tippy from "@tippyjs/react";
import React, { Fragment } from "react";
import { Transition, Menu } from "@headlessui/react";
import { useTranslation } from "react-i18next";
import {
    BlueFlagIcon,
    CheckCircleIcon,
    ClockIcon,
    FlagIcon,
    ForwardIcon1,
    GreenFlagIcon,
    RedFlagIcon,
    StarFillIcon,
    StarIcon1,
    YellowFlagIcon,
} from "@apps/shared/icons";

const EmailAction = (props) => {
    const { currentEmail, settingFavorite, setType, setState, setOpenResolvedModal, setShowForwardModal, setPriority } = props;
    const { t } = useTranslation();
    const isClosed = get(currentEmail, "status", "") === "closed";
    const isResolved = get(currentEmail, "status", "") === "resolved";

    return (
        <>
            <div className="ml-10 flex h-[2.2rem] items-center space-x-4 border-r-[.05rem]  border-gray-400 border-opacity-40 pr-5">
                <Tippy theme={"tomato"} content={t("pma.Favoritos")} arrow={false}>
                    <button className="disabled:cursor-not-allowed" onClick={() => settingFavorite()} disabled={isClosed}>
                        {get(currentEmail, "isFavorite", false) ? (
                            <StarFillIcon height="1.2rem" width="1.2rem" className="fill-current text-[#D39C00]" />
                        ) : (
                            <StarIcon1
                                height="1.2rem"
                                width="1.2rem"
                                className={`fill-current text-gray-400 ${isClosed ? "" : "hover:text-gray-500"}`}
                            />
                        )}
                    </button>
                </Tippy>
                <Tippy theme={"tomato"} content={t("pma.Marcar como resuelto")} arrow={false}>
                    <button
                        className="disabled:cursor-not-allowed"
                        disabled={isClosed || isResolved}
                        onClick={() => {
                            setType({ label: "marcar como resuelto", id: "RESOLVED" });
                            setOpenResolvedModal(true);
                        }}>
                        <CheckCircleIcon
                            height="1.25rem"
                            width="1.25rem"
                            className={`fill-current text-gray-400 ${isClosed || isResolved ? "" : "hover:text-gray-500"}`}
                            fillOpacity={"1"}
                        />
                    </button>
                </Tippy>
                <Tippy theme={"tomato"} content={t("pma.Marcar como pendiente")} arrow={false}>
                    <button
                        className="disabled:cursor-not-allowed"
                        onClick={() => {
                            setState("pending");
                        }}
                        disabled={get(currentEmail, "status") === "pending" || isClosed}>
                        <ClockIcon
                            height="1.27rem"
                            width="1.27rem"
                            className={`fill-current text-gray-400 ${
                                get(currentEmail, "status") === "pending" || isClosed ? "" : "hover:text-gray-500"
                            }`}
                            fillOpacity={"1"}
                        />
                    </button>
                </Tippy>
            </div>
            <div className="ml-8 flex h-[2.2rem] items-center space-x-4 border-opacity-40 pr-5">
                <Tippy theme={"tomato"} content={t("pma.Transferir")} arrow={false}>
                    <button className="disabled:cursor-not-allowed" disabled={isClosed} onClick={() => setShowForwardModal(true)}>
                        <ForwardIcon1
                            stroke="rgb(156 163 175)"
                            height="1.25rem"
                            width="1.25rem"
                            className={`fill-current text-gray-400 ${isClosed ? "" : "hover:text-gray-500"}`}
                            fillOpacity={"1"}
                        />
                    </button>
                </Tippy>
                <Menu as="div" className="relative inline-block text-left">
                    <Tippy theme={"tomato"} content={t("pma.Prioridad")} arrow={false}>
                        <Menu.Button disabled={isClosed} className="flex items-center disabled:cursor-not-allowed">
                            {get(currentEmail, "priority") === "urgent" ? (
                                <RedFlagIcon height="1.26rem" width="1.26rem" />
                            ) : get(currentEmail, "priority") === "high" ? (
                                <YellowFlagIcon height="1.26rem" width="1.26rem" />
                            ) : get(currentEmail, "priority") === "normal" ? (
                                <GreenFlagIcon height="1.26rem" width="1.26rem" />
                            ) : get(currentEmail, "priority") === "low" ? (
                                <BlueFlagIcon height="1.26rem" width="1.26rem" />
                            ) : (
                                <FlagIcon
                                    height="1.26rem"
                                    width="1.26rem"
                                    className={`fill-current text-gray-400 ${isClosed ? "" : "hover:text-gray-500"}`}
                                    fillOpacity={"1"}
                                />
                            )}
                        </Menu.Button>
                    </Tippy>
                    <Transition
                        as={Fragment}
                        enter="transition duration-100 ease-out"
                        enterFrom="transform scale-95 opacity-0"
                        enterTo="transform scale-100 opacity-100"
                        leave="transition duration-75 ease-out"
                        leaveFrom="transform scale-100 opacity-100"
                        leaveTo="transform scale-95 opacity-0">
                        <Menu.Items className="divide-y ring-opacity-5 ring-1 absolute left-0 z-20 mt-2 w-36 origin-top-left space-y-2 divide-gray-400/75 rounded-md bg-white p-3 shadow-lg ring-transparent focus:outline-none">
                            <Menu.Item>
                                {({ active }) => (
                                    <button className="flex items-center" onClick={() => setPriority("urgent")}>
                                        <RedFlagIcon
                                            height="1.26rem"
                                            width="1.26rem"
                                            className="group-hover:text-teal group-focus:text-teal fill-current text-gray-400 opacity-55"
                                        />
                                        <span className="ml-2 font-bold capitalize text-[#B95C49]">{t("pma.Urgente")}</span>
                                    </button>
                                )}
                            </Menu.Item>
                            <Menu.Item>
                                {({ active }) => (
                                    <button className="flex items-center" onClick={() => setPriority("high")}>
                                        <YellowFlagIcon
                                            height="1.26rem"
                                            width="1.26rem"
                                            className="group-hover:text-teal group-focus:text-teal fill-current text-gray-400 opacity-55"
                                        />
                                        <span className="ml-2 font-bold capitalize text-[#D39C00]">{t("pma.Alta")}</span>
                                    </button>
                                )}
                            </Menu.Item>
                            <Menu.Item>
                                {({ active }) => (
                                    <button className="flex items-center" onClick={() => setPriority("normal")}>
                                        <GreenFlagIcon
                                            height="1.26rem"
                                            width="1.26rem"
                                            className="group-hover:text-teal group-focus:text-teal fill-current text-gray-400 opacity-55"
                                        />
                                        <span className="ml-2 font-bold capitalize text-[#209F8B]">{t("pma.Normal")}</span>
                                    </button>
                                )}
                            </Menu.Item>
                            <Menu.Item>
                                {({ active }) => (
                                    <button className="flex items-center" onClick={() => setPriority("low")}>
                                        <BlueFlagIcon
                                            height="1.26rem"
                                            width="1.26rem"
                                            className="group-hover:text-teal group-focus:text-teal fill-current text-gray-400 opacity-55"
                                        />
                                        <span className="ml-2 font-bold capitalize text-[#00B3C7] ">{t("pma.Baja")}</span>
                                    </button>
                                )}
                            </Menu.Item>
                            <Menu.Item>
                                {({ active }) => (
                                    <button className="flex items-center" onClick={() => setPriority("none")}>
                                        <FlagIcon
                                            height="1.26rem"
                                            width="1.26rem"
                                            className="group-hover:text-teal group-focus:text-teal fill-current text-gray-400 opacity-55"
                                        />
                                        <span className="ml-2 font-bold capitalize text-gray-400">{t("pma.Ninguna")}</span>
                                    </button>
                                )}
                            </Menu.Item>
                        </Menu.Items>
                    </Transition>
                </Menu>
            </div>
        </>
    );
};

export default EmailAction;
