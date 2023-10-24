import "dayjs/locale/es";
import dayjs from "dayjs";
import get from "lodash/get";
import first from "lodash/first";
import sortBy from "lodash/sortBy";
import reverse from "lodash/reverse";
import isEmpty from "lodash/isEmpty";
import { ClipLoader } from "react-spinners";
import { useSelector, useDispatch } from "react-redux";
import React, { useEffect, useState, useRef } from "react";

import { getTime } from "@apps/shared/utils";
import { GreetingIcon } from "@apps/shared/icons";
import { RoomSidebarLoading } from "@apps/shared/common";
import ArchivedRoom from "./archived-room-sidebar";
import { unsetCurrentArchivedRoom } from "@apps/redux/store";
import { useTranslation } from "react-i18next";

const ArchivedSidebar = (props) => {
    const { getArchivedFiles, loadingArchived } = props;
    const { t } = useTranslation();
    const archivedRooms = useSelector((state) => state.archivedRooms);
    const userSession = useSelector((state) => state.userSession);
    const archivedQuerySearch = useSelector((state) => state.archivedQuerySearch);
    const [loadingMoreArchivedRooms, setLoadingMoreArchivedRooms] = useState(false);
    const [hasMoreArchivedRooms, setHasMoreArchivedRooms] = useState(true);
    const dispatch = useDispatch();

    const sidebar = useRef(null);
    const [pag, setPag] = useState(1);
    const name = get(userSession, "names", "");
    let firstName = first(name.split(" "));
    const time = dayjs().locale("es").format("HH:mm");
    const greeting = getTime(time, t);

    useEffect(() => {
        getArchivedFiles();
    }, [archivedQuerySearch]);

    useEffect(() => {
        dispatch(unsetCurrentArchivedRoom());
    }, []);

    const handleLoadMoreNotifications = async () => {
        const pagination = pag + 1;
        setPag(pagination);

        try {
            setLoadingMoreArchivedRooms(true);
            const limit = 10;
            const archivedRooms = await getArchivedFiles(limit, pagination, true);
            if (archivedRooms.length > 0) {
                setHasMoreArchivedRooms(true);
            } else {
                setHasMoreArchivedRooms(false);
            }
            setLoadingMoreArchivedRooms(false);
        } catch (error) {
            console.log(error, "error");
            setLoadingMoreArchivedRooms(false);
        }
    };

    const archivedRoom = reverse(sortBy(archivedRooms, ["lastMessageAt"]));

    if (loadingArchived) {
        return (
            <div className="flex h-auto w-full flex-col rounded-l-lg border-r-default border-hover-conversation bg-white sm:h-sidebar-archived">
                <RoomSidebarLoading />
            </div>
        );
    }

    if (!isEmpty(archivedRoom)) {
        return (
            <div className="relative mb-12 flex-1 overflow-y-auto overflow-x-hidden md:mb-14 mid:mb-0" ref={sidebar}>
                {archivedRoom.map((room) => {
                    return <ArchivedRoom room={{ ...room, id: room._id }} key={room.roomId} />;
                })}
                {archivedRoom.length >= 9 && hasMoreArchivedRooms && (
                    <div className="my-4 flex items-center justify-center sm:my-6">
                        {loadingMoreArchivedRooms ? (
                            <ClipLoader color="#00B3C7" size={"1.75rem"} />
                        ) : (
                            <button
                                onClick={handleLoadMoreNotifications}
                                className="h-8 rounded-full border-transparent bg-primary-200 px-6 text-white hover:bg-primary-100 focus:outline-none">
                                {t("pma.Cargar más")}
                            </button>
                        )}
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className={`relative flex h-full flex-1 flex-col bg-gray-lightest md:hidden`}>
            <div className="relative flex h-full flex-col items-center justify-center bg-white text-center">
                <div className="mx-auto mt-4 flex max-w-sm flex-col items-center sm:mt-0">
                    <GreetingIcon className="my-10" width="25.8125rem" height="18.625rem" />
                    <div className="flex flex-col sm:flex-row">
                        <div className="mr-1 text-xl font-bold text-gray-400 text-opacity-75">{greeting}</div>
                        <div className="text-xl font-bold text-primary-200">{firstName}</div>
                    </div>
                    <div className="text-15 leading-normal text-gray-400 text-opacity-[0.65]">{t("pma.Aún no tienes consultas entrantes")}</div>
                </div>
            </div>
        </div>
    );
};
export default ArchivedSidebar;
