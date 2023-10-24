import Tippy from "@tippyjs/react";
import { Transition } from "@headlessui/react";
import { useTranslation } from "react-i18next";
import React, { useState, useRef, useEffect } from "react";

import { SortedIcon } from "@apps/shared/icons";
import { useOnClickOutside } from "@apps/shared/hooks";

const SortedOptions = (props) => {
    const { sortOrder, setSortOrder, showSortOptions, setShowSortOptions } = props;
    const [showAscOptions, setShowAscOptions] = useState(false);
    const dropdownRef = useRef();
    const { t } = useTranslation();

    useOnClickOutside(dropdownRef, () => {
        setShowAscOptions(false);
        setShowSortOptions(false);
    });

    useEffect(() => {
        setSortOrder(-1);
        setShowSortOptions(false);
    }, []);

    const setOrder = (order) => {
        setSortOrder(order);
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
                        <SortedIcon width="24" height="17" className={`fill-current ${showSortOptions ? "text-primary-200" : "text-gray-400"}`} />
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
                    className="absolute right-0 z-50 mt-8 flex w-44 flex-col overflow-hidden rounded-lg bg-white shadow-normal"
                >
                    <button
                        className={`${
                            sortOrder === -1 ? "text-primary-200 " : "text-gray-400"
                        } focus:outline-non border-b-default border-gray-400 border-opacity-25 px-2 py-3 text-left text-xs font-bold hover:bg-gray-light`}
                        onClick={() => {
                            setOrder(-1);
                            // setOrder("desc_note");
                        }}
                    >
                        {t("pma.Nota más reciente")}
                    </button>
                    <button
                        className={`${
                            sortOrder === 1 ? "text-primary-200 " : "text-gray-400"
                        }  border-b-default border-gray-400 border-opacity-25 px-2 py-3 text-left text-xs font-bold hover:bg-gray-light focus:outline-none`}
                        onClick={() => {
                            setOrder(1);
                            // setOrder("asc_note");
                        }}
                    >
                        {t("pma.Nota más antigua")}
                    </button>
                </Transition>
            </div>
        </div>
    );
};

export default SortedOptions;
