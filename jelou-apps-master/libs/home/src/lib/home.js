import first from "lodash/first";
import get from "lodash/get";
import Avatar from "react-avatar";
import { useLocation } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

import { Menu } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/solid";
import isEmpty from "lodash/isEmpty";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import NotificationsCenter from "@apps/notification-center";
import { updateUserSession } from "@apps/redux/store";
import { Modal, PreviewUpdateModal } from "@apps/shared/common";
import { useOnClickOutside } from "@apps/shared/hooks";
import { EnglishIcon, PortugueseIcon, SpanishIcon } from "@apps/shared/icons";
import { i18n } from "@apps/shared/utils";

// import Carousel from "nuka-carousel";

import { DashboardServer } from "@apps/shared/modules";
import { BeatLoader } from "react-spinners";
import CardLink from "./components/CardLink";
import SalesModal from "./components/SalesModal";

const Home = (props) => {
    const { t } = useTranslation();
    const { getCampaigns, setShowPage404, notifications, setSteps, showVideoRelease, setShowVideoRelease } = props;
    const userSession = useSelector((state) => state.userSession);
    const [flag, setFlag] = useState("");
    const [hsmPermission, setHsmPermission] = useState(false);
    const [showCampaigns, setShowCampaigns] = useState(false);
    const [botsPermission, setBotPermission] = useState(false);
    const [datumPermission, setDatumPermission] = useState(false);
    const [clientsPermission, setClientsPermission] = useState(false);
    const [analyticsPermission, setAnalyticsPermission] = useState(false);
    const [ecommercePermission, setEcommercePermission] = useState(false);
    const [monitoringPermission, setMonitoringPermission] = useState(false);
    const [usersAdminPermissions, setUsersAdminPermissions] = useState(false);
    const [currentLangDescription, setCurrentLangDescription] = useState("");
    const [openSalesModal, setOpenSalesModal] = useState(false);
    const [operatorPermissions, setOperatorPermissions] = useState(false);
    const salesModal = useRef();

    const campaignNotSeen = useSelector((state) => state.campaignNotSeen);

    const botsSettingsPermission = !isEmpty(userSession.permissions) ? userSession.permissions.find((data) => data === "settings:view_bot_settings") : "";
    const teamSettingsPermission = !isEmpty(userSession.permissions) ? userSession.permissions.find((data) => data === "settings:team_settings") : "";
    const companySettingsPermission = !isEmpty(userSession.permissions) ? userSession.permissions.find((data) => data === "settings:company_settings") : "";
    const schedulesPermission = !isEmpty(userSession.permissions) ? userSession.permissions.some((data) => data.startsWith("schedules:")) : "";
    const settingsPermission = schedulesPermission || botsSettingsPermission || companySettingsPermission || teamSettingsPermission;
    useOnClickOutside(salesModal, () => setOpenSalesModal(false));
    const [tab, setTab] = useState("");
    const [tabClients, setTabClients] = useState("");
    const [loadingLang, setLoadingLang] = useState(false);

    const location = useLocation();

    const name = first(get(userSession, "names", "").split(" "));
    const names = get(userSession, "names", "");
    const email = get(userSession, "email", "");
    const lang = get(userSession, "lang", "es");
    const dispatch = useDispatch();

    useEffect(() => {
        setShowPage404(false);
        getCampaigns();
    }, []);

    useEffect(() => {
        if (!isEmpty(showVideoRelease)) {
            const steps = get(showVideoRelease, "Steps", []);
            setSteps(steps);
        }
    }, [showVideoRelease]);

    const closeSalesModal = () => {
        setOpenSalesModal(false);
    };

    const { pathname } = location;

    useEffect(() => {
        if (!isEmpty(userSession)) {
            setBotPermission(!!userSession.permissions.find((data) => data === "bot:view_bot"));
            setDatumPermission(!!userSession.permissions.find((data) => data === "report:view_report" || data === "datum:view_databases"));
            setMonitoringPermission(!!userSession.permissions.find((data) => data === "monitoring:view_monitoring"));
            setAnalyticsPermission(!!userSession.permissions.find((data) => data === "analytic:view_analytics"));
            setHsmPermission(!!userSession.permissions.find((data) => data === "hsm:view_hsm_ui"));
            setUsersAdminPermissions(
                !isEmpty(userSession.permissions) ? !!userSession.permissions.find((data) => data === "user:view_user" || data === "rol:view_rol" || data === "team:view_team") : ""
            );
            setClientsPermission(!!userSession.permissions.find((data) => data === "clients:view_clients"));
            setEcommercePermission(!!userSession.permissions.find((data) => data === "ecommerce:view_product" || data === "ecommerce:view_order"));
            setOperatorPermissions(!!userSession.permissions.find((data) => data === "operator:view_ov"));
            const hsmPermissionsArr = userSession.permissions.filter((data) => data.startsWith("hsm:view_") && data !== "hsm:view_hsm_ui");
            setTab(searchTab(first(hsmPermissionsArr)));

            if (pathname.endsWith("/templates")) {
                setTab("templates");
            }
            if (pathname.endsWith("/campaigns")) {
                setTab("campaigns");
            }

            const clientsPermissionsArr = userSession.permissions.filter((data) => data.startsWith("clients:view_"));
            setTabClients(searchTab(first(clientsPermissionsArr)));

            if (pathname.endsWith("/conversation")) {
                setTabClients("conversation");
            }
            if (pathname.endsWith("/profile")) {
                setTabClients("profile");
            }
        }
    }, [userSession]);

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

    const setLanguage = async (value) => {
        setLoadingLang(true);
        try {
            await DashboardServer.patch(`/user/profile`, { lang: value }).then(() => {
                dispatch(updateUserSession({ lang: value }));
                i18n.changeLanguage(value);
                setFlag(setFlagLang(value));
                let languageSelected = "es";
                switch (value) {
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
                setLoadingLang(false);
            });
        } catch (error) {
            setLoadingLang(false);
            toast.error(t("Ha ocurrido al intentar cambiar el idioma, vuelva a intentar por favor"), {
                position: toast.POSITION.BOTTOM_RIGHT,
            });
            console.log(error);
        }
    };

    const setFlagLang = (lang) => {
        switch (lang) {
            case "es":
                setCurrentLangDescription("Español");
                return <SpanishIcon className="cursor-pointer fill-current text-gray-450" width="1.5rem" height="1.625rem" />;
            case "en":
                setCurrentLangDescription("English");
                return <EnglishIcon className="cursor-pointer fill-current text-gray-450" width="1.5rem" height="1.625rem" />;
            case "pt":
                setCurrentLangDescription("Portuguese");
                return <PortugueseIcon className="cursor-pointer fill-current text-gray-450" width="1.563rem" height="1.625rem" />;
            default:
                setCurrentLangDescription("Español");
                return <SpanishIcon className="cursor-pointer fill-current text-gray-450" width="1.5rem" height="1.625rem" />;
        }
    };

    useEffect(() => {
        setFlag(setFlagLang(lang));
    }, [lang]);

    const isOperator = get(userSession, "isOperator", false);
    const appsLinks = [
        {
            disabled: botsPermission,
            component: (
                <CardLink
                    key="0"
                    permission={botsPermission}
                    t={t}
                    enabledImg={"/assets/illustrations/bot.svg"}
                    disabledImg={"/assets/illustrations/botDisabled.svg"}
                    navigateTo={"/bots"}
                    cardTitle={"componentCommonSidebar.bots"}
                />
            ),
        },
        {
            disabled: operatorPermissions && isOperator,
            component: (
                <CardLink
                    key="1"
                    permission={operatorPermissions && isOperator}
                    t={t}
                    enabledImg={"assets/illustrations/pma.svg"}
                    disabledImg={"assets/illustrations/pmaDisabled.svg"}
                    navigateTo={"/pma"}
                    cardTitle={"componentCommonSidebar.multiagent"}
                    show={operatorPermissions && isOperator}
                />
            ),
        },
        {
            disabled: analyticsPermission,
            component: (
                <CardLink
                    key="2"
                    permission={analyticsPermission}
                    t={t}
                    enabledImg={"assets/illustrations/metrics.svg"}
                    disabledImg={"assets/illustrations/metricsDisabled.svg"}
                    navigateTo={"/metrics"}
                    cardTitle={"componentCommonSidebar.metrics"}
                />
            ),
        },
        {
            disabled: datumPermission,
            component: (
                <CardLink
                    key="3"
                    permission={datumPermission}
                    t={t}
                    enabledImg={"assets/illustrations/data.svg"}
                    disabledImg={"assets/illustrations/dataDisabled.svg"}
                    navigateTo={"/datum"}
                    cardTitle={"componentCommonSidebar.datum"}
                />
            ),
        },
        {
            disabled: monitoringPermission,
            component: (
                <CardLink
                    key="4"
                    permission={monitoringPermission}
                    t={t}
                    enabledImg={"assets/illustrations/monitoring.svg"}
                    disabledImg={"assets/illustrations/monitoringDisabled.svg"}
                    navigateTo={"/monitoring/live"}
                    cardTitle={"componentCommonSidebar.monitoring"}
                />
            ),
        },
        {
            disabled: hsmPermission,
            component: (
                <CardLink
                    key="5"
                    permission={hsmPermission}
                    t={t}
                    enabledImg={"assets/illustrations/broadcastMessages.svg"}
                    disabledImg={"assets/illustrations/broadcastMessagesDisabled.svg"}
                    navigateTo={`/hsm/${tab}`}
                    cardTitle={"componentCommonSidebar.broadcast"}
                />
            ),
        },
        {
            disabled: ecommercePermission,
            component: (
                <CardLink
                    key="6"
                    permission={ecommercePermission}
                    t={t}
                    enabledImg={"assets/illustrations/jelouShop.svg"}
                    disabledImg={"assets/illustrations/jelouShopDisabled.svg"}
                    navigateTo={"/shop/products"}
                    cardTitle={"sideBar.shop"}
                />
            ),
        },

        {
            disabled: clientsPermission,
            component: (
                <CardLink
                    key="7"
                    permission={clientsPermission}
                    t={t}
                    enabledImg={"assets/illustrations/clients.svg"}
                    disabledImg={"assets/illustrations/usersAdminDisabled.svg"}
                    navigateTo={`/clients/${tabClients}`}
                    cardTitle={"sideBar.clients"}
                />
            ),
        },
        {
            disabled: usersAdminPermissions,
            component: (
                <CardLink
                    key="8"
                    permission={usersAdminPermissions}
                    t={t}
                    enabledImg={"assets/illustrations/usersAdmin.svg"}
                    disabledImg={"assets/illustrations/usersAdminDisabled.svg"}
                    navigateTo={"/users-admin"}
                    cardTitle={"componentCommonSidebar.users"}
                />
            ),
        },
        {
            disabled: settingsPermission,
            component: (
                <CardLink
                    key="9"
                    permission={settingsPermission}
                    t={t}
                    enabledImg={"assets/illustrations/settings.svg"}
                    disabledImg={"assets/illustrations/settingsDisabled.svg"}
                    navigateTo={"/settings"}
                    cardTitle={"sideBar.settings"}
                />
            ),
        },
        {
            disabled: datumPermission,
            component: (
                <CardLink
                    key="10"
                    permission={datumPermission}
                    t={t}
                    enabledImg={"/assets/illustrations/bot.svg"}
                    disabledImg={"/assets/illustrations/botDisabled.svg"}
                    navigateTo={"/brain"}
                    cardTitle={"componentCommonSidebar.brain"}
                />
            ),
        },
    ];

    const linksOrdered = appsLinks.sort((a, b) => Number(b.disabled) - Number(a.disabled));

    return (
        <>
            <div className="h-full w-full px-5 py-6 mid:px-10 lg:px-12">
                <div className="flex justify-between">
                    <div className="flex flex-col">
                        <h2 className="text-2xl text-primary-200">
                            Jelou <span className="font-bold ">{`${name}`}!</span>
                        </h2>
                        <p className="text-gray-400">{t("home.welcome")}</p>
                    </div>
                    <div>
                        <NotificationsCenter
                            notifications={notifications}
                            setShowCampaigns={setShowCampaigns}
                            showCampaigns={showCampaigns}
                            setSteps={setSteps}
                            campaignNotSeen={campaignNotSeen}
                            setShowVideoRelease={setShowVideoRelease}
                        />
                    </div>
                </div>

                <div className="mt-2 flex flex-col pt-4 md:space-x-4 lg:flex-row">
                    <div className="flex h-[10rem] w-full items-center justify-center rounded-3xl bg-white px-3 sm:justify-start md:mx-0 md:px-5 lg:px-8 xxxl:min-w-[42rem]">
                        <span className="hidden md:flex">
                            <Avatar name={names} className="block" size="6.875rem" round color="#0fb6b0" textSizeRatio={2} />
                        </span>
                        <div className="px-2 lg:px-8">
                            <div className="flex space-x-2 md:flex-col">
                                <span className="flex md:hidden">
                                    <Avatar name={names} className="block" size="3rem" round color="#0fb6b0" textSizeRatio={1} />
                                </span>
                                <div className="flex flex-col">
                                    <h2 className="text-15 font-semibold text-primary-200 lg:text-2xl">{names}</h2>
                                    <p className="text-13 text-gray-400 lg:text-base">{email}</p>
                                </div>
                            </div>
                            <Menu>
                                <Menu.Button className="border mt-2 flex h-[2.1875rem] w-[13rem] select-none items-center justify-between rounded-[0.5rem] border-transparent bg-[rgb(242,247,253)] text-sm text-gray-400 ring-transparent focus:border-transparent focus:outline-none focus:ring-transparent">
                                    <div className="flex items-center">
                                        <span className="mx-2">{flag}</span>
                                        <span className="capitalize text-gray-400">{loadingLang ? <BeatLoader size={5} color="#727c94" /> : currentLangDescription}</span>
                                    </div>
                                    <ChevronDownIcon className="left-0 mr-2 h-5 w-5 text-gray-400" aria-hidden="true" />
                                </Menu.Button>
                                <Menu.Items className="absolute mt-2 w-[13rem] overflow-hidden rounded-[.5rem] bg-[rgb(242,247,253)] shadow-menu">
                                    {/* Use the `active` render prop to conditionally style the active item. */}
                                    <Menu.Item className="cursor-pointer border-b-1 border-gray-200 p-2 text-gray-400 hover:bg-primary-200 hover:bg-opacity-10 hover:text-primary-200">
                                        {({ active }) => <option onClick={(e) => setLanguage("es")}>ES</option>}
                                    </Menu.Item>
                                    <Menu.Item className="cursor-pointer border-b-1 border-gray-200 p-2 text-gray-400 hover:bg-primary-200 hover:bg-opacity-10 hover:text-primary-200">
                                        {({ active }) => <option onClick={() => setLanguage("en")}>EN</option>}
                                    </Menu.Item>
                                    <Menu.Item className="cursor-pointer p-2 text-gray-400 hover:bg-primary-200 hover:bg-opacity-10 hover:text-primary-200">
                                        {({ active }) => <option onClick={() => setLanguage("pt")}>PT</option>}
                                    </Menu.Item>
                                    {/* ... */}
                                </Menu.Items>
                            </Menu>
                        </div>
                    </div>
                    <div className="mb-4 hidden h-[10rem] w-full rounded-3xl bg-transparent bg-white pt-4 lg:mb-0 lg:inline lg:pt-0">
                        <div className="grid h-[10rem] w-full grid-cols-2  rounded-3xl bg-white">
                            <div className="col-span-1 flex w-full flex-col items-start justify-center">
                                <div className=" select-none space-y-1 pl-[3rem]">
                                    <p className="pb-[0.375rem] text-xl leading-[1.4] text-gray-400 lg:text-[1.2rem]">
                                        {t("home.send")} <span className="text-primary-100">{t("home.templates")}</span> {t("home.and")} {t("home.campaigns")}
                                    </p>
                                    <div className="w-full pt-[0.375rem]">
                                        <button
                                            className="color-gradient w-max rounded-20 px-4 py-2 font-medium text-white"
                                            href="https://www.jelou.ai/contactanos"
                                            target="_blank"
                                            rel="noreferrer"
                                            onClick={() => setOpenSalesModal(true)}
                                        >
                                            {t("home.button")}
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="img-banner1 col-span-1 rounded-br-3xl rounded-tr-3xl"></div>
                        </div>
                    </div>
                </div>
                <h3 className="py-4 text-2xl font-bold text-gray-400">{t("home.myApps")}</h3>
                <div className="grid w-full gap-4 pb-8 sm:grid-cols-2 lg:grid-cols-4">{linksOrdered.map((link) => link.component)}</div>
                <ToastContainer />
            </div>
            {!isEmpty(showVideoRelease) && (
                <Modal>
                    <PreviewUpdateModal steps={get(showVideoRelease, "Steps", [])} setShowVideoRelease={setShowVideoRelease} />
                </Modal>
            )}
            {openSalesModal && <SalesModal t={t} closeModal={closeSalesModal} />}
        </>
    );
};

export default Home;
