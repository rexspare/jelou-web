import * as Sentry from "@sentry/react";
import get from "lodash/get";
import has from "lodash/has";
// import isEmpty from "lodash/isEmpty";
import { saveData, Store, updateOperatorAvgResponseTime } from "@apps/redux/store";
import { JelouApiV1 } from "@apps/shared/modules";
// import { getUnreadMessages } from "libs/pma/sidebar/src/lib/services/UnreadMessages";
import EventEmitter from "./event-emitter";
import { messageCounter } from "./messageCounter";

/**
 * Talktolk
 * This class integrates Talktolk SDK
 * Documentation about talktolk does not exists
 * @constructor
 */
class Channel extends EventEmitter {
    /**
     * Instantiate Talktolk
     * @param {string} credentials.appId - Talktolk app id
     * @param {string} credentials.appSecret - Taltolk app secret
     * @param {object} credentials.user - User object
     * @param {string=} credentials.user.names - User name (optional)
     * @param {sring} credentials.user.providerId - User id on talktolk
     */
    constructor({ companyId, providerId, companySocketId, pusherInstance }) {
        super();
        this.pusher = pusherInstance;

        this.pusher.connection.bind("state_change", (states) => {
            console.log("pusher state_change", states.current);
            if (states.current === "unavailable" || states.current === "failed" || states.current === "disconnected") {
                Sentry.setExtra("companyId", companyId);
                Sentry.setExtra("providerId", providerId);
                Sentry.captureException(new Error(`Socket connection: ${states.current}`));
            }
            this.emit("stateChange", states);
        });

        this.companyChannel = this.subscribeToMessages({ companySocketId });
        this.personalChannel = this.subscribeToPersonalCHannel({ providerId });
        this.subscribeToQueues({ companySocketId });
    }

    renderGlobalEvents({ providerId, companyId, companySocketId } = {}) {
        this.bindGlobalEvents({ providerId, companyId, companySocketId });
    }

    // method wich receives custom events and a callback to execute when the event is triggered

    renderPmaEvents({ companyId, providerId, companySocketId } = {}) {
        // logs all params

        this.bindToMessages({ companyId, companySocketId });
        this.bindToChatEvents({ providerId });
        this.bindQueueEvents({ companySocketId });
    }

    leavePmaEvents({ companyId, providerId, companySocketId } = {}) {
        this.unbindToMessages({ companyId });
        this.unbindToChatEvents({ providerId });
        this.unbindQueueEvents({ companySocketId });
    }

    subscribeToChannelCompany({ companySocketId }) {
        this.companyChannel = this.pusher.subscribe(`channel-company-${companySocketId}`); // we mutate companyChannel for keep the same instance in all the channel
    }

    subscribeToMessages({ companySocketId }) {
        const companyChannelBySocketId = `channel-company-${companySocketId}`;
        return this.pusher.subscribe(companyChannelBySocketId);
    }

    subscribeToPersonalCHannel({ providerId }) {
        return this.pusher.subscribe(`socket-${providerId}`);
    }

    subscribeToQueues({ companySocketId }) {
        this.bindQueueEvents({ companySocketId });
    }

    bindToCompanyChannel({ companyId, companySocketId } = {}) {
        this.companyChannel.bind("operator-assign", (operator) => {
            this.emit("operatorAssign", operator);
        });

        this.companyChannel.bind("operator-status-update", (operator) => {
            this.emit("operatorStatusUpdate", operator);
        });
    }

    unbindToCompanyChannel(companySocketId) {
        this.companyChannel.unbind("operator-assign");
        this.companyChannel.unbind("operator-status-update");
    }

    bindGlobalEvents({ providerId, companyId, companySocketId } = {}) {
        //room member add

        this.personalChannel.bind("room-member-add", (data) => {
            const { payload } = data;
            if (get(payload, "memberUpdated.providerId", get(payload, "memberUpdated.id", "")) === providerId) {
                const { roomId } = payload;

                JelouApiV1.get(`/rooms/${roomId}`).then(({ data: response }) => {
                    const { data } = response;
                    const isNewMemberDataInfo = get(data, `membersMetaInfo[${providerId}].isNew`, false);
                    let roomWithFinalData = {};

                    if (has(data, "membersMetaInfo")) {
                        roomWithFinalData = {
                            ...data,
                            membersMetaInfo: {
                                ...data.membersMetaInfo,
                                [providerId]: {
                                    ...data.membersMetaInfo[providerId],
                                    isNew: isNewMemberDataInfo,
                                },
                            },
                        };
                    } else {
                        roomWithFinalData = {
                            ...data,
                        };
                    }

                    this.emit("addedToRoom", this.parseRoom(roomWithFinalData));
                });
            }
        });

        //room member remove
        this.personalChannel.bind("room-member-remove", (data) => {
            const { payload } = data;
            if (get(payload, "memberUpdated.providerId", get(payload, "memberUpdated.id", "")) === providerId) {
                this.emit("removedFromRoom", payload);
            }
        });

        this.companyChannel.bind("operator-assign", (operator) => {
            this.emit("operatorAssign", operator);
        });

        this.companyChannel.bind("operator-status-update", (operator) => {
            this.emit("operatorStatusUpdate", operator);
        });
    }

    unbindGlobalEvents({ providerId } = {}) {
        this.personalChannel.unbind("room-member-add");
        this.personalChannel.unbind("room-member-remove");
    }

