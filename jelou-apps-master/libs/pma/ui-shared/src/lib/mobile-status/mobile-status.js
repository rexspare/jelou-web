import isEmpty from "lodash/isEmpty";
import toUpper from "lodash/toUpper";
import toLower from "lodash/toLower";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import React, { useState, useEffect, useRef } from "react";

import { setStatusOperator, logOutUser, updateUserSession } from "@apps/redux/store";
import { useOnClickOutside } from "@apps/shared/hooks";
import { VolumeOffIcon, VolumeOnIcon } from "@apps/shared/icons";
import { JelouApiV1 } from "@apps/shared/modules";

const MobileStatus = (props) => {
    const { setShowSideMenu } = props;
    const { t } = useTranslation();
    const [sound, setSound] = useState(JSON.parse(localStorage.getItem("activeSound")));
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const statusOperator = useSelector((state) => state.statusOperator);
    const impersonate = useSelector((state) => state.impersonate);
    const user = useSelector((state) => state.userSession);
    const [changingStatus, setChangingStatus] = useState("");

    const closeHandler = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setShowSideMenu(false);
    };

    const usePrevious = (value) => {
        const ref = useRef();
        ref.current = value;
        return ref.current;
    };

    const prevStatus = usePrevious(statusOperator);

    const selectValue = async (evt) => {
        const { target } = evt;
        const name = target.getAttribute("name");
        if (toLower(name) === "logout") {
            if (impersonate) {
                localStorage.removeItem("jwt");
                window.location = "/login";
                return;
            }
            logOut();
            return;
        }
        if (toUpper(prevStatus) !== toUpper(name)) {
            // setStatus(user, name);
            dispatch(setStatusOperator(name));
        }
    };

    useEffect(() => {
        if (user.active !== undefined && !isEmpty(statusOperator)) {
            dispatch(setStatusOperator(statusOperator));
        }
    }, [user.active, statusOperator]);

    useEffect(() => {
        if (!isEmpty(user)) {
            if (user.active !== undefined && !isEmpty(statusOperator)) {
                dispatch(setStatusOperator(statusOperator));
            }
        }
    }, [statusOperator, user]);

    const logOut = async () => {
        if (loading) {
            return;
        }
        setLoading(true);
        if (impersonate) {
            localStorage.removeItem("jwt");
            localStorage.removeItem("isPushNotificationsEnabled");
            setLoading(false);
            window.location = "/login";
            return;
        }
        await dispatch(logOutUser(user));
        window.location = "/login";
    };

    const activeSound = (boolean) => {
        localStorage.setItem("activeSound", boolean);
    };

    const ref = useRef();
    useOnClickOutside(ref, closeHandler);

    const changeStatus = async (evt) => {
        evt.preventDefault();
        const { target } = evt;
        const name = target.getAttribute("name");

        try {
            setChangingStatus(name);
            await JelouApiV1.patch(`/operators/${user.operatorId}`, {
                status: name,
                sessionId: user.sessionId,
            });
            const operatorActive = name;
            dispatch(updateUserSession({ operatorActive }));
            dispatch(setStatusOperator(name));
            setChangingStatus("");
        } catch (error) {
            setChangingStatus("");
        }
    };

    const Loading = ({ className }) => {
        return (
            <svg className={`${className} mx-1 h-3 w-3 animate-spin`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
        );
    };

    return (
        <div className={`absolute left-0 top-0 z-50 h-full bg-white px-4 py-2 shadow-menu xl:hidden`} ref={ref}>
            <div className="flex border-b-default border-black border-opacity-10 sm:justify-end">
                <div className="flex cursor-default flex-col py-3 sm:flex-row sm:justify-end">
                    <button
                        onClick={changeStatus}
                        id="online"
                        name="online"
                        className={`${
                            toUpper(statusOperator) === "ONLINE" ? "opacity-100" : "opacity-35"
                        } mr-3 border-b-4 border-transparent text-white`}>
                        <span
                            className={`relative flex min-w-20 cursor-pointer items-center justify-center rounded-full bg-whatsapp-150 px-4 py-0.5 text-sm font-medium leading-5 text-black text-opacity-50`}
                            name="online"
                            onClick={selectValue}>
                            {changingStatus === "online" ? (
                                <Loading className="text-green-400" />
                            ) : (
                                <div className="absolute inset-x-0 ml-2 h-2 w-2 rounded-full bg-green-700" />
                            )}
                            {t("pma.Conectado")}
                        </span>
                    </button>
                    <button
                        name="busy"
                        className={`${
                            toUpper(statusOperator) === "BUSY" ? "opacity-100" : "opacity-35"
                        } min-w-20 border-b-4 border-transparent text-white`}>
                        <span
                            className={`relative flex cursor-pointer items-center justify-center rounded-full bg-[#fef9c3] px-4 py-0.5 text-sm font-medium leading-5 text-black text-opacity-50`}
                            name="busy"
                            onClick={selectValue}>
                            {changingStatus === "busy" ? (
                                <Loading className="text-yellow-400" />
                            ) : (
                                <div className="absolute inset-x-0 ml-2 h-2 w-2 rounded-full bg-yellow-500" />
                            )}
                            {t("pma.No disponible")}
                        </span>
                    </button>
                </div>
            </div>

            <div
                className="flex cursor-pointer items-center border-b-default border-black border-opacity-10 px-3 py-4 hover:bg-gray-50"
                onClick={() => {
                    activeSound(!sound);
                    setSound(!sound);
                }}>
                <div className="relative mr-2 rounded-full bg-gray-37">
                    {sound ? (
                        <VolumeOnIcon className="-mb-px mr-px fill-current" fill="#31355C" width="2.188rem" height="2.188rem" />
                    ) : (
                        <VolumeOffIcon className="m-2 fill-current text-gray-400" width="1.25rem" height="1.25rem" />
                    )}
                </div>
                <div className="flex flex-col">
                    {sound ? (
                        <>
                            <div className="text-sm font-bold text-gray-400">{t("pma.Silenciar")}</div>
                            <div className="text-xs font-medium text-gray-400">{t("pma.Silencia tus mensajes")}</div>
                        </>
                    ) : (
                        <>
                            <div className="text-sm font-bold text-gray-400">{t("pma.Activar")}</div>
                            <div className="text-xs font-medium text-gray-400">{t("pma.Activa tus mensajes")}</div>
                        </>
                    )}
                </div>
            </div>
            <div className="flex cursor-pointer items-center px-3 py-4" name={"LogOut"} onClick={() => logOut()} disabled={loading}>
                <div className="relative mr-2 flex flex-col">
                    <div className="text-sm font-bold text-red-675">{loading ? t("pma.Cerrando...") : t("pma.Salir")}</div>
                </div>
            </div>
        </div>
    );
};

export default MobileStatus;
