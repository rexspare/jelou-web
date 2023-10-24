import styles from "./clients-bubbles.module.css";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import isNil from "lodash/isNil";
import compact from "lodash/compact";
import React, { useEffect } from "react";

import { Bubble } from "@apps/shared/bubble";
import { usePrevious } from "@apps/shared/hooks";
// import NewChat from "../components/NewChat";

const Bubbles = (props) => {
    const { sortedMessages, className, timeline, handleScroll, query, field, previousScroll } = props;
    const prevMessages = usePrevious(sortedMessages);

    useEffect(() => {
        if (!isNil(prevMessages) && prevMessages?.length < sortedMessages.length && timeline.current.scrollTop === 0) {
            try {
                timeline.current.scrollBy({
                    top: timeline.current.scrollHeight - previousScroll,
                    left: 0,
                    behavior: "auto",
                });
            } catch (error) {
                console.log("error ", error);
            }
        }
    }, [sortedMessages]);

    return (
        <div id="timeline" className={`relative flex-1 overflow-x-hidden ${className}`} ref={timeline} onScroll={handleScroll}>
            {compact(sortedMessages).map((message, index) => {
                // Sometimes the text message is empty
                // This happens on venom bots
                const textMessage = get(message, "message.text", null);
                const type = get(message, "message.type", null);
                const { _id } = message;

                if (type === "TEXT" && isEmpty(textMessage)) {
                    return null;
                }

                // Prev Bubble
                const prevBubble = sortedMessages[index - 1];

                return (
                    <Bubble
                        id={_id}
                        messageId={_id}
                        styles={styles}
                        message={message}
                        prevBubble={prevBubble}
                        key={index}
                        query={query}
                        field={field}
                        app="CLIENTS"
                    />
                );
            })}
        </div>
    );
};

const customComparator = (prevProps, nextProps) => {
    // sortedMessages, className, timeline, handleScroll, query, field
    return nextProps.sortedMessages === prevProps.sortedMessages && nextProps.query === prevProps.query && nextProps.field === prevProps.field;
};

export default React.memo(Bubbles, customComparator);
