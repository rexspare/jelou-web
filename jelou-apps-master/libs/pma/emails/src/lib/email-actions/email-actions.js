import Tippy from "@tippyjs/react";
import React, { Fragment, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Transition, Menu } from "@headlessui/react";
import isEmpty from "lodash/isEmpty";

import { useDispatch, useSelector } from "react-redux";
import { deleteEmailSearchBy, addEmailSearchBy, deleteEmailQuerySearch, addEmailQuerySearch } from "@apps/redux/store";
import { GlobalSearchPma } from "@apps/shared/common";
import {
    BlueFlagIcon,
    CheckCircleIcon,
    ClockIcon,
    EnvelopeOpenIcon,
    FlagIcon,
    ForwardIcon,
    GreenFlagIcon,
    ModernMailIcon,
    RedFlagIcon,
    RefreshIcon,
    StarIcon1,
    YellowFlagIcon,
} from "@apps/shared/icons";

const EmailActions = (props) => {
    const { showConfirmationModal, dataRow = [], getEmails, status, getNotReadEmails, getExpiredEmails, getAllEmails, sortedEmails } = props;
    const { t } = useTranslation();
    const isNotRead = (currentValue) => currentValue === true;
    const isResolved = (currentValue) => currentValue.original?.status === "resolved";
    const isPending = (currentValue) => currentValue.original?.status === "pending";
    const inClosedTickets = status === "closed";
    const inResolvedTickets = status === "resolved";
    const pendingSelected = dataRow?.every(isPending);
    const resolvedSelected = dataRow?.every(isResolved);
    const emailQuerySearch = useSelector((state) => state.emailQuerySearch);
    const emailSearchBy = useSelector((state) => state.emailSearchBy);
    const searchButton = useRef();
    const dispatch = useDispatch();

    const setArchivedSearch = (input) => {
        dispatch(addEmailQuerySearch(input));
    };

    const clearFilter = () => {
        if (!isEmpty(emailQuerySearch)) {
            dispatch(deleteEmailQuerySearch());
            dispatch(deleteEmailSearchBy());
        }
    };

    const setSearchBy = (search) => {
        if (!isEmpty(search)) {
            dispatch(addEmailSearchBy(search));
        } else {
            dispatch(deleteEmailSearchBy());
        }
    };

    const typeSearchBy = [
        { id: 0, name: "#", searchBy: "number", isNumber: true },
        { id: 3, name: "Asunto", searchBy: "title", isNumber: false },
        { id: 1, name: "Remitente", searchBy: "user.name,creationDetails.From", isNumber: false },
        { id: 2, name: "Destinatario", searchBy: "creationDetails.To", isNumber: false },
        {
            id: 4,
            name: "Contacto",
            searchBy: "user.name,creationDetails.To,creationDetails.From,creationDetails.CC,user.email",
            isNumber: false,
        },
        { id: 5, name: "CC", searchBy: "creationDetails.CC", isNumber: false },
    ];

    return (
        <div className="sticky top-0 z-20 mt-1 mb-1 flex w-full items-center bg-white px-4 pt-2 pb-1 mid:rounded-t-xl">
            <div className="flex w-full items-center space-x-6">
                <div className="w-71 p-3">
                    <GlobalSearchPma
                        searchButton={searchButton}
                        setQuery={setArchivedSearch}
                        query={emailQuerySearch}
                        searchBy={emailSearchBy}
                        setSearchBy={setSearchBy}
                        clean={clearFilter}
                        typeSearchBy={typeSearchBy}
                        placeholder={t("globalSearch.placeholder")}
                        type="tickets"
                    />
                    {!isEmpty(emailQuerySearch) && isEmpty(sortedEmails) && <span className="mt-1 flex justify-end text-11 italic text-red-675">*No se encontraron resultados</span>}
                </div>

                <div className="flex h-[2.2rem] items-center space-x-4 border-r-[.1rem] border-gray-200 pr-5">
                    <Tippy theme={"tomato"} content={t("pma.Refrescar")} arrow={false}>
                        <div
                            className="cursor-pointer"
                            onClick={() => {
                                getEmails();
                                getNotReadEmails();
                                getExpiredEmails();
                                getAllEmails();
                            }}
                        >
                            <RefreshIcon height="1.25rem" width="1.25rem" className="text-gray-425 hover:text-gray-500" />
                        </div>
                    </Tippy>
                    <Tippy theme={"tomato"} content={t("pma.Marcar como favorito")} arrow={false}>
                        <div
                            disabled={inClosedTickets || dataRow?.length === 0}
                            className={"cursor-pointer disabled:cursor-not-allowed"}
                            onClick={() => showConfirmationModal({ label: "marcar como favorito", id: "FAVORITE" })}
                        >
                            <StarIcon1
                                height="1.2rem"
                                width="1.2rem"
                                className={`fill-current ${dataRow?.length > 0 && !inClosedTickets ? `text-gray-500` : "text-gray-300"}`}
                                fillOpacity={`${dataRow?.length > 0 && !inClosedTickets ? "1" : "0.75"}`}
                            />
                        </div>
                    </Tippy>
                    {dataRow?.length === dataRow.every(isNotRead) || dataRow.some((el) => el.original.read === false) || inClosedTickets ? (
                        <Tippy theme={"tomato"} content={t("pma.Marcar como leído")} arrow={false}>
                            <div
                                disabled={inClosedTickets || dataRow?.length === 0}
                                className={"cursor-pointer disabled:cursor-not-allowed"}
                                onClick={() => showConfirmationModal({ label: "marcar como leído", id: "READ" })}
                            >
                                <EnvelopeOpenIcon
                                    height="1.2rem"
                                    width="1.2rem"
                                    className={`fill-current  ${dataRow?.length > 0 && !inClosedTickets ? `text-gray-500` : "text-gray-300"}`}
                                    fillOpacity={`${dataRow?.length > 0 && !inClosedTickets ? "1" : "0.75"}`}
                                />
                            </div>
                        </Tippy>
                    ) : dataRow?.length === 1 && dataRow.some((el) => el.original.read) === false ? (
                        <Tippy theme={"tomato"} content={t("pma.Marcar como no leído")} arrow={false}>
                            <div
                                disabled={inClosedTickets || dataRow?.length === 0}
                                className={"cursor-pointer disabled:cursor-not-allowed"}
                                onClick={() => showConfirmationModal({ label: "marcar como no leído", id: "NOT_READ" })}
                            >
                                <ModernMailIcon
                                    height="1.3rem"
                                    width="1.3rem"
                                    className={`fill-current  ${dataRow?.length > 0 && !inClosedTickets ? `text-gray-500` : "text-gray-300"}`}
                                    fillOpacity={`${dataRow?.length > 0 && !inClosedTickets ? "1" : "0.75"}`}
                                />
                            </div>
                        </Tippy>
                    ) : (
                        <Tippy theme={"tomato"} content={t("pma.Marcar como no leído")} arrow={false}>
                            <div
                                disabled={inClosedTickets || dataRow?.length === 0}
                                className={"cursor-pointer disabled:cursor-not-allowed"}
                                onClick={() => showConfirmationModal({ label: "marcar como no leído", id: "NOT_READ" })}
                            >
                                <ModernMailIcon
                                    height="1.3rem"
                                    width="1.3rem"
                                    className={`fill-current  ${dataRow?.length > 0 && !inClosedTickets ? `text-gray-500` : "text-gray-300"}`}
                                    fillOpacity={`${dataRow?.length > 0 && !inClosedTickets ? "1" : "0.75"}`}
                                />
                            </div>
                        </Tippy>
                    )}
                </div>
                <div className="flex h-[2.2rem] items-center space-x-4 border-r-[.1rem] border-gray-200 pr-5 ">
                    <Tippy theme={"tomato"} content={t("pma.Marcar como resuelto")} arrow={false}>
                        <div
                            disabled={inClosedTickets || inResolvedTickets || resolvedSelected}
                            className={"cursor-pointer disabled:cursor-not-allowed"}
                            onClick={() => showConfirmationModal({ label: "marcar como resuelto", id: "RESOLVED" })}
                        >
                            <CheckCircleIcon
                                height="1.25rem"
                                width="1.25rem"
                                className={`fill-current  ${dataRow?.length > 0 && !inClosedTickets && !resolvedSelected ? `text-gray-500` : "text-gray-300"}`}
                                fillOpacity={`${dataRow?.length > 0 && !inClosedTickets && !resolvedSelected ? "1" : "0.6"}`}
                            />
                        </div>
                    </Tippy>
                    <Tippy theme={"tomato"} content={t("pma.Marcar como pendiente")} arrow={false}>
                        <div
                            disabled={inClosedTickets || pendingSelected}
                            className={"cursor-pointer disabled:cursor-not-allowed"}
                            onClick={() => showConfirmationModal({ label: "marcar como pendiente", id: "PENDING" })}
                        >
                            <ClockIcon
                                height="1.27rem"
                                width="1.27rem"
                                fillOpacity={`${dataRow?.length > 0 && !inClosedTickets && !pendingSelected ? "1" : "0.6"}`}
                                className={`fill-current ${dataRow?.length > 0 && !inClosedTickets && !pendingSelected ? `text-gray-500` : "text-gray-300"}`}
                            />
                        </div>
                    </Tippy>
                </div>
                <div className=" flex h-[2.2rem] items-center space-x-4 pr-5 ">
                    <Tippy theme={"tomato"} content={t("pma.Transferir")} arrow={false}>
                        <div
                            disabled={dataRow?.length === 0 || inClosedTickets}
                            className={"cursor-pointer disabled:cursor-not-allowed"}
                            onClick={() => showConfirmationModal({ label: "transferir", id: "TRANSFER" })}
                        >
                            <ForwardIcon
                                height="1.25rem"
                                width="1.25rem"
                                className={`fill-current ${dataRow?.length > 0 && !inClosedTickets ? `text-gray-500` : "text-gray-300"}`}
                                fillOpacity={`${dataRow?.length > 0 && !inClosedTickets ? "1" : "0.6"}`}
                            />
                        </div>
                    </Tippy>
                    <Menu as="div" className="relative inline-block text-left">
                        <Menu.Button className="flex items-center">
                            <Tippy theme={"tomato"} content={t("pma.Prioridad")} arrow={false}>
                                <div disabled={inClosedTickets || dataRow?.length === 0} className={"cursor-pointer disabled:cursor-not-allowed"}>
                                    <FlagIcon
                                        height="1.25rem"
                                        width="1.25rem"
                                        className={`fill-current  ${dataRow?.length > 0 && !inClosedTickets ? `text-gray-500` : "text-gray-300"}`}
                                        fillOpacity={`${dataRow?.length > 0 && !inClosedTickets ? "1" : "0.6"}`}
                                    />
                                </div>
                            </Tippy>
                        </Menu.Button>
                        {dataRow?.length > 0 && (
                            <Transition
                                as={Fragment}
                                enter="transition duration-100 ease-out"
                                enterFrom="transform scale-95 opacity-0"
                                enterTo="transform scale-100 opacity-100"
                                leave="transition duration-75 ease-out"
                                leaveFrom="transform scale-100 opacity-100"
                                leaveTo="transform scale-95 opacity-0"
                            >
                                <Menu.Items className="divide-y ring-opacity-5 ring-1 absolute left-0 z-20 mt-2 w-36 origin-top-left space-y-2 divide-gray-100 divide-gray-400/75 rounded-md bg-white p-3 shadow-lg ring-transparent focus:outline-none">
                                    <Menu.Item>
                                        {({ active }) => (
                                            <button
                                                className="flex items-center"
                                                onClick={() =>
                                                    showConfirmationModal({
                                                        label: "marcar como prioridad Urgente",
                                                        id: "priority",
                                                        priorityType: "urgent",
                                                    })
                                                }
                                            >
                                                <RedFlagIcon height="1.26rem" width="1.26rem" className="group-hover:text-teal group-focus:text-teal fill-current text-gray-400 opacity-55" />
                                                <span className="ml-2 font-bold capitalize text-[#B95C49]">{t("pma.Urgente")}</span>
                                            </button>
                                        )}
                                    </Menu.Item>
                                    <Menu.Item>
                                        {({ active }) => (
                                            <button
                                                className="flex items-center"
                                                onClick={() =>
                                                    showConfirmationModal({
                                                        label: "marcar como prioridad Alta",
                                                        id: "priority",
                                                        priorityType: "high",
                                                    })
                                                }
                                            >
                                                <YellowFlagIcon height="1.26rem" width="1.26rem" className="group-hover:text-teal group-focus:text-teal fill-current text-gray-400 opacity-55" />
                                                <span className="ml-2 font-bold capitalize text-[#D39C00]">{t("pma.Alta")}</span>
                                            </button>
                                        )}
                                    </Menu.Item>
                                    <Menu.Item>
                                        {({ active }) => (
                                            <button
                                                className="flex items-center"
                                                onClick={() =>
                                                    showConfirmationModal({
                                                        label: "marcar como prioridad normal",
                                                        id: "priority",
                                                        priorityType: "normal",
                                                    })
                                                }
                                            >
                                                <GreenFlagIcon height="1.26rem" width="1.26rem" className="group-hover:text-teal group-focus:text-teal fill-current text-gray-400 opacity-55" />
                                                <span className="ml-2 font-bold capitalize text-[#209F8B]">{t("pma.Normal")}</span>
                                            </button>
                                        )}
                                    </Menu.Item>
                                    <Menu.Item>
                                        {({ active }) => (
                                            <button
                                                className="flex items-center"
                                                onClick={() =>
                                                    showConfirmationModal({
                                                        label: "marcar como prioridad baja",
                                                        id: "priority",
                                                        priorityType: "low",
                                                    })
                                                }
                                            >
                                                <BlueFlagIcon height="1.26rem" width="1.26rem" className="group-hover:text-teal group-focus:text-teal fill-current text-gray-400 opacity-55" />
                                                <span className="ml-2 font-bold capitalize text-[#00B3C7] ">{t("pma.Baja")}</span>
                                            </button>
                                        )}
                                    </Menu.Item>
                                    <Menu.Item>
                                        {({ active }) => (
                                            <button
                                                className="flex items-center"
                                                onClick={() =>
                                                    showConfirmationModal({
                                                        label: "marcar prioridad como ninguna",
                                                        id: "priority",
                                                        priorityType: "none",
                                                    })
                                                }
                                            >
                                                <FlagIcon height="1.26rem" width="1.26rem" className={`fill-current  ${dataRow?.length > 0 ? `text-gray-500` : "text-gray-300"}`} />
                                                <span className="ml-2 font-bold capitalize text-gray-400">{t("pma.Ninguna")}</span>
                                            </button>
                                        )}
                                    </Menu.Item>
                                </Menu.Items>
                            </Transition>
                        )}
                    </Menu>
                </div>
            </div>
        </div>
    );
};

export default EmailActions;
