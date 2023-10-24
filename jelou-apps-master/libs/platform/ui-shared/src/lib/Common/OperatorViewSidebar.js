import { Menu, Popover, Transition } from "@headlessui/react";
import get from "lodash/get";
import toLower from "lodash/toLower";
import toUpper from "lodash/toUpper";
import { Fragment, useContext, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";

import { ChatManagerContext } from "@apps/pma/context";
// import { UnattandedCasesWarning } from "@apps/pma/ui-shared";
import { UnattandedCasesWarning } from "@apps/pma/ui-shared";
import { addRooms, setStatusOperator, updateUserSession } from "@apps/redux/store";
import { ROOM_TYPES } from "@apps/shared/constants";
import { useOnClickOutside, usePrevious } from "@apps/shared/hooks";
import { OperatorIcon2, OperatorViewIcon, WarningIcon1 } from "@apps/shared/icons";
import { JelouApiV1 } from "@apps/shared/modules";

const OperatorViewSidebar = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const impersonate = localStorage.getItem("jwt-operator");
    const [loadingStatus, setLoadingStatus] = useState("");
    const [openWarningModal, setOpenWarningModal] = useState({ isOpen: false, numOfRooms: 0 });
    const userSession = useSelector((state) => state.userSession);
    const statusOperator = useSelector((state) => state.statusOperator);
    const company = useSelector((state) => state.company);
    const prevStatus = usePrevious(statusOperator);
    const { chatManager } = useContext(ChatManagerContext);
    const { providerId } = useSelector((state) => state.userSession);
    const [onHover, setOnHover] = useState(false);
    const { force: isForceNotLogOut = false, enabled: isEnableModalWaring = true, shouldConsiderateReplies = false } = get(company, "properties.operatorView.logOutWarning", {});
    const sectionRef = useRef(null);
    const [showError, setShowError] = useState({ isOpen: false, errorMessage: t("pma.Error de conexion") });
    const [disabled, setDisabled] = useState(false);

    const handleCloseWaringModal = () => {
        setOpenWarningModal({ isOpen: false, numOfRooms: 0 });
    };

    const closeErrorConnectionModal = () => {
        setShowError({ isOpen: false, errorMessage: t("pma.Error de conexion") });
    };

    const setHover = () => {
        setOnHover(true);
    };

    const setHoverFalse = () => {
        setOnHover(false);
    };

    useEffect(() => {
        if (!disabled) {
            return;
        }

        const handle = setTimeout(() => {
            setDisabled(false);
        }, 2000);
        return () => clearTimeout(handle);
    }, [disabled]);

    const changeState = async (name) => {
        if (disabled) return;
        setDisabled(true);
        if (toLower(prevStatus) !== toLower(name)) {
            setOperatorState(userSession, name);
        }
    };

    useOnClickOutside(sectionRef, setHoverFalse);

    const setOperatorState = async (user, newState) => {
        const actualStatus = toLower(statusOperator);
        try {
            await JelouApiV1.patch(`/operators/${user.operatorId}`, {
                status: newState,
                sessionId: user.sessionId,
            });
            const operatorActive = newState;
            dispatch(updateUserSession({ operatorActive }));
            dispatch(setStatusOperator(newState));
            setLoadingStatus(false);
        } catch (error) {
            dispatch(setStatusOperator(actualStatus));
            setShowError({ isOpen: true, errorMessage: t("pma.Error de conexion") });
            setLoadingStatus(false);
            setOnHover(false);
        }
    };

    const logOut = async () => {
        setOperatorState(userSession, "offline");
    };

    const handleLogOut = async () => {
        const rooms = await chatManager.getRooms({ providerId, roomsWithOutFilter: true });
        const grupedRooms = rooms.reduce((acc, room) => {
            const { type } = room;
            acc[type] ??= [];
            acc[type].push(room);
            return acc;
        }, {});

        const roomsClients = grupedRooms[ROOM_TYPES.CLIENT] ?? [];
        const replysRooms = grupedRooms[ROOM_TYPES.REPLY] ?? [];

        if (isEnableModalWaring && roomsClients.length > 0) {
            setOpenWarningModal({ isOpen: true, numOfRooms: roomsClients.length });
            dispatch(addRooms(roomsClients));
            return;
        }

        if (shouldConsiderateReplies && replysRooms.length > 0) {
            setOpenWarningModal({ isOpen: true, numOfRooms: replysRooms.length, message: t("pma.publicationsWarningTitle") });
            return;
        }

        logOut();
    };

    const stopImpersonate = () => {
        const url = window.location.origin;
        const website = `${url}/pma/chats`;

        const masterOperator = localStorage.getItem("jwt-operator");

        localStorage.setItem("jwt", masterOperator);
        localStorage.removeItem("jwt-operator");
        const impersonateCompany = localStorage.getItem("jwt-master");

        if (impersonateCompany) {
            return (window.location = "/monitoring/operators");
        }
        window.location.replace(website);
    };

    const Loading = ({ className }) => {
        return (
            <svg className={`${className} -ml-1 mr-3 h-4 w-4 animate-spin`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
        );
    };

    let isActivePma = window.location.pathname.includes("/pma");

    const statusPmaSection = (status) => {
        switch (toUpper(statusOperator)) {
            case "ONLINE":
                return "bg-[#F3FAF5] border-[#67AB2D]";
            case "BUSY":
                return "bg-[#FFF7E0] border-[#D39C00]";
            case "OFFLINE":
                return "bg-[#FFF5F3] border-[#A83927]";
            default:
                return "#727C94";
        }
    };

    const isNotActiveClassName =
        "group flex justify-center p-1 pr-0 md:py-2 md:px-1 text-sm leading-5 text-gray-400 focus:outline-none hover:bg-primary-700 transition ease-in-out duration-150 border-sidebar border-transparent";

    return (
        <Popover className="relative inline-block text-left">
            <div>
                <div className="relative inline-block" onMouseOver={setHover}>
                    <NavLink
                        to={`/pma/chats`}
                        className={({ isActive }) =>
                            isActivePma
                                ? `border-sidebar flex justify-center ${statusPmaSection()} p-1 pr-0 text-sm leading-5 text-gray-400 transition duration-150 ease-in-out focus:outline-none md:px-1 md:py-2`
                                : isNotActiveClassName
                        }
                    >
                        <div className="flex w-full flex-col">
                            <OperatorViewIcon width={28} height={28} />
                        </div>
                    </NavLink>
                </div>
            </div>
            <Transition
                show={onHover}
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
            >
                <Popover.Panel className="fixed left-0 right-0 top-0 z-50 ml-24 mt-40 w-full max-w-[15rem] rounded-[0.9375rem] bg-transparent" onMouseLeave={setHoverFalse}>
                    {({ close }) => (
                        <section
                            className="inline-block h-full w-full transform overflow-hidden rounded-[0.9375rem] bg-white p-3 text-left font-semibold text-gray-400 shadow-menu transition-all"
                            ref={sectionRef}
                        >
                            <header className="flex items-center justify-center py-2">{t("pma.Estado del operador")}</header>
                            <Menu>
                                <div className="space-y-3 p-2">
                                    <Menu.Item>
                                        {({ active }) => (
                                            <button
                                                onClick={(evt) => {
                                                    changeState("online");
                                                    close();
                                                }}
                                                name="online"
                                                disabled={disabled}
                                                className={`${
                                                    active || toUpper(statusOperator) === "ONLINE"
                                                        ? "border-opacity-100 bg-opacity-100 font-semibold text-opacity-100"
                                                        : "border-opacity-30 bg-opacity-30 font-normal text-opacity-30"
                                                } group flex w-full items-center space-x-4 rounded-full border-1 border-[#67AB2D] bg-[#F3FAF5] px-4 py-1 text-sm text-gray-400 hover:border-opacity-100 hover:bg-opacity-100 hover:font-normal hover:text-opacity-100`}
                                            >
                                                {loadingStatus === "online" ? (
                                                    <Loading className="text-[#67AB2D]" />
                                                ) : (
                                                    <div
                                                        className={`${
                                                            active || toUpper(statusOperator) === "ONLINE" ? "bg-opacity-100" : "bg-opacity-30"
                                                        } flex h-2 w-2 items-center justify-center rounded-full bg-[#67AB2D]`}
                                                    />
                                                )}
                                                <span name="online" className="flex">
                                                    {t("pma.Conectado")}
                                                </span>
                                            </button>
                                        )}
                                    </Menu.Item>
                                    <Menu.Item>
                                        {({ active }) => (
                                            <button
                                                onClick={(evt) => {
                                                    changeState("busy");
                                                    close();
                                                }}
                                                name="busy"
                                                disabled={disabled}
                                                className={`${
                                                    active || toUpper(statusOperator) === "BUSY"
                                                        ? "border-opacity-100 bg-opacity-100 font-semibold text-opacity-100"
                                                        : "border-opacity-30 bg-opacity-30 font-normal text-opacity-30"
                                                } group flex w-full items-center space-x-4 rounded-full border-1 border-[#D39C00] bg-[#FFF7E0] px-4 py-1 text-sm text-gray-400 hover:border-opacity-100 hover:bg-opacity-100 hover:font-normal hover:text-opacity-100`}
                                            >
                                                {loadingStatus === "busy" ? (
                                                    <Loading className="text-[#D39C00]" />
                                                ) : (
                                                    <div
                                                        className={`${
                                                            active || toUpper(statusOperator) === "BUSY" ? "bg-opacity-100" : "bg-opacity-30"
                                                        } flex h-2 w-2 items-center justify-center rounded-full bg-[#D39C00] `}
                                                    />
                                                )}
                                                <span name="busy" className="flex">
                                                    {t("pma.No disponible")}
                                                </span>
                                            </button>
                                        )}
                                    </Menu.Item>
                                    <Menu.Item>
                                        {({ active }) => (
                                            <button
                                                onClick={() => {
                                                    handleLogOut();
                                                    close();
                                                }}
                                                name="offline"
                                                className={`${
                                                    active || toUpper(statusOperator) === "OFFLINE"
                                                        ? "border-opacity-100 bg-opacity-100 font-semibold text-opacity-100"
                                                        : "border-opacity-30 bg-opacity-30 font-normal text-opacity-30"
                                                } group flex w-full items-center space-x-4 rounded-full border-1 border-[#A83927] bg-[#F8DEDA] px-4 py-1 text-sm text-gray-400 hover:border-opacity-100 hover:bg-opacity-100 hover:font-normal hover:text-opacity-100`}
                                            >
                                                {loadingStatus === "offline" ? (
                                                    <Loading className="text-[#A83927]" />
                                                ) : (
                                                    <div
                                                        className={`${
                                                            active || toUpper(statusOperator) === "OFFLINE" ? "bg-opacity-100" : "bg-opacity-30"
                                                        } flex h-2 w-2 items-center justify-center rounded-full bg-[#A83927]`}
                                                    />
                                                )}
                                                <span name="busy" className="flex">
                                                    {t("pma.Desconectado")}
                                                </span>
                                            </button>
                                        )}
                                    </Menu.Item>
                                </div>
                                {impersonate && (
                                    <div className="border-tp p-1">
                                        <Menu.Item>
                                            {({ active }) => (
                                                <button
                                                    className={`${active ? `bg-gray-100/25 text-primary-200` : `bg-white text-gray-400`} group flex w-full items-center px-3 py-4`}
                                                    onClick={() => {
                                                        stopImpersonate();
                                                    }}
                                                >
                                                    <div className="relative mr-2 rounded-full bg-gray-37 text-gray-400 group-hover:text-primary-200">
                                                        <OperatorIcon2 className="m-2 fill-current" width="1.25rem" height="1.25rem" />
                                                    </div>
                                                    <div className="flex flex-col text-left">
                                                        <div className="text-sm font-bold">{t("pma.Dejar de impersonar")}</div>
                                                        <div className="text-xs font-medium text-gray-400">{t("pma.Vuelve a tu usuario")}</div>
                                                    </div>
                                                </button>
                                            )}
                                        </Menu.Item>
                                    </div>
                                )}
                            </Menu>
                        </section>
                    )}
                </Popover.Panel>
            </Transition>
            <UnattandedCasesWarning logOut={logOut} isForceNotLogOut={isForceNotLogOut} closeModal={handleCloseWaringModal} openModal={openWarningModal} />
            <Transition
                show={showError?.isOpen}
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
            >
                <Popover.Panel className="fixed left-0 right-0 top-0 z-50 ml-24 mt-40 w-full max-w-[20rem] rounded-[0.9375rem] bg-transparent">
                    {({ close }) => (
                        <section
                            className="relative inline-block h-full w-full transform overflow-hidden rounded-[0.9375rem] bg-white text-left font-semibold text-gray-400 shadow-menu transition-all"
                            ref={sectionRef}
                        >
                            <button className="absolute right-0 top-0 z-100 mr-4 mt-2" onClick={closeErrorConnectionModal}>
                                <svg width={11} height={13} viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="m.766 12.787 2.516 2.515 4.76-4.76 4.74 4.74 2.512-2.514-4.739-4.74 4.748-4.746L12.787.766 8.039 5.513 3.274.747.76 3.26l4.765 4.766-4.76 4.76Z"
                                        fill="#D7D7D7"
                                    />
                                </svg>
                            </button>
                            <div className="p-4">
                                <div className="flex w-full flex-col space-y-2">
                                    <span className="flex items-center gap-2">
                                        <WarningIcon1 width="1rem" height="0.875rem" className="flex h-5 w-6 flex-col items-center" />
                                        <span className="text-xl font-semibold text-yellow-550">{t("Error")}</span>
                                    </span>
                                    <span className="text-sm font-normal leading-6 text-gray-500">{t("pma.Error de conexion")}</span>
                                </div>
                            </div>
                            <div className="h-4 bg-yellow-75"></div>
                        </section>
                    )}
                </Popover.Panel>
            </Transition>
        </Popover>
    );
};

export default OperatorViewSidebar;
