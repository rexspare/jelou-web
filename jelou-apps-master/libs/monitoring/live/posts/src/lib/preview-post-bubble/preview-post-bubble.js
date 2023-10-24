import dayjs from "dayjs";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import { useTranslation } from "react-i18next";

import Post from "./post";
import OriginalPost from "../original-post/original-post";

const PreviewPostBubble = (props) => {
    const { topicThread, post, originalPost, childMessages } = props;
    const { t } = useTranslation();
    const firstWasRepliedOperator = get(topicThread, "firstWasRepliedOperator", false);

    return (
        <div className={`my-5 flex flex-1 flex-col overflow-x-hidden`}>
            <div className="mx-4 space-y-4 mid:flex mid:flex-col">
                {!isEmpty(originalPost) && (
                    <div id="originalPost" className="flex w-full flex-col">
                        <div className="flex flex-row overflow-hidden rounded-12">
                            <div className="relative flex w-full max-w-xl flex-col overflow-hidden rounded-12 bg-white">
                                <OriginalPost post={originalPost} />
                            </div>
                        </div>
                    </div>
                )}

                <div id="post" className="flex w-full flex-col">
                    <div className="flex flex-row overflow-hidden rounded-12">
                        <div className="relative flex w-88 max-w-xl flex-col overflow-hidden rounded-12 bg-white">
                            <Post post={post} />
                        </div>
                    </div>
                </div>

                {!isEmpty(childMessages) ? (
                    <div className="space-y-4 border-l-2 border-gray-400 border-opacity-25 pl-6">
                        {childMessages.map((pst, index) => {
                            if (pst.messageId !== get(post, "messageId")) {
                                return (
                                    <div key={index}>
                                        <div id="childMessage_map" className={`flex w-full flex-col`}>
                                            <div className="flex flex-row overflow-hidden rounded-12">
                                                <div className="relative flex w-full max-w-xl flex-col overflow-hidden rounded-12 bg-white">
                                                    <OriginalPost post={pst} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            }
                            return null;
                        })}
                    </div>
                ) : null}

                {firstWasRepliedOperator ? (
                    <div id="firstWasRepliedOperator" className="space-y-4 border-l-2 border-gray-400 border-opacity-25 pl-6">
                        <div className="top-0 z-10 w-full rounded-12 bg-white">
                            <div className="border-b-default border-solid border-gray-100 border-opacity-25 px-3 py-3 text-15 text-gray-400 md:px-5 md:py-4">
                                {t(`pma.Contestado por`)} <b>{topicThread.firstReplyOperator.from?.names}</b>
                            </div>
                            <div className="mb-2 flex items-center px-3 pt-4 md:px-5 md:pt-5">
                                <div className="flex flex-1 items-center justify-between">
                                    <div className="flex flex-col text-gray-400">
                                        <div className="mr-1 text-base font-bold capitalize">{topicThread.firstReplyOperator.bot?.name}</div>
                                        <div className="flex text-xs font-light">
                                            <span>{dayjs(topicThread.firstRepliedAtOperator).format(`DD MMMM YYYY - HH:mm`)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="w-full px-3 md:px-5">
                                <p className="whitespace-pre-line leading-6 text-gray-400">{topicThread.firstReplyOperator.bubble?.text}</p>
                            </div>
                            <div className="flex items-center justify-end px-3 pb-3 text-xs md:px-5 md:pb-4">
                                <span className="text-opacity-5 text-gray-400"></span>
                            </div>
                        </div>
                    </div>
                ) : null}
            </div>
        </div>
    );
};

export default PreviewPostBubble;
