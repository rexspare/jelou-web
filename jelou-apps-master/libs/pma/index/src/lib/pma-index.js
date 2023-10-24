import * as Sentry from "@sentry/react";
import { Pipeline, VirtualBackgroundProcessor } from "@twilio/video-processors";
import dayjs from "dayjs";
import first from "lodash/first";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import isObject from "lodash/isObject";
import maxBy from "lodash/maxBy";
import omit from "lodash/omit";
import toUpper from "lodash/toUpper";
import upperCase from "lodash/upperCase";
import qs from "qs";
import { useContext, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useParams } from "react-router-dom";
import { BeatLoader, GridLoader } from "react-spinners";
import { toast, ToastContainer } from "react-toastify";
import UIfx from "uifx";
import { v4 as uuidv4 } from "uuid";

import { ChatView } from "@apps/pma/chat";
import { ChatManagerContext, TicketResponseContext } from "@apps/pma/context";
import { EmailsView } from "@apps/pma/emails";
import { InboxView } from "@apps/pma/inbox";
import { PostView } from "@apps/pma/post";
import { LayoutCallModal, Menu, MobileStatus, OnlineToast } from "@apps/pma/ui-shared";
import { DetectorContext } from "@apps/shared/common";
import { currentSectionPma, USER_TYPES } from "@apps/shared/constants";
import { JelouApiV1 } from "@apps/shared/modules";
import styles from "./pma-index.module.css";
import { OfflineOperatorModal } from "@apps/general";

import {
    ackMessage,
    addArchivedMessage,
    addArchivedPosts,
    addEmail,
    addFlows,
    addMessage,
    addMessages,
    addPost,
    addPosts,
    addQueue,
    addRoom,
    addRooms,
    deletePost,
    deleteQueue,
    deleteRoom,
    getUserSession,
    sendToken,
    setActualEmails,
    setCurrentRoom,
    setEmails,
    setExpiredEmails,
    setIsLoadingArchivedPostSidebar,
    setIsLoadingPost,
    setIsLoadingPostSidebar,
    setMotives,
    setNotReadEmails,
    setRooms,
    setStatusOperator,
    setUserSession,
    updateArchivedRoom,
    updateCurrentEmail,
    updateFlows,
    updatePost,
    updateQueue,
    updateRoom,
    setShowDisconnectedModal,
} from "@apps/redux/store";

import { addToQueue, Notifications } from "@apps/pma/service";
import { usePrevious } from "@apps/shared/hooks";
import { getPreviewMessage } from "@apps/shared/utils";

const Video = require("twilio-video");
const beepMsg = new UIfx("/assets/sounds/newMsg.mp3", { Volume: 0.9 });
const beepRoom = new UIfx("/assets/sounds/newRoom.mp3", { Volume: 0.9 });

