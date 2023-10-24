import get from "lodash/get";
import Avatar from "react-avatar";
import isEmpty from "lodash/isEmpty";
import toUpper from "lodash/toUpper";
import toLower from "lodash/toLower";
import { Menu, Transition } from "@headlessui/react";
import { Fragment, useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import { usePrevious } from "@apps/shared/hooks";
import { JelouApiV1 } from "@apps/shared/modules";
import { addRooms, setStatusOperator, updateUserSession } from "@apps/redux/store";
import { OperatorIcon2 } from "@apps/shared/icons";
import UnattandedCasesWarning from "../unattended-modal/unattended-modal";
import { ChatManagerContext } from "@apps/pma/context";

const StateDropdown = (props) => {
    const { userSession } = props;
    const { t } = useTranslation();
    const [changingStatus, setChangingStatus] = useState(false);
    const [openWarningModal, setOpenWarningModal] = useState({ isOpen: false, numOfRooms: 0 });

    const statusOperator = useSelector((state) => state.statusOperator);
    const dispatch = useDispatch();
    const name = get(userSession, "names", t("pma.usuario"));
    const impersonate = localStorage.getItem("jwt-operator");
    const company = useSelector((state) => state.company);
    const { providerId } = useSelector((state) => state.userSession);

    const { force: isForceNotLogOut = false, enabled: isEnableModalWaring = true } = get(company, "properties.operatorView.logOutWarning", {});

    const { chatManager } = useContext(ChatManagerContext);

    const prevStatus = usePrevious(statusOperator);

    const StatusDot = ({ status }) => {
        switch (toUpper(status)) {
            case "ONLINE":
                return <div className="absolute bottom-0 right-0 -mr-1 h-3 w-3 rounded-full border-2 border-white bg-green-400" />;
            case "BUSY":
                return <div className="absolute bottom-0 right-0 -mr-1 h-3 w-3 rounded-full border-2 border-white bg-yellow-400" />;
            default:
                return <div className="absolute bottom-0 right-0 -mr-1 h-3 w-3 rounded-full border-2 border-white bg-red-675" />;
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

    const logOut = async () => {
        setOperatorState(userSession, "offline");
    };

    const stopImpersonate = () => {
        const url = window.location.origin;
        const website = `${url}/pma/chats`;

        const masterOperator = localStorage.getItem("jwt-operator");
        localStorage.setItem("jwt", masterOperator);

        localStorage.removeItem("jwt-operator");
        window.location.replace(website);
    };

    const handleLogOut = async () => {
        const rooms = await chatManager.getRooms({ providerId });

        if (isEnableModalWaring && rooms.length > 0) {
            setOpenWarningModal({ isOpen: true, numOfRooms: rooms.length });
            dispatch(addRooms(rooms));
            return;
        }
        logOut();
    };

    const handleCloseWaringModal = () => {
        setOpenWarningModal({ isOpen: false, numOfRooms: 0 });
    };

    const Loading = ({ className }) => {
        return (
            <svg className={`${className} -ml-1 mr-3 h-4 w-4 animate-spin`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
        );
    };

    return (
        <div className="mt-1 flex flex-col md:mt-0 md:flex-row">
            <Menu as="div" className="relative inline-block text-left">
                <div>
                    <Menu.Button className="mt-1 flex flex-col items-center space-x-2 md:mt-0 md:flex-row">
                        <div className="relative flex">
                            {!isEmpty(name) && <Avatar name={name} className="block" size="2.25rem" round color="#0fb6b0" textSizeRatio={2} />}
                            <StatusDot status={statusOperator} />
                        </div>
                        <div className="flex sm:items-center md:mr-2">
                            <div className="flex">
                                <svg width="1rem" height="1rem" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M4 6L8 10L12 6" stroke="#707C97" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                        </div>
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
                    <Menu.Items className="ring-1 ring-opacity-5 absolute right-0 z-50 mt-4 w-64 origin-top-right divide-y-1 divide-black/10 rounded-lg bg-white p-1 px-2 shadow-xl ring-black focus:outline-none">
                        {impersonate && (
                            <div className="p-1">
                                <Menu.Item>
                                    {({ active }) => (
                                        <button
                                            className={`${
                                                active ? `bg-gray-100/25 text-primary-200` : `bg-white text-gray-400`
                                            } group flex w-full items-center px-3 py-4`}
                                            onClick={() => {
                                                stopImpersonate();
                                            }}>
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
                        <div className="space-y-2 p-2">
                            <Menu.Item>
                                {({ active }) => (
                                    <button
                                        onClick={changeState}
                                        name="online"
                                        className={`${
                                            active || toUpper(statusOperator) === "ONLINE" ? "bg-opacity-100" : "bg-opacity-35"
                                        } group flex w-full items-center space-x-4 rounded-full bg-whatsapp-150 px-4 py-1 text-sm text-gray-400 hover:font-semibold`}>
                                        {changingStatus ? (
                                            <Loading className="text-green-400" />
                                        ) : (
                                            <div className={`flex h-2 w-2 items-center justify-center rounded-full bg-green-400 text-gray-400`} />
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
                                        onClick={changeState}
                                        name="busy"
                                        className={`${
                                            active || toUpper(statusOperator) === "BUSY" ? "bg-opacity-100" : "bg-opacity-35"
                                        } group flex w-full items-center space-x-4 rounded-full bg-yellow-200 px-4 py-1 text-sm text-gray-400 hover:font-semibold`}>
                                        {changingStatus ? (
                                            <Loading className="text-yellow-400" />
                                        ) : (
                                            <div className={`flex h-2 w-2 items-center justify-center rounded-full bg-yellow-400 text-gray-400`} />
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
                                        onClick={handleLogOut}
                                        name="offline"
                                        className={`${
                                            active || toUpper(statusOperator) === "OFFLINE" ? "bg-opacity-100" : "bg-opacity-35"
                                        } group flex w-full items-center space-x-4 rounded-full bg-red-200 px-4 py-1 text-sm text-gray-400 hover:font-semibold`}>
                                        {changingStatus ? (
                                            <Loading className="text-red-400" />
                                        ) : (
                                            <div className={`flex h-2 w-2 items-center justify-center rounded-full bg-red-400 text-gray-400`} />
                                        )}
                                        <span name="busy" className="flex">
                                            {t("pma.Desconectado")}
                                        </span>
                                    </button>
                                )}
                            </Menu.Item>
                        </div>
                    </Menu.Items>
                </Transition>
            </Menu>
            <UnattandedCasesWarning
                logOut={logOut}
                isForceNotLogOut={isForceNotLogOut}
                closeModal={handleCloseWaringModal}
                openModal={openWarningModal}
            />
        </div>
    );
};

export default StateDropdown;
