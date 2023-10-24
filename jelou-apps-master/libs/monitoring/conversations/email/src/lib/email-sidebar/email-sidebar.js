import get from "lodash/get";
import isEmpty from "lodash/isEmpty";

import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Tab, Disclosure, Transition } from "@headlessui/react";

import {
    ClockIcon,
    LabelIcon,
    ReloadIcon,
    RedFlagIcon,
    ExpiredIcon,
    StarOutIcon,
    StarFillIcon,
    OpenMailIcon,
    BlueFlagIcon,
    GreenFlagIcon,
    ModernMailIcon,
    YellowFlagIcon,
    ClosedMailIcon,
    CheckCircleIcon,
} from "@apps/shared/icons";

export function EmailSidebar(props) {
    const { setStatus, setPriority, isFavorite, setIsFavorite, cleanFilters, setActualPage, actualEmails, setShowEmail } = props;
    const [selectedIndex, setSelectedIndex] = useState(0);
    const sidebar = useRef(null);

    //  const tags = useSelector((state) => state.tags);
    const tags = [];
    const [expiredEmails, setExpiredEmails] = useState(0);
    const [notReadEmails, setNotReadEmails] = useState(0);
    //  const ticketsQuerySearch = useSelector((state) => state.ticketsQuerySearch);
    //  const ticketsSearchBy = useSelector((state) => state.ticketsSearchBy);

    const { t } = useTranslation();

    return (
        <div className="relative h-full flex-1 flex-col overflow-y-auto overflow-x-hidden bg-white md:mb-14 lg:mb-0" ref={sidebar}>
            <Tab.Group selectedIndex={selectedIndex} onChange={setSelectedIndex}>
                <Disclosure defaultOpen={true}>
                    {({ open }) => (
                        <div className="flex flex-col">
                            <Disclosure.Button className="flex w-full items-center space-x-2 px-8 pt-8 pb-2">
                                <svg
                                    viewBox="0 0 20 20"
                                    className={`mr-2 h-5 w-5 fill-current text-gray-500 transition-all ${!open ? "-rotate-90" : ""} `}>
                                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                                </svg>
                                <span className="font-bold text-gray-500">{actualEmails}</span>
                                <p className="font-semibold text-gray-500">{t("Emails")}</p>
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
                                                        ? "bg-primary-primary-10 w-full text-sm font-bold text-primary-200"
                                                        : "w-full text-sm font-normal text-gray-500 hover:bg-conversation"
                                                }
                                                onClick={() => {
                                                    cleanFilters();
                                                    setShowEmail(false);
                                                    //     dispatch(toggleShowChat());
                                                    //     dispatch(setActualTray("InAtention"));
                                                }}>
                                                <div className="flex w-full items-center space-x-5 px-8 py-3">
                                                    <ModernMailIcon height="1rem" width="1.2rem" className="fill-current" fillOpacity="0.75" />
                                                    <p>
                                                        {t("monitoring.inAtention")}
                                                        {/* <span className="ml-2 rounded-full bg-gray-300 px-2 font-bold text-gray-500">
                                                            {notReadEmails} {t("sin leer")}
                                                        </span> */}
                                                    </p>
                                                </div>
                                            </Tab>
                                            <Tab
                                                key={1}
                                                className={({ selected }) =>
                                                    selected
                                                        ? "w-full bg-[#FFE185] bg-opacity-25 font-semibold text-secondary-150"
                                                        : "w-full text-gray-500 hover:bg-conversation"
                                                }
                                                onClick={() => {
                                                    setShowEmail(false);
                                                    setStatus({});
                                                    setActualPage(1);
                                                    setPriority({});
                                                    setIsFavorite(true);
                                                    //     setDueDate({});
                                                    //     setTicketsTags({});
                                                    //     dispatch(setActualTray("InFavorites"));
                                                }}>
                                                <div className="flex w-full items-center space-x-5 px-8 py-3">
                                                    {isFavorite ? (
                                                        <StarFillIcon height="1.1rem" width="1.2rem" className="fill-current text-[#D39C00]" />
                                                    ) : (
                                                        <StarOutIcon height="1rem" width="1.2rem" className="fill-current" />
                                                    )}
                                                    <p className="text-sm">{t("monitoring.favorites")}</p>
                                                </div>
                                            </Tab>
                                            <Tab
                                                key={2}
                                                className={({ selected }) =>
                                                    selected
                                                        ? "w-full bg-conversation font-semibold text-gray-700"
                                                        : "w-full text-gray-500 hover:bg-conversation"
                                                }
                                                onClick={() => {
                                                    setStatus({});
                                                    setActualPage(1);
                                                    setPriority("urgent");
                                                    setIsFavorite({});
                                                    //     setDueDate({});
                                                    //     setTicketsTags({});
                                                    setShowEmail(false);
                                                    //     dispatch(setActualTray("InUrgentPriority"));
                                                }}>
                                                <div className="flex w-full items-center space-x-5 px-8 py-3">
                                                    <RedFlagIcon height="1.2rem" width="1.2rem" className="fill-current opacity-55" />
                                                    <p className="text-sm text-gray-500 group-focus:font-semibold">{t("monitoring.urgent")}</p>
                                                </div>
                                            </Tab>
                                            <Tab
                                                key={3}
                                                className={({ selected }) =>
                                                    selected
                                                        ? "w-full bg-conversation font-semibold text-gray-700"
                                                        : "w-full text-gray-500 hover:bg-conversation"
                                                }
                                                onClick={() => {
                                                    setStatus({});
                                                    setActualPage(1);
                                                    setPriority("high");
                                                    setIsFavorite({});
                                                    //     setDueDate({});
                                                    //     setTicketsTags({});
                                                    setShowEmail(false);
                                                    //     dispatch(setActualTray("inHighPriority"));
                                                }}>
                                                <div className="group flex w-full items-center space-x-5 px-8 py-3 focus:bg-conversation">
                                                    <YellowFlagIcon
                                                        height="1.2rem"
                                                        width="1.2rem"
                                                        className="fill-current text-gray-500 opacity-55 group-focus:text-gray-700"
                                                    />
                                                    <p className="text-sm text-gray-500 group-focus:font-semibold">{t("monitoring.high")}</p>
                                                </div>
                                            </Tab>
                                            <Tab
                                                key={4}
                                                className={({ selected }) =>
                                                    selected
                                                        ? "w-full bg-conversation font-semibold text-gray-700"
                                                        : "w-full text-gray-500 hover:bg-conversation"
                                                }
                                                onClick={() => {
                                                    setStatus({});
                                                    setActualPage(1);
                                                    setPriority("normal");
                                                    setIsFavorite({});
                                                    //     setDueDate({});
                                                    //     setTicketsTags({});
                                                    setShowEmail(false);
                                                    //     dispatch(setActualTray("inNormalPriority"));
                                                }}>
                                                <div className="group flex w-full items-center space-x-5 px-8 py-3 focus:bg-conversation">
                                                    <GreenFlagIcon
                                                        height="1.2rem"
                                                        width="1.2rem"
                                                        className="fill-current text-gray-500 opacity-55 group-focus:text-gray-700"
                                                    />
                                                    <p className="l text-sm text-gray-500 group-focus:font-semibold">{t("monitoring.normal")}</p>
                                                </div>
                                            </Tab>
                                            <Tab
                                                key={5}
                                                className={({ selected }) =>
                                                    selected
                                                        ? "w-full bg-conversation font-semibold text-gray-700"
                                                        : "w-full text-gray-500 hover:bg-conversation"
                                                }
                                                onClick={() => {
                                                    setStatus({});
                                                    setActualPage(1);
                                                    setPriority("low");
                                                    setIsFavorite({});
                                                    //     setDueDate({});
                                                    //     setTicketsTags({});
                                                    //     dispatch(setActualTray("inLowPriority"));
                                                    setShowEmail(false);
                                                }}>
                                                <div className="group flex w-full items-center space-x-5 px-8 py-3 focus:bg-conversation">
                                                    <BlueFlagIcon
                                                        height="1.2rem"
                                                        width="1.2rem"
                                                        className="fill-current text-gray-500 opacity-55 group-focus:text-gray-700"
                                                    />
                                                    <p className="l text-sm text-gray-500 group-focus:font-semibold">{t("monitoring.low")}</p>
                                                </div>
                                            </Tab>
                                        </Tab.List>

                                        {/* <div className="w-full hover:bg-conversation ">
                                                <button className="group flex w-full items-center space-x-5 px-8 py-3 focus:bg-conversation">
                                                    <WarningIcon
                                                        height="1.2rem"
                                                        width="1.2rem"
                                                        className="fill-current text-gray-500 group-focus:text-gray-700"
                                                    />
                                                    <p className="text-sm text-gray-500 group-focus:font-semibold">
                                                        {t("Spam")}
                                                        <span className="ml-2 font-bold">0</span>
                                                    </p>
                                                </button>
                                            </div>
                                            <div className="w-full hover:bg-conversation ">
                                                <button className="flex space-x-5 items-center w-full group px-8 py-3 focus:bg-conversation">
                                                    <SheetIcon
                                                        height= "1.2rem"
                                                        width= "1.2rem"
                                                        className="text-gray-500 fill-current group-focus:text-gray-700"
                                                    />
                                                    <p className="text-sm text-gray-500  group-focus:font-semibold ">{t("Borradores")}<span className="ml-2 font-bold">0</span></p>
                                                </button>
                                            </div> */}
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
                                    className={`mr-2 h-5 w-5 fill-current text-gray-500 transition-all ${!open ? "-rotate-90" : ""} `}>
                                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                                </svg>
                                <p className="font-semibold text-gray-500">{t("monitoring.states")}</p>
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
                                                key={6}
                                                className={({ selected }) =>
                                                    selected
                                                        ? "w-full bg-conversation font-semibold text-gray-700"
                                                        : "w-full text-gray-500 hover:bg-conversation"
                                                }
                                                onClick={() => {
                                                    setStatus("new");
                                                    setActualPage(1);
                                                    setPriority({});
                                                    setIsFavorite({});
                                                    //     setDueDate({});
                                                    //     setTicketsTags({});
                                                    setShowEmail(false);
                                                    //     dispatch(setActualTray("inNewMails"));
                                                }}>
                                                <div className="group flex w-full items-center space-x-5 px-8 py-3 focus:bg-conversation">
                                                    <ReloadIcon
                                                        height="1rem"
                                                        width="1.15rem"
                                                        className="fill-current text-gray-500 group-focus:text-gray-700"
                                                    />
                                                    <p className="text-sm text-gray-500 group-focus:font-semibold">{t("monitoring.new")}</p>
                                                </div>
                                            </Tab>
                                            <Tab
                                                key={7}
                                                className={({ selected }) =>
                                                    selected
                                                        ? "w-full bg-conversation font-semibold text-gray-700"
                                                        : "w-full text-gray-500 hover:bg-conversation"
                                                }
                                                onClick={() => {
                                                    setStatus("open");
                                                    setActualPage(1);
                                                    setPriority({});
                                                    setIsFavorite({});
                                                    //     setDueDate({});
                                                    //     setTicketsTags({});
                                                    setShowEmail(false);
                                                    //     dispatch(setActualTray("inOpenMails"));
                                                }}>
                                                <div className="t group flex w-full items-center space-x-5 px-8 py-3 focus:bg-conversation">
                                                    <OpenMailIcon
                                                        height="1rem"
                                                        width="1.2rem"
                                                        className="fill-current text-gray-500 group-focus:text-gray-700"
                                                    />
                                                    <p className="text-sm text-gray-500 group-focus:font-semibold">{t("monitoring.open")}</p>
                                                </div>
                                            </Tab>
                                            <Tab
                                                key={8}
                                                className={({ selected }) =>
                                                    selected
                                                        ? "w-full bg-conversation font-semibold text-gray-700"
                                                        : "w-full text-gray-500 hover:bg-conversation"
                                                }
                                                onClick={() => {
                                                    setStatus("pending");
                                                    setActualPage(1);
                                                    setPriority({});
                                                    setIsFavorite({});
                                                    //     setDueDate({});
                                                    //     setTicketsTags({});
                                                    setShowEmail(false);
                                                    //     dispatch(setActualTray("inPendingMails"));
                                                }}>
                                                <div className="group flex w-full items-center space-x-5 px-8 py-3 focus:bg-conversation">
                                                    <ClockIcon
                                                        height="1.2rem"
                                                        width="1.2rem"
                                                        className="fill-current text-gray-500 group-focus:text-gray-700"
                                                        fillOpacity={"0.6"}
                                                    />
                                                    <p className="text-sm text-gray-500 group-focus:font-semibold">{t("monitoring.pending")}</p>
                                                </div>
                                            </Tab>

                                            <Tab
                                                key={9}
                                                className={({ selected }) =>
                                                    selected
                                                        ? "w-full bg-conversation font-semibold text-gray-700"
                                                        : "w-full text-gray-500 hover:bg-conversation"
                                                }
                                                onClick={() => {
                                                    setStatus("resolved");
                                                    setActualPage(1);
                                                    setPriority({});
                                                    setIsFavorite({});
                                                    //     setDueDate({});
                                                    //     setTicketsTags({});
                                                    setShowEmail(false);
                                                    //     dispatch(setActualTray("inSolvedMails"));
                                                }}>
                                                <div className="group flex w-full items-center space-x-5 px-8 py-3 focus:bg-conversation">
                                                    <CheckCircleIcon
                                                        height="1.2rem"
                                                        width="1.2rem"
                                                        className="fill-current text-gray-500 group-focus:text-gray-700"
                                                        fillOpacity={"0.6"}
                                                    />
                                                    <p className="text-sm text-gray-500 group-focus:font-semibold">{t("monitoring.resolved")}</p>
                                                </div>
                                            </Tab>

                                            <Tab
                                                key={3}
                                                className={({ selected }) =>
                                                    selected
                                                        ? "w-full bg-conversation font-semibold text-gray-700"
                                                        : "w-full text-gray-500 hover:bg-conversation"
                                                }
                                                onClick={() => {
                                                    setStatus("closed");
                                                    setActualPage(1);
                                                    setPriority({});
                                                    setIsFavorite({});
                                                    //     setDueDate({});
                                                    //     setTicketsTags({});
                                                    setShowEmail(false);
                                                    //     dispatch(setActualTray("inClosedMails"));
                                                }}>
                                                <div className="group flex w-full items-center space-x-5 px-8 py-3 focus:bg-conversation">
                                                    <ClosedMailIcon
                                                        height="1.2rem"
                                                        width="1.2rem"
                                                        className="fill-current text-gray-500 group-focus:text-gray-700"
                                                        fillOpacity={"0.6"}
                                                    />
                                                    <p className="text-sm text-gray-500 group-focus:font-semibold">{t("monitoring.closed")}</p>
                                                </div>
                                            </Tab>

                                            <Tab
                                                key={10}
                                                className={({ selected }) =>
                                                    selected
                                                        ? "w-full bg-conversation font-semibold text-gray-700"
                                                        : "w-full text-gray-500 hover:bg-conversation"
                                                }
                                                onClick={() => {
                                                    setStatus({});
                                                    setActualPage(1);
                                                    setPriority({});
                                                    setIsFavorite({});
                                                    //     setTicketsTags({});
                                                    //     setDueDate(dayjs().add(3, "days").hour("23").minute("00").second("00").format());
                                                    setShowEmail(false);
                                                    //     dispatch(setActualTray("inExpiringMails"));
                                                }}>
                                                <div className="group flex w-full items-center space-x-5 px-8 py-3 focus:bg-conversation">
                                                    <ExpiredIcon
                                                        height="1rem"
                                                        width="1.2rem"
                                                        className="fill-current text-secondary-250 group-focus:text-gray-700"
                                                    />
                                                    <p className="text-sm text-secondary-250 group-focus:font-semibold">{t("monitoring.toExpire")}</p>
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

                {/* <Disclosure defaultOpen={true}>
                    {({ open }) => (
                        <div className="flex flex-col">
                            <Disclosure.Button className="flex w-full items-center space-x-2 px-8 pt-8 pb-2">
                                <svg
                                    viewBox="0 0 20 20"
                                    className={`mr-2 h-5 w-5 fill-current text-gray-15 transition-all ${!open ? "-rotate-90" : ""} `}>
                                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                                </svg>
                                <p className="font-semibold text-gray-500">{t("Etiquetas")}</p>
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
                                                                    ? "bg-conversation w-full font-semibold text-gray-700"
                                                                    : "hover:bg-conversation w-full text-gray-500"
                                                            }>
                                                            <button
                                                                className="focus:bg-conversation group flex w-full items-center px-8 py-3"
                                                                // onClick={() => {
                                                                //     setStatus({});
                                                                //     setActualPage(1);
                                                                //     setIsFavorite({});
                                                                //     setPriority({});
                                                                //     setDueDate({});
                                                                //     setTicketsTags(tag.id);
                                                                //     setShowEmail(false);
                                                                // }}
                                                            >
                                                                <LabelIcon height="1.25rem" width="1.20rem" fill={tag.color} />
                                                                <p className="ml-2 text-left text-sm text-gray-500 group-focus:font-semibold">
                                                                    {get(tag, "name.es")}
                                                                </p>
                                                            </button>
                                                        </Tab>
                                                    );
                                                })}
                                        </Tab.List>
                                    </div>
                                </Disclosure.Panel>
                            </Transition>
                        </div>
                    )}
                </Disclosure> */}
            </Tab.Group>
        </div>
    );
}
export default EmailSidebar;
