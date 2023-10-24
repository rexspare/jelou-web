/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef, useCallback, useContext } from "react";
import Avatar from "react-avatar";
import emojiStrip from "emoji-strip";

import isEmpty from "lodash/isEmpty";
import toUpper from "lodash/toUpper";
import toLower from "lodash/toLower";
import isObject from "lodash/isObject";
import get from "lodash/get";

import "dayjs/locale/es";
import { useSelector, useDispatch } from "react-redux";
import { withTranslation } from "react-i18next";

import {
    setCurrentRoomClients,
    addClientsMessages,
    addOperatorsHistory,
    unsetOperatorsHistory,
    setStoredParams,
    unsetStoredParams,
    isScrollingDown,
} from "@apps/redux/store";

import Highlighter from "react-highlight-words";
import { DashboardServer } from "@apps/shared/modules";
import { SocialIcon } from "@apps/shared/common";
import { DateContext } from "@apps/context";
const conversationStyle =
    "relative sm:py-2 pl-4 pr-2 flex items-center w-full cursor-pointer select-none hover:bg-conversation border-b-1 border-gray-100 border-opacity-25 h-18 sm:h-24";
const conversationActive = "conversationActive";

const MessagePreview = (props) => {
    const { message } = props;
    if (!message) {
        return <span></span>;
    }
    const type = get(message, "type", "");
    const text = get(message, "text", "");

    if (isObject(message.text)) {
        return <span className="block w-48 truncate text-sm font-medium text-gray-400 sm:w-32 lg:w-56 xxl:w-64">Invalid Message</span>;
    }

    try {
        switch (toUpper(type)) {
            case "TEXT":
                const truncate_user = `${text.length > 20 ? "w-40 xl:w-48" : ""} truncate text-13 sm:text-sm block text-gray-400 font-medium`;

                return props.field[0] === "text" ? (
                    <div className={`${truncate_user}`}>
                        <Highlighter highlightClassName="YourHighlightClass" searchWords={[props.query]} autoEscape={true} textToHighlight={text} />
                    </div>
                ) : (
                    <div className={`${truncate_user}`}>{text}</div>
                );
            default:
                return (
                    <span className="mb-1 block w-48 truncate text-13 font-medium capitalize text-gray-400 sm:w-32 lg:w-56 xxl:w-64">
                        {toLower(message.type)}
                    </span>
                );
        }
    } catch (error) {
        return null;
    }
};

