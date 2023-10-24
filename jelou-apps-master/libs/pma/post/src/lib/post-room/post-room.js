/* eslint-disable array-callback-return */
import dayjs from "dayjs";
import get from "lodash/get";
import first from "lodash/first";
import maxBy from "lodash/maxBy";
import sortBy from "lodash/sortBy";
import isEmpty from "lodash/isEmpty";
import toUpper from "lodash/toUpper";
import { BeatLoader } from "react-spinners";
import { useTranslation } from "react-i18next";
import { Menu, Transition } from "@headlessui/react";
import { useDispatch, useSelector } from "react-redux";
import React, { useEffect, useState, useRef } from "react";

import Post from "../post/post";

import { setCurrentPost } from "@apps/redux/store";

import {
    DownIcon,
    PlusIcon1,
    RightIcon,
    ForwardIcon1,
    ProfileIcon,
    GreetingPostIcon,
    LocationIcon,
    MessengerIcon,
    TwitterColoredIcon,
} from "@apps/shared/icons";

import { getTime, postsViewEnable } from "@apps/shared/utils";
import { usePrevious } from "@apps/shared/hooks";
import { PostSidebarSkeleton, PostsSkeleton, RoomAvatar } from "@apps/shared/common";
import { ShowTags, Tag } from "@apps/pma/ui-shared";
import OriginalPost from "../orginal-post/original-post";

