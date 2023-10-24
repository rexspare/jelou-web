import React, { useEffect, useRef, useState } from "react";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import { useDispatch, useSelector } from "react-redux";
import { Disclosure, Transition, Tab } from "@headlessui/react";
import { setActualTray, setShowChat } from "@apps/redux/store";
import { useTranslation } from "react-i18next";
import {
    BlueFlagIcon,
    BorderSendIcon,
    createEmailPermission,
    CheckCircleIcon,
    ClockIcon,
    ClosedMailIcon,
    DocumentIcon,
    ExpiredIcon,
    GreenFlagIcon,
    LabelIcon,
    ModernMailIcon,
    OpenMailIcon,
    RedFlagIcon,
    ReloadIcon,
    StarFillIcon,
    StarIcon1,
    YellowFlagIcon,
} from "@apps/shared/icons";
import dayjs from "dayjs";

const EmailSidebar = (props) => {
    const {
        getEmails,
        setShowEmail,
        cleanFilters,
        actualPage,
        setActualPage,
        isFavorite,
        setIsFavorite,
        status,
        setStatus,
        priority,
        setPriority,
        dueDate,
        setDueDate,
        ticketTags,
        setEmailsTags,
        user,
        createEmailPermission,
        onCreateEmail,
    } = props;
    const { t } = useTranslation();
    const tags = useSelector((state) => state.tags);
    const actualEmails = useSelector((state) => state.actualEmails);
    const expiredEmails = useSelector((state) => state.expiredEmails);
    const notReadEmails = useSelector((state) => state.notReadEmails);
    const emailQuerySearch = useSelector((state) => state.emailQuerySearch);
    const emailSearchBy = useSelector((state) => state.emailSearchBy);
    const actualTray = useSelector((state) => state.actualTray);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const sidebar = useRef(null);
    const dispatch = useDispatch();

    useEffect(() => {
        if (!isEmpty(user)) {
            getEmails();
        }
    }, [user, actualPage, status, ticketTags, priority, isFavorite, emailQuerySearch, emailSearchBy, dueDate]);

    useEffect(() => {
        if (isEmpty(actualTray)) {
            dispatch(setActualTray("InAtention"));
        }
    }, [actualTray]);

    return (
        <div className="relative my-12 flex-1 flex-col overflow-y-auto overflow-x-hidden sm:mt-0 md:mb-14 mid:mb-0" ref={sidebar}>
            {createEmailPermission && (
                <div className={`hidden items-center px-8 pt-6 lg:flex`}>
                    <button
                        className="hover:bg-primary-light flex items-center justify-center rounded-full border-transparent bg-primary-200 px-4 py-2 outline-none focus:outline-none"
                        onClick={() => {
                            onCreateEmail();
                        }}>
                        <span className="flex items-center justify-center text-sm font-bold text-white">
                            <span className="pr-1 text-15">+ </span>
                            {t("pma.createEmail")}
                        </span>
                    </button>
                </div>
            )}
            <Tab.Group selectedIndex={selectedIndex} onChange={setSelectedIndex}>
                <Disclosure defaultOpen={true}>
                    {({ open }) => (
                        <div className="flex flex-col">
                            <Disclosure.Button className="flex w-full items-center space-x-2 px-8 py-2 pb-2 sm:pt-8">
                                <svg
                                    viewBox="0 0 20 20"
                                    className={`mr-2 h-5 w-5 fill-current text-gray-400 transition-all ${!open ? "-rotate-90" : ""} `}>
                                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                                </svg>
                                <span className="font-bold text-gray-500">{actualEmails}</span>
                                <p className="font-semibold text-gray-500">{actualEmails === 1 ? "Email" : t("pma.Emails")}</p>
                            </Disclosure.Button>
                            <Transition
                                show={open}
                                enter="transition duration-100 ease-out"
                                enterFrom="transform scale-95 opacity-0"
                                enterTo="transform scale-100 opacity-100"
                                leave="transition duration-75 ease-out"
                                leaveFrom="transform scale-100 opacity-100"
                                leaveTo="transform scale-95 opacity-0">
                                <Disclosure.Panel>
                                    <div className="flex w-full flex-col">
                                        <Tab.List>
                                            <Tab
                                                key={0}
                                                className={({ selected }) =>
                                                    selected
                                                        ? "w-full bg-primary-10 text-sm font-bold text-primary-200"
                                                        : "w-full text-sm font-normal text-gray-500 hover:bg-hover-conversation"
                                                }>
                                                <div
                                                    className="flex w-full cursor-pointer items-center space-x-5 px-8 py-3"
                                                    onClick={() => {
                                                        dispatch(setActualTray("InAtention"));
                                                        cleanFilters();
                                                        setShowEmail(false);
                                                        // dispatch(setShowChat());
                                                    }}>
                                                    <ModernMailIcon height="1rem" width="1.2rem" className="fill-current" fillOpacity="0.75" />
                                                    <p>
                                                        {t("pma.En Atención")}
                                                        <span className="ml-2 rounded-full bg-gray-300 px-2 font-bold text-gray-500">
                                                            {notReadEmails} {t("pma.sin leer")}
                                                        </span>
                                                    </p>
                                                </div>
                                            </Tab>
                                            <Tab
                                                key={1}
                                                className={({ selected }) =>
                                                    selected
                                                        ? "w-full bg-[#FFE185] bg-opacity-25 font-semibold text-secondary-150"
                                                        : "w-full text-gray-500 hover:bg-hover-conversation"
                                                }>
                                                <div
                                                    className="flex w-full cursor-pointer items-center space-x-5 px-8 py-3"
                                                    onClick={() => {
                                                        setShowEmail(false);
                                                        setStatus({});
                                                        setActualPage(1);
                                                        setIsFavorite(true);
                                                        setPriority({});
                                                        setDueDate({});
                                                        setEmailsTags({});
                                                        dispatch(setActualTray("InFavorites"));
                                                    }}>
                                                    {isFavorite === true ? (
                                                        <StarFillIcon height="1.1rem" width="1.2rem" className="fill-current text-[#D39C00]" />
                                                    ) : (
                                                        <StarIcon1 height="1rem" width="1.2rem" className="fill-current" />
                                                    )}
                                                    <p className="text-sm">{t("pma.Favoritos")}</p>
                                                </div>
                                            </Tab>
                                            {true && (
                                                <Tab
                                                    key={2}
                                                    className={({ selected }) =>
                                                        selected
                                                            ? "w-full bg-hover-conversation text-sm font-bold text-primary-200"
                                                            : "w-full text-sm text-gray-500 hover:bg-hover-conversation"
                                                    }>
                                                    <div
                                                        className="flex w-full items-center space-x-5 px-8 py-3"
                                                        onClick={() => {
                                                            setStatus("draft");
                                                            setShowEmail(false);
                                                            // dispatch(toggleShowChat());
                                                            dispatch(setActualTray("draft"));
                                                        }}>
                                                        <DocumentIcon
                                                            width="1.1875rem"
                                                            height="1.1875rem"
                                                            className="fill-current text-gray-400"
                                                            fillOpacity="0.75"
                                                        />

                                                        <p>{t("pma.drafts")}</p>
                                                    </div>
                                                </Tab>
                                            )}
                                            {true && (
                                                <Tab
                                                    key={3}
                                                    className={({ selected }) =>
                                                        selected
                                                            ? "w-full bg-hover-conversation text-sm font-bold text-primary-200"
                                                            : "w-full text-sm text-gray-500 hover:bg-hover-conversation"
                                                    }>
                                                    <div
                                                        className="flex w-full items-center space-x-5 px-8 py-3"
                                                        onClick={() => {
                                                            cleanFilters();
                                                            setShowEmail(false);
                                                            // dispatch(toggleShowChat());
                                                            dispatch(setActualTray("sentByOperator"));
                                                        }}>
                                                        <BorderSendIcon width="1rem" height="1rem" className=" fill-current" fillOpacity="0.75" />

                                                        <p>{t("pma.Enviados por Operador")}</p>
                                                    </div>
                                                </Tab>
                                            )}
                                            <Tab
                                                key={4}
                                                className={({ selected }) =>
                                                    selected
                                                        ? "w-full bg-hover-conversation font-semibold text-gray-700"
                                                        : "w-full text-gray-500 hover:bg-hover-conversation"
                                                }>
                                                <div
                                                    className="flex w-full cursor-pointer items-center space-x-5 px-8 py-3"
                                                    onClick={() => {
                                                        setStatus({});
                                                        setActualPage(1);
                                                        setIsFavorite({});
                                                        setPriority("urgent");
                                                        setDueDate({});
                                                        setEmailsTags({});
                                                        setShowEmail(false);
                                                        dispatch(setActualTray("urgent"));
                                                    }}>
                                                    <RedFlagIcon height="1.2rem" width="1.2rem" className="fill-current opacity-55" />
                                                    <p className="text-sm">{t("pma.Urgente")}</p>
                                                </div>
                                            </Tab>
                                            <Tab
                                                key={5}
                                                className={({ selected }) =>
                                                    selected
                                                        ? "w-full bg-hover-conversation font-semibold text-gray-700"
                                                        : "w-full text-gray-500 hover:bg-hover-conversation"
                                                }>
                                                <div
                                                    className="group flex w-full cursor-pointer items-center space-x-5 px-8 py-3 focus:bg-hover-conversation"
                                                    onClick={() => {
                                                        setStatus({});
                                                        setActualPage(1);
                                                        setIsFavorite({});
                                                        setPriority("high");
                                                        setDueDate({});
                                                        setEmailsTags({});
                                                        setShowEmail(false);
                                                        dispatch(setActualTray("high"));
                                                    }}>
                                                    <YellowFlagIcon
                                                        height="1.2rem"
                                                        width="1.2rem"
                                                        className="fill-current text-gray-500 opacity-55 group-focus:text-gray-700"
                                                    />
                                                    <p className="text-sm text-gray-500 group-focus:font-semibold">{t("pma.Alta")}</p>
                                                </div>
                                            </Tab>
                                            <Tab
                                                key={6}
                                                className={({ selected }) =>
                                                    selected
                                                        ? "w-full bg-hover-conversation font-semibold text-gray-700"
                                                        : "w-full text-gray-500 hover:bg-hover-conversation"
                                                }>
                                                <div
                                                    className="group flex w-full cursor-pointer items-center space-x-5 px-8 py-3 focus:bg-hover-conversation"
                                                    onClick={() => {
                                                        setStatus({});
                                                        setActualPage(1);
                                                        setIsFavorite({});
                                                        setPriority("normal");
                                                        setDueDate({});
                                                        setEmailsTags({});
                                                        setShowEmail(false);
                                                        dispatch(setActualTray("normal"));
                                                    }}>
                                                    <GreenFlagIcon
                                                        height="1.2rem"
                                                        width="1.2rem"
                                                        className="fill-current text-gray-500 opacity-55 group-focus:text-gray-700"
                                                    />
                                                    <p className="l text-sm text-gray-500 group-focus:font-semibold">{t("pma.Normal")}</p>
                                                </div>
                                            </Tab>
                                            <Tab
                                                key={7}
                                                className={({ selected }) =>
                                                    selected
                                                        ? "w-full bg-hover-conversation font-semibold text-gray-700"
                                                        : "w-full text-gray-500 hover:bg-hover-conversation"
                                                }>
                                                <div
                                                    className="group flex w-full cursor-pointer items-center space-x-5 px-8 py-3 focus:bg-hover-conversation"
                                                    onClick={() => {
                                                        setStatus({});
                                                        setActualPage(1);
                                                        setIsFavorite({});
                                                        setPriority("low");
                                                        setDueDate({});
                                                        setEmailsTags({});
                                                        dispatch(setActualTray("low"));
                                                        setShowEmail(false);
                                                    }}>
                                                    <BlueFlagIcon
                                                        height="1.2rem"
                                                        width="1.2rem"
                                                        className="fill-current text-gray-500 opacity-55 group-focus:text-gray-700"
                                                    />
                                                    <p className="l text-sm text-gray-500 group-focus:font-semibold">{t("pma.Baja")}</p>
                                                </div>
                                            </Tab>
                                        </Tab.List>
                                    </div>
                                </Disclosure.Panel>
                            </Transition>
                        </div>
                    )}
                </Disclosure>

                <Disclosure defaultOpen={true}>
                    {({ open }) => (
                        <div className="flex flex-col">
                            <Disclosure.Button className="flex w-full items-center space-x-2 px-8 pt-8 pb-2">
                                <svg
                                    viewBox="0 0 20 20"
                                    className={`mr-2 h-5 w-5 fill-current text-gray-400 transition-all ${!open ? "-rotate-90" : ""} `}>
                                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                                </svg>
                                <p className="font-semibold text-gray-500">{t("pma.Estados")}</p>
                            </Disclosure.Button>
                            <Transition
                                show={open}
                                enter="transition duration-100 ease-out"
                                enterFrom="transform scale-95 opacity-0"
                                enterTo="transform scale-100 opacity-100"
                                leave="transition duration-75 ease-out"
                                leaveFrom="transform scale-100 opacity-100"
                                leaveTo="transform scale-95 opacity-0">
                                <Disclosure.Panel>
                                    <div className="flex w-full flex-col pb-4">
                                        <Tab.List>
                                            <Tab
                                                key={8}
                                                className={({ selected }) =>
                                                    selected
                                                        ? "w-full bg-hover-conversation font-semibold text-gray-700"
                                                        : "w-full text-gray-500 hover:bg-hover-conversation"
                                                }>
                                                <div
                                                    className="group flex w-full cursor-pointer items-center space-x-5 px-8 py-3 focus:bg-hover-conversation"
                                                    onClick={() => {
                                                        setStatus("new");
                                                        setActualPage(1);
                                                        setIsFavorite({});
                                                        setPriority({});
                                                        setDueDate({});
                                                        setEmailsTags({});
                                                        setShowEmail(false);
                                                        dispatch(setActualTray("inNewMails"));
                                                    }}>
                                                    <ReloadIcon
                                                        height="1rem"
                                                        width="1.15rem"
                                                        className="fill-current text-gray-500 group-focus:text-gray-700"
                                                    />
                                                    <p className="text-sm text-gray-500 group-focus:font-semibold">{t("pma.Nuevos")}</p>
                                                </div>
                                            </Tab>
                                            <Tab
                                                key={9}
                                                className={({ selected }) =>
                                                    selected
                                                        ? "w-full bg-hover-conversation font-semibold text-gray-700"
                                                        : "w-full text-gray-500 hover:bg-hover-conversation"
                                                }>
                                                <div
                                                    className="group flex w-full cursor-pointer items-center space-x-5 px-8 py-3 focus:bg-hover-conversation"
                                                    onClick={() => {
                                                        setStatus("open");
                                                        setActualPage(1);
                                                        setIsFavorite({});
                                                        setPriority({});
                                                        setDueDate({});
                                                        setEmailsTags({});
                                                        setShowEmail(false);
                                                        dispatch(setActualTray("inOpenMails"));
                                                    }}>
                                                    <OpenMailIcon
                                                        height="1rem"
                                                        width="1.2rem"
                                                        className="fill-current text-gray-500 group-focus:text-gray-700"
                                                    />
                                                    <p className="text-sm text-gray-500 group-focus:font-semibold">{t("pma.Abiertos")}</p>
                                                </div>
                                            </Tab>
                                            <Tab
                                                key={10}
                                                className={({ selected }) =>
                                                    selected
                                                        ? "w-full bg-hover-conversation font-semibold text-gray-700"
                                                        : "w-full text-gray-500 hover:bg-hover-conversation"
                                                }>
                                                <div
                                                    className="group flex w-full cursor-pointer items-center space-x-5 px-8 py-3 focus:bg-hover-conversation"
                                                    onClick={() => {
                                                        setStatus("pending");
                                                        setActualPage(1);
                                                        setIsFavorite({});
                                                        setPriority({});
                                                        setDueDate({});
                                                        setEmailsTags({});
                                                        setShowEmail(false);
                                                        dispatch(setActualTray("inPendingMails"));
                                                    }}>
                                                    <ClockIcon
                                                        height="1.2rem"
                                                        width="1.2rem"
                                                        className="fill-current text-gray-500 group-focus:text-gray-700"
                                                        fillOpacity={"0.6"}
                                                    />
                                                    <p className="text-sm text-gray-500 group-focus:font-semibold">{t("pma.Pendientes")}</p>
                                                </div>
                                            </Tab>

                                            <Tab
                                                key={11}
                                                className={({ selected }) =>
                                                    selected
                                                        ? "w-full bg-hover-conversation font-semibold text-gray-700"
                                                        : "w-full text-gray-500 hover:bg-hover-conversation"
                                                }>
                                                <div
                                                    className="group flex w-full cursor-pointer items-center space-x-5 px-8 py-3 focus:bg-hover-conversation"
                                                    onClick={() => {
                                                        setStatus("resolved");
                                                        setActualPage(1);
                                                        setIsFavorite({});
                                                        setPriority({});
                                                        setDueDate({});
                                                        setEmailsTags({});
                                                        setShowEmail(false);
                                                        dispatch(setActualTray("inSolvedMails"));
                                                    }}>
                                                    <CheckCircleIcon
                                                        height="1.2rem"
                                                        width="1.2rem"
                                                        className="fill-current text-gray-500 group-focus:text-gray-700"
                                                        fillOpacity={"0.6"}
                                                    />
                                                    <p className="text-sm text-gray-500 group-focus:font-semibold">{t("pma.Resueltos")}</p>
                                                </div>
                                            </Tab>

                                            <Tab
                                                key={12}
                                                className={({ selected }) =>
                                                    selected
                                                        ? "w-full cursor-pointer bg-hover-conversation font-semibold text-gray-700"
                                                        : "w-full cursor-pointer text-gray-500 hover:bg-hover-conversation"
                                                }>
                                                <div
                                                    className="group flex w-full items-center space-x-5 px-8 py-3 focus:bg-hover-conversation"
                                                    onClick={() => {
                                                        setStatus("closed");
                                                        setActualPage(1);
                                                        setIsFavorite({});
                                                        setPriority({});
                                                        setDueDate({});
                                                        setEmailsTags({});
                                                        setShowEmail(false);
                                                        dispatch(setActualTray("inClosedMails"));
                                                    }}>
                                                    <ClosedMailIcon
                                                        height="1.2rem"
                                                        width="1.2rem"
                                                        className="fill-current text-gray-500 group-focus:text-gray-700"
                                                        fillOpacity={"0.6"}
                                                    />
                                                    <p className="text-sm text-gray-500 group-focus:font-semibold">{t("pma.Cerrados")}</p>
                                                </div>
                                            </Tab>

                                            <Tab
                                                key={13}
                                                className={({ selected }) =>
                                                    selected
                                                        ? "w-full cursor-pointer bg-hover-conversation font-semibold text-gray-700"
                                                        : "w-full cursor-pointer text-gray-500 hover:bg-hover-conversation"
                                                }>
                                                <div
                                                    className="group flex w-full items-center space-x-5 px-8 py-3 focus:bg-hover-conversation"
                                                    onClick={() => {
                                                        setStatus({});
                                                        setActualPage(1);
                                                        setIsFavorite({});
                                                        setPriority({});
                                                        setEmailsTags({});
                                                        setDueDate(dayjs().add(3, "days").hour("23").minute("00").second("00").format());
                                                        setShowEmail(false);
                                                        dispatch(setActualTray("inExpiringMails"));
                                                    }}>
                                                    <ExpiredIcon
                                                        height="1rem"
                                                        width="1.2rem"
                                                        className="fill-current text-secondary-250 group-focus:text-gray-700"
                                                    />
                                                    <p className="text-sm text-secondary-250 group-focus:font-semibold">{t("pma.Por Expirar")}</p>
                                                    <span className="font-bold text-secondary-250">{expiredEmails}</span>
                                                </div>
                                            </Tab>
                                        </Tab.List>
                                    </div>
                                </Disclosure.Panel>
                            </Transition>
                        </div>
                    )}
                </Disclosure>

                <Disclosure defaultOpen={true}>
                    {({ open }) => (
                        <div className="flex flex-col">
                            <Disclosure.Button className="flex w-full items-center space-x-2 px-8 pt-8 pb-2">
                                <svg
                                    viewBox="0 0 20 20"
                                    className={`mr-2 h-5 w-5 fill-current text-gray-400 transition-all ${!open ? "-rotate-90" : ""} `}>
                                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                                </svg>
                                <p className="font-semibold text-gray-500">{t("pma.Etiquetas")}</p>
                            </Disclosure.Button>
                            <Transition
                                show={open}
                                enter="transition duration-100 ease-out"
                                enterFrom="transform scale-95 opacity-0"
                                enterTo="transform scale-100 opacity-100"
                                leave="transition duration-75 ease-out"
                                leaveFrom="transform scale-100 opacity-100"
                                leaveTo="transform scale-95 opacity-0">
                                <Disclosure.Panel>
                                    <div className="flex w-full flex-col pb-4">
                                        <Tab.List>
                                            {!isEmpty(tags) &&
                                                tags.map((tag) => {
                                                    return (
                                                        <Tab
                                                            key={tag.id}
                                                            className={({ selected }) =>
                                                                selected
                                                                    ? "w-full bg-hover-conversation font-semibold text-gray-700"
                                                                    : "w-full text-gray-500 hover:bg-hover-conversation"
                                                            }>
                                                            <div
                                                                className="group flex w-full cursor-pointer items-center px-8 py-3 focus:bg-hover-conversation"
                                                                onClick={() => {
                                                                    setStatus({});
                                                                    setActualPage(1);
                                                                    setIsFavorite({});
                                                                    setPriority({});
                                                                    setDueDate({});
                                                                    setEmailsTags(tag.id);
                                                                    setShowEmail(false);
                                                                    dispatch(setActualTray("tags"));
                                                                }}>
                                                                <LabelIcon height="1.25rem" width="1.20rem" fill={tag.color} />
                                                                <p className="ml-2 text-left text-sm text-gray-500 group-focus:font-semibold">
                                                                    {get(tag, "name.es")}
                                                                </p>
                                                            </div>
                                                        </Tab>
                                                    );
                                                })}
                                        </Tab.List>
                                    </div>
                                </Disclosure.Panel>
                            </Transition>
                        </div>
                    )}
                </Disclosure>
            </Tab.Group>
        </div>
    );
};

export default EmailSidebar;
