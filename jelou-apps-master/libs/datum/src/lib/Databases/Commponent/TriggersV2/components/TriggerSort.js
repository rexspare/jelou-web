import Tippy from "@tippyjs/react";
import { SortIcon } from "@apps/shared/icons";
import { useTranslation } from "react-i18next";
import { TRIGGER_SORT_ORDERS } from "../constants";
import { Menu , Transition} from '@headlessui/react';

const TriggerSort = ({ sortOrder, setOrder }) => {

    const { t } = useTranslation();
    const isSorted = sortOrder ? "#00B3C7" : "rgba(166, 180, 208, 0.60)"

    return (
        <Menu as="div" className="mx-4">
            <Menu.Button as="button" className="h-9 w-7">
                <Tippy content={t("clients.orderBy")} touch={false}>
                    <div className="cursor-pointer border-transparent focus:outline-none">
                        <SortIcon width={25} height={25} fill={isSorted}/>
                    </div>
                </Tippy>
            </Menu.Button>
            <Transition
                as="section"
                leaveTo="opacity-0"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leaveFrom="opacity-100"
                enter="transition-opacity duration-75"
                leave="transition-opacity duration-150"
                className="absolute right-0 z-50 flex w-44 flex-col overflow-hidden rounded-lg bg-white shadow-normal"
            >
                <button
                    className={`${
                        sortOrder === TRIGGER_SORT_ORDERS.ASC_NAME ? "text-primary-200 " : "text-gray-400"
                    }  border-b-default border-gray-400 border-opacity-25 px-2 py-3 text-left text-xs font-bold hover:bg-gray-light focus:outline-none`}
                    onClick={() => {
                        setOrder(TRIGGER_SORT_ORDERS.ASC_NAME);
                    }}
                >
                    A-Z
                </button>
                <button
                    className={`${
                        sortOrder === TRIGGER_SORT_ORDERS.DESC_NAME ? "text-primary-200 " : "text-gray-400"
                    } focus:outline-non border-b-default border-gray-400 border-opacity-25 px-2 py-3 text-left text-xs font-bold hover:bg-gray-light`}
                    onClick={() => {
                        setOrder(TRIGGER_SORT_ORDERS.DESC_NAME);
                    }}
                >
                    Z-A
                </button>
                <button
                    className={`${
                        sortOrder === TRIGGER_SORT_ORDERS.ASC_DATE ? "text-primary-200 " : "text-gray-400"
                    } focus:outline-non border-b-default border-gray-400 border-opacity-25 px-2 py-3 text-left text-xs font-bold hover:bg-gray-light`}
                    onClick={() => {
                        setOrder(TRIGGER_SORT_ORDERS.ASC_DATE);
                    }}
                >
                    {t("datum.triggers.recentTime")}
                </button>
                <button
                    className={`${
                        sortOrder === TRIGGER_SORT_ORDERS.DESC_DATE ? "text-primary-200 " : "text-gray-400"
                    } px-2 py-3 text-left text-xs font-bold hover:bg-gray-light focus:outline-none`}
                    onClick={() => {
                        setOrder(TRIGGER_SORT_ORDERS.DESC_DATE);
                    }}
                >
                    {t("datum.triggers.oldestTime")}
                </button>
            </Transition>
        </Menu>
    )
}

export default TriggerSort