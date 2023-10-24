import PusherDriver from "./src/PusherDriver";

const DRIVERS = {
    PUSHER: "pusher",
};

class Channels {
    /**
     * Build channels instance
     * @param {object} payload
     * @param {string} payload.driver
     * @param {object} payload.credentials
     * @param {string} payload.credentials.apiKey
     * @param {string} payload.credentials.cluster
     */
    constructor(payload) {
        switch (payload.driver) {
            case DRIVERS.PUSHER:
                this.provider = new PusherDriver(payload.credentials);
                break;
            default:
                break;
        }
    }

    /**
     * Subscribe to a channel
     * @param {object} payload
     * @param {string} payload.channelName
     */
    subscribe(payload) {
        return this.provider.subscribe(payload);
    }

    /**
     * Subscribe to a channel's event
     * @param {object} payload
     * @param {string} payload.eventName
     */
    on(payload, handler) {
        return this.provider.on(payload, handler);
    }

    /**
     * Unsubscribe from a channel
     * @param {object} payload
     * @param {string} payload.channelName
     */
    unsubscribe(payload) {
        return this.provider.unsubscribe(payload);
    }
}

export default Channels;
