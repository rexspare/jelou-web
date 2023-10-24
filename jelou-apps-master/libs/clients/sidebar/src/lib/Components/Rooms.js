import { ClipLoader } from "react-spinners";
import { useState, useEffect, useContext } from "react";
import sortBy from "lodash/sortBy";
import reverse from "lodash/reverse";
import isEmpty from "lodash/isEmpty";
import get from "lodash/get";
import Room from "./Room";
import { GreetingIcon, DownIcon, RightIcon } from "@apps/shared/icons";
import RoomsLoading from "./RoomsLoading";
import { Disclosure } from "@headlessui/react";
import { Source } from "@apps/shared/common";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { ClientStateContext } from "@apps/clients-state-context";

const Rooms = (props) => {
    const {
        isLoadingRoom,
        setIsLoadingMessage,
        rooms,
        sortOrder,
        query,
        field,
        groupRooms,
        selectedOptions,
        setLoadingOperators,
        handleLoadMoreNotifications,
        loadingMoreRooms,
        hasMoreRooms,
        isLoadingChatProfile,
        pag,
    } = props;
    const { t } = useTranslation();
    const user = localStorage.getItem("user");

    const urlSearch = useLocation();
    const [filterRoomTwo, setFilterRoomTwo] = useState({});

    const { chooseChat, setChooseChat, objChooseChat, setObjChooseChat } = useContext(ClientStateContext);

    const currentRoomClientsSN = useSelector((state) => state.currentRoomClients);

    //? se crea estado que escucha clic en chat
    useEffect(() => {
        if (urlSearch.state) {
            setChooseChat(true);
            setObjChooseChat(urlSearch.state.room);
        } else {
            setChooseChat(false);
            setObjChooseChat({});
        }
    }, [urlSearch]);

    const getFilteredRooms = () => {
        if (sortOrder === "asc_alphabet") {
            return sortBy(rooms, ["names"]);
        }
        if (sortOrder === "asc_chat") {
            return reverse(sortBy(rooms, ["previewMessage.createdAt"]));
        }

        if (sortOrder === "desc_chat") {
            return sortBy(rooms, ["previewMessage.createdAt"]);
        }
        return reverse(sortBy(rooms, ["names"]));
    };

    const filterRoom = getFilteredRooms();

    const groupedRooms = filterRoom.reduce(function (r, a) {
        // la lista de rooms es separada por el tipo de Bot
        // pero los tipo widget no tienen el objeto Bot con datos
        // entonces cuando es vacio se le asigna el tipo Widget
        const BotIsEmpty = get(a, "Bot.type", "");
        if (!isEmpty(BotIsEmpty)) {
            r[a.Bot.type] = r[a.Bot.type] || [];
            r[a.Bot.type].push(a);
        } else {
            r["Widget"] = r["Widget"] || [];
            r["Widget"].push(a);
        }
        return r;
    }, Object.create(null));

    useEffect(() => {
        if (!isEmpty(currentRoomClientsSN)) {
            if (currentRoomClientsSN.id === objChooseChat.roomId) {
                setFilterRoomTwo(currentRoomClientsSN);
            }
        }
    }, [currentRoomClientsSN]);

    if (isLoadingRoom) {
        return (
            <div className="flex h-auto w-full flex-col rounded-l-lg bg-white sm:h-sidebar-archived">
                <RoomsLoading />
            </div>
        );
    }

    //? ************************************************** */
    if (!isEmpty(filterRoom)) {
        return (
            <div className="scrollcontainer flex w-full flex-col overflow-x-hidden rounded-l-lg border-r-1 border-gray-100 border-opacity-25 bg-white">
                <div className="relative flex-1 pb-8">
                    {groupRooms &&
                        Object.keys(groupedRooms).map((key, indexNum) => {
                            return (
                                <Disclosure key={`separator-tag-${indexNum}`}>
                                    {({ open }) => (
                                        <>
                                            <Disclosure.Button className="sticky top-0  flex w-full items-center justify-between space-x-3 border-t-0.5 border-b-1 border-gray-100 border-opacity-25 bg-white px-4 py-3">
                                                <div className="flex flex-row items-center space-x-3 text-13">
                                                    <Source source={key} size="20" />
                                                    <span className="font-bold text-gray-400">{key}</span>
                                                    <span className="text-gray-400">{groupedRooms[key].length}</span>
                                                </div>
                                                {open ? (
                                                    <DownIcon
                                                        className="select-none fill-current text-gray-100 outline-none"
                                                        width="1.25rem"
                                                        height="1.25rem"
                                                    />
                                                ) : (
                                                    <RightIcon
                                                        className="select-none fill-current text-gray-100 outline-none"
                                                        width="1.25rem"
                                                        height="1.25rem"
                                                    />
                                                )}
                                            </Disclosure.Button>
                                            <Disclosure.Panel>
                                                {groupedRooms[key].map((room, index) => {
                                                    return (
                                                        <Room
                                                            room={room}
                                                            key={index}
                                                            setIsLoadingMessage={setIsLoadingMessage}
                                                            query={query}
                                                            field={field}
                                                            selectedOptions={selectedOptions}
                                                            setLoadingOperators={setLoadingOperators}
                                                        />
                                                    );
                                                })}
                                            </Disclosure.Panel>
                                        </>
                                    )}
                                </Disclosure>
                            );
                        })}
                    {!groupRooms && chooseChat && !isEmpty(filterRoomTwo) && pag === 1 && (
                        <Room
                            room={filterRoomTwo}
                            setIsLoadingMessage={setIsLoadingMessage}
                            query={query}
                            field={field}
                            selectedOptions={selectedOptions}
                            setLoadingOperators={setLoadingOperators}
                        />
                    )}
                    {!groupRooms &&
                        chooseChat &&
                        pag !== 1 &&
                        filterRoom.map((room, index) => {
                            return (
                                <Room
                                    room={room}
                                    key={index}
                                    setIsLoadingMessage={setIsLoadingMessage}
                                    query={query}
                                    field={field}
                                    selectedOptions={selectedOptions}
                                    setLoadingOperators={setLoadingOperators}
                                />
                            );
                        })}
                    {!groupRooms &&
                        !chooseChat &&
                        filterRoom.map((room, index) => {
                            return (
                                <Room
                                    room={room}
                                    key={index}
                                    setIsLoadingMessage={setIsLoadingMessage}
                                    query={query}
                                    field={field}
                                    selectedOptions={selectedOptions}
                                    setLoadingOperators={setLoadingOperators}
                                />
                            );
                        })}
                    {(loadingMoreRooms || isLoadingChatProfile) && (
                        <div className="my-4 flex items-center justify-center sm:my-6">
                            <ClipLoader color="#00B3C7" size={"2rem"} />
                        </div>
                    )}
                    {/* {filterRoom.length >= 9 && hasMoreRooms && ( */}
                    {hasMoreRooms && !loadingMoreRooms && !chooseChat && (
                        <div className="my-4 flex items-center justify-center sm:my-6">
                            <button
                                onClick={() => {
                                    handleLoadMoreNotifications();
                                }}
                                className="h-8 rounded-full border-transparent bg-primary-200 px-6 text-white hover:bg-primary-100 focus:outline-none">
                                {t("clients.loadMore")}
                            </button>
                        </div>
                    )}
                    {hasMoreRooms && !loadingMoreRooms && chooseChat && !isEmpty(filterRoomTwo) && (
                        <div className="my-4 flex items-center justify-center sm:my-6">
                            <button
                                onClick={() => {
                                    handleLoadMoreNotifications();
                                }}
                                className="h-8 rounded-full border-transparent bg-primary-200 px-6 text-white hover:bg-primary-100 focus:outline-none">
                                {t("clients.loadMore")}
                            </button>
                        </div>
                    )}
                </div>

                <div className="fixed bottom-0 mb-12 flex h-9 w-full items-center bg-primary-600 px-4 sm:mb-2 mid:absolute mid:mb-0 mid:rounded-bl-xl">
                    <div className="shadow-solid mx-4 flex h-3 w-3 rounded-full bg-primary-200 text-white"></div>
                    <div className="text-xs font-bold text-gray-400">
                        {rooms.length > 1 ? `${rooms.length} ${t("clients.clients")}` : `${rooms.length} ${t("clients.clients")}`}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={`relative flex h-full flex-1 flex-col bg-gray-lightest md:hidden`}>
            <div className="relative flex h-full flex-col items-center justify-center bg-white text-center">
                <div className="mx-auto mt-4 flex max-w-sm flex-col items-center sm:mt-0">
                    <GreetingIcon className="my-10" width="25.8125rem" height="18.625rem" />
                    <div className="flex flex-col sm:flex-row">
                        <div className="mr-1 text-xl font-bold text-gray-400 text-opacity-75">{t("clients.hello")}</div>
                        <div className="text-xl font-bold text-primary-200">{user}</div>
                    </div>
                    <div className="text-15 leading-normal text-gray-400 text-opacity-65">{t("clients.noConsults")}</div>
                </div>
            </div>
        </div>
    );
};

export default Rooms;
