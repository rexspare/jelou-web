import { JelouApiV1 } from "@apps/shared/modules";
import axios from "axios";
import * as dayjs from "dayjs";
import get from "lodash/get";
import omit from "lodash/omit";

export const getRoom = async (roomId = null) => {
    if (!roomId) {
        console.error("Room ID is required", { roomId });
        throw new Error("Room ID is required");
    }

    try {
        const response = await JelouApiV1.get(`/rooms/${roomId}?addConversation=true`);
        return response?.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const errorMessage = error?.response?.data;
            throw errorMessage;
        }
        throw error;
    }
};

export const getUnreadMessages = async (roomId = null) => {
    if (!roomId) {
        console.error("Room ID is required", { roomId });
        throw new Error("Room ID is required");
    }

    try {
        const response = await JelouApiV1.put(`/rooms/${roomId}?read=true`);
        return response?.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const errorMessage = error?.response?.data;
            throw errorMessage;
        }
        throw error;
    }
};

export const parseRoom = (roomData) => {
    const user = roomData.membersInfo.find((member) => member.memberType === "user");

    const room = {
        users: roomData.members,
        name: roomData.name,
        info: roomData.info,
        ...roomData,
        lastMessageAt: roomData.lastMessageAt,
        id: roomData.id,
        source: roomData.channelProvider,
        senderId: user.id,
        appId: roomData.bot.id,
        metadata: roomData.metadata,
        user,
    };

    if (room.source === "wavy") {
        try {
            room.senderId = room.senderId.replace("+", "");
        } catch (error) {
            console.log(error);
        }
    }

    const messages = [];
    const roomMessages = get(room, "messages", []);

    if (roomMessages?.$each) {
        for (const message of roomMessages.$each) {
            messages.push(parseMessage(message));
        }
    } else {
        for (const message of roomMessages) {
            messages.push(parseMessage(message));
        }
    }

    room.messages = messages.filter((message) => !message.event);

    return room;
};

export function parseMessage(msg) {
    const message = msg.bubble;
    const messageData = omit(msg, "bubble");
    const createdAt = dayjs(msg.createdAt).valueOf();

    const messageModel = {
        ...messageData,
        message,
        createdAt,
        id: msg.messageId,
    };

    return messageModel;
}
