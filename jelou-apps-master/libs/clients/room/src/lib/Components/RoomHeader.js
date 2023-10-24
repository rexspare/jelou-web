import { useEffect, useState } from "react";
import toUpper from "lodash/toUpper";
import isEmpty from "lodash/isEmpty";
import get from "lodash/get";
import last from "lodash/last";
import first from "lodash/first";
import RoomAvatar from "./RoomAvatar";
import { DownloadIcon, RefreshIcon } from "@apps/shared/icons";
import { useSelector, useDispatch } from "react-redux";
import { DashboardServer } from "@apps/shared/modules";
import Tippy from "@tippyjs/react";
import { useTranslation } from "react-i18next";
import { addClientsMessages } from "@apps/redux/store";
import dayjs from "dayjs";

const RoomHeader = (props) => {
    const { setLoadingChat } = props;
    const dispatch = useDispatch();
    const currentRoomClients = useSelector((state) => state.currentRoomClients);
    const [name, setName] = useState("");
    const [roomAvatar, setRoomAvatar] = useState("");
    const [loadingRefresh, setLoadingRefresh] = useState(false);
    const metadata = get(currentRoomClients, "metadata", {});
    const [type, setType] = useState("");
    const [botId, setBotId] = useState("");
    const messages = useSelector((state) => state.clientsMessages);
    const [isDownloadingConversation, setIsDownloadingConversation] = useState(false);
    const { t } = useTranslation();

    const getName = () => {
        let name = [];
        name = isEmpty(get(currentRoomClients, "names", ""))
            ? isEmpty(get(currentRoomClients, "metadata.names", ""))
                ? "Desconocido"
                : get(currentRoomClients, "metadata.names", "")
            : get(currentRoomClients, "names", "");
        setName(name);
    };

    const getLegalId = () => {
        let legalId = "";
        return legalId;
    };

    const getRoomAvatar = () => {
        let src = get(metadata, "profilePicture");

        if (isEmpty(src)) {
            src = get(currentRoomClients, "avatarUrl");
        }

        if (isEmpty(src)) {
            src = "https://s3.us-west-2.amazonaws.com/cdn.devlabs.tech/default_avatar.jpeg";
        }
        setRoomAvatar(src);
    };

    useEffect(() => {
        getName();
        getRoomAvatar();
        setType(get(currentRoomClients, "Bot.type", ""));
        setBotId(get(currentRoomClients, "botId", ""));
    }, [currentRoomClients]);

    const legalId = getLegalId();
    const { id, referenceId } = currentRoomClients;

    const handleDownload = async () => {
        setIsDownloadingConversation(true);
        let messagesSort = [...messages];
        messagesSort = messagesSort.sort(function (a, b) {
            return dayjs(a.createdAt) - dayjs(b.createdAt);
        });
        const initialMessage = get(first(messagesSort), "_id", "");
        const finalMessage = get(last(messagesSort), "_id", "");

        window.open(`/monitoring/conversation/download/${botId}/${id}/?initialMessage=${initialMessage}&finalMessage=${finalMessage}`, "_blank");
        setIsDownloadingConversation(false);
    };

    const refreshConversation = async () => {
        try {
            setLoadingRefresh(true);
            setLoadingChat(true);
            const { data } = await DashboardServer.get(`/clients/rooms/${currentRoomClients.id}/messages`);
            if (!isEmpty(data)) {
                const message = get(data, "rows", []);
                dispatch(addClientsMessages(message));
            }

            setTimeout(() => {
                setLoadingRefresh(false);
                setLoadingChat(false);
            }, 1000);
        } catch (error) {
            setLoadingChat(false);
            console.log(error, "error");
        }
    };

    return (
        <div className="fixed top-0 z-10 flex h-16 w-full flex-row items-center border-b-1 border-gray-100 border-opacity-25 bg-white px-4 sm:relative sm:z-0 lg:h-18">
            <div className="flex flex-row items-center">
                <div className={`flex flex-col`}>
                    <div className="flex items-center">
                        <div className="flex">
                            <RoomAvatar src={roomAvatar} name={name} type={type} />
                        </div>
                        <div className="flex flex-col">
                            <span
                                className={`leading-normal ${
                                    name.length > 35 && "w-64 truncate xxl:w-72"
                                } text-13 font-medium text-gray-375 sm:text-sm 2xl:text-15`}>
                                {name}
                            </span>

                            <div className="flex items-center justify-start">
                                {currentRoomClients.metadata?.names && (
                                    <p className="overflow-hidden truncate pr-2 font-medium text-gray-400 sm:text-xs 2xl:text-13">
                                        {currentRoomClients.metadata?.names}
                                    </p>
                                )}
                                {toUpper(type) === "WHATSAPP" && (
                                    <div className="hidden md:flex">
                                        <div className="hidden md:flex">
                                            <div className="flex items-center justify-center border-l-0.5 border-gray-400 border-opacity-25 text-base font-medium text-gray-400">
                                                <span className="px-2 font-medium sm:text-xs 2xl:text-13">
                                                    {`${referenceId.replace("@c.us", "")}`}
                                                </span>
                                            </div>
                                        </div>
                                        {toUpper(type) === "FACEBOOK_FEED" && (
                                            <div className="ml-3 hidden md:flex">
                                                <span className="bg-purple-lightest text-purple-darker inline-flex items-center rounded-md px-2.5 py-0.5 text-sm font-medium">
                                                    {"Público"}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                )}
                                {toUpper(type).includes("TWITTER") && (
                                    <div
                                        className={`flex border-l-0.5 border-gray-400 border-opacity-25 pl-2 text-xs font-light text-gray-400 ${
                                            (legalId || get(metadata, "names", "")) && "px-2"
                                        }`}>
                                        <a
                                            href={`https://twitter.com/${get(metadata, "username", "")}`}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="flex items-center hover:text-primary-200 hover:underline">
                                            {`@${get(metadata, "username", "")}`}{" "}
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="ml-1"
                                                width="14"
                                                height="14"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor">
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                                />
                                            </svg>
                                        </a>
                                    </div>
                                )}
                                {toUpper(type) === "INSTAGRAM" && (
                                    <div
                                        className={`flex border-l-0.5 border-gray-400 border-opacity-25 pl-2 text-xs font-light text-gray-400 ${
                                            legalId && "pr-2"
                                        }`}>
                                        <a
                                            href={`https://instagram.com/${get(metadata, "username", "")}`}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="flex items-center hover:text-primary-200 hover:underline">
                                            {`@${get(metadata, "username", "")}`}{" "}
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="ml-1"
                                                width="14"
                                                height="14"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor">
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                                />
                                            </svg>
                                        </a>
                                    </div>
                                )}
                                {legalId && (
                                    <p
                                        className={`overflow-hidden truncate ${
                                            (get(metadata, "names", "") || toUpper(type) === "TWITTER" || toUpper(type) === "INSTAGRAM") &&
                                            "border-l-0.5 border-gray-400 border-opacity-25 pl-2"
                                        } w-40 font-medium text-gray-400 sm:text-xs 2xl:text-13`}>{`C.I. ${legalId}`}</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="absolute right-3 top-2 hidden lg:flex">
                    <Tippy content={t("hsm.refresh")} theme={"tomato"} placement={"top"}>
                        <button
                            onClick={() => {
                                if (!loadingRefresh) refreshConversation();
                            }}
                            className="mr-2 flex items-center justify-center rounded-full bg-gray-20 text-gray-425 lg:h-8 lg:w-8">
                            <RefreshIcon
                                width="1.2rem"
                                height="1.2rem"
                                stroke={"inherit"}
                                className={`${loadingRefresh ? "animate-spinother" : ""}`}
                            />
                        </button>
                    </Tippy>
                    <Tippy content={t("hsm.download")} theme={"tomato"} placement={"top"}>
                        <button
                            className="mr-2 flex items-center justify-center rounded-full bg-primary-200 text-white lg:h-8 lg:w-8"
                            onClick={handleDownload}>
                            {isDownloadingConversation ? (
                                <svg className="h-5 w-5 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ) : (
                                <DownloadIcon width="0.813rem" height="0.875rem" fill="white" />
                            )}
                        </button>
                    </Tippy>
                </div>
            </div>
        </div>
    );
};

export default RoomHeader;
