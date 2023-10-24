import fileDownload from "js-file-download";
import get from "lodash/get";
import { useState } from "react";
import { useSelector } from "react-redux";

import { downloadProduct, getAllProducts } from "../services/products";
import { parserObjFilter } from "../utils/parsers";

export function useProducts() {
    const [limit, setLimit] = useState(10);
    const [optionsFilters, setOptFilters] = useState({});
    const [page, setPage] = useState(1);
    const [loadingdownload, setLoadingdownload] = useState(false);

    const company = useSelector((state) => state.company);

    const getProducts = async () => {
        const app_id = get(company, "properties.shopCredentials.jelou_ecommerce.app_id", null);

        const parseredOptionsFilters = parserObjFilter(optionsFilters);
        return getAllProducts({ app_id, limit, page, optionsFilters: parseredOptionsFilters });
    };

    const downloadDataProduct = async ({ download = false } = {}) => {
        const app_id = get(company, "properties.shopCredentials.jelou_ecommerce.app_id", null);
        if (!app_id) return;
        setLoadingdownload(true);

        const parseredOptionsFilters = parserObjFilter(optionsFilters);
        downloadProduct({ app_id, optionsFilters: parseredOptionsFilters, download, limit, page })
            .then((data) => fileDownload(data, "product_report", data.type))
            .finally(() => setLoadingdownload(false));
    };

    const setOptionsFilters = (options) => {
        setPage(1);
        setOptFilters(options);
    };

    return {
        downloadDataProduct,
        getProducts,
        limit,
        loadingdownload,
        optionsFilters,
        page,
        setLimit,
        setOptionsFilters,
        setPage,
    };
}
