import { ChatManager, TokenProvider } from "@pusher/chatkit-client";
import EventEmitter from "./event-emitter";
import ow from "ow";
import dayjs from "dayjs";

import isEmpty from "lodash/isEmpty";
import first from "lodash/first";
/**
 * Pusher
 * This class integrates Pusher client SDK
 * Documentation about pusher client can be found in https://pusher.com/docs/chatkit/reference/javascript
 * @constructor
 */
class Pusher extends EventEmitter {
    /**
     * Instantiate Pusher ChatManager with credentials
     * @param {string} credentials.instanceLocator - instanceLocator can be found on Pusher dashboard
     * @param {string} credentials.userId - User id that already exists on Pusher
     * @param {string} credentials.tokenProviderUrl - The URL that the ChatManager should make a POST     request to in     order to fetch a valid token.
     * @param {object=} credentials.queryParams - An object of key–value pairs to be passed as query      parameters        along with the token request.
     * @param {object=} credentials.headers - An object of key–value pairs to be passed as headers        along with the    token request.
     * @param {boolean=} credentials.withCredentials - Whether to make requests with credentials,         defaults to       false.
     */
    constructor(credentials) {
        super();
        // Validate credentials
        ow(
            credentials,
            ow.object.exactShape({
                instanceLocator: ow.string,
                userId: ow.string,
                tokenProviderUrl: ow.string,
                queryParams: ow.optional.object,
                headers: ow.optional.object,
                withCredentials: ow.optional.boolean,
            })
        );

        this.chatManager = new ChatManager({
            instanceLocator: credentials.instanceLocator,
            userId: credentials.userId,
            tokenProvider: new TokenProvider({
                url: credentials.tokenProviderUrl,
            }),
        });
        this.currentUser = {};
        this.rooms = [];
    }

    /**
     * Connect pusher
     * When pusher is connected it resolves the current connected user
     * @returns {Promise} Promise object wether pusher is connected or not
     */
    async connect() {
        try {
            const currentUser = await this.chatManager.connect({
                onAddedToRoom: (room) => {
                    this.onAddedToRoom(room);
                },
                onRemovedFromRoom: (room) => {
                    this.onRemovedFromRoom(room);
                },
                onRoomUpdated: (room) => {
                    this.onRoomUpdated(room);
                },
            });

            this.currentUser = currentUser;

            // Subscribe to user rooms
            if (!isEmpty(currentUser.rooms)) {
                currentUser.rooms.forEach((room) => {
                    this.subscribeToRoomMultipart(room, currentUser);
                });
            }

            // Parse pusher rooms
            // We cant change rooms from currentUser object cuz is a getter
            this.rooms = currentUser.rooms.map((room) => {
                return this.parseRoom(room);
            });

            return this.currentUser;
        } catch (error) {
            return Promise.reject(error);
        }
    }

    /**
     * Emit event when current user is added to a room
     *
     * @param {object} room
     * @memberof Pusher
     */
    onAddedToRoom(room) {
        this.emit("addedToRoom", {
            ...room,
            ...room.customData,
        });
        this.subscribeToRoomMultipart(room); // Subscribe to room messages
    }

    /**
     * Emit event when a room is updated
     *
     * @param {object} room
     * @memberof Pusher
     */
    onRoomUpdated(room) {
        this.emit("roomUpdated", {
            ...room,
            ...room.customData,
        });
    }

    /**
     * Emit event when current user is removed from a room
     *
     * @param {object} room
     * @memberof Pusher
     */
    onRemovedFromRoom(room) {
        this.emit("removedFromRoom", room.id);
        this.currentUser.roomSubscriptions[room.id].cancel(); // Cancel suscriptions to the room
    }

    /**
     * Subscribe to room messages
     *
     * @param {object} room
     * @memberof Pusher
     */
    subscribeToRoomMultipart(room, currentUser = null) {
        currentUser = currentUser || this.currentUser;
        currentUser.subscribeToRoomMultipart({
            roomId: room.id,
            hooks: {
                onMessage: (message) => {
                    this.emit("message", this.parseMessage(message));
                },
            },
            messageLimit: 0,
        });
    }
    /**
     * Get room messages
     *
     * @param {string} roomId Id of the room
     * @param {object} options
     * @param {number} options.initialId A message ID that defaults to the most recent message ID.
     * @param {('older'|'newer')} options.direction Fetch older or newer messages
     * @param {number} options.limit The amount of messages you want to revieve (min:20,max:100)
     * @returns
     * @memberof Pusher
     */
    async getRoomMessages(roomId, options) {
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
            parsedMessages.push(this.parseMessage(message));
        }

        return parsedMessages;
    }

    /**
     * Mark messages as read from a position
     * position is the id of the message
     *
     * @param {object} { roomId, position }
     * @param {number} data.roomId Id of the room
     * @param {number} data.position Id of the message
     * @returns
     * @memberof Pusher
     */
    setReadCursor({ roomId, position }) {
        try {
            return this.currentUser.setReadCursor({
                roomId,
                position,
            });
        } catch (error) {
            console.error(error);
        }
    }

    /**
     * Send a message to a room
     * Currently Pusher does not support a custom payload for messages
     * In order to work with chatbot-server always send content as JSON.stringify
     * Type must be text/plain
     *
     * @param {object} data Message required data
     * @param {number} data.roomId Id of the room
     * @param {object} data.message Message object
     * @returns {Promise} Promise object represents
     * @memberof Pusher
     */
    async sendMessage(data) {
        const { roomId, message } = data;

        const id = await this.currentUser.sendMultipartMessage({
            roomId: roomId,
            parts: [
                {
                    type: "text/plain",
                    content: JSON.stringify(message),
                },
            ],
        });

        const newMessage = {
            id,
            ...message,
            createdAt: dayjs().unix(),
        };

        this.emit("message", newMessage);

        return newMessage;
    }

    /**
     *
     *
     * @param {object} message
     * @returns {object}
     * @memberof Pusher
     */
    parseMessage(message) {
        const part = first(message.parts);
        const { content } = part.payload;
        const messageData = JSON.parse(content);
        const messageModel = {
            ...message,
            ...messageData,
            createdAt: message.createdAt ? dayjs(message.createdAt).unix() : dayjs().unix(),
        };
        // console.log("=== Parsed Messages", messageModel);
        return messageModel;
    }

    /**
     * Parse room from Pusher
     * Model reference at: https://pusher.com/docs/chatkit/reference/javascript#room-properties
     *
     * @param {*} roomData
     * @returns
     * @memberof Talktolk
     */
    parseRoom(roomData) {
        const room = {
            ...roomData,
            ...roomData.customData,
        };

        return room;
    }
}

export default Pusher;
