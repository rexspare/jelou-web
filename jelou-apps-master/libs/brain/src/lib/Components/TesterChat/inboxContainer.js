import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { SendIconInCircle } from "@apps/shared/icons";
import { EVENT_KEY } from "@apps/shared/constants";
import { COMPONENT_NAME } from "../../constants";
import isEmpty from "lodash/isEmpty";
import TextareaAutosize from "react-autosize-textarea";

const TesterChatInboxContainer = (props) => {
    const { question, handleMessageChange, handleSendMessage, isLoading, isLoadingHistory } = props;
    const { t } = useTranslation();
    const inputRef = useRef(null);

    useEffect(() => {
        inputRef.current.focus();
    }, []);

    const handleKeyDown = (event) => {
        if (event.key === EVENT_KEY.ENTER) {
            event.preventDefault();
            handleSendMessage();
        }
    };

    const handlePressButton = () => {
        handleSendMessage();
    };

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, [isLoading]);

    return (
        <div className="rounded-b-xl border-t-1 border-neutral-200 bg-white p-3 px-3">
            <div className="h-max-10 flex h-auto w-full items-center justify-between gap-x-3 rounded-lg border-1 border-neutral-200 bg-neutral-100 p-2">
                <TextareaAutosize
                    autoFocus
                    className={`${
                        isLoading || isLoadingHistory ? "cursor-not-allowed" : ""
                    } h-auto w-full resize-none border-0 bg-transparent text-sm placeholder:text-[#B0B6C2] focus:ring-transparent focus-visible:outline-none`}
                    maxRows={10}
                    placeholder={t("common.writeAMessage")}
                    onChange={handleMessageChange}
                    disabled={isLoading || isLoadingHistory}
                    value={question}
                    onKeyDown={handleKeyDown}
                    ref={inputRef}
                    name={COMPONENT_NAME.CHAT_INPUT}
                    autoComplete={"on"}
                    spellCheck={true}
                />
                <button
                    disabled={isEmpty(question)}
                    onClick={handlePressButton}
                    className={`${isEmpty(question) && "cursor-not-allowed"} w-auto`}
                    type="reset">
                    <SendIconInCircle fill="#003439" />
                </button>
            </div>
        </div>
    );
};

export default TesterChatInboxContainer;
