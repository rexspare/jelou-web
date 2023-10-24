import first from "lodash/first";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import isNil from "lodash/isNil";
import sortBy from "lodash/sortBy";

import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";

import { Bubble } from "@apps/shared/bubble";
import { usePrevious } from "@apps/shared/hooks";
import { JelouApiV1 } from "@apps/shared/modules";
import styles from "./messages.module.scss";

const Messages = (props) => {
    const { loadingSkeleton, messages, currentRoom, setLoadingMessages, setMess, loadingRefresh } = props;
    const bots = useSelector((state) => state.bots);
    const [previousHeight, setPreviousHeight] = useState(0);
    const timeline = useRef();
    const company = useSelector((state) => state.company);
    const prevMessages = usePrevious(messages);

    const getPreviousMessages = async (_id) => {
        try {
            const { clientId: username, clientSecret: password } = company;
            if (!isEmpty(username) && !isEmpty(password) && !isEmpty(currentRoom)) {
                const id = get(currentRoom, "botId", get(currentRoom, "bot.id", {}));
                const referenceId = get(currentRoom, "referenceId", get(currentRoom, "user.id", {}));

                const { data } = await JelouApiV1.get(`/bots/${id}/users/${referenceId}/v2/history`, {
                    params: {
                        limit: 20,
                        _id,
                        includeEvents: true,
                    },
                });
                const { chat } = data;
                return chat;
            }
        } catch (error) {
            console.log("error ", error);
        }
    };

    const getEarlyMessages = () => {
        const sortedMessages = sortBy(messages, (data) => {
            const fecha = new Date(data.createdAt);
            if (isValidDate(fecha)) {
                return new Date(data.createdAt);
            } else {
                return new Date(data.createdAt);
            }
        });
        return first(sortedMessages);
    };

    const isValidDate = (d) => {
        return d instanceof Date && !isNaN(d);
    };

    useEffect(() => {
        if (!isEmpty(currentRoom)) {
            scrollToBottom();
        }
    }, [currentRoom]);

    useEffect(() => {
        // scroll when more messages than before
        if (!isNil(prevMessages) && prevMessages?.length < messages.length && timeline.current.scrollTop === 0) {
            try {
                timeline.current.scrollBy({
                    top: timeline.current.scrollHeight - previousHeight,
                    left: 0,
                    behavior: "auto",
                });
            } catch (error) {
                console.log("error ", error);
            }
        }
    }, [messages]);

    const scrollToBottom = () => {
        timeline.current.scrollBy({
            top: 1000000000000,
            behavior: "smooth",
        });
    };

    const onScroll = async (evt) => {
        try {
            const target = evt.target;
            if (messages.length === 0) {
                return;
            }
            if (target.scrollTop === 0) {
                setLoadingMessages(true);
                const { _id } = getEarlyMessages();

                const prevScrollHeight = target.scrollHeight;
                setPreviousHeight(prevScrollHeight);

                let data = await getPreviousMessages(_id);
                let updatedConversation = [...messages];
                if (!isEmpty(data)) {
                    data = data.map((message) => {
                        updatedConversation.push(message);
                        return message;
                    });

                    setMess(updatedConversation);
                }
                setLoadingMessages(false);
            }
        } catch (err) {
            setLoadingMessages(false);
            console.log(err);
        }
    };

    const sortedMessages = sortBy(messages, ["createdAt"]);

    return (
        <div className="mb-12 ml-6 flex flex-1 flex-row overflow-y-auto rounded-br-xl" ref={timeline} onScroll={onScroll}>
            <div className="relative flex-1">
                {!isEmpty(messages) && !loadingRefresh
                    ? sortedMessages.map((message, index) => {
                          const textMessage = get(message, "bubble.text", null);
                          const type = get(message, "bubble.type", null);

                          if (type === "TEXT" && isEmpty(textMessage)) {
                              return null;
                          }

                          const prevBubble = sortedMessages[index - 1];

                          return (
                              <Bubble
                                  message={message}
                                  key={index}
                                  bots={bots}
                                  timeline={timeline}
                                  inbox=""
                                  app="MONITORING"
                                  openNewChat=""
                                  prevBubble={prevBubble}
                                  styles={styles}
                              />
                          );
                      })
                    : loadingSkeleton}
            </div>
        </div>
    );
};

export default Messages;
