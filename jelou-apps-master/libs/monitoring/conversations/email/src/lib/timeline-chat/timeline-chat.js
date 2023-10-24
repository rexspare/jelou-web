import "dayjs/locale/es";
import "dayjs/locale/en";
import dayjs from "dayjs";
import sortBy from "lodash/sortBy";
import EmailBubble from "../email-bubble/email-bubble";

const TimelineChat = (props) => {
    const { setFromMessage, scrollUpRef } = props;

    const sortedMessages = sortBy(props.sortedMessages, (data) => {
        return dayjs(data.createdAt);
    });

    return (
        <div className={`flex w-full flex-1 flex-col`}>
            <div className="space-y-4 lg:flex lg:flex-col">
                {sortedMessages.map((email, index) => {
                    const isLast = index + 1 === sortedMessages.length;
                    return (
                        <div className="overflow-hidden rounded-1 shadow-inner" key={index}>
                            <div className="flex w-full flex-col">
                                <div className="flex flex-row overflow-hidden rounded-1">
                                    <div className="relative flex w-full flex-col overflow-hidden rounded-1 bg-white">
                                        <EmailBubble
                                            setFromMessage={setFromMessage}
                                            message={email}
                                            key={index}
                                            isLast={isLast}
                                            scrollUpRef={scrollUpRef}
                                        />{" "}
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default TimelineChat;
