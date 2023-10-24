import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import get from "lodash/get";

import { categoriesData } from "../services/categories";
import { renderMessage } from "@apps/shared/common";
import { parserObjFilter } from "../utils/parsers";
import { MESSAGE_TYPES } from "@apps/shared/constants";

export function useCategoriesData() {
    const [categoryList, setCategoryList] = useState([]);
    const [dataForPage, setDataForPage] = useState({});
    const [limitForPage, setLimitForPage] = useState(10);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [searchInputValue, setSelectedCategories] = useState("");

    const company = useSelector((state) => state.company);

    useEffect(() => {
        const { app_id = null } = get(company, "properties.shopCredentials.jelou_ecommerce", {});
        if (!app_id) return;

        const optionSearch = parserObjFilter(searchInputValue);

        getCategoriesData({ jelou_ecommerce_app_id: app_id, limitForPage, optionSearch, page }).catch((error) =>
            renderMessage(String(error), MESSAGE_TYPES.ERROR)
        );
    }, [company, searchInputValue, page, limitForPage]);

    const getCategoriesData = useCallback(async ({ jelou_ecommerce_app_id = null, limitForPage = null, optionSearch = null, page = null } = {}) => {
        if (!jelou_ecommerce_app_id || !limitForPage || !optionSearch || !page) {
            console.error(" the shop credentials  of Jelou Ecommerce is required", { jelou_ecommerce_app_id, limitForPage, optionSearch, page });
            throw new Error("the shop credentials  of Jelou Ecommerce is required");
        }

        categoriesData({ jelou_ecommerce_app_id, limitForPage, optionSearch, page })
            .then(({ categoryList, dataForPage }) => {
                setDataForPage(dataForPage);
                setCategoryList(categoryList);
            })
            .catch((error) => {
                setCategoryList([]);
                setDataForPage({});
                renderMessage(String(error), MESSAGE_TYPES.ERROR);
                console.error("useCategoriesData ~ getCategoriesData ~ error", { error });
            })
            .finally(() => setLoading(false));
    }, []);

    return {
        setCategoryList,
        categoryList,
        dataForPage,
        loading,
        setLimitForPage,
        setPage,
        setSelectedCategories,
    };
}
