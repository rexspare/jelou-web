import { useRef, useState } from "react";
import RoomHeader from "./Components/RoomHeader";
import TimelineChat from "./Components/TimelineChat";
import ConversationSidebar from "./Components/ConversationSidebar";
import isEmpty from "lodash/isEmpty";
import get from "lodash/get";
import toUpper from "lodash/toUpper";
import { useDispatch, useSelector } from "react-redux";
import { GreetingIcon } from "@apps/shared/icons";
import { SyncLoader } from "react-spinners";
import { RoomHeaderSkeleton, ConversationSkeleton } from "@apps/shared/common";
import { addClientsMessages, loadingMessages, isScrollingDown } from "@apps/redux/store";
import { DashboardServer } from "@apps/shared/modules";
import { useTranslation } from "react-i18next";
import { usePrevious } from "@apps/shared/hooks";
import { useParams } from "react-router-dom";

const Room = (props) => {
    const { isLoadingRoom, query, field, selectedOptions, isLoadingMessage, loadingOperators } = props;
    const { t } = useTranslation();
    const messages = useSelector((state) => state.clientsMessages);
    const currentRoomClients = useSelector((state) => state.currentRoomClients);
    const rooms = useSelector((state) => state.clientsRoom);
    const isLoadingPreviousMessages = useSelector((state) => state.isLoadingPreviousMessages);
    const isLoadingForwardMessages = useSelector((state) => state.isLoadingForwardMessages);
    const user = localStorage.getItem("user");
    const scrollDown = useSelector((state) => state.scrollDown);
    const dispatch = useDispatch();
    const prevMessages = usePrevious(messages);
    const prevRoom = usePrevious(currentRoomClients);
    const timeline = useRef(null);
    const [messageIdConversation, setMessageIdConversation] = useState("");
    const [loadingChat, setLoadingChat] = useState(false);
    const { tab } = useParams();

    const getMessageByOperator = async (messageId = "", page = 1, limit = 10) => {
        dispatch(loadingMessages(true));
        const roomId = get(currentRoomClients, "id");
        setMessageIdConversation(messageId);
        const { data } = await DashboardServer.get(`/clients/rooms/${roomId}/messages?`, {
            params: {
                page: page,
                limit: limit,
                messageId: messageId,
            },
        });

        if (!isEmpty(data)) {
            const messageByOperator = get(data, "rows");
            dispatch(addClientsMessages(messageByOperator));
        }
        dispatch(loadingMessages(false));
        dispatch(isScrollingDown(true));
    };

    const scrollContent = (behavior = "auto", position) => {
        const scrollHeight = position || Math.round(timeline.current.scrollHeight / 2);
        timeline.current.scrollBy({ top: scrollHeight, left: 0, behavior });
    };

    const operatorsMessageId = () => {
        setMessageIdConversation("");
    };

    let loadingSkeleton = [];

    for (let i = 0; i < 8; i++) {
        loadingSkeleton.push(<ConversationSkeleton key={i} />);
    }

    if (isEmpty(currentRoomClients) && toUpper(tab) === "CONVERSATION") {
        return (
            <div className={`relative hidden flex-1 flex-col mid:flex`}>
                <div className="flex flex-1 flex-col">
                    <div className="relative flex h-full flex-col items-center justify-center rounded-br-xl bg-white text-center">
                        <div className="mx-auto flex max-w-sm flex-col items-center">
                            <GreetingIcon className="my-10" width="25.8125rem" height="18.625rem" />
                            <div className="flex flex-col sm:flex-row">
                                <div className="mr-1 text-xl font-bold text-gray-400 text-opacity-75">{t("clients.hello")}</div>
                                <div className="text-xl font-bold text-primary-200">{user}</div>
                            </div>
                            <div className="text-15 leading-normal text-gray-400 text-opacity-65">
                                {!isEmpty(rooms) ? t("clients.viewHistory") : t("clients.notFound")}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (isLoadingRoom) {
        return (
            <div className="flex-1">
                <div className="flex h-screen flex-row overflow-y-hidden rounded-br-xl mid:flex-1">
                    <div className="relative flex w-full flex-1 flex-col bg-white">
                        <div className="fixed top-0 z-10 flex w-full flex-row items-center border-b-1 border-black border-opacity-10 bg-white px-4 py-2 sm:z-0 mid:relative mid:py-5 xxl:py-6">
                            <RoomHeaderSkeleton />
                        </div>
                        <div className={`relative flex-col bg-white`}>
                            <div className="flex flex-1 flex-row overflow-y-auto">
                                <div className="relative mt-16 flex-1 overflow-x-hidden pb-10 sm:mt-0">{loadingSkeleton}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const onClickToBottom = () => {
        if (timeline.current?.scrollTop) {
            timeline.current.scrollTop = 99999;
        }
    };

    
    return (
        toUpper(tab) === "CONVERSATION" && (
            <div className={`flex w-full flex-col overflow-hidden mid:rounded-br-xl`}>
                <div className="flex h-screen flex-row overflow-y-hidden mid:flex-1">
                    {isLoadingMessage ? (
                        <div className="flex-1">
                            <div className="flex h-screen flex-row overflow-y-hidden rounded-br-xl mid:flex-1">
                                <div className="relative flex w-full flex-1 flex-col bg-white">
                                    <div className="fixed top-0 z-10 flex w-full flex-row items-center border-b-1 border-black border-opacity-10 bg-white px-4 py-2 sm:z-0 mid:relative mid:py-5 xxl:py-6">
                                        <RoomHeaderSkeleton />
                                    </div>
                                    <div className={`relative flex-col bg-white`}>
                                        <div className="flex flex-1 flex-row overflow-y-auto">
                                            <div className="relative mt-16 flex-1 overflow-x-hidden pb-10 sm:mt-0">{loadingSkeleton}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="relative flex w-full flex-col bg-white">
                            <RoomHeader setLoadingChat={setLoadingChat} />
                            {isLoadingPreviousMessages && (
                                <div className="absolute z-100 mt-18 flex w-full justify-center py-5">
                                    <SyncLoader size={12} color={"#00b3c7"} />
                                </div>
                            )}
                            <div className="flex flex-1 flex-row overflow-y-auto">
                                {loadingChat ? (
                                    <div className="relative mt-16 flex-1 overflow-x-hidden pb-10 sm:mt-0">{loadingSkeleton}</div>
                                ) : !isEmpty(messages) ? (
                                    <TimelineChat
                                        className={`mb-2 mt-16 pb-8 sm:mt-0`}
                                        messages={messages}
                                        currentRoomClients={currentRoomClients}
                                        prevMessages={prevMessages}
                                        prevRoom={prevRoom}
                                        scrollDown={scrollDown}
                                        timeline={timeline}
                                        scrollContent={scrollContent}
                                        query={query}
                                        field={field}
                                        onClickToBottom={onClickToBottom}
                                        operatorsMessageId={operatorsMessageId}
                                        messageIdConversation={messageIdConversation}
                                    />
                                ): (
                                        <div className={`relative hidden flex-1 flex-col mid:flex`}>
                                            <div className="flex flex-1 flex-col">
                                                <div className="relative flex h-full flex-col items-center justify-center rounded-br-xl bg-white text-center">
                                                    <div className="mx-auto flex max-w-sm flex-col items-center">
                                                        <GreetingIcon className="my-10" width="25.8125rem" height="18.625rem" />
                                                        <div className="text-15 leading-normal text-gray-400 text-opacity-65">
                                                            {t("clients.notFound")}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                }
                            </div>
                            {isLoadingForwardMessages && (
                                <div className="absolute bottom-0 z-100 mt-18 flex w-full justify-center py-5">
                                    <SyncLoader size={12} color={"#00b3c7"} />
                                </div>
                            )}
                        </div>
                    )}
                    <ConversationSidebar
                        getMessageByOperator={getMessageByOperator}
                        selectedOptions={selectedOptions}
                        isLoadingMessage={isLoadingMessage}
                        loadingOperators={loadingOperators}
                    />
                </div>
            </div>
        )
    );
};

export default Room;
