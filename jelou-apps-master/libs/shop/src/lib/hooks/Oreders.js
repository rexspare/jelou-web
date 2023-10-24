import { useState } from "react";
import { useSelector } from "react-redux";
import fileDownload from "js-file-download";
import get from "lodash/get";

import { parserObjFilter } from "../utils/parsers";
import { getAllOrders, downloadOrder } from "../services/order";

export function useOrders() {
    const [page, setPage] = useState(1);
    const [loadingdownload, setLoadingdownload] = useState(false);
    const [limit, setLimit] = useState(10);
    const [paramsFilters, setParamsFilters] = useState({});

    const company = useSelector((state) => state.company);

    /**
     * get all orders and states
     * @returns {Promise<{meta: object, orders: object[]}>}
     */
    const getOrders = async () => {
        const jelou_pay = get(company, "properties.shopCredentials.jelou_pay", null);

        if (!jelou_pay) return [];
        const { app_id, bearer_token } = jelou_pay;

        const optionsFilters = parserObjFilter(paramsFilters);

        return getAllOrders(app_id, bearer_token, page, limit, optionsFilters);
    };

    const getInitialOrders = async () => {
        setPage(1);
        setParamsFilters({});
    };

    const downloadDataOrders = async ({ download = false }) => {
        const optionsFilters = parserObjFilter(paramsFilters);
        const jelou_pay = get(company, "properties.shopCredentials.jelou_pay", null);

        if (!jelou_pay) return;
        const { app_id, bearer_token } = jelou_pay;

        setLoadingdownload(true);

        return downloadOrder({ app_id, bearer_token, page, limit, optionsFilters, download })
            .then((data) => {
                fileDownload(data, "orders_report", data.type);
            })
            .finally(() => setLoadingdownload(false));
    };

    return {
        page,
        setPage,
        downloadDataOrders,
        getInitialOrders,
        getOrders,
        loadingdownload,
        limit,
        paramsFilters,
        setParamsFilters,
        setLimit,
    };
}
