import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { renderMessage } from "@apps/shared/common";
import { useInformaction } from "../service/information";
import { MESSAGE_TYPES } from "@apps/shared/constants";

import { DashboardServer } from "@apps/shared/modules";

export function useCurrentRoom({ initialMessage, finalMessage, existOtherParams }) {
    const [currentRoom, setCurrentRoom] = useState(null);
    const [conversationIsReady, setConversationIsReady] = useState(false);

    const { getCurrentRoom } = useInformaction();
    const { conversationId, botId } = useParams();

    useEffect(() => {
        if (existOtherParams) {
            DashboardServer.get(`/clients/download/messages?`, {
                params: {
                    initialMessage,
                    finalMessage,
                    roomId: conversationId,
                    download: false,
                },
            })
                .then(({ data }) => {
                    const { messages, room } = data.data;
                    const newRoom = {
                        ...room,
                        chat: messages,
                    };
                    setCurrentRoom(newRoom);
                    setConversationIsReady(true);
                })
                .catch((error) => {
                    console.log("~ error", error);
                });
        } else {
            if (!conversationId || !botId) return;

            getCurrentRoom({ botId, conversationId })
                .then((room) => {
                    setCurrentRoom(room);
                    setConversationIsReady(true);
                })
                .catch((error) => {
                    renderMessage(error, MESSAGE_TYPES.ERROR);
                });
        }
    }, [conversationId, botId]);

    return { currentRoom, conversationIsReady };
}
