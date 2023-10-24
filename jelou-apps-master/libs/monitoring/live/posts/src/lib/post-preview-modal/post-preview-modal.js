import get from "lodash/get";
import sortBy from "lodash/sortBy";
import isEmpty from "lodash/isEmpty";

import { useEffect, useRef, useState } from "react";
import dayjs from "dayjs";

import { CloseIcon } from "@apps/shared/icons";
import { useOnClickOutside } from "@apps/shared/hooks";
import { Modal, PostsSkeleton } from "@apps/shared/common";
import PreviewPostBubble from "../preview-post-bubble/preview-post-bubble";

const PostPreviewModal = (props) => {
    const { postPreviewIsLoading, setShowPostPreviewModal, postMessages, postInfo } = props;

    const previewRef = useRef(null);

    const [originalPost, setOriginalPost] = useState();
    const [topicThread, setTopicThread] = useState();

    let loadingSkeleton = [];

    for (let i = 0; i < 2; i++) {
        loadingSkeleton.push(<PostsSkeleton width={"w-86"} key={i} />);
    }

    useEffect(() => {
        if (!isEmpty(postInfo)) {
            setTopicThread(get(postInfo, "topicThread", {}));
        }
    }, [postInfo]);

    useEffect(() => {
        if (!isEmpty(postInfo)) {
            setOriginalPost(get(postInfo, "topicThread", []));
        }
    }, [postInfo]);

    let childMessages = [];

    childMessages = !isEmpty(postInfo)
        ? sortBy(
              postMessages.filter((message) => message.inReplyTo === get(topicThread, "messageId", "")),
              (data) => {
                  return dayjs(data.createdAt);
              }
          )
        : [];

    useOnClickOutside(previewRef, () => setShowPostPreviewModal(false));

    return (
        <Modal>
            <div className="fixed inset-x-0 bottom-0 z-120 px-4 pb-6 sm:inset-0 sm:flex sm:items-center sm:justify-center sm:p-0">
                <div className="fixed inset-0 transition-opacity">
                    <div className="absolute inset-0 z-20 bg-gray-500 opacity-50"></div>
                </div>
                <div className="relative max-h-modal min-h-modal w-170 transform overflow-y-auto rounded-3xl bg-gray-50 pl-4 pr-6 pt-5 pb-4 shadow-modal transition-all">
                    {postPreviewIsLoading ? (
                        <div className="flex h-full flex-1 justify-between space-x-3">
                            <div className="flex w-full flex-col space-y-5 rounded-l-lg pt-5">{loadingSkeleton}</div>
                        </div>
                    ) : (
                        <div ref={previewRef}>
                            <button onClick={() => setShowPostPreviewModal(false)} className="absolute top-2 right-2">
                                <CloseIcon className="fill-current text-gray-400" width="1rem" height="1rem" />
                            </button>
                            <PreviewPostBubble
                                topicThread={topicThread}
                                originalPost={originalPost}
                                post={postInfo}
                                postMessages={postMessages}
                                childMessages={childMessages}
                            />
                        </div>
                    )}
                </div>
            </div>
        </Modal>
    );
};
export default PostPreviewModal;
