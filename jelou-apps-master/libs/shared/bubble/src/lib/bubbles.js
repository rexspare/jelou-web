import styles from "./pma-bubbles.module.scss";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import compact from "lodash/compact";

import Bubble from "@apps/shared/bubble";
import NewChat from "./new-chat/new-chat";

const Bubbles = (props) => {
    const { sortedMessages, className, timeline, handleScroll, openNewChat, openModal, inbox = false } = props;

    return (
        <div className={`relative flex-1 overflow-x-hidden ${className}`} ref={timeline} onScroll={handleScroll}>
            {compact(sortedMessages).map((message, index) => {
                // Sometimes the text message is empty
                // This happens on venom bots
                const textMessage = get(message, "message.text", null);
                const type = get(message, "message.type", null);

                if (type === "TEXT" && isEmpty(textMessage)) {
                    return null;
                }

                // Prev Bubble
                const prevBubble = sortedMessages[index - 1];

                return <Bubble message={message} prevBubble={prevBubble} key={index} openNewChat={openNewChat} inbox={inbox} styles={styles} />;
            })}

            {openModal ? <NewChat message={props.message} openModal={props.openModal} closeModal={props.closeModal} /> : null}
        </div>
    );
};

export default Bubbles;
