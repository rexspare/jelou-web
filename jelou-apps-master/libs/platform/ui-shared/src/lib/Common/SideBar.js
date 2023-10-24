import { Tracker } from "@apps/shared/modules";
import Tippy from "@tippyjs/react";
import first from "lodash/first";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import orderBy from "lodash/orderBy";
import "tippy.js/dist/tippy.css";

import { addTeams, addTeamScopes, getBots, getUsers, setCompany, setPermissions, setStatusOperator, setUnauthorization, setUserSession, unsetCompany } from "@apps/redux/store";
import { Popover, Transition as TransitionHeadless } from "@headlessui/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { SyncLoader } from "react-spinners";
import OperatorViewSidebar from "./OperatorViewSidebar";

import { Dropdown, NotifyError } from "@apps/shared/common";
import { JelouApi } from "@apps/shared/constants";
import { BackArrowIcon, BrainIcon, BuilderIcon, ClientIcon, HomeSideBarIcon, Hsm, JelouLogoIcon, MetricsIcon, MonitoringIcon, ReportsIcon, ShopIcon } from "@apps/shared/icons";

import { DashboardServer, ImpersonateHttp, JelouApiV1 } from "@apps/shared/modules";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import jwtDecode from "jwt-decode";
import SubCompaniesSelect from "./SubCompaniesSelect";

dayjs.extend(utc);
const { NX_REACT_APP_ONESIGNAL_APPID } = process.env;

const isActiveClassName =
    "group flex justify-center p-1 pr-0 md:py-3 md:px-1 text-sm leading-5 text-gray-400 focus:outline-none transition ease-in-out duration-150 bg-primary-700 rounded-none border-selected border-sidebar border-primary-200";

const isNotActiveClassName =
    "group flex justify-center p-1 pr-0 md:py-3 md:px-1 text-sm leading-5 text-gray-400 focus:outline-none hover:bg-primary-700 transition ease-in-out duration-150 border-sidebar border-transparent";

const MESSAGE_COUNT_KEY = "jelou-app-message-count";
const { IS_PRODUCTION } = require("config");

const inProd = IS_PRODUCTION;

