import defaults from "lodash/defaults";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import ow from "ow";

import { Channel, OperatorEvent } from "@apps/pma/provider";
import { PROVIDERS, ROOM_TYPES } from "@apps/shared/constants";
import { JelouApiV1 } from "@apps/shared/modules";
import { parseMessage } from "@apps/shared/utils";
class Chat {
    /**
     * Instantiate provider base on settings
     * Currently there are only two providers supported ( Talktolk, Pusher Chatkit )
     * @param {object} settings
     * @param {string} settings.provider - Provider name
     * @param {object} settings.credentials - Provider credentials
     * @param {string} settings.credentials.instanceLocator
     * @param {string} settings.credentials.userId
     * @param {string} settings.credentials.tokenProviderUrl
     * @param {string} settings.credentials.appId
     * @param {string} settings.credentials.appSecret
     * @param {object} settings.credentials.user
     * @param {object} settings.credentials.user.names
     * @param {object} settings.credentials.user.providerId
     * @param {object} settings.companyId
     */
    constructor(settings) {
        this.settings = defaults(settings, {
            provider: PROVIDERS.PUSHER,
        });

        const { credentials, companyId, companySocketId, pusherInstance } = settings;
        const { user } = credentials;
        switch (settings.provider) {
            case PROVIDERS.PUSHER:
                this.chatManager = new OperatorEvent(credentials);
                break;
            default:
                this.chatManager = new OperatorEvent(credentials);
                break;
        }

        this.channel = new Channel({ companyId, providerId: user.providerId, companySocketId, pusherInstance });
        // this.rooms = [];
    }

    /**
     * Connect the current provider
     * @returns {Promise} Promise object wether the provider is connected or not
     */
    async connect() {
        try {
            const { credentials } = this.settings;
            const { user } = credentials;
            const { data } = await JelouApiV1.get(`/rooms`, {
                params: {
                    userId: user.providerId,
                    shouldPaginate: false,
                    addConversations: true,
                },
            });

            const rooms = get(data, "results", []);
            const parsedRooms = [];
            for (const room of rooms) {
                if (room.type !== "reply" && room.type !== "ticket" && room.kind !== "group") {
                    parsedRooms.push(this.parseRoom(room));
                }
            }
            // rooms in inbox
            this.rooms = parsedRooms;
            return parsedRooms;
        } catch (err) {
            console.log(err);
        }
    }

    /**
     * Listen for provider events
     * @param {('message'|'addedToRoom'|'removedFromRoom')} label Event type label
     * @param {function} callback Function callback for events
     */
    on(label, callback) {
        return this.chatManager.on(label, callback);
    }

    onEvent(label, callback) {
        return this.channel.on(label, callback);
    }

    /**
     * Send message to a room
     *
     * @param {object} data Message required data
     * @param {number} data.roomId Id of the room
     * @param {object} data.message Message object
     * @returns {Promise} Promise object that represent the recently created message
     * @memberof Chat
     */
    sendMessage(data) {
        // Validate function params
        if (typeof data.roomId !== "string") {
            // Would not send message if there's not roomId, roomId MUST be string.
            return;
        }
        ow(
            data,
            ow.object.exactShape({
                roomId: ow.string,
                message: ow.object,
            })
        );

        // Parse message to send groupId instead of roomId
        // TODO: Change backend to receive roomId instead of groupId
        const message = {
            ...data.message,
            groupId: data.message.roomId,
        };

        return this.chatManager.sendMessage({
            ...data,
            message,
        });
    }

    /**
     * Get room messages
     *
     * @param {string} roomId Id of the room
     * @param {object} [options={}] Options to fetch messages ( it depends on the provider )
     * @param {number} options.initialId A message ID that defaults to the most recent message ID.
     * @param {('older'|'newer')} options.direction Fetch older or newer messages
     * @param {number} options.limit The amount of messages you want to revieve (min:20,max:100)
     * @param {number} options.lastTimestamp First message timestamp
     * @returns {Promise} Promise object with messages
     * @memberof Chat
     */
    getRoomMessages(roomId, options = {}, hasEnabledEvents = true) {
        // Validate params
        // ow(roomId, ow.any(ow.number, ow.string));
        // return this.chatManager.getRoomMessages(roomId, options);
        // para regresar a anterior version cambiar el valor de variable a true
        return this.getEarlierMessages(roomId, options, hasEnabledEvents);
    }

