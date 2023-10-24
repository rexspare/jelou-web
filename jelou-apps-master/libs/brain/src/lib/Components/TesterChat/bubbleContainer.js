import get from "lodash/get";
import sortBy from "lodash/sortBy";
import { useEffect, useRef, useState } from "react";

import HistoryMessages from "./historyMessages";
import NewMessages from "./newMessages";

const TesterChatBubbleContainer = ({ messages, isLoading, data, isLoadingHistory, answerIAStream }) => {
    const bubbleContainerRef = useRef(null);
    const [messagesHistory, setMessagesHistory] = useState([]);

    useEffect(() => {
        setMessagesHistory(get(data, "data", []));
    }, [data]);

    useEffect(() => {
        if (bubbleContainerRef.current) {
            bubbleContainerRef.current.scrollTop = bubbleContainerRef.current.scrollHeight;
        }
    }, [messages, answerIAStream]);

    const sortedMessages = sortBy(messagesHistory, "created_at");

    return (
        <section ref={bubbleContainerRef} className="flex-grow overflow-y-auto p-5">
            <HistoryMessages messages={sortedMessages} isLoading={isLoadingHistory} />
            <NewMessages messages={messages} isLoading={isLoading} />
            {answerIAStream && (
                <div className="mb-3 flex max-w-[80%] flex-col whitespace-pre-line break-words rounded-lg bg-primary-350 p-4 text-sm text-gray-610 xl:text-sm">
                    {answerIAStream}
                </div>
            )}
        </section>
    );
};

export default TesterChatBubbleContainer;
