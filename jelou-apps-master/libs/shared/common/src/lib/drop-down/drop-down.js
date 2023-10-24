import { Menu, Popover, Transition } from "@headlessui/react";
import get from "lodash/get";
import isBoolean from "lodash/isBoolean";
import isEmpty from "lodash/isEmpty";
import toLower from "lodash/toLower";
import { Fragment, useContext, useEffect, useState } from "react";
import Avatar from "react-avatar";
import { useTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

import { DashboardServer, JelouApiV1 } from "@apps/shared/modules";
import { i18n } from "@apps/shared/utils";
import Fuse from "fuse.js";

import { ChatManagerContext } from "@apps/pma/context";
import { addRooms, setStatusOperator, updateUserSession } from "@apps/redux/store";
import { ROOM_TYPES } from "@apps/shared/constants";
import { usePrevious } from "@apps/shared/hooks";
import { EnglishIcon, LanguageIcon, OperatorIcon3, PortugueseIcon, SearchIcon, SpanishIcon, TimezoneIcon } from "@apps/shared/icons";
import axios from "axios";
import UnattandedCasesWarning from "libs/pma/ui-shared/src/lib/unattended-modal/unattended-modal";
import { useDispatch, useSelector } from "react-redux";
import { BeatLoader } from "react-spinners";
import timezones from "timezones-list";
import { v4 as uuidv4 } from "uuid";
import Input from "../input/input";

const { DASHBOARD_SERVER } = require("../../../../../../config");

const StateDropdown = (props) => {
    const { names, email, schedulesPermission, botsSettingsPermission, companySettingsPermission, teamSettingsPermission, usersAdminPermissions, company } = props;
    const [loading, setLoading] = useState(false);
    const [changingStatus, setChangingStatus] = useState(false);
    const [flag, setFlag] = useState();
    const sessionId = localStorage.getItem("session");
    const userSession = useSelector((state) => state.userSession);
    const lang = useSelector((state) => state.userSession?.lang) ?? "es";
    const { t } = useTranslation();
    const [currentLang, setCurrentLang] = useState(lang);
    const timezoneBrowser = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const [currentTimezone, setCurrentTimezone] = useState({ tzCode: timezoneBrowser });
    const [timeZoneList, setTimeZoneList] = useState([]);
    const [sound, setSound] = useState(JSON.parse(localStorage.getItem("activeSound")) || false);
    const [currentLangDescription, setCurrentLangDescription] = useState("");
    const customLogin = get(company, "properties.redirectOnLogout", "");
    const dispatch = useDispatch();
    const [openWarningModal, setOpenWarningModal] = useState({ isOpen: false, numOfRooms: 0 });
    const isOperator = get(userSession, "isOperator");
    const { force: isForceNotLogOut = false, enabled: isEnableModalWaring = true, shouldConsiderateReplies = false } = get(company, "properties.operatorView.logOutWarning", {});
    const { chatManager } = useContext(ChatManagerContext);
    const campaignNotSeen = useSelector((state) => state.campaignNotSeen || false);
    const campaignId = localStorage.getItem("campaignId") || 0;
    const { providerId } = useSelector((state) => state.userSession);
    const statusOperator = useSelector((state) => state.statusOperator);
    const [queryTimezone, setQueryTimezone] = useState("");
    const prevStatus = usePrevious(statusOperator);
    const [loadingTimezone, setLoadingTimezone] = useState(false);
    const [loadingLang, setLoadingLang] = useState(false);

    useEffect(() => {
        i18n.changeLanguage(lang);
        setFlag(setFlagLang(lang));
        const timezones = getTimeZoneList();
        const timezone = get(userSession, "timezone", timezoneBrowser);
        const defaultTmz = timezones.find((tz) => tz.tzCode === timezone);
        setCurrentTimezone(defaultTmz);
    }, [userSession]);

    const fuseOptions = {
        threshold: 0.3,
        includeMatches: true,
        ignoreLocation: true,
        keys: ["name", "label", "tzcCode"],
    };

    const handleLogOut = async () => {
        setLoading(true);

        let grupedRooms = {};

        if (isOperator) {
            const rooms = await chatManager.getRooms({ providerId, roomsWithOutFilter: true });

            grupedRooms = rooms.reduce((acc, room) => {
                const { type } = room;
                acc[type] ??= [];
                acc[type].push(room);
                return acc;
            }, {});
        }

        const roomsClients = grupedRooms[ROOM_TYPES.CLIENT] ?? [];
        const replysRooms = grupedRooms[ROOM_TYPES.REPLY] ?? [];

        if (isEnableModalWaring && roomsClients.length > 0) {
            setOpenWarningModal({ isOpen: true, numOfRooms: roomsClients.length });
            dispatch(addRooms(roomsClients));
            setLoading(false);
            return;
        }

        if (shouldConsiderateReplies && replysRooms.length > 0) {
            setOpenWarningModal({ isOpen: true, numOfRooms: replysRooms.length, message: t("pma.publicationsWarningTitle") });
            setLoading(false);
            return;
        }

        logOut();
    };

    const logOut = async () => {
        try {
            const jwtOperator = localStorage.getItem("jwt-operator");

            if (!isEmpty(jwtOperator)) {
                await axios.post(
                    `${DASHBOARD_SERVER}/auth/logout`,
                    {
                        sessionId,
                        ...(get(userSession, "isOperator") ? { logoutOperator: true } : {}),
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${jwtOperator}`,
                        },
                    }
                );
            }

            await DashboardServer.post(`/auth/logout`, {
                sessionId,
                ...(get(userSession, "isOperator") ? { logoutOperator: true } : {}),
            });

            localStorage.removeItem("jwt");
            localStorage.clear();
            localStorage.setItem("lang", lang);
            localStorage.setItem("campaignId", campaignId);
            localStorage.setItem("campaignNotSeen", campaignNotSeen);
            setLoading(false);

            if (!isEmpty(customLogin)) {
                window.location = customLogin;
            }
            if (isEmpty(customLogin)) {
                window.location = "/login";
            }
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    };

    const handleCloseWaringModal = () => {
        setOpenWarningModal({ isOpen: false, numOfRooms: 0 });
        setLoading(false);
    };

    const setFlagLang = (lang) => {
        switch (lang) {
            case "es":
                setCurrentLangDescription(t("pma.Español"));
                return <SpanishIcon className="mr-2 cursor-pointer fill-current text-gray-450" width="1rem" height="1.15rem" />;
            case "en":
                setCurrentLangDescription(t("pma.Ingles"));
                return <EnglishIcon className="mr-2 cursor-pointer fill-current text-gray-450" width="1rem" height="1.15rem" />;
            default:
                setCurrentLangDescription(t("pma.Portugues"));
                return <PortugueseIcon className="mr-2 cursor-pointer fill-current text-gray-450" width="1rem" height="1.15rem" />;
        }
    };

    const setLanguage = (lang) => {
        dispatch(updateUserSession({ lang }));
        setCurrentLang(lang);
        i18n.changeLanguage(lang);
        setFlag(setFlagLang(lang));
    };

    const activePmaSound = () => {
        if (isBoolean(sound)) {
            setSound(!sound);
            localStorage.setItem("activeSound", !sound);
        } else {
            setSound(!true);
            localStorage.setItem("activeSound", !true);
        }
    };

    const colorOperatorStatus = () => {
        switch (statusOperator) {
            case "online":
                return "text-secondary-425";
            case "offline":
                return "text-red-1020";
            case "busy":
                return "text-secondary-150";
            default:
                return "text-gray-400";
        }
    };

    const setOperatorState = async (user, newState) => {
        try {
            setChangingStatus(true);
            await JelouApiV1.patch(`/operators/${user.operatorId}`, {
                status: newState,
                sessionId: user.sessionId,
            });
            const operatorActive = newState;
            dispatch(updateUserSession({ operatorActive }));
            dispatch(setStatusOperator(newState));
            setChangingStatus(false);
        } catch (error) {
            setChangingStatus(false);
        }
    };

    const changeState = async (evt) => {
        const { target } = evt;
        const status = target.getAttribute("name");

        if (toLower(prevStatus) !== toLower(status)) {
            setOperatorState(userSession, status);
        }
    };

    const Loading = ({ className }) => {
        return (
            <svg className={`${className} -ml-1 mr-3 h-4 w-4 animate-spin`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
        );
    };

    const handleOffline = async () => {
        const rooms = await chatManager.getRooms({ providerId });

        if (isEnableModalWaring && rooms.length > 0) {
            setOpenWarningModal({ isOpen: true, numOfRooms: rooms.length });
            dispatch(addRooms(rooms));
            return;
        }
        offline();
    };

    const offline = async () => {
        setOperatorState(userSession, "offline");
    };

    const getTimeZoneList = () => {
        let objList = [];
        objList = timezones.sort((a, b) => {
            if (a.name < b.name) {
                return -1;
            }
            if (a.name > b.name) {
                return 1;
            }
            return 0;
        });
        setTimeZoneList(objList);
        return objList;
    };

    const findTimezone = ({ target }) => {
        const { value } = target;
        setQueryTimezone(value);
    };

    const getFilteredTimezone = () => {
        if (isEmpty(queryTimezone)) {
            return timeZoneList;
        }
        const fuse = new Fuse(timeZoneList, fuseOptions);
        const result = fuse.search(queryTimezone);

        let timezoneSearch = [];
        result.map((tz) => {
            return timezoneSearch.push(tz.item);
        });
        return timezoneSearch;
    };

    const filteredTimezone = getFilteredTimezone();

    const handleUserLanguage = async (lang) => {
        setLoadingLang(true);
        try {
            await DashboardServer.patch(`/user/profile`, { lang }).then(() => {
                setLanguage(lang);
                setLoadingLang(false);
                let languageSelected = "es";
                switch (lang) {
                    case "es":
                        languageSelected = "Español";
                        break;
                    case "en":
                        languageSelected = "English";
                        break;
                    case "pt":
                        languageSelected = "Português";
                        break;
                    default:
                        break;
                }
                toast.success(`${t("settings.languageChanged")} ${languageSelected}`, {
                    position: toast.POSITION.BOTTOM_RIGHT,
                });
            });
        } catch (error) {
            setLoadingLang(false);
            console.log(error);
        }
    };

    const handleUserTimezone = async (tz) => {
        const { tzCode } = tz;
        setLoadingTimezone(true);
        try {
            await DashboardServer.patch(`/user/profile`, { timezone: tzCode }).then(() => {
                const timezone = { timezone: tzCode };
                setCurrentTimezone(tz);
                dispatch(updateUserSession(timezone));
                setLoadingTimezone(false);
                setQueryTimezone("");
            });
        } catch (error) {
            setLoadingTimezone(false);
            setQueryTimezone("");
            console.log(error);
        }
    };

    const resetTimezoneSearch = () => {
        setQueryTimezone("");
    };

    return (
        <Popover className="relative inline-block text-left">
            <div>
                <Popover.Button className="focus-visible:ring-2 inline-flex w-full justify-center rounded-md text-sm font-medium text-white focus:outline-none focus-visible:ring-white focus-visible:ring-opacity-75">
                    <div className="relative py-5">
                        <div className="relative inline-block">
                            <Avatar name={names} className="block" size="36" round color="#0fb6b0" textSizeRatio={2} />
                            <span className="shadow-solid absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-green-400 text-white"></span>
                        </div>
                    </div>
                </Popover.Button>
            </div>
            <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
            >
                <Popover.Panel className="fixed bottom-0 left-0 right-0 z-50 mb-5 ml-24 w-full max-w-[18rem] divide-y-1 divide-gray-400/10 rounded-[0.9375rem] bg-white shadow-menu">
                    <div className="flex items-center p-6">
                        <div className="mr-2 flex items-center">
                            <div className="relative inline-block">
                                <Avatar name={names} className="block" size="2.25rem" round color="#0fb6b0" textSizeRatio={2} />
                            </div>
                        </div>
                        <div className="flex flex-col leading-[1.2]">
                            <div className="text-15 font-bold text-gray-400">{names}</div>
                            <div className="text-13 text-gray-400 text-opacity-75">{email}</div>
                        </div>
                    </div>
                    {isOperator && (
                        <Menu as="div" className="relative inline-block w-full text-left">
                            <div>
                                <Menu.Button className="relative flex w-full items-center p-4 text-sm text-gray-400 hover:bg-[#E5F7F9] focus:outline-none">
                                    <OperatorIcon3 width={"1.5rem"} height={"1.5rem"} statusOperator={statusOperator} />
                                    <div className="ml-3 flex flex-col space-y-1 text-left text-xs">
                                        <span>{t("pma.Estado de Conexión")}</span>
                                        <span className={`${colorOperatorStatus()}`}>{t(`pma.${statusOperator}`)}</span>
                                    </div>
                                    <span className="absolute inset-0 right-0 flex items-center justify-end p-6 text-xl">{">"}</span>
                                </Menu.Button>
                            </div>
                            <Transition
                                as={Fragment}
                                enter="transition ease-out duration-100"
                                enterFrom="transform opacity-0 scale-95"
                                enterTo="transform opacity-100 scale-100"
                                leave="transition ease-in duration-75"
                                leaveFrom="transform opacity-100 scale-100"
                                leaveTo="transform opacity-0 scale-95"
                            >
                                <Menu.Items className="absolute right-0 top-0 z-50 -m-[14.5rem] mt-0 w-56 divide-y-1 divide-gray-400/10 rounded-lg bg-white text-gray-400 shadow-lg focus:outline-none">
                                    <Menu.Item>
                                        {({ active }) => (
                                            <button
                                                onClick={changeState}
                                                className={`group relative flex w-full cursor-pointer items-center space-x-3 rounded-t-lg p-3 text-sm text-secondary-425 ${
                                                    statusOperator === "online" ? "font-bold" : "text-opacity-50"
                                                } ${active ? "bg-[#E5F7F9]" : ""}`}
                                            >
                                                {changingStatus ? (
                                                    <Loading className="text-secondary-425" />
                                                ) : (
                                                    <div
                                                        className={`inset-y-0 left-0 -mr-1 flex h-3 w-3 items-center rounded-full border-2 border-white bg-secondary-425 ${
                                                            statusOperator !== "online" && "bg-opacity-50"
                                                        }`}
                                                    />
                                                )}
                                                <span name="online" className={`${"flex w-full items-center text-sm"}`}>
                                                    {t("pma.Conectado")}
                                                </span>
                                            </button>
                                        )}
                                    </Menu.Item>
                                    <Menu.Item>
                                        {({ active }) => (
                                            <button
                                                onClick={changeState}
                                                className={`group relative flex w-full cursor-pointer items-center space-x-3 p-3 text-sm text-secondary-150 ${
                                                    statusOperator === "busy" ? "font-bold" : "text-opacity-50"
                                                } ${active ? "bg-[#E5F7F9]" : ""}`}
                                            >
                                                {changingStatus ? (
                                                    <Loading className="text-secondary-150" />
                                                ) : (
                                                    <div
                                                        className={`inset-y-0 left-0 -mr-1 flex h-3 w-3 items-center rounded-full border-2 border-white bg-secondary-150 ${
                                                            statusOperator !== "busy" && "bg-opacity-50"
                                                        }`}
                                                    />
                                                )}
                                                <span name="busy" className={`${"flex w-full items-center text-sm"}`}>
                                                    {t("pma.No disponible")}
                                                </span>
                                            </button>
                                        )}
                                    </Menu.Item>
                                    <Menu.Item>
                                        {({ active }) => (
                                            <button
                                                onClick={handleOffline}
                                                className={`group relative flex w-full cursor-pointer items-center space-x-3 rounded-b-lg p-3 text-sm text-red-1020 ${
                                                    statusOperator === "offline" ? "font-bold" : "text-opacity-50"
                                                } ${active ? "bg-[#E5F7F9]" : ""}`}
                                            >
                                                {changingStatus ? (
                                                    <Loading className="text-red-1020" />
                                                ) : (
                                                    <div
                                                        className={`inset-y-0 left-0 -mr-1 flex h-3 w-3 items-center rounded-full border-2 border-white bg-red-1020 ${
                                                            statusOperator !== "offline" && "bg-opacity-50"
                                                        }`}
                                                    />
                                                )}
                                                <span name="offline" className={`${"flex w-full items-center text-sm"}`}>
                                                    {t("pma.Desconectado")}
                                                </span>
                                            </button>
                                        )}
                                    </Menu.Item>
                                </Menu.Items>
                            </Transition>
                        </Menu>
                    )}
                    <Menu as="div" className="relative inline-block w-full text-left">
                        <div>
                            <Menu.Button className="relative flex w-full items-center p-5 text-sm text-gray-400 hover:bg-[#E5F7F9] focus:outline-none">
                                <LanguageIcon width={25} height={18} />
                                <div className="ml-3 flex flex-col space-y-1 text-left text-xs">
                                    <span>{t("pma.Idioma")}</span>
                                    {loadingLang ? (
                                        <BeatLoader size={5} color="#727c94" />
                                    ) : (
                                        <span className={`flex items-center font-bold`}>
                                            <span className="rounded-md">{flag}</span>
                                            <span className="ml-1 flex">{currentLangDescription}</span>
                                        </span>
                                    )}
                                </div>
                                <span className="absolute inset-0 right-0 flex items-center justify-end p-6 text-xl">{">"}</span>
                            </Menu.Button>
                        </div>
                        <Transition
                            as={Fragment}
                            enter="transition ease-out duration-100"
                            enterFrom="transform opacity-0 scale-95"
                            enterTo="transform opacity-100 scale-100"
                            leave="transition ease-in duration-75"
                            leaveFrom="transform opacity-100 scale-100"
                            leaveTo="transform opacity-0 scale-95"
                        >
                            <Menu.Items className="absolute right-0 top-0 z-50 -m-[14.5rem] mt-0 w-56 divide-y-1 divide-gray-400/10 rounded-lg bg-white text-gray-400 shadow-lg focus:outline-none">
                                <Menu.Item>
                                    {({ active }) => (
                                        <button
                                            onClick={() => handleUserLanguage("es")}
                                            className={`group relative flex w-full cursor-pointer items-center space-x-3 rounded-t-lg px-3 py-2 text-sm text-gray-400 ${
                                                  lang === "es" ? "font-bold" : ""
                                            } ${active ? " bg-[#E5F7F9]" : ""}`}
                                        >
                                            <SpanishIcon className="cursor-pointer fill-current text-gray-450" width="1.5rem" height="1.625rem" />
                                            <span className={`${"flex w-full items-center text-sm"}`}>{t("pma.Español")}</span>
                                        </button>
                                    )}
                                </Menu.Item>
                                <Menu.Item>
                                    {({ active }) => (
                                        <button
                                            onClick={() => handleUserLanguage("en")}
                                            className={`group relative flex w-full cursor-pointer items-center space-x-3 px-3 py-2 text-sm text-gray-400 ${
                                                lang === "en" ? "font-bold" : ""
                                            } ${active ? " bg-[#E5F7F9]" : ""}`}>
                                            <EnglishIcon className="cursor-pointer fill-current text-gray-450" width="1.5rem" height="1.625rem" />
                                            <span className={`${"flex w-full items-center text-sm"}`}>{t("pma.Ingles")}</span>
                                        </button>
                                    )}
                                </Menu.Item>
                                <Menu.Item>
                                    {({ active }) => (
                                        <button
                                            onClick={() => handleUserLanguage("pt")}
                                            className={`group relative flex w-full cursor-pointer items-center space-x-3 rounded-b-lg px-3 py-2 text-sm text-gray-400 ${
                                                  lang === "pt" ? "font-bold" : ""
                                            } ${active ? " bg-[#E5F7F9]" : ""}`}
                                        >
                                            <PortugueseIcon className="cursor-pointer fill-current text-gray-450" width="1.5rem" height="1.625rem" />
                                            <span className={`${"flex w-full items-center text-sm"}`}>{t("pma.Portugues")}</span>
                                        </button>
                                    )}
                                </Menu.Item>
                            </Menu.Items>
                        </Transition>
                    </Menu>
                    <Menu as="div" className="relative inline-block w-full text-left">
                        <div>
                            <Menu.Button className="relative flex w-full items-center p-5 text-sm text-gray-400 hover:bg-[#E5F7F9] focus:outline-none" onClick={resetTimezoneSearch}>
                                <TimezoneIcon />
                                <div className="ml-3 flex flex-col space-y-1 text-left text-xs">
                                    <span>{t("schedule.timezone")}</span>
                                    <span className={`flex items-center font-bold`}>
                                        {loadingTimezone ? (
                                            <BeatLoader size={5} color="#727c94" />
                                        ) : (
                                            <span className="flex">{currentTimezone?.name ? get(currentTimezone, "name", "-") : get(currentTimezone, "tzCode", "-")}</span>
                                        )}
                                    </span>
                                </div>
                                <span className="absolute inset-0 right-0 flex items-center justify-end p-6 text-xl">{">"}</span>
                            </Menu.Button>
                        </div>
                        <Transition
                            as={Fragment}
                            enter="transition ease-out duration-100"
                            enterFrom="transform opacity-0 scale-95"
                            enterTo="transform opacity-100 scale-100"
                            leave="transition ease-in duration-75"
                            leaveFrom="transform opacity-100 scale-100"
                            leaveTo="transform opacity-0 scale-95"
                        >
                            <Menu.Items className="absolute right-0 top-0 z-50 -m-[22.5rem] mt-0 max-h-[30vh] w-74 divide-y-1 divide-gray-400/10 overflow-y-auto rounded-lg bg-white text-gray-400 shadow-lg focus:outline-none xl:max-h-[25vh]">
                                <div className="sticky top-0 z-20 flex w-full items-center bg-white p-3" key={uuidv4()}>
                                    <div className="absolute left-3">
                                        <SearchIcon className="fill-current" width="1rem" height="1rem" />
                                    </div>
                                    <Input
                                        className="flex h-10 w-full max-w-xs rounded-full border-gray-100/50 pl-10 outline-none focus:ring-transparent"
                                        type="search"
                                        autoFocus={true}
                                        placeholder={t("schedule.placeHolderTimeZ")}
                                        onChange={findTimezone}
                                        value={queryTimezone}
                                    />
                                </div>
                                {filteredTimezone.map((timezone, id) => {
                                    const { name } = timezone;
                                    return (
                                        <Menu.Item key={id}>
                                            {({ active }) => (
                                                <button
                                                    onClick={() => handleUserTimezone(timezone)}
                                                    className={`group relative flex w-full cursor-pointer items-center space-x-3 px-5 py-2 text-left text-sm text-gray-400 ${
                                                        currentTimezone === timezone ? "font-semibold text-primary-200" : ""
                                                    } ${active ? " bg-[#E5F7F9]" : ""}`}
                                                >
                                                    {name}
                                                </button>
                                            )}
                                        </Menu.Item>
                                    );
                                })}
                            </Menu.Items>
                        </Transition>
                    </Menu>
                    <div>
                        {isOperator && (
                            <button className="mr-2 flex w-full p-3 px-6 py-3 text-gray-400 hover:bg-[#E5F7F9] group-hover:text-primary-200" onClick={activePmaSound}>
                                <div className="flex flex-col text-left">
                                    {sound ? <div className="text-13">{t("pma.Silenciar sonido")}</div> : <div className="text-13">{t("pma.Activar sonido")}</div>}
                                </div>
                            </button>
                        )}
                        <div className={`${usersAdminPermissions || schedulesPermission ? "" : ""}`}>
                            {/* {!isEmpty(steps) && (
                                <button
                                    className="relative mr-2 flex w-full items-center space-x-1 px-6 py-3 text-left hover:bg-[#E5F7F9]"
                                    onClick={() => setShowCampaigns(true)}>
                                    <span className="relative inline-block">
                                        <BellIcon
                                            className="text-gray-400 transition duration-150 ease-in-out"
                                            width="1rem"
                                            height="1rem"
                                            fill="currentColor"
                                        />
                                        {!isEmpty(steps) && campaignNotSeen.toString() === "true" && (
                                            <span className="heart ring-2 absolute bottom-[0.6rem] left-[0.5rem] block h-2 w-2 -translate-y-1/2 translate-x-1/2 transform rounded-full bg-red-400 ring-white"></span>
                                        )}
                                    </span>
                                    <div className="text-13 text-gray-400">{t("sideBar.updates")}</div>
                                </button>
                            )} */}
                            {usersAdminPermissions && (
                                <NavLink to="/users-admin" className="relative mr-2 flex w-full items-center space-x-1 px-6 py-3 text-left hover:bg-[#E5F7F9]">
                                    <div className="text-13 text-gray-400">{t("componentCommonSidebar.users")}</div>
                                </NavLink>
                            )}
                            {(schedulesPermission || botsSettingsPermission || companySettingsPermission || teamSettingsPermission) && (
                                <NavLink to="/settings" className="relative mr-2 flex w-full items-center space-x-1 px-6 py-3 text-left hover:bg-[#E5F7F9]">
                                    <div className="text-13 text-gray-400">{t("sideBar.settings")}</div>
                                </NavLink>
                            )}
                        </div>
                    </div>
                    <div
                        className={`flex cursor-pointer items-center ${
                            usersAdminPermissions || schedulesPermission ? "" : "border-t-1 border-gray-400 border-opacity-10"
                        } rounded-b-xl px-6 py-3 hover:bg-[#E5F7F9]`}
                        name={"LogOut"}
                        onClick={handleLogOut}
                    >
                        <div className="relative mr-2 flex flex-col">
                            <div className="text-13 font-bold text-red-950">{loading ? t("dropdown.closing") : t("dropdown.exit")}</div>
                        </div>
                    </div>
                </Popover.Panel>
            </Transition>
            <UnattandedCasesWarning logOut={logOut} isForceNotLogOut={isForceNotLogOut} closeModal={handleCloseWaringModal} openModal={openWarningModal} />
            <ToastContainer />
        </Popover>
    );
};

export default StateDropdown;
