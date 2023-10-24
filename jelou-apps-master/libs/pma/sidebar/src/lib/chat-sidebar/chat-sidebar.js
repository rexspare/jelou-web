import Fuse from "fuse.js";
import sortBy from "lodash/sortBy";
import isEmpty from "lodash/isEmpty";
import toLower from "lodash/toLower";
import reverse from "lodash/reverse";
import get from "lodash/get";
import first from "lodash/first";
import { useSelector } from "react-redux";
import { withTranslation } from "react-i18next";
import React, { useState, useEffect } from "react";
import { RoomSidebarLoading } from "@apps/shared/common";

import RoomSidebar from "./room-sidebar";
import { GreetingIcon } from "@apps/shared/icons";
import { getTime } from "@apps/shared/utils";
import dayjs from "dayjs";

const ChatSidebar = (props) => {
    const { sortOrder, t } = props;
    const rooms = useSelector((state) => state.rooms);
    const query = useSelector((state) => state.query);
    const userSession = useSelector((state) => state.userSession);
    const [loadingRooms, setLoadingRooms] = useState(true);
    //
    const fuseOptions = {
        shouldSort: true,
        threshold: 0.25,
        location: 0,
        distance: 100,
        maxPatternLength: 32,
        minMatchCharLength: 1,
        includeMatches: true,
        keys: ["name", "names", "senderId", "user.id", "message.text"],
    };

    useEffect(() => {
        if (!isEmpty(rooms)) {
            setLoadingRooms(false);
        }
    }, [rooms]);

    useEffect(() => {
        if (isEmpty(rooms)) {
            setLoadingRooms(false);
        }
    }, [rooms]);

    const getFilteredRooms = () => {
        if (isEmpty(query)) {
            if (sortOrder === "asc_message") {
                return reverse(sortBy(rooms, ["lastMessageAt"]));
            }

            if (sortOrder === "desc_message") {
                return sortBy(rooms, ["lastMessageAt"]);
            }

            if (sortOrder === "asc_chat") {
                return reverse(sortBy(rooms, ["conversation.createdAt", "lastMessageAt"]));
            }

            if (sortOrder === "desc_chat") {
                return sortBy(rooms, ["conversation.createdAt", "lastMessageAt"]);
            }

            if (isEmpty(sortOrder)) {
                return sortBy(rooms, ["lastMessageAt"]);
            }

            return reverse(sortBy(rooms, ["lastMessageAt"]));
        }

        const fuse = new Fuse(rooms, fuseOptions);
        const result = fuse.search(query);
        let room = [];
        result.map((rooms) => {
            return room.push(rooms.item);
        });
        return room;
    };

    const time = dayjs().locale("es").format("HH:mm");

    const sortedRooms = getFilteredRooms();
    const filteredRooms = sortedRooms.filter((room) => toLower(room.type) !== "company");
    const name = get(userSession, "names", "");
    let firstName = first(name.split(" "));
    const greeting = getTime(time, t);

    if (loadingRooms) {
        return (
            <div className="flex h-auto w-full flex-1 flex-col rounded-l-lg bg-white sm:h-sidebar">
                <div className="flex h-auto w-full flex-col rounded-l-lg border-r-default border-hover-conversation bg-white sm:h-sidebar-archived">
                    <RoomSidebarLoading />
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-auto w-full flex-1 flex-col overflow-y-auto rounded-l-lg bg-white sm:h-sidebar">
            {!isEmpty(filteredRooms) ? (
                <div className="relative flex-1 overflow-y-auto overflow-x-hidden pb-14">
                    {filteredRooms.map((room) => {
                        if (!room?.id) return null;

                        return <RoomSidebar room={room} key={room.id} sortOrder={sortOrder} />;
                    })}
                </div>
            ) : (
                <div className="mx-auto mt-4 mb-12 flex h-full max-w-lg flex-1 flex-col items-center justify-center bg-white text-center sm:mt-0 mid:hidden">
                    <GreetingIcon className="my-10" width="25.8125rem" height="18.625rem" />
                    <div className="flex flex-col sm:flex-row">
                        <div className="mr-1 text-lg font-bold text-gray-400 text-opacity-75 md:text-xl">{greeting}</div>
                        <div className="text-lg font-bold text-primary-200 md:text-xl">{firstName}</div>
                    </div>
                    <div className="text-sm leading-normal text-gray-400 text-opacity-[0.65] md:text-15">
                        {t("pma.Aún no tienes consultas entrantes")}
                    </div>
                </div>
            )}

            <div className="fixed bottom-0 mb-14 flex h-9 w-full items-center bg-primary-600 px-4 sm:mb-16 mid:absolute mid:mb-0 mid:rounded-b-xl">
                <div className="shadow-solid mx-4 flex h-3 w-3 rounded-full bg-secondary-300 text-white"></div>
                <div className="text-xs font-bold text-gray-400">
                    {filteredRooms.length > 1 ? `${filteredRooms.length} ${t("pma.activos")}` : `${filteredRooms.length} ${t("pma.activo")}`}
                </div>
            </div>
        </div>
    );
};

export default withTranslation()(ChatSidebar);
