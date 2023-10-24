import { AuthRoutePMA } from "@apps/platform/ui-shared";
import { getBots, getOperatorsPma, getUserSession, setChatNotification, setCompany } from "@apps/redux/store";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import pick from "lodash/pick";
import ReactPolling from "react-polling";
import { useDispatch } from "react-redux";
import { Route, Routes } from "react-router-dom";

import {
    dashInterceptor,
    httpInterceptor,
    impersonateInterceptor,
    jelouPaymentInterceptor,
    jelouShopInterceptor,
    metricsInterceptor,
    pmaInterceptor,
} from "@apps/interceptor";
import { OperatorView } from "@apps/pma/index";
import { DetectorWrapper } from "@apps/shared/common";
import { JelouApiV1 } from "@apps/shared/modules";
import { useContext, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";

import { LoginPma } from "@apps/platform/login";
import { Forgot, Reset, Token } from "@apps/platform/recover-password-form";
import { ChatManagerContext } from "@apps/pma/context";
import { Chat, Notifications } from "@apps/pma/service";
import { JelouApi, USER_TYPES } from "@apps/shared/constants";
import { getPreviewMessage } from "@apps/shared/utils";
import Pusher from "pusher-js";
import UIfx from "uifx";

const { NX_REACT_POLLING_URL } = process.env;

const beepMsg = new UIfx("/assets/sounds/newMsg.mp3", { Volume: 0.9 });

export function App() {
    const userSession = useSelector((state) => state.userSession);
    const rooms = useSelector((state) => state.rooms);
    const company = useSelector((state) => state.company);
    const [chatManager, setChatManager] = useState(null);
    const [isLogged, setIsLogged] = useState(false);
    const { NX_REACT_APP_PUSHER_KEY, NX_REACT_APP_PUSHER_CLUSTER } = process.env;

    const { pusherGlobalInstance } = useContext(ChatManagerContext);

    const roomsRef = useRef(rooms);
    roomsRef.current = rooms;
    const dispatch = useDispatch();

    const instantiatePusherConnection = () => {
        // If pusherGlobalInstance is null or undefined (Will be undefined for PMA Mobile), so instantiate a new connection
        const pusher = new Pusher(NX_REACT_APP_PUSHER_KEY, {
            cluster: NX_REACT_APP_PUSHER_CLUSTER,
            enabledTransports: ["ws"],
        });
        return pusher;
    };

    const fetchData = () => {
        try {
            httpInterceptor();
            dashInterceptor();
            metricsInterceptor();
            impersonateInterceptor();
            pmaInterceptor();
            jelouShopInterceptor();
            jelouPaymentInterceptor();
            return JelouApiV1.get("/users/ping").catch((err) => {
                console.log(err);
            });
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        if (isLogged) {
            fetchData();
            dispatch(getUserSession());
            window.location.replace("/");
        }
    }, [isLogged]);

    useEffect(() => {
        if (!isEmpty(userSession)) {
            getCompany();
        }
    }, [userSession]);

    useEffect(() => {
        if (!isEmpty(userSession) && !isEmpty(company) && isEmpty(chatManager)) {
            dispatch(getOperatorsPma());
            const params = {
                companyId: "",
                shouldPaginate: false,
            };
            dispatch(getBots(params));
            setUp();
        }
    }, [company]);

    const getCompany = async () => {
        try {
            JelouApi.getCompany()
                .then((response) => {
                    const { data } = response;
                    if (!isEmpty(data)) {
                        dispatch(setCompany(data));
                    }
                })
                .catch((error) => {
                    console.log(error);
                });
        } catch (error) {
            console.log(error);
        }
    };

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

    const setUp = () => {
        if (!userSession?.isOperator) {
            return null;
        }
        const { properties = {} } = company;
        const { socketProvider = {} } = properties;
        const { name = "pusher", auth } = socketProvider;

        let credentials = {};

        switch (name) {
            case "pusher":
                credentials = {
                    ...pick(auth, ["instanceLocator", "tokenProviderUrl"]),
                    appId: auth?.username || "idkgwf6ghcmyfvvrxqiwwmi",
                    appSecret: auth?.secret || "i0verx8q6w29zvmwhqiwb2efpccsjmpsdw3nr2e",
                    user: {
                        names: userSession.names,
                        providerId: userSession.providerId,
                    },
                };
                break;
            default:
                // always here
                credentials = {
                    appId: auth?.username || "idkgwf6ghcmyfvvrxqiwwmi",
                    appSecret: auth?.secret || "i0verx8q6w29zvmwhqiwb2efpccsjmpsdw3nr2e",
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
            pusherInstance: pusherGlobalInstance || instantiatePusherConnection(),
        });

        // Bind global events to pusher channel
        const channel = ChatManager.channel;
        const providerId = userSession.providerId;
        const companySocketId = company.socketId;
        channel.renderGlobalEvents({ providerId, companySocketId, companyId: company.id });
        connect(ChatManager);
        setChatManager(ChatManager);
    };

    const connect = async (chatManager) => {
        await chatManager.connect();
        subscribeToEvents(chatManager);

        if (!isEmpty(chatManager.rooms)) {
            const { rooms } = chatManager;
            const totalRooms = rooms.length;
            dispatch(setChatNotification(totalRooms));
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
            sendAddedToRoomNotification(payload);
        });
        chatManager.onEvent("message", (payload) => {
            sendNewMessageNotification(payload);
        });
    };

    return (
        <div className="bg-gray-400 bg-opacity-25">
            <DetectorWrapper>
                <ChatManagerContext.Provider value={{ chatManager, pusherGlobalInstance }}>
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
                        <Route path="/" element={<AuthRoutePMA component={OperatorView} path="/pma/*" />} />
                        <Route path="/login" element={<LoginPma setIsLogged={setIsLogged} />} />
                        <Route path="/forgot" element={<Forgot />} />
                        <Route path="/new-password/:token" element={<Reset />} />
                        <Route path="/activate/:token" element={<Reset />} />
                        <Route path="/assign" component={Token} />
                        <Route path="/pma/:section">
                            <Route index element={<AuthRoutePMA component={OperatorView} path="/pma/*" />} />
                            <Route path=":subSection" element={<AuthRoutePMA component={OperatorView} path="/pma/*" />} />
                        </Route>
                    </Routes>
                </ChatManagerContext.Provider>
            </DetectorWrapper>
        </div>
    );
}
export default App;
