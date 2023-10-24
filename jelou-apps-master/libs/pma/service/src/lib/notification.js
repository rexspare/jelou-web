import ow from "ow";

/**
 * Onesignal service
 * It only exposes static methods
 */
class Notifications {
    /**
     * Send self notification
     * Documentaction about this method can be found in:
     * https://documentation.onesignal.com/docs/web-push-sdk#section--sendselfnotification-
     *
     * @static
     * @param {object} data
     * @param {string} data.title Notification title
     * @param {string} data.message Notification message
     * @param {string} data.url Notification url
     * @param {string?} data.icon Notification icon
     * @param {object?} data.params Aditional notification params a.k.a metadata
     * @param {array} data.buttons Notification buttons
     * @memberof Notifications
     */
    static sendSelf(data) {
        // Validate functions params
        ow(
            data,
            ow.object.exactShape({
                title: ow.string,
                message: ow.string,
                url: ow.string,
            })
        );

        const OneSignal = window.OneSignal || [];
        const { title, message, url, icon = null, params = {}, buttons = [] } = data;

        return OneSignal.sendSelfNotification(title, message, url, icon, params, buttons);
    }
}

export default Notifications;