const Room = (props) => {
    const { room, setIsLoadingMessage, query, field, selectedOptions, setLoadingOperators, date } = props;
    const dayjs = useContext(DateContext);
    const dispatch = useDispatch();
    const [isCurrent, setIsCurrent] = useState(false);
    const [previewMessage, setPreviewMessage] = useState({});
    const isMounted = useRef(null);
    const [roomAvatar, setRoomAvatar] = useState("");
    const [name, setName] = useState("");
    const metadata = get(room, "metadata", []);
    const currentRoomClients = useSelector((state) => state.currentRoomClients);
    const messages = useSelector((state) => state.clientsMessages);
    const globalSearchMessage = useSelector((state) => state.globalSearchMessage);
    const company = useSelector((state) => state.company);

    // Update current state when redux currentRoomClients is updated
    useEffect(() => {
        isMounted.current = true;

        if (!isEmpty(currentRoomClients)) {
            setIsCurrent(room._id === currentRoomClients._id);
        }

        return () => (isMounted.current = false);
    }, [currentRoomClients]);

    const getRoomLastMessage = useCallback(() => {
        setPreviewMessage(room.previewMessage);
    }, [room]);

    // Update lastMessage when messages or rooms is updated
    useEffect(() => {
        isMounted.current = true;

        getRoomLastMessage();
        return () => (isMounted.current = false);
    }, [room, messages, getRoomLastMessage]);

    useEffect(() => {
        getName();
        let src = get(metadata, "profilePicture");

        if (isEmpty(src)) {
            src = get(room, "avatarUrl");
        }

        if (isEmpty(src)) {
            src = "https://s3.us-west-2.amazonaws.com/cdn.devlabs.tech/default_avatar.jpeg";
        }
        setRoomAvatar(src);
    }, [room]);

    const getName = () => {
        let name = [];
        name = isEmpty(get(room, "names", ""))
            ? isEmpty(get(room, "metadata.names", ""))
                ? "Desconocido"
                : get(room, "metadata.names", "")
            : get(room, "names", "");
        setName(name);
    };

    const handleClick = async () => {
        if (room._id === currentRoomClients._id) {
            return;
        } else {
            getMessages();
            getOperators();
            getStoredParams();
            dispatch(setCurrentRoomClients(room));
            dispatch(isScrollingDown(true));
        }
    };

    useEffect(() => {
        if (!isEmpty(selectedOptions["operators"]) && !isEmpty(currentRoomClients)) {
            getOperators();
        }
    }, [selectedOptions["operators"]]);

    const getMessages = async () => {
        const roomId = get(room, "id", "");
        const messageId = get(room, "messageId", "");
        let [startAt, endAt] = date;
        startAt = dayjs(startAt).format();
        endAt = dayjs(endAt).endOf("day").format();
        setIsLoadingMessage(true);
        try {
            const { data } = await DashboardServer.get(`/clients/rooms/${roomId}/messages?`, {
                params: {
                    ...(globalSearchMessage ? { messageId } : {}),
                    ...(globalSearchMessage ? { scroll: ["previous"] } : {}),
                    startAt,
                    endAt,
                },
            });
            if (!isEmpty(data)) {
                const message = get(data, "rows", []);
                dispatch(addClientsMessages(message));
            }
            setIsLoadingMessage(false);
        } catch (err) {
            console.log(err);
            setIsLoadingMessage(false);
        }
    };

    const getOperators = async (page = 1, limit = 10, conversationId = "", startAt = "", endAt = "") => {
        const roomId = get(room, "id");
        const operatorId = selectedOptions["operators"];
        setLoadingOperators(true);
        try {
            const { data } = await DashboardServer.get(`/clients/rooms/${roomId}/operators?`, {
                params: {
                    page: page,
                    limit: limit,
                    ...(!isEmpty(startAt) ? { startAt } : {}),
                    ...(!isEmpty(endAt) ? { endAt } : {}),
                    ...(!isEmpty(conversationId) ? { conversationId } : {}),
                    ...(!isEmpty(operatorId) ? { userId: operatorId } : {}),
                },
            });
            if (!isEmpty(data)) {
                let operatorsHistory = data.map((operator) => {
                    return { ...operator, isSelected: false };
                });
                operatorsHistory = operatorsHistory.sort(function (a, b) {
                    return dayjs(b.date).format("DD/MM/YYYY hh:mm:ss") - dayjs(a.date).format("DD/MM/YYYY hh:mm:ss");
                });
                dispatch(addOperatorsHistory(operatorsHistory));
            } else {
                dispatch(unsetOperatorsHistory());
            }
            setLoadingOperators(false);
        } catch (err) {
            setLoadingOperators(false);
            console.log(err);
        }
    };

    const getStoredParams = async () => {
        const roomId = get(room, "id");
        const { referenceId } = room;
        const { botId } = room;
        const companyId = get(company, "id");
        try {
            const { data } = await DashboardServer.get(`/clients/rooms/${roomId}/information?`, {
                params: {
                    referenceId,
                    botId,
                    companyId,
                },
            });
            if (!isEmpty(data)) {
                const { results } = data;
                dispatch(setStoredParams(results));
            } else {
                dispatch(unsetStoredParams());
            }
        } catch (err) {
            console.log(err);
        }
    };

    const hour = !isEmpty(previewMessage) ? previewMessage.createdAt : null;

    return (
        <div className={isCurrent ? conversationActive : conversationStyle} onClick={handleClick}>
            <div className="flex w-full flex-col">
                <div className="relative flex flex-row items-center">
                    <span className="relative inline-block">
                        <div className="relative">
                            <Avatar
                                src={roomAvatar}
                                name={emojiStrip(name)}
                                className={`mr-3 `}
                                fgColor={"#767993"}
                                size="2.438rem"
                                round={true}
                                color={"#D7EAFF"}
                                textSizeRatio={2}
                            />
                            <div className="absolute bottom-0 right-0 -mb-1 mr-1 overflow-hidden rounded-full border-2 border-transparent">
                                <SocialIcon type={get(room, "Bot.type", "")} />
                            </div>
                        </div>
                    </span>
                    <div className="flex w-full flex-col space-y-1">
                        <div className="flex items-center justify-between text-sm sm:text-15">
                            {field[0] === "client" ? (
                                <Highlighter highlightClassName="YourHighlightClass" searchWords={[query]} autoEscape={true} textToHighlight={name} />
                            ) : (
                                <span className={`md:w:72 truncate font-semibold text-gray-400`}>{name}</span>
                            )}
                        </div>
                        <div className="flex flex-row">
                            <div className="mb-1 flex flex-row items-center">
                                <span className="block w-48 truncate text-xs font-light capitalize text-gray-400 sm:w-32 lg:w-56 xxl:w-64">
                                    <MessagePreview message={previewMessage} query={query} field={field} />
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="absolute bottom-0 right-0 mb-1 mr-3 sm:mb-1">
                    {hour && <span className="text-11 text-gray-400">{dayjs(hour).format("DD-MM-YY HH:mm")}</span>}
                </div>
            </div>
        </div>
    );
};

export default withTranslation()(Room);
