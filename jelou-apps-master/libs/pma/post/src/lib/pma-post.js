import Fuse from "fuse.js";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import { useParams } from "react-router-dom";
import { ChatManagerContext } from "@apps/pma/context";
import { useDispatch, useSelector } from "react-redux";
import { useContext, useEffect, useState } from "react";

import withSubscription from "./hoc-post";
import { JelouApiV1 } from "@apps/shared/modules";
import { checkIfOperatorIsOnline } from "@apps/shared/utils";
import { updateCurrentPost, addMessages, setMessages, setIsLoadingPost, updatePost, unsetCurrentPost, setShowDisconnectedModal } from "@apps/redux/store";

import PostRoom from "./post-room/post-room";
import { PmaSidebar } from "@apps/pma/sidebar";
import ArchivedPostRoom from "./archived-post-room/archived-post-room";

const PmaPost = (props) => {
    const dispatch = useDispatch();
    const currentPost = useSelector((state) => state.currentPost);
    const showChat = useSelector((state) => state.showChat);
    const userSession = useSelector((state) => state.userSession);
    const isLoadingPostSidebar = useSelector((state) => state.isLoadingPostSidebar);
    const company = useSelector((state) => state.company);
    const isLoadingPost = useSelector((state) => state.isLoadingPost);
    const statusOperator = useSelector((state) => state.statusOperator);
    let { subSection = "" } = useParams();
    const [isLoadingBeforePost, setIsLoadingBeforePost] = useState(false);
    const [isLoadingAfterPost, setIsLoadingAfterPost] = useState(false);

    const [page, setPage] = useState(1);
    const [pageNext, setPageNext] = useState(1);

    const [moreAnswersPrev, setMoreAnswersPrev] = useState(false);
    const [moreAnswersNext, setMoreAnswersNext] = useState(false);

    const [change, setChange] = useState(true);
    const [postId, setPostId] = useState([]);
    const [topicThread, setTopicThread] = useState([]);

    const [chatTags, setChatTags] = useState([]);
    const [addTag, setAddTag] = useState(false);
    const [createTagFlag] = useState(false);
    const [tags, setTags] = useState([]);
    const [tag, setTag] = useState("");
    const [totalTag, setTotalTag] = useState(0);
    const { ChatManager } = useContext(ChatManagerContext);

    useEffect(() => {
        return () => {
            unsetCurrentPost();
        };
    }, []);

    const getPostReplies = async (id) => {
        try {
            const { Company } = userSession;
            const companyId = Company.id;
            dispatch(setIsLoadingPost(true));
            const { data: response } = await JelouApiV1.get(`/companies/${companyId}/reply/room/${id}`);
            const data = get(response, "data", null);
            if (data) {
                data.id = data._id;
                dispatch(setMessages(data));
                setChange(true);
            }
            dispatch(setIsLoadingPost(false));
        } catch (error) {
            console.log(error);
            dispatch(setIsLoadingPost(false));
        }
    };

    // Get created tags by company
    const getTags = () => {
        const companyId = company.id;
        const teams = get(userSession, "teams", []);
        const bots = get(currentPost, "bot.id", []);

        JelouApiV1.get(`/company/${companyId}/tags`, {
            params: {
                type: "reply",
                ...(!isEmpty(teams) ? { teams } : {}),
                ...(!isEmpty(bots) ? { bots: [bots] } : {}),
                joinTags: true,
            },
        })
            .then((res) => {
                const tagsArray = get(res, "data.data", []);
                setTags(tagsArray);
            })
            .catch((err) => {
                console.log("=== ERROR", err);
            });
    };

    const getHistory = async (id, type) => {
        try {
            const companyId = get(company, "id");
            setIsLoadingBeforePost(true);

            const { data: response } = await JelouApiV1.get(`/companies/${companyId}/reply/${id}/adyacents`, {
                params: {
                    type,
                    limit: 2,
                    page,
                },
            });

            const data = get(response, "data");
            setIsLoadingBeforePost(false);
            const replies = get(data, "results", []);
            const totalPages = get(data, "pagination.totalPages") === null ? 1 : get(data, "pagination.totalPages", 1);

            if (totalPages === page) {
                setMoreAnswersPrev(false);
            }

            if (!isEmpty(replies)) {
                const messages = replies.map((reply) => ({
                    ...reply,
                    id: reply._id,
                }));
                setChange(false);
                dispatch(addMessages(messages));
            }
        } catch (error) {
            setIsLoadingBeforePost(false);
            console.log(error);
        }
    };

    const getChildPosts = async (id) => {
        try {
            const companyId = get(company, "id");
            setIsLoadingAfterPost(true);

            const { data } = await JelouApiV1.get(`/companies/${companyId}/reply/${id}/children`, {
                params: {
                    limit: 2,
                    page: pageNext,
                },
            });

            setIsLoadingAfterPost(false);
            const replies = get(data, "results", []);
            const totalPages = get(data, "pagination.totalPages", 1);

            if (totalPages === pageNext) {
                console.log("entro");
                setMoreAnswersNext(false);
            }

            if (!isEmpty(replies)) {
                const messages = replies.map((reply) => ({
                    ...reply,
                    id: reply._id,
                }));
                setChange(false);
                dispatch(addMessages(messages));
            }
        } catch (error) {
            setIsLoadingAfterPost(false);
            console.log(error);
        }
    };

    const searchTag = ({ target }) => {
        const { value } = target;
        setTag(value);

        const fuseOptions = {
            keys: ["name.es"],
            threshold: 0.3,
        };

        const fuse = new Fuse(tags, fuseOptions);

        const result = fuse.search(value);
        let tagsResponse = [];
        result.map((tag) => {
            return tagsResponse.push(tag.item);
        });

        if (!isEmpty(value) && isEmpty(result) && createTagFlag) {
            setAddTag(true);
        }
        if (addTag && !isEmpty(result)) {
            setAddTag(false);
        }

        return tagsResponse;
    };

    // Add tag to a post
    const addTagChat = (tag) => {
        if (checkIfOperatorIsOnline(statusOperator)) {
            dispatch(setShowDisconnectedModal(true));
            return;
        }
        const tagObj = { name: tag.name, color: tag.color, id: tag.id };
        const updateChatTagsId = chatTags.map((value) => {
            return value.id;
        });
        let updateChatTags = Object.assign([], chatTags);

        let repetido = false;
        updateChatTagsId.forEach((tagId) => {
            if (tagId === tag.id) repetido = true;
        });

        if (!repetido) {
            updateChatTagsId.push(tag.id);
            updateChatTags.push(tagObj);
            const roomId = currentPost.id;
            JelouApiV1.post(`/rooms/${roomId}/tag/${tag.id}/add?type=reply`).catch((err) => {
                console.log("=== ERROR", err);
            });
            const updatedRoom = { ...currentPost, tags: updateChatTags };
            dispatch(updatePost(updatedRoom));
            dispatch(updateCurrentPost(updatedRoom));

            setTotalTag(updateChatTags.length);
        }
        setChatTags(updateChatTags);
    };

    // Remove tag from a post
    const removeTag = (tagId) => {
        const updateChatTags = chatTags.filter((tag) => {
            if (tag.id !== tagId) return true;
            else return false;
        });
        setChatTags(updateChatTags);
        const updatedRoom = { ...currentPost, tags: updateChatTags };
        dispatch(updatePost(updatedRoom));
        dispatch(updateCurrentPost(updatedRoom));

        setTotalTag(updateChatTags.length);
        const roomId = currentPost.id;
        JelouApiV1.delete(`/rooms/${roomId}/tag/${tagId}/remove`).catch((err) => {
            console.log("=== ERROR", err);
        });
    };
    // This is for archived rooms **

    return (
        <div className="flex flex-1 flex-col overflow-y-hidden p-0 mid:pt-4">
            <div className="flex w-full flex-1 overflow-x-hidden">
                <PmaSidebar />
                {subSection !== "archived" ? (
                    <PostRoom
                        currentPost={currentPost}
                        showChat={showChat}
                        userSession={userSession}
                        isLoadingPostSidebar={isLoadingPostSidebar}
                        isLoadingPost={isLoadingPost}
                        ChatManager={ChatManager}
                        getChildPosts={getChildPosts}
                        getTags={getTags}
                        setChatTags={setChatTags}
                        getPostReplies={getPostReplies}
                        tags={tags}
                        addTag={addTag}
                        setAddTag={setAddTag}
                        isLoadingBeforePost={isLoadingBeforePost}
                        isLoadingAfterPost={isLoadingAfterPost}
                        getHistory={getHistory}
                        searchTag={searchTag}
                        addTagChat={addTagChat}
                        removeTag={removeTag}
                        chatTags={chatTags}
                        moreAnswersPrev={moreAnswersPrev}
                        setMoreAnswersPrev={setMoreAnswersPrev}
                        moreAnswersNext={moreAnswersNext}
                        setMoreAnswersNext={setMoreAnswersNext}
                        tag={tag}
                        setTag={setTag}
                        page={page}
                        setPage={setPage}
                        pageNext={pageNext}
                        setPageNext={setPageNext}
                        change={change}
                        setChange={setChange}
                        postId={postId}
                        setPostId={setPostId}
                        topicThread={topicThread}
                        setTopicThread={setTopicThread}
                        totalTag={totalTag}
                        setTotalTag={setTotalTag}
                    />
                ) : (
                    <ArchivedPostRoom getHistory={getHistory} getChildPosts={getChildPosts} isLoadingBeforePost={isLoadingBeforePost} isLoadingAfterPost={isLoadingAfterPost} />
                )}
            </div>
        </div>
    );
};

const EmailsWithSubscription = withSubscription(PmaPost, ChatManagerContext);

export default EmailsWithSubscription;
