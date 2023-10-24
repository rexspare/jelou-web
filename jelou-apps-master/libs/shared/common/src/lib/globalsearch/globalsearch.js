import { unsetCurrentRoomClients } from "@apps/redux/store";
import { CleanIcon, CloseIcon, RecentSearchIcon, SearchIcon } from "@apps/shared/icons";
import { Popover, Transition } from "@headlessui/react";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import React, { Fragment, useEffect, useRef, useState } from "react";
import { withTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import ConversationSkeleton from "../skeleton/ConversationSkeleton";

const GlobalSearch = (props) => {
    const {
        selectedOptions,
        setSelectedOptions,
        t,
        query,
        setQuery,
        field,
        setField,
        search,
        typeSearchBy = [],
        actionOnSearch = () => null,
    } = props;

    const [input, setInput] = useState("");
    const searchButton = useRef();
    const dispatch = useDispatch();
    const mnLength = 2;
    const urlSearch = useLocation();
    const pathName = get(urlSearch, "pathname", "");
    const newPathName = pathName.split("/");
    const recents = localStorage.getItem(`recentSearch_${newPathName[2]}`)
        ? JSON.parse(localStorage.getItem(`recentSearch_${newPathName[2]}`) || [])
        : [];
    useEffect(() => {
        if (!isEmpty(query) && !isEmpty(field)) {
            const globalSearch = { query, field: field.type };
            const globalSearchRecenr = { query, field };
            setSelectedOptions({ ...selectedOptions, globalSearch });
            recentSearch(globalSearchRecenr);
        }
    }, [query, field]);

    const recentSearch = (globalSearch) => {
        if (localStorage.getItem(`recentSearch_${newPathName[2]}`)) {
            let recentSearch = JSON.parse(localStorage.getItem(`recentSearch_${newPathName[2]}`) || []);
            recentSearch.unshift(globalSearch);
            if (recentSearch.length > 3) {
                recentSearch = recentSearch.slice(0, 3);
            }
            localStorage.setItem(`recentSearch_${newPathName[2]}`, JSON.stringify(recentSearch));
        } else {
            localStorage.setItem(`recentSearch_${newPathName[2]}`, JSON.stringify([globalSearch]));
        }
    };

    const findRecentSearch = ({ field, query }) => {
        actionOnSearch();
        dispatch(unsetCurrentRoomClients());
        const queryLocal = query;
        const fieldLocal = field;
        setQuery(queryLocal);
        setField(fieldLocal);
    };

    const handleKeyDown = (event) => {
        if (event.key === "Enter") {
            actionOnSearch();
            dispatch(unsetCurrentRoomClients());
            setQuery(input);
            setField(!isEmpty(field) ? field : search[0]);
            searchButton.current?.click();
        }
    };

    const handleSearch = () => {
        actionOnSearch();
        dispatch(unsetCurrentRoomClients());
        setQuery(input);
        setField(!isEmpty(field) ? field : search[0]);
        searchButton.current?.click();
    };

    let loadingSkeleton = [];

    useEffect(() => {
        for (let i = 0; i < 8; i++) {
            loadingSkeleton.push(<ConversationSkeleton key={i} />);
        }
    }, []);

    const cleanFilter = () => {
        setQuery("");
        setField([]);
        setInput("");
        setSelectedOptions({ ...selectedOptions, globalSearch: {} });
        searchButton.current?.click();
    };

    const setTypeSearchBy = (type) => {
        setField(type);
    };

    // const close = () => {
    //     if (isEmpty(input) || isEmpty(query)) {
    //         cleanFilter();
    //     } else {
    //         searchButton.current?.click();
    //     }
    // };
    return (
        <Popover>
            <div className="mr-5 flex items-center rounded-input border-[0.0938rem] border-gray-100 border-opacity-50 bg-white">
                <Popover.Button
                    ref={searchButton}
                    className="flex w-72 items-center py-2 pl-3 pr-10 text-sm text-gray-400 text-opacity-75 ring-transparent focus:border-transparent focus:ring-transparent">
                    <div className="ml-2 mt-1 flex items-center">
                        <SearchIcon className="fill-current" width="1rem" height="1rem" />
                    </div>
                    <div className="mx-2 flex items-center space-x-2 truncate border-transparent text-gray-400 ring-transparent focus:border-transparent focus:ring-transparent">
                        {!isEmpty(query) && !isEmpty(field) ? (
                            <>
                                <span className="rounded-md border-primary-200 bg-primary-200 bg-opacity-10 px-2 text-gray-400">
                                    {`${
                                        field.type === "text"
                                            ? t("clients.msg")
                                            : field.type === "REFERENCE_ID"
                                            ? t("clients.idClients")
                                            : field.type === "client"
                                            ? t("clients.clients")
                                            : ""
                                    }:`}
                                </span>
                                <span>{query}</span>
                            </>
                        ) : (
                            <span className="text-gray-400 text-opacity-75">{t("clients.search")}</span>
                        )}
                    </div>
                </Popover.Button>
            </div>
            <Transition
                as={Fragment}
                enter="transition ease-out duration-200"
                enterFrom="opacity-0 translate-y-1"
                enterTo="opacity-100 translate-y-0"
                leave="transition ease-in duration-150"
                leaveFrom="opacity-100 translate-y-0"
                leaveTo="opacity-0 translate-y-1">
                <Popover.Panel className="absolute top-0 z-20 -ml-2 w-80 overflow-hidden rounded-xl bg-white shadow-preview lg:max-w-3xl">
                    <div className="relative flex flex-1 border-b-default border-gray-400 border-opacity-25 bg-white py-2 px-4">
                        <div className="mx-1 flex items-center">
                            <SearchIcon className="fill-current" width="1rem" height="1rem" />
                        </div>
                        <div className="flex w-full">
                            {!isEmpty(field) && (
                                <span className="flex-start mx-1 w-[30%] rounded-md border-primary-200 bg-primary-200 bg-opacity-10 px-2 text-13 text-gray-400">
                                    {field.name}
                                </span>
                            )}
                            <input
                                className="flex-start w-full border-transparent text-13 font-normal text-gray-400 text-opacity-75 outline-none ring-transparent focus:border-transparent focus:ring-transparent"
                                placeholder={t("clients.searchPlaceholder")}
                                onChange={(event) => setInput(event.target.value)}
                                onKeyPress={(event) => handleKeyDown(event)}
                                autoFocus
                                defaultValue={query}
                            />
                        </div>
                        <div className="ml-2 flex justify-end space-x-2">
                            <button className="mx-2" onClick={cleanFilter}>
                                <CleanIcon className="fill-current text-primary-200" width="0.844rem" height="1.178rem" />
                            </button>
                            <button className="justify-end" onClick={() => searchButton.current?.click()}>
                                <CloseIcon
                                    width="5"
                                    height="5"
                                    fillOpacity="0.25"
                                    className="mt-1 h-3 w-4 fill-current text-gray-400 text-opacity-25 sm:h-4 sm:w-4"
                                />
                            </button>
                        </div>
                    </div>
                    <div className="mx-2 space-y-3 px-3 py-4 text-13 font-normal text-gray-400">
                        <div className="mb-2 flex flex-wrap">
                            {typeSearchBy.map((btn, idx) => {
                                return (
                                    <button
                                        key={idx}
                                        className={`my-auto mt-1 mr-2 flex rounded-lg border-default border-primary-200 border-opacity-50 py-1 px-2 font-semibold text-gray-400 hover:bg-primary-200 hover:bg-opacity-10 ${
                                            !isEmpty(field) && field.id === btn.id ? "bg-primary-200 bg-opacity-10" : "bg-white"
                                        }`}
                                        onClick={() => setTypeSearchBy(btn)}>
                                        {get(btn, "icon") && <span className="mr-1">{btn.icon}</span>}
                                        {btn.name}
                                    </button>
                                );
                            })}
                        </div>
                        <span className="text-gray-400 text-opacity-75">{t("clients.recentSearch")}: </span>
                        <Popover.Overlay>
                            <div className="space-y-1">
                                {recents.map(
                                    ({ field, query }, key) =>
                                        key < 3 && (
                                            <button
                                                key={key}
                                                className="flex w-full items-center space-x-2 truncate rounded-md px-2 py-2 hover:bg-gray-100 hover:bg-opacity-10"
                                                onClick={() => findRecentSearch({ field, query })}>
                                                <RecentSearchIcon width="12" height="12" className="fill-current" />
                                                <span className="rounded-md bg-gray-400 bg-opacity-10 p-1 px-2 text-opacity-75">
                                                    {`${
                                                        field.type === "text"
                                                            ? t("clients.msg")
                                                            : field.type === "REFERENCE_ID"
                                                            ? t("clients.idClients")
                                                            : field.type === "client"
                                                            ? t("clients.clients")
                                                            : ""
                                                    }:`}
                                                </span>
                                                <span>{query}</span>
                                            </button>
                                        )
                                )}
                            </div>
                        </Popover.Overlay>
                    </div>
                    <Popover.Overlay>
                        <button
                            className={`flex h-[2.625rem] w-full items-center px-5 ${
                                input.length > 0 && input.length <= mnLength
                                    ? "cursor-not-allowed bg-gray-10"
                                    : "cursor-pointer bg-primary-200 bg-opacity-10 "
                            }`}
                            disabled={input > 0 && input.length <= mnLength}
                            onClick={handleSearch}>
                            <div className="flex w-full items-center justify-between">
                                <span
                                    className={`mr-2 flex items-center truncate text-sm ${
                                        input.length <= mnLength ? "text-gray-400" : "text-primary-200"
                                    }`}>
                                    <span className="flex h-5 w-full flex-1 items-center justify-center">
                                        <SearchIcon
                                            className="mt-px mr-1 fill-current text-sm text-primary-200"
                                            width="0.8125rem"
                                            height="0.8125rem"
                                            fill={input.length <= mnLength ? "#727C94" : "#00B3C7"}
                                        />
                                    </span>
                                    {t("globalSearch.allResultsFor")} <span className="max-w-xxs truncate font-bold italic">"{input}"</span>
                                </span>
                                <span
                                    className={`text-sm italic ${
                                        input.length > 0 && input.length <= mnLength ? "text-gray-400" : "text-primary-200"
                                    }`}>
                                    {t("[ENTER]")}
                                </span>
                            </div>
                        </button>
                    </Popover.Overlay>
                </Popover.Panel>
            </Transition>
        </Popover>
    );
};

export default withTranslation()(GlobalSearch);
