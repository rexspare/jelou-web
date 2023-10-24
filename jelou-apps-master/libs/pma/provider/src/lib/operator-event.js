import { JelouApiV1 } from "@apps/shared/modules";
import * as Sentry from "@sentry/react";
import base64 from "base-64";
import filter from "lodash/filter";
import get from "lodash/get";
import includes from "lodash/includes";
import isEmpty from "lodash/isEmpty";
import omit from "lodash/omit";
import toLower from "lodash/toLower";
import ow from "ow";
import utf8 from "utf8";

import dayjs from "dayjs";
import "dayjs/locale/es";
import EventEmitter from "./event-emitter";

/**
 * OperatorEvent
 * @constructor
 */
class OperatorEvent extends EventEmitter {
    /**
     * Instantiate OperatorEvent
     * @param {string} credentials.appId - OperatorEvent app id
     * @param {string} credentials.appSecret - Taltolk app secret
     * @param {object} credentials.user - User object
     * @param {string=} credentials.user.names - User name (optional)
     * @param {sring} credentials.user.providerId - User id on OperatorEvent
     */
    constructor(credentials) {
        super();

        // Validate credentials
        try {
            ow(
                credentials,
                ow.object.exactShape({
                    appId: ow.string,
                    appSecret: ow.string,
                    user: ow.object.exactShape({
                        names: ow.optional.string,
                        providerId: ow.string,
                    }),
                })
            );
        } catch (error) {
            console.error("no tiene todas las credenciales completas", { error });
        }

        this.credentials = credentials;
        this.currentUser = {};
    }

    /**
     * Connect OperatorEvent
     * When OperatorEvent is connected it resolves the current connected user
     * @returns {Promise} Promise object wether OperatorEvent is connected or not
     */
    connect() {
        const { appId, appSecret, user } = this.credentials;

        const args = {
            appKey: appId,
            appSecret: appSecret,
            userObj: user,
            shouldExpireSession: false,
            isDebugParams: {
                apiUrl: "migration.talktolk.com",
                debug: false,
                socketSecure: true,
                apiSecure: true,
                webSocketTransport: false,
            },
            autoSync: false,
            autoSave: true,
        };

        return new Promise((resolve, reject) => {
            this.chatManager.init(args, async (error, currentUser) => {
                try {
                    if (error) {
                        return reject(error);
                    }

                    // Get user rooms
                    this.currentUser = currentUser;
                    this.currentUser.rooms = [];

                    // Register event listeners
                    this.listenEvents();

                    this.currentUser.id = currentUser.providerId; // Mock id of user

                    return resolve(this.currentUser);
                } catch (error) {
                    return reject(error);
                }
            });
        });
    }

    /**
     * Emit event when current user is added to a room
     *
     * @param {object} room
     * @memberof OperatorEvent
     */
    async onAddedToRoom(roomId, parsedData = null) {
        const room = await this.getRoomData(roomId);
        try {
            const { data: response } = await JelouApiV1.get(`bots/${room.appId}/rooms/${room.id}/conversation`);
            room.conversation = get(response, "data.Conversation", null);
            room.storedParams = get(response, "data.StoredParams", null);
            room.tags = get(response, "data.Room.metadata.tags", []);
            if (parsedData) {
                parsedData.conversation = get(response, "data.Conversation", null);
                parsedData.storedParams = get(response, "data.StoredParams", null);
                parsedData.tags = get(response, "data.Room.metadata.tags", []);
            }
        } catch (error) {
            console.log(error);
        }

        if (room) {
            if (parsedData) {
                this.emit("addedToRoom", parsedData);
            } else {
                this.emit("addedToRoom", room);
            }
        }
    }

    /**
     * Emit event when current user is removed from a room
     *
     * @param {object} room
     * @memberof OperatorEvent
     */
    async onRemovedFromRoom(roomId) {
        this.emit("removedFromRoom", roomId);
    }

    /**
     * Send a message to a room
     *
     * @param {object} data Message required data
     * @param {number} data.roomId Id of the room
     * @param {object} data.message Message object
     * @returns {Promise} Promise object represents
     * @memberof OperatorEvent
     */
    sendMessage(data) {
        const { roomId, message } = data;
        const replyTo = get(message, "replyTo", null);

        let text = "";
        const messageData = message.message;
        const { type } = messageData;
        if (type === "TEXT") {
            try {
                messageData.text = base64.encode(messageData.text);
            } catch (error) {
                messageData.text = base64.encode(utf8.encode(messageData.text));
            }
        } else if (type === "DOCUMENT" || type === "IMAGE") {
            try {
                messageData.caption = base64.encode(messageData.caption);
            } catch (error) {
                console.log(error);
            }
        }

        const mockMessage = this.chatManager.sendMessage(text, roomId, message, null);
        mockMessage.params.status = "SENDING";

        if (replyTo) {
            mockMessage.repliesTo = replyTo;
        }

        const parsedMessage = this.parseMessage(mockMessage);
        this.emit("message", parsedMessage);

        return parsedMessage;
    }

