/* eslint-disable array-callback-return */
import "dayjs/locale/es";
import dayjs from "dayjs";
import Fuse from "fuse.js";
import get from "lodash/get";
import first from "lodash/first";
import toUpper from "lodash/toUpper";
import sortBy from "lodash/sortBy";
import toLower from "lodash/toLower";
import isEmpty from "lodash/isEmpty";
import reverse from "lodash/reverse";
import { useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Disclosure, Transition } from "@headlessui/react";

import PostRoom from "./post-room";
import { setMessages, setIsLoadingPost } from "@apps/redux/store";
import { useTranslation } from "react-i18next";
import { getTime, postsViewEnable } from "@apps/shared/utils";
import { DownIcon, FacebookIcon, GreetingPostIcon, RightIcon, TwitterColoredIcon } from "@apps/shared/icons";
import { JelouApiV1 } from "@apps/shared/modules";
import { RoomSidebarLoading } from "@apps/shared/common";
import { useParams } from "react-router-dom";
import { currentSectionPma } from "@apps/shared/constants";
import PostArchivedSidebar from "../post-archived-sidebar/post-archived-sidebar";

const PostSidebar = (props) => {
    const { sortOrder, groupPost } = props;
    const { t } = useTranslation();
    const { subSection = "" } = useParams();
    const isMounted = useRef(null);
    const userSession = useSelector((state) => state.userSession);
    const company = useSelector((state) => state.company);
    const posts = useSelector((state) => state.posts);
    const query = useSelector((state) => state.query);
    const isLoadingPostSidebar = useSelector((state) => state.isLoadingPostSidebar);
    const userTeams = useSelector((state) => state.userTeams);
    const time = dayjs().locale("es").format("HH:mm");
    const greeting = getTime(time, t);
    const sidebar = useRef(null);
    const name = get(userSession, "names", "");
    let firstName = first(name.split(" "));

    const dispatch = useDispatch();
    const fuseOptions = {
        shouldSort: true,
        threshold: 0.25,
        location: 0,
        distance: 100,
        maxPatternLength: 32,
        minMatchCharLength: 1,
        keys: ["title", "from.id", "names", "metadata.userId", "metadata.username", "metadata.names", "replyId"],
    };

    const canViewReplies = postsViewEnable(userTeams);

    useEffect(() => {
        isMounted.current = true;
        return () => (isMounted.current = false);
    }, []);

    const getPostMessages = async (id) => {
        try {
            const companyId = get(company, "id");
            dispatch(setIsLoadingPost(true));
            const { data: response } = await JelouApiV1.get(`/companies/${companyId}/reply/room/${id}`);
            const data = get(response, "data");

            if (data) {
                data.id = data._id;
                dispatch(setMessages(data));
            }
            dispatch(setIsLoadingPost(false));
        } catch (error) {
            console.log("Error on getPostMessages", error);
            dispatch(setIsLoadingPost(false));
        }
    };

    if (isLoadingPostSidebar) {
        return (
            <div className="flex w-full flex-col rounded-l-lg bg-white">
                <RoomSidebarLoading />
            </div>
        );
    }

    const getFilteredPosts = () => {
        if (isEmpty(query)) {
            if (sortOrder === "asc_message") {
                return reverse(sortBy(posts, ["lastMessageAt"]));
            }

            if (sortOrder === "desc_post") {
                return sortBy(posts, ["creationDate", "createdAt"]);
            }

            if (sortOrder === "asc_post") {
                return reverse(sortBy(posts, ["creationDate", "createdAt"]));
            }

            if (sortOrder === "desc_message") {
                return sortBy(posts, ["lastMessageAt"]);
            }

            if (isEmpty(sortOrder)) {
                return reverse(sortBy(posts, ["lastMessageAt"]));
            }

            return reverse(sortBy(posts, ["lastMessageAt"]));
        }

        const fuse = new Fuse(posts, fuseOptions);
        let queryResults = fuse.search(query);

        const results = [];
        queryResults.forEach((thread) => {
            results.push(thread.item);
        });

        return reverse(sortBy(results, ["lastMessageAt"]));
    };

    const countTwitter = posts.filter(function (item) {
        return item.channel === "Twitter_replies";
    }).length;

    const countFacebook = posts.filter(function (item) {
        return item.channel === "Facebook_Feed";
    }).length;

    if (toUpper(subSection) === currentSectionPma.ARCHIVED) {
        return <PostArchivedSidebar />;
    }
    if (!isEmpty(posts) && canViewReplies && subSection !== currentSectionPma.ARCHIVED) {
        const sortedPosts = getFilteredPosts();

        return (
            <div className="relative mb-12 flex-1 overflow-y-auto overflow-x-hidden md:mb-14 mid:mb-0" ref={sidebar}>
                {(isEmpty(sortOrder) || groupPost) && (
                    <Disclosure>
                        {({ open }) => (
                            <div className="border-btm flex flex-col">
                                <Disclosure.Button className="border-btm sticky top-0 z-40 flex items-center space-x-3 border-transparent bg-white px-4 py-3">
                                    <TwitterColoredIcon width="22" height="22" />
                                    <span className="text-13 font-bold text-gray-400">{`Twitter`}</span>
                                    <span className="text-13 font-bold text-source-twitter">{countTwitter}</span>
                                    {open ? (
                                        <DownIcon className="select-none fill-current text-gray-400 outline-none" width="1.25rem" height="1.25rem" />
                                    ) : (
                                        <RightIcon className="select-none fill-current text-gray-400 outline-none" width="1.25rem" height="1.25rem" />
                                    )}
                                </Disclosure.Button>

                                {sortedPosts.map((room, index) => {
                                    if (toLower(room.channel) === "twitter_replies") {
                                        return (
                                            <Transition
                                                key={index}
                                                show={open}
                                                enter="transition duration-100 ease-out"
                                                enterFrom="transform scale-95 opacity-0"
                                                enterTo="transform scale-100 opacity-100"
                                                leave="transition duration-75 ease-out"
                                                leaveFrom="transform scale-100 opacity-100"
                                                leaveTo="transform scale-95 opacity-0">
                                                <Disclosure.Panel>
                                                    <PostRoom room={room} key={room._id} getPostMessages={getPostMessages} />
                                                </Disclosure.Panel>
                                            </Transition>
                                        );
                                    }
                                })}
                            </div>
                        )}
                    </Disclosure>
                )}

                {(isEmpty(sortOrder) || groupPost) && (
                    <Disclosure>
                        {({ open }) => (
                            <div className="border-btm sticky top-0 flex flex-col">
                                <Disclosure.Button className="border-btm sticky top-0 z-40 flex items-center space-x-3 border-transparent bg-white px-4 py-3">
                                    <FacebookIcon width="22" height="22" />
                                    <span className="text-13 font-bold text-gray-400">{`Facebook`}</span>
                                    <span className="text-13 font-bold text-source-facebook">{countFacebook}</span>
                                    {open ? (
                                        <DownIcon className="select-none fill-current text-gray-400 outline-none" width="1.25rem" height="1.25rem" />
                                    ) : (
                                        <RightIcon className="select-none fill-current text-gray-400 outline-none" width="1.25rem" height="1.25rem" />
                                    )}
                                </Disclosure.Button>
                                {sortedPosts.map((room, index) => {
                                    if (toLower(room.channel) === "facebook_feed") {
                                        return (
                                            <Transition
                                                key={index}
                                                show={open}
                                                enter="transition duration-100 ease-out"
                                                enterFrom="transform scale-95 opacity-0"
                                                enterTo="transform scale-100 opacity-100"
                                                leave="transition duration-75 ease-out"
                                                leaveFrom="transform scale-100 opacity-100"
                                                leaveTo="transform scale-95 opacity-0">
                                                <Disclosure.Panel>
                                                    <PostRoom room={room} key={room._id} getPostMessages={getPostMessages} />
                                                </Disclosure.Panel>
                                            </Transition>
                                        );
                                    }
                                })}
                            </div>
                        )}
                    </Disclosure>
                )}

                {!groupPost &&
                    sortedPosts.map((room) => {
                        return <PostRoom room={room} key={room._id} getPostMessages={getPostMessages} />;
                    })}
            </div>
        );
    }

    return (
        <div className="relative flex h-full flex-1 flex-col bg-gray-lightest md:hidden">
            <div className="relative flex h-full flex-col items-center justify-center bg-white text-center">
                <div className="mx-auto flex max-w-sm flex-col items-center">
                    <GreetingPostIcon className="my-10" width="217" height="229" />
                    <div className="flex flex-col sm:flex-row">
                        <div className="mr-1 text-xl font-bold text-gray-400 text-opacity-75">{greeting}</div>
                        <div className="text-xl font-bold text-primary-200">{firstName}</div>
                    </div>
                    <div className="text-15 leading-normal text-gray-400 text-opacity-[0.65]">
                        {!canViewReplies ? t("pma.Parece que no tienes acceso a esta sección") : t("pma.Aún no tienes publicaciones entrantes")}
                    </div>
                </div>
            </div>
        </div>
    );
};
export default PostSidebar;
