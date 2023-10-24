import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import get from "lodash/get";
import first from "lodash/first";
import sortBy from "lodash/sortBy";
import isEmpty from "lodash/isEmpty";
import toUpper from "lodash/toUpper";

import { useDispatch, useSelector } from "react-redux";
import { RoomAvatar, Tag } from "@apps/pma/ui-shared";
import {
    DownIcon,
    ForwardIcon1,
    GreetingPostIcon,
    LocationIcon,
    MessengerIcon,
    ProfileIcon,
    RightIcon,
    TwitterColoredIcon,
} from "@apps/shared/icons";
import ArchivedPost from "../archived-post/archived-post";
import { BeatLoader } from "react-spinners";
import OriginalPost from "../orginal-post/original-post";
import { PostSidebarSkeleton, PostsSkeleton } from "@apps/shared/common";
import { JelouApiV1 } from "@apps/shared/modules";
import { setMessages, updateCurrentPost } from "@apps/redux/store";
import { usePrevious } from "@apps/shared/hooks";
import { getTime, postsViewEnable } from "@apps/shared/utils";
import dayjs from "dayjs";

const PostRoom = (props) => {
    const { getHistory, getChildPosts, isLoadingBeforePost, isLoadingAfterPost } = props;
    const { t } = useTranslation();
    const currentPost = useSelector((state) => state.currentPost);
    const showChat = useSelector((state) => state.showChat);
    const userSession = useSelector((state) => state.userSession);
    const isLoadingPostSidebar = useSelector((state) => state.isLoadingPostSidebar);
    const isLoadingPost = useSelector((state) => state.isLoadingPost);
    const userTeams = useSelector((state) => state.userTeams);
    const time = dayjs().locale("es").format("HH:mm");
    const messages = useSelector((state) => state.messages);
    const archivedPosts = useSelector((state) => state.archivedPosts);
    const dispatch = useDispatch();
    const [page, setPage] = useState(1);
    const [pageNext, setPageNext] = useState(1);
    const [moreAnswersPrev, setMoreAnswersPrev] = useState(false);
    const [moreAnswersNext, setMoreAnswersNext] = useState(false);
    const [change, setChange] = useState(true);
    const [threadId, setThreadId] = useState([]);
    const [topicThread, setTopicThread] = useState([]);
    const [post, setPost] = useState([]);
    const [originalPost, setOriginalPost] = useState([]);
    const prevCurrentPost = usePrevious(currentPost);

    const canViewPost = postsViewEnable(userTeams);

    const type = get(currentPost, "channel", null);
    const [chatTags, setChatTags] = useState([]);
    const [totalTag, setTotalTag] = useState(0);
    const [viewTag, setViewTag] = useState(false);

    useEffect(() => {
        if (!isEmpty(currentPost)) {
            setThreadId(first(get(currentPost, "replyPreview", [])));
            setChange(true);
            setMoreAnswersNext(false);
            setMoreAnswersPrev(false);
            setPage(1);
            setPageNext(1);
            setTotalTag(get(currentPost, "tags", []).length);
            setChatTags(get(currentPost, "tags", []));
        }
    }, [currentPost]);

    useEffect(() => {
        if (!isEmpty(currentPost)) {
            if (isEmpty(prevCurrentPost) || get(prevCurrentPost, "archived", false) === false) {
                getRoomReplies(currentPost.id);
            }
        }
    }, [currentPost]);

    useEffect(() => {
        if (!isEmpty(messages) && change) {
            setTopicThread(messages.find((message) => message.roomId === currentPost.id));
        }
    }, [messages]);

    useEffect(() => {
        if (isEmpty(messages) && change) {
            setTopicThread(messages.find((message) => message.roomId === currentPost.id));
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
            if (originalPost.replies_count > 0) {
                setMoreAnswersPrev(true);
            }
        }
    }, [originalPost]);

    let sortedMessages = [];
    let childMessages = [];

    sortedMessages = sortBy(
        messages.filter((message) => message.inReplyTo === get(threadId, "inReplyTo", "")),
        (data) => {
            return dayjs(data.createdAt);
        }
    );

    childMessages = sortBy(
        messages.filter((message) => message.inReplyTo === get(topicThread, "messageId", "")),
        (data) => {
            return dayjs(data.createdAt);
        }
    );

    const getRoomReplies = async (id) => {
        try {
            const { Company } = userSession;
            const companyId = Company.id;
            // dispatch(setLoadingPost(true));
            const { data: response } = await JelouApiV1.get(`/companies/${companyId}/reply/room/${id}`);
            const data = get(response, "data", null);
            if (data) {
                data.id = data._id;
                dispatch(setMessages(data));
                // dispatch(setLoadingPost(false));
                setChange(true);
            }
            // dispatch(setLoadingPost(false));
        } catch (error) {
            console.log(error);
            // dispatch(setLoadingPost(false));
        }
    };

    const firstWasRepliedOperator = get(topicThread, "firstWasRepliedOperator", false);

    // Remove tag from a post
    const removeTag = (tagId) => {
        const updateChatTags = chatTags.filter((tag) => {
            if (tag.id !== tagId) return true;
            else return false;
        });
        setChatTags(updateChatTags);
        const updatedRoom = { ...currentPost, tags: updateChatTags };
        dispatch(updateCurrentPost(updatedRoom));
        const roomId = currentPost.id;
        JelouApiV1.delete(`/rooms/${roomId}/tag/${tagId}/remove`).catch((err) => {
            console.log("=== ERROR", err);
        });
    };

    const name = get(userSession, "names", "");
    let firstName = first(name.split(" "));

    const greeting = getTime(time, t);

    if (!canViewPost) {
        return (
            <div className={`${showChat ? "flex" : "hidden lg:flex"} my-5 flex flex-1 flex-col justify-center space-y-5 overflow-x-hidden`}>
                <div className="mx-auto space-y-4 lg:flex lg:flex-col">
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
                <div className="mx-auto space-y-4 lg:flex lg:flex-col">
                    <div className="flex w-full flex-col">
                        <div className="flex flex-row overflow-hidden rounded-12">
                            <div className="relative flex w-88 flex-col overflow-hidden rounded-12 bg-white">
                                <div className="top-0 z-10 w-full rounded-12 bg-white px-3 py-4 md:px-8 md:py-5">
                                    <div className="flex flex-col items-center">
                                        <div className="mx-auto flex max-w-sm flex-col items-center">
                                            <GreetingPostIcon className="my-10" width="217" height="229" />
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
                <div className="mx-auto space-y-4 lg:flex lg:flex-col">
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
            </div>
        );
    }

    let loadingSkeleton = [];

    for (let i = 0; i < 2; i++) {
        loadingSkeleton.push(<PostsSkeleton key={i} />);
    }

    if (isLoadingPostSidebar || isLoadingPost) {
        return (
            <div className="flex h-full flex-1 justify-between">
                <div className="flex w-full flex-col space-y-4 rounded-l-lg">{loadingSkeleton}</div>
                <PostSidebarSkeleton />
            </div>
        );
    }

    if (isEmpty(currentPost)) {
        return (
            <div className={`${showChat ? "flex" : "hidden lg:flex"} my-5 flex flex-1 flex-col justify-center space-y-5 overflow-x-hidden`}>
                <div className="mx-auto space-y-4 lg:flex lg:flex-col">
                    <div className="flex w-full flex-col">
                        <div className="flex w-88 flex-row overflow-hidden rounded-xl">
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
                <div className="mx-auto space-y-4 lg:flex lg:flex-col">
                    <div className="flex w-full flex-col">
                        <div className="flex w-88 flex-row overflow-hidden rounded-xl">
                            <div className="relative flex w-88 flex-col overflow-hidden rounded-12 bg-white">
                                <div className="top-0 z-10 w-full rounded-12 bg-white px-3 py-4 md:px-8 md:py-5">
                                    <div className="flex flex-col items-center">
                                        <div className="mx-auto flex max-w-sm flex-col items-center">
                                            <GreetingPostIcon className="my-10" width="217" height="229" />
                                            <div className="flex flex-col sm:flex-row">
                                                <div className="mr-1 text-xl font-bold text-gray-400 text-opacity-75">{greeting}</div>
                                                <div className="text-xl font-bold text-primary-200">{firstName}</div>
                                            </div>
                                            <div className="text-15 leading-normal text-gray-400 text-opacity-[0.65]">
                                                {!canViewPost
                                                    ? t("pma.Parece que no tienes acceso a esta sección")
                                                    : !isEmpty(archivedPosts)
                                                    ? t("pma.Revisa el historial de tus publicaciones")
                                                    : t("pma.Aún no tienes publicaciones entrantes")}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mx-auto space-y-4 lg:flex lg:flex-col">
                    <div className="flex w-full flex-col">
                        <div className="flex w-88 flex-row overflow-hidden rounded-xl">
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
            </div>
        );
    }

    const defaultAvatar = "https://s3.us-west-2.amazonaws.com/cdn.devlabs.tech/default_avatar.jpeg";
    const avatar = get(post, "from.profilePicture", defaultAvatar);

    const SocialIcon = ({ type }) => {
        switch (toUpper(type)) {
            case "TWITTER_REPLIES":
                return (
                    <div className="absolute  bottom-0 right-0 -mb-1 mr-1 overflow-hidden rounded-full border-2 border-transparent">
                        <TwitterColoredIcon className="mt-8 fill-current" height="1.25rem" width="1.25rem" />
                    </div>
                );
            default:
            case "FACEBOOK":
            case "FACEBOOK_COMMENTS":
                return (
                    <div className="absolute  bottom-0 right-0 -mb-1 mr-1 overflow-hidden rounded-full border-2 border-transparent">
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
                            <ProfileIcon width="17" height="17" className="mr-2 fill-current text-primary-200" />
                            {get(post, "sender.metadata.following")} {t("pma.siguiendo")}
                        </div>

                        <div className="mt-4 flex text-13 font-bold text-gray-400">
                            <ProfileIcon width="17" height="17" className="mr-2 fill-current text-primary-200" />
                            {get(post, "sender.metadata.followers", "")} {t("pma.seguidores")}
                        </div>

                        {!isEmpty(get(post, "sender.metadata.location", "")) && (
                            <div className="mt-4 flex text-13 font-bold text-gray-400">
                                <LocationIcon width="17" height="17" className="mr-2 fill-current text-primary-200" />
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
            <div className={`${showChat ? "flex flex-col" : "hidden lg:flex lg:flex-col"} my-5 flex-1 overflow-x-hidden`}>
                <div className="mx-auto space-y-4 lg:flex lg:flex-col">
                    {!isEmpty(originalPost) && (
                        <div className="flex w-full flex-col">
                            <div className="flex w-88 flex-row overflow-hidden rounded-xl">
                                <div className="relative flex w-88 flex-col overflow-hidden rounded-12 bg-white">
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
                                getHistory(threadId.messageId, "previous");
                                setPage(page + 1);
                            }}>
                            <ForwardIcon1 width="17" height="12" className="mr-2 fill-current text-primary-200" />
                            {t("pma.Ver comentarios anteriores")}
                        </button>
                    ) : null}

                    {sortedMessages.map((pst, index) => {
                        if (pst.messageId !== get(post, "messageId")) {
                            return (
                                <div key={index}>
                                    <div className={`flex w-full flex-col`}>
                                        <div className="flex w-88 flex-row overflow-hidden rounded-xl">
                                            <div className="relative flex w-88 flex-col overflow-hidden rounded-12 bg-white">
                                                <OriginalPost post={pst} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        }
                        return null;
                    })}

                    <div className="flex w-full flex-col">
                        <div className="flex w-88 flex-row overflow-hidden rounded-xl">
                            <div className="relative flex w-88 flex-col overflow-hidden rounded-12 bg-white">
                                <ArchivedPost post={post} />
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
                                                <div className="flex w-88 flex-row overflow-hidden rounded-xl">
                                                    <div className="relative flex w-88 flex-col overflow-hidden rounded-12 bg-white">
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
                        <div className="space-y-4 border-l-2 border-gray-400 border-opacity-25 pl-6">
                            <div className="top-0 z-10 w-full rounded-12 bg-white">
                                <div className="border-ZZ border-b-default border-solid border-opacity-25 px-3 py-3 text-15 text-gray-400 md:px-5 md:py-4">
                                    {t(`pma.Contestado por`)} <b>{topicThread.firstReplyOperator.from?.names}</b>
                                </div>
                                <div className="mb-2 flex items-center px-3 pt-4 md:px-5 md:pt-5">
                                    <RoomAvatar src={topicThread.firstRepliedOperator?.profilePicture} name={name} type={type} />
                                    <div className="flex flex-1 items-center justify-between">
                                        <div className="flex flex-col text-gray-400">
                                            <div className="mr-1 text-base font-bold capitalize">{topicThread.firstReplyOperator.bot?.name}</div>
                                            <div className="flex text-xs font-light">
                                                <span>{dayjs(topicThread.firstRepliedAtOperator).format(`DD MMMM YYYY - HH:mm`)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="w-88 px-3 pb-3 md:px-5">
                                    <p className="whitespace-pre-line leading-6 text-gray-400">{topicThread.firstReplyOperator?.bubble?.text}</p>
                                </div>
                            </div>
                        </div>
                    ) : null}

                    {isLoadingAfterPost ? (
                        <div className="flex justify-center">
                            <BeatLoader sizeUnit={"px"} size={8} color="#00B3C7" className="" />
                        </div>
                    ) : moreAnswersNext && firstWasRepliedOperator === false ? (
                        <button
                            className="ml-8 flex items-center text-13 text-primary-200"
                            onClick={() => {
                                getChildPosts(topicThread.messageId);
                                setPageNext(pageNext + 1);
                            }}>
                            <ForwardIcon1 width="17" height="12" className="mr-2 fill-current text-primary-200" />
                            {t("pma.Ver comentarios posteriores")}
                        </button>
                    ) : null}
                </div>
                {!isEmpty(get(post, "attendedBy.names")) && (
                    <div className="mt-8 flex w-full items-center justify-center">
                        <div className="mx-auto flex w-full max-w-xl items-center justify-center">
                            <div className="mr-3 h-0.25 flex-1 bg-gray-800 opacity-10"></div>
                            <div className="flex min-h-7 items-center justify-end rounded-lg border-default border-gray-100 border-opacity-25 bg-white px-4 py-1 text-center text-xs text-gray-450">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="mr-3 h-4 w-4 text-primary-200"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                    />
                                </svg>
                                {t("pma.Caso cerrado por")} {get(post, "attendedBy.names", "")}
                                <span className="ml-4 block italic">{dayjs(get(post, "leaveReason.runAt", "")).format("HH:mm")}</span>
                            </div>
                            <div className="ml-3 h-0.25 flex-1 bg-gray-800 opacity-10"></div>
                        </div>
                    </div>
                )}
            </div>
            <div className="flex w-70 flex-col space-y-10 overflow-hidden overflow-y-hidden bg-white text-gray-500 shadow-menu lg:rounded-xl">
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
