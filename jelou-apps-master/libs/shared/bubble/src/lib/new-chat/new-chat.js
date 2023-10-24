import dayjs from "dayjs";
import Fuse from "fuse.js";
import get from "lodash/get";
import omit from "lodash/omit";
import ReactDOM from "react-dom";
import Avatar from "react-avatar";
import { v4 as uuidv4 } from "uuid";
import isEmpty from "lodash/isEmpty";
import orderBy from "lodash/orderBy";
import toUpper from "lodash/toUpper";
import { withTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import React, { useState, useEffect, useRef } from "react";

import SearchRooms from "./SearchRooms";
import { JelouApiV1 } from "@apps/shared/modules";
import { addMessage, setCurrentRoom } from "@apps/redux/store";
import { useOnClickOutside } from "@apps/shared/hooks";
import { CloseIcon, SendIconReplies } from "@apps/shared/icons";
import { SocialIcon } from "@apps/shared/common";

const NewChat = (props) => {
    const { closeModal, t } = props;
    const currentRoom = useSelector((state) => state.currentRoom);
    const rooms = useSelector((state) => state.rooms);
    const bots = useSelector((state) => state.bots);
    const [success, setSuccess] = useState(false);
    const dispatch = useDispatch();
    const [query, setQuery] = useState("");

    const fuseOptions = {
        shouldSort: true,
        threshold: 0.25,
        location: 0,
        caseSensitive: false,
        distance: 100,
        maxPatternLength: 32,
        minMatchCharLength: 1,
        keys: ["name", "names", "senderId", "user.id", "bot.name", "bot.type", "bot.channel", "bot.channelProvider"],
    };

    const ref = useRef();

    useOnClickOutside(ref, closeModal);

    const handler = (e) => {
        if (e.keyCode === 27) {
            closeModal();
        }
    };

    useEffect(() => {
        document.addEventListener("keyup", handler);
        return () => {
            document.removeEventListener("keyup", handler);
        };
    }, []);

    const company = useSelector((state) => state.company);
    const inboxName = get(company, "properties.inboxName", "Inbox");

    const { section } = useParams();

    const findRoom = ({ target }) => {
        const { value } = target;
        setQuery(value);
    };

    const getFilteredRooms = () => {
        if (isEmpty(query)) {
            return rooms;
        }
        const fuse = new Fuse(rooms, fuseOptions);
        const result = fuse.search(query);
        let room = [];
        result.map((rooms) => {
            return room.push(rooms.item);
        });
        return room;
    };

    const filteredRooms = getFilteredRooms();
    const roomsSearch = orderBy(filteredRooms);

    const sendCustomText = async (message, roomId, senderId, shouldNotBeSent = true, appId, props, room) => {
        try {
            const by = "operator";
            const source = get(currentRoom, "source", room.source);
            let messageData;
            let mess = message.message;
            switch (toUpper(message.message.type)) {
                case "TEXT":
                    messageData = {
                        appId,
                        senderId,
                        by,
                        source,
                        roomId,
                        message: {
                            type: "TEXT",
                            text: message.message.text,
                        },
                        createdAt: dayjs().valueOf(),
                    };
                    break;
                case "IMAGE":
                    messageData = {
                        appId,
                        senderId,
                        by,
                        source,
                        roomId,
                        message: {
                            type: "IMAGE",
                            mediaUrl: message.message.mediaUrl,
                            caption: get(message, "message.caption", ""),
                            mimeType: message.message.mimeType,
                        },
                        createdAt: dayjs().valueOf(),
                    };
                    break;
                case "DOCUMENT":
                    messageData = {
                        appId,
                        senderId,
                        sid: senderId,
                        by,
                        source,
                        roomId,
                        message: {
                            type: "DOCUMENT",
                            mediaUrl: message.message.mediaUrl,
                            mimeType: message.message.mimeType,
                            caption: get(message, "message.caption", ""),
                        },
                        createdAt: dayjs().valueOf(),
                    };
                    break;
                case "LOCATION":
                    messageData = {
                        appId,
                        senderId,
                        by,
                        source,
                        roomId,
                        message: {
                            type: "LOCATION",
                            lat: Number(message.message.lat),
                            lng: Number(message.message.lng),
                        },
                        createdAt: dayjs().valueOf(),
                    };
                    break;
                case "AUDIO":
                    messageData = {
                        appId,
                        senderId,
                        by,
                        source,
                        roomId,
                        message: {
                            type: "AUDIO",
                            mediaUrl: message.message.mediaUrl,
                            mimeType: message.message.mimeType,
                        },
                        createdAt: dayjs().valueOf(),
                    };
                    break;
                case "VIDEO":
                    messageData = {
                        appId,
                        senderId,
                        by,
                        source,
                        roomId,
                        message: {
                            type: "VIDEO",
                            mediaUrl: message.message.mediaUrl,
                            mediaKey: message.message.mediaKey,
                            mimeType: message.message.mimeType,
                        },
                        createdAt: dayjs().valueOf(),
                    };
                    break;
                default:
                    break;
            }

            successMessage();

            if (toUpper(message.message.type) === "LOCATION") {
                mess = {
                    ...mess,
                    coordinates: {
                        lat: Number(message.message.lat),
                        long: Number(message.message.lng),
                    },
                };
            }

            //SEND MESSAGE
            const formMessage = {
                ...messageData,
                botId: appId,
                userId: senderId,
                bubble: mess,
                id: uuidv4(),
            };

            // Add message to Redux
            dispatch(addMessage(formMessage));

            // Send message to server
            JelouApiV1.post(`/operators/message`, omit(formMessage, ["source"])).catch((error) => {
                console.error("Error on send message", error.response);
            });

            if ((room.type === "COMPANY" && section === "inbox") || (room.type !== "COMPANY" && section === "chats")) {
                setTimeout(() => {
                    props.closeModal();
                }, 1000);
            }

            setTimeout(() => {
                props.closeModal();
            }, 2000);

            setTimeout(() => {
                dispatch(setCurrentRoom(room));
                if (room.type === "COMPANY") {
                    if (section === "inbox") {
                        return;
                    }
                    window.location = "/inbox";
                } else {
                    if (section === "chats") {
                        return;
                    }
                    window.location = "/chats";
                }
            }, 1000);
        } catch (error) {
            console.log(error);
            props.closeModal();
        }
    };

    const handleClick = (senderId, botId, groupId, room) => {
        const shouldNotBeSent = false;
        sendCustomText(props.message, groupId, senderId, shouldNotBeSent, botId, props, room);
    };

    const successMessage = () => {
        setSuccess(true);
    };
    const getBotName = (botId) => {
        const bot = bots.find((el) => el.id === botId);
        return get(bot, "name", "- -");
    };

    return ReactDOM.createPortal(
        <div className="fixed inset-x-0 top-0 z-100 overflow-auto px-4 pt-8 sm:inset-0 sm:flex sm:items-center sm:justify-center sm:p-0">
            <div className="fixed inset-0 transition-opacity">
                <div className="absolute inset-0 z-20 bg-gray-490/75" />
            </div>
            <div
                className="relative max-h-content-mobile transform overflow-y-auto rounded-xl bg-white pb-4 shadow-modal transition-all sm:max-h-content sm:min-w-350 md:min-w-84 md:max-w-xl md:overflow-y-auto"
                ref={ref}>
                <header className="bg-primary-30 px-4 py-3 text-primary-200 sm:px-8">
                    <span className="absolute right-0 top-0 mr-6 pt-5" onClick={() => closeModal()}>
                        <CloseIcon className="cursor-pointer fill-current text-gray-400 text-opacity-30" width="1rem" height="1rem" />
                    </span>
                    <div className="flex items-center">
                        <SendIconReplies width="2rem" className="mr-3 fill-current text-primary-200" />
                        <div className="flex flex-col">
                            <div className="font-bold leading-relaxed md:text-xl">{t("pma.Reenviar mensaje")}</div>
                            <div className="text-15 font-medium text-opacity-10">
                                {t("pma.Selecciona la persona a la que deseas reenviar el mensaje")}
                            </div>
                        </div>
                    </div>
                </header>
                <div className="px-4 sm:px-8">
                    <SearchRooms findRoom={findRoom} />
                </div>
                <div className="flex flex-col">
                    {isEmpty(roomsSearch) ? (
                        <div className="pb-4 text-center font-light text-gray-400">
                            {t("pma.No hay destinatarios disponibles para reenviar el mensaje")}
                        </div>
                    ) : (
                        <>
                            {success && (
                                <div className="mb-4 px-6">
                                    <p className="bg-green-light flex items-center rounded-lg px-3 py-2 font-medium text-white">
                                        {"Tu mensaje ha sido enviado correctamente."}
                                    </p>
                                </div>
                            )}
                            <div className="h-58 block overflow-y-scroll">
                                {roomsSearch.map((room, index) => {
                                    return (
                                        <div
                                            className="relative flex w-full cursor-pointer select-none items-center justify-between space-x-1 border-b-default border-gray-100 border-opacity-25 px-8 py-4 hover:bg-[#E5F7F9]"
                                            onClick={() => handleClick(room.senderId, room.appId, room.id, room)}
                                            key={index}>
                                            <div className="relative">
                                                <Avatar
                                                    src={"https://s3.us-west-2.amazonaws.com/cdn.devlabs.tech/default_avatar.jpeg"}
                                                    name={isEmpty(room.names) ? get(room, "name", "") : room.names}
                                                    className="mr-3 font-semibold"
                                                    size="2.438rem"
                                                    round={true}
                                                    color="#2A8BF2"
                                                    textSizeRatio={2}
                                                />
                                                <div className="absolute bottom-0 right-0 -mb-1 mr-1 overflow-hidden rounded-full border-2 border-transparent">
                                                    <SocialIcon type={get(room, "source", "")} />
                                                </div>
                                            </div>
                                            <div className="relative w-conversation">
                                                <div className="flex flex-col justify-between">
                                                    <div className={`text-bold font-medium`}>
                                                        <span className="text-base font-bold text-gray-400">
                                                            {isEmpty(room.names) ? get(room, "name", "") : room.names} - {getBotName(room.appId)}
                                                        </span>
                                                    </div>
                                                    <div className={`text-sm text-gray-400`}>
                                                        <span>{room.senderId.replace("@c.us", "")}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="relative">
                                                <span
                                                    className={`inline-flex w-fit items-center justify-center rounded-full px-2.5 py-0.5 text-xs font-bold uppercase ${
                                                        room.type === "COMPANY"
                                                            ? "bg-[rgba(247,188,170,0.5)] text-[rgba(168,57,39,1)]"
                                                            : "bg-[rgba(0,162,207,0.15)] text-[rgba(0,162,207,1)]"
                                                    } `}>
                                                    {room.type === "COMPANY" ? inboxName : t("pma.cliente")}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </>
                    )}
                    <div className="bg-modal-footer mt-0 flex w-full items-center justify-center rounded-b-lg pt-2 md:pt-8">
                        <button
                            className="mr-4 flex w-32 justify-center rounded-3xl border-transparent bg-gray-10 px-5 py-3 font-bold text-gray-400 focus:outline-none"
                            onClick={closeModal}>
                            {t("pma.Cerrar")}
                        </button>
                    </div>
                </div>
            </div>
        </div>,
        document.getElementById("root")
    );
};

export default withTranslation()(NewChat);
