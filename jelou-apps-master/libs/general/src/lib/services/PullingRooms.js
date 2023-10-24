import { addRooms, Store, setChatNotification } from "@apps/redux/store";

const pullingRooms = async ({ chatManager = null, providerId = null } = {}) => {
    console.log("polling");

    if (!chatManager || !providerId) {
        console.warn("no tengo estas variables ", { chatManager, providerId });
        return;
    }

    const chatService = chatManager ?? Object.getPrototypeOf(chatManager);

    try {
        const rooms = await chatService.getRooms({ providerId });
        Store.dispatch(addRooms(rooms));
        Store.dispatch(setChatNotification(rooms.length));
    } catch (error) {
        console.warn("error polling", { error });
    }
};
export default pullingRooms;