const PostRoom = (props) => {
    const {
        currentPost,
        showChat,
        userSession,
        isLoadingPostSidebar,
        isLoadingPost,
        ChatManager,
        getChildPosts,
        getTags,
        setChatTags,
        getPostReplies,
        tags,
        addTag,
        setAddTag,
        isLoadingBeforePost,
        isLoadingAfterPost,
        getHistory,
        searchTag,
        addTagChat,
        removeTag,
        chatTags,
        moreAnswersPrev,
        setMoreAnswersPrev,
        moreAnswersNext,
        setMoreAnswersNext,
        tag,
        setTag,
        page,
        setPage,
        pageNext,
        setPageNext,
        change,
        setChange,
        postId,
        setPostId,
        topicThread,
        setTopicThread,
        totalTag,
        setTotalTag,
    } = props;

    const { t } = useTranslation();
    const time = dayjs().locale("es").format("HH:mm");
    const messages = useSelector((state) => state.messages);
    const threads = useSelector((state) => state.threads);
    const userTeams = useSelector((state) => state.userTeams);
    const dispatch = useDispatch();
    const [post, setPost] = useState([]);
    const [originalPost, setOriginalPost] = useState([]);

    const canViewPosts = postsViewEnable(userTeams);

    const type = get(currentPost, "channel", null);

    const [viewTag, setViewTag] = useState(false);
    const isMounted = useRef(null);
    const prevCurrentPost = usePrevious(currentPost);

    useEffect(() => {
        if (
            !isEmpty(currentPost) &&
            get(prevCurrentPost, "id") !== get(currentPost, "id") &&
            get(currentPost, "type") === "reply" &&
            !isEmpty(userSession)
        ) {
            setPostId(first(get(currentPost, "replyPreview", [])));
            setChange(true);
            setMoreAnswersNext(false);
            setMoreAnswersPrev(false);
            setPage(1);
            setPageNext(1);
            getTags();
            setTotalTag(get(currentPost, "tags", []).length);
            setChatTags(get(currentPost, "tags", []));
            setViewTag(false);
        }
    }, [currentPost, userSession]);

    useEffect(() => {
        if (!isEmpty(currentPost)) {
            markAsRead();
        }
    }, [currentPost]);

    const markAsRead = () => {
        try {
            if (ChatManager) {
                ChatManager.setReadCursor({
                    roomId: currentPost.id,
                    reply: "reply",
                });
            }
        } catch (error) {
            console.log("Error", error);
        }
    };

    useEffect(() => {
        if (!isEmpty(messages) && change && get(currentPost, "type") === "reply") {
            setTopicThread(messages.find((message) => message.roomId === get(currentPost, "id")));
        }
    }, [messages]);

    useEffect(() => {
        if (!isEmpty(topicThread)) {
            setPost(messages.find((message) => message.messageId === get(topicThread, "messageId", "")));
            setOriginalPost(get(topicThread, "topicThread", []));
            if (topicThread.replies_count > 0) {
                setMoreAnswersNext(true);
            }
        }
    }, [topicThread]);

    useEffect(() => {
        if (!isEmpty(originalPost)) {
            if (originalPost.replies_count > 1) {
                setMoreAnswersPrev(true);
            } else {
                setMoreAnswersPrev(false);
            }
        }
    }, [originalPost]);

    let sortedMessages = [];
    let childMessages = [];

    sortedMessages =
        !isEmpty(currentPost) && get(currentPost, "type") === "reply"
            ? sortBy(
                  messages.filter((message) => message.inReplyTo === get(postId, "inReplyTo", "")),
                  (data) => {
                      return dayjs(data.createdAt);
                  }
              )
            : [];

    useEffect(() => {
        isMounted.current = true;
        if (isMounted) {
            const theRoom = maxBy(threads, (thread) => thread.lastMessageAt);
            dispatch(setCurrentPost(theRoom));
        }
        return () => (isMounted.current = false);
    }, []);

    useEffect(() => {
        isMounted.current = true;
        if (!isEmpty(currentPost) && isMounted) {
            if (
                ((isEmpty(prevCurrentPost) || get(prevCurrentPost, "archived", false)) && get(currentPost, "type") === "reply") ||
                get(prevCurrentPost, "id") !== get(currentPost, "id")
            ) {
                getPostReplies(currentPost.id);
            }
        }
        return () => (isMounted.current = false);
    }, [currentPost]);

    childMessages =
        !isEmpty(currentPost) && get(currentPost, "type") === "reply"
            ? sortBy(
                  messages.filter((message) => message.inReplyTo === get(topicThread, "messageId", "")),
                  (data) => {
                      return dayjs(data.createdAt);
                  }
              )
            : [];

    const name = get(userSession, "names", "");
    let firstName = first(name.split(" "));

    const greeting = getTime(time, t);

    const firstWasRepliedOperator = get(topicThread, "firstWasRepliedOperator", false);

    if (!canViewPosts) {
        return (
            <div className={`${showChat ? "flex" : "hidden mid:flex"} my-5 flex flex-1 flex-col justify-center space-y-5 overflow-x-hidden`}>
                <div className="mx-auto space-y-4 mid:flex mid:flex-col">
                    <div className="flex w-full flex-col">
                        <div className="flex flex-row overflow-hidden rounded-12">
                            <div className="w-128 relative flex flex-col overflow-hidden rounded-12 bg-white">
                                <div className="top-0 z-10 w-full rounded-12 bg-white px-5 py-4 md:px-10 md:py-5">
                                    <div className="flex flex-col">
                                        <div className="flex w-full flex-col space-y-3">
                                            <div className="h-3 w-full rounded-10 bg-gray-400 bg-opacity-10"></div>
                                            <div className="h-3 w-full rounded-10 bg-gray-400 bg-opacity-10"></div>
                                            <div className="flex justify-end">
                                                <div className="h-3 w-[12.5rem] rounded-10 bg-primary-200 bg-opacity-10"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mx-auto space-y-4 mid:flex mid:flex-col">
                    <div className="flex w-full flex-col">
                        <div className="flex flex-row overflow-hidden rounded-12">
                            <div className="w-128 relative flex flex-col overflow-hidden rounded-12 bg-white">
                                <div className="top-0 z-10 w-full rounded-12 bg-white px-3 py-4 md:px-8 md:py-5">
                                    <div className="flex flex-col items-center">
                                        <div className="mx-auto flex max-w-sm flex-col items-center">
                                            <GreetingPostIcon className="my-10" width="13.5625rem" height="14.3125rem" />
                                            <div className="flex flex-col sm:flex-row">
                                                <div className="mr-1 text-xl font-bold text-gray-400 text-opacity-75">{greeting}</div>
                                                <div className="text-xl font-bold text-primary-200">{firstName}</div>
                                            </div>
                                            <div className="text-15 leading-normal text-gray-400 text-opacity-[0.65]">
                                                {t("pma.Parece que no tienes acceso a esta sección")}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mx-auto space-y-4 mid:flex mid:flex-col">
                    <div className="flex w-full flex-col">
                        <div className="flex flex-row overflow-hidden rounded-12">
                            <div className="w-128 relative flex flex-col overflow-hidden rounded-12 bg-white">
                                <div className="top-0 z-10 w-full rounded-12 bg-white px-5 py-4 md:px-10 md:py-5">
                                    <div className="flex flex-col">
                                        <div className="flex w-full flex-col space-y-3">
                                            <div className="h-3 w-full rounded-10 bg-gray-400 bg-opacity-10"></div>
                                            <div className="h-3 w-full rounded-10 bg-gray-400 bg-opacity-10"></div>
                                            <div className="flex justify-end">
                                                <div className="h-3 w-[12.5rem] rounded-10 bg-primary-200 bg-opacity-10"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    let loadingSkeleton = [];

    for (let i = 0; i < 2; i++) {
        loadingSkeleton.push(<PostsSkeleton key={i} />);
    }
    if ((isLoadingPostSidebar || isLoadingPost) && canViewPosts) {
        return (
            <div className="flex h-full flex-1 justify-between space-x-3">
                <div className="flex w-full flex-col space-y-5 rounded-l-lg pt-5">{loadingSkeleton}</div>
                <PostSidebarSkeleton />
            </div>
        );
    }

    if (isEmpty(currentPost)) {
        return (
            <div className={`${showChat ? "flex" : "hidden mid:flex"} my-5 flex flex-1 flex-col justify-center space-y-5 overflow-x-hidden`}>
                <div className="mx-auto space-y-4 mid:flex mid:flex-col">
                    <div className="flex w-full flex-col">
                        <div className="flex flex-row overflow-hidden rounded-12">
                            <div className="relative flex w-88 flex-col overflow-hidden rounded-12 bg-white">
                                <div className="top-0 z-10 w-full rounded-12 bg-white px-5 py-4 md:px-10 md:py-5">
                                    <div className="flex flex-col">
                                        <div className="flex w-full flex-col space-y-3">
                                            <div className="h-3 w-full rounded-10 bg-gray-400 bg-opacity-10"></div>
                                            <div className="h-3 w-full rounded-10 bg-gray-400 bg-opacity-10"></div>
                                            <div className="flex justify-end">
                                                <div className="h-3 w-[12.5rem] rounded-10 bg-primary-200 bg-opacity-10"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mx-auto space-y-4 mid:flex mid:flex-col">
                    <div className="flex w-full flex-col">
                        <div className="flex flex-row overflow-hidden rounded-12">
                            <div className="relative flex w-88 flex-col overflow-hidden rounded-12 bg-white">
                                <div className="top-0 z-10 w-full rounded-12 bg-white px-3 py-4 md:px-8 md:py-5">
                                    <div className="flex flex-col items-center">
                                        <div className="mx-auto flex max-w-sm flex-col items-center">
                                            <GreetingPostIcon className="my-10" width="13.5625rem" height="14.3125rem" />
                                            <div className="flex flex-col sm:flex-row">
                                                <div className="mr-1 text-xl font-bold text-gray-400 text-opacity-75">{greeting}</div>
                                                <div className="text-xl font-bold text-primary-200">{firstName}</div>
                                            </div>
                                            <div className="text-15 leading-normal text-gray-400 text-opacity-[0.65]">
                                                {!canViewPosts
                                                    ? t("pma.Parece que no tienes acceso a esta sección")
                                                    : !isEmpty(threads)
                                                    ? t("pma.Gestiona tus publicaciones a tu gusto")
                                                    : t("pma.Aún no tienes publicaciones entrantes")}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mx-auto space-y-4 mid:flex mid:flex-col">
                    <div className="flex w-full flex-col">
                        <div className="flex flex-row overflow-hidden rounded-12">
                            <div className="relative flex w-88 flex-col overflow-hidden rounded-12 bg-white">
                                <div className="top-0 z-10 w-full rounded-12 bg-white px-5 py-4 md:px-10 md:py-5">
                                    <div className="flex flex-col">
                                        <div className="flex w-full flex-col space-y-3">
                                            <div className="h-3 w-full rounded-10 bg-gray-400 bg-opacity-10"></div>
                                            <div className="h-3 w-full rounded-10 bg-gray-400 bg-opacity-10"></div>
                                            <div className="flex justify-end">
                                                <div className="h-3 w-[200px] rounded-10 bg-primary-200 bg-opacity-10"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const defaultAvatar = "https://s3.us-west-2.amazonaws.com/cdn.devlabs.tech/default_avatar.jpeg";

    const avatar = get(post, "from.profilePicture", defaultAvatar);

    const SocialIcon = ({ type }) => {
        switch (toUpper(type)) {
            case "TWITTER_REPLIES":
                return (
                    <div className="absolute bottom-0 right-0 mr-1 -mb-1 overflow-hidden rounded-full border-2 border-transparent">
                        <TwitterColoredIcon className="mt-8 fill-current" height="1.25rem" width="1.25rem" />
                    </div>
                );
            default:
            case "FACEBOOK":
            case "FACEBOOK_COMMENTS":
                return (
                    <div className="absolute bottom-0 right-0 mr-1 -mb-1 overflow-hidden rounded-full border-2 border-transparent">
                        <MessengerIcon className="fill-current" height="1.25rem" width="1.25rem" />
                    </div>
                );
        }
    };

    const Metadata = ({ type }) => {
        switch (toUpper(type)) {
            case "TWITTER_REPLIES":
                return (
                    <div className="flex flex-col justify-start">
                        <div className="mt-4 flex text-13 font-bold text-gray-400">
                            <ProfileIcon width="1.0625rem" height="1.0625rem" className="mr-2 fill-current text-primary-200" />
                            {get(post, "sender.metadata.following")} {t("pma.siguiendo")}
                        </div>

                        <div className="mt-4 flex text-13 font-bold text-gray-400">
                            <ProfileIcon width="1.0625rem" height="1.0625rem" className="mr-2 fill-current text-primary-200" />
                            {get(post, "sender.metadata.followers", "")} {t("pma.seguidores")}
                        </div>

                        {!isEmpty(get(post, "sender.metadata.location", "")) && (
                            <div className="mt-4 flex text-13 font-bold text-gray-400">
                                <LocationIcon width="1.0625rem" height="1.0625rem" className="mr-2 fill-current text-primary-200" />
                                {get(post, "sender.metadata.location", "")}
                            </div>
                        )}
                    </div>
                );
            default:
            case "FACEBOOK":
            case "FACEBOOK_COMMENTS":
            case "FACEBOOK_FEED":
                return <div className="mt-4 flex text-13"></div>;
        }
    };

    return (
        <>
            <div className={`${showChat ? "flex flex-col" : "hidden mid:flex mid:flex-col"} my-5 flex-1 overflow-x-hidden`}>
                <div className="mx-auto space-y-4 mid:flex mid:flex-col">
                    {!isEmpty(originalPost) && (
                        <div className="flex w-full flex-col">
                            <div className="flex flex-row overflow-hidden rounded-12">
                                <div className="relative flex w-full max-w-xl flex-col overflow-hidden rounded-12 bg-white">
                                    <OriginalPost post={originalPost} />
                                </div>
                            </div>
                        </div>
                    )}
                    {isLoadingBeforePost ? (
                        <div className="flex justify-center">
                            <BeatLoader sizeUnit={"px"} size={8} color="#00B3C7" className="" />
                        </div>
                    ) : moreAnswersPrev ? (
                        <button
                            className="ml-8 flex items-center text-13 text-primary-200"
                            onClick={() => {
                                getHistory(postId.messageId, "previous");
                                setPage(page + 1);
                            }}>
                            <ForwardIcon1 width="1.0625rem" height="0.75rem" className="mr-2 fill-current text-primary-200" />
                            {t("pma.Ver comentarios anteriores")}
                        </button>
                    ) : null}

                    {sortedMessages.map((pst, index) => {
                        if (pst.messageId !== get(post, "messageId")) {
                            return (
                                <div key={index}>
                                    <div className={`flex w-full flex-col`}>
                                        <div className="flex flex-row overflow-hidden rounded-12">
                                            <div className="relative flex w-full max-w-xl flex-col overflow-hidden rounded-12 bg-white">
                                                <OriginalPost post={pst} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        }
                    })}

                    <div className="flex w-full flex-col">
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
                                            <div className={`flex w-full flex-col`}>
                                                <div className="flex flex-row overflow-hidden rounded-12">
                                                    <div className="relative flex w-full max-w-xl flex-col overflow-hidden rounded-12 bg-white">
                                                        <OriginalPost post={pst} />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                }
                            })}
                        </div>
                    ) : null}

                    {firstWasRepliedOperator ? (
                        <div className="space-y-4 border-l-2 border-gray-400 border-opacity-25 pl-6">
                            <div className="top-0 z-10 w-full rounded-12 bg-white">
                                <div className="border-b-default border-solid border-gray-100 border-opacity-25 px-3 py-3 text-15 text-gray-400 md:px-5 md:py-4">
                                    {t(`pma.Contestado por`)} <b>{topicThread.firstRepliedOperator?.names}</b>
                                </div>
                                <div className="mb-2 flex items-center px-3 pt-4 md:px-5 md:pt-5">
                                    <RoomAvatar src={topicThread.firstRepliedOperator?.profilePicture} name={name} />
                                    <div className="flex flex-1 items-center justify-between">
                                        <div className="flex flex-col text-gray-400">
                                            <div className="mr-1 text-base font-bold capitalize">{topicThread.firstRepliedOperator.bot?.name}</div>
                                            <div className="flex text-xs font-light">
                                                <span>{dayjs(topicThread.firstRepliedAtOperator).format(`DD MMMM YYYY - HH:mm`)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="w-88 px-3 pb-3 md:px-5">
                                    <p className="whitespace-pre-line leading-6 text-gray-400">{topicThread.firstReplyOperator?.bubble?.text}</p>
                                </div>
                                <div className="mt-2 flex items-center justify-end px-3 pb-3 text-xs md:px-5 md:pb-4">
                                    <span className="text-opacity-5 text-gray-400"></span>
                                </div>
                            </div>
                        </div>
                    ) : null}

                    {isLoadingAfterPost ? (
                        <div className="flex justify-center">
                            <BeatLoader sizeUnit={"px"} size={8} color="#00B3C7" className="" />
                        </div>
                    ) : moreAnswersNext ? (
                        <button
                            className="ml-8 flex items-center text-13 text-primary-200"
                            onClick={() => {
                                getChildPosts(topicThread.messageId);
                                setPageNext(pageNext + 1);
                            }}>
                            <ForwardIcon1 width="1.0625rem" height="0.75rem" className="mr-2 fill-current text-primary-200" />
                            {t("pma.Ver comentarios posteriores")}
                        </button>
                    ) : null}
                </div>
            </div>
            <div className="flex w-70 flex-col space-y-10 overflow-hidden overflow-y-hidden bg-white text-gray-500 shadow-loading mid:rounded-xl">
                <div className="flex">
                    <div className="flex w-full flex-col items-center">
                        <div className="relative mt-8 flex">
                            <img className="h-18 w-18 items-center rounded-full" src={avatar} alt=""></img>
                            <SocialIcon type={type} />
                        </div>
                        <div className="mt-3 flex flex-col leading-[1.4] text-gray-400">
                            <span className="text-15 font-bold">{get(post, "sender.metadata.names", "")}</span>
                            {toUpper(type) === "TWITTER_REPLIES" &&
                                !isEmpty(get(post, "sender.metadata.nickname", get(post, "sender.metadata.username", ""))) && (
                                    <a
                                        href={`https://twitter.com/${get(
                                            post,
                                            "sender.metadata.nickname",
                                            get(post, "sender.metadata.username", "")
                                        )}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="flex justify-center text-xs underline">
                                        @{get(post, "sender.metadata.nickname", get(post, "sender.metadata.username", ""))}
                                    </a>
                                )}
                        </div>
                        <Metadata type={type} />
                    </div>
                </div>
                <div className="mx-4 flex flex-col space-y-5 text-gray-400">
                    <div className="flex flex-row justify-between">
                        <div className="flex flex-row">
                            <span className="flex items-center text-13 leading-normal text-gray-400 md:text-15 xxl:text-base">
                                <button className="flex border-transparent" onClick={() => setViewTag(!viewTag)}>
                                    <span className="font-bold">{t("pma.Etiquetas")}</span>
                                    {` ( ${totalTag} )`}
                                    {viewTag ? (
                                        <DownIcon
                                            className="select-none fill-current pb-[0.22rem] text-gray-400 outline-none"
                                            width="1.25rem"
                                            height="1.25rem"
                                        />
                                    ) : (
                                        <RightIcon
                                            className="select-none fill-current pb-[0.18rem] text-gray-400 outline-none"
                                            width="1.25rem"
                                            height="1.25rem"
                                        />
                                    )}
                                </button>
                            </span>
                        </div>
                        <div className="relative ml-3 flex h-full justify-end">
                            <Menu>
                                <Menu.Button className="h-full border-transparent focus:outline-none">
                                    <PlusIcon1 className="font-bold" width="1.563rem" height="1.563rem" />
                                </Menu.Button>
                                <Transition
                                    enter="transition-opacity duration-75"
                                    enterFrom="opacity-0"
                                    enterTo="opacity-100"
                                    leave="transition-opacity duration-150"
                                    leaveFrom="opacity-100"
                                    leaveTo="opacity-0">
                                    <Menu.Items className="border-11 absolute top-0 right-0 z-100 mt-8 w-56 rounded-lg bg-white p-4 shadow-normal">
                                        <ShowTags
                                            Tags
                                            searchTag={searchTag}
                                            addTag={addTag}
                                            setAddTag={setAddTag}
                                            tag={tag}
                                            setTag={setTag}
                                            createTag={() => console.log("createTag")}
                                            tagsArray={tags}
                                            addTagChat={addTagChat}
                                            chatTags={chatTags}
                                        />
                                    </Menu.Items>
                                </Transition>
                            </Menu>
                        </div>
                    </div>

                    <div className="flex flex-wrap-reverse space-x-1 space-y-2 overflow-x-auto">
                        {!isEmpty(get(currentPost, "tags"), []) &&
                            !viewTag &&
                            get(currentPost, "tags", []).map((tag, index) => {
                                if (index <= 1) {
                                    return (
                                        <div className="flex h-6" key={index}>
                                            <Tag tag={tag} removeTag={removeTag} key={index} />
                                            {index === 1 && totalTag >= 3 && <span className="ml-3 text-gray-400">...</span>}
                                        </div>
                                    );
                                }
                                return null;
                            })}
                        {!isEmpty(get(currentPost, "tags"), []) &&
                            viewTag &&
                            get(currentPost, "tags", []).map((tag, index) => {
                                return (
                                    <div className="h-6 flex-none" key={index}>
                                        <Tag tag={tag} removeTag={removeTag} key={index} />
                                    </div>
                                );
                            })}
                    </div>
                </div>
            </div>
        </>
    );
};

export default PostRoom;
