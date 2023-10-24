import { useDispatch, useSelector } from "react-redux";
import { JelouApiV1 } from "@apps/shared/modules";
import emojiStrip from "emoji-strip";
import Avatar from "react-avatar";
import dayjs from "dayjs";
import "dayjs/locale/es";
import { default as get, default as has } from "lodash/get";
import isEmpty from "lodash/isEmpty";
import sum from "lodash/sum";

import { setCurrentRoom, addClientsMessages } from "@apps/redux/store";
import { AngryIcon, HappyIcon, NeutralIcon } from "@apps/shared/icons";

const Room = ({ room, setMess, setLoadingChangeChat, isDeleted }) => {
    const dispatch = useDispatch();
    const { user, operator, lastMessageAt, _metadata = {} } = room;

    const currentRoom = useSelector((state) => state.currentRoom);
    const company = useSelector((state) => state.company);

    const isCurrent = get(currentRoom, "_id", null) === get(room, "_id", undefined);

    const getDisplayName = () => {
        const {
            storedParams = {},
            user: { names: userName },
        } = room;
        const { name = "", Nombre = "" } = storedParams;
        const { names = "Desconocido" } = user;

        if (!isEmpty(name)) return name;
        if (!isEmpty(userName)) return userName;
        if (!isEmpty(Nombre)) return Nombre;
        if (!isEmpty(names)) {
            return names;
        } else {
            return "Desconocido";
        }
    };

    const displayName = getDisplayName();

    const showChat = (room) => {
        const { _id } = room;
        if (currentRoom._id === _id) {
            return;
        } else {
            setMess([]);
            setLoadingChangeChat(true);
            const { id } = room.bot;
            const { referenceId } = room.user;
            const { clientId: username, clientSecret: password } = company;
            if (!isEmpty(username) && !isEmpty(password)) {
                JelouApiV1.get(`/bots/${id}/users/${referenceId}/v2/history`, {
                    params: {
                        limit: 20,
                        _id: room.lastMessage._id,
                        direction: "older_equal",
                        includeEvents: true,
                    },
                }).then((res) => {
                    let updatedConversation = [];
                    res.data.chat.forEach((message) => {
                        updatedConversation.push(message);
                    });
                    setMess(updatedConversation);
                    dispatch(addClientsMessages(updatedConversation));
                    setLoadingChangeChat(false);
                });
            }
            dispatch(setCurrentRoom(room));
        }
    };

    function getScore(type) {
        const { _metadata = {} } = room;
        const { clientSentimentScore, operatorSentimentScore } = _metadata;

        if (!clientSentimentScore || !operatorSentimentScore) {
            return 0;
        }

        const scores = [];
        scores.push(clientSentimentScore[type]);
        scores.push(operatorSentimentScore[type]);

        const prom = sum(scores) / 2;

        return Math.round(prom * 100);
    }

    const conversationStyle = `relative sm:py-2 pl-4 pr-2 flex items-center w-full cursor-pointer select-none border-b-1 border-gray-100 border-opacity-25 h-18 sm:h-24 
        ${isDeleted ? "hover:bg-red-13/50" : "hover:bg-conversation"}`;
    const conversationActive = isDeleted ? "deletedConversationActive" : "conversationActive";

    const hasSentiment = !!(has(_metadata, "clientSentimentScore") && has(_metadata, "operatorSentimentScore"));

    const colorRoom = isCurrent ? (isDeleted ? "#f56565" : "#2A8BF2") : isDeleted ? "#FDEFED" : "#D7EAFF";

    const colorText = isCurrent ? "#f8fafc" : "#767993";

    return (
        <div className={isCurrent ? conversationActive : conversationStyle} onClick={() => showChat(room)}>
            <div className="flex w-full flex-col text-gray-500">
                <div className="relative flex flex-row items-center">
                    <Avatar
                        round={true}
                        size="2.438rem"
                        color={colorRoom}
                        textSizeRatio={2}
                        fgColor={colorText}
                        name={emojiStrip(displayName)}
                        className="mr-3 font-semibold"
                    />
                    <div className="flex w-full flex-col">
                        <div className="flex items-center text-base font-medium">
                            <span className={`w-40 truncate text-gray-500 ${isCurrent ? "font-bold" : "font-normal"}`}>{displayName}</span>
                        </div>
                        {hasSentiment && (
                            <div className="mb-1 flex items-center justify-start text-gray-500">
                                <div className="mr-2 flex items-center">
                                    <HappyIcon className="mr-1 fill-current text-green-600" height="12px" width="12px" />
                                    <span className="text-xs">{getScore("Neutral")}%</span>
                                </div>
                                <div className="mr-2 flex items-center">
                                    <NeutralIcon className="mr-1 fill-current text-gray-600" height="12px" width="12px" />
                                    <span className="text-xs">{getScore("Positive")}%</span>
                                </div>
                                <div className="flex items-center">
                                    <AngryIcon className="mr-1 fill-current text-red-675" height="12px" width="12px" />
                                    <span className="text-xs">{getScore("Negative")}%</span>
                                </div>
                            </div>
                        )}
                        <div className="block w-48 truncate text-sm opacity-75">{operator?.names ?? ""}</div>
                    </div>
                </div>
                <div className="absolute bottom-0 right-0 pr-2 text-11 font-medium text-gray-500">
                    <span className="text-11 opacity-75">{dayjs(lastMessageAt).format("DD/MM/YY")}</span>
                </div>
            </div>
        </div>
    );
};

export default Room;
