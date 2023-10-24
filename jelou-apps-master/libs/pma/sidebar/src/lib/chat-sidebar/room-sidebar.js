import dayjs from "dayjs";
import "dayjs/locale/es";
import emojiStrip from "emoji-strip";
import cloneDeep from "lodash/cloneDeep";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import size from "lodash/size";
import sortBy from "lodash/sortBy";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import Avatar from "react-avatar";
import { useTranslation, withTranslation } from "react-i18next";
import { useInView } from "react-intersection-observer";
import { useDispatch, useSelector } from "react-redux";

import { ChatManagerContext } from "@apps/pma/context";
import {
    addArchivedMessages,
    addMessages,
    restartCounter,
    setCurrentRoom,
    setIsLoadingFirstMessage,
    showMobileChat,
    updateRoom,
} from "@apps/redux/store";
import { renderMessage, SocialIcon } from "@apps/shared/common";
import { JelouApiV1 } from "@apps/shared/modules";
import { onlySpaces, parseMessage } from "@apps/shared/utils";
import MessagePreview from "../message-preview/message-preview-room";
import { OriginManagedIconsChats } from "./OriginManagedIconsChats";

import { MESSAGE_TYPES } from "@apps/shared/constants";
import { getUnreadMessages } from "../services/UnreadMessages";