    /**
     * Mark messages as read from a position
     *
     * @param {object} options Read cursor options
     * @returns
     * @memberof Chat
     */
    setReadCursor(options) {
        return this.channel.setReadCursor(options);
    }

    async getRooms({ providerId, roomsWithOutFilter = false } = {}) {
        const { credentials = {} } = this?.settings ?? {};
        const { user = {} } = credentials;
        const { data } = await JelouApiV1.get(`/rooms`, {
            params: {
                userId: user?.monkeyId || providerId,
                shouldPaginate: false,
                addConversations: true,
            },
            "axios-retry": {
                retries: 3,
            },
        });

        const rooms = get(data, "results", []);

        if (roomsWithOutFilter) return rooms.map((room) => this.parseRoom(room));
        return rooms.filter((room) => room?.type === ROOM_TYPES.CLIENT).map((room) => this.parseRoom(room));
    }

    async getRoomsWithMessages() {
        try {
            const { credentials } = this.settings;
            const { user } = credentials;
            const { data } = await JelouApiV1.get(`/rooms`, {
                params: {
                    userId: user.providerId,
                    shouldPaginate: false,
                    addConversations: true,
                },
                "axios-retry": {
                    retries: 3,
                },
            });

            const rooms = get(data, "results", []);
            const parsedRooms = [];

            for (const room of rooms) {
                if (room.type !== "reply" && room.type !== "ticket" && room.kind !== "group") {
                    parsedRooms.push(this.parseRoom(room));
                }
            }

            const roomWithMessages = [];
            for (const room of parsedRooms) {
                const response = await this.getEarlierMessages(room.id, { limit: 20 });
                room.messages = response;
                roomWithMessages.push(room);
            }

            return roomWithMessages;
        } catch (err) {
            console.log(err);
        }
    }

    /**
     * Get 'limited' number of messages
     *
     * @param {string} lastMessageId
     * @param {string} userId
     * @param {string} botId
     * @param {number} limit
     * @returns
     * @memberof Chat
     */

    async getEarlierMessages(roomId, options = {}, hasEnabledEvents = true) {
        if (isEmpty(roomId)) return [];
        try {
            const { lastMessageId, userId, botId, limit } = options;
            if (!isEmpty(options)) {
                const { data } = await JelouApiV1.get(`/rooms/${roomId}/messages`, {
                    params: {
                        limit,
                        ...(lastMessageId ? { _id: lastMessageId } : {}),
                        ...(hasEnabledEvents ? { events: true } : {}),
                    },
                });

                const { results } = data;

                const parsedMessages = [];
                for (const message of results) {
                    parsedMessages.push({ ...parseMessage(message), roomId, userId, appId: botId });
                }

                return parsedMessages;
            }

            return [];
        } catch (error) {
            console.log("=>", error);
        }
    }

    /**
     * Cast mongo _id string to date value.
     * @param {string} objectId
     * @returns {string} Unixdate
     */
    dateFromObjectId(objectId) {
        return parseInt(objectId.toString().substring(0, 8), 16);
    }

    async newGetRoomMessages(roomId, options) {
        try {
            // Validate params
            ow(
                options,
                ow.optional.object.exactShape({
                    limit: ow.optional.number.is((x) => x >= 1 && x <= 100),
                    direction: ow.optional.string.is((x) => x === "older" || x === "newer"),
                    lastTimestamp: ow.optional.number,
                    initialId: ow.optional.number,
                })
            );

            const { initialId, direction, limit } = options;

            const messages = await this.currentUser.fetchMultipartMessages({
                roomId: roomId,
                ...(initialId ? { initialId } : {}),
                ...(direction ? { direction } : {}),
                ...(limit ? { limit } : {}),
            });

            const parsedMessages = [];
            for (const message of messages) {
                parsedMessages.push(parseMessage(message));
            }

            return parsedMessages;
        } catch (err) {
            console.log(err);
        }
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
    }
}

export default Chat;
