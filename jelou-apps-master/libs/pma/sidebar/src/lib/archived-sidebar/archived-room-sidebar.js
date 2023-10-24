import dayjs from "dayjs";
import "dayjs/locale/es";
import first from "lodash/first";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import size from "lodash/size";
import trim from "lodash/trim";
import React, { useEffect, useRef, useState } from "react";
import Avatar from "react-avatar";
import Highlighter from "react-highlight-words";
import { withTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import _ from "lodash/core";

import { addArchivedMessages, setArchivedMessage, setCurrentArchivedRoom, setIsLoadingFirstMessage, showMobileChat } from "@apps/redux/store";
import { SocialIcon } from "@apps/shared/common";
import { JelouApiV1 } from "@apps/shared/modules";
import { parseMessage } from "@apps/shared/utils";
import MessagePreview from "../message-preview/message-preview-archived";

const conversationStyle =
    "relative sm:py-2 pl-4 pr-2 flex items-center w-full cursor-pointer select-none hover:bg-hover-conversation border-btm h-18 sm:h-28";
const conversationActive = "conversationActive";

const DEFAUL_URL_AVATAR = "https://s3.us-west-2.amazonaws.com/cdn.devlabs.tech/default_avatar.jpeg";

const ArchivedRoom = (props) => {
    const { room, t } = props;
    const currentArchivedRoom = useSelector((state) => state.currentArchivedRoom);
    const archivedQuerySearch = useSelector((state) => state.archivedQuerySearch);
    const archivedSearchBy = useSelector((state) => state.archivedSearchBy);
    const bots = useSelector((state) => state.bots);
    const { search = [] } = room;
    const [lastMessage, setLastMessage] = useState({});
    const dispatch = useDispatch();
    const [isCurrent, setIsCurrent] = useState(false);
    const [roomName, setRoomName] = useState("Desconocido");
    const [roomAvatar, setRoomAvatar] = useState("");
    const isMounted = useRef(null);

    const bot = bots.find((bot) => bot.id === get("room", "appId", ""));
    const botName = get(room, "bot.name", " -- ");
    const createdAt = get(room, "endAt");
    const hour = isNaN(get(room, "lastMessageAt")) ? createdAt : get(room, "lastMessageAt") * 1000;

    // Update current state when redux currentArchivedRoom is updated
    useEffect(() => {
        isMounted.current = true;

        if (!isEmpty(currentArchivedRoom)) {
            setIsCurrent(room.roomId === currentArchivedRoom.roomId);
        }
        return () => (isMounted.current = false);
    }, [currentArchivedRoom]);

    useEffect(() => {
        if (!isEmpty(search)) {
            const { text } = search[0];
            setLastMessage(text);
        }
    }, [search]);

    useEffect(() => {
        const dataRoom = get(room, "room", room);
        const nameFromSidebar = trim(get(dataRoom, "sidebarData.names")) || trim(get(dataRoom, "sidebarData.name"));
        const nameFromUser = trim(get(dataRoom, "user.name", get(dataRoom, "user.names")));
        const nameFromMetadata = trim(get(dataRoom, "metadata.names"));

        const name = nameFromSidebar || nameFromUser || nameFromMetadata || t("pma.Desconocido");

        const urlAvatar = trim(get(dataRoom, "avatarUrl"));
        const urlAvatarFromMetadata = trim(get(dataRoom, "metadata.avatarUrl"));
        const srcUrl = urlAvatarFromMetadata || urlAvatar || DEFAUL_URL_AVATAR;

        setRoomName(name);
        setRoomAvatar(srcUrl);
    }, [room]);

    /**
     * Set current room on redux
     *
     */
    const handleClick = async () => {
        const bot = bots.find((bot) => bot.id === get(room, "bot.id", ""));

        const hasEnabledEvents = get(bot, "properties.hasEnabledEvents", true);

        if (room.roomId === currentArchivedRoom.roomId) {
            return;
        } else {
            try {
                dispatch(setIsLoadingFirstMessage(true));
                // Mark messages as read
                // Let's call for more messages.
                const userId = room.id;
                const botId = get(room, "bot.id");
                const lastMessageId = null;
                const limit = 20;

                let params;

                params = {
                    limit,
                    ...(lastMessageId ? { _id: lastMessageId } : {}),
                    ...(hasEnabledEvents ? { includeEvents: true } : { includeEvents: false }),
                };

                if (archivedQuerySearch && !isEmpty(search)) {
                    const _id = first(search).id;
                    params = {
                        limit,
                        ...(hasEnabledEvents ? { events: true } : {}),
                        direction: "older_equal",
                        _id,
                    };
                }
                JelouApiV1.get(`bots/${botId}/users/${userId}/v2/history`, {
                    params,
                })
                    .then((res) => {
                        let updatedConversation = [];
                        res.data.chat.forEach((message) => {
                            updatedConversation.push({ ...parseMessage(message), roomId: userId, userId, appId: botId });
                        });
                        if (archivedQuerySearch) {
                            dispatch(setArchivedMessage(updatedConversation));
                        } else {
                            dispatch(addArchivedMessages(updatedConversation));
                        }
                        dispatch(setIsLoadingFirstMessage(false));
                        dispatch(showMobileChat());
                    })
                    .catch((err) => {
                        console.error("\n\nERROR! \n\n", err);
                    });
                dispatch(setCurrentArchivedRoom(room));
            } catch (err) {
                console.log(err);
                dispatch(setIsLoadingFirstMessage(false));
            }
        }
    };
    const splitQuery = archivedQuerySearch.split(" ");
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    return (
        <div className={isCurrent && !isMobile ? conversationActive : conversationStyle} onClick={handleClick}>
            <div className="flex w-full flex-col">
                <div className="relative flex flex-row items-center">
                    <span className="relative inline-block">
                        <div className="relative">
                            <Avatar
                                src={roomAvatar}
                                name={""}
                                className={`mr-3 ${isCurrent && "font-semibold"}`}
                                fgColor={isCurrent ? "white" : "#767993"}
                                size="2.438rem"
                                round={true}
                                color={isCurrent ? "#2A8BF2" : "#D7EAFF"}
                                textSizeRatio={2}
                            />
                            <div className="absolute bottom-0 right-0 -mb-1 mr-1 overflow-hidden rounded-full border-2 border-transparent">
                                <SocialIcon type={get(room, "bot.type")} />
                            </div>
                        </div>
                    </span>
                    <div className="flex w-full flex-col">
                        <div className="flex items-center justify-between text-sm sm:text-base">
                            <span
                                className={`text-gray-400 ${
                                    roomName.length > 35 ? "w-56 truncate mid:w-48 2xl:w-56" : ""
                                } text-sm font-bold sm:text-15`}>
                                {!isEmpty(archivedQuerySearch) && get(archivedSearchBy, "searchBy") === "from.names" ? (
                                    <Highlighter
                                        highlightClassName="YourHighlightClass"
                                        searchWords={splitQuery.length > 1 ? splitQuery : [archivedQuerySearch]}
                                        autoEscape={true}
                                        textToHighlight={roomName}
                                    />
                                ) : (
                                    roomName
                                )}
                            </span>
                        </div>
                        <div className="flex flex-row">
                            <MessagePreview message={lastMessage} search={search[0]} query={archivedQuerySearch} />
                        </div>
                        {size(bot) > 1 ? (
                            <div className="block w-48 truncate text-11 opacity-75 sm:w-32 sm:text-xs mid:w-48">{get(bot, "name", "")}</div>
                        ) : (
                            <div className="block w-48 truncate text-11 opacity-75 sm:w-32 sm:text-xs mid:w-48">{botName}</div>
                        )}
                    </div>
                </div>
                <div className="absolute bottom-0 right-0 mb-3 mr-4 text-xs font-medium">
                    {hour && <span className="text-xs opacity-75">{dayjs(hour).format("DD/MM/YY")}</span>}
                </div>
            </div>
        </div>
    );
};

export default withTranslation()(ArchivedRoom);
