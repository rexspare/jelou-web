import qs from "qs";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import isEmpty from "lodash/isEmpty";
import get from "lodash/get";
import first from "lodash/first";
import has from "lodash/has";
import toUpper from "lodash/toUpper";
import { getTime, filterByKey, parseMessage } from "@apps/shared/utils";
import { GreetingIcon, Web } from "@apps/shared/icons";
import { useTranslation } from "react-i18next";
import { JelouApiV1 } from "@apps/shared/modules";
import { useDispatch, useSelector } from "react-redux";
import { ShowSidebar, PluginRenderer, RoomHeader, RoomHeaderArchived, useHandlesDropzone } from "@apps/pma/ui-shared";
import { GridLoader } from "react-spinners";
import { ConversationSidebarSkeleton, ConversationSkeleton, RoomHeaderSkeleton } from "@apps/shared/common";
import { setStoredParams, getOperators, addMessages, setIsLoadingFirstMessage, setShowSidebar, setTags } from "@apps/redux/store";
import MicModalNotification from "../mic-modal-notification/mic-modal-notification";
import ConversationSidebar from "../conversation-sidebar/conversation-sidebar";
import PmaTimelineChat from "@apps/pma/timeline-chat";
import dayjs from "dayjs";
import { usePrevious } from "@apps/shared/hooks";
import { ChatManagerContext } from "@apps/pma/context";
import { InputOptions } from "@apps/pma/option-input";
import { useParams } from "react-router-dom";
import { currentSectionPma } from "@apps/shared/constants";
import DragOverView from "../drag-over-view/drag-over-view";
import ConversationSidebarMobile from "../conversation-sidebar/conversation-sidebar-mobile";
import { PmaWebInputOptions } from "@apps/pma/web-input-options";