    /**
     * Get room messages
     *
     * @param {string} roomId Id of the room
     * @param {object=} options
     * @param {number} options.lastTimestamp
     * @param {number} options.limit The amount of messages you want to revieve (min:20,max:100)
     * @returns
     * @memberof OperatorEvent
     */
    getRoomMessages(roomId, options = {}) {
        const { limit = 20, lastTimestamp = null } = options;
        return new Promise((resolve, reject) => {
            this.chatManager.getConversationMessages(roomId, limit, lastTimestamp, (err, messages) => {
                if (err) {
                    return reject(err);
                }

                // Append roomId to messages
                // Ignore protocolType = 4 messages ( Notifications )
                const parsedMessages = messages
                    .filter(({ protocolType }) => protocolType !== "4")
                    .map((message) => {
                        return this.parseMessage({
                            ...message,
                            id: parseInt(message.id),
                        });
                    });

                return resolve(parsedMessages);
            });
        });
    }

    /**
     * Get data from a room
     *
     * @param {strinf} roomId Id fo the room
     * @returns {object} Room data
     * @memberof OperatorEvent
     */
    async getRoomData(roomId) {
        try {
            const response = await this.TTApi.getRoom(roomId, this.credentials.user.providerId);
            if (!isEmpty(response)) {
                return this.parseRoom(response);
            }
            return;
        } catch (error) {
            return Promise.reject(error);
        }
    }

    /**
     * Get rooms for current user
     *
     * @param {*} userId Id of current user
     * @returns {Array} Rooms array
     * @memberof OperatorEvent
     */
    async getRooms(userId = null) {
        Sentry.setExtra("userId", userId || this.currentUser.providerId);
        const { data: response } = await this.TTApi.getRooms(userId || this.currentUser.providerId);
        const { conversations } = response.data;

        const filteredRooms = filter(conversations, (room) => {
            return get(room, "info.senderId", undefined) !== undefined;
        });

        let rooms = [];
        for (const conversation of filteredRooms) {
            rooms.push(await this.parseRoom(conversation));
        }

        rooms = rooms.filter((room) => !includes(["facebook_feed", "twitter_replies", "zendesk"], toLower(room.source)));

        const parsedRooms = [];
        for (const room of rooms) {
            parsedRooms.push(room);
        }

        return parsedRooms;
    }

    /**
     * Parse room from OperatorEvent to use the same model as pusher
     * Model reference at: https://pusher.com/docs/chatkit/reference/javascript#room-properties
     *
     * @param {*} roomData
     * @returns
     * @memberof OperatorEvent
     */
    async parseRoom(roomData) {
        const { last_message, info } = roomData;

        const storageKey = `room:${roomData.id}`;
        const lastUnRead = sessionStorage.getItem(storageKey) || 1;
        const unreadCount = Number(lastUnRead);

        sessionStorage.setItem(storageKey, unreadCount);

        const room = {
            users: roomData.members,
            name: roomData.info.name,
            info: roomData.info,
            ...roomData.info,
            // Get the last message timestamp, if for some reason last_message is null use last_modified field on
            lastMessageAt: !isEmpty(get(roomData, "last_message", []))
                ? last_message.datetime
                : get(roomData, "last_modified")
                ? roomData.last_modified
                : info.creationDate,
            customData: roomData,
            unreadCount,
            id: roomData.id,
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

    /**
     *
     *
     * @param {object} message
     * @returns {object}
     * @memberof OperatorEvent
     */
    parseMessage(message) {
        let createdAt;

        if (toLower(message.params.by) === "user") {
            createdAt = dayjs().valueOf();
        } else {
            createdAt = dayjs(message.datetime * 1000).valueOf();
        }

        const replyTo = get(message, "params.replyTo", null);
        const quotedMsgObj = get(message, "params.message.quotedMsgObj", null);

        const messageModel = {
            id: get(message, "params.messageId", message.id),
            roomId: message.rid,
            ...message.params,
            createdAt: createdAt,
            ...(message.repliesTo ? { repliesTo: message.repliesTo } : {}),
            ...(replyTo ? { repliesTo: replyTo } : {}),
            ...(quotedMsgObj ? { repliesTo: quotedMsgObj } : {}),
            customData: {
                ...message,
            },
        };

        messageModel.message = this.decodeContent(messageModel.message);

        return omit(messageModel, ["groupId", "conversationId"]);
    }

    setReadCursor(options) {
        return null;
    }
    handleUnread(message) {
        return null;
    }

    /**
     * Encode texts from a message
     * Encode type: base64
     *
     * @param {object} message
     * @returns {object} Encoded message object
     * @memberof OperatorEvent
     */
    decodeContent(message) {
        try {
            const { type } = message;
            let decMessage = "";
            let imageDecodedCaption = "";
            switch (type) {
                case "TEXT":
                    try {
                        let decodedMessage = base64.decode(message.text);
                        decMessage = utf8.decode(decodedMessage);
                    } catch (error) {
                        // decMessage = decodedMessage;
                    }
                    return {
                        ...message,
                        ...(!isEmpty(message.options) ? { options: this.decodeOptions(message.options) } : {}),
                        text: decMessage,
                    };
                case "DOCUMENT":
                case "IMAGE":
                    imageDecodedCaption = base64.decode(message.caption);
                    return {
                        ...message,
                        caption: imageDecodedCaption,
                    };
                default:
                    return message;
            }
        } catch (error) {
            return message;
        }
    }

    /**
     * Decode options title
     *
     * @param {array} [options=[]] Options arrya
     * @returns {array} Parsed options
     * @memberof OperatorEvent
     */
    decodeOptions(options = []) {
        return options.map((option) => {
            try {
                const title = base64.decode(option.title);
                return {
                    ...option,
                    title: utf8.decode(title),
                };
            } catch (error) {
                return option;
            }
        });
    }
}

export default OperatorEvent;
