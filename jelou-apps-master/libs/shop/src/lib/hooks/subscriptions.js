import get from "lodash/get";
import { useSelector } from "react-redux";
import { useCallback, useEffect, useState } from "react";

import { parserObjFilter } from "../utils/parsers";
import { renderMessage } from "@apps/shared/common";
import { MESSAGE_TYPES } from "@apps/shared/constants";
import { getSubscriptions } from "../services/subscriptions";

export function useSubscriptions() {
    
    const [loading, setLoading] = useState(true);
    const [subscriptionsList, setSubscriptionsList] = useState([]);
    
    const [page, setPage] = useState(1);
    const [dataForPage, setDataForPage] = useState({});
    const [limitForPage, setLimitForPage] = useState(10);

    const [searchInputValue, setSelectedSubscriptions] = useState("");

    const company = useSelector((state) => state.company);

    useEffect(() => {
        const { app_id = null, bearer_token = null } = get(company, "properties.shopCredentials.jelou_pay", {});
        if (!app_id || !bearer_token) return;

        const optionSearch = parserObjFilter(searchInputValue);

        getSubscriptionsData({ jelou_ecommerce_app_id: app_id, bearer_token, limitForPage, optionSearch, page }).catch((error) =>
            renderMessage(String(error), MESSAGE_TYPES.ERROR)
        );
    }, [company, searchInputValue, page, limitForPage]);

    const getSubscriptionsData = useCallback(async ({ jelou_ecommerce_app_id = null, bearer_token = null, limitForPage = null, optionSearch = null, page = null } = {}) => {
        if (!jelou_ecommerce_app_id || !limitForPage || !optionSearch || !page) {
            console.error(" the shop credentials of Jelou Ecommerce is required", { jelou_ecommerce_app_id, limitForPage, optionSearch, page });
            throw new Error("the shop credentials of Jelou Ecommerce is required");
        }

        getSubscriptions({ jelou_ecommerce_app_id, bearer_token, limitForPage, optionSearch, page })
            .then(({ subscriptionsList, dataForPage }) => {
                setDataForPage(dataForPage);
                setSubscriptionsList(subscriptionsList);
            })
            .catch((error) => {
                setDataForPage({});
                setSubscriptionsList([]);
                renderMessage(String(error), MESSAGE_TYPES.ERROR);
                console.error("useSubscriptions ~ getSubscriptionsData ~ error", { error });
            })
            .finally(() => setLoading(false));
    }, []);

    return {
        loading,
        setPage,
        dataForPage,
        setLimitForPage,
        subscriptionsList,
        setSubscriptionsList,
        setSelectedSubscriptions,
    };
}