const ChatRoom = (props) => {
    const { rooms, archivedRooms, currentRoom, messages, showChat, company, bots, sendCustomText } = props;
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const { chatManager: context } = useContext(ChatManagerContext);
    const { section = "chats" } = useParams();

    let isArchived = toUpper(section) === currentSectionPma.ARCHIVED;
    const [time] = useState(dayjs().locale("es").format("HH:mm"));
    const [mobileMenu, setMobileMenu] = useState(false);
    const [verifyStatus, setVerifyStatus] = useState(true);
    const [sidebarChanged, setSidebarChanged] = useState(false);
    const [storeParams, setStoreParams] = useState({});
    const [savedData, setSavedData] = useState([]);
    const [usersId, setUsersId] = useState([]);
    const [micPermission, setMicPermission] = useState(false);
    const [openMicModal, setOpenMicModal] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [documentList, setDocumentList] = useState([]);
    const [flows, setFlows] = useState([]);
    const [disableDragFile, setDisableDragFile] = useState(false);
    const [showConversationSidebarMobile, setShowConversationSidebarMobile] = useState(false);
    const [previewDoc, setPreviewDoc] = useState({
        upload: false,
        fileName: "",
    });
    const [previewImage, setPreviewImage] = useState({
        upload: false,
        img: "",
    });
    const setMicPermissionMemo = useCallback((value) => setMicPermission(value), []);
    const userSession = useSelector((state) => state.userSession);
    const operators = useSelector((state) => state.operators);
    const userTeams = useSelector((state) => state.userTeams);
    const recoverChat = useSelector((state) => state.recoverChat);
    const tags = useSelector((state) => state.tags);
    const name = get(userSession, "names", "");
    let firstName = first(name.split(" "));

    // Filter messages in chats or archived
    const conversationMessages = !isArchived
        ? filterByKey(messages, "roomId", currentRoom.id)
        : messages.filter((message) => {
              return message.roomId === get(currentRoom, "id", "_id");
          });

    const showSidebar = useSelector((state) => state.showSidebar);
    const isLoadingFirstMessage = useSelector((state) => state.isLoadingFirstMessage);
    const isLoadingMessages = useSelector((state) => state.isLoadingMessages);
    const greeting = getTime(time, t);
    const didMount = useRef(null);
    const [audioRef, setAudioRef] = useState(null);
    const [sidebarStatus, setSidebarStatus] = useState(false);

    //ComponentDidMount
    useEffect(() => {
        document.addEventListener("keydown", escFunction, false);
        return () => {
            document.removeEventListener("keydown", escFunction);
        };
    }, []);

    const getSideBarSettings = () => {
        const teamId = first(get(userSession, "teams", []));
        const teamObj = userTeams.find((team) => team.id === teamId);
        const teamSettingsLegacy = get(teamObj, "properties.sidebar_settings", []);
        const teamSettings = get(teamObj, "properties.sidebarSettings", []);

        let bot = {};
        if (currentRoom?.archived) {
            bot = bots.find((bot) => bot.id === currentRoom.bot?.id);
        } else {
            bot = bots.find((bot) => bot.id === currentRoom.appId);
        }
        const botSettings = get(bot, "properties.sidebar_settings", []);
        const companySettings = get(company, "properties.sidebar_settings", []);

        if (!isEmpty(teamSettingsLegacy)) {
            return teamSettingsLegacy;
        }
        if (!isEmpty(teamSettings)) {
            return teamSettings;
        }
        if (!isEmpty(botSettings)) {
            return botSettings;
        }
        if (!isEmpty(companySettings)) {
            return companySettings;
        }
        return [];
    };
    const sidebar_settings = getSideBarSettings();

    const isGEACabinaTeam = userTeams?.some((team) => team?.id === 603);
    const bot = bots.find((bot) => bot.id === currentRoom.appId || bot.id === currentRoom.bot?.id);
    const hasPlugin = isGEACabinaTeam || get(bot, "properties.operatorView.plugin");

    const hasSidebarSettingsEnabled = !isEmpty(sidebar_settings) || !isEmpty(tags);

    const isMobileApp = {
        AndroidApp: function () {
            return navigator.userAgent.match(/\bAndroid\W+(?:\w+\W+){0,10}?Build\b/g);
        },
        iOSApp: function () {
            return navigator.userAgent.match(/\biPhone|iPad|iPod\W+(?:\w+\W+){0,10}?Build\b/g);
        },
    };
    const isMobile = isMobileApp.iOSApp() || isMobileApp.AndroidApp();

    const openInfo = () => {
        setMobileMenu(!mobileMenu);
    };

    // This would prevent escaping when conversation group is on Deleting.
    const escFunction = (event) => {
        if (event.keyCode === 27 && uploading) {
            return event.stopImmediatePropagation();
        }
        if (event.keyCode === 27 && (previewImage.upload || previewDoc.upload)) {
            setPreviewDoc({ upload: false, fileName: "" });
            setPreviewImage({ upload: false, img: "" });
            setUploading(false);
            return this.uploaded();
        }
    };

    /**
     * Get userId of store params
     *
     */
    const getUserId = async () => {
        try {
            const sender = toUpper(section) === currentSectionPma.CHATS || isEmpty(section) ? get(currentRoom, "senderId") : get(currentRoom, "_id", currentRoom?.senderId);
            const senderId = sender.replace("@c.us", "");
            const botId = get(currentRoom, "appId", get(currentRoom, "bot.id"));
            if (!botId) {
                return;
            }
            const { data } = await JelouApiV1.get(`bots/${botId}/users/${senderId}`);
            setUsersId(data);
        } catch (error) {
            console.error("error=== ", error);
        }
    };

    const prevCurrentRoom = usePrevious(currentRoom);
    const prevUserSession = usePrevious(userSession);
    const prevMessages = usePrevious(messages);
    const prevRecoverChat = usePrevious(recoverChat);
    const isMounted = useRef(null);

    useEffect(() => {
        isMounted.current = true;
        if (context) {
            if (messages !== prevMessages && toUpper(section) === currentSectionPma.CHATS) {
                dispatch(setIsLoadingFirstMessage(false));
            }

            if (recoverChat !== prevRecoverChat && recoverChat && showChat) {
                getRoomMessages();
            }

            if (userSession !== prevUserSession && isEmpty(operators) && !isEmpty(userSession)) {
                dispatch(getOperators());
            }
        }
        return () => (isMounted.current = false);
    }, [sidebar_settings, context]);

    // Handle stored params in chat view
    useEffect(() => {
        if (currentRoom?.id !== prevCurrentRoom?.id && !isEmpty(currentRoom)) {
            const { appId, senderId } = currentRoom;
            if (!!appId && !!senderId && didMount && toUpper(section) === currentSectionPma.CHATS) {
                fetchStoreParams();
                getUserId();
                getFlows();
            }
            getTags();
        }
    }, [currentRoom]);

    // Handle stored params in archived view
    useEffect(() => {
        const appId = get(currentRoom, "bot.id", currentRoom.appId);
        const senderId = get(currentRoom, "_id", currentRoom.senderId);

        toUpper(section) === currentSectionPma.ARCHIVED && setStoreParams({});
        if (!!appId && !!senderId && has(currentRoom, "archived") && toUpper(section) === currentSectionPma.ARCHIVED) {
            fetchStoreParams();
            getUserId();
        }
    }, [currentRoom]);

    useEffect(() => {
        return () => {
            didMount.current = false;
        };
    });

    // Get created tags by company
    const getTags = () => {
        const companyId = company.id;

        const teams = get(userSession, "teams", []);
        const bots = get(currentRoom, "bot.id", []);

        JelouApiV1.get(`/company/${companyId}/tags`, {
            params: {
                ...(!isEmpty(teams) ? { teams } : {}),
                ...(!isEmpty(bots) ? { bots: [bots] } : {}),
                joinTags: true,
            },
            paramsSerializer: function (params) {
                return qs.stringify(params);
            },
        })
            .then((res) => {
                const tagsArray = get(res, "data.data", []);

                dispatch(setTags(tagsArray));
            })
            .catch((err) => {
                console.log("=== ERROR", err);
            });
    };

    const getFlows = async () => {
        try {
            const { data } = await JelouApiV1.get(`/bots/${currentRoom.appId}/flows`, {
                params: {
                    shouldPaginate: false,
                    state: true,
                },
            });
            const flows = data.results.map((flow) => {
                return {
                    ...flow,
                    value: flow.id,
                    label: flow.title,
                };
            });
            setFlows(flows);
        } catch (error) {
            console.log("error", error);
        }
    };

    const fetchStoreParams = async () => {
        try {
            const appId = toUpper(section) === currentSectionPma.CHATS ? get(currentRoom, "appId", "") : get(currentRoom, "bot.id", currentRoom?.appId);
            const sender = toUpper(section) === currentSectionPma.CHATS ? get(currentRoom, "senderId") : get(currentRoom, "_id", currentRoom?.senderId);
            const senderId = sender.replace("@c.us", "");

            const { clientId, clientSecret } = company;
            const auth = {
                username: clientId,
                password: clientSecret,
            };

            JelouApiV1.get(`/bots/${appId}/users/${senderId}/storedParams/legacy`, auth).then(({ data }) => {
                const userData = get(data, "data", []);
                switch (toUpper(section)) {
                    case currentSectionPma.CHATS:
                        setSavedData(userData);
                        setStoreParams(userData);
                        dispatch(setStoredParams(userData));
                        break;
                    case currentSectionPma.ARCHIVED:
                        dispatch(setStoredParams(userData));
                        setStoreParams({ ...userData }); // Same as above 👯
                        break;
                    default:
                        break;
                }
            });
        } catch (error) {
            console.error("error=== ", error);
        }
    };

    /**
     * This method tries to sync missing messages from history
     * Sometimes a room is asigned before mongo writes the last message
     * When an operator select the current room we try to get those messages
     *
     * @memberof ConnectedRoom
     */
    const getRoomMessages = () => {
        const options = {
            lastMessageId: null,
            userId: currentRoom.senderId,
            botId: currentRoom.appId || currentRoom.botId,
            limit: 20,
        };

        context?.getRoomMessages(currentRoom?.id, options).then((messages = []) => {
            let updatedConversation = [];
            messages.forEach((message) => {
                updatedConversation.push({ ...parseMessage(message), roomId: options.userId, userId: options.userId, appId: options.botId });
            });
            dispatch(addMessages(messages));
        });
    };

    const clearDocumentList = useCallback(() => {
        setDocumentList([]);
        setUploading({});
    }, []);

    const [showDropzone, setShowDropzone] = useState(false);

    const { handleDragEnter, handleDragLeave, handleOnDrop, handleSelectFiles, handleDeleteImage, handleAddFiles } = useHandlesDropzone({
        setDocumentList,
        setUploading,
        setShowDropzone,
    });

    const showRoomHeader = (section) => {
        switch (toUpper(section)) {
            case currentSectionPma.CHATS:
            case "":
                return (
                    <RoomHeader
                        hasSidebarSettingsEnabled={hasSidebarSettingsEnabled}
                        currentRoom={currentRoom}
                        verifyStatus={verifyStatus}
                        setVerifyStatus={setVerifyStatus}
                        sidebarChanged={sidebarChanged}
                        usersId={usersId}
                        setMobileMenu={setMobileMenu}
                        openInfo={openInfo}
                        mobileMenu={mobileMenu}
                        flows={flows}
                        company={company}
                        setShowConversationSidebarMobile={setShowConversationSidebarMobile}
                    />
                );
            case currentSectionPma.ARCHIVED:
                return (
                    <RoomHeaderArchived
                        currentRoom={currentRoom}
                        hasButton={false}
                        usersId={usersId}
                        setMobileMenu={setMobileMenu}
                        openInfo={openInfo}
                        mobileMenu={mobileMenu}
                        setShowConversationSidebarMobile={setShowConversationSidebarMobile}
                    />
                );
            default:
                break;
        }
    };

    // loadingFirstMessages
    if (isLoadingFirstMessage) {
        let loadingSkeleton = [];

        for (let i = 0; i < 8; i++) {
            loadingSkeleton.push(<ConversationSkeleton key={i} />);
        }

        return (
            <div className="flex flex-1 rounded-xl bg-white">
                <div className="flex h-full w-full flex-row overflow-y-hidden border-r-1 border-black/10 mid:flex-1">
                    <div className="relative flex w-full flex-1 flex-col bg-white mid:rounded-l-xl">
                        <div className="fixed top-[2.5rem] z-10 flex w-full flex-row items-center rounded-tl-xl border-b-2 border-black border-opacity-10 bg-white px-4 py-2 sm:z-0 md:top-0 mid:relative mid:py-5 xxl:py-6">
                            <RoomHeaderSkeleton />
                        </div>
                        <div className={`relative flex-col rounded-bl-xl bg-white mid:flex`}>
                            <div className="flex flex-1 flex-row overflow-y-auto">
                                <div className="relative mt-26 flex-1 overflow-x-hidden pb-10 sm:mt-0">{loadingSkeleton}</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="hidden w-1/4 flex-col md:flex">
                    <ConversationSidebarSkeleton />
                </div>
            </div>
        );
    }

    if ((toUpper(section) === currentSectionPma.CHATS || toUpper(section) === "") && (isEmpty(rooms) || isEmpty(currentRoom))) {
        return (
            <div className={`flex-1 ${showChat ? "flex" : "hidden mid:flex"} relative flex-col`}>
                <div className="flex flex-1 flex-col">
                    <div className="relative flex h-full flex-col items-center justify-center bg-white text-center mid:rounded-xl">
                        <div className="mx-auto flex max-w-sm flex-col items-center md:max-w-lg">
                            <GreetingIcon className="my-10" width="25.8125rem" height="18.625rem" />
                            <div className="flex flex-col sm:flex-row">
                                <div className="mr-1 text-xl font-bold text-gray-400/75">{t(greeting)}</div>
                                <div className="text-xl font-bold text-primary-200">{firstName}</div>
                            </div>
                            <div className="text-15 leading-normal text-gray-400/65">{isEmpty(rooms) ? t("pma.Aún no tienes consultas entrantes") : t("pma.Escoja una conversacion")}</div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (toUpper(section) === currentSectionPma.ARCHIVED && (isEmpty(archivedRooms) || isEmpty(currentRoom))) {
        return (
            <div className={`flex-1 ${showChat ? "flex" : "hidden mid:flex"} relative flex-col`}>
                <div className="flex flex-1 flex-col">
                    <div className="relative flex h-full flex-col items-center justify-center bg-white text-center mid:rounded-xl">
                        <div className="mx-auto flex max-w-sm flex-col items-center md:max-w-lg">
                            <GreetingIcon className="my-10" width="25.8125rem" height="18.625rem" />
                            <div className="flex flex-col sm:flex-row">
                                <div className="mr-1 text-xl font-bold text-gray-400/75">{t(greeting)}</div>
                                <div className="text-xl font-bold text-primary-200">{firstName}</div>
                            </div>
                            <div className="text-15 leading-normal text-gray-400/65">{isEmpty(archivedRooms) ? t("pma.Aún no tienes consultas entrantes") : t("pma.Escoja una conversacion")}</div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    return (
        <>
            <div className={`${showChat ? "flex" : "hidden mid:flex"} w-full flex-1 overflow-hidden shadow-sm mid:rounded-xl`}>
                <div className="flex w-full flex-col">
                    <div className={`flex h-screen flex-row overflow-y-hidden mid:flex-1`}>
                        <div
                            className={`relative flex w-full flex-col bg-white mid:rounded-l-xl ${showSidebar && "flex-1"}`}
                            onDragEnter={(evt) => !disableDragFile && handleDragEnter(evt)}
                            onDragOverCapture={(evt) => {
                                evt.stopPropagation();
                                evt.preventDefault();
                            }}
                            onDragLeave={(evt) => !disableDragFile && handleDragLeave(evt)}
                            onDrop={(evt) => !disableDragFile && handleOnDrop({ evt, documentList })}
                        >
                            {showDropzone ? (
                                <DragOverView setShowDropzone={setShowDropzone} />
                            ) : (
                                <>
                                    {showRoomHeader(section)}
                                    {isLoadingMessages && (
                                        <div className="absolute z-100 mt-24 flex w-full justify-center py-5">
                                            <GridLoader size={12} color={"#00b3c7"} />
                                        </div>
                                    )}
                                    {!hasPlugin && showConversationSidebarMobile && (
                                        <ConversationSidebarMobile
                                            settings={sidebar_settings ?? []}
                                            setStatus={setVerifyStatus}
                                            verifyStatus={verifyStatus}
                                            sidebarChanged={sidebarChanged}
                                            setSidebarChanged={setSidebarChanged}
                                            setShowConversationSidebarMobile={setShowConversationSidebarMobile}
                                            storeParams={storeParams}
                                            setStoreParams={setStoreParams}
                                            savedData={savedData}
                                            setSavedData={setSavedData}
                                            currentRoom={currentRoom}
                                        />
                                    )}

                                    <div ref={setAudioRef} className={`relative flex flex-1 flex-col overflow-y-hidden rounded-br-xl border-gray-100/25 border-opacity-25 md:border-t-1.5`}>
                                        <MicModalNotification micPermission={micPermission} openMicModal={openMicModal} setOpenMicModal={setOpenMicModal} />

                                        <PmaTimelineChat
                                            className={
                                                !isArchived
                                                    ? `${isMobile ? (mobileMenu ? "mt-40" : "mt-28") : "mt-0 sm:mt-0"} py-2`
                                                    : `${isMobile ? (mobileMenu ? "mt-32" : "mt-28") : "mt-0 sm:mt-0"} py-2`
                                            }
                                            currentRoom={currentRoom}
                                            messages={conversationMessages}
                                            getArchived={isArchived}
                                        />
                                        {!isArchived &&
                                            (isMobile ? (
                                                <InputOptions
                                                    audioRef={audioRef}
                                                    bot={bot}
                                                    handleAddFiles={handleAddFiles}
                                                    clearDocumentList={clearDocumentList}
                                                    documentList={documentList}
                                                    handleDeleteImage={handleDeleteImage}
                                                    handleSelectFiles={handleSelectFiles}
                                                    micPermission={micPermission}
                                                    setMicPermission={setMicPermissionMemo}
                                                    uploadingDropZone={uploading}
                                                    setDocumentList={setDocumentList}
                                                />
                                            ) : (
                                                <PmaWebInputOptions
                                                    audioRef={audioRef}
                                                    bot={bot}
                                                    setDisableDragFile={setDisableDragFile}
                                                    handleAddFiles={handleAddFiles}
                                                    clearDocumentList={clearDocumentList}
                                                    documentList={documentList}
                                                    handleDeleteImage={handleDeleteImage}
                                                    handleSelectFiles={handleSelectFiles}
                                                    micPermission={micPermission}
                                                    setMicPermission={setMicPermissionMemo}
                                                    uploadingDropZone={uploading}
                                                    setDocumentList={setDocumentList}
                                                />
                                            ))}
                                    </div>
                                </>
                            )}
                        </div>
                        {hasPlugin ? (
                            <ConversationSidebar
                                hasPlugin={hasPlugin}
                                sendCustomText={sendCustomText}
                                settings={sidebar_settings ?? []}
                                setStatus={setVerifyStatus}
                                verifyStatus={verifyStatus}
                                sidebarChanged={sidebarChanged}
                                setSidebarChanged={setSidebarChanged}
                                storeParams={storeParams}
                                setStoreParams={setStoreParams}
                                savedData={savedData}
                                setSavedData={setSavedData}
                                isArchivedRoom={isArchived}
                                showButton={!isArchived}
                                company={company}
                                currentRoom={currentRoom}
                            >
                                <PluginRenderer
                                    currentRoom={currentRoom}
                                    bot={bot}
                                    company={company}
                                    settings={get(bot, "settings")}
                                    userSession={userSession}
                                    setSidebarChanged={setSidebarChanged}
                                    sidebarChanged={sidebarChanged}
                                    setStatus={setVerifyStatus}
                                    setSidebarStatus={setSidebarStatus}
                                    sidebarStatus={sidebarStatus}
                                    teams={userSession.Teams || []}
                                    storeParams={storeParams}
                                    showSidebar={showSidebar}
                                    toggleShowSidebar={setShowSidebar}
                                    usersId={usersId}
                                />
                            </ConversationSidebar>
                        ) : (
                            <ConversationSidebar
                                sendCustomText={sendCustomText}
                                settings={sidebar_settings ?? []}
                                setStatus={setVerifyStatus}
                                verifyStatus={verifyStatus}
                                sidebarChanged={sidebarChanged}
                                setSidebarChanged={setSidebarChanged}
                                storeParams={storeParams}
                                setStoreParams={setStoreParams}
                                savedData={savedData}
                                setSavedData={setSavedData}
                                isArchivedRoom={isArchived}
                                showButton={!isArchived}
                                hasSidebarSettingsEnabled={hasSidebarSettingsEnabled}
                                company={company}
                                currentRoom={currentRoom}
                            />
                        )}
                    </div>
                </div>
            </div>
            {<ShowSidebar show={showSidebar} />}
        </>
    );
};

export default ChatRoom;
