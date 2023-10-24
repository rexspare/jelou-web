import { useTranslation } from "react-i18next";
import Tippy from "@tippyjs/react";
import { ChatSquareIcon, ChatSquareIconNewMessage, DownIcon } from "@apps/shared/icons";
import { TESTER_NAMES, DATASOURCE, DATASTORE, TESTER_SENDER } from "../../constants";
import { useSelector } from "react-redux";
import isEmpty from "lodash/isEmpty";
import { usePrevious } from "@apps/shared/hooks";

const TesterChatButton = (props) => {
    const { openTesterChat, isChatActive, closeTesterChat, messages } = props;
    const { t } = useTranslation();
    const showTesterChat = useSelector((state) => state.showTesterChat);
    const previewMessage = usePrevious(messages);
    const lastItem = messages[messages.length - 1] ?? {};
    const { by: sender = "" } = lastItem;

    const showCommonIcon =
        showTesterChat || isEmpty(previewMessage) || previewMessage === messages || sender !== TESTER_SENDER.ARTIFICIAL_INTELLIGENCE;
    return (
        <Tippy
            theme="light"
            content={
                <span className="text-gray-400">
                    {`${t("brain.activateChatInstruction")} ${DATASOURCE.PLURAL_LOWER} ${t("common.toYour")} ${DATASTORE.SINGULAR_LOWER}`}
                </span>
            }
            placement="top-end"
            trigger={!isChatActive ? "mouseenter" : "manual"}
            arrow={false}
            animation="scale-subtle"
            touch={false}>
            <div className="absolute bottom-[2rem] right-[2rem] flex h-16 items-center justify-end">
                {showTesterChat ? (
                    <button onClick={closeTesterChat} className="h-12 w-12 rounded-full bg-primary-200 text-white">
                        <DownIcon fill="currentColor" />
                    </button>
                ) : (
                    <button
                        onClick={openTesterChat}
                        disabled={!isChatActive}
                        className="button-primary flex h-11 w-28 items-center justify-center gap-x-2 px-6 py-2 shadow-md">
                        {showCommonIcon ? (
                            <ChatSquareIcon width="20px" height="20px" className={`${isChatActive ? "text-white" : "text-neutral-300"}`} />
                        ) : (
                            <ChatSquareIconNewMessage />
                        )}
                        <span>{TESTER_NAMES.BUTTON}</span>
                    </button>
                )}
            </div>
        </Tippy>
    );
};

export default TesterChatButton;
