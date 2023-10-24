import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { DebounceInput } from "react-debounce-input";
import { TRIGGER_VIEW, DEBOUNCE_STYLE, TRIGGER_SORT_ORDERS } from "../constants";

import sortBy from "lodash/sortBy";
import reverse from "lodash/reverse";

import { useSearchData } from '../../../../Hooks/searchData';

import { SearchIcon } from "@apps/shared/icons";
import TriggerCard from "../components/TriggerCard";
import TriggerSort from "../components/TriggerSort";

const TriggersView = ({ setTriggersView, webhooks, refetchWebhooks, companyId }) => {
    const { t } = useTranslation();
    const [triggerSortOrder, setTriggerSortOrder] = useState(null);
    
    const { handleSearch, searchData: searchWebhooks } = useSearchData({
        dataForSearch: webhooks,
        keysForSearch: ["name"],
    });
    
    const [orderedWebhooks, setOrderedWebhooks] = useState(searchWebhooks);

    useEffect(() => {
        setOrderedWebhooks(searchWebhooks);
    }, [searchWebhooks]);
    
    useEffect(() => {
        if (triggerSortOrder === TRIGGER_SORT_ORDERS.ASC_NAME) {
            setOrderedWebhooks(sortBy(searchWebhooks, ["name"]));
        }
        if (triggerSortOrder === TRIGGER_SORT_ORDERS.DESC_NAME) {
            setOrderedWebhooks(reverse(sortBy(searchWebhooks, ["name"])));
        }
        if (triggerSortOrder === TRIGGER_SORT_ORDERS.ASC_DATE) {
            setOrderedWebhooks(reverse(sortBy(searchWebhooks, ["createdAt"])));
        }
        if (triggerSortOrder === TRIGGER_SORT_ORDERS.DESC_DATE) {
            setOrderedWebhooks(sortBy(searchWebhooks, ["createdAt"]));
        }
    }, [triggerSortOrder]);
    
    return (
        <div className="flex flex-col gap-3 px-8 pt-4 w-full">
            <div className="flex justify-between mt-4">
                <button
                    onClick={() => setTriggersView(TRIGGER_VIEW.CREATE_TRIGGER)}
                    className="flex h-6 mr-64 cursor-pointer items-center space-x-2 whitespace-nowrap rounded-lg border-transparent bg-[#00B3C7] py-6 px-10 text-lg text-white outline-none mid:px-5">
                    <span className="hidden mid:flex">{t("datum.triggers.addTriggerBtn")}</span>
                </button>
                <div className="relative flex flex-1 items-center bg-white">
                    <div className="absolute left-2">
                        <SearchIcon width="0.9375rem" height="0.9375rem" />
                    </div>
                    <DebounceInput
                        minLength={2}
                        autoFocus={true}
                        debounceTimeout={500}
                        style={DEBOUNCE_STYLE}
                        onChange={handleSearch}
                        placeholder={`${t("datum.searchTriggers")}`}
                        className="flex-1 font-medium outline-none focus:ring-[#a6b4d0]"
                    />
                   <TriggerSort
                        sortOrder={triggerSortOrder}
                        setOrder={setTriggerSortOrder}
                   />
                </div>
            </div>
            <div className="flex justify-between flex-wrap gap-y-5 overflow-y-auto pr-2 pb-4 mt-4 ">
                {
                    orderedWebhooks && orderedWebhooks.map((webhook) => (
                        <TriggerCard
                            key={webhook.id} 
                            webhook={webhook} 
                            companyId={companyId}
                            refetchWebhooks={refetchWebhooks}
                            setTriggersView={setTriggersView} 
                        />
                    ))
                }
            </div>
        </div>
    );
};

export default TriggersView;
