import dayjs from "dayjs";
import Fuse from "fuse.js";
import get from "lodash/get";
import first from "lodash/first";
import sortBy from "lodash/sortBy";
import isEmpty from "lodash/isEmpty";
import reverse from "lodash/reverse";
import toUpper from "lodash/toUpper";
import { withTranslation } from "react-i18next";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import InboxRoomSidebar from "./inbox-room-sidebar";
import { getTime } from "@apps/shared/utils";
import { GreetingIcon } from "@apps/shared/icons";
import { usePrevious } from "@apps/shared/hooks";
import { setCurrentRoom } from "@apps/redux/store";
import { RoomSidebarLoading } from "@apps/shared/common";

const InboxSidebar = (props) => {
    const { t } = props;
    const dispatch = useDispatch();
    const rooms = useSelector((state) => state.rooms);
    const query = useSelector((state) => state.query);
    const company = useSelector((state) => state.company);
    const userSession = useSelector((state) => state.userSession);
    const [loadingRooms, setLoadingRooms] = useState(true);
    const fuseOptions = {
        shouldSort: true,
        threshold: 0.25,
        location: 0,
        caseSensitive: false,
        distance: 100,
        maxPatternLength: 32,
        minMatchCharLength: 1,
        keys: ["name", "names", "senderId", "user.id"],
    };
    const time = dayjs().locale("es").format("HH:mm");

    const getFilteredRooms = () => {
        if (isEmpty(query)) {
            return rooms;
        }
        const fuse = new Fuse(rooms, fuseOptions);
        const result = fuse.search(query);
        let room = [];
        result.map((rooms) => {
            return room.push(rooms.item);
        });
        return room;
    };

    const _rooms = reverse(sortBy(getFilteredRooms(), ["lastMessageAt"]));
    const filteredRoom = _rooms.filter((bot) => toUpper(bot.type) === "COMPANY"); //cambiar a estado
    const name = get(userSession, "names", "");
    let firstName = first(name.split(" "));
    const greeting = getTime(time, t);
    const canSeeInbox = get(company, "properties.hasInternalInbox", false);
    const prevRoom = usePrevious(filteredRoom);

    useEffect(() => {
        if (isEmpty(first(prevRoom))) {
            dispatch(setCurrentRoom(first(filteredRoom)));
            setLoadingRooms(false);
        }
    }, [rooms]);

    if (loadingRooms) {
        return (
            <div className="flex h-auto w-full flex-col rounded-l-lg border-r-default border-hover-conversation bg-white sm:mb-16">
                <RoomSidebarLoading />
            </div>
        );
    }

    return (
        <div className="flex h-auto w-full flex-col rounded-l-lg border-r-default border-hover-conversation bg-white sm:mb-16">
            {!isEmpty(filteredRoom) ? (
                <div className="relative mb-12 flex-1 overflow-y-auto overflow-x-hidden md:mb-14 mid:mb-0">
                    {filteredRoom.map((room) => {
                        return <InboxRoomSidebar room={room} key={room.id} />;
                    })}
                </div>
            ) : (
                <div className="bg-gray-lightest relative flex h-full flex-1 flex-col mid:hidden">
                    <div className="relative flex h-full flex-col items-center justify-center bg-white text-center mid:rounded-xl">
                        <div className="mx-auto mt-4 flex max-w-lg flex-col items-center sm:mt-0">
                            <GreetingIcon className="my-10" width="25.8125rem" height="18.625rem" />
                            <div className="flex flex-col sm:flex-row">
                                <div className="mr-1 text-xl font-bold text-gray-400/75">{t(greeting)}</div>
                                <div className="text-xl font-bold text-primary-200">{firstName}</div>
                            </div>
                            <div className="text-15 leading-normal text-gray-400/65">
                                {!canSeeInbox ? t("pma.Parece que no tienes acceso a esta sección") : t("pma.Aún no tienes consultas entrantes")}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default withTranslation()(InboxSidebar);
