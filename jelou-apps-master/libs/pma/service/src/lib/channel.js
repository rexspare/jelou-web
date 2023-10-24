import Channels from "@01labec/channels-client";
import { setUserSession, setStatusOperator, addRooms, Store } from "@apps/redux/store";
import toUpper from "lodash/toUpper";
import * as Sentry from "@sentry/react";

const { NX_REACT_APP_PUSHER_KEY, NX_REACT_APP_PUSHER_CLUSTER } = process.env;

const operatorLogIn = (operator) => {
    const { userSession: user } = Store.getState();
    if (operator.id === user.id && toUpper(operator.status) === "ONLINE" && operator.uniqueSession && operator.sessionId !== user.sessionId) {
        // PREGUNTAR QE HACER CON ESTO
        // Store.dispatch({
        //     type: LOGOUT,
        // });
        Store.dispatch(setUserSession());

        localStorage.removeItem("jwt");
        window.location = "/login";
        return;
    }
};

const checkFormRoom = async (data, chatManagerInstance) => {
    // Check if room is on redux
    const { roomId, operatorId } = data;
    const { rooms, userSession } = Store.getState();
    const room = rooms.find((room) => room.id === roomId);

    // If Room is already present do nothing
    if (room) {
        return;
    }

    // If event is not for the current operator do nothing
    if (userSession.operatorId !== operatorId) {
        return;
    }

    // If not send a Sentry Alert
    Sentry.setExtra("roomId", roomId);
    Sentry.captureException(new Error(`A room is not present on operator(${userSession.names}) frontend.`));

    // If room is not present fetch rooms again
    try {
        const roomsResponse = await chatManagerInstance.getRooms();

        const isRoomOnResponse = roomsResponse.find((room) => room.id === roomId);
        Store.dispatch(addRooms(roomsResponse));

        // If room is not present on the response send another alert on sentry
        if (!isRoomOnResponse) {
            Sentry.setExtra("RoomResponse", JSON.stringify(roomsResponse, null, 2));
            Sentry.captureException(new Error(`The room(${roomId}) is not present on the response`));
        }
    } catch (error) {
        console.error(error);
    }
};

export default function Channel(companyId, chatManagerInstance) {
    const channelsCredentials = {
        driver: "pusher",
        credentials: {
            apiKey: NX_REACT_APP_PUSHER_KEY,
            cluster: NX_REACT_APP_PUSHER_CLUSTER,
        },
    };

    const channel = new Channels(channelsCredentials);
    channel.subscribe({ channelName: `channel-company-${companyId}` });

    channel.on({ eventName: "operator-login" }, (operator) => operatorLogIn(operator));

    channel.on({ eventName: "operator-assign" }, (data) => checkFormRoom(data, chatManagerInstance));

    channel.on({ eventName: "operator-status-update" }, (operator) => {
        const { userSession } = Store.getState();
        if (operator.id.toString() === userSession.operatorId.toString()) {
            Store.dispatch(setStatusOperator(operator.status));
        }
    });
}
