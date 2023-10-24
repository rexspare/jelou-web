import { useEffect, useState } from "react";

import { JelouApiV1 } from "@apps/shared/modules";

export const getRoomData = async ({ roomId = null } = {}) => {
    if (!roomId) throw new Error("empty data roomId", { roomId });

    try {
        const response = await JelouApiV1.get(`/rooms/${roomId}`);

        if (response.status === 200) {
            return response.data;
        }

        throw new Error("Error getting stored params");
    } catch (err) {
        console.log(err);
        throw err;
    }
};

export default function useDetailsConversation(currentRoom) {
    // const currentRoom = useSelector((state) => state.currentRoom);
    const [loadingProfile, setLoadingProfile] = useState(false);
    const [detailConversation, setDetailConversation] = useState({});

    useEffect(() => {
        const { roomId: idArchive = null, id: idChat = null } = currentRoom;

        if (!idArchive && !idChat) {
            console.error("empty idArchivate or idChat", { idArchive: idArchive, idChat });
            return;
        }

        const roomId = idArchive ?? idChat;

        setLoadingProfile(true);
        getRoomData({ roomId })
            .then((data) => {
                setDetailConversation(data.data);
            })
            .catch((err) => {
                console.log(err);
            })
            .finally(() => {
                setLoadingProfile(false);
            });
    }, [currentRoom]);

    return { detailConversation, loadingProfile };
}
