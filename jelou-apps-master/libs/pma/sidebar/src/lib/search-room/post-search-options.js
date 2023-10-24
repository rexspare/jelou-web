import Tippy from "@tippyjs/react";
import { Transition } from "@headlessui/react";
import { withTranslation } from "react-i18next";
import React, { useState, useRef, useEffect } from "react";

import { SortedIcon, GroupIcon } from "@apps/shared/icons";
import { useOnClickOutside } from "@apps/shared/hooks";

const PostSearchOptions = (props) => {
    const { sortOrder, groupPost, setGroupPost, showSortOptions, setShowSortOptions, setOrder, t } = props;
    const dropdownRef = useRef();
    const [showAscOptions, setShowAscOptions] = useState(false);

    useOnClickOutside(dropdownRef, () => {
        setShowAscOptions(false);
        setShowSortOptions(false);
    });

    const showOrder = () => {
        setShowAscOptions(!showAscOptions);
        setShowSortOptions(!showSortOptions);
    };

    const showFilter = () => {
        setGroupPost(!groupPost);
        setShowAscOptions(false);
    };

    useEffect(() => {
        setGroupPost(true);
    }, []);

    return (
        <div className="flex space-x-2 pl-2">
            <div className="relative z-50 flex">
                <Tippy content={t("pma.Ordenar Por")} touch={false}>
                    <button className="border-transparent focus:outline-none" onClick={showOrder} ref={dropdownRef}>
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
                            sortOrder === "asc_message" ? "text-primary-200" : "text-gray-400"
                        } border-b-default border-gray-400 border-opacity-25 px-2 py-3 text-center text-xs font-bold hover:bg-gray-light focus:outline-none`}
                        onClick={() => {
                            setOrder("asc_message");
                            setShowSortOptions(false);
                        }}>
                        {t("pma.Mensaje más reciente")}
                    </button>
                    <button
                        className={`${
                            sortOrder === "desc_message" ? "text-primary-200" : "text-gray-400"
                        } border-b-default border-gray-400 border-opacity-25 px-2 py-3 text-center text-xs font-bold hover:bg-gray-light focus:outline-none`}
                        onClick={() => {
                            setOrder("desc_message");
                            setShowSortOptions(false);
                        }}>
                        {t("pma.Mensaje más antiguo")}
                    </button>
                    <button
                        className={`${
                            sortOrder === "asc_post" ? "text-primary-200" : "text-gray-400"
                        } border-b-default border-gray-400 border-opacity-25 px-2 py-3 text-center text-xs font-bold hover:bg-gray-light focus:outline-none`}
                        onClick={() => {
                            setOrder("asc_post");
                            setShowSortOptions(false);
                        }}>
                        {t("pma.Publicación más reciente")}
                    </button>
                    <button
                        className={`${
                            sortOrder === "desc_post" ? "text-primary-200" : "text-gray-400"
                        } px-2 py-3 text-center text-xs font-bold hover:bg-gray-light focus:outline-none`}
                        onClick={() => {
                            setOrder("desc_post");
                            setShowSortOptions(false);
                        }}>
                        {t("pma.Publicación más antigua")}
                    </button>
                </Transition>
            </div>
            <div className="flex ">
                <Tippy content={t("pma.Agrupar")} touch={false}>
                    <button className="border-transparent focus:outline-none" onClick={showFilter}>
                        <GroupIcon
                            width="20"
                            height="19"
                            className={`fill-current ${groupPost ? "text-primary-200" : "text-gray-100"}`}
                            fillOpacity={`${groupPost ? "" : "0.5"}`}
                        />
                    </button>
                </Tippy>
            </div>
        </div>
    );
};

export default withTranslation()(PostSearchOptions);
