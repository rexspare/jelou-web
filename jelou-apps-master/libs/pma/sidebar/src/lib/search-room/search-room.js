import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import toUpper from "lodash/toUpper";
import { ClipLoader } from "react-spinners";
import { withTranslation } from "react-i18next";
import React, { useEffect, useRef, useState } from "react";
import { DebounceInput } from "react-debounce-input";
import { NavLink, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import { JelouApiV1 } from "@apps/shared/modules";
import { ArchivedIcon, SearchIcon } from "@apps/shared/icons";
import { useOnClickOutside } from "@apps/shared/hooks";
import {
    addSearchBy,
    deleteSearchBy,
    setCurrentRoom,
    setRoomArchived,
    addQuerySearch,
    deleteQuerySearch,
    deleteEmailSearchBy,
    deleteEmailQuerySearch,
    addArchivedPosts,
    setQuery,
    //     deleteTicketsQuerySearch,
    //     deleteTicketsSearchBy,
} from "@apps/redux/store";
import { GlobalSearchPma } from "@apps/shared/common";
import PostSearchOptions from "./post-search-options";
import RoomSearchOptions from "./room-search-options";
import { currentSectionPma } from "@apps/shared/constants";

const inputStyle =
    "w-full rounded-[0.8125rem] border-[0.0938rem] border-gray-100/50 py-2 pl-10 text-sm text-gray-darker focus:border-gray-100 focus:ring-transparent placeholder:text-gray-400 placeholder:text-opacity-70 placeholder:text-sm";

const SearchRoom = (props) => {
    const {
        searchOnType,
        searchPosts,
        getArchivedFiles,
        setShowAscOptions,
        sortOrderRoom,
        setSortOrderRoom,
        sortOrder,
        setSortOrder,
        groupPost,
        setGroupPost,
        showSortOptions,
        setShowSortOptions,
        showChatSortOptions,
        setShowChatSortOptions,
        t,
    } = props;
    const [loadingSearch, setLoadingSearch] = useState(false);
    const userSession = useSelector((state) => state.userSession);
    const query = useSelector((state) => state.query);
    const archivedQuerySearch = useSelector((state) => state.archivedQuerySearch);
    const archivedRooms = useSelector((state) => state.archivedRooms);
    const archivedSearchBy = useSelector((state) => state.archivedSearchBy);
    const dispatch = useDispatch();
    let { section, subSection = "" } = useParams();
    const dropdownRef = useRef();
    const input = useRef();
    let typingTimer;
    useOnClickOutside(dropdownRef, () => setShowAscOptions(false));
    const searchButton = useRef();

    useEffect(() => {
        dispatch(setQuery(""));
        if (input.current) {
            input.current.state.value = "";
        }
    }, [section]);

    const setOrder = (order) => {
        setSortOrder(order);
        localStorage.setItem("sortOrder", order);
    };

    async function handleChange({ target }) {
        setLoadingSearch(true);
        const { value } = target;
        dispatch(setQuery(value));

        if (searchOnType) {
            if (!isEmpty(value)) {
                getArchivedFiles(100, 0, target.value);
            }
            setLoadingSearch(false);
        }

        if (searchPosts) {
            if (!isEmpty(value)) {
                const { data: response } = await JelouApiV1.get(`companies/${userSession.companyId}/replies`, {
                    params: {
                        onlyRoom: true,
                        status: "CLOSED_BY_OPERATOR",
                        // attendedById: userSession.providerId,
                        type: "reply",
                        searchBy: "recipientId,senderId,from.names,text",
                        search: value,
                    },
                });

                let archived = [];

                const archivedThreads = get(response, "results", []);

                if (!isEmpty(archivedThreads)) {
                    archivedThreads.forEach((archivedThread) => {
                        archivedThread.archived = true;
                        archived.push(archivedThread);
                    });
                    dispatch(addArchivedPosts(archived));
                }
            }
            setLoadingSearch(false);
        }

        setLoadingSearch(false);
    }

    async function handleKeyDown(e) {
        if (e.key === "Enter") {
            clearTimeout(typingTimer);
            if (searchOnType) {
                await getArchivedFiles(100, 0, query);
            }
            setLoadingSearch(false);
        }
    }

    const setArchivedSearch = (input) => {
        dispatch(addQuerySearch(input));
    };

    const clearFilter = () => {
        if (!isEmpty(archivedQuerySearch)) {
            dispatch(setRoomArchived([]));
            dispatch(setCurrentRoom([]));
            dispatch(deleteQuerySearch());
            dispatch(deleteSearchBy());
        }
    };

    useEffect(() => {
        if (section !== "archived") {
            dispatch(setRoomArchived([]));
            dispatch(deleteQuerySearch());
            dispatch(deleteSearchBy());
        }
        if (section !== "emails") {
            dispatch(deleteEmailQuerySearch());
            dispatch(deleteEmailSearchBy());
        }
    }, [section]);

    const setSearchBy = (search) => {
        dispatch(addSearchBy(search));
    };

    const typeSearchBy = [
        { id: 0, name: "Id", searchBy: "recipient.id.phoned,sender.id.phoned", isNumber: false },
        { id: 1, name: "Mensajes", searchBy: "bubble.text.folded", isNumber: false },
        { id: 2, name: "Cliente", searchBy: "sender.names,recipient.names", isNumber: false },
    ];

    return (
        <div className="mt-12 flex flex-col md:mt-0">
            {section === "archived" ? (
                <div className="border-b-default border-gray-400 border-opacity-25 p-2 px-4 md:py-3 mid:mt-0 mid:py-4">
                    <GlobalSearchPma
                        searchButton={searchButton}
                        setQuery={setArchivedSearch}
                        query={archivedQuerySearch}
                        searchBy={archivedSearchBy}
                        setSearchBy={setSearchBy}
                        clean={clearFilter}
                        typeSearchBy={typeSearchBy}
                        placeholder={t("globalSearch.placeholder")}
                        type="archived"
                    />
                    {!isEmpty(archivedQuerySearch) && isEmpty(archivedRooms) && <span className="mt-1 flex justify-end text-11 italic text-red-500">*No se encontraron resultados</span>}
                </div>
            ) : (
                <div className={`flex flex-col items-center justify-between ${section === "posts" ? "pb-2 sm:pb-3 md:pt-4 xxl:py-4" : "pb-3 mid:py-4"} border-btm space-y-4`}>
                    <div className="relative flex w-full items-center px-4">
                        <div className="absolute bottom-0 left-0 top-0 ml-4 flex items-center px-4">
                            {loadingSearch ? (
                                <div>
                                    <ClipLoader size={"0.875rem"} color={"#c4daf2"} />
                                </div>
                            ) : (
                                <SearchIcon className="h-4 w-5 fill-current sm:h-5 sm:w-5" />
                            )}
                        </div>
                        <div className="w-full">
                            <DebounceInput
                                type="search"
                                ref={input}
                                className={inputStyle}
                                minLength={2}
                                debounceTimeout={500}
                                placeholder={t("common.searchChat")}
                                onChange={handleChange}
                                onKeyDown={handleKeyDown}
                            />
                        </div>
                        {(toUpper(section) === currentSectionPma.CHATS || isEmpty(section)) && (
                            <RoomSearchOptions sortOrder={sortOrderRoom} setSortOrder={setSortOrderRoom} showSortOptions={showChatSortOptions} setShowSortOptions={setShowChatSortOptions} />
                        )}
                        {toUpper(section) === currentSectionPma.POSTS && subSection !== "archived" && (
                            <PostSearchOptions
                                sortOrder={sortOrder}
                                groupPost={groupPost}
                                setGroupPost={setGroupPost}
                                showSortOptions={showSortOptions}
                                setShowSortOptions={setShowSortOptions}
                                setOrder={setOrder}
                            />
                        )}
                    </div>
                </div>
            )}
            {toUpper(section) === currentSectionPma.ARCHIVED && (
                <div className="flex h-10 items-center space-x-2 border-b-default border-gray-400 border-opacity-25 bg-primary-600 px-4 sm:h-12 mid:hidden">
                    <NavLink className="flex cursor-pointer items-center" exact={"true"} to={`/pma/chats`}>
                        <button className="text-13 text-primary-200 focus:outline-none">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                    </NavLink>
                    <span className="flex flex-row items-center space-x-2">
                        <ArchivedIcon className="h-5 w-6 fill-current font-bold text-primary-200 sm:h-6" />
                        <p className="font-mid text-13 font-medium text-primary-200 sm:text-base">{t("pma.Archivados")}</p>
                    </span>
                </div>
            )}
        </div>
    );
};

export default withTranslation()(SearchRoom);
