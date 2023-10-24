import ow from "ow";
const Pusher = require("pusher-js");

class PusherDriver {
    /**
     * @param {object} credentials Credentials to use Pusher
     * @param {string} credentials.apiKey
     * @param {string} credentials.cluster
     * @param {string} credentials.mode
     */
    constructor(credentials) {
        ow(
            credentials,
            ow.object.partialShape({
                apiKey: ow.string,
                cluster: ow.string,
                mode: ow.optional.string,
            })
        );
        if (credentials.mode === "develop") {
            Pusher.logToConsole = true;
        }
        this.provider = new Pusher(credentials.apiKey, {
            cluster: credentials.cluster,
        });
    }

    /**
     * Subscribe to a channel
     * @param {object} payload
     * @param {string} payload.channelName Name of the channel to subscribe to
     */
    subscribe(payload) {
        ow(
            payload,
            ow.object.partialShape({
                channelName: ow.string,
            })
        );
        this.channel = this.provider.subscribe(payload.channelName);
        return this.channel;
    }

    /**
     * Subscribe to a channel's event
     * @param {object} payload
     * @param {string} payload.eventName Name of the event to listen to
     */
    on(payload, handler) {
        ow(
            payload,
            ow.object.partialShape({
                eventName: ow.string,
            })
        );
        this.channel.bind(payload.eventName, handler);
    }

    /**
     * Unsubscribe from a channel
     * @param {object} payload
     * @param {string} payload.channelName Name of the channel to subscribe to
     */
    unsubscribe(payload) {
        ow(
            payload,
            ow.object.partialShape({
                channelName: ow.string,
            })
        );
        return this.provider.unsubscribe(payload.channelName);
    }
}

export default PusherDriver;
