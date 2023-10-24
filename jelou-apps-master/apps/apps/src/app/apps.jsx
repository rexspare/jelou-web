import * as Sentry from "@sentry/react";
import Pusher from "pusher-js";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";

import first from "lodash/first";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import isNil from "lodash/isNil";
import pick from "lodash/pick";
import reverse from "lodash/reverse";

import Favicon from "react-favicon";
import ReactPolling from "react-polling";

import { ChatManagerContext } from "@apps/pma/context";
import { Chat, Notifications, pullingRooms } from "@apps/pma/service";
import { usePrevious } from "@apps/shared/hooks";

//Ui
import Bots from "@apps/bots/bots";
import { RouteBrain } from "@apps/brain";
import Clients from "@apps/clients/index";
import Diffusion from "@apps/diffusion/index";
import Home from "@apps/home";
import Metrics from "@apps/metrics";
import { Login } from "@apps/platform/login";
import SSO from "@apps/platform/sso";
import { OperatorView } from "@apps/pma/index";
import SettingsIndex from "@apps/settings/index";
import Shop from "@apps/shop";
import UsersAdmin from "@apps/users-admin";

import { Databases, DatabaseTable, DatumHome, ReportsDashboard } from "@apps/datum";
import DashboardCards from "@apps/metrics/dashboard-cards";
import ConversationDownload from "@apps/monitoring/conversation-download";
import Monitoring from "@apps/monitoring/index";
import NewPasswordForm from "@apps/platform/change-password";
import { RecoverPasswordForm } from "@apps/platform/recover-password-form";
import RegisterForm from "@apps/platform/register-form";
import { AuthRoute, Layout } from "@apps/platform/ui-shared";
import { PmaEmailsPublicEmailView } from "@apps/pma/emails";
import { DetectorWrapper, Page404 } from "@apps/shared/common";
import { DashboardServer, JelouApiV1, Tracker } from "@apps/shared/modules";

import { addChatNotification, addRooms, removeChatNotification, setCampaignNotSeen, setChatNotification, setSessionStorage, setStatusOperator, updateUserSession } from "@apps/redux/store";

import { dashInterceptor, httpInterceptor, impersonateInterceptor, jelouPaymentInterceptor, jelouShopInterceptor, metricsInterceptor, pmaInterceptor } from "@apps/interceptor";

import { DateContext, NotificationProvider, TrackerContext } from "@apps/context";
import { ID_COMPANY_BG, USER_TYPES } from "@apps/shared/constants";
import { getPreviewMessage, i18n } from "@apps/shared/utils";
import trackerAxios from "@openreplay/tracker-axios";
import dayjs from "dayjs";
import advanced from "dayjs/plugin/advancedFormat";
import customFormat from "dayjs/plugin/customParseFormat";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import Widget from "libs/home/src/lib/components/Widget.js";
import UIfx from "uifx";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(advanced);
dayjs.extend(customFormat);

const { NX_REACT_POLLING_URL } = process.env;
const beepMsg = new UIfx("/assets/sounds/newMsg.mp3", { Volume: 0.9 });
const { IS_PRODUCTION } = require("config");

if (IS_PRODUCTION) {
    Tracker.use(trackerAxios());
}
const POLLING_ROOMS_INTERVAL = 1000 * 30 * 10; // 5m en milisegundos

