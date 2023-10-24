import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import EmailTags from "../email-tags/email-tags";
import TimelineEmail from "../timeline-email/timeline-email";

export const SeeEmail = ({ currentEmail, selectedRow, scrollUpRef, sortedMessages, disableAddTag = true, isPublicEmail = false } = {}) => {
    const ticketIsClosed = get(currentEmail, "status", "") === "closed";

    const getTitle = () => {
        if (!isEmpty(selectedRow)) {
            return get(selectedRow, "title");
        }
        if (!isEmpty(currentEmail)) {
            return get(currentEmail, "title", get(currentEmail, "subject", "-"));
        }
        return "-";
    };

    return (
        <div>
            <div className="flex w-full flex-col mid:rounded-l-xl">
                <div className="my-6 grid gap-5">
                    <h2 className="text text-[2rem] font-bold text-gray-400">{getTitle()}</h2>
                    {!ticketIsClosed && (
                        <div className="">
                            <EmailTags isPublicEmail={isPublicEmail} disableAddTag={disableAddTag} emailTags={get(currentEmail, "tags", [])} />
                        </div>
                    )}
                </div>

                <div className="flex flex-1">
                    <TimelineEmail sortedMessages={sortedMessages} scrollUpRef={scrollUpRef} currentEmail={currentEmail} />
                </div>
            </div>
        </div>
    );
};
