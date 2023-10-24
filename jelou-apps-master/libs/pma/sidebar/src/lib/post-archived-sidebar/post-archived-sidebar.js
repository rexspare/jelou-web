import "dayjs/locale/es";
import dayjs from "dayjs";
import Fuse from "fuse.js";
import get from "lodash/get";
import first from "lodash/first";
import sortBy from "lodash/sortBy";
import reverse from "lodash/reverse";
import isEmpty from "lodash/isEmpty";
import { ClipLoader } from "react-spinners";
import { useTranslation, withTranslation } from "react-i18next";
import React, { useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";

import ArchivedPostRoom from "./post-archived-room";
import { addArchivedPosts } from "@apps/redux/store";
import { getTime } from "@apps/shared/utils";
import { JelouApiV1 } from "@apps/shared/modules";
import { GreetingIcon } from "@apps/shared/icons";
import { RoomSidebarLoading } from "@apps/shared/common";

const ArchivedPostRooms = (props) => {
    const { t } = useTranslation();
    const query = useSelector((state) => state.query);
    const company = useSelector((state) => state.company);
    const userSession = useSelector((state) => state.userSession);
    const archivedPosts = useSelector((state) => state.archivedPosts);
    const isLoadingArchivedPostSidebar = useSelector((state) => state.isLoadingArchivedPostSidebar);
    const [loadingMoreArchivedPosts, setLoadingMoreArchivedPosts] = useState(false);
    const [hasMoreArchivedPosts, setHasMoreArchivedPosts] = useState(true);
    const [countPage, setCountPage] = useState(1);

    const dispatch = useDispatch();
    const sidebar = useRef(null);
    const fuseOptions = {
        shouldSort: true,
        threshold: 0.25,
        location: 0,
        distance: 100,
        maxPatternLength: 32,
        minMatchCharLength: 1,
        keys: [
            "user.name",
            "user.names",
            "user.referenceId",
            "user.id",
            "name",
            "metadata.nickname",
            "metadata.username",
            "metadata.names",
            "metadata.name",
            "metadata.userId",
            "replyPreview.bubble.text",
        ],
    };

    const name = get(userSession, "names", "");
    let firstName = first(name.split(" "));
    const time = dayjs().locale("es").format("HH:mm");
    const greeting = getTime(time, t);

    const handleLoadMorePosts = async () => {
        setCountPage(countPage + 1);
        try {
            setLoadingMoreArchivedPosts(true);
            const lastPost = first(archivedPosts);

            if (lastPost) {
                const { data: response } = await JelouApiV1.get(`/companies/${company.id}/replies`, {
                    params: {
                        onlyRoom: true,
                        status: "CLOSED_BY_OPERATOR",
                        type: "reply",
                        page: countPage + 1,
                        search: query,
                    },
                });

                const archPosts = get(response, "results", []);

                dispatch(addArchivedPosts(archPosts));

                if (archPosts.length > 0) {
                    setHasMoreArchivedPosts(true);
                    dispatch(addArchivedPosts(archPosts));
                } else {
                    setHasMoreArchivedPosts(false);
                }
            }
            setLoadingMoreArchivedPosts(false);
        } catch (error) {
            console.log("error", error);
            setLoadingMoreArchivedPosts(false);
        }
    };

    const getFilteredarchivedRooms = () => {
        if (isEmpty(query)) {
            return archivedPosts;
        }
        const fuse = new Fuse(archivedPosts, fuseOptions);
        const result = fuse.search(query);
        let posts = [];
        result.map((post) => {
            return posts.push(post.item);
        });
        return posts;
    };

    const archivedPostRoom = reverse(sortBy(getFilteredarchivedRooms(), ["lastMessageAt"]));

    if (isLoadingArchivedPostSidebar) {
        return (
            <div className="border-background flex h-auto w-full flex-col rounded-l-lg border-r-default bg-white sm:h-sidebar-archived">
                <RoomSidebarLoading />
            </div>
        );
    }

    return !isEmpty(archivedPostRoom) ? (
        <div className="relative mb-12 flex-1 overflow-y-auto overflow-x-hidden md:mb-14 mid:mb-0" ref={sidebar}>
            {archivedPostRoom.map((room) => {
                return <ArchivedPostRoom room={{ ...room }} key={room._id} />;
            })}
            {archivedPostRoom.length >= 20 && hasMoreArchivedPosts && (
                <div className="my-4 flex items-center justify-center sm:my-6">
                    {loadingMoreArchivedPosts ? (
                        <ClipLoader color="#00B3C7" size={"1.75rem"} />
                    ) : (
                        <button
                            onClick={handleLoadMorePosts}
                            className="h-8 rounded-full border-transparent bg-primary-200 px-6 text-white hover:bg-primary-100 focus:outline-none">
                            {t("pma.Cargar más")}
                        </button>
                    )}
                </div>
            )}
        </div>
    ) : (
        <div className={`relative flex h-full flex-1 flex-col bg-gray-lightest md:hidden`}>
            <div className="relative flex h-full flex-col items-center justify-center bg-white text-center">
                <div className="mx-auto mt-4 flex max-w-sm flex-col items-center sm:mt-0">
                    <div className="flex flex-col sm:flex-row">
                        <div className="mr-1 text-sm font-bold text-gray-400 md:text-2xl">{greeting}</div>
                        <div className="text-sm font-bold text-primary-200 md:text-2xl">{firstName}</div>
                    </div>
                    <GreetingIcon className="my-2 h-44 w-40 sm:my-10 sm:h-48 sm:w-52" />
                    <div className="text-sm font-bold leading-normal text-gray-400 md:text-2xl">{t("pma.Aún no tienes consultas entrantes")}</div>
                </div>
            </div>
        </div>
    );
};
export default ArchivedPostRooms;
