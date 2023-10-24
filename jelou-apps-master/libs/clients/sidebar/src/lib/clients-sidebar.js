import React, { useState, useEffect, useRef } from "react";
import get from "lodash/get";
import Tippy from "@tippyjs/react";
import Rooms from "./Components/Rooms";

import { SortIcon, GridIcon } from "@apps/shared/icons";
import { useSelector } from "react-redux";
import { useOnClickOutside } from "@apps/shared/hooks";
import { Transition } from "@headlessui/react";
import first from "lodash/first";
import { useTranslation } from "react-i18next";

const Sidebar = (props) => {
    const {
        getRooms,
        isLoadingRoom,
        isLoadingMessage,
        setIsLoadingMessage,
        query,
        field,
        totalPages,
        selectedOptions,
        setLoadingOperators,
        loadingMoreRooms,
        isLoadingChatProfile,
    } = props;
    const { t } = useTranslation();

    const rooms = useSelector((state) => state.clientsRooms);
    const [showAscOptions, setShowAscOptions] = useState(false);
    const [sortOrder, setSortOrder] = useState(false);
    const dropdownRef = useRef();
    const [groupRooms, setGroupRooms] = useState(false);
    const [pag, setPag] = useState(1);
    const [hasMoreRooms, setHasMoreRooms] = useState(true);

    useOnClickOutside(dropdownRef, () => setShowAscOptions(false));

    useEffect(() => {
        setSortOrder(get(localStorage, "sortOrderRoom", "desc_chat"));
    }, []);

    const setOrder = (order) => {
        setSortOrder(order);
        localStorage.setItem("sortOrderRoom", order);
    };

    const preventFocus = (e) => {
        e.preventDefault();
        return false;
    };

    const showFilter = () => {
        setGroupRooms(!groupRooms);
        setShowAscOptions(false);
    };

    const handleLoadMoreNotifications = () => {
        setPag(pag + 1);
        try {
            const lastRooms = first(rooms);
            if (lastRooms) {
                const page = pag + 1;
                getRooms(page);
                if (page === totalPages) {
                    setHasMoreRooms(false);
                } else {
                    setHasMoreRooms(true);
                }
            }
        } catch (error) {
            console.log(error, "error");
        }
    };

    return (
        <div
            className={`xxl:w-96 relative mr-0 flex w-full flex-col border-r-1 border-gray-100 border-opacity-25 bg-white sm:rounded-b-xl mid:w-72 mid:rounded-bl-xl`}>
            <div className="flex w-full flex-col overflow-hidden rounded-bl-xl bg-white">
                <div className="flex w-full items-center justify-between border-b-1 border-b-gray-100 border-opacity-25 px-6 sm:px-4">
                    <div className="flex h-12 w-72 items-center justify-between">
                        <div className="flex items-center font-semibold text-primary-200">
                            <div className="mr-2 text-13 sm:text-base">{t("clients.clients")}</div>
                        </div>
                    </div>
                    <div className="pl-2 lg:flex">
                        <div className="relative flex space-x-2">
                            <Tippy content={t("clients.orderBy")} theme="jelou" arrow={false} touch={false}>
                                <button
                                    className="border-transparent focus:outline-none"
                                    onClick={() => {
                                        setShowAscOptions(!showAscOptions);
                                    }}
                                    onMouseDown={preventFocus}>
                                    <SortIcon className="h-6 w-6 fill-current font-bold text-gray-400 text-opacity-50 sm:h-7 sm:w-7" />
                                </button>
                            </Tippy>
                            <Transition
                                className="absolute right-0 z-50 mt-10 w-40 flex-col overflow-hidden rounded-lg bg-white shadow-global lg:flex"
                                show={showAscOptions}
                                as={"div"}
                                enter="transition ease-out duration-100"
                                enterFrom="transform opacity-0 scale-95"
                                enterTo="transform opacity-100 scale-100"
                                leave="transition ease-in duration-75"
                                leaveFrom="transform opacity-100 scale-100"
                                leaveTo="transform opacity-0 scale-95">
                                <div className="flex flex-col" ref={dropdownRef}>
                                    <button
                                        className={`border-b-1 border-gray-400 border-opacity-25 py-2 hover:bg-gray-400 hover:bg-opacity-15 ${
                                            sortOrder === "asc_alphabet" ? "text-primary-200 " : "text-gray-400"
                                        } `}
                                        onClick={() => {
                                            setOrder("asc_alphabet");
                                            setShowAscOptions(false);
                                        }}>
                                        <span className={`border-transparent text-13 font-bold focus:outline-none`}>{"A-Z"}</span>
                                    </button>
                                    <button
                                        className={`border-b-1 border-gray-400 border-opacity-25 py-2 hover:bg-gray-400 hover:bg-opacity-15 ${
                                            sortOrder === "asc_chat" ? "text-primary-200 " : "text-gray-400"
                                        } `}
                                        onClick={() => {
                                            setOrder("asc_chat");
                                            setShowAscOptions(false);
                                        }}>
                                        <span className={`border-transparent text-13 font-bold focus:outline-none`}>{t("clients.recentChat")}</span>
                                    </button>
                                    <button
                                        className={`py-2 hover:bg-gray-400 hover:bg-opacity-15 ${
                                            sortOrder === "desc_chat" ? "text-primary-200 " : "text-gray-400"
                                        } `}
                                        onClick={() => {
                                            setOrder("desc_chat");
                                            setShowAscOptions(false);
                                        }}>
                                        <span className={`border-transparent text-13 font-bold focus:outline-none`}>{t("clients.oldChat")}</span>
                                    </button>
                                </div>
                            </Transition>
                            <Tippy content={t("clients.viewGrid")} theme="jelou" arrow={false} touch={false}>
                                <button className="focus:outline-none" onClick={showFilter}>
                                    <GridIcon
                                        width="0.9375rem"
                                        height="0.9375rem"
                                        className={`h-7 w-6 fill-current font-bold ${groupRooms ? "text-primary-200" : "text-gray-100"}`}
                                    />
                                </button>
                            </Tippy>
                        </div>
                    </div>
                </div>
                <Rooms
                    isLoadingRoom={isLoadingRoom}
                    isLoadingMessage={isLoadingMessage}
                    setIsLoadingMessage={setIsLoadingMessage}
                    rooms={rooms}
                    sortOrder={sortOrder}
                    query={query}
                    field={field}
                    groupRooms={groupRooms}
                    selectedOptions={selectedOptions}
                    setLoadingOperators={setLoadingOperators}
                    handleLoadMoreNotifications={handleLoadMoreNotifications}
                    loadingMoreRooms={loadingMoreRooms}
                    hasMoreRooms={hasMoreRooms}
                    isLoadingChatProfile={isLoadingChatProfile}
                    pag={pag}
                />
            </div>
        </div>
    );
};

export default Sidebar;