    bindToMessages({ companyId, companySocketId } = {}) {
        this.companyChannel.bind("message_update", (message) => {
            this.emit("ackMessage", {
                ...message,
                ...(message.createdAt ? { createdAt: message.createdAt * 1000 } : {}),
            });
        });

        this.companyChannel.bind("support-tickets-reply-update", (message) => {
            this.emit("ackMessage", {
                ...message,
                ...(message.createdAt ? { createdAt: message.createdAt * 1000 } : {}),
            });
        });
    }

    unbindToMessages({ companyId, companySocketId }) {
        this.companyChannel.unbind("message_update");
        this.companyChannel.unbind("support-tickets-reply-update");
    }

    bindToChatEvents({ providerId } = {}) {
        this.personalChannel.bind("room-message", async (data) => {
            const { payload } = data;
            const { message, messageId, by, createdAt, room, sender, status } = payload;
            const { id: senderId, botId: appId } = sender;
            const { id: roomId } = room;

            const parsedMessage = {
                _id: messageId,
                recipientId: senderId,
                senderId,
                sender,
                by,
                roomId,
                messageId,
                status,
                createdAt: createdAt * 1000,
                message,
                id: messageId,
                userId: senderId,
                appId,
            };

            messageCounter({ by, roomId, providerId });
            this.emit("message", parsedMessage);
        });

        this.personalChannel.bind("room-message-update", (data) => {
            const { payload } = data;
            const message = {
                ...payload,
                senderId: payload.sender.providerId,
                id: payload.messageId,
                roomId: payload.room.id,
            };

            this.emit("ackMessage", message);
        });

        this.personalChannel.bind("client-metadata-update", (data) => {
            const { _id } = data;

            JelouApiV1.get(`/real-time-events/${_id}`).then(({ data: response }) => {
                const { data } = response;
                const { metadata } = data.payload;
                Store.dispatch(saveData(metadata));
            });
        });

        this.personalChannel.bind("operator-time-first-response", (data) => {
            const { avgReplyTime } = data;
            Store.dispatch(updateOperatorAvgResponseTime(avgReplyTime));
        });
    }

    unbindToChatEvents({ providerId }) {
        // messagesChannel.unbind("room-member-add");
        // messagesChannel.unbind("room-member-remove");
        this.personalChannel.unbind("room-message");
        this.personalChannel.unbind("room-message-update");
        this.personalChannel.unbind("client-metadata-update");
        this.personalChannel.unbind("support-tickets-assign");
        this.personalChannel.unbind("support-tickets-reply-new");
    }

    bindQueueEvents({ companySocketId } = {}) {
        this.companyChannel.bind("new_ticket", (data) => {
            this.emit("newQueue", data);
        });

        this.companyChannel.bind("update_ticket", (data) => {
            this.emit("updateQueue", data);
        });

        this.companyChannel.bind("take_ticket_response", (data) => {
            this.emit("takeQueueResponse", data);
        });
    }

    unbindQueueEvents({ companySocketId }) {
        this.companyChannel.unbind("take_ticket_response", (data) => {
            this.emit("takeQueueResponse", data);
        });
    }

    bindEmailsEvents({ companySocketId, companyId } = {}) {
        this.companyChannel.bind("support-tickets-update", (data) => {
            this.emit("updateEmail", data);
        });
        this.companyChannel.bind("support-tickets-assign", (data) => {
            const mailInfo = { ...get(data, "supportTicket"), user: get(data, "User"), bot: get(data, "Bot") };
            this.emit("assignMail", mailInfo);
        });

        this.personalChannel.bind("support-tickets-reply-new", (data) => {
            const payload = get(data, "payload");
            this.emit("replyNewMail", payload);
        });
        this.companyChannel.bind("support-tickets-reply-update", (data) => {
            const message = {
                ...data,
                ...(data.createdAt ? { createdAt: data.createdAt * 1000 } : {}),
            };
            this.emit("supportTicketsReplyUpdate", message);
        });
    }

    unbindEmailsEvents({ companySocketId, companyId } = {}) {
        this.personalChannel.unbind("support-tickets-assign");
        this.companyChannel.unbind("support-tickets-assign");
        this.personalChannel.unbind("support-tickets-reply-update");
    }

    unsubscribeFromChatEvents(providerId) {
        const messageChannelName = `socket-${providerId}`;
        this.pusher.unsubscribe(messageChannelName);
    }

    unsubscribeFromMessages(companySocketId) {
        this.pusher.unsubscribe(this.companyChannel);
    }

    unsubscribeFromQueues(companySocketId) {
        this.pusher.unsubscribe(this.companyChannel);
    }

    setReadCursor(options) {
        return null;
    }

    parseRoom(roomData) {
        const storageKey = `room:${roomData.id}`;
        const lastUnRead = sessionStorage.getItem(storageKey) || 1;
        const unreadCount = Number(lastUnRead);
        sessionStorage.setItem(storageKey, unreadCount);

        const user = roomData.membersInfo.find((member) => member.memberType === "user");

        const room = {
            users: roomData.members,
            name: roomData.name,
            info: roomData.info,
            ...roomData,
            lastMessageAt: roomData.lastMessageAt,
            unreadCount,
            id: roomData.id,
            source: roomData.channelProvider,
            senderId: user.id,
            appId: roomData.bot.id,
            legalId: user.legalId,
        };

        if (room.source === "wavy") {
            try {
                room.senderId = room.senderId.replace("+", "");
            } catch (error) {
                console.log(error);
            }
        }

        return room;
    }

    handleUnread({ roomId, providerId }) {
        return null;
    }

    emitEvent(label, data) {
        this.emit(label, data);
    }
}

export default Channel;
