import React from "react";
import { usePrevious } from "@apps/shared/hooks";
import { ChatIconInCircle, DownIcon, MoreIcon1 } from "@apps/shared/icons";
import { TESTER_NAMES, TESTER_SENDER } from "../../constants";
import isEmpty from "lodash/isEmpty";

const TesterPreviewMessage = ({ messages, showTesterChat, handleOpenTesterChat }) => {
    const previewMessage = usePrevious(messages);
    const lastItem = messages[messages.length - 1] ?? {};
    const { by: sender = "", answer = {} } = lastItem;

    if (showTesterChat || isEmpty(previewMessage) || previewMessage === messages || sender !== TESTER_SENDER.ARTIFICIAL_INTELLIGENCE) {
        return null;
    }

    return (
        <div
            className={`fixed bottom-6 right-[22rem] mb-8 mr-5 flex h-[25%] w-[22rem] translate-x-full transform rounded-xl transition-transform duration-300 mid:mb-12 mid:mr-10 lg:mb-8 lg:mr-12`}>
            <div className="flex flex-1 flex-row space-x-4">
                <span className="flex h-10 w-10 items-end justify-center rounded-full shadow-global">
                    <ChatIconInCircle width={"2.5rem"} height={"2.5rem"} className="rgb(249 90 89)" />
                </span>
                <div className="flex w-20 flex-1 flex-col space-y-3">
                    <div className="min-h-10 flex flex-col rounded-10 bg-teal-5 p-3 shadow-global">
                        <span className="text-15 font-semibold text-semantic-error">{TESTER_NAMES.HEADER_TITLE}</span>
                        <span className="text-15 text-gray-400 line-clamp-3">{answer?.answer}</span>
                    </div>
                    <button className="flex items-center justify-between rounded-10 bg-[#eff1f4] p-3 shadow-global" onClick={handleOpenTesterChat}>
                        <span className="text-15 font-light text-[#b0b6c2]">Escribe un mensaje</span>
                        <div className="flex space-x-2">
                            <MoreIcon1 fill="#727c94" />
                            <DownIcon fill="#727c94" className="rotate-270" />
                        </div>
                    </button>
                </div>
            </div>
        </div>
    );
    // }
};

export default TesterPreviewMessage;