const PmaIndex = (props) => {
    const { setShowPage404 } = props; // validar cada vista con el permiso correspondiente
    const didMount = useRef(null);
    const location = useLocation();
    const online = useContext(DetectorContext);
    const prevOnline = usePrevious(online);
    const bots = useSelector((state) => state.bots);
    const rooms = useSelector((state) => state.rooms);
    const emails = useSelector((state) => state.emails);
    const flows = useSelector((state) => state.flows);
    const company = useSelector((state) => state.company);
    const messages = useSelector((state) => state.messages);
    const actualTray = useSelector((state) => state.actualTray);
    const userSession = useSelector((state) => state.userSession);
    const session = useSelector((state) => state.session);
    const currentRoom = useSelector((state) => state.currentRoom);
    const currentArchivedRoom = useSelector((state) => state.currentArchivedRoom);
    const actualEmails = useSelector((state) => state.actualEmails);
    const notReadEmails = useSelector((state) => state.notReadEmails);
    const currentEmail = useSelector((state) => state.currentEmail);
    const lang = useSelector((state) => state.userSession?.lang) ?? "es";
    const isOperatorOfflineModal = useSelector((state) => state.isOperatorOfflineModal);

    //context
    /* The above code is using the useState hook to create a state variable called ticketResponse and a
    function to update that state variable called setTicketResponse. */
    const [ticketResponse, setTicketResponse] = useState(null);
    const { chatManager } = useContext(ChatManagerContext);

    const [room, setRoom] = useState(null);

    const currentMessages = useRef(null);
    currentMessages.current = messages;
    const roomsRef = useRef(rooms);
    roomsRef.current = rooms;
    const flowsRef = useRef(flows);
    flowsRef.current = flows;
    const roomRef = useRef(room);
    roomRef.current = room;
    const emailsRef = useRef(emails);
    emailsRef.current = emails;
    const actualTrayRef = useRef(actualTray);
    actualTrayRef.current = actualTray;
    const currentEmailRef = useRef(currentEmail);
    currentEmailRef.current = currentEmail;
    const notReadEmailsRef = useRef(notReadEmails);
    notReadEmailsRef.current = notReadEmails;
    const actualEmailsRef = useRef(actualEmails);
    actualEmailsRef.current = actualEmails;
    const chatManagerRef = useRef(chatManager);
    chatManagerRef.current = chatManager;

    const dispatch = useDispatch();
    const { section = "" } = useParams();
    const [loadingContext, setLoadingContext] = useState(true);

    const [pusherState, setPusherState] = useState(null);
    const prevPusherState = usePrevious(pusherState);
    // operator connections for mobile (dont know what to do with this)
    const [reconnected, setReconnected] = useState(false);
    const [reconnecting, setReconnecting] = useState(false);

    // setters for calls and video calls
    const [hasIncomingCall, setHasIncomingCall] = useState(false);
    const [hasIncomingVideoCall, setHasIncomingVideoCall] = useState(false);
    const [clientAudio, setClientAudio] = useState(true);

    const [assigning, setAssigning] = useState(false);
    const [showEmail, setShowEmail] = useState(false);
    const [showSideMenu, setShowSideMenu] = useState(false);

    const [userId, setUserId] = useState(null);

    const ticketResponseRef = useRef(ticketResponse);
    ticketResponseRef.current = ticketResponse;

    //ComponentDidMount
    useEffect(() => {
        didMount.current = true;
        if (session) {
            if (localStorage.storedUrl) {
                sendUrlToken(localStorage.storedUrl);
            }
        }
        const auth = localStorage.getItem("operator-impersonate");
        const authMe = async () => {
            try {
                const { data } = await JelouApiV1.get(`/operators/me`, {
                    headers: { Authorization: `Bearer ${auth}` },
                });
                // Add Sentry user scope
                Sentry.configureScope(function (scope) {
                    scope.setUser(data);
                });
                dispatch(setUserSession(data));
                dispatch(setStatusOperator(data.operatorActive));
            } catch (error) {
                if (error.response?.status === 401) {
                    localStorage.removeItem("jwt");
                }
            }
        };
        if (auth) {
            authMe();
        }
        dispatch(getUserSession());
        setUpNotification();

        document.addEventListener("visibilitychange", onVisibilityChange());

        return () => {
            document.removeEventListener("visibilitychange", onVisibilityChange());
            chatManager?.channel.leavePmaEvents({ companyId: company.id, providerId: userSession.providerId, companySocketId: company.socketId });
        };
    }, []);

    useEffect(() => {
        // set up channel and events
        if (!isEmpty(chatManager)) {
            setUp();
            setLoadingContext(false);
        } else {
            setLoadingContext(true);
        }
    }, [chatManager]);

    //ComponentDidUpdate
    useEffect(() => {
        if (prevPusherState !== "connected" && pusherState === "connected") {
            getRoomsOnSocketReconnect();
        }
    }, [pusherState]);

    useEffect(() => {
        if (prevOnline && !online) {
            addToQueue(`Operator ${userSession.names} went offline.`);
        }
    }, [online]);

    useEffect(() => {
        if (userId) {
            const room = rooms.find((room) => room.senderId === userId);

            if (room && didMount) {
                dispatch(setCurrentRoom(room));
                setUserId(null);
                setAssigning(false);
            }
        }
    }, [userId]);

    const sendCustomText = async (message) => {
        const by = USER_TYPES.OPERATOR;
        const { appId, source } = currentRoom;
        let { senderId } = currentRoom;
        const roomId = currentRoom.id;

        //SEND MESSAGE
        const formMessage = {
            by,
            source,
            roomId,
            botId: appId,
            userId: senderId,
            bubble: message,
            id: uuidv4(),
            createdAt: dayjs().valueOf(),
        };

        // Add message to Redux
        dispatch(addMessage(formMessage));

        // Send message to server
        JelouApiV1.post(`/operators/message`, omit(formMessage, ["source"])).catch((error) => {
            console.error("Error on send message", error.response);

            Sentry.configureScope((scope) => {
                const data = isObject(error.response) ? JSON.stringify(error.response, null, 2) : error.response;
                scope.setExtra("formMessage", formMessage);
                scope.setExtra("userSession", userSession);
                scope.setExtra("errorResponse", data);
            });

            Sentry.captureException(new Error(`( Room ) Send Message Hsm Failed With: ${error.message}`));
        });
    };

    const getParams = (url) => {
        var params = {};
        var parser = document.createElement("a");
        parser.href = url;
        var query = parser.search.substring(1);
        var vars = query.split("&");
        for (var i = 0; i < vars.length; i++) {
            var pair = vars[i].split("=");
            params[pair[0]] = decodeURIComponent(pair[1]);
        }
        return params;
    };

    /** */
    const sendUrlToken = async (url) => {
        setAssigning(true);
        const params = getParams(url);
        const operatorId = userSession?.operatorId;
        const payload = {
            token: params.token,
            userId: params.user,
            ...(params.teamId && params.teamId !== "undefined" ? { teamId: params.teamId } : {}),
            operatorId,
        };
        setUserId(params.user);
        const res = await dispatch(sendToken(payload, params.bot));
        const message = get(res, "data.message");

        if (message) {
            toastMessage(message);
        }
    };

    const toastMessage = (message) => {
        if (message !== "Token verified") {
            toast.error(message, {
                autoClose: true,
                position: toast.POSITION.BOTTOM_RIGHT,
            });
        }

        if (message === "Token verified") {
            setAssigning(false);
        } else {
            setTimeout(() => {
                setAssigning(false);
                toast.error("No se pudo encontrar la conversación.", {
                    autoClose: true,
                    position: toast.POSITION.BOTTOM_RIGHT,
                });
            }, 5000);
        }

        localStorage.removeItem("storedUrl");
    };

    const switchSection = (section) => {
        switch (toUpper(section)) {
            case "":
            case currentSectionPma.CHATS:
            case currentSectionPma.ARCHIVED:
                return (
                    <ChatView
                        sendCustomText={sendCustomText}
                        rooms={rooms}
                        currentRoom={(toUpper(section) === currentSectionPma.CHATS || isEmpty(section) ? currentRoom : currentArchivedRoom) ?? {}}
                        messages={messages}
                        company={company}
                        bots={bots}
                        key="section-case-chat"
                    />
                );
            case currentSectionPma.INBOX:
                return <InboxView key="section-case-inbox" rooms={rooms} currentRoom={currentRoom} messages={messages} company={company} bots={bots} sendCustomText={sendCustomText} />;
            case currentSectionPma.POSTS:
                return <PostView />;
            case currentSectionPma.EMAILS:
                return (
                    <EmailsView
                        showEmail={showEmail}
                        setShowEmail={setShowEmail}
                        getExpiredEmails={getExpiredEmails}
                        getNotReadEmails={getNotReadEmails}
                        getAllEmails={getAllEmails}
                        setExpirationEmails={setExpirationEmails}
                    />
                );
            default:
                return setShowPage404(true);
        }
    };

    const isMobileApp = {
        AndroidApp: function () {
            return navigator.userAgent.match(/\bAndroid\W+(?:\w+\W+){0,10}?Build\b/g);
        },
        iOSApp: function () {
            return navigator.userAgent.match(/\biPhone|iPad|iPod\W+(?:\w+\W+){0,10}?Build\b/g);
        },
    };

    const onVisibilityChange = async () => {
        try {
            if (document.visibilityState !== "hidden") {
                // We store the last visible state on the session storage to avoid calling the getRooms method too many times
                const lastVisibleCheck = sessionStorage.getItem("lastVisible");

                if (!lastVisibleCheck) {
                    return;
                }

                // Get the diff in seconds from the previous check
                const lastVisibleCheckInSeconds = dayjs().diff(dayjs.unix(lastVisibleCheck), "second");

                // Check if last visible time on browser is greather that 3mins
                if (lastVisibleCheckInSeconds >= 180) {
                    const rooms = await chatManager.getRooms();
                    dispatch(addRooms(rooms));
                }

                // Reset the last visible state
                sessionStorage.setItem("lastVisible", dayjs().unix());
            }
        } catch (error) {
            console.error(error);
        }
    };

    /**
     * Setup chat provider
     *
     * @memberof PmaIndex
     */
    const setUp = () => {
        const { Company = {} } = userSession;

        if (!isEmpty(Company)) {
            dispatch(setMotives());
        }
        const channel = chatManager.channel;
        channel.subscribeToChannelCompany({ companySocketId: company.socketId });
        channel.renderPmaEvents({ companyId: company.id, providerId: userSession.providerId, companySocketId: company.socketId });
        connect(chatManager);
    };

    const setUpNotification = async () => {
        const { Company = {} } = userSession;

        const { properties = {} } = Company;

        // Subscribe to thread Notifications
        const hasCallsEnabled = get(properties, "operatorView.enableCalls", false);
        const hasVideocallsEnabled = get(properties, "operatorView.enableVideoCalls", false);

        if (hasCallsEnabled || hasVideocallsEnabled) {
            // Get token for video call
            const response = await JelouApiV1.get(`/videocalls/token?operatorId=${userSession?.operatorId}`);
            const videoToken = get(response, "data.data.token", "");
            await Video.connect(videoToken, {
                name: `room-operador-${userSession?.operatorId}`,
                video: false,
                audio: false,
            })
                .then((data) => {
                    data.on("participantConnected", async (participant) => {
                        // check if there is a video track
                        if (participant.videoTracks.size > 0) {
                            setHasIncomingVideoCall(true);
                            // Create local video track
                            Video.createLocalVideoTrack({
                                video: { facingMode: "user" },
                                frameRate: 24,
                            })
                                .then((localVideoTrack) => {
                                    const imgSrc = get(company, "properties.backgroundSrc");
                                    const maskBlurRadius = 1;
                                    const fitType = "Fill";
                                    const assetsPath = "/assets/background/";
                                    let img = new Image();

                                    img.onload = async () => {
                                        const virtualBackground = new VirtualBackgroundProcessor({
                                            assetsPath,
                                            maskBlurRadius,
                                            backgroundImage: img,
                                            fitType,
                                            debounce: isSafari(),
                                            ipeline: Pipeline.WebGL2,
                                        });
                                        virtualBackground.loadModel().then(() => {
                                            localVideoTrack.addProcessor(virtualBackground, {
                                                inputFrameBufferType: "video",
                                                outputFrameBufferContextType: "webgl2",
                                            });
                                        });
                                    };
                                    img.src = imgSrc;
                                    roomRef.current.localParticipant.publishTrack(localVideoTrack).then(() => {
                                        roomRef.current.localParticipant?.videoTracks.forEach((publication) => {
                                            publication.track.disable();
                                        });
                                    });
                                })
                                .catch((error) => {
                                    console.log("error", error);
                                });
                        } else {
                            setHasIncomingCall(true);
                        }

                        // Create local audio track
                        Video.createLocalAudioTrack().then((localAudioTrack) => {
                            roomRef.current.localParticipant.publishTrack(localAudioTrack).then(() => {
                                roomRef.current.localParticipant?.audioTracks.forEach((publication) => {
                                    publication.track.disable();
                                });
                            });
                        });
                    });
                    data.on("participantDisconnected", (participant) => {
                        if (participant.videoTracks.size > 0) {
                            setHasIncomingVideoCall(false);
                        } else {
                            setHasIncomingCall(false);
                        }
                        // const localParticipant = get(room, "localParticipant", {});
                        roomRef.current.localParticipant?.tracks.forEach(({ track }) => {
                            track.stop();
                            roomRef.current.localParticipant.unpublishTrack(track);
                        });
                    });
                    data.on("trackDisabled", (track) => {
                        if (track.kind === "audio") {
                            setClientAudio(false);
                        }
                    });
                    data.on("trackEnabled", (track) => {
                        if (track.kind === "audio") {
                            setClientAudio(true);
                        }
                    });
                    setRoom(data);
                })
                .catch((error) => console.log(error));
        }
    };

    /**
     * Connect chat provider
     * Dispatch current connected user conversations to redux
     */
    const parseReply = (post) => {
        const storageKey = `room:${post.id}`;
        const lastUnRead = sessionStorage.getItem(storageKey) || 1;
        const unreadCount = Number(lastUnRead);
        sessionStorage.setItem(storageKey, unreadCount);
        const reply = {
            ...post,
            unreadCount,
        };
        return reply;
    };

    const getRoomsOnSocketReconnect = async () => {
        try {
            // Fetch rooms again
            const rooms = await chatManager.getRoomsWithMessages();
            dispatch(setRooms(rooms, location));
        } catch (error) {
            console.error(error);
        }
    };

    const isSafari = () => {
        const userAgentString = navigator.userAgent;
        // Detect Safari
        let chromeAgent = userAgentString.indexOf("Chrome") > -1;
        let safariAgent = userAgentString.indexOf("Safari") > -1;

        // Discard Safari since it also matches Chrome
        if (chromeAgent && safariAgent) safariAgent = false;
    };

    const connect = async (chatManager) => {
        try {
            const { Company } = userSession;

            dispatch(setIsLoadingPost(true));
            dispatch(setIsLoadingArchivedPostSidebar(true));
            dispatch(setIsLoadingPostSidebar(true));

            await chatManager.connect();
            subscribeToEvents(chatManager);

            // Add current user conversations
            if (!isEmpty(chatManager.rooms)) {
                const { rooms } = chatManager;
                dispatch(addRooms(rooms, location));
            }

            const { data } = await JelouApiV1.get(`rooms`, {
                params: {
                    userId: userSession.providerId,
                    type: "reply",
                },
            });

            const { data: response } = await JelouApiV1.get(`companies/${Company.id}/replies`, {
                params: {
                    onlyRoom: true,
                    status: "CLOSED_BY_OPERATOR",
                    type: "reply",
                },
            });

            const posts = get(data, "results", []);
            const archivedPosts = get(response, "results", []);
            let postsF = [];

            if (!isEmpty(posts)) {
                posts.map((post) => {
                    return postsF.push(parseReply(post));
                });
                const theRoom = maxBy(posts, (thread) => thread.updatedAt);
                if (toUpper(get(theRoom, "bot.type")) !== "ZENDESK") {
                    getPostMessages(theRoom.id);
                }
            }
            dispatch(setIsLoadingPost(false));

            let archived = [];

            if (!isEmpty(archivedPosts)) {
                archivedPosts.map((archivedThread) => {
                    archivedThread.archived = true;
                    return archived.push(archivedThread);
                });
                const archivedThreadRoom = maxBy(archivedPosts, (thread) => thread.updatedAt);
                getPostMessages(archivedThreadRoom.id);
            }

            dispatch(addPosts(postsF, location));
            dispatch(addArchivedPosts(archived, location));
            dispatch(setIsLoadingArchivedPostSidebar(false));
            dispatch(setIsLoadingPostSidebar(false));
        } catch (error) {
            console.error(error);
        }
    };

    const getNotReadEmails = async () => {
        if (notReadEmails === 0) {
            try {
                const { data } = await JelouApiV1.get(`/support-tickets`, {
                    params: {
                        sort: "DESC",
                        limit: 50,
                        page: 0,
                        read: false,
                        onlyInbound: true,
                        operatorId: userSession?.operatorId,
                    },
                });
                dispatch(setNotReadEmails({ operation: "add", value: get(data, "pagination.total", 0) }));
            } catch (error) {
                console.log(error);
            }
        }
    };

    const getExpiredEmails = async () => {
        try {
            const expirationDate = dayjs().add(3, "days").hour("23").minute("00").second("00").format();
            const { data } = await JelouApiV1.get(`/support-tickets`, {
                params: {
                    sort: "DESC",
                    limit: 50,
                    page: 1,
                    dueDate: { lte: expirationDate },
                    onlyInbound: true,
                    operatorId: userSession?.operatorId,
                },
                paramsSerializer: function (params) {
                    return qs.stringify(params);
                },
            });
            dispatch(setExpiredEmails(get(data, "pagination.total", 0)));
        } catch (error) {
            console.log(error);
        }
    };

    const setExpirationEmails = async () => {
        try {
            // setLoadingEmails(true);
            const expirationDate = dayjs().subtract(3, "days").hour("23").minute("00").second("00").format();

            const { data } = await JelouApiV1.get(`/support-tickets`, {
                params: {
                    sort: "DESC",
                    limit: 50,
                    page: 1,
                    dueDate: { gte: expirationDate },
                    onlyInbound: true,
                    operatorId: userSession?.operatorId,
                },
                paramsSerializer: function (params) {
                    return qs.stringify(params);
                },
            });
            dispatch(setExpiredEmails(get(data, "pagination.total", 0)));
            dispatch(setEmails(get(data, "results", []), location));
        } catch (error) {
            console.log(error);
        }
    };

    const getAllEmails = async () => {
        try {
            const { data } = await JelouApiV1.get(`/support-tickets`, {
                params: {
                    limit: 10,
                    page: 0,
                    onlyInbound: true,
                    operatorId: userSession?.operatorId,
                },
            });

            dispatch(setActualEmails(get(data, "pagination.total", 0)));
        } catch (error) {
            console.log(error);
        }
    };

    const getPostMessages = async (id) => {
        try {
            const { Company } = userSession;
            const companyId = Company.id;
            dispatch(setIsLoadingPost(true));
            const { data: response } = await JelouApiV1.get(`/companies/${companyId}/reply/room/${id}`);
            const data = get(response, "data", null);
            if (!isEmpty(data)) {
                const messages = data.map((reply) => ({
                    ...reply,
                    id: reply._id,
                }));
                dispatch(addMessages(messages));
            }
            dispatch(setIsLoadingPost(false));
        } catch (error) {
            console.log(error);
            dispatch(setIsLoadingPost(false));
        }
    };

    /**
     * Handle message event
     * @param {object} message Message object
     *
     * Should be sent is a new flag that add to redis those message
     * that should be sent to db, otherwhise it wont add it to redis.
     * @memberof App
     */
    const onMessage = (message) => {
        const shouldBeSent = !get(message, "shouldNotBeSent", false);

        if (shouldBeSent) {
            if (get(message, "sender.providerId", "") === userSession.providerId) {
                return;
            }

            dispatch(addMessage(message));
            dispatch(addArchivedMessage(message));
            // try {
            //     sendNewMessageNotification(message);
            // } catch (error) {
            //     console.error("Error on sending message notification.", error.message);
            // }
        }
    };

    const onAckMessage = (message) => {
        console.log(message, "message");
        console.log(get(message, "oldMessageId"), "oldMessageId");
        console.log(get(message, "oldId"), "oldId");

        const _messages = currentMessages?.current;
        const oldMessage = _messages.find((msg) => msg.id === get(message, "oldMessageId", get(message, "oldId")));
        const fixErrorMessage = {
            ...message,
            ...(!isEmpty(get(message, "response", "")) && !isEmpty(get(oldMessage, "message"))
                ? {
                      message: {
                          ...message.message,
                          textError: get(message, `response.error.clientMessages[${lang}]`, "Error"),
                      },
                  }
                : {}),
        };

        console.log("oldMessage founded? =>", oldMessage);

        if (oldMessage) {
            return dispatch(
                ackMessage({
                    ...fixErrorMessage,
                    oldId: oldMessage.id,
                })
            );
        }

        console.log("addMessage running", message);

        if (get(message, "senderId", "") === userSession.providerId) {
            dispatch(addMessage(message));
        }
    };
    /**
     * Fetch room messages
     * @param {object} room Room object
     * @memberof App
     * @returns
     */
    const getRoomMessages = async (room) => {
        try {
            let messages;
            const chatManager = chatManagerRef.current;
            messages = await chatManager?.getRoomMessages(room?.roomId);
            dispatch(addMessages(messages));
        } catch (err) {
            console.log(err);
        }
    };

    /**
     * Send a notification when a new message is received
     * Only triggers when a message is sended by a USER
     *
     * @param {object} message Message object
     * @param {string} message.by Message sender type can be either "user", "bot" or "operator"
     * @memberof PmaIndex
     */
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

            await Notifications.sendSelf({
                title: `${name}`,
                message: getPreviewMessage(content),
                url: "https://apps.jelou.ai",
            });
        }
    };

    const getFlows = async (botId, add = false) => {
        try {
            const { data } = await JelouApiV1.get(`/bots/${botId}/flows`, {
                params: {
                    shouldPaginate: false,
                    hasBubbles: true,
                    state: true,
                },
            });
            const flows = data.results.map((flow) => {
                return {
                    ...flow,
                    value: flow.id,
                    label: flow.title,
                    botId: botId,
                };
            });
            if (add) {
                dispatch(addFlows(flows));
            } else {
                dispatch(updateFlows(flows));
            }
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

    /**
     * Handle added to room event
     * @param {object} room Room object
     *
     * @memberof App
     */
    const onAddedToRoom = (room) => {
        if (isEmpty(room) || room.kind === "group") {
            return;
        }
        if (room.type === "reply") {
            dispatch(addPost(room, location));
        } else {
            dispatch(addRoom(room));
            updateRoomValidation(room);
            getRoomMessages(room);
        }

        const flows = flowsRef?.current;

        const botFlows = flows.find((flow) => flow.botId === get(room, "bot.id"));

        if (isEmpty(botFlows) && isEmpty(flows)) {
            getFlows(room.bot.id, true);
        }

        if (isEmpty(botFlows) && !isEmpty(flows)) {
            getFlows(room.bot.id);
        }

        const activeSound = JSON.parse(localStorage.getItem("activeSound"));
        if (activeSound) {
            beepRoom.setVolume(0.5).play();
        }
    };

    const updateRoomValidation = async (room) => {
        if (toUpper(room.type) === "CLIENT" && location.pathname === "/chats") {
            try {
                const { data: response } = await JelouApiV1.get(`/bots/${room.appId}/rooms/${room.id}/conversation`);
                room.conversation = get(response, "data.Conversation", null);
                room.storedParams = get(response, "data.StoredParams", null);
                room.tags = get(response, "data.Room.tags", []);
                dispatch(updateRoom(room));
            } catch (error) {
                console.log(error, "error");
            }
        }
    };

    /**
     * Handle room updated event
     * @param {object} room Room object
     *
     * @memberof App
     */
    const onRoomUpdated = (room) => {
        if (isEmpty(room)) {
            return;
        }
        if (get(room, "type") === "reply") {
            dispatch(updatePost(room));
        } else {
            if (toUpper(section) === currentSectionPma.CHATS) {
                dispatch(updateRoom(room));
            } else {
                dispatch(updateArchivedRoom(room));
            }
        }
    };

    /**
     * Handle removed from room event
     * @param {object} room Room object
     *
     * @memberof App
     */
    const onRemovedFromRoom = (payload) => {
        const { roomId } = payload;
        const type = get(payload, "type", []);

        console.log("onRemoveFromRoom", { payload });

        if (!isEmpty(type) && type === "reply") {
            dispatch(deletePost(roomId));
        } else {
            dispatch(deleteRoom(roomId));
        }
    };

    const realtimeEmailsRef = useRef([]);

    useEffect(() => {
        if (emails) realtimeEmailsRef.current = emails.map((email) => email.number);
    }, [emails]);

    const onAssignMail = (payload) => {
        const assignedTo = get(payload, "assignedTo.id", null);
        if (actualTrayRef?.current === "InAtention" && userSession.operatorId === assignedTo) {
            dispatch(addEmail(payload));
            dispatch(setActualEmails(actualEmailsRef.current + 1));
            dispatch(setNotReadEmails({ operation: "add", value: 1 }));
        }
    };

    const onReplyNewMail = (payload) => {
        if (get(payload, "by", "") !== "operator" && get(payload, "by", "") !== "bot") {
            const emailId = get(payload, "supportTicketId", "");
            const lastUserMessageAt = get(payload, "replyCreatedAt");

            const email = emailsRef?.current.find((email) => email._id === emailId);

            const newData = {
                ...email,
                _id: emailId,
                read: false,
                lastUserMessageAt,
            };

            if (email.read) {
                dispatch(setNotReadEmails({ operation: "add", value: 1 }));
            }

            dispatch(addEmail(newData));

            const _currentEmail = currentEmailRef?.current;

            if (get(_currentEmail, "roomId", "") === get(payload, "roomId", "")) {
                const updatedRoom = { ..._currentEmail, newMessage: true };
                dispatch(updateCurrentEmail(updatedRoom));
            }
        }
    };

    const onUpdateEmail = (payload) => {
        const eventId = get(payload, "_id", "");
        JelouApiV1.get(`/real-time-events/${eventId}`).then(({ data }) => {
            const payloadData = get(data, "data.payload", {});
            const assignedTo = get(payloadData, "assignedTo.id", null);
            const status = get(payloadData, "status", null);
            const isFavorite = get(payloadData, "isFavorite", false);
            const priority = get(payloadData, "priority", null);
            const creationEvent = first(payloadData.assignationFlow.filter((event) => event.event === "CREATION"));
            const mailCreatorId = get(creationEvent, "payload.creator.id", "");

            const emailExists = realtimeEmailsRef.current.some((emailNumber) => emailNumber === payloadData.number);

            // const title = get(payloadData, "title", "");
            if (userSession.operatorId === assignedTo && status.toUpperCase() === "NEW" && !emailExists && actualTrayRef.current === "InAtention") {
                dispatch(addEmail(payloadData));
                // dispatch(setActualEmails(actualEmailsRef.current + 1)); // support-tickets-assign is doing this
                // dispatch(setNotReadEmails({ operation: "add", value: 1 })); // support-tickets-assign is doing this
                return;
            }
            if (userSession.operatorId === assignedTo && status.toUpperCase() === "NEW" && !emailExists && actualTrayRef.current === "inNewMails") {
                dispatch(addEmail(payloadData));
                dispatch(setActualEmails(actualEmailsRef.current + 1));
                dispatch(setNotReadEmails({ operation: "add", value: 1 }));
                return;
            }
            if (userSession.operatorId === assignedTo && status.toUpperCase() === "NEW" && !emailExists && actualTrayRef.current === "InFavorites" && isFavorite) {
                dispatch(addEmail(payloadData));
                dispatch(setActualEmails(actualEmailsRef.current + 1));
                dispatch(setNotReadEmails({ operation: "add", value: 1 }));
                return;
            }

            if (userSession.operatorId === assignedTo && !emailExists && upperCase(actualTrayRef.current) === priority.toUpperCase()) {
                dispatch(setActualEmails(actualEmailsRef.current + 1));
                dispatch(setNotReadEmails({ operation: "add", value: 1 }));
                dispatch(addEmail(payloadData));
                return;
            }

            if (userSession.operatorId === mailCreatorId && actualTrayRef.current === "sentByOperator" && status.toUpperCase() === "NEW" && !emailExists) {
                dispatch(addEmail(payloadData));
                if (userSession.operatorId === assignedTo) dispatch(setActualEmails(actualEmailsRef.current + 1));
                return;
            }
            if (userSession.operatorId === assignedTo && status.toUpperCase() === "NEW" && !emailExists) {
                realtimeEmailsRef.current.push(payloadData.number);

                dispatch(setActualEmails(actualEmailsRef.current + 1));
                dispatch(setNotReadEmails({ operation: "add", value: 1 }));
                return;
            }
        });
    };

    /**
     * Subscribe to provider events
     *
     * @memberof App
     */
    const subscribeToEvents = (chatManager) => {
        chatManager.onEvent("message", (payload) => onMessage(payload));
        chatManager.onEvent("ackMessage", (payload) => onAckMessage(payload));
        chatManager.onEvent("addedToRoom", (payload) => onAddedToRoom(payload));
        chatManager.onEvent("removedFromRoom", (payload) => {
            console.log("subscribeToEvents ~ removedFromRoom", { payload });
            onRemovedFromRoom(payload);
        });
        chatManager.onEvent("stateChange", (payload) => onStateChange(payload));
        // chatManager.onEvent("roomUpdated", (payload) => onRoomUpdated(payload));
        // Email
        chatManager.onEvent("assignMail", (payload) => onAssignMail(payload));
        chatManager.onEvent("updateEmail", (payload) => onUpdateEmail(payload));

        chatManager.onEvent("replyNewMail", (payload) => onReplyNewMail(payload));
        chatManager.onEvent("emailsReplyUpdate", (payload) => onEmailsReplyUpdate(payload));
        chatManager.onEvent("supportTicketsReplyUpdate", (payload) => onAckMessage(payload));
        // Queues
        chatManager.onEvent("newQueue", (payload) => onNewQueue(payload));
        chatManager.onEvent("updateQueue", (payload) => onUpdateQueue(payload));
        chatManager.onEvent("takeQueueResponse", (payload) => onTakeQueueResponse(payload));
    };

    const onEmailsReplyUpdate = (data) => {
        onAckMessage({
            ...data,
            ...(data.createdAt ? { createdAt: data.createdAt * 1000 } : {}),
        });
    };

    const onTakeQueueResponse = (payload) => {
        console.log("take_ticket", JSON.stringify(payload, null, 2));

        const eventId = get(payload, "_id", "");
        JelouApiV1.get(`/real-time-events/${eventId}`).then(({ data }) => {
            const payloadData = get(data, "data.payload", {});
            const operatorId = get(payloadData, "Operator.operatorId", get(payloadData, "Operator.id", null));
            if (!operatorId || operatorId !== userSession?.operatorId) {
                return;
            }
            setTicketResponse(payloadData);
            ticketResponseRef.current = payloadData;
        });
    };

    const onUpdateQueue = (payload) => {
        const eventId = get(payload, "_id", "");
        JelouApiV1.get(`/real-time-events/${eventId}`).then(({ data }) => {
            const payloadData = get(data, "data.payload", {});
            const id = get(payloadData, "_id", null);
            const state = get(payloadData, "state", null);

            dispatch(updateQueue(payloadData));

            if (state === "assigned") {
                dispatch(deleteQueue(id));
            }
        });
    };

    const onNewQueue = (payload) => {
        const eventId = get(payload, "_id", "");
        JelouApiV1.get(`/real-time-events/${eventId}`).then(({ data }) => {
            const payloadData = get(data, "data.payload", {});
            dispatch(addQueue(payloadData));
        });
    };

    const onStateChange = ({ current }) => {
        setPusherState(current);
    };

    if (loadingContext) {
        return (
            <div className="absolute left-0 flex h-full w-full items-center justify-center" id="loading-metrics">
                <GridLoader size={15} color={"#00B3C7"} loading={loadingContext} />
            </div>
        );
    }

    return (
        <TicketResponseContext.Provider value={{ ticketResponse: ticketResponseRef.current, setTicketResponse }} style={styles}>
            <LayoutCallModal
                company={company}
                hasIncomingCall={hasIncomingCall}
                setHasIncomingCall={setHasIncomingCall}
                hasIncomingVideoCall={hasIncomingVideoCall}
                setHasIncomingVideoCall={setHasIncomingVideoCall}
                clientAudio={clientAudio}
                currentRoom={currentRoom}
                room={room}
            />
            <OfflineOperatorModal setShowModal={(boolean) => dispatch(setShowDisconnectedModal(boolean))} showModal={isOperatorOfflineModal} />

            {!(isMobileApp.AndroidApp() || isMobileApp.iOSApp()) && <OnlineToast online={online} reconnecting={reconnecting} reconnected={reconnected} />}
            {assigning && (
                <div className="fixed inset-0 z-50 flex h-screen w-screen items-center justify-center bg-gray-490">
                    <div className="flex flex-col items-center justify-center">
                        <BeatLoader size={"0.875rem"} color="white" className="mb-1" />
                        <h1 className="font-sans text-lg font-medium text-white">Asignando...</h1>
                    </div>
                </div>
            )}
            <menu className="m-0 mx-auto flex h-screen max-h-screen w-full flex-col border-l-1 border-gray-10 md:border-l-4 mid:border-l-0 mid:px-3 mid:py-2 lg:px-6 lg:py-3">
                {showSideMenu && <MobileStatus sidebar={"sidebar"} setShowSideMenu={setShowSideMenu} />}
                <Menu sendCustomText={sendCustomText} bots={bots} setShowSideMenu={setShowSideMenu} />
                {switchSection(section)}
            </menu>
            {/* <ToastContainer /> */}
        </TicketResponseContext.Provider>
    );
};
export default PmaIndex;
