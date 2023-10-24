import "dayjs/locale/es";
import dayjs from "dayjs";
import get from "lodash/get";
import first from "lodash/first";
import sortBy from "lodash/sortBy";
import isEmpty from "lodash/isEmpty";
import { useDispatch, useSelector } from "react-redux";
import React, { useContext, useEffect, useRef, useState } from "react";
import reverse from "lodash/reverse";

import { Bubbles } from "@apps/pma/bubbles";
import { addMessages, addArchivedMessages, setIsLoadingMessages } from "@apps/redux/store";
import { JelouApiV1 } from "@apps/shared/modules";
import { parseMessage } from "@apps/shared/utils";
import { ChatManagerContext } from "@apps/pma/context";
import { usePrevious } from "@apps/shared/hooks";

const TimelineChat = (props) => {
    const { currentRoom, className, messages, getArchived = false, inbox = false } = props;
    const timeline = useRef(null);
    const dispatch = useDispatch();
    const { ChatManager: context } = useContext(ChatManagerContext);

    const [isFetchingEarlierMessages, setIsFetchingEarlierMessages] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [message, setMessage] = useState("");
    const [goDown, setGoDown] = useState(true);

    const archivedQuerySearch = useSelector((state) => state.archivedQuerySearch);
    const bots = useSelector((state) => state.bots);

    const prevCurrentRoom = usePrevious(currentRoom);
    const prevMessages = usePrevious(messages);

    //componentDidMount
    useEffect(() => {
        if (archivedQuerySearch) {
            const position = timeline.current.scrollHeight - timeline.current.clientHeight - 20;
            scrollContent("auto", position);
        } else {
            const scrollHeight = timeline.current.scrollHeight;
            timeline.current.scrollTop = scrollHeight;
        }

        markAsRead();
    }, []);

    //componentDidUpdate
    useEffect(() => {
        const isDiferentRoom = prevCurrentRoom?.id !== currentRoom?.id;

        if (isDiferentRoom) {
            timeline.current.scrollBy({ top: 99999, left: 0, behavior: "auto" });
            if (archivedQuerySearch) {
                const position = timeline.current.scrollHeight - timeline.current.clientHeight - 20;
                scrollContent("auto", position);
            }
            markAsRead();
        } else if (prevMessages?.length < messages.length && !isFetchingEarlierMessages) {
            if (!archivedQuerySearch) {
                scrollContent("smooth");
            }
        }
    }, [currentRoom, messages, isFetchingEarlierMessages]);

    const scrollContent = (behavior = "auto", position = null) => {
        let scrollHeight;
        scrollHeight = position || Math.round(timeline.current.scrollHeight);
        timeline.current.scrollBy({ top: scrollHeight, left: 0, behavior });
    };

    const markAsRead = () => {
        try {
            if (context) {
                context.setReadCursor({
                    roomId: currentRoom?.id || currentRoom?._id,
                });
            }
        } catch (error) {
            console.log("Error", error);
        }
    };

    const isValidDate = (d) => {
        return d instanceof Date && !isNaN(d);
    };

    const openNewChat = (message) => {
        setOpenModal(true);
        setMessage(message);
    };

    const closeModal = () => {
        setOpenModal(false);
    };

    const getPreviousMessage = (roomId, options) => {
        const bot = bots.find((bot) => bot.id === get(currentRoom, "bot.id", ""));

        const hasEnabledEvents = get(bot, "properties.hasEnabledEvents", true);
        return context
            .getEarlierMessages(roomId, options, hasEnabledEvents)
            .then((res = []) => {
                res = res.map((dat) => {
                    return { ...dat, id: dat._id };
                });
                return res;
            })
            .catch((err) => {
                console.log("error!", err);
                return err;
            });
    };

    const getEarlierMessage = () => {
        const sortedMessages = sortBy(messages, (data) => {
            const fecha = new Date(data.createdAt);
            if (isValidDate(fecha)) {
                return new Date(data.createdAt);
            } else {
                return new Date(data.createdAt);
            }
        });

        return first(sortedMessages);
    };

    const getLastMessages = () => {
        const sortedMessages = reverse(
            sortBy(messages, (data) => {
                const fecha = new Date(data.createdAt);
                if (isValidDate(fecha)) {
                    return new Date(data.createdAt);
                } else {
                    return new Date(data.createdAt);
                }
            })
        );
        return first(sortedMessages);
    };

    const onScroll = async (evt) => {
        try {
            const target = evt.target;

            if (messages?.length === 0) {
                return;
            }

            if (target.scrollTop === 0) {
                dispatch(setIsLoadingMessages(true));

                setIsFetchingEarlierMessages(true);

                let earlierMessage = getEarlierMessage();
                earlierMessage = {
                    ...earlierMessage,
                    id: earlierMessage.id || earlierMessage._id,
                };

                // Get messages from provider
                let messages;
                const prevScrollHeight = target.scrollHeight;

                let options;
                const { id } = currentRoom;
                const senderId = get(currentRoom, "senderId", get(currentRoom, "user.id", null));
                const appId = get(currentRoom, "bot.id", currentRoom?.appId);

                options = {
                    lastMessageId: earlierMessage._id,
                    userId: senderId,
                    botId: appId,
                    limit: 20,
                };

                if (getArchived) {
                    try {
                        messages = await getPreviousMessage(currentRoom?.roomId, options);

                        if (!isEmpty(messages)) {
                            messages = messages.map((message) => {
                                return { ...message, messageId: id, id: message._id, roomId: senderId };
                            });
                            dispatch(addArchivedMessages(messages));
                        }
                    } catch (error) {
                        console.log(error);
                    }
                } else {
                    messages = await getPreviousMessage(id, options);
                    dispatch(addMessages(messages));
                }

                dispatch(setIsLoadingMessages(false));

                try {
                    timeline.current.scrollBy({
                        top: target.scrollHeight - prevScrollHeight,
                        left: 0,
                        behavior: "auto",
                    });
                } catch (error) {
                    console.log("error ", error);
                }
                setIsFetchingEarlierMessages(false);
            }

            const bottom = target.scrollHeight - target.scrollTop === target.clientHeight;
            if (bottom && archivedQuerySearch && goDown) {
                dispatch(setIsLoadingMessages(true));

                const userId = currentRoom?.id;
                const botId = get(currentRoom, "bot.id");
                const bot = bots.find((bot) => bot.id === botId);
                const hasEnabledEvents = get(bot, "properties.hasEnabledEvents", true);

                let lastMessages = getLastMessages();
                lastMessages = {
                    ...lastMessages,
                    id: lastMessages._id,
                };
                const { id } = lastMessages;

                const params = {
                    limit: 10,
                    ...(hasEnabledEvents ? { events: true } : {}),
                    direction: "newer",
                    _id: id,
                };

                JelouApiV1.get(`bots/${botId}/users/${userId}/v2/history`, {
                    params,
                })
                    .then((res) => {
                        let updatedConversation = [];
                        const chat = get(res, "data.chat");
                        if (!isEmpty(chat)) {
                            chat.forEach((message) => {
                                updatedConversation.push({ ...parseMessage(message), roomId: userId, userId, appId: botId });
                            });
                            dispatch(addArchivedMessages(updatedConversation));
                        } else {
                            setGoDown(false);
                        }
                        dispatch(setIsLoadingMessages(false));
                    })
                    .catch((err) => {
                        dispatch(setIsLoadingMessages(false));

                        console.error("\n\nERROR! \n\n", err);
                    });
            }
        } catch (err) {
            console.log(err);
        }
    };

    const sortedMessages = sortBy(messages, (data) => {
        return dayjs(data.createdAt);
    });

    return (
        <Bubbles
            sortedMessages={sortedMessages}
            className={className}
            timeline={timeline}
            handleScroll={onScroll}
            openNewChat={openNewChat}
            openModal={openModal}
            message={message}
            closeModal={closeModal}
            inbox={inbox || false}
        />
    );
};

export default TimelineChat;
