import isEmpty from "lodash/isEmpty";
import { useState } from "react";
import { withTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { GridLoader } from "react-spinners";

import { ConversationSkeleton } from "@apps/shared/common";
import { ChatHeader, Messages } from "../../index";

const Chat = (props) => {
    const currentRoom = useSelector((state) => state.currentRoom);
    const conversationMessages = props.mess;
    const { isLoadingConversations, setMess, showConversation, loadingChat } = props;
    const [loadingMessages, setLoadingMessages] = useState(false);
    const [loadingRefresh, setLoadingRefresh] = useState(false);
    const { t } = props;

    let loadingSkeleton = [];

    for (let i = 0; i < 8; i++) {
        loadingSkeleton.push(<ConversationSkeleton key={i} />);
    }

    return (
        <div className="relative flex-col hidden w-full bg-white rounded-br-xl sm:flex sm:flex-1">
            {isLoadingConversations || loadingChat ? (
                <div className="flex flex-row flex-1 overflow-hidden">
                    <div className="relative flex-1">{loadingSkeleton}</div>
                </div>
            ) : isEmpty(currentRoom) && isEmpty(conversationMessages) ? (
                <div className="items-center max-w-md pt-10 m-auto text-xl text-center text-black text-opacity-25">
                    {t("No existen conversaciones en el rango de fechas seleccionado")}
                </div>
            ) : (
                !isEmpty(currentRoom) &&
                !isEmpty(conversationMessages) && (
                    <>
                        <ChatHeader
                            dailyConversations={props.dailyConversations}
                            currentRoom={currentRoom}
                            showConversation={showConversation}
                            setLoading={setLoadingRefresh}
                        />
                        {loadingMessages && (
                            <div className="mt-97 absolute top-[6rem] z-100 flex w-full justify-center py-5">
                                <GridLoader size={12} color={"#00B3C7"} />
                            </div>
                        )}
                        <Messages
                            setLoadingMessages={setLoadingMessages}
                            messages={conversationMessages}
                            loadingSkeleton={loadingSkeleton}
                            currentRoom={currentRoom}
                            setMess={setMess}
                            loadingRefresh={loadingRefresh}
                        />
                    </>
                )
            )}
        </div>
    );
};

export default withTranslation()(Chat);