const Room = (props) => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const [lastMessage, setLastMessage] = useState({});
    const [isCurrent, setIsCurrent] = useState(false);
    const [wasAlreadyVisible, setWasAlreadyVisible] = useState(false);
    const [roomName, setRoomName] = useState("");
    const [roomAvatar, setRoomAvatar] = useState("");

    const messages = useSelector((state) => state.messages);
    const currentRoom = useSelector((state) => state.currentRoom);
    const bots = useSelector((state) => state.bots);
    const { chatManager } = useContext(ChatManagerContext);
    const { room, fromArchived, sortOrder } = props;
    const isMounted = useRef(null);
    const [ref, inView] = useInView({
        /* Optional options */
        threshold: 0,
    });

    const providerId = useSelector((state) => state.userSession.providerId);

    /**
     * Get last message from a room to preview
     *
     */
    const getRoomLastMessage = useCallback(() => {
        const roomMessages = messages.filter((message) => message.roomId === room.id);

        const sortedMessages = sortBy(roomMessages, (data) => {
            return new Date(data.createdAt);
        });

        const message = sortedMessages.pop();
        if (message) {
            setLastMessage(message);
        }
    }, [messages, room.id]);

    // Update lastMessage when messages or rooms is updated
    useEffect(() => {
        isMounted.current = true;

        getRoomLastMessage();
        return () => (isMounted.current = false);
    }, [room, messages, getRoomLastMessage]);

    // Update current state when redux currentRoom is updated
    useEffect(() => {
        isMounted.current = true;

        if (!isEmpty(currentRoom)) {
            setIsCurrent(room.id === currentRoom.id);
        } else {
            setIsCurrent(false);
        }
        return () => (isMounted.current = false);
    }, [currentRoom]);

    /**
     * Fetch messages when a component becames visible
     */
    const getRoomMessages = useCallback(() => {
        const bot = bots.find((bot) => bot.id === get(currentRoom, "bot.id", ""));
        const hasEnabledEvents = get(bot, "properties.hasEnabledEvents", true);
        const roomId = get(room, "id", "");
        // Do not run this if is from Archived

        if (!fromArchived) {
            const options = { lastMessageId: null, userId: room.senderId, botId: room.appId || room.botId, limit: 20 };
            chatManager
                .getRoomMessages(roomId, options, hasEnabledEvents)
                .then((messages) => {
                    if (isMounted.current) {
                        dispatch(addMessages(messages));
                    }
                })
                .catch((error) => {
                    console.error(error);
                });
        }
    }, [fromArchived, room]);

    useEffect(() => {
        isMounted.current = true;

        if (inView && !wasAlreadyVisible) {
            setWasAlreadyVisible(true);
            getRoomMessages();
        }
        return () => (isMounted.current = false);
    }, [inView, wasAlreadyVisible]);

    useEffect(() => {
        let name = get(room, "sidebarData.name", get(room, "sidebarData.fullName", ""));

        if (onlySpaces(name) || isEmpty(name)) {
            name = get(room, "names", "");
        }

        if (onlySpaces(name)) {
            name = get(room, "name", "");
        }

        if (onlySpaces(name) || isEmpty(name)) {
            name = get(room, "metadata.names");
        }

        if (onlySpaces(name) || isEmpty(name)) {
            name = t("pma.Desconocido");
        }

        let src = get(room, "metadata.profilePicture");

        if (isEmpty(src)) {
            src = get(room, "avatarUrl");
        }
        setRoomAvatar(src);

        setRoomName(name || "");
    }, [room]);

    /**
     * Set current room on redux
     *
     */
    const handleClick = () => {
        dispatch(showMobileChat(true));
        if (room.id === currentRoom.id) {
            return;
        } else {
            dispatch(restartCounter()); // Reset counter for shopping cart
            // Mark messages as read
            if (isEmpty(lastMessage)) {
                dispatch(setIsLoadingFirstMessage(true));
                // Let's call for more messages.
                const userId = room.id;
                const botId = get(room, "bot.id");
                const lastMessageId = null;
                const limit = 20;
                if (isEmpty(botId) || isEmpty(userId)) return;
                JelouApiV1.get(`bots/${botId}/users/${userId}/v2/history`, {
                    params: {
                        limit,
                        ...(lastMessageId ? { _id: lastMessageId } : {}),
                    },
                })
                    .then((res) => {
                        let updatedConversation = [];
                        res.data.chat.forEach((message) => {
                            updatedConversation.push({ ...parseMessage(message), roomId: userId, userId, appId: botId });
                        });
                        dispatch(addArchivedMessages(updatedConversation));
                        dispatch(setIsLoadingFirstMessage(false));
                    })
                    .catch((err) => {
                        dispatch(setIsLoadingFirstMessage(false));
                        console.error("\n\nERROR! \n\n", err);
                    });
            }
            resetBackendCountMessages(room);
        }
    };

    const resetBackendCountMessages = (room) => {
        try {
            let updatedRoom = cloneDeep(room);

            if (!isEmpty(updatedRoom.membersMetaInfo) && !isEmpty(updatedRoom.membersMetaInfo[providerId])) {
                updatedRoom = {
                    ...updatedRoom,
                    membersMetaInfo: {
                        ...updatedRoom.membersMetaInfo,
                        [providerId]: {
                            unreadMessages: 0,
                            isNew: false,
                        },
                    },
                };
            }

            dispatch(setCurrentRoom(updatedRoom));
            dispatch(updateRoom(updatedRoom));

            getUnreadMessages(room.id);
        } catch (error) {
            console.log(error);
            renderMessage(String(error), MESSAGE_TYPES.ERROR);
        }
    };

    const hour = !isEmpty(lastMessage) ? lastMessage.createdAt : null;
    const bot = bots.find((bot) => bot.id === room.appId);
    const botName = get(room, "bot.name", " -- ");
    const archivedHour = props.hour;

    const metaInfo = room?.membersMetaInfo || {};

    //get membersMetaInfo id
    const membersMetaInfo = room?.membersMetaInfo || {};

    const isNew = membersMetaInfo[providerId]?.isNew;
    const conversationStyle = `relative sm:py-2 pl-4  pr-2 flex items-center w-full ${
        isNew ? "bg-primary-1" : ""
    } cursor-pointer select-none hover:bg-hover-conversation border-btm h-28`;
    const conversationActive = "conversationActive";
    // const isNew = get(metaInfo, `${providerId}.isNew`, false) ; //

    return (
        <div className={isCurrent ? conversationActive : conversationStyle} onClick={handleClick} ref={ref}>
            <div className="flex w-full flex-col">
                <div className="relative flex flex-row items-center">
                    <span className="relative inline-block">
                        <Avatar
                            src={roomAvatar}
                            name={emojiStrip(roomName)}
                            className={`mr-3 ${isCurrent && "font-semibold"}`}
                            fgColor={isCurrent ? "white" : "#767993"}
                            size="2.438rem"
                            round={true}
                            color={isCurrent ? "#2A8BF2" : "#D7EAFF"}
                            textSizeRatio={2}
                        />
                        <div className="absolute bottom-0 right-0 -mb-1 mr-1 overflow-hidden rounded-full border-2 border-transparent">
                            <SocialIcon type={room.source} />
                        </div>
                    </span>
                    <div className="flex w-full flex-col">
                        <div className="flex items-center justify-between text-sm sm:text-base">
                            <span
                                className={` w-40 truncate text-13 font-bold sm:text-15 md:w-80 lg:w-40 xxl:w-48 ${
                                    isNew ? "text-primary-200" : "text-gray-400"
                                }`}>
                                {roomName}
                            </span>
                            <div className="mr-2 flex items-center space-x-2">
                                {isNew && (
                                    <span className="flex h-fit items-center rounded-xs bg-primary-200 px-[0.4rem] py-[1.5px]  text-xs text-white">
                                        {t("common.new")}
                                    </span>
                                )}

                                {metaInfo[providerId]?.unreadMessages > 0 && (
                                    <div className="shadow-solid flex h-6 w-6 rounded-full bg-secondary-200 text-white">
                                        <div
                                            className="text-14 flex h-full w-full items-center justify-center truncate font-semibold"
                                            style={{
                                                transform: `${
                                                    String(room?.membersMetaInfo[providerId]?.unreadMessages).replace(".", "").length > 1
                                                        ? "scale(0.65)"
                                                        : "scale(0.8)"
                                                }`,
                                            }}>
                                            {metaInfo[providerId]?.unreadMessages > 0 && metaInfo[providerId]?.unreadMessages}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="flex flex-row">
                            <MessagePreview message={lastMessage} />
                        </div>
                        {size(bot) > 1 ? (
                            <div className="bottom-0 block w-48 truncate text-10 opacity-75 sm:w-32 sm:text-11 mid:w-48">{get(bot, "name", "")}</div>
                        ) : (
                            <div className="bottom-0 block w-48 truncate text-10 opacity-75 sm:w-32 sm:text-11 mid:w-48">{botName}</div>
                        )}
                        <OriginManagedIconsChats room={room} t={t} />
                    </div>
                </div>
                <div className="absolute bottom-0 right-0 mb-1 mr-4 text-gray-400 sm:mb-3">
                    {hour && sortOrder.endsWith("chat") ? (
                        <span className="text-11 opacity-75">{dayjs(get(room, "conversation.createdAt")).format("DD-MM-YY HH:mm")}</span>
                    ) : hour ? (
                        <span className="text-11 opacity-75">{dayjs(hour).format("HH:mm")}</span>
                    ) : (
                        <svg
                            className="-ml-1 mr-3 h-5 w-5 animate-spin text-gray-400"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    )}

                    {archivedHour && <span className="text-xs font-medium text-gray-400">{dayjs(archivedHour * 1000).format("DD/MM/YY")}</span>}
                </div>
            </div>
        </div>
    );
};

export default withTranslation()(Room);
