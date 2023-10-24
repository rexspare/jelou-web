import React, { useEffect, useState } from "react";
import { PmaSidebar } from "@apps/pma/sidebar";
import ChatRoom from "./chat-room/chat-room";
import { useDispatch, useSelector } from "react-redux";
import { addRoomsArchived, setCurrentRoom, setRoomArchived, unsetCurrentRoom } from "@apps/redux/store";
import { JelouApiPma } from "@apps/shared/modules";
import reverse from "lodash/reverse";
import isEmpty from "lodash/isEmpty";
import sortBy from "lodash/sortBy";
import get from "lodash/get";
import { toTimestamp } from "@apps/shared/utils";
import { useParams } from "react-router-dom";

const PmaChat = (props) => {
    const { sendCustomText, rooms, currentRoom, messages, company, bots } = props;
    const showChat = useSelector((state) => state.showChat);
    const userSession = useSelector((state) => state.userSession);
    const archivedRooms = useSelector((state) => state.archivedRooms);
    const archivedMessages = useSelector((state) => state.archivedMessages);
    const archivedQuerySearch = useSelector((state) => state.archivedQuerySearch);
    const archivedSearchBy = useSelector((state) => state.archivedSearchBy);
    const dispatch = useDispatch();
    const [loadingArchived, setLoadingArchived] = useState(false);
    const { section = "chats" } = useParams();
    const isArchived = section === "archived";

    useEffect(() => {
        return () => {
            unsetCurrentRoom();
        };
    }, []);

    const getActiveRoomsId = () => {
        return rooms.map((room) => {
            let senderId = get(room, "id");
            if (senderId === undefined) {
                senderId = get(room, "senderId");
            }
            return senderId;
        });
    };

    const getArchivedFiles = async (limit = 10, page = 1, loadMore = false) => {
        if (isEmpty(company)) {
            return;
        }
        const { operatorId } = userSession;
        !loadMore && setLoadingArchived(true);

        const roomsId = getActiveRoomsId();
        let payload;
        if (!isEmpty(roomsId)) {
            payload = { operatorId, limit, page, ignoreRooms: `${roomsId}` };
        } else {
            payload = { operatorId, limit, page };
        }
        if (archivedQuerySearch) {
            const searchBy = archivedSearchBy.searchBy ? archivedSearchBy.searchBy : "text";
            dispatch(setCurrentRoom());
            payload = {
                operatorId,
                limit,
                page,
                search: archivedQuerySearch,
                searchBy,
            };
        }

        return JelouApiPma.get(`/v2/operators/archived`, { params: payload })
            .then(({ data }) => {
                const results = get(data, "results", []);
                if (isEmpty(results) && page === get(data, "pagination.totalPages", 0)) {
                    setLoadingArchived(false);

                    dispatch(setRoomArchived([]));
                    return 0;
                }
                const updatedConversation = results.map((conversation) => {
                    const timeStamp = toTimestamp(conversation.lastMessageAt);
                    return { ...conversation, lastMessageAt: timeStamp, archived: true };
                });

                const filtered = reverse(sortBy(updatedConversation, ["lastMessageAt"]));
                if (archivedQuerySearch) {
                    dispatch(setRoomArchived(filtered));
                } else {
                    dispatch(addRoomsArchived(filtered));
                }
                setLoadingArchived(false);
                return filtered;
            })
            .catch((err) => {
                console.log("ERROR ==> ", err);
                setLoadingArchived(false);
                return -1;
            });
    };

    return (
        <div className="flex flex-1 flex-col overflow-y-hidden p-0 mid:pt-4">
            <div className="flex w-full flex-1 overflow-x-hidden">
                <PmaSidebar
                    sendCustomText={sendCustomText}
                    getArchivedFiles={getArchivedFiles}
                    loadingArchived={loadingArchived}
                    showChat={showChat}
                />
                <ChatRoom
                    key={currentRoom.id}
                    rooms={rooms}
                    currentRoom={currentRoom}
                    archivedRooms={archivedRooms}
                    messages={!isArchived ? messages : archivedMessages}
                    showChat={showChat}
                    company={company}
                    bots={bots}
                    sendCustomText={sendCustomText}
                />
            </div>
        </div>
    );
};

export default PmaChat;
