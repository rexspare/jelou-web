import cloneDeep from "lodash/cloneDeep";
import isEmpty from "lodash/isEmpty";
import get from "lodash/get";
import toUpper from "lodash/toUpper";

import { Store, updateRoom } from "@apps/redux/store";
import { getUnreadMessages } from "libs/pma/sidebar/src/lib/services/UnreadMessages";

export function resetCounter({ roomId, providerId, updateMetadataRoom }) {
    const room = cloneDeep(updateMetadataRoom);
    const hasMetaInfo = room?.membersMetaInfo[providerId];

    if (!isEmpty(hasMetaInfo) && hasMetaInfo.unreadMessages > 0) {
        room.membersMetaInfo[providerId].unreadMessages = 0;

        try {
            getUnreadMessages(roomId);
        } catch (error) {
            console.error("fallo al resetear el contador en el backend", { error, roomId, providerId });
        }
    }

    return Promise.resolve(room);
}

export function messageCounter({ by, roomId, providerId }) {
    const { currentRoom, rooms } = Store.getState();

    const roomNewMessage = rooms.find((room) => room.id === roomId);
    const updateMetadataRoom = cloneDeep(roomNewMessage);

    const userMessage = toUpper(by) === toUpper("user");

    const hasMetaInfo =
        !isEmpty(updateMetadataRoom) && !isEmpty(updateMetadataRoom?.membersMetaInfo) && !isEmpty(updateMetadataRoom.membersMetaInfo[providerId]);

    if (currentRoom.id === roomId && hasMetaInfo) {
        return resetCounter({ roomId, providerId, updateMetadataRoom }).then((room) => {
            Store.dispatch(updateRoom(room));
            return room;
        });
    }

    if (hasMetaInfo) {
        const currentCounter = updateMetadataRoom.membersMetaInfo[providerId].unreadMessages;
        const isNewMemberDataInfo = get(updateMetadataRoom, `membersMetaInfo[${providerId}].isNew`, false);

        const nextMetaRoom = {
            ...updateMetadataRoom,
            membersMetaInfo: {
                ...updateMetadataRoom.membersMetaInfo,
                [providerId]: {
                    unreadMessages: userMessage ? currentCounter + 1 : currentCounter,
                    isNew: isNewMemberDataInfo,
                },
            },
        };

        Store.dispatch(updateRoom(nextMetaRoom));
        return nextMetaRoom;
    }

    return updateMetadataRoom;
}

export const addFirstCounterToNewRoom = ({ room, providerId }) => {
    const addMetaInfoReadCount = {
        ...room,
        membersMetaInfo: {
            ...(room?.membersMetaInfo || {}),
            [providerId]: {
                unreadMessages: 1,
            },
        },
    };

    return addMetaInfoReadCount;
};
