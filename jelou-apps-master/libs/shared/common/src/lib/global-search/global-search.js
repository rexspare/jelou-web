import { Fragment } from "react";
import { Popover, Transition } from "@headlessui/react";
import { useEffect, useState } from "react";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import { useTranslation } from "react-i18next";

import { CleanIcon, CloseIcon, SearchIcon, TimeIcon } from "@apps/shared/icons";
import { Input } from "../../index.js";

const GlobalSearchPMA = (props) => {
    const {
        clean,
        minLength = 2,
        placeholder = "",
        query,
        recentSearchName,
        searchButton,
        searchBy = {},
        setQuery,
        setSearchBy,
        typeSearchBy,
        input,
        setInput,
        customHandleSearch = () => null,
    } = props;

    let _recents = localStorage.getItem(`recentSearch_${recentSearchName}`)
        ? JSON.parse(localStorage.getItem(`recentSearch_${recentSearchName}`) || [])
        : [];
    const [field, setField] = useState("");
    const [mnLength, setmnLength] = useState(minLength);
    const [recents, setRecents] = useState(_recents);
    const { t } = useTranslation();

    useEffect(() => {
        if (!isEmpty(field)) {
            field.isNumber ? setmnLength(0) : setmnLength(minLength);
        }
    }, [field]);

    useEffect(() => {
        _recents = localStorage.getItem(`recentSearch_${recentSearchName}`)
            ? JSON.parse(localStorage.getItem(`recentSearch_${recentSearchName}`) || [])
            : [];
        setRecents(_recents);
    }, [query, field]);

    useEffect(() => {
        if (!isEmpty(searchBy)) setField(searchBy);
    }, [searchBy]);

    const recentSearch = (currentSearch) => {
        const recentSearch = JSON.parse(localStorage.getItem(`recentSearch_${recentSearchName}`));
        if(!recentSearch){
          localStorage.setItem(`recentSearch_${recentSearchName}`, JSON.stringify([currentSearch]));
          return;
        }
        const isCurrentExist = recentSearch.some(recent => recent.query === currentSearch.query)
        if(!isCurrentExist){
          recentSearch.unshift(currentSearch);
          if (recentSearch.length > 3) {
            recentSearch.splice(3);
          }
          localStorage.setItem(`recentSearch_${recentSearchName}`, JSON.stringify(recentSearch));
        }
    };

    const findRecentSearch = (_search) => {
        const { query, field } = _search;
        setInput(query);
        setField(field);
        setQuery(query);
        setSearchBy(field);
        recentSearch({ query, field });
        customHandleSearch({ input: query, field });
        searchButton.current?.click();
    };

    const handleKeyDown = (event) => {
        if (event.key === "Enter" && !(input.length > 0 && input.length <= mnLength)) {
            setSearchBy(field);
            setQuery(input);
            recentSearch({ query: input, field });
            customHandleSearch({ input, field });
            searchButton.current?.click();
        }
    };

    const handleSearch = () => {
        setSearchBy(field);
        setQuery(input);
        customHandleSearch({ input, field });
    };

    const cleanFilter = () => {
        setInput("");
        setField("");
        setSearchBy("");
        clean();
        searchButton.current?.click();
    };

    const close = () => {
        if (isEmpty(input) || isEmpty(query)) {
            cleanFilter();
        } else {
            searchButton.current?.click();
        }
    };

    const setTypeSearchBy = (type) => {
        setField(type);
    };

    return (
        <Popover as="div" className="flex items-center rounded-xl bg-white">
            <div className="w-full">
                <Popover.Button
                    as="button"
                    ref={searchButton}
                    className="input relative flex h-[2.4rem] items-center border-gray-475 text-sm text-gray-475 text-opacity-75 ring-transparent focus:ring-transparent">
                    <div className="absolute inset-y-0 left-0 ml-5 flex items-center">
                        <SearchIcon className="h-4 w-5 fill-current sm:h-5 sm:w-5" />
                    </div>
                    <div className="mx-8 flex items-center space-x-2 truncate border-transparent py-1 text-gray-475 ring-transparent focus:border-transparent focus:ring-transparent">
                        {!isEmpty(input) ? (
                            <div className="flex">
                                {!isEmpty(field) && (
                                    <span className="truncate rounded-md border-primary-200 bg-primary-200 bg-opacity-10 px-2 text-gray-475">
                                        {field.name}
                                    </span>
                                )}
                                <span className="truncate">{input}</span>
                            </div>
                        ) : (
                            <span className="text-gray-475 text-opacity-75">{t("common.search")}</span>
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
                <Popover.Panel
                    as="div"
                    className="absolute top-[0.3rem] z-20 -ml-2 w-80 overflow-hidden rounded-xl bg-white shadow-preview lg:max-w-3xl">
                    <div className="relative flex flex-1 border-b-default border-gray-100 border-opacity-25 bg-white px-4 py-2">
                        <div className="mx-1 flex items-center">
                            <SearchIcon className="fill-current" width="1rem" height="1rem" />
                        </div>
                        <div className="flex w-full">
                            {!isEmpty(field) && (
                                <span className="flex-start mx-1 rounded-md border-primary-200 bg-primary-200 bg-opacity-10 px-2 text-13 text-gray-475">
                                    {field.name}
                                </span>
                            )}
                            <Input
                                className={`flex-start w-full border-transparent text-13 font-normal text-gray-475 text-opacity-75 outline-none ring-transparent focus:border-transparent focus:ring-transparent`}
                                placeholder={placeholder}
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
                            <button className="border-l-default border-gray-100 border-opacity-25 pl-3" onClick={() => close()}>
                                <CloseIcon
                                    width="5"
                                    height="5"
                                    fillOpacity="0.25"
                                    className="mt-1 h-3 w-3 fill-current text-gray-475 text-opacity-25 sm:h-4 sm:w-4"
                                />
                            </button>
                        </div>
                    </div>
                    <div
                        className={`mx-2 space-y-2 px-3 text-13 font-normal text-gray-475 ${
                            input.length > 0 && input.length <= mnLength ? "pb-4" : "pt-3 pb-4"
                        }`}>
                        {input.length > 0 && input.length <= mnLength && (
                            <span className="mt-1 flex justify-end text-10 italic text-red-675">*{t("Ingresar mas de 2 caracteres")}</span>
                        )}
                        <div className="mb-2 flex flex-wrap">
                            {typeSearchBy.map((btn) => {
                                return (
                                    <button
                                        className={`my-auto mt-1 mr-2 flex rounded-lg border-default border-primary-200 border-opacity-50 py-1 px-2 font-semibold text-gray-475 hover:bg-primary-200 hover:bg-opacity-10 ${
                                            !isEmpty(field) && field.id === btn.id ? "bg-primary-200 bg-opacity-10" : "bg-white"
                                        }`}
                                        onClick={() => setTypeSearchBy(btn)}>
                                        {get(btn, "icon") && <span className="mr-1">{btn.icon}</span>}
                                        {btn.name}
                                    </button>
                                );
                            })}
                        </div>
                        <span className="flex text-gray-475 text-opacity-75">{t("globalSearch.recentSearches")}: </span>
                        <div className="space-y-1">
                            {recents &&
                                recents.length > 0 &&
                                recents.map(
                                    (search, key) =>
                                        key < 3 && (
                                            <button
                                                key={key}
                                                className="flex w-full items-center space-x-2 truncate rounded-md px-2 py-2 hover:bg-gray-400 hover:bg-opacity-10"
                                                onClick={() => findRecentSearch(search)}>
                                                <TimeIcon width="0.75rem" height="0.75rem" className="fill-current" />
                                                {!isEmpty(search.field) && (
                                                    <span className="rounded-md bg-gray-400 bg-opacity-10 p-1 px-2 text-opacity-75">
                                                        {`${t(get(search, "field.name"))}`}
                                                    </span>
                                                )}
                                                <span className="truncate">{get(search, "query")}</span>
                                            </button>
                                        )
                                )}
                        </div>
                    </div>
                    <Popover.Overlay as="div">
                        <button
                            className={`flex h-[2.625rem] w-full items-center px-5 ${
                                input.length > 0 && input.length <= mnLength ? "cursor-not-allowed bg-gray-10" : "cursor-pointer bg-primary-600 "
                            }`}
                            disabled={input > 0 && input.length <= mnLength}
                            onClick={handleSearch}>
                            {isEmpty(input) ? (
                                <span className="flex w-full flex-row justify-center space-x-3 font-bold text-primary-200">
                                    {t("globalSearch.search")}
                                </span>
                            ) : (
                                <div className="flex w-full items-center justify-between">
                                    <span
                                        className={`mr-2 flex items-center truncate text-sm ${
                                            input.length <= mnLength ? "text-gray-475" : "text-primary-200"
                                        }`}>
                                        <span className="flex h-5 w-full flex-1 items-center justify-center">
                                            <SearchIcon
                                                className="mt-px mr-1 fill-current text-sm text-primary-200"
                                                width="0.8125rem"
                                                height="0.8125rem"
                                                fill={input.length <= mnLength ? "#727C94" : "#00B3C7"}
                                            />
                                        </span>
                                        {t("Todos los resultados para")} <span className="max-w-xxs truncate font-bold italic">"{input}"</span>
                                    </span>
                                    <span
                                        className={`text-sm italic ${
                                            input.length > 0 && input.length <= mnLength ? "text-gray-475" : "text-primary-200"
                                        }`}>
                                        {t("[ENTER]")}
                                    </span>
                                </div>
                            )}
                        </button>
                    </Popover.Overlay>
                </Popover.Panel>
            </Transition>
        </Popover>
    );
};

export default GlobalSearchPMA;
