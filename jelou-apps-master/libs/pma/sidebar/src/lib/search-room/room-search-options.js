import get from "lodash/get";
import Tippy from "@tippyjs/react";
import { Transition } from "@headlessui/react";
import { withTranslation } from "react-i18next";
import React, { useState, useRef, useEffect } from "react";

import { SortedIcon } from "@apps/shared/icons";
import { useOnClickOutside } from "@apps/shared/hooks";

const RoomSearchOptions = (props) => {
    const { sortOrder, setSortOrder, showSortOptions, setShowSortOptions, t } = props;
    const [showAscOptions, setShowAscOptions] = useState(false);
    const dropdownRef = useRef();
    useOnClickOutside(dropdownRef, () => {
        setShowAscOptions(false);
        setShowSortOptions(false);
    });

    useEffect(() => {
        setSortOrder(get(localStorage, "sortOrderRoom", "desc_chat"));
        setShowSortOptions(false);
    }, []);

    const setOrder = (order) => {
        setSortOrder(order);
        localStorage.setItem("sortOrderRoom", order);
    };

    const showOrder = () => {
        setShowAscOptions(!showAscOptions);
        setShowSortOptions(!showSortOptions);
    };

    const preventFocus = (e) => {
        e.preventDefault();
        return false;
    };

    return (
        <div className="space-x-2 pl-2 mid:flex">
            <div className="relative flex">
                <Tippy content={t("pma.Ordenar Por")} touch={false}>
                    <button className="border-transparent focus:outline-none" onClick={showOrder} ref={dropdownRef} onMouseDown={preventFocus}>
                        <SortedIcon
                            width="24"
                            height="17"
                            className={`fill-current ${showSortOptions ? "text-primary-200" : "text-gray-100"}`}
                            fillOpacity={`${showSortOptions ? "" : "0.5"}`}
                        />
                    </button>
                </Tippy>
                <Transition
                    show={showAscOptions}
                    as={"div"}
                    enter="transition-opacity duration-75"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="transition-opacity duration-150"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                    className="absolute right-0 z-50 mt-8 flex w-44 flex-col overflow-hidden rounded-lg bg-white shadow-normal">
                    <button
                        className={`${
                            sortOrder === "asc_message" ? "text-primary-200 " : "text-gray-400"
                        }  border-b-default border-gray-400 border-opacity-25 px-2 py-3 text-left text-xs font-bold hover:bg-gray-light focus:outline-none`}
                        onClick={() => {
                            setOrder("asc_message");
                        }}>
                        {t("pma.Mensaje más reciente")}
                    </button>
                    <button
                        className={`${
                            sortOrder === "desc_message" ? "text-primary-200 " : "text-gray-400"
                        } focus:outline-non border-b-default border-gray-400 border-opacity-25 px-2 py-3 text-left text-xs font-bold hover:bg-gray-light`}
                        onClick={() => {
                            setOrder("desc_message");
                        }}>
                        {t("pma.Mensaje más antiguo")}
                    </button>
                    <button
                        className={`${
                            sortOrder === "asc_chat" ? "text-primary-200 " : "text-gray-400"
                        } focus:outline-non border-b-default border-gray-400 border-opacity-25 px-2 py-3 text-left text-xs font-bold hover:bg-gray-light`}
                        onClick={() => {
                            setOrder("asc_chat");
                        }}>
                        {t("pma.Chat más reciente")}
                    </button>
                    <button
                        className={`${
                            sortOrder === "desc_chat" ? "text-primary-200 " : "text-gray-400"
                        } px-2 py-3 text-left text-xs font-bold hover:bg-gray-light focus:outline-none`}
                        onClick={() => {
                            setOrder("desc_chat");
                        }}>
                        {t("pma.Chat más antiguo")}
                    </button>
                </Transition>
            </div>
        </div>
    );
};

export default withTranslation()(RoomSearchOptions);