export function App() {
    const [isTourOpen, setIsTourOpen] = useState(false);
    const [isLogged, setIsLogged] = useState(false);
    const [steps, setSteps] = useState([]);
    const [showCampaigns, setShowCampaigns] = useState(false);
    const [botPermission, setBotPermission] = useState(false);
    const permissions = useSelector((state) => state.permissions);

    const hsmPermission = !isEmpty(permissions) ? permissions.find((data) => data === "hsm:view_hsm_ui") : "";
    const monitoringPermission = !isEmpty(permissions) ? permissions.find((data) => data === "monitoring:view_monitoring") : "";
    const botsSettingsPermission = !isEmpty(permissions) ? permissions.find((data) => data === "settings:view_bot_settings") : "";
    const teamSettingsPermission = !isEmpty(permissions) ? permissions.find((data) => data === "settings:team_settings") : "";
    const companySettingsPermission = !isEmpty(permissions) ? permissions.find((data) => data === "settings:company_settings") : "";
    const schedulesPermission = !isEmpty(permissions) ? permissions.find((data) => data === "schedules:view_schedule") : "";
    const reportsPermission = !isEmpty(permissions) ? permissions.find((data) => data === "report:view_report") : "";
    const metricsPermission = !isEmpty(permissions) ? permissions.find((data) => data === "analytic:view_analytics") : "";
    const clientsPermission = !isEmpty(permissions) ? permissions.find((data) => data === "clients:view_clients") : "";
    const operatorPermissions = !isEmpty(permissions) ? permissions.find((data) => data === "operator:view_ov") : "";
    const usersAdminPermissions = !isEmpty(permissions) ? permissions.find((data) => data === "user:view_user" || data.startsWith("rol:") || data === "team:view_team") : "";

    const hsmPermissionsArr = !isEmpty(permissions) ? permissions.filter((data) => data.startsWith("hsm:")) : [];
    const clientsPermissionsArr = !isEmpty(permissions) ? permissions.filter((data) => data.startsWith("clients:")) : [];
    const botsPermissionsArr = !isEmpty(permissions) ? permissions.filter((data) => data.startsWith("bot:")) : [];
    const settingsPermissionsArr = !isEmpty(permissions) ? permissions.filter((data) => data.startsWith("settings:")) : [];

    const schedulesPermissionsArr = !isEmpty(permissions) ? permissions.filter((data) => data.startsWith("schedules:")) : [];
    const userPermissionsArr = !isEmpty(permissions) ? permissions.filter((data) => data.startsWith("user:")) : [];
    const teamPermissionsArr = !isEmpty(permissions) ? permissions.filter((data) => data.startsWith("team:")) : [];
    const rolesPermissionsArr = !isEmpty(permissions) ? permissions.filter((data) => data.startsWith("rol:")) : [];
    const operatorPermissionsArr = !isEmpty(permissions) ? permissions.filter((data) => data.startsWith("operator:")) : [];

    const imaginagePermission = !isEmpty(permissions) ? permissions.find((data) => data === "imaginate:view_imaginate") : "";
    const imaginatePermissionsArr = !isEmpty(permissions) ? permissions.filter((data) => data.startsWith("imaginate:")) : [];

    const [showPage404, setShowPage404] = useState(false);
    const usersAdminPermissionsArr = {
        userPermissionsArr,
        teamPermissionsArr,
        rolesPermissionsArr,
    };

    const dispatch = useDispatch();

    const { NX_REACT_APP_PUSHER_KEY, NX_REACT_APP_PUSHER_CLUSTER } = process.env;

    const userSession = useSelector((state) => state.userSession);
    const timezone = get(userSession, "timezone", "America/Guayaquil");
    const rooms = useSelector((state) => state.rooms);
    const company = useSelector((state) => state.company);
    const [chatManager, setChatManager] = useState(null);
    const [pusherGlobalInstance, setPusherGlobalInstance] = useState({});
    const [unreadMessages, setUnreadMessages] = useState(0);
    const [notifications, setNotifications] = useState([]);
    const [showVideoRelease, setShowVideoRelease] = useState(null);
    const prevRooms = usePrevious(rooms);

    const campaignInit = localStorage.getItem("campaignId");
    const sessionStorage = useSelector((state) => state.sessionStorage);

    const location = useLocation();
    const navigate = useNavigate();

    const roomsRef = useRef(rooms);
    roomsRef.current = rooms;

    const providerId = useSelector((state) => state.userSession.providerId);

    useEffect(() => {
        if (userSession) {
            const lang = get(userSession, "lang", "es");
            localStorage.setItem("lang", lang);
            i18n.changeLanguage(lang);
        }
    }, [userSession]);

    useEffect(() => {
        if (!isEmpty(timezone)) {
            dayjs.tz.setDefault(timezone);
        }
    }, [timezone]);

    useEffect(() => {
        if (prevRooms !== rooms && !isEmpty(rooms)) {
            setUnreadMessages(sumUnreadCounter());
        }
    }, [rooms]);

    useEffect(() => {
        if (!isEmpty(permissions)) {
            setBotPermission(!!permissions.find((data) => data === "bot:view_bot"));
        }
    }, [permissions, botPermission]);

    useEffect(() => {
        if (isLogged) {
            navigate("/");
        }
    }, [isLogged]);

    useEffect(() => {
        if (sessionStorage) {
            getCampaigns();
        }
    }, [sessionStorage]);

    const getName = (room) => {
        let name = get(room, "name", "");
        if (isEmpty(name)) {
            name = get(room, "names", "");
        }
        if (isEmpty(name)) {
            name = get(room, "metadata.names", "Cliente");
        }
        return name;
    };

    useEffect(() => {
        if (get(userSession, "isOperator", false)) {
            const intervalId = setInterval(pullingRooms, POLLING_ROOMS_INTERVAL, { chatManager, providerId });

            return () => clearInterval(intervalId);
        }
    }, [chatManager, providerId]);

    //function to sum al unread counter of my rooms state
    const sumUnreadCounter = () => {
        let sum = 0;
        rooms.forEach((room) => {
            if (get(room, "type", "") !== "company" && !isEmpty(room?.membersMetaInfo) && !isEmpty(room?.membersMetaInfo[providerId])) {
                sum += room?.membersMetaInfo[providerId]?.unreadMessages ?? 0;
            }
        });
        return sum;
    };

    const getCampaigns = async () => {
        if (isEmpty(localStorage.getItem("jwt"))) {
            dispatch(setSessionStorage(false));
            return;
        }
        DashboardServer.get("/announcements", {
            params: {
                state: true,
                noTime: true,
            },
        })
            .then(({ data }) => {
                const result = get(data, "data", []);
                setNotifications(reverse(result));

                const campaignToShow = first(result);
                if (Number(campaignInit) !== get(campaignToShow, "id", 0)) {
                    dispatch(setCampaignNotSeen(true));
                } else {
                    dispatch(setCampaignNotSeen(false));
                }

                if (!result) {
                    return;
                }
            })
            .catch((err) => {
                console.error("ERROR! ", err);
            });
    };

    const fetchData = () => {
        httpInterceptor();
        dashInterceptor();
        metricsInterceptor();
        impersonateInterceptor();
        pmaInterceptor();
        jelouShopInterceptor();
        jelouPaymentInterceptor();
        return JelouApiV1.get("/users/ping").catch((err) => {
            console.log(err, "error");
        });
    };

    useEffect(() => {
        if (!isEmpty(userSession) && !isEmpty(company) && isEmpty(pusherGlobalInstance)) {
            setUp();
            Sentry.setUser({ email: userSession.email, id: userSession.providerId, username: userSession.names });
        }
    }, [userSession, company, pusherGlobalInstance]);

    useEffect(() => {
        if (company.id === ID_COMPANY_BG) {
            Sentry.init({
                dsn: process.env.NX_REACT_APP_SENTRY_DNS,
                ignoreErrors: ["Failed to execute 'insertBefore' on 'Node': The node before which the new node is to be inserted is not a child of this node.", "Network Error", "NetworkError"],
                beforeBreadcrumb(breadcrumb, hint) {
                    return breadcrumb.category === "ui.click" ? null : breadcrumb;
                },
            });
        }
    }, [company]);

    const setUp = () => {
        const pusher = new Pusher(NX_REACT_APP_PUSHER_KEY, {
            cluster: NX_REACT_APP_PUSHER_CLUSTER,
            enabledTransports: ["ws"],
        });
        setPusherGlobalInstance(pusher);
        if (!userSession?.isOperator) {
            return null;
        }
        const { Company = {} } = userSession;

        const { properties = {} } = Company;
        const { socketProvider = {} } = properties;
        const { name = "", auth } = socketProvider;

        let credentials = {};

        switch (name) {
            case "pusher":
                credentials = {
                    ...pick(auth, ["instanceLocator", "tokenProviderUrl"]),
                    user: {
                        names: userSession.names,
                        providerId: userSession.providerId,
                    },
                };
                break;
            default:
                // always here
                credentials = {
                    appId: "idkgwf6ghcmyfvvrxqiwwmi",
                    appSecret: "i0verx8q6w29zvmwhqiwb2efpccsjmpsdw3nr2e",
                    user: {
                        names: userSession.names,
                        providerId: userSession.providerId,
                    },
                };
                break;
        }

        const ChatManager = new Chat({
            provider: name,
            credentials,
            companyId: company.id,
            companySocketId: company.socketId,
            pusherInstance: pusher,
        });

        // Bind global events to pusher channel
        const channel = ChatManager.channel;
        const providerId = userSession.providerId;
        channel.renderGlobalEvents({ providerId, companyId: company.id });

        connect(ChatManager);
        setChatManager(ChatManager);
    };

    const connect = async (chatManager) => {
        await chatManager.connect();
        subscribeToEvents(chatManager);

        if (!isEmpty(chatManager.rooms)) {
            const { rooms } = chatManager;
            const chatRooms = rooms.filter((room) => room.type === "client");
            const totalRooms = chatRooms.length;
            dispatch(setChatNotification(totalRooms));
        }
    };

    const operatorStatusUpdate = (payload) => {
        try {
            if (isNil(get(userSession, "operatorId"))) return;
            const eventId = payload._id;
            JelouApiV1.get(`real-time-events/${eventId}`).then((data) => {
                const payloadEvent = get(data, "data.data.payload", {});

                const status = get(payloadEvent, "status", "");
                const operatorId = get(payloadEvent, "id", "");

                if (operatorId === userSession?.operatorId) {
                    dispatch(setStatusOperator(status));
                    dispatch(updateUserSession({ operatorActive: status }));
                }
            });
        } catch (err) {
            console.log(err);
        }
    };

    const checkFormRoom = async (data, chatManagerInstance) => {
        // Check if room is on redux
        const { roomId, operatorId } = data;
        const room = rooms.find((room) => room.id === roomId);

        // If Room is already present do nothing
        if (room) {
            return;
        }

        // If event is not for the current operator do nothing
        if (userSession.id !== operatorId) {
            return;
        }

        // If not send a Sentry Alert
        Sentry.setExtra("roomId", roomId);
        Sentry.captureException(new Error(`A room is not present on operator(${userSession.names}) frontend.`));

        // If room is not present fetch rooms again
        try {
            const roomsResponse = await chatManagerInstance.getRooms();

            const isRoomOnResponse = roomsResponse.find((room) => room.id === roomId);
            dispatch(addRooms(roomsResponse));

            // If room is not present on the response send another alert on sentry
            if (!isRoomOnResponse) {
                Sentry.setExtra("RoomResponse", JSON.stringify(roomsResponse, null, 2));
                Sentry.captureException(new Error(`The room(${roomId}) is not present on the response`));
            }
        } catch (error) {
            console.error(error);
        }
    };

    const sendAddedToRoomNotification = (room) => {
        const name = getName(room);
        try {
            Notifications.sendSelf({
                title: "Se te ha asignado un nuevo caso.",
                message: `${name}`,
                url: "https://apps.jelou.ai",
            });
        } catch (error) {
            console.error(error);
        }
    };

    const sendNewMessageNotification = async (message) => {
        if (message.by === USER_TYPES.USER) {
            const rooms = roomsRef?.current;
            const room = rooms.find((room) => room.id === message.roomId);

            if (!room) return;

            const { message: content } = message;

            // BEEP!
            const activeSound = JSON.parse(localStorage.getItem("activeSound"));

            if (activeSound) {
                beepMsg.setVolume(0.5).play();
            }

            const name = getName(room);

            try {
                await Notifications.sendSelf({
                    title: `${name}`,
                    message: getPreviewMessage(content),
                    url: "https://apps.jelou.ai",
                });
            } catch (err) {
                console.error("Error on sending message notification.", err.message);
            }
        }
    };

    const subscribeToEvents = (chatManager) => {
        chatManager.onEvent("addedToRoom", (payload) => {
            dispatch(addChatNotification());
            sendAddedToRoomNotification(payload);
        });
        chatManager.onEvent("removedFromRoom", (payload) => {
            console.log("removedFromRoom outside pma ");
            dispatch(removeChatNotification());
        });
        chatManager.onEvent("operatorAssign", (payload) => checkFormRoom(payload, chatManager));
        chatManager.onEvent("operatorStatusUpdate", (payload) => {
            if (!isEmpty(payload)) operatorStatusUpdate(payload);
        });
        chatManager.onEvent("message", (payload) => {
            sendNewMessageNotification(payload);
        });
    };

    return (
        <div>
            <NotificationProvider>
                <DateContext.Provider value={dayjs.tz}>
                    <TrackerContext.Provider value={Tracker}>
                        <Favicon alertCount={unreadMessages} iconSize={32} url={`${window.location.origin}/favicon.ico`} alertFillColor={"#e74c3c"} />
                        <ChatManagerContext.Provider value={{ chatManager, pusherGlobalInstance }}>
                            <DetectorWrapper>
                                {showPage404 && <Page404 />}
                                <Widget companyId={company.id} />
                                <ReactPolling
                                    url={`${NX_REACT_POLLING_URL}`}
                                    interval={300000}
                                    onSuccess={() => {
                                        return true;
                                    }}
                                    promise={fetchData}
                                    render={({ startPolling, stopPolling, isPolling }) => {
                                        if (isPolling) {
                                            return null;
                                        } else {
                                            return null;
                                        }
                                    }}
                                />
                                <Routes>
                                    <Route path="/login" element={<Login setIsLogged={setIsLogged} />} />
                                    <Route path="/recover-password" element={<RecoverPasswordForm />} />
                                    <Route path="/new-password" element={<NewPasswordForm />} />
                                    <Route path="/sso/:token" element={<SSO />} />
                                    <Route path="/register" element={<RegisterForm />} />
                                    <Route path="/monitoring/conversation/download/:botId/:conversationId" element={<ConversationDownload />} />
                                    <Route path="/email/:botId/:emailId" element={<PmaEmailsPublicEmailView />} />

                                    <Route
                                        element={
                                            <Layout
                                                steps={steps}
                                                location={location}
                                                isTourOpen={isTourOpen}
                                                setIsTourOpen={setIsTourOpen}
                                                showCampaigns={showCampaigns}
                                                setShowCampaigns={setShowCampaigns}
                                            />
                                        }
                                    >
                                        <Route />
                                        <Route
                                            path="/home"
                                            element={
                                                <AuthRoute
                                                    component={Home}
                                                    allowedPermission={"home"}
                                                    setShowPage404={setShowPage404}
                                                    getCampaigns={getCampaigns}
                                                    steps={steps}
                                                    setSteps={setSteps}
                                                    notifications={notifications}
                                                    path="/home"
                                                    permissions={permissions.concat("home")}
                                                    showVideoRelease={showVideoRelease}
                                                    setShowVideoRelease={setShowVideoRelease}
                                                />
                                            }
                                        />
                                        <Route path="/" element={<AuthRoute component={Home} allowedPermission={"home"} path="/" />} />

                                        <Route
                                            path="/bots"
                                            element={
                                                <AuthRoute
                                                    component={Bots}
                                                    path="/bots"
                                                    isTourOpen={isTourOpen}
                                                    setIsTourOpen={setIsTourOpen}
                                                    allowedPermission={botPermission ? "bot:view_bot" : "no-allowed"}
                                                    permissionsList={botsPermissionsArr}
                                                    permissions={permissions}
                                                />
                                            }
                                        />

                                        {botsSettingsPermission ? (
                                            <Route path="/settings" element={<Navigate to="/settings/bots" replace />} />
                                        ) : schedulesPermission ? (
                                            <Route path="/settings" element={<Navigate to="/settings/schedules" replace />} />
                                        ) : companySettingsPermission ? (
                                            <Route path="/settings" element={<Navigate to="/settings/company" replace />} />
                                        ) : (
                                            teamSettingsPermission && <Route path="/settings" element={<Navigate to="/settings/teams" replace />} />
                                        )}

                                        <Route
                                            path="/settings/bots"
                                            element={
                                                <AuthRoute
                                                    component={SettingsIndex}
                                                    allowedPermission={botsSettingsPermission ? "settings:view_bot_settings" : "no-allowed"}
                                                    path="/settings/*"
                                                    permissionsList={settingsPermissionsArr}
                                                    permissions={permissions}
                                                />
                                            }
                                        />

                                        <Route
                                            path="/brain/*"
                                            element={
                                                <AuthRoute
                                                    component={RouteBrain}
                                                    allowedPermission={imaginagePermission ? imaginagePermission : "no-allowed"}
                                                    path="/brain/*"
                                                    permissionsList={imaginatePermissionsArr}
                                                    permissions={permissions}
                                                />
                                            }
                                        />

                                        <Route
                                            path="/settings/company"
                                            element={
                                                <AuthRoute
                                                    component={SettingsIndex}
                                                    allowedPermission={companySettingsPermission ? "settings:company_settings" : "no-allowed"}
                                                    path="/settings/*"
                                                    permissionsList={settingsPermissionsArr}
                                                    permissions={permissions}
                                                />
                                            }
                                        />
                                        <Route
                                            path="/settings/teams"
                                            element={
                                                <AuthRoute
                                                    component={SettingsIndex}
                                                    allowedPermission={teamSettingsPermission ? "settings:team_settings" : "no-allowed"}
                                                    path="/settings/*"
                                                    permissionsList={settingsPermissionsArr}
                                                    permissions={permissions}
                                                />
                                            }
                                        />

                                        <Route
                                            path="/settings/:tab"
                                            element={
                                                <AuthRoute
                                                    component={SettingsIndex}
                                                    allowedPermission={schedulesPermission ? "schedules:view_schedule" : "no-allowed"}
                                                    path="/settings/*"
                                                    permissionsList={schedulesPermissionsArr}
                                                    permissions={permissions}
                                                />
                                            }
                                        />

                                        <Route path="/shop/*" element={<Shop path="/shop/*" setShowPage404={setShowPage404} />} />

                                        <Route
                                            path="/users-admin"
                                            element={
                                                <AuthRoute
                                                    component={UsersAdmin}
                                                    path="/users-admin"
                                                    allowedPermission={usersAdminPermissions ? usersAdminPermissions : "no-allowed"}
                                                    permissionsList={usersAdminPermissionsArr}
                                                    permissions={permissions}
                                                />
                                            }
                                        />
                                        <Route path="/monitoring" element={<Navigate element={<Navigate to="/monitoring/live/tickets" replace />} />} />

                                        <Route
                                            path="/monitoring"
                                            element={
                                                <AuthRoute
                                                    component={Monitoring}
                                                    allowedPermission={monitoringPermission ? monitoringPermission : "no-allowed"}
                                                    path="/monitoring"
                                                    replace
                                                    permissions={permissions}
                                                    showPage404={showPage404}
                                                    setShowPage404={setShowPage404}
                                                />
                                            }
                                        />
                                        <Route
                                            exact
                                            path="/monitoring/:section/"
                                            element={
                                                <AuthRoute
                                                    component={Monitoring}
                                                    allowedPermission={monitoringPermission ? monitoringPermission : "no-allowed"}
                                                    path="/monitoring/:section/"
                                                    replace
                                                    permissions={permissions}
                                                    showPage404={showPage404}
                                                    setShowPage404={setShowPage404}
                                                />
                                            }
                                        />
                                        <Route
                                            path="/monitoring/:section/:subsection/"
                                            element={
                                                <AuthRoute
                                                    component={Monitoring}
                                                    allowedPermission={monitoringPermission ? monitoringPermission : "no-allowed"}
                                                    path="/monitoring/:section/:subsection"
                                                    permissions={permissions}
                                                    setShowPage404={setShowPage404}
                                                />
                                            }
                                        />
                                        <Route
                                            path="/metrics"
                                            element={
                                                <AuthRoute
                                                    setShowPage404={setShowPage404}
                                                    component={DashboardCards}
                                                    path="/metrics"
                                                    allowedPermission={metricsPermission ? "analytic:view_analytics" : "no-allowed"}
                                                    permissions={permissions}
                                                />
                                            }
                                        />

                                        <Route
                                            path="/metrics/:dash"
                                            element={
                                                <AuthRoute
                                                    setShowPage404={setShowPage404}
                                                    component={Metrics}
                                                    path="/metrics/*"
                                                    allowedPermission={metricsPermission ? "analytic:view_analytics" : "no-allowed"}
                                                    permissions={permissions}
                                                />
                                            }
                                        />
                                        <Route
                                            path="/datum/reports/*"
                                            element={
                                                <AuthRoute
                                                    component={ReportsDashboard}
                                                    allowedPermission={reportsPermission ? reportsPermission : "no-allowed"}
                                                    path="/datum/reports/*"
                                                    permissions={permissions}
                                                />
                                            }
                                        />
                                        <Route
                                            path="/pma"
                                            element={
                                                <AuthRoute
                                                    setShowPage404={setShowPage404}
                                                    component={OperatorView}
                                                    allowedPermission={operatorPermissions ? operatorPermissions : "no-allowed"}
                                                    path="/pma/*"
                                                    permissionsList={operatorPermissionsArr}
                                                    permissions={permissions}
                                                />
                                            }
                                        >
                                            <Route
                                                path=":section"
                                                element={
                                                    <AuthRoute
                                                        setShowPage404={setShowPage404}
                                                        component={OperatorView}
                                                        allowedPermission={operatorPermissions ? operatorPermissions : "no-allowed"}
                                                        path="/pma/*"
                                                        permissionsList={operatorPermissionsArr}
                                                        permissions={permissions}
                                                    />
                                                }
                                            >
                                                <Route
                                                    path=":subSection"
                                                    element={
                                                        <AuthRoute
                                                            setShowPage404={setShowPage404}
                                                            component={OperatorView}
                                                            allowedPermission={operatorPermissions ? operatorPermissions : "no-allowed"}
                                                            path="/pma/*"
                                                            permissionsList={operatorPermissionsArr}
                                                        />
                                                    }
                                                />
                                            </Route>
                                        </Route>
                                        <Route
                                            path="/datum"
                                            element={
                                                <AuthRoute component={DatumHome} allowedPermission={reportsPermission ? reportsPermission : "no-allowed"} path="/datum" permissions={permissions} />
                                            }
                                        />
                                        <Route
                                            path="/datum/databases"
                                            element={
                                                <AuthRoute
                                                    component={Databases}
                                                    allowedPermission={reportsPermission ? reportsPermission : "no-allowed"}
                                                    path="/datum/databases"
                                                    permissions={permissions}
                                                />
                                            }
                                        />
                                        <Route
                                            path="/datum/databases/:databaseId"
                                            element={
                                                <AuthRoute
                                                    component={DatabaseTable}
                                                    allowedPermission={reportsPermission ? reportsPermission : "no-allowed"}
                                                    path="/datum/databases/:databaseId"
                                                    permissions={permissions}
                                                />
                                            }
                                        />
                                        <Route
                                            path="/hsm/:tab/:campaignId"
                                            element={
                                                <AuthRoute
                                                    setShowPage404={setShowPage404}
                                                    component={Diffusion}
                                                    allowedPermission={hsmPermission ? hsmPermission : "no-allowed"}
                                                    path="/hsm/campaigns/*"
                                                    permissionsList={hsmPermissionsArr}
                                                    permissions={permissions}
                                                />
                                            }
                                        />
                                        <Route
                                            path="/hsm/:tab/"
                                            element={
                                                <AuthRoute
                                                    setShowPage404={setShowPage404}
                                                    component={Diffusion}
                                                    allowedPermission={hsmPermission ? hsmPermission : "no-allowed"}
                                                    path="/hsm/*"
                                                    permissionsList={hsmPermissionsArr}
                                                    permissions={permissions}
                                                />
                                            }
                                        />

                                        <Route
                                            path="/clients/:tab"
                                            element={
                                                <AuthRoute
                                                    setShowPage404={setShowPage404}
                                                    component={Clients}
                                                    allowedPermission={clientsPermission ? clientsPermission : "no-allowed"}
                                                    path="/clients/*"
                                                    permissionsList={clientsPermissionsArr}
                                                    permissions={permissions}
                                                />
                                            }
                                        />
                                        <Route
                                            path="/clients/:tab/:roomId"
                                            element={
                                                <AuthRoute
                                                    setShowPage404={setShowPage404}
                                                    component={Clients}
                                                    allowedPermission={clientsPermission ? clientsPermission : "no-allowed"}
                                                    path="/clients/*"
                                                    permissionsList={clientsPermissionsArr}
                                                    permissions={permissions}
                                                />
                                            }
                                        />
                                    </Route>
                                    <Route path="*" element={<Page404 />} />
                                </Routes>
                            </DetectorWrapper>
                        </ChatManagerContext.Provider>
                    </TrackerContext.Provider>
                </DateContext.Provider>
            </NotificationProvider>
        </div>
    );
}

export default App;
