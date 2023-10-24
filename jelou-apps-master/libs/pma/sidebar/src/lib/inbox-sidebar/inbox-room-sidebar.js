import React, { useState, useEffect, useContext } from "react";
import Avatar from "react-avatar";
import emojiStrip from "emoji-strip";
import { useInView } from "react-intersection-observer";

import sortBy from "lodash/sortBy";
import isEmpty from "lodash/isEmpty";
import size from "lodash/size";
import get from "lodash/get";

import dayjs from "dayjs";
import "dayjs/locale/es";
import { useSelector, useDispatch } from "react-redux";
import { setCurrentRoom, setLoading, showMobileChat, addMessages, updateRoom } from "@apps/redux/store";
import { parseMessage } from "@apps/shared/utils";
import { ChatManagerContext } from "@apps/pma/context";

import { JelouApiV1 } from "@apps/shared/modules";
import { SocialIcon } from "@apps/shared/common";
import MessagePreview from "../message-preview/message-preview-inbox";
import { withTranslation } from "react-i18next";

const conversationStyle =
    "relative sm:py-2 pl-4 pr-2 flex items-center w-full cursor-pointer select-none hover:bg-hover-conversation border-btm border-rght h-18 sm:h-28";
const conversationActive = "conversationActive";

const InboxRoomSidebar = (props) => {
    const { room, key, t } = props;
    const dispatch = useDispatch();
    const [lastMessage, setLastMessage] = useState({});
    const [isCurrent, setIsCurrent] = useState(false);
    const [wasAlreadyVisible, setWasAlreadyVisible] = useState(false);
    const [roomName, setRoomName] = useState("");
    const [roomAvatar, setRoomAvatar] = useState("");

    const messages = useSelector((state) => state.messages);
    const currentRoom = useSelector((state) => state.currentRoom);
    const bots = useSelector((state) => state.bots);

    const { chatManager } = useContext(ChatManagerContext);

    const [ref, inView] = useInView({
        /* Optional options */
        threshold: 0,
    });

    // Update lastMessage when messages or rooms is updated
    useEffect(() => {
        getRoomLastMessage();
    }, [room, messages, getRoomLastMessage]);

    // Update current state when redux currentRoom is updated
    useEffect(() => {
        setIsCurrent(room.id === currentRoom.id);
    }, [currentRoom, room.id]);

    useEffect(() => {
        if (inView && !wasAlreadyVisible) {
            setWasAlreadyVisible(true);
            getRoomMessages();
        }
    }, [inView, wasAlreadyVisible]);

    useEffect(() => {
        const name = get(room, "name", "");
        setRoomName(isEmpty(name) ? t("pma.Desconocido") : name);
    }, [room]);

    useEffect(() => {
        const name = get(room, "name", "");
        setRoomName(isEmpty(name) ? t("pma.Desconocido") : name);
    }, [room]);

    useEffect(() => {
        let src = get(room, "metadata.profilePicture");

        if (isEmpty(src)) {
            src = get(room, "avatarUrl");
        }

        if (isEmpty(src)) {
            src = "https://s3.us-west-2.amazonaws.com/cdn.devlabs.tech/default_avatar.jpeg";
        }
        setRoomAvatar(src);
    }, [room]);

    /**
     * Fetch messages when a component becames visible
     */
    function getRoomMessages() {
        // Do not run this if is from Archived
        if (!props.fromArchived) {
            const options = { lastMessageId: null, userId: room.senderId, botId: room.appId || room.botId, limit: 20 };
            dispatch(
                updateRoom({
                    ...room,
                    fetchingMessages: true,
                })
            );
            chatManager
                .getRoomMessages(room.id, options)
                .then((messages) => {
                    dispatch(addMessages(messages));
                    dispatch(
                        updateRoom({
                            ...room,
                            fetchingMessages: false,
                        })
                    );
                })
                .catch((error) => {
                    console.error(error);
                    dispatch(
                        updateRoom({
                            ...room,
                            fetchingMessages: false,
                        })
                    );
                });
        }
    }

    /**
     * Get last message from a room to preview
     *
     */
    function getRoomLastMessage() {
        const roomMessages = messages.filter((message) => message.roomId === room.id);

        const sortedMessages = sortBy(roomMessages, (data) => {
            return new Date(data.createdAt * 1000);
        });

        const message = sortedMessages.pop();
        if (message) {
            setLastMessage(message);
        }
    }

    /**
     * Set current room on redux
     *
     */
    const handleClick = () => {
        const bot = bots.find((bot) => bot.id === get(currentRoom, "appId", ""));

        const hasEnabledEvents = get(bot, "properties.hasEnabledEvents", true);

        dispatch(showMobileChat());
        if (room.id === currentRoom.id) {
            return;
        } else {
            // Mark messages as read
            if (isEmpty(lastMessage)) {
                // dispatch(setLoading(true));
                // Let's call for more messages.
                const userId = room.id;
                const botId = get(room, "bot.id");
                const lastMessageId = null;
                const limit = 20;

                JelouApiV1.get(`bots/${botId}/users/${userId}/v2/history`, {
                    params: {
                        limit,
                        ...(lastMessageId ? { _id: lastMessageId } : {}),
                        ...(hasEnabledEvents ? { includeEvents: true } : { includeEvents: false }),
                    },
                })
                    .then((res) => {
                        let updatedConversation = [];
                        res.data.chat.forEach((message) => {
                            updatedConversation.push({ ...parseMessage(message), roomId: userId, userId, appId: botId });
                        });
                        props.addArchivedMessages(updatedConversation);
                        // dispatch(setLoading(false));
                    })
                    .catch((err) => {
                        // dispatch(setLoading(false));
                        console.error("\n\nERROR! \n\n", err);
                    });
            }
            dispatch(setCurrentRoom(room));
        }
    };

    const hour = !isEmpty(lastMessage) ? lastMessage.createdAt : null;
    const bot = bots.find((bot) => bot.id === room.appId);
    const botName = get(room, "bot.name", " -- ");

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
                            <SocialIcon type={get(room, "source")} />
                        </div>
                    </span>

                    <div className="flex w-full flex-col">
                        <div className="flex items-center justify-between text-sm sm:text-base">
                            <span
                                className={`text-gray-400 ${
                                    roomName.length > 35 ? "w-88 truncate lg:w-48 xxl:w-56" : ""
                                } text-13 font-bold sm:text-15`}>
                                {roomName}
                            </span>
                        </div>
                        <div className="flex flex-row">
                            <MessagePreview message={lastMessage} />
                        </div>
                        {size(bot) > 1 ? (
                            <div className="text-9 bottom-0 block w-48 truncate opacity-75 sm:w-32 sm:text-10 mid:w-48">{get(bot, "name", "")}</div>
                        ) : (
                            <div className="text-9 bottom-0 block w-48 truncate opacity-75 sm:w-32 sm:text-10 mid:w-48">{botName}</div>
                        )}
                    </div>
                </div>
                <div className="absolute bottom-0 right-0 mr-4 sm:mb-3">
                    {hour && <span className="text-10 opacity-75">{dayjs(hour).format("HH:mm")}</span>}
                    {props.hour && <span className="text-10 opacity-75">{dayjs(props.hour * 1000).format("DD/MM/YY")}</span>}
                </div>
            </div>
        </div>
    );
};

export default withTranslation()(InboxRoomSidebar);