export default function Sidebar(props) {
    const { location, steps } = props;
    const params = useParams();
    const DEFAULT_LOGO = "https://s3-us-west-2.amazonaws.com/cdn.devlabs.tech/bsp-images/icono_bot.svg";
    const [mobileOpen, setMobileOpen] = useState(false);
    const [names, setNames] = useState("");
    const [email, setEmail] = useState("");
    const [messages, setMessages] = useState(0);
    const [tab, setTab] = useState("");
    const [tabClients, setTabClients] = useState("");
    const [subCompanies, setSubCompanies] = useState([]);
    const [impersonateCompany, setImpersonateCompany] = useState(null);
    const [loadingAvatar, setLoadingAvatar] = useState(false);
    const permissions = useSelector((state) => state.permissions);
    const company = useSelector((state) => state.company);
    const unauthorized = useSelector((state) => state.unauthorized);
    const companyId = get(company, "id");
    const reportsPermission = permissions.find((data) => data === "report:view_report");
    const databasePermission = permissions.find((permission) => permission === "datum:view_databases");
    const monitoringPermission = permissions.find((data) => data === "monitoring:view_monitoring");
    const analyticsPermission = permissions.find((data) => data === "analytic:view_analytics");
    const botsPermission = permissions.find((data) => data === "bot:view_bot");
    const hsmPermission = permissions.find((data) => data === "hsm:view_hsm_ui");
    const botsSettingsPermission = !isEmpty(permissions) ? permissions.find((data) => data === "settings:view_bot_settings") : "";
    const teamSettingsPermission = !isEmpty(permissions) ? permissions.find((data) => data === "settings:team_settings") : "";
    const companySettingsPermission = !isEmpty(permissions) ? permissions.find((data) => data === "settings:company_settings") : "";
    const schedulesPermission = permissions.some((data) => data.startsWith("schedules:"));
    const clientsPermission = permissions.find((data) => data === "clients:view_clients");
    const operatorPermissions = permissions.find((data) => data === "operator:view_ov");
    const imaginePermissions = permissions.find((data) => data === "imaginate:view_imaginate");
    const navigate = useNavigate();
    const source = axios.CancelToken.source();
    const [cancelToken, setCancelToken] = useState();
    const lang = useSelector((state) => state.userSession?.lang) ?? "es";
    const usersAdminPermissions = !isEmpty(permissions) ? permissions.find((data) => data === "user:view_user" || data === "rol:view_rol" || data === "team:view_team") : "";

    const userSession = useSelector((state) => state.userSession);
    const timezone = get(userSession, "timezone", "America/Guayaquil");
    dayjs.tz.setDefault(timezone);
    const ecommerceViewProductPermission = permissions.find((data) => data === "ecommerce:view_product");
    const ecommerceViewOrdersPermission = permissions.find((data) => data === "ecommerce:view_order");
    const { t } = useTranslation();
    const dispatch = useDispatch();

    useEffect(() => {
        if (window.location.pathname === "/shop" && company?.properties?.shopCredentials) navigate("/shop/products");
        if (window.location.pathname === "/shop" && !company?.properties?.shopCredentials) navigate("/shop/activate");
    }, [window.location.pathname]);

    useEffect(() => {
        if (!isEmpty(company)) {
            dispatch(getBots(company.id));
        }
    }, [company]);

    useEffect(() => {
        if (isEmpty(company)) {
            setLoadingAvatar(true);
            getCompany();
        }
    }, []);

    useEffect(() => {
        if (!isEmpty(company)) {
            getSubcompanies();
        }
    }, [company, impersonateCompany]);

    const searchTab = (tab) => {
        switch (tab) {
            case "clients:view_clients":
                return "conversation";
            case "hsm:view_report":
                return "campaigns";
            case "hsm:view_template":
                return "templates";
            default:
                return "campaigns";
        }
    };

    useEffect(() => {
        function handleEscape(event) {
            if (!mobileOpen) return;

            if (event.key === "Escape") {
                setMobileOpen(false);
            }
        }

        document.addEventListener("keyup", handleEscape);
        return () => document.removeEventListener("keyup", handleEscape);
    }, [mobileOpen]);

    useEffect(() => {
        if (!isEmpty(impersonateCompany)) {
            getUserSession();
        }
    }, [impersonateCompany]);

    useEffect(() => {
        const jwtMaster = localStorage.getItem("jwt-master");
        const jwt = localStorage.getItem("jwt");
        const jwtToDecode = jwtMaster || jwt;
        if (!unauthorized) {
            try {
                const userSession = jwtDecode(jwtToDecode);
                if (Tracker && inProd) {
                    Tracker.start();
                    Tracker.setUserID(userSession.email);
                    Tracker.setMetadata("Id", userSession.id);
                    Tracker.setMetadata("Name", userSession.names);
                }
            } catch (error) {
                console.log(error);
            }
        }
    }, [unauthorized]);

    useEffect(() => {
        if (clientsPermission && !isEmpty(company)) {
            dispatch(getUsers(companyId));
        }
    }, [clientsPermission, company]);

    useEffect(() => {
        if (!isEmpty(permissions)) {
            const hsmPermissionsArr = permissions.filter((data) => data.startsWith("hsm:view_") && data !== "hsm:view_hsm_ui");
            setTab(searchTab(first(hsmPermissionsArr)));
            if (pathname.endsWith("/templates")) {
                setTab("templates");
            }
            if (pathname.endsWith("/campaigns")) {
                setTab("campaigns");
            }

            const clientsPermissionsArr = permissions.filter((data) => data.startsWith("clients:view_"));
            setTabClients(searchTab(first(clientsPermissionsArr)));

            if (pathname.endsWith("/conversation")) {
                setTabClients("conversation");
            }
            if (pathname.endsWith("/profile")) {
                setTabClients("profile");
            }
        }
    }, [permissions]);

    useEffect(() => {
        const { pathname } = location;
        if (pathname === "/help-desk") {
            setMessages(0);
            localStorage.removeItem(MESSAGE_COUNT_KEY);
        }
    }, [location]);

    useEffect(() => {
        const storedMessages = localStorage.getItem(MESSAGE_COUNT_KEY);
        if (storedMessages && storedMessages > 0) {
            setMessages((messages) => messages + Number(storedMessages));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem(MESSAGE_COUNT_KEY, messages);
    }, [messages]);

    const subscribeToNotifications = (providerId) => {
        console.log("establing connection with onesignal", providerId);
        const OneSignal = window.OneSignal || [];
        OneSignal.push(function () {
            OneSignal.init({
                appId: NX_REACT_APP_ONESIGNAL_APPID,
            });
            OneSignal.sendTags({
                providerId,
            });
        });
        try {
            OneSignal.on("subscriptionChange", function (isSubscribed) {
                console.log("The user's subscription state is now:", isSubscribed);
            });
        } catch (error) {
            console.log("oneSignal error ===>", error);
        }
    };

    const getUserSession = async () => {
        try {
            if (isEmpty(userSession)) {
                const impersonateId = localStorage.getItem("master-id");
                const impersonateOperator = localStorage.getItem("jwt-operator");
                const { data: response } = await DashboardServer.get("/auth/me", {
                    params: { ...(!isEmpty(impersonateCompany) && isEmpty(impersonateOperator) ? { impersonateId } : {}) },
                });
                const { data } = response;

                const monitorAllTeams = get(data, "monitorAllTeams", false);

                dispatch(addTeams(get(data, "teams", [])));
                dispatch(addTeamScopes(monitorAllTeams ? [] : get(data, "teamScopes", [])));
                dispatch(setUserSession(data));
                setNames(data.names);
                setEmail(data.email);
                subscribeToNotifications(data.providerId);
                dispatch(setPermissions(get(data, "permissions", [])));
                dispatch(setUnauthorization(false));

                const statusOperator = get(data, "operatorActive", null);
                if (statusOperator) {
                    dispatch(setStatusOperator(statusOperator));
                }
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (!isEmpty(userSession)) {
            setNames(userSession.names);
            setEmail(userSession.email);
        }
    }, [userSession]);

    const getCompany = async () => {
        try {
            JelouApi.getCompany()
                .then((response) => {
                    const { data } = response;
                    if (!isEmpty(data)) {
                        setCompany(data);
                        dispatch(setCompany(data));
                    }
                    if (isEmpty(localStorage.getItem("jwt-master"))) {
                        setImpersonateCompany(data);
                    }
                    setLoadingAvatar(false);
                })
                .catch((error) => {
                    setLoadingAvatar(false);
                    console.log(error);
                });
            if (!isEmpty(localStorage.getItem("jwt-master"))) {
                const headers = { Authorization: `Bearer ${localStorage.getItem("jwt-master")}` };
                await JelouApi.getCompany(headers).then((response) => {
                    setImpersonateCompany(response.data);
                });
            }
        } catch (error) {
            setLoadingAvatar(false);
            console.log(error);
        }
    };

    const getSubcompanies = async () => {
        if (!isEmpty(cancelToken)) {
            await cancelToken.cancel("Operation canceled due to new request.");
        }
        let subCompanies = [];
        try {
            setCancelToken(source);
            const { id } = !isEmpty(localStorage.getItem("jwt-master")) && !isEmpty(impersonateCompany) ? impersonateCompany : company;
            JelouApiV1.get(`/company/${id}/subcompanies`, {
                ...(!isEmpty(localStorage.getItem("jwt-master")) ? { Authorization: `Bearer ${localStorage.getItem("jwt-master")}` } : {}),
                cancelToken: source.token,
            })
                .then((response) => {
                    const { results } = response.data;
                    results.forEach((company) => {
                        const botCount = get(company, "botCount", 0);
                        if (botCount !== 0 && company.state === 1 && company.id !== id) {
                            subCompanies.push(company);
                        }
                        subCompanies = orderBy(subCompanies, ["name"], ["asc"]);
                    });
                    setSubCompanies(subCompanies);
                })
                .catch((err) => {
                    console.log("error", err);
                });
        } catch (error) {
            console.log(error);
        }
    };

    const changeUserContext = async (companyObj) => {
        const jwtOperatorExists = !!localStorage.getItem("jwt-operator");
        if (jwtOperatorExists) {
            // if operator is impersonating so we go back to master and then change to the new company
            localStorage.setItem("jwt", localStorage.getItem("jwt-operator"));
            localStorage.removeItem("jwt-operator");
        }
        try {
            const existMaster = localStorage.getItem("company-master");
            if (!isEmpty(existMaster)) {
                // use master bearer
                ImpersonateHttp.interceptors.request.use((config) => {
                    return {
                        ...config,
                        headers: {
                            "Accept-Language": "es",
                            Authorization: `Bearer ${localStorage.getItem("jwt-master")}`,
                        },
                    };
                });
                ImpersonateHttp.post(`/companies/${existMaster}/impersonate`, {
                    toCompanyId: companyObj.id.toString(),
                })
                    .then((response) => {
                        const { data } = response.data;
                        localStorage.setItem("jwt", data.token);
                        localStorage.setItem("user", data.user.names);
                        localStorage.removeItem("jwt-operator");

                        dispatch(unsetCompany());

                        window.location.replace("/home");
                    })
                    .catch((error) => {
                        setLoadingAvatar(false);
                        NotifyError(get(error.response.data.error.clientMessages, lang, "Error"));
                    });
            } else {
                DashboardServer.post(`/companies/${company.id}/impersonate`, {
                    toCompanyId: companyObj.id.toString(),
                })
                    .then((response) => {
                        const { data } = response.data;
                        localStorage.setItem("jwt-master", localStorage.getItem("jwt"));
                        localStorage.setItem("company-master", company.id);
                        localStorage.setItem("user-master", localStorage.getItem("user"));
                        localStorage.setItem("url-master", company.imageUrl);
                        localStorage.setItem("company-name-master", company.name);
                        localStorage.setItem("jwt", data.token);
                        localStorage.setItem("user", data.user.names);
                        localStorage.setItem("master-id", userSession.id);
                        localStorage.removeItem("jwt-operator");

                        dispatch(unsetCompany());
                        window.location = "/home";
                    })
                    .catch(function (error) {
                        setLoadingAvatar(false);
                        NotifyError(get(error.response.data.error.clientMessages, lang, "Error"));
                    });
            }
        } catch (error) {
            setLoadingAvatar(false);
            console.log(error);
        }
    };

    const deleteUserContext = async () => {
        try {
            const existMaster = localStorage.getItem("jwt-master");
            if (!isEmpty(existMaster)) {
                localStorage.setItem("jwt", localStorage.getItem("jwt-master"));
                localStorage.setItem("user", localStorage.getItem("user-master"));
                localStorage.removeItem("jwt-master");
                localStorage.removeItem("master-id");
                localStorage.removeItem("jwt-operator");
                localStorage.removeItem("company-master");
                localStorage.removeItem("user-master");
                localStorage.removeItem("url-master");
                localStorage.removeItem("company-name-master");
                dispatch(unsetCompany());
                window.location.reload();
            } else {
                setLoadingAvatar(false);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const { pathname } = location;

    let isActiveHsm = window.location.pathname.includes("hsm");
    let isActiveMonioring = window.location.pathname.includes("monitoring");

    const onlyImpersonateCompany = !isEmpty(localStorage.getItem("jwt-master")) && isEmpty(localStorage.getItem("jwt-operator"));

    return (
        <div className={params["*"]?.includes("previewscreen") ? "hidden" : ""}>
            <div className="bg-cool-gray-400/75 fixed z-100 flex h-full overflow-y-auto sm:h-screen">
                <div className="flex flex-shrink-0">
                    <div className="flex flex-col">
                        <div className="relative flex w-[4rem] flex-1 flex-col bg-white md:w-[5.2rem]">
                            <div className="flex flex-1 flex-col items-center overflow-y-auto py-5">
                                <div className="relative flex items-center">
                                    <Popover className="flex items-stretch">
                                        {({ open }) => (
                                            <>
                                                <Tippy
                                                    content={!isEmpty(localStorage.getItem("jwt-master")) && company.name}
                                                    placement={"right"}
                                                    theme={"jelou"}
                                                    touch={false}
                                                    disabled={isEmpty(localStorage.getItem("jwt-master"))}
                                                >
                                                    <Popover.Button className={`mb-5 flex flex-shrink-0 items-center ${isEmpty(subCompanies) && `cursor-default`}`}>
                                                        {isEmpty(localStorage.getItem("jwt-master")) && !loadingAvatar ? (
                                                            <div className="relative">
                                                                <div
                                                                    className={`flex h-10 w-10 items-center justify-center rounded-full bg-primary-200 focus:bg-primary-250 md:h-12 md:w-12 ${
                                                                        open && `opacity-10`
                                                                    }`}
                                                                >
                                                                    <JelouLogoIcon className="text-primary-200" width="2.813rem" height="2.813rem" />
                                                                </div>
                                                                {open && (
                                                                    <div
                                                                        style={{
                                                                            position: "absolute",
                                                                            top: "0.875rem",
                                                                            left: "0.75rem",
                                                                        }}
                                                                        className="overflow-hidden"
                                                                    >
                                                                        <BackArrowIcon className="text-primary-200 " width="1.25rem" height="1.25rem" fill="currentColor" />
                                                                    </div>
                                                                )}
                                                            </div>
                                                        ) : (
                                                            <div className="relative">
                                                                <div className={`flex h-12 w-12 items-center justify-center rounded-full bg-primary-200 focus:bg-primary-250 ${open && `opacity-10`}`}>
                                                                    {loadingAvatar ? (
                                                                        <SyncLoader color={"white"} size={"0.313rem"} />
                                                                    ) : !isEmpty(localStorage.getItem("jwt-master")) ? (
                                                                        <div
                                                                            className={`absolute flex h-12 w-12 items-center overflow-hidden rounded-full bg-white object-contain ${!open && `left-1`}`}
                                                                        >
                                                                            <img
                                                                                src={isEmpty(company.imageUrl) ? DEFAULT_LOGO : company.imageUrl}
                                                                                alt="template"
                                                                                className="h-full w-12 rounded-full object-contain"
                                                                            />
                                                                        </div>
                                                                    ) : (
                                                                        <div className="flex h-12 w-12 items-center overflow-hidden rounded-full bg-white object-cover">
                                                                            <img
                                                                                src={isEmpty(company.imageUrl) ? DEFAULT_LOGO : company.imageUrl}
                                                                                alt="template"
                                                                                className="h-full w-12 rounded-full object-contain"
                                                                            />
                                                                        </div>
                                                                    )}
                                                                </div>
                                                                {open && (
                                                                    <div
                                                                        style={{
                                                                            position: "absolute",
                                                                            top: "0.875rem",
                                                                            left: "0.75rem",
                                                                        }}
                                                                        className="overflow-hidden"
                                                                    >
                                                                        <BackArrowIcon className="text-primary-200 " width="1.25rem" height="1.25rem" fill="currentColor" />
                                                                    </div>
                                                                )}
                                                            </div>
                                                        )}
                                                    </Popover.Button>
                                                </Tippy>
                                                <TransitionHeadless
                                                    enter="transition-opacity duration-75"
                                                    enterFrom="opacity-0"
                                                    enterTo="opacity-100"
                                                    leave="transition-opacity duration-550"
                                                    leaveFrom="opacity-100"
                                                    leaveTo="opacity-0"
                                                >
                                                    <Popover.Panel
                                                        className="fixed top-auto z-100 rounded-xl border-1 border-gray-300 border-opacity-10 bg-white shadow-menu"
                                                        style={{
                                                            left: "5.625rem",
                                                            top: "2.313rem",
                                                            minWidth: "23.813rem",
                                                        }}
                                                    >
                                                        <SubCompaniesSelect
                                                            subCompanies={subCompanies}
                                                            changeUserContext={changeUserContext}
                                                            company={company}
                                                            setLoadingAvatar={setLoadingAvatar}
                                                            deleteUserContext={deleteUserContext}
                                                            setImpersonateCompany={setImpersonateCompany}
                                                            loadingAvatar={loadingAvatar}
                                                            location={location}
                                                        />
                                                    </Popover.Panel>
                                                </TransitionHeadless>
                                            </>
                                        )}
                                    </Popover>
                                </div>

                                <nav className="flex w-full flex-1 flex-col items-center bg-white">
                                    {
                                        <Tippy theme={"jelou"} content={t("componentCommonSidebar.home")} placement={"right"} touch={false}>
                                            <div className="w-full justify-center">
                                                <NavLink to="/home" className={({ isActive }) => (isActive ? isActiveClassName : isNotActiveClassName)}>
                                                    <div className="flex flex-col">
                                                        <HomeSideBarIcon className="text-gray-600" width="2.1em" fill="currentColor" stroke="currentColor" />
                                                        <p className="mt-1 text-center text-[0.5rem] md:text-[0.6rem]">{t("Home")}</p>
                                                    </div>
                                                </NavLink>
                                            </div>
                                        </Tippy>
                                    }
                                    {operatorPermissions && !onlyImpersonateCompany && (
                                        <div className="relative w-full justify-center">
                                            <div className="w-full justify-center">
                                                <OperatorViewSidebar />
                                            </div>
                                        </div>
                                    )}
                                    {botsPermission && (
                                        <Tippy theme={"jelou"} content={t("componentCommonSidebar.bots")} placement={"right"} touch={false}>
                                            <div className="w-full justify-center">
                                                <NavLink to="/bots" className={({ isActive }) => (isActive ? isActiveClassName : isNotActiveClassName)}>
                                                    <BuilderIcon
                                                        className="text-opacity-75 transition duration-150 ease-in-out group-hover:text-gray-400 group-focus:text-gray-600"
                                                        width="2.188rem"
                                                        height="2.188rem"
                                                        fill="currentColor"
                                                    />
                                                </NavLink>
                                            </div>
                                        </Tippy>
                                    )}
                                    {analyticsPermission && (
                                        <Tippy theme={"jelou"} content={t("componentCommonSidebar.metrics")} placement={"right"} touch={false}>
                                            <div className="w-full justify-center">
                                                <div id="tooltip" role="tooltip">
                                                    <NavLink to="/metrics" className={({ isActive }) => (isActive ? isActiveClassName : isNotActiveClassName)}>
                                                        <MetricsIcon
                                                            className="text-opacity-75 transition duration-150 ease-in-out group-hover:text-gray-400 group-focus:text-gray-400"
                                                            width="1.75rem"
                                                            height="1.688rem"
                                                            fill="none"
                                                        />
                                                    </NavLink>
                                                </div>
                                            </div>
                                        </Tippy>
                                    )}

                                    {(reportsPermission || databasePermission) && (
                                        <Tippy theme={"jelou"} content={t("componentCommonSidebar.datum")} placement={"right"} touch={false}>
                                            <div className="w-full justify-center">
                                                <NavLink to="/datum" className={({ isActive }) => (isActive ? isActiveClassName : isNotActiveClassName)}>
                                                    <ReportsIcon
                                                        className="text-opacity-75 transition duration-150 ease-in-out group-hover:text-gray-400 group-focus:text-gray-600"
                                                        width="1.875rem"
                                                        height="1.875rem"
                                                        fill="currentColor"
                                                    />
                                                </NavLink>
                                            </div>
                                        </Tippy>
                                    )}
                                    {monitoringPermission && (
                                        <Tippy theme={"jelou"} content={t("componentCommonSidebar.monitoring")} placement={"right"} touch={false}>
                                            <div className="w-full justify-center">
                                                <NavLink to="/monitoring/live" className={isActiveMonioring ? isActiveClassName : isNotActiveClassName}>
                                                    <MonitoringIcon
                                                        className="text-opacity-75 transition duration-150 ease-in-out group-hover:text-gray-400 group-focus:text-gray-600"
                                                        width="1.75rem"
                                                        height="1.688rem"
                                                        fill="currentColor"
                                                    />
                                                </NavLink>
                                            </div>
                                        </Tippy>
                                    )}

                                    {hsmPermission && (
                                        <Tippy theme={"jelou"} content={t("hsm.menuName")} placement={"right"} touch={false}>
                                            <div className="w-full justify-center">
                                                <div id="tooltip" role="tooltip">
                                                    <NavLink to={`/hsm/${tab}`} className={isActiveHsm ? isActiveClassName : isNotActiveClassName}>
                                                        <Hsm
                                                            className="text-opacity-75 transition duration-150 ease-in-out group-hover:text-gray-400 group-focus:text-gray-600"
                                                            width="1.875rem"
                                                            height="1.875rem"
                                                            fill="currentColor"
                                                        />
                                                    </NavLink>
                                                </div>
                                            </div>
                                        </Tippy>
                                    )}
                                    {clientsPermission && (
                                        <Tippy theme={"jelou"} content={t("sideBar.clients")} placement={"right"} touch={false}>
                                            <div className="w-full justify-center">
                                                <NavLink to={`/clients/${tabClients}`} className={({ isActive }) => (isActive ? isActiveClassName : isNotActiveClassName)}>
                                                    <div className="flex w-full flex-col">
                                                        <ClientIcon
                                                            className="text-opacity-75 transition duration-150 ease-in-out group-hover:text-gray-400"
                                                            width="1.875rem"
                                                            height="1.875rem"
                                                            fill="currentColor"
                                                        />
                                                        <p className="mt-1 text-center text-[0.5rem] leading-3 md:text-[0.6rem]">{t("sideBar.clients")}</p>
                                                    </div>
                                                </NavLink>
                                            </div>
                                        </Tippy>
                                    )}
                                    {(ecommerceViewProductPermission || ecommerceViewOrdersPermission) && (
                                        <Tippy theme={"jelou"} content={t("sideBar.shop")} placement={"right"} touch={false}>
                                            <div className="w-full justify-center">
                                                <NavLink to={`/shop/products`} className={({ isActive }) => (isActive ? isActiveClassName : isNotActiveClassName)}>
                                                    <div className="flex w-full flex-col">
                                                        <ShopIcon width={24} height={29} />
                                                    </div>
                                                </NavLink>
                                            </div>
                                        </Tippy>
                                    )}
                                    {imaginePermissions && (
                                        <Tippy theme={"jelou"} content={t("componentCommonSidebar.brain")} placement={"right"} touch={false}>
                                            <div className="w-full justify-center">
                                                <NavLink to={`/brain`} className={({ isActive }) => (isActive ? isActiveClassName : isNotActiveClassName)}>
                                                    <div className="flex w-full flex-col items-center">
                                                        <BrainIcon />
                                                        <p className="mt-1 text-center text-[0.5rem] leading-3 md:text-[0.6rem]">{t("componentCommonSidebar.brain")}</p>
                                                    </div>
                                                </NavLink>
                                            </div>
                                        </Tippy>
                                    )}
                                </nav>
                            </div>
                            <Dropdown
                                botsSettingsPermission={botsSettingsPermission}
                                companySettingsPermission={companySettingsPermission}
                                teamSettingsPermission={teamSettingsPermission}
                                schedulesPermission={schedulesPermission}
                                usersAdminPermissions={usersAdminPermissions}
                                company={company}
                                steps={steps}
                                names={names}
                                email={email}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
