import Tippy from "@tippyjs/react";
import emojiStrip from "emoji-strip";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import toUpper from "lodash/toUpper";
import { Suspense, useState } from "react";
import Avatar from "react-avatar";
import { withTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import { setCurrentRoom } from "@apps/redux/store";
import { DownloadIcon, MessageIcon, RefreshIcon, TrashIcon } from "@apps/shared/icons";
import { JelouApiV1 } from "@apps/shared/modules";
import { BotType, useLabels } from "../../index";
import DeleteConversationModal from "../delete-conversation-modal/DeleteConversationModal";
import { DeleteConversationSliderOver } from "../delete-conversation-modal/DeleteConversationSliderOver";

const DELTE_CONVERSATION_PERMISSION = "monitoring:delete_conversation";

const Header = (props) => {
    const { currentRoom, t, showConversation, setLoading, dailyConversations } = props;
    const [loadingRefresh, setLoadingRefresh] = useState(false);
    const { names = null, referenceId, legalId } = get(currentRoom, "user", {});
    const conversationId = get(currentRoom, "_id", {});
    const botId = get(currentRoom, "bot.id", {});
    const type = get(currentRoom, "bot.type", {});
    const state = get(currentRoom, "state", "UNDEFINED");
    const origin = get(currentRoom, "origin", "UNDEFINED");
    const wasReplied = get(currentRoom, "wasReplied", false);
    const dispatch = useDispatch();

    const [conversationDetailDrawer, setConversationDetailDrawer] = useState(false);

    const permissions = useSelector((state) => state.permissions);

    const [showDeleteCoversationModal, setShowDeleteCoversationModal] = useState(false);
    const permissionsDeleteConversation = permissions.find((permission) => permission === DELTE_CONVERSATION_PERMISSION);

    const endedReason = get(currentRoom, "endedReason", "UNDEFINED");
    const displayName = get(currentRoom, "storedParams.name", names ?? "Desconocido");

    const { renderEndedReason, renderOriginBadge, renderRepliedBadge, renderStatus } = useLabels();

    const conversationDeleted = get(currentRoom, "deleted", false);
    const showDeleteConversationIcon = permissionsDeleteConversation && conversationDeleted === false && toUpper(state) !== "ACTIVE";
    const showMetadataDeletedConversationIcon = permissionsDeleteConversation && conversationDeleted === true;

    const refreshConversation = async () => {
        try {
            setLoadingRefresh(true);
            setLoading(true);
            const { data } = await JelouApiV1.get(`/bots/${botId}/conversations/${conversationId}`);
            if (toUpper(state) === "ACTIVE") showConversation(data.data);
            dispatch(
                setCurrentRoom({
                    ...currentRoom,
                    endedReason: get(data, "data.endedReason", currentRoom.endedReason),
                    chat: get(data, "data.chat", currentRoom.chat),
                    origin: get(data, "data.origin", currentRoom.origin),
                    assignationMethod: get(data, "data.assignationMethod", currentRoom.assignationMethod),
                    state: get(data, "data.state", currentRoom.state),
                    wasExpired: get(data, "data.wasExpired", currentRoom.wasExpired),
                    wasClosed: get(data, "data.wasClosed", currentRoom.wasClosed),
                    wasReplied: get(data, "data.wasReplied", currentRoom.wasReplied),
                    startAt: get(data, "data.startAt", currentRoom.startAt),
                    lastMessageAt: get(data, "data.lastMessageAt", currentRoom.lastMessageAt),
                    firstRepliedAtOperator: get(data, "data.firstRepliedAtOperator", currentRoom.firstRepliedAtOperator),
                    ...(!isEmpty(get(data, "data.storedParams", {})) ? { storedParams: get(data, "data.storedParams", {}) } : {}),
                    ...(!isEmpty(get(data, "data._metadata", {})) ? { _metadata: get(data, "data._metadata", {}) } : {}),
                })
            );

            setTimeout(() => {
                setLoadingRefresh(false);
                setLoading(false);
            }, 1000);
        } catch (error) {
            console.log(error, "error");
        }
    };

    return (
        <div className="white flex h-18 w-full flex-row items-center border-b-default border-gray-100/25 px-5 lg:py-2">
            <div className="flex items-center text-xl">
                <div className="flex h-12 items-center border-r-default border-gray-100/25 pr-5">
                    <Avatar
                        name={emojiStrip(displayName)}
                        className="mr-4 font-semibold"
                        size="2.438rem"
                        round={true}
                        color="#2A8BF2"
                        textSizeRatio={2}
                    />
                    <div className="flex flex-col">
                        <span className="max-w-64 truncate text-lg font-bold leading-normal text-gray-500">{displayName}</span>
                        {!isEmpty(legalId) && <span className="flex text-sm font-medium text-gray-500">C.I. {legalId}</span>}
                    </div>
                </div>
            </div>
            {!isEmpty(referenceId) && (
                <div className="hidden md:flex lg:ml-4">
                    <div className="flex h-8 items-center justify-center text-sm font-medium text-gray-500">
                        <BotType type={type} />
                        {toUpper(type) === "WHATSAPP" && <span className="text-15">{referenceId.replace("+593", "0").replace("@c.us", "")}</span>}
                    </div>
                    <div className="ml-4 flex space-x-2">
                        {toUpper(state) === "ACTIVE" && renderStatus(state)}
                        {toUpper(state) !== "ACTIVE" && renderEndedReason(endedReason)}
                        {renderRepliedBadge(wasReplied)}
                        {renderOriginBadge(origin)}
                    </div>
                </div>
            )}

            <div className="flex flex-1 justify-end gap-3">
                {showDeleteConversationIcon && (
                    <Tippy content={t("monitoring.deleteConversation")} theme={"jelou"} arrow={false} placement={"top"}>
                        <button
                            onClick={() => setShowDeleteCoversationModal(true)}
                            className="flex items-center justify-center rounded-full bg-gray-20 text-gray-425 lg:h-8 lg:w-8">
                            <TrashIcon width="1.2rem" height="1.2rem" fill="currentColor" />
                        </button>
                    </Tippy>
                )}

                <Tippy content={t("hsm.refresh")} theme={"jelou"} arrow={false} placement={"top"}>
                    <button
                        onClick={() => {
                            if (!loadingRefresh) refreshConversation();
                        }}
                        className="flex items-center justify-center rounded-full bg-gray-20 text-gray-425 lg:h-8 lg:w-8">
                        <RefreshIcon width="1.2rem" height="1.2rem" stroke={"inherit"} className={`${loadingRefresh ? "animate-spinother" : ""}`} />
                    </button>
                </Tippy>
                <Tippy theme="jelou" arrow={false} placement={"top"} content={t("common.download")}>
                    <Link
                        className="flex items-center justify-center rounded-full bg-primary-200 text-white lg:h-8 lg:w-8"
                        to={`/monitoring/conversation/download/${botId}/${conversationId}`}
                        target="_blank">
                        <DownloadIcon width="0.813rem" height="0.875rem" fill="white" />
                    </Link>
                </Tippy>

                {showMetadataDeletedConversationIcon && (
                    <Tippy content={t("clients.deletedChatDetail")} theme={"tomato"} placement={"top"}>
                        <button onClick={() => setConversationDetailDrawer(true)} className="rounded-full bg-[#D9F4F7] text-white lg:h-8 lg:w-8">
                            <MessageIcon width="1.2rem" height="1.2rem" fill="#00B3C7" />
                        </button>
                    </Tippy>
                )}
            </div>

            <DeleteConversationSliderOver room={currentRoom} open={conversationDetailDrawer} setOpen={setConversationDetailDrawer} />

            {showDeleteCoversationModal && (
                <Suspense fallback={null}>
                    <DeleteConversationModal
                        displayName={displayName}
                        dailyConversations={dailyConversations}
                        conversationId={conversationId}
                        closeModal={() => setShowDeleteCoversationModal(false)}
                        isShowModal={showDeleteCoversationModal}
                    />
                </Suspense>
            )}
        </div>
    );
};

export default withTranslation()(Header);
